#!/usr/bin/env node
/**
 * Dev server: starts rollup in watch mode + static server in parallel.
 * Uses stdio:'inherit' so rollup gets a real TTY and outputs properly.
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rollupBin = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'rollup');
const serveBin = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'serve');

const rollup = spawn(rollupBin, ['-c', 'rollup.dev.mjs', '--watch', '--no-stdin'], {
  cwd: __dirname,
  stdio: 'inherit',
});

const serve = spawn(serveBin, ['.', '-l', '8080', '--no-clipboard'], {
  cwd: __dirname,
  stdio: 'inherit',
});

function cleanup() {
  rollup.kill();
  serve.kill();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
rollup.on('exit', (code) => { if (code !== null) { cleanup(); process.exit(code); } });
serve.on('exit', (code) => { if (code !== null) { cleanup(); process.exit(code ?? 0); } });
