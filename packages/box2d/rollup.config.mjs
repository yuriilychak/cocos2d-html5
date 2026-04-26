/**
 * Custom Rollup config for @aspect/box2d.
 *
 * box2d-wasm uses internal dynamic imports for async WASM loading, which
 * requires `inlineDynamicImports: true` so Rollup produces a single
 * dist/index.js rather than splitting into multiple chunks.
 */
import { join } from "path";
import MagicString from "magic-string";
import resolve from "@rollup/plugin-node-resolve";

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

/**
 * box2d-wasm uses `import.meta.url` to locate Box2D.wasm at runtime.
 * The app bundle is loaded as a plain <script> (non-module), where
 * import.meta is a syntax error. Replace it with a safe fallback;
 * callers that need a custom path should pass `locateFile` to initBox2D().
 */
function replaceImportMetaUrlPlugin() {
  return {
    name: "replace-import-meta-url",
    renderChunk(code) {
      if (!code.includes("import.meta.url")) return null;
      const s = new MagicString(code);
      // Replace every occurrence of import.meta.url with a runtime-safe expression
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
    resolve({ extensions: [".js"] }),
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
