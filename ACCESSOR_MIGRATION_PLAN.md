# Accessor Migration Plan

## Goal

Migrate legacy Cocos-style direct getter/setter calls such as `getOpacity()`,
`setOpacity(value)`, `getPositionX()`, and `setPositionX(value)` toward modern
ES class accessors such as `opacity`, `x`, and `scale`.

The migration should be incremental. Existing `get*/set*/is*` methods should
remain available while internal code and examples move to property accessors.
Removing legacy methods should be treated as a later major-version decision.

## Current State

The codebase is already partially migrated. Core classes already expose many
modern accessors:

- `Node`: `x`, `y`, `width`, `height`, `anchorX`, `anchorY`, `scale`, `scaleX`,
  `scaleY`, `rotation`, `rotationX`, `rotationY`, `visible`, `opacity`, `color`,
  `parent`, `children`, `childrenCount`, `scheduler`, `actionManager`,
  `shaderProgram`, `cascadeOpacity`, `cascadeColor`.
- `Sprite`: `opacity`, `color`, `flippedX`, `flippedY`, `texture`, `batchNode`,
  `quad`, `opacityModifyRGB`.
- `Widget`: `xPercent`, `yPercent`, `widthPercent`, `heightPercent`, `enabled`,
  `focused`, `sizeType`, `touchEnabled`, `updateEnabled`, `bright`, `name`,
  `actionTag`, `opacity`.
- `ParticleSystem`: `batchNode`, `drawMode`, `shapeType`, `sourcePos`, `posVar`,
  `gravity`, `speed`, `speedVar`, `startColor`, `endColor`, `totalParticles`,
  `texture`, and other particle-specific properties.
- Several packages already define accessors: `progress-timer`, `tilemap`,
  `editbox`, `labels`, `gui`, `cocostudio`, `audio`, and low-level value types.

Direct getter/setter definitions are still concentrated in:

```text
packages/core
packages/ccui
apps/examples
packages/cocostudio
packages/particle
packages/tilemap
packages/gui
packages/actions3d
packages/spine
packages/actions
```

Direct getter/setter call sites are most frequent in:

```text
apps/examples
packages/ccui
packages/core
packages/cocostudio
packages/gui
packages/particle
packages/tilemap
```

The hottest common call families are:

```text
getContentSize / setContentSize
setString / getString
setPosition / getPosition
setColor / getColor
setAnchorPoint / getAnchorPoint
setScale / getScale
setVisible / isVisible
setOpacity / getOpacity
setRotation / getRotation
```

## Migration Rules

### Keep Compatibility

Do not remove legacy methods during the migration:

```js
node.getOpacity();
node.setOpacity(128);
```

should continue to work after:

```js
node.opacity;
node.opacity = 128;
```

is introduced or adopted.

### Prefer Existing Accessors First

If a class already exposes a property accessor, migrate call sites before adding
new API. For example, `Node` already supports:

```js
node.x = 10;
node.y = 20;
node.scale = 2;
node.visible = true;
node.opacity = 128;
node.color = color;
```

### Convert Simple One-Value Accessors First

Safe first conversions:

```text
getPositionX()       -> x
setPositionX(v)      -> x = v
getPositionY()       -> y
setPositionY(v)      -> y = v
getScale()           -> scale
setScale(v)          -> scale = v
getScaleX()          -> scaleX
setScaleX(v)         -> scaleX = v
getScaleY()          -> scaleY
setScaleY(v)         -> scaleY = v
getRotation()        -> rotation
setRotation(v)       -> rotation = v
getOpacity()         -> opacity
setOpacity(v)        -> opacity = v
getColor()           -> color
setColor(v)          -> color = v
isVisible()          -> visible
setVisible(v)        -> visible = v
getParent()          -> parent
setParent(v)         -> parent = v
getChildren()        -> children
getChildrenCount()   -> childrenCount
```

### Defer Multi-Argument Methods

Do not blindly convert multi-argument commands:

```js
node.setPosition(x, y);
node.setContentSize(width, height);
node.setAnchorPoint(x, y);
node.setColor(r, g, b);
```

These should either stay as methods or be migrated only after object-valued
accessors are clearly defined and tested:

```js
node.position = new Point(x, y);
node.contentSize = new Size(width, height);
node.anchorPoint = new Point(x, y);
```

### Do Not Convert Query/Command Methods

Methods with required lookup parameters or action semantics should stay methods:

```text
getChildByTag(tag)
getActionByTag(tag)
getUniformLocationForName(name)
getTextureForKey(key)
setTitleForState(title, state)
setBackgroundSpriteForState(sprite, state)
```

These are not natural properties.

### Watch Boolean Naming

Boolean getters may use either `is*` or `get*`. Prefer property names without
the prefix:

