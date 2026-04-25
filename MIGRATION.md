# Package Migration Guide: Legacy `cc.*` Globals → ES Modules

The build system automatically switches a package to **Modern mode** (ES module resolution via rollup) once `src/index.js` exists in that package. Legacy mode concatenates files listed in `files.mjs`.

---

## Step 1 — Inventory

Read all `CC*.js` files in `packages/<name>/src/`:

- List every **class** defined (`cc.X = class X extends cc.Y`)
- List every **constant** or **utility function** defined at module level
- List every `cc.*` global **consumed** (not produced) — these need to become imports
- Check `files.mjs` to understand the full legacy load order

---

## Step 2 — Plan the file structure

### Single class per source file
Create one file per class, kebab-case, no `CC` prefix:
```
CCProgressTimer.js → progress-timer.js
```

### Multiple classes in one source file
Create a **folder** named after the file in kebab-case (no prefix):
```
CCActionManager.js → action-manager/
  action-manager.js
  action-target.js
  constants.js   ← if there are constants
  utils.js       ← if there are utility functions
```

### Render commands
Always split into separate files alongside the main class file:
```
CCProgressTimerCanvasRenderCmd.js → progress-timer-canvas-render-cmd.js
CCProgressTimerWebGLRenderCmd.js  → progress-timer-webgl-render-cmd.js
```

---

## Step 3 — Write the module files

### Strip the IIFE wrapper
```js
// before
(function () {
  cc.MyClass = class MyClass extends cc.Node { ... };
})();

// after
export class MyClass extends Node { ... }
```

### Replace `cc.X` references with imports

| `cc.*` usage | Import |
|---|---|
| `cc.Node`, `cc.Sprite`, etc. | `Node`, `Sprite` from `"@aspect/core"` |
| `cc.DrawNode` | `DrawNode` from `"@aspect/shape-nodes"` |
| `cc.rendererConfig.renderer` | `RendererConfig.getInstance().renderer` |
| `cc.rendererConfig.isCanvas` | `RendererConfig.getInstance().isCanvas` |
| `cc.rendererConfig.renderContext` | `RendererConfig.getInstance().renderContext` |
| `cc.director` | `Director.getInstance()` |
| `cc.shaderCache.programForKey(k)` | `ShaderCache.getInstance().programForKey(k)` |
| `cc.glUseProgram(p)` | `glUseProgram(p)` from `"@aspect/core"` |
| `cc.setProgram(n, p)` | `setProgramForNode(n, p)` from `"@aspect/core"` |
| `cc.Node._dirtyFlags` | `Node._dirtyFlags` |
| `cc.Node._stateCallbackType` | `Node._stateCallbackType` |
| `cc.CustomRenderCmd` | `CustomRenderCmd` from `"@aspect/core"` |
| `cc.SHADER_*`, `cc.UNIFORM_*` | named constants from `"@aspect/core"` |
| `cc.incrementGLDraws(n)` | `incrementGLDraws(n)` from `"@aspect/core"` |

### Static properties after class body
```js
// cc.MyClass.SOME_PROP = value; → either:
MyClass.SOME_PROP = value;           // after class body

// or as a class field:
export class MyClass {
  static SOME_PROP = value;
}
```

### Clean JSDoc and comments
Remove `cc.` prefix from all class name mentions in comments and JSDoc:
```js
// before: /** @class cc.ProgressTimer ... @property {cc.Point} midPoint */
// after:  /** @class ProgressTimer ... @property {Point} midPoint */
```

---

## Step 4 — Handle the render cmd ↔ node circular dependency

Render command files **must not** import the main node class (causes circular dep).

Instead:
- Use `this.constructor` to reference the render cmd class itself (for statics like `this.constructor._layer`)
- Do **not** reference `ClassName.TYPE_*` in render cmds — use the integer literal directly

Wire the static `CanvasRenderCmd` / `WebGLRenderCmd` properties in `src/index.js` only, after both sides are imported.

---

## Step 5 — Add missing exports to dependency packages

If a `cc.X` consumed by this package is not yet exported by its source package (`@aspect/core`, etc.):

1. Find where it is defined inside that package's `src/`
2. Add it to that package's `src/index.js`:
   ```js
   export { MyThing } from "./path/to/file";
   ```

---

## Step 6 — Create `src/index.js`

```js
import { MyClass } from "./my-class";
import { MyClassCanvasRenderCmd } from "./my-class-canvas-render-cmd";
import { MyClassWebGLRenderCmd } from "./my-class-webgl-render-cmd";

// Wire render commands
MyClass.CanvasRenderCmd = MyClassCanvasRenderCmd;
MyClass.WebGLRenderCmd = MyClassWebGLRenderCmd;

// cc globals (backward compat)
cc.MyClass = MyClass;

export { MyClass, MyClassCanvasRenderCmd, MyClassWebGLRenderCmd };
```

If the package exposes constants or types, export those too.

---

## Step 7 — Remove legacy files

Once `src/index.js` exists and the build passes:

- Delete `files.mjs`
- Delete all `CC*.js` source files that have been replaced

---

## Step 8 — Build and verify

```sh
npm run build
```

Expect all tasks to succeed (e.g. `32 successful, 32 total`). Fix any import/export errors before removing legacy files.
