# Cocos2d-HTML5 Development Guide

## Overview

Cocos2d-HTML5 is a cross-platform 2D game engine written in JavaScript, based on Cocos2d-X. The codebase is organized as a monorepo with:

- **Core architecture**: Modular packages using ES modules with `@aspect/*` namespacing
- **Build system**: Turbo + Rollup with both modern (ES modules) and legacy (file concatenation) modes
- **Target platforms**: Web browsers (Canvas/WebGL), mobile browsers, Facebook Instant Games

## Build Commands

```bash
# Install dependencies
npm install

# Build all packages and apps
npm run build

# Clean all build artifacts
npm run clean

# Start development server for examples (http://localhost:8080)
npm run dev

# Build specific package
cd packages/core && npm run build

# Build examples app
cd apps/examples && npm run build
```

## Architecture

### Package Organization

The codebase is split into focused packages under `packages/`:

- **`core`**: Foundation classes (Node, Sprite, Director, etc.)
- **`cocos2d`**: Main engine package that depends on all others
- **`actions`**: Animation and action system
- **`particle`**: Particle system
- **`tilemap`**: Tilemap rendering
- **`audio`**: Audio system
- **Other packages**: UI components, physics, networking, etc.

### Build Modes

The build system supports two modes per package:

1. **Modern mode** (ES modules): When `src/index.js` exists
   - Uses standard ES module resolution via Rollup
   - Supports `@aspect/*` imports between packages
   - Preferred for new development

2. **Legacy mode**: When only `files.mjs` exists
   - Concatenates files in specified order
   - Uses global `cc.*` namespace
   - Being gradually migrated to modern mode

### Import Patterns

Modern packages use scoped imports:
```javascript
// Import from other aspect packages
import { Node, Sprite } from "@aspect/core";
import { ReverseTime } from "@aspect/actions";

// Export with backward compatibility
cc.MyClass = MyClass;
export { MyClass };
```

Legacy packages use global namespace:
```javascript
cc.MyClass = class MyClass extends cc.Node { ... };
```

## Key Conventions

### File Naming
- **Modern packages**: kebab-case, no `CC` prefix (`progress-timer.js` not `CCProgressTimer.js`)
- **Render commands**: Separate files (`progress-timer-canvas-render-cmd.js`)
- **Class files**: One class per file when possible

### Render Command Pattern
Render commands are separate from their main classes to avoid circular dependencies:
```javascript
// In src/index.js - wire them together
import { MyClass } from "./my-class";
import { MyClassCanvasRenderCmd } from "./my-class-canvas-render-cmd";

MyClass.CanvasRenderCmd = MyClassCanvasRenderCmd;
```

### Singleton Access
Use getInstance() pattern for singletons:
```javascript
// Correct
Director.getInstance()
TextureCache.getInstance()
ShaderCache.getInstance().programForKey(key)

// Avoid (legacy globals)
cc.director
cc.textureCache
```

### ES Module Migration

When migrating from legacy to modern:

1. **Strip IIFE wrappers**: `(function() { ... })()` → direct exports
2. **Replace cc.* references** with imports from appropriate `@aspect/*` packages
3. **Handle render commands**: Keep separate, wire in `src/index.js`
4. **Maintain backward compatibility**: Assign to `cc.*` globals
5. **Use static properties**: After class body, not inside

See `MIGRATION.md` for detailed migration steps.

### Testing

The codebase uses `apps/examples` as the primary test suite with various test scenarios. No separate unit test framework is currently used.

## Development Workflow

1. **Package development**: Work in individual packages under `packages/`
2. **Testing**: Use `npm run dev` to run examples server and test changes
3. **Building**: Use `npm run build` to ensure all packages build correctly
4. **Legacy migration**: Follow `MIGRATION.md` to convert packages to modern mode

## Common Patterns

### Class Definition (Modern)
```javascript
export class MyClass extends Node {
  constructor() {
    super();
    // initialization
  }
  
  static CONSTANT = "value";
}

// Render command wiring (in index.js)
MyClass.CanvasRenderCmd = MyClassCanvasRenderCmd;

// Backward compatibility
cc.MyClass = MyClass;
```

### Package Dependencies
```javascript
// package.json
{
  "dependencies": {
    "@aspect/core": "*",
    "@aspect/actions": "*"
  }
}
```

