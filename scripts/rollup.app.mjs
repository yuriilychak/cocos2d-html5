/**
 * Shared Rollup config for apps (examples, template).
 *
 * Traverses workspace dependencies transitively, gathers all package
 * dist/index.js outputs in topological order, concatenates them,
 * and produces a single minified bundle.
 *
 * Usage: import { createAppConfig } from '../../scripts/rollup.app.mjs';
 *        export default createAppConfig({ outputFile: 'dist/cocos2d.min.js' });
 *
 * Also exposes createTestsBundleConfig for apps that ship a second bundle
 * (e.g. apps/examples) built from a real ES module entry (src/index.js).
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import MagicString, { Bundle } from 'magic-string';
import ts from 'typescript';

const VIRTUAL_ENTRY_ID = 'app-concat-entry';
const SOURCE_EXTENSIONS = ['.ts', '.js'];

function resolvePackageSource(rootDir, pkgName) {
  for (const ext of SOURCE_EXTENSIONS) {
    const srcFile = join(rootDir, 'packages', pkgName, 'src', `index${ext}`);
    if (existsSync(srcFile)) return srcFile;
  }
  return null;
}

function typescriptPlugin() {
  return {
    name: 'typescript-transpile',
    transform(code, id) {
      if (!id.endsWith('.ts')) {
        return null;
      }

      const result = ts.transpileModule(code, {
        fileName: id,
        compilerOptions: {
          target: ts.ScriptTarget.ES2019,
          module: ts.ModuleKind.ESNext,
          sourceMap: true,
          inlineSources: true
        },
        reportDiagnostics: true
      });

      const diagnostics = result.diagnostics?.filter(
        diagnostic => diagnostic.category === ts.DiagnosticCategory.Error
      );

      if (diagnostics?.length) {
        this.error(
          ts.formatDiagnosticsWithColorAndContext(diagnostics, {
            getCanonicalFileName: fileName => fileName,
            getCurrentDirectory: () => process.cwd(),
            getNewLine: () => '\n'
          })
        );
      }

      return {
        code: result.outputText,
        map: result.sourceMapText ? JSON.parse(result.sourceMapText) : null
      };
    }
  };
}

/**
 * Resolves all transitive workspace dependencies of a package,
 * returning them in topological (dependency-first) order.
 */
