# Migration Plan: Apache Ant → npm + Rollup

## Problem Statement

cocos2d-html5 (v3.15) is a 2D WebGL/Canvas game engine with ~340 JS files, all ES5 globals-based
(everything on the `cc` namespace). The build system uses **Apache Ant + Google Closure Compiler**
to concatenate and minify files in dependency order into a single bundle. This needs to migrate to
**npm + Rollup** for modern tooling, easier CI/CD, and developer experience.

### Key Constraints
- **No ES modules**: all source files are plain scripts assigning to global `cc`
- **Strict file ordering**: files must be concatenated in dependency order (defined in `moduleConfig.json`)
- **Two build targets**: full engine (`cocos2d-js-v3.15-min.js`) and core-only (`cocos2d-js-v3.15-core-min.js`)
- **Source maps**: V3 format, must be preserved
- **ES5 target**: no transpilation needed
- **Backward compatibility**: existing `CCBoot.js` runtime loader and `project.json` config must still work for dev mode

## Approach

Since the codebase uses global namespace (not ES modules), we'll use a **custom Rollup plugin**
that reads `moduleConfig.json`, resolves the dependency graph, and concatenates files in order.
Rollup handles the output format (IIFE wrapping) and source map generation. Terser replaces
Google Closure Compiler for minification.

We also add a lightweight dev server (`serve`) for the template project.

## Todos

### 1. `create-package-json` — Initialize npm project with package.json
Create `package.json` with project metadata (from bower.json), devDependencies
(rollup, @rollup/plugin-terser, serve), and npm scripts.

### 2. `create-module-resolver` — Build script to resolve moduleConfig.json dependency graph
Create `scripts/resolve-modules.mjs` — a Node.js script that reads `moduleConfig.json`,
topologically sorts modules, deduplicates files, and returns an ordered file list for a
given module set (e.g., "cocos2d" for full build, "core" for core build).

### 3. `create-rollup-concat-plugin` — Custom Rollup plugin for legacy file concatenation
Create `scripts/rollup-plugin-concat.mjs` — a Rollup plugin that takes ordered file paths,
reads and concatenates them as a single virtual entry, and provides proper source maps.

### 4. `create-rollup-config` — Rollup configuration with full + core builds
Create `rollup.config.mjs` with two build configs:
- Full build → `lib/cocos2d-js-v3.15-min.js` + sourcemap
- Core build → `lib/cocos2d-js-v3.15-core-min.js` + sourcemap
Both use terser (SIMPLE-equivalent: mangle + compress, no advanced renaming of globals).

### 5. `update-gitignore` — Add node_modules and lib/ to .gitignore
Update `.gitignore` to exclude `node_modules/` and build artifacts in `lib/`.

### 6. `install-and-test` — Run npm install and verify builds match expected output
Run `npm install`, `npm run build`, verify output files exist and the template project works.

### 7. `update-docs` — Update README with new build instructions
Add a section to README.mdown with npm build commands, replacing the Ant instructions.

## Notes

- The existing `tools/build.xml` and `tools/compiler/` are NOT removed — kept for reference
- `CCBoot.js` runtime loading (dev mode via `project.json` + `moduleConfig.json`) is unchanged
- The built files go to `lib/` just like the Ant build
- `bower.json` is kept but can be deprecated later
- External libs (box2d, chipmunk, socket.io) are included as-is in the concatenation — same as Ant
