# Cocos2d-HTML5 Architecture Blueprint

## Overview

Cocos2d-HTML5 is a cross-platform 2D game engine written in JavaScript, targeting web browsers (Canvas/WebGL), mobile browsers, and Facebook Instant Games. It is based on Cocos2d-X and organized as an **npm monorepo** powered by **Turborepo** and **Rollup**.

---

## Repository Layout

```
cocos2d-html5/
├── packages/          # Feature packages (@aspect/* scope)
├── apps/              # Runnable applications (examples, template)
├── scripts/           # Shared Rollup build scripts
├── turbo.json         # Turborepo task pipeline
└── package.json       # Root workspace manifest (npm workspaces)
```

---

## Package Dependency Graph

Packages are organized in four tiers:

### Tier 0 — Foundation
| Package | Description |
|---|---|
| `@aspect/core` | Node, Sprite, Director, Scene, Renderer, Textures, Events, Scheduler, Platform |

### Tier 1 — Core Extensions (depend only on `core`)
| Package |
|---|
| `@aspect/actions` |
| `@aspect/audio` |
| `@aspect/compression` |
| `@aspect/editbox` |
| `@aspect/effects` |
| `@aspect/labels` |
| `@aspect/motion-streak` |
| `@aspect/node-grid` |
| `@aspect/parallax` |
| `@aspect/render-texture` |
| `@aspect/shape-nodes` |
| `@aspect/spine` |
| `@aspect/text-input` |
| `@aspect/ccpool` |
| `@aspect/socketio` |

### Tier 2 — Composite Packages
| Package | Key Dependencies |
|---|---|
| `@aspect/actions3d` | core, actions, effects, render-texture |
| `@aspect/clipping-nodes` | core, shape-nodes |
| `@aspect/menus` | core, actions |
| `@aspect/particle` | core, compression |
| `@aspect/physics` | core, shape-nodes |
| `@aspect/progress-timer` | core, actions |
| `@aspect/tilemap` | core, compression |

### Tier 3 — High-Level Systems
| Package | Key Dependencies |
|---|---|
| `@aspect/box2d` | core, physics |
| `@aspect/chipmunk` | core, physics |
| `@aspect/ccui` | core, actions, labels, text-input, clipping-nodes, shape-nodes |
| `@aspect/gui` | core, clipping-nodes, render-texture, actions, progress-timer |
| `@aspect/runtime` | core, actions, menus |
| `@aspect/transitions` | core, actions, render-texture, progress-timer, actions3d, node-grid |
| `@aspect/cocostudio` | core, tilemap, particle, shape-nodes, ccui |

### Tier 4 — Meta-Packages (aggregators, no own source)
| Package | Aggregates |
|---|---|
| `@aspect/cocos2d` | core + all Tier 1–3 game packages |
| `@aspect/extensions` | gui, editbox, cocostudio, spine, ccpool |
| `@aspect/external` | box2d, chipmunk, socketio |

### Apps
| App | Dependencies |
|---|---|
| `examples` | cocos2d, extensions, external |
| `template` | cocos2d, extensions, external |

---

## Core Module Structure (`@aspect/core`)

```
core/src/
├── boot/              # Engine bootstrap, loader, game loop init, debug settings
├── platform/          # Class system, Sys (platform detection), Game, EGLView
├── event-manager/     # Event dispatch, touch/keyboard/mouse handling
├── renderer/          # RendererConfig, Canvas/WebGL render infrastructure
├── director/          # Director — main loop, scene management
├── scheduler/         # Timer/callback scheduler
├── scenes/            # Scene, Layer base classes
├── sprites/           # Sprite, SpriteFrame, SpriteBatchNode
├── textures/          # Texture2D, TextureCache, TextureAtlas
├── shaders/           # GLProgram, ShaderCache, GLProgramState
├── kazmath/           # Math library (vec2/3, mat4, quaternion)
├── action-manager.js  # Action queue management
├── components/        # Component system
├── cocoa/             # Value types: Point, Size, Rect, Color, AffineTransform
├── support/           # Utilities: array, data structures, profiler
├── layers/            # LayerColor, LayerGradient, LayerMultiplex
├── labelttf/          # TrueType font label
├── utils/             # Misc utility functions
├── configuration.js   # Engine configuration constants
├── drawing-primitives-canvas.js
├── drawing-primitives-webgl.js
└── index.js           # Barrel: imports all subsystems, assigns cc.* globals, re-exports named symbols
```

