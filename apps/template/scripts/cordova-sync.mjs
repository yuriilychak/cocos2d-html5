/**
 * Syncs the web build output into cordova/www/ so Cordova can package it.
 * Run via: node scripts/cordova-sync.mjs
 */
import { cpSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = join(__dirname, '..');
const wwwDir = join(appDir, 'cordova', 'www');

if (existsSync(wwwDir)) rmSync(wwwDir, { recursive: true });
mkdirSync(wwwDir, { recursive: true });

const entries = [
    'index.html',
    'res',
    'dist'
];

for (const entry of entries) {
    const src = join(appDir, entry);
    if (!existsSync(src)) continue;
    cpSync(src, join(wwwDir, entry), { recursive: true });
    console.log(`  copied  ${entry}`);
}

console.log(`\nCordova www/ ready at: ${wwwDir}`);
console.log('Next steps:');
console.log('  cd cordova && npx cordova platform add android');
console.log('  cd cordova && npx cordova build android');
