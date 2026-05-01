/**
 * Shared Rollup config for individual packages.
 *
 * Uses standard ES module resolution via src/index.js.
 * Exports and @aspect/* imports are stripped from the output to keep
 * dist compatible with the app-level concat build.
 *
 * Usage (in each package.json): "build": "rollup -c ../../scripts/rollup.package.mjs"
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
      // Strip import statements that reference @aspect/* packages;
      // their symbols are already available from earlier concat'd dist files.
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

export default {
  input: join(PKG_DIR, "src", "index.js"),
  treeshake: false,
  external: (id) => id.startsWith("@aspect/"),
  plugins: [
    resolve({ extensions: [".js"] }),
    stripExportsPlugin(),
    stripWorkspaceImportsPlugin()
  ],
  output: {
    file: "dist/index.js",
    format: "es",
    strict: false,
    sourcemap: true
  }
};