**`core/src/index.js`** serves a dual role:
1. **Bootstrap** — runs init side-effects (`initEngine`, `lazyInitialize`, `initInputExtension`) on import
2. **Barrel** — re-exports named symbols (`Point`, `Size`, `Rect`, `Node`, `Scene`, `Sprite`, `Director`, `RendererConfig`, etc.) for direct ES module consumption

---

## Rendering Architecture

### Pipeline

```
Game.run()
  └── Director.mainLoop()
        └── Director.drawScene()
              ├── scheduler.update()       ← Actions & timers
              ├── scene.visit()            ← Scene graph traversal
              │     └── node.visit()
              │           ├── renderCmd.visit(parentCmd)   ← Update transforms
              │           ├── renderer.pushRenderCommand() ← Enqueue
              │           └── [recurse children]
              └── renderer.rendering()     ← Flush render queue
```

### Backend Selection

`RendererConfig.getInstance()` detects Canvas vs WebGL at startup. Each `Node` subclass implements `_createRenderCmd()` to return the appropriate backend command:

```js
_createRenderCmd() {
  return RendererConfig.getInstance().isCanvas
    ? new MyClassCanvasRenderCmd(this)
    : new MyClassWebGLRenderCmd(this);
}
```

### Render Command Pattern

| Aspect | Canvas | WebGL |
|---|---|---|
| Mode | Immediate | Batched |
| API | 2D Canvas API (`drawImage`, `fillRect`) | GLSL shaders, vertex buffers |
| Batch breaking | N/A | Texture or blend state change |
| Dirty tracking | Dirty region optimization | Dirty flags on transforms/color |

### Dirty Flags

```js
Node._dirtyFlags = {
  transformDirty: 1 << 0,
  visibleDirty:   1 << 1,
  colorDirty:     1 << 2,
  opacityDirty:   1 << 3,
  // ...
};
```

---

## Build System

### Turborepo Pipeline (`turbo.json`)

```
build  → depends on ^build (all deps built first), outputs dist/**
clean  → no cache
dev    → persistent (dev server)
```

### Per-Package Build (`scripts/rollup.package.mjs`)

All packages use **Modern mode**: ES module resolution via Rollup from `src/index.js`.

### App Bundling (`scripts/rollup.app.mjs`)

1. Resolves all workspace dependencies transitively from the app's `package.json`
2. Topologically orders packages (respects `^build` dependency graph)
3. Concatenates each package's `dist/index.js` in order
4. Emits one minified bundle via `@rollup/plugin-terser`

### Import Convention (Modern packages)

```js
// Inter-package imports
import { Node, Sprite } from "@aspect/core";
import { sequence, MoveBy } from "@aspect/actions";

// Backward compatibility (must be present in src/index.js)
cc.MyClass = MyClass;

// Named export
export { MyClass };
```

---

## Key Conventions

### Naming
- File names: `kebab-case`, no `CC` prefix (e.g. `progress-timer.js` not `CCProgressTimer.js`)
- Render commands: suffix `-canvas-render-cmd.js` / `-webgl-render-cmd.js`
- One class per file where possible; multiple related classes → subfolder

### Singleton Access
```js
Director.getInstance()       // not cc.director
TextureCache.getInstance()   // not cc.textureCache
ShaderCache.getInstance()    // not cc.shaderCache
RendererConfig.getInstance() // not cc.rendererConfig
```

### Avoiding Circular Dependencies
- Render commands **must not** import their parent node class
- Use `this.constructor` for self-references in render commands
- Wire `MyClass.CanvasRenderCmd` and `MyClass.WebGLRenderCmd` in `src/index.js` only

### Static Properties
```js
// Correct: after class body
MyClass.CONSTANT = "value";

// Also acceptable: class field syntax
export class MyClass {
  static CONSTANT = "value";
}
```

---

## Development Workflow

```bash
npm install              # Install all workspace dependencies
npm run build            # Build all packages and apps (Turborepo)
npm run dev              # Start examples dev server at http://localhost:8080
npm run clean            # Remove all dist/ artifacts
cd packages/core && npm run build  # Build a single package
```
