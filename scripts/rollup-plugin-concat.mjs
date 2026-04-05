import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import MagicString, { Bundle } from 'magic-string';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const VIRTUAL_ENTRY_ID = 'concat-entry';

/**
 * Rollup plugin that concatenates a list of legacy (non-module) JS files
 * into a single bundle, preserving their execution order and providing
 * accurate source maps.
 *
 * @param {string[]} files - ordered file paths relative to project root
 */
export default function concatPlugin(files) {
  return {
    name: 'concat',

    resolveId(id) {
      if (id === 'concat-entry') return VIRTUAL_ENTRY_ID;
      return null;
    },

    load(id) {
      if (id !== VIRTUAL_ENTRY_ID) return null;

      const bundle = new Bundle();

      for (const relPath of files) {
        const absPath = join(ROOT, relPath);
        const code = readFileSync(absPath, 'utf-8');
        const s = new MagicString(code, { filename: relPath });
        bundle.addSource({
          filename: relPath,
          content: s,
          separator: '\n'
        });
      }

      const map = bundle.generateMap({
        file: 'bundle.js',
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
  };
}
