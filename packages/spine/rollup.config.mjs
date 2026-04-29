/**
 * Custom Rollup config for @aspect/spine.
 *
 * Wraps the bundled output in a block scope `{...}` so that class
 * declarations from @esotericsoftware/spine-core (e.g. Color, Event,
 * Texture) are block-scoped and do not collide with same-named classes
 * from @aspect/core when all dist files are concatenated by the app build.
 *
 * Classes from @aspect/core (Node, NodeCanvasRenderCmd, etc.) are still
 * accessible inside the block because block scope does not break lexical
 * lookup of outer-scope bindings. Spine classes are exposed to the outer
 * scope via the `sp` / `cc.sp` namespace objects.
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
 * Wraps the entire output in a block scope so that spine-core's internal
 * class/const/let declarations (Color, Event, Texture, etc.) are scoped
 * to this block and cannot conflict with identically-named declarations in
 * the cocos2d-core bundle when both are concatenated into the app bundle.
 */
function blockScopeWrapPlugin() {
  return {
    name: "block-scope-wrap",
    renderChunk(code, chunk, options) {
      const s = new MagicString(code);
      s.prepend("{\n");
      s.append("\n}");
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
    blockScopeWrapPlugin()
  ],
  output: {
    file: "dist/index.js",
    format: "es",
    strict: false,
    sourcemap: true
  }
};
