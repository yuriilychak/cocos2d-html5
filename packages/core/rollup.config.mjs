/**
 * Rollup config for the core package.
 *
 * Extends the shared rollup.package.mjs config with an autoCCAssignPlugin
 * that automatically generates `cc.X = X` assignments for every named export.
 * This replaces the need to manually add cc.* assignments in src/index.js
 * for any new export — the build keeps cc.* fully in sync automatically.
 *
 * Plugin execution order (all in renderChunk phase):
 *   1. autoCCAssign  — appends cc.X = X for every export (sees exports)
 *   2. stripExports  — removes export { ... } and export const → const
 *   3. stripWorkspaceImports — strips @aspect/* import lines
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

/**
 * Scans all named exports in the bundled chunk and appends
 * `cc.<exportedName> = <localName>;` for each one.
 *
 * Handles:
 *  - `export { X }`            → cc.X = X
 *  - `export { X as Y }`       → cc.Y = X
 *  - `export const/let/var X`  → cc.X = X
 *  - `export function X`       → cc.X = X
 *  - `export class X`          → cc.X = X
 *
 * Runs BEFORE stripExportsPlugin so it can see the export statements.
 */
function autoCCAssignPlugin() {
  return {
    name: "auto-cc-assign",
    renderChunk(code) {
      const s = new MagicString(code);
      // Map from exportedName → localName
      const assignments = new Map();

      // Plain `export { X, Y as Z };`  (no `from` — those are already stripped by rollup into plain exports)
      const reExportRegex = /^export\s*\{([^}]*)\}\s*;/gm;
      let match;
      while ((match = reExportRegex.exec(code)) !== null) {
        for (const spec of match[1].split(",")) {
          const trimmed = spec.trim();
          if (!trimmed) continue;
          const asMatch = trimmed.match(/^(\S+)\s+as\s+(\S+)$/);
          if (asMatch) {
            assignments.set(asMatch[2], asMatch[1]);
          } else {
            assignments.set(trimmed, trimmed);
          }
        }
      }

      // `export const/let/var/function/class NAME`
      const declRegex = /^export\s+(?:const|let|var|function\*?|class)\s+(\w+)/gm;
      while ((match = declRegex.exec(code)) !== null) {
        assignments.set(match[1], match[1]);
      }

      if (assignments.size > 0) {
        const lines = Array.from(assignments.entries())
          .map(([exported, local]) => `cc.${exported} = ${local};`)
          .join("\n");
        s.append("\n// Auto-generated cc.* assignments from exports\n" + lines + "\n");
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
    autoCCAssignPlugin(),
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