```text
isVisible()                 -> visible
isRunning()                 -> running
isCascadeOpacityEnabled()   -> cascadeOpacity
isCascadeColorEnabled()     -> cascadeColor
isOpacityModifyRGB()        -> opacityModifyRGB
```

## Recommended Phases

### Phase 1: Baseline Inventory

Create or use a script that reports:

- legacy method definitions by file/package
- existing ES accessors by file/package
- direct getter/setter call sites by file/package
- unmapped method names that need manual classification

This should run before each migration batch so progress is measurable.

### Phase 2: Tiny App Slice

Start with `apps/template`.

Convert only already-supported simple accessors:

```js
sprite.setScale(value);
```

to:

```js
sprite.scale = value;
```

Leave `setPosition(...)`, `setAnchorPoint(...)`, and `getContentSize()` alone
until object-valued accessor rules are settled.

### Phase 3: Examples, Simple Node Accessors

Migrate `apps/examples` in small groups:

1. `getPositionX` / `setPositionX` / `getPositionY` / `setPositionY`
2. `getScale` / `setScale` / `getScaleX` / `setScaleX` / `getScaleY` / `setScaleY`
3. `getRotation` / `setRotation`
4. `getOpacity` / `setOpacity`
5. `isVisible` / `setVisible`
6. `getColor` / `setColor`
7. `getParent` / `setParent` / `getChildren` / `getChildrenCount`

Build and run the examples app after each group.

### Phase 4: CCUI Widgets

Migrate `packages/ccui` after examples prove the core accessors are stable.

Start with `Widget` and widget subclasses that already expose properties:

```text
enabled
focused
touchEnabled
bright
name
actionTag
opacity
selected
percent
string
fontSize
fontName
titleText
titleColor
```

Avoid migrating layout and scroll APIs until their accessor semantics are clear.

### Phase 5: Core Internals

Migrate `packages/core` internal call sites after app-facing usage has been
validated.

Prioritize low-risk internal calls to already-existing `Node`, `Sprite`,
`LabelTTF`, `Texture2D`, and value-type accessors.

Do not change render command internals unless the property path is clearly
equivalent and performance-sensitive paths have been checked.

### Phase 6: Cocostudio

Migrate `packages/cocostudio` after core and CCUI are stable.

This package has nested armature, display, animation, and collider APIs. Treat
it as higher risk because many calls are cross-object graph operations.

Recommended order:

1. passive data accessors such as `boneData`, `armature`, `childArmature`
2. animation state accessors such as `speedScale`, `animationScale`
3. collider accessors such as `colliderFilter`, `active`, `body`
4. display-manager call sites only after tests/examples cover armature display

### Phase 7: Feature Packages

Migrate package by package:

```text
packages/particle
packages/tilemap
packages/gui
packages/labels
packages/editbox
packages/progress-timer
packages/render-texture
packages/actions
packages/actions3d
packages/effects
packages/spine
packages/physics
packages/motion-streak
```

Use each package's existing accessor surface first. Add missing accessors only
when the method is clearly property-like.

## Batch Checklist

For every migration batch:

1. Pick one package and one accessor family.
2. Confirm the target property accessor already exists, or add it with legacy
   method delegation.
3. Convert call sites with an AST-aware codemod or careful manual edits.
4. Run the package build.
5. Run the examples app or relevant smoke test.
6. Search for remaining old calls in the migrated package.
7. Commit the batch independently.

## Verification

Recommended commands:

```bash
npm run build
npm run dev
```

For focused scans:

```bash
rg "\\.setOpacity\\(|\\.getOpacity\\(" apps packages
rg "\\.setPositionX\\(|\\.getPositionX\\(" apps packages
rg "\\.setScale\\(|\\.getScale\\(" apps packages
```

## Risks

- Some setters have side effects beyond assignment, especially rendering dirty
  flags, layout invalidation, texture reloads, event dispatch, and physics body
  synchronization. Accessors must delegate to the existing setter methods.
- Some method names look property-like but are actually commands or queries.
  These should remain methods.
- `setPosition`, `setContentSize`, `setAnchorPoint`, and similar overloaded
  methods need special handling because they accept either objects or separate
  numeric arguments.
- Render command classes and hot render paths should be migrated conservatively.
- Existing examples are a useful smoke suite because they exercise broad engine
  behavior, but they are not a complete regression test suite.

## First Suggested Pull Request

Scope:

- Add or verify no new API is needed for simple `Node` accessors.
- Migrate `apps/template` simple accessor usage only.
- Migrate a small subset of `apps/examples` for `scale`, `scaleX`, `scaleY`,
  `rotation`, `opacity`, and `visible`.
- Leave position, content size, anchor point, and string/text APIs unchanged.

Success criteria:

- `npm run build` passes.
- `npm run dev` starts.
- Manual smoke test opens examples and verifies transforms, opacity, visibility,
  and basic navigation still work.