### Avoiding Circular Dependencies
- Render commands must not import their parent class
- Use `this.constructor` to reference static properties
- Wire relationships in `src/index.js` after imports

## Rendering Architecture

### Rendering Pipeline

The engine uses a **Command Pattern** based rendering system that supports both Canvas and WebGL backends:

```
Game Loop → Director.mainLoop() → Director.drawScene() → 
Scene.visit() → Node.visit() → Renderer.pushRenderCommand() → 
Renderer.rendering()
```

#### Core Rendering Flow

1. **Director.drawScene()**: Main rendering entry point
   - Updates scheduler and actions (`scheduler.update()`)
   - Calls `scene.visit()` to traverse scene graph
   - Clears and renders via `renderer.rendering()`

2. **Node.visit()**: Scene graph traversal
   - Checks visibility (`!this._visible`)
   - Calls render command's `visit()` method
   - Renders children with negative Z-order first
   - Pushes render command (`renderer.pushRenderCommand()`)
   - Renders remaining children with positive Z-order

3. **Render Commands**: Backend-specific rendering
   - **Canvas**: `CanvasRenderCmd` - immediate mode rendering
   - **WebGL**: `WebGLRenderCmd` - batched rendering with vertex buffers

### Render Command Pattern

Each node has a render command created by `_createRenderCmd()`:

```javascript
_createRenderCmd() {
  if (RendererConfig.getInstance().isCanvas)
    return new NodeCanvasRenderCmd(this);
  else 
    return new NodeWebGLRenderCmd(this);
}
```

#### Render Command Lifecycle

1. **Creation**: Node constructor calls `_createRenderCmd()`
2. **Visit**: `visit(parentCmd)` updates transforms and state
3. **Push**: `renderer.pushRenderCommand(cmd)` queues for rendering
4. **Render**: `rendering(ctx, scaleX, scaleY)` executes draw calls

### Canvas vs WebGL Rendering

#### Canvas Renderer (`renderer-canvas.js`)

- **Immediate mode**: Each command renders directly to canvas context
- **Dirty regions**: Optimizes redraws by tracking changed areas
- **Context operations**: Uses 2D canvas API (drawImage, fillRect, etc.)

```javascript
// Canvas render command example
rendering(ctx, scaleX, scaleY) {
  ctx.drawImage(texture, x, y, width, height);
}
```

#### WebGL Renderer (`renderer-webgl.js`)

- **Batched rendering**: Groups similar objects for efficient GPU submission
- **Vertex buffers**: Uploads geometry data to GPU buffers
- **Shader programs**: Uses GLSL shaders for programmable rendering
- **Batch breaking**: Splits batches when texture/blend state changes

```javascript
// WebGL batching logic
_uploadBufferData(cmd) {
  // Check if we need to break batch (different texture/shader)
  if (texture !== _batchedInfo.texture) {
    this._batchRendering(); // Submit current batch
  }
  // Upload vertex data to buffer
  cmd.uploadData(_vertexDataF32, _vertexDataUI32, offset);
}
```

### Rendering Optimizations

#### Dirty Flags System

Nodes track what has changed using dirty flags:

```javascript
dirtyFlags = {
  transformDirty: 1 << 0,   // Position/rotation/scale changed
  visibleDirty: 1 << 1,     // Visibility changed  
  colorDirty: 1 << 2,       // Color changed
  opacityDirty: 1 << 3,     // Opacity changed
  // ... more flags
};
```

#### Z-Order and Depth

- **Local Z-order**: Controls rendering order within parent
- **Global Z**: Assigned automatically during traversal (`assignedZ`)
- **Depth testing**: WebGL can use depth buffer for 3D scenes

#### Batching (WebGL)

- Groups objects with same texture and blend mode
- Reduces GPU state changes and draw calls
- Uses vertex buffers for efficient data upload
- Automatically breaks batches when state changes

### Key Renderer Classes

- **`RendererConfig`**: Singleton managing renderer state and selection
- **`Director`**: Orchestrates the main rendering loop
- **`Node`**: Base class with render command integration
- **Render Commands**: `CanvasRenderCmd`, `WebGLRenderCmd` for backend-specific rendering
- **Renderers**: `rendererCanvas`, `rendererWebGL` implementing rendering logic

## Package Status

- **Modern (ES modules)**: ~25+ packages migrated
- **Legacy (file concat)**: ~7 packages remaining
- **Priority**: New development should use modern mode only