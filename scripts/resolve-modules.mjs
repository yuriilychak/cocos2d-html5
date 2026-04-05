import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

/**
 * Reads moduleConfig.json and resolves the dependency graph for a given
 * set of module names, returning a deduplicated, topologically-ordered
 * list of file paths (relative to the project root).
 */
export function resolveModules(moduleNames) {
  const configPath = join(ROOT, 'moduleConfig.json');
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  const moduleMap = config.module;
  const visited = new Set();
  const files = [];

  function resolve(moduleName) {
    if (visited.has(moduleName)) return;
    visited.add(moduleName);

    const entry = moduleMap[moduleName];
    if (!entry) {
      throw new Error(`Unknown module: "${moduleName}"`);
    }

    for (const item of entry) {
      if (item.endsWith('.js')) {
        if (!visited.has(item)) {
          visited.add(item);
          files.push(item);
        }
      } else {
        // It's a dependency module name
        resolve(item);
      }
    }
  }

  for (const name of moduleNames) {
    resolve(name);
  }

  return files;
}

/**
 * Returns ordered file list for the full "cocos2d" build
 * (matches the Ant `compile` target).
 * Includes CCBoot.js at the head, plus all cocos2d + extensions modules.
 */
export function getFullBuildFiles() {
  const coreFiles = ['CCBoot.js'];
  const moduleFiles = resolveModules([
    'cocos2d',
    'extensions',
    'physics',
    'ccui'
  ]);
  return [...coreFiles, ...moduleFiles];
}

/**
 * Returns ordered file list for the minimal "core" build
 * (matches the Ant `compile_core` target).
 */
export function getCoreBuildFiles() {
  const coreFiles = ['CCBoot.js'];
  const moduleFiles = resolveModules(['core']);
  return [...coreFiles, ...moduleFiles];
}