function resolveTransitiveDeps(pkgDir, rootDir) {
  const visited = new Set();
  const ordered = [];

  function visit(dir) {
    const realDir = dir;
    if (visited.has(realDir)) return;
    visited.add(realDir);

    const pkgJsonPath = join(realDir, 'package.json');
    if (!existsSync(pkgJsonPath)) return;

    const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
    const deps = pkg.dependencies || {};

    for (const [depName] of Object.entries(deps)) {
      // Resolve workspace dep: @aspect/foo → packages/foo
      const shortName = depName.replace(/^@aspect\//, '');
      const depDir = join(rootDir, 'packages', shortName);
      if (existsSync(depDir)) {
        visit(depDir);
      }
    }

    // Only add packages that have dist/index.js (skip meta-packages)
    const distFile = join(realDir, 'dist', 'index.js');
    if (existsSync(distFile)) {
      ordered.push(realDir);
    }
  }

  const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf-8'));
  const deps = pkg.dependencies || {};

  for (const [depName] of Object.entries(deps)) {
    const shortName = depName.replace(/^@aspect\//, '');
    const depDir = join(rootDir, 'packages', shortName);
    if (existsSync(depDir)) {
      visit(depDir);
    }
  }

  return ordered;
}

export function createAppConfig({ outputFile = 'dist/cocos2d.min.js' } = {}) {
  const appDir = process.cwd();
  const rootDir = join(appDir, '..', '..');

  return {
    input: VIRTUAL_ENTRY_ID,
    plugins: [
      {
        name: 'app-concat',
        resolveId(id) {
          if (id === VIRTUAL_ENTRY_ID) return VIRTUAL_ENTRY_ID;
          return null;
        },
        load(id) {
          if (id !== VIRTUAL_ENTRY_ID) return null;

          const packageDirs = resolveTransitiveDeps(appDir, rootDir);
          const bundle = new Bundle();

          for (const pkgDir of packageDirs) {
            const distFile = join(pkgDir, 'dist', 'index.js');
            const code = readFileSync(distFile, 'utf-8');
            const pkgName = JSON.parse(
              readFileSync(join(pkgDir, 'package.json'), 'utf-8')
            ).name;
            const s = new MagicString(code, { filename: pkgName });
            bundle.addSource({
              filename: pkgName,
              content: s,
              separator: '\n'
            });
          }

          const map = bundle.generateMap({
            file: outputFile,
            includeContent: true,
            hires: 'boundary'
          });

          return {
            code: bundle.toString(),
            map: {
              version: map.version,
              sources: map.sources,
              sourcesContent: map.sourcesContent,
              names: map.names,
              mappings: map.mappings
            }
          };
        }
      },
      terser({
        ecma: 5,
        module: false,
        compress: {
          dead_code: true,
          drop_console: false,
          passes: 2
        },
        mangle: {
          reserved: ['cc', 'gl', 'WebGLRenderingContext']
        },
        format: {
          comments: false
        }
      })
    ],
    output: {
      file: outputFile,
      format: 'es',
      strict: false,
      sourcemap: true
    }
  };
}

/**
 * Workspace packages that are resolved to their src/index.ts or src/index.js and inlined
 * in the test bundle instead of being treated as cc.* externals.
 * - 'core' is NOT in this set — it lives in the engine bundle as cc.* globals.
 */
const INLINE_PACKAGES_EXCLUDE = new Set(['core']);

/**
 * Maps @aspect/* package names to their runtime global variable.
 * Only valid where the exported symbol names exactly match the global's
 * property names (e.g. sp.SkeletonAnimation === exported SkeletonAnimation).
 * Packages with renamed globals (e.g. gui's GScrollView → cc.ScrollView)
 * must NOT be added here until they are fully migrated to consistent naming.
 */
const ASPECT_GLOBALS = {
  cocostudio: 'ccs'
};

/**
 * ES module bundle for app source (entry-based). Produces a single IIFE
 * minified bundle that depends on the engine bundle's globals.
 *
 * Supports direct `import { X } from "@aspect/pkg"` in source files:
 * - Meta-packages (no dist) are resolved to their src and inlined.
 * - All other @aspect/* packages (already in engine bundle) are treated as
 *   externals mapped to their runtime global (ccs, cc).
 *
 * Use this for apps that have migrated to a real ES module entry
 * (typically `src/index.js` or `src/index.ts`).
 */
export function createTestsBundleConfig({
  input = 'src/index.js',
  outputFile = 'dist/tests.min.js',
  minify = true,
} = {}) {
  const appDir = process.cwd();
  const rootDir = join(appDir, '..', '..');

  return {
    input,
    plugins: [
      {
        name: 'aspect-workspace-resolver',
        resolveId(id) {
          if (!id.startsWith('@aspect/')) return null;
          const pkgName = id.replace('@aspect/', '');

          // Only core stays as engine-bundle external; everything else is inlined.
          if (INLINE_PACKAGES_EXCLUDE.has(pkgName)) {
            return { id, external: true };
          }

          // All other @aspect/* packages: inline from src/index.ts or src/index.js.
          // Rollup deduplicates, so shared deps are included only once.
          const srcFile = resolvePackageSource(rootDir, pkgName);
          if (srcFile) return srcFile;

          return { id, external: true };
        }
      },
      resolve({ extensions: SOURCE_EXTENSIONS }),
      typescriptPlugin(),
      commonjs(),
      ...(minify ? [terser({
        ecma: 2020,
        module: false,
        compress: {
          dead_code: true,
          drop_console: false,
          passes: 2
        },
        mangle: {
          reserved: ['cc', 'gl', 'WebGLRenderingContext']
        },
        format: {
          comments: false
        }
      })] : [])
    ],
    output: {
      file: outputFile,
      format: 'iife',
      strict: false,
      sourcemap: true,
      inlineDynamicImports: true,
      globals(id) {
        if (!id.startsWith('@aspect/')) return undefined;
        const pkgName = id.replace('@aspect/', '');
        // Only core and spine are externals; everything else is inlined.
        if (pkgName === 'core') return 'cc';
        return ASPECT_GLOBALS[pkgName] ?? 'cc';
      }
    }
  };
}

/**
 * Standalone ES module bundle for an app entry point.
 * Resolves all @aspect/* imports directly from package source files,
 * producing a single self-contained IIFE with no runtime cc global dependency.
 *
 * Use this for apps (e.g. template) that import from @aspect/* and should
 * bundle everything in one file without relying on a pre-built engine bundle.
 */
export function createStandaloneConfig({
  input = 'src/index.js',
  outputFile = 'dist/app.min.js'
} = {}) {
  const appDir = process.cwd();
  const rootDir = join(appDir, '..', '..');

  return {
    input,
    treeshake: false,
    plugins: [
      {
        name: 'aspect-src-resolver',
        resolveId(id) {
          if (!id.startsWith('@aspect/')) return null;
          const pkgName = id.replace('@aspect/', '');
          const srcFile = resolvePackageSource(rootDir, pkgName);
          if (srcFile) return srcFile;
          throw new Error(
            `[aspect-src-resolver] No src/index.ts or src/index.js found for "${id}". ` +
            `Meta-packages cannot be imported directly in standalone mode.`
          );
        }
      },
      resolve({ extensions: SOURCE_EXTENSIONS }),
      typescriptPlugin(),
      terser({
        ecma: 2020,
        module: false,
        compress: {
          dead_code: true,
          drop_console: false,
          passes: 2
        },
        mangle: {
          reserved: ['cc', 'gl', 'WebGLRenderingContext']
        },
        format: {
          comments: false
        }
      })
    ],
    output: {
      file: outputFile,
      format: 'iife',
      name: 'App',
      strict: false,
      sourcemap: true,
      inlineDynamicImports: true
    }
  };
}
