/**
 * Custom Rollup config for @aspect/rapier.
 *
 * @dimforge/rapier2d-compat embeds the WASM as a base64 data URL and uses
 * internal dynamic imports for async WASM loading, which requires
 * `inlineDynamicImports: true` so Rollup produces a single dist/index.js.
 */
import { join } from "path";
import MagicString from "magic-string";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const PKG_DIR = process.cwd();

function stripExportsPlugin() {
  return {
    name: "strip-exports",
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

function stripWorkspaceImportsPlugin() {
  return {
    name: "strip-workspace-imports",
    renderChunk(code) {
      const s = new MagicString(code);
      const regex =
        /^import\s*\{[^}]*\}\s*from\s*['"]@aspect\/[^'"]*['"]\s*;?[ \t]*\n?/gm;
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

function replaceImportMetaUrlPlugin() {
  return {
    name: "replace-import-meta-url",
    renderChunk(code) {
      if (!code.includes("import.meta.url")) return null;
      const s = new MagicString(code);
      const regex = /import\.meta\.url/g;
      let match;
      while ((match = regex.exec(code)) !== null) {
        s.overwrite(
          match.index,
          match.index + match[0].length,
          "(typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : '')"
        );
      }
      return { code: s.toString(), map: s.generateMap({ hires: true }) };
    }
  };
}

export default {
  input: join(PKG_DIR, "src", "index.js"),
  treeshake: false,
  external: (id) => id.startsWith("@aspect/"),
  plugins: [
    resolve({ extensions: [".js"], preferBuiltins: false }),
    commonjs(),
    stripExportsPlugin(),
    stripWorkspaceImportsPlugin(),
    replaceImportMetaUrlPlugin()
  ],
  output: {
    file: "dist/index.js",
    format: "es",
    strict: false,
    sourcemap: true,
    inlineDynamicImports: true
  }
};
