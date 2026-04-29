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
| `cc.Node`, `cc.Sprite`, `cc.LabelTTF`, etc. | `Node`, `Sprite`, `LabelTTF` from `"@aspect/core"` |
| `cc.DrawNode` | `DrawNode` from `"@aspect/shape-nodes"` |
| `cc.rendererConfig.renderer` | `RendererConfig.getInstance().renderer` |
| `cc.rendererConfig.isCanvas` | `RendererConfig.getInstance().isCanvas` |
| `cc.rendererConfig.renderContext` | `RendererConfig.getInstance().renderContext` |
| `cc.director` | `Director.getInstance()` |
| `cc.shaderCache.programForKey(k)` | `ShaderCache.getInstance().programForKey(k)` |
| `cc.textureCache` | `TextureCache.getInstance()` from `"@aspect/core"` |
| `cc.spriteFrameCache` | `SpriteFrameCache.getInstance()` from `"@aspect/core"` |
| `cc.view` | `EGLView.getInstance()` from `"@aspect/core"` |
| `cc.game.container` / `cc.container` | `Game.getInstance().container` from `"@aspect/core"` |
| `cc._canvas` / `cc.game.canvas` | `Game.getInstance().canvas` from `"@aspect/core"` |
| `cc.game.EVENT_RESIZE` / `EVENT_HIDE` / `EVENT_SHOW` | `Game.EVENT_RESIZE` etc. from `"@aspect/core"` |
| `cc.sys.os`, `cc.sys.isMobile`, `cc.sys.browserType`, `cc.sys.OS_ANDROID`, etc. | `Sys.getInstance().os`, `Sys.getInstance().isMobile` from `"@aspect/core"` |
| `cc.screen.requestFullScreen(el)` / `cc.screen.exitFullScreen()` | `screen.requestFullScreen(el)` / `screen.exitFullScreen()` from `"@aspect/core"` |
| `cc.visibleRect.width` / `cc.visibleRect.height` / `cc.visibleRect.topLeft` etc. | `visibleRect.width` / `visibleRect.height` from `"@aspect/core"` |
| `cc.loader.resPath` | `Loader.getInstance().resPath` from `"@aspect/core"` |
| `cc.path.join(...)` / `cc.path.extname(...)` | `Path.join(...)` / `Path.extname(...)` from `"@aspect/core"` |
| `cc.glUseProgram(p)` | `glUseProgram(p)` from `"@aspect/core"` |
| `cc.setProgram(n, p)` | `setProgramForNode(n, p)` from `"@aspect/core"` |
| `cc.Node._dirtyFlags` | `Node._dirtyFlags` |
| `cc.Node._stateCallbackType` | `Node._stateCallbackType` |
| `cc.Node.WebGLRenderCmd` / `cc.Node.CanvasRenderCmd` | `Node.WebGLRenderCmd` / `Node.CanvasRenderCmd` |
| `cc.CustomRenderCmd` | `CustomRenderCmd` from `"@aspect/core"` |
| `cc.SHADER_*`, `cc.UNIFORM_*` | named constants from `"@aspect/core"` |
| `cc.BLEND_SRC`, `cc.BLEND_DST`, `cc.ONE`, `cc.SRC_ALPHA` | named constants from `"@aspect/core"` |
| `cc.TEXT_ALIGNMENT_*` | `TEXT_ALIGNMENT_LEFT/CENTER/RIGHT` from `"@aspect/core"` |
| `cc.VERTICAL_TEXT_ALIGNMENT_*` | `VERTICAL_TEXT_ALIGNMENT_TOP/CENTER/BOTTOM` from `"@aspect/core"` |
| `cc.s_globalOrderOfArrival++` | `setGlobalOrderOfArrival(s_globalOrderOfArrival + 1)` — see note below |
| `cc.incrementGLDraws(n)` | `incrementGLDraws(n)` from `"@aspect/core"` |
| `cc.log(...)` / `cc.warn(...)` / `cc.error(...)` / `cc.assert(...)` | `log`, `warn`, `error`, `assert` from `"@aspect/core"` |
| `cc.isNumber(x)` | `isNumber(x)` from `"@aspect/core"` |
| `cc.arrayRemoveObject(arr, obj)` | `arrayRemoveObject(arr, obj)` from `"@aspect/core"` |
| `cc.FontDefinition` | `FontDefinition` from `"@aspect/core"` |
| `cc.FLT_MAX` | `FLT_MAX` from `"@aspect/core"` |
| `cc.Point.add(a, b)` / `cc.Point.sub(a, b)` / `cc.Point.mult(a, s)` / `cc.Point.length(p)` | `Point.add`, `Point.sub`, `Point.mult`, `Point.length` — static methods on imported `Point` |

> **`cc.s_globalOrderOfArrival` note**: This module-level counter cannot be mutated from outside
> its source module. Import both `s_globalOrderOfArrival` (current value) and
> `setGlobalOrderOfArrival` (setter) from `"@aspect/core"`, then replace
> `node.setOrderOfArrival(cc.s_globalOrderOfArrival++)` with:
> ```js
> node.setOrderOfArrival(s_globalOrderOfArrival);
> setGlobalOrderOfArrival(s_globalOrderOfArrival + 1);
> ```

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

Typical replacements in JSDoc tags:

| Before | After |
|---|---|
| `@class cc.Foo` | `@class Foo` |
| `@extends cc.Node` | `@extends Node` |
| `@param {cc.Sprite} sprite` | `@param {Sprite} sprite` |
| `@returns {cc.Color}` | `@returns {Color}` |
| `@type {cc.Size}` | `@type {Size}` |
| `@property {cc.Point} midPoint` | `@property {Point} midPoint` |
| `@name cc.Foo` | `@name Foo` |
| `@namespace cc.Foo` | `@namespace Foo` |

Also strip `cc.` from inline code in `@example` blocks and free-text descriptions:
```js
// before: * cc.audioEngine.setEffectsVolume(0.5);
// after:  * audioEngine.setEffectsVolume(0.5);

// before: * cc.RenderTexture is a generic rendering target.
// after:  * RenderTexture is a generic rendering target.
```

Audit command — finds `cc.` in comment lines only:
```sh
grep -rn 'cc\.' packages/<name>/src/ --include="*.js" | grep -E '\*\s.*cc\.|//.*cc\.'
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

---

## Step 9 — Audit for remaining `cc.*` globals

Even after a package is in ES module mode, internal files may still reference `cc.*` globals
instead of importing the symbol directly. Always run this audit after migration — and again
whenever new files are added:

```sh
# List every non-comment cc.* reference in the package
grep -rn 'cc\.' packages/<name>/src/ --include="*.js" | grep -v '^\s*//' | grep -v '//.*cc\.'
```

**Acceptable remaining `cc.*` references:**
- `cc.X = X;` — backward-compat assignments in `src/index.js`
- `cc.ccui.X = X;` — namespace assignments in `src/index.js`

**Must be replaced with direct imports:**
- Any `cc.X(...)` constructor or function call
- Any `cc.X.Y` constant / static access
- Any `instanceof cc.X` check

### Circular dependency exceptions

Some `cc.*` globals must be kept when a direct import would create a circular dependency:

| Pattern | Why it's circular | Keep as |
|---|---|---|
| Class A imports Class B that **extends** A | B extends A → A must be defined first | `cc.ccui.B` in A |
| Class A imports Class B that **transitively extends** A | same reason | `cc.ccui.B` in A |

Example: `widget.js` cannot import `Layout` or `ImageView` because both extend `Widget`.
It may import `LayoutComponent` because that class does **not** extend `Widget`.
