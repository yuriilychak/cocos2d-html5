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
 * Also exposes createTestsConcatConfig for apps that want to ship a second
 * bundle (e.g. apps/examples) by concatenating their own source files in a
 * fixed order (mirrors the legacy package "files.mjs" pattern).
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import terser from '@rollup/plugin-terser';
import MagicString, { Bundle } from 'magic-string';

const VIRTUAL_ENTRY_ID = 'app-concat-entry';

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
 * Concatenates app source files in a fixed order (from a files.mjs export)
 * and produces a single minified bundle. Strips `export {...}` statements and
 * `import ... from "@aspect/*"` lines on the way out so individual files can
 * progressively migrate to ES module syntax without breaking script-scope
 * variable resolution within the bundle.
 *
 * The bundle is loaded as a regular <script> after the engine bundle and
 * therefore relies on the engine's `cc.*` globals.
 */
export function createTestsConcatConfig({
  filesModulePath,
  outputFile = 'dist/tests.min.js'
} = {}) {
  const VIRTUAL_ENTRY_ID = 'tests-concat-entry';
  const appDir = process.cwd();

  return {
    input: VIRTUAL_ENTRY_ID,
    plugins: [
      {
        name: 'tests-concat',
        resolveId(id) {
          if (id === VIRTUAL_ENTRY_ID) return VIRTUAL_ENTRY_ID;
          return null;
        },
        async load(id) {
          if (id !== VIRTUAL_ENTRY_ID) return null;

          const absFilesModule = join(appDir, filesModulePath);
          // Cache-bust the dynamic import so file list edits are picked up.
          const mod = await import(`${absFilesModule}?t=${Date.now()}`);
          const files = mod.default;
          this.addWatchFile(absFilesModule);

          const bundle = new Bundle();
          for (const relPath of files) {
            const absPath = join(appDir, relPath);
            this.addWatchFile(absPath);
            const code = readFileSync(absPath, 'utf-8');
            const s = new MagicString(code, { filename: relPath });
            bundle.addSource({
              filename: relPath,
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
      // Strip ES module syntax that would otherwise be invalid in a plain
      // <script> bundle. Files migrated to ES modules can `export { X }` and
      // `import { Y } from "@aspect/core"` — those lines are removed here,
      // leaving the symbol references to resolve against script-scope vars
      // declared by earlier concatenated files (or by the engine bundle).
      {
        name: 'tests-strip-module-syntax',
        renderChunk(code) {
          const s = new MagicString(code);
          const exportRe = /^[ \t]*export\s*\{[^}]*\}\s*;?[ \t]*\n?/gm;
          const exportDeclRe = /^([ \t]*)export\s+(?=(class|function|var|let|const|async|default))/gm;
          const importRe = /^[ \t]*import\s+(?:[\s\S]*?from\s+)?['"]@aspect\/[^'"]+['"]\s*;?[ \t]*\n?/gm;
          const sideEffectImportRe = /^[ \t]*import\s+['"][^'"]+['"]\s*;?[ \t]*\n?/gm;

          let m;
          while ((m = exportRe.exec(code)) !== null) {
            s.remove(m.index, m.index + m[0].length);
          }
          // `export class Foo {}` -> `class Foo {}` (preserve indent)
          while ((m = exportDeclRe.exec(code)) !== null) {
            s.remove(m.index + m[1].length, m.index + m[0].length);
          }
          while ((m = importRe.exec(code)) !== null) {
            s.remove(m.index, m.index + m[0].length);
          }
          while ((m = sideEffectImportRe.exec(code)) !== null) {
            s.remove(m.index, m.index + m[0].length);
          }

          if (s.hasChanged()) {
            return { code: s.toString(), map: s.generateMap({ hires: true }) };
          }
          return null;
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
