import { createAppConfig, createTestsConcatConfig } from "../../scripts/rollup.app.mjs";
import { copyFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const wasmSrc = join(__dirname, "../../node_modules/box2d-wasm/dist/es");
const wasmDst = join(__dirname, "dist");

function copyBox2dWasmPlugin() {
  return {
    name: "copy-box2d-wasm",
    generateBundle() {
      mkdirSync(wasmDst, { recursive: true });
      for (const file of ["Box2D.wasm", "Box2D.simd.wasm"]) {
        try {
          copyFileSync(join(wasmSrc, file), join(wasmDst, file));
        } catch (_) {
          /* file may not exist in all build variants */
        }
      }
    }
  };
}

const engineConfig = createAppConfig({ outputFile: "dist/cocos2d.min.js" });
engineConfig.plugins.push(copyBox2dWasmPlugin());

const testsConfig = createTestsConcatConfig({
  filesModulePath: "files.mjs",
  outputFile: "dist/tests.min.js"
});

export default [engineConfig, testsConfig];
