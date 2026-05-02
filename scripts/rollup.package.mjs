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
      // Match both plain `export { ... };` and re-export `export { ... } from '...';`
      const regex = /^export\s*\{[^}]*\}\s*(?:from\s*['"][^'"]*['"]\s*)?;?[ \t]*\n?/gm;
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
      // Replace import statements that reference @aspect/* packages.
      // Non-renamed specifiers are already accessible in the concat'd scope.
      // Renamed specifiers (e.g. "Node as Node$1") need explicit var declarations
      // so the renamed binding resolves to the correct cc.* global.
      const regex =
        /^import\s*\{([^}]*)\}\s*from\s*['"]@aspect\/[^'"]*['"]\s*;?[ \t]*\n?/gm;
      let match;

      while ((match = regex.exec(code)) !== null) {
        const specifiers = match[1];
        const declarations = specifiers
          .split(",")
          .map(sp => sp.trim())
          .filter(Boolean)
          .map(spec => {
            const asMatch = spec.match(/^(\S+)\s+as\s+(\S+)$/);
            if (asMatch) {
              // "Node as Node$1" → "var Node$1 = cc.Node;"
              return `var ${asMatch[2]} = cc.${asMatch[1]};`;
            }
            return null;
          })
          .filter(Boolean)
          .join("\n");

        const replacement = declarations ? declarations + "\n" : "";
        s.overwrite(match.index, match.index + match[0].length, replacement);
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
