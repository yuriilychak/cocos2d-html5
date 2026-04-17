/**
 * Shared Rollup config for individual packages.
 *
 * Each package has a `files.mjs` listing source files in concatenation order.
 * This config reads that list, concatenates the files using MagicString,
 * and outputs a single non-minified bundle at dist/index.js.
 *
 * Usage (in each package.json): "build": "rollup -c ../../scripts/rollup.package.mjs"
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import MagicString, { Bundle } from 'magic-string';

const PKG_DIR = process.cwd();
const VIRTUAL_ENTRY_ID = 'concat-entry';

async function loadFileList() {
  const filesModule = await import(join(PKG_DIR, 'files.mjs'));
  return filesModule.default;
}

export default async () => {
  const files = await loadFileList();

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
};
