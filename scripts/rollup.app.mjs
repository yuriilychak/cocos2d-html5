/**
 * Shared Rollup config for apps (examples, template).
 *
 * Traverses workspace dependencies transitively, gathers all package
 * dist/index.js outputs in topological order, concatenates them,
 * and produces a single minified bundle.
 *
 * Usage: import { createAppConfig } from '../../scripts/rollup.app.mjs';
 *        export default createAppConfig({ outputFile: 'dist/cocos2d.min.js' });
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
