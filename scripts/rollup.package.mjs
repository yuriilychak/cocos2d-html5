/**
 * Shared Rollup config for individual packages.
 *
 * Supports two modes:
 * - Modern: If `src/index.js` exists, uses standard ES module resolution.
 *   Exports are stripped from the output to keep dist compatible with the
 *   app-level concat build.
 * - Legacy: Falls back to concatenating files listed in `files.mjs`.
 *
 * Usage (in each package.json): "build": "rollup -c ../../scripts/rollup.package.mjs"
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import MagicString, { Bundle } from 'magic-string';

const PKG_DIR = process.cwd();

function stripExportsPlugin() {
  return {
    name: 'strip-exports',
    renderChunk(code) {
      const s = new MagicString(code);
      const regex = /^export\s*\{[^}]*\}\s*;?/gm;
      let match;

      while ((match = regex.exec(code)) !== null) {
        s.remove(match.index, match.index + match[0].length);
      }

      if (s.hasChanged()) {
        return { code: s.toString(), map: s.generateMap({ hires: true }) };
      }

      return null;
    }
  };
}

function createModernConfig() {
  return {
    input: join(PKG_DIR, 'src', 'index.js'),
    treeshake: false,
    plugins: [stripExportsPlugin()],
    output: {
      file: 'dist/index.js',
      format: 'es',
      strict: false,
      sourcemap: true
    }
  };
}

async function createLegacyConfig() {
  const VIRTUAL_ENTRY_ID = 'concat-entry';
  const filesModule = await import(join(PKG_DIR, 'files.mjs'));
  const files = filesModule.default;

  return {
    input: VIRTUAL_ENTRY_ID,
    plugins: [
      {
        name: 'concat',
        resolveId(id) {
          if (id === VIRTUAL_ENTRY_ID) return VIRTUAL_ENTRY_ID;
          return null;
        },
        load(id) {
          if (id !== VIRTUAL_ENTRY_ID) return null;

          const bundle = new Bundle();

          for (const relPath of files) {
            const absPath = join(PKG_DIR, 'src', relPath);
            const code = readFileSync(absPath, 'utf-8');
            const s = new MagicString(code, { filename: relPath });
            bundle.addSource({
              filename: relPath,
              content: s,
              separator: '\n'
            });
          }

          const map = bundle.generateMap({
            file: 'index.js',
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
      }
    ],
    output: {
      file: 'dist/index.js',
      format: 'es',
      strict: false,
      sourcemap: true
    }
  };
}

export default async () => {
  if (existsSync(join(PKG_DIR, 'src', 'index.js'))) {
    return createModernConfig();
  }

  return createLegacyConfig();
};
