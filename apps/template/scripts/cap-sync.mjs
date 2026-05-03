/**
 * Populates www/ with web build output for Capacitor.
 * Run via: node scripts/cap-sync.mjs
 * Then run: npx cap sync
 */
import { cpSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = join(__dirname, '..');
const wwwDir = join(appDir, 'www');

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

console.log(`\nwww/ ready at: ${wwwDir}`);
console.log('Next steps:');
console.log('  npx cap sync');
console.log('  npx cap run android   (or: npx cap open android)');
console.log('  npx cap run ios       (or: npx cap open ios)');
