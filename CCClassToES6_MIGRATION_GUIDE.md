# cc.Class.extend → ES6 / cc.NewClass Migration Guide

This document captures the patterns used to migrate cocos2d-html5 engine code from the legacy `cc.Class.extend` system to modern ES6 classes, using the `cocos2d/actions` migration as a worked example.

The goal is to:

- Keep the global `cc` API surface stable (no ES modules).
- Preserve behavior (especially for actions, easing, and timers).
- Maintain compatibility with existing `cc.Class.extend` subclasses where needed.

Use this guide when updating other engine folders (layers, sprites, etc.) to ES6.

---

## 1. Identify the Legacy Pattern

Typical legacy definitions look like this:

```js
cc.SomeClass = cc.BaseClass.extend(
  /** @lends cc.SomeClass# */ {
    _field: 0,

    ctor: function (arg1, arg2) {
      cc.BaseClass.prototype.ctor.call(this);
      this._field = 123;
      // ...
    },

    method: function (x) {
      // ...
    },

    /** statics */
    statics: {
      SOME_CONST: 42
    }
  }
);
```

And sometimes parent methods are invoked via prototypes:

```js
cc.BaseClass.prototype.startWithTarget.call(this, target);
```

Before migrating, scan a file for:

- `cc.X = cc.Y.extend({ ... })` definitions.
- `ctor:` constructors.
- `statics:` blocks.
- Prototype-based parent calls: `cc.*.prototype.*.call(this, ...)`.

---

## 2. Choose the ES6 Base Class

Use these rules to pick the base class:

- **Root engine types** that previously did `cc.Class.extend` should now extend `cc.NewClass` directly, e.g.:

  ```js
  cc.Action = class Action extends cc.NewClass { ... };
  ```

- **Concrete engine classes** should extend their logical ES6 base class, mirroring the old hierarchy:

  ```js
  cc.ActionInterval = class ActionInterval extends cc.FiniteTimeAction { ... };
  cc.MoveBy         = class MoveBy extends cc.ActionInterval { ... };
  cc.MoveTo         = class MoveTo extends cc.MoveBy { ... };
  ```

- Pure interfaces or delegates can also extend `cc.NewClass` (e.g. `cc.ActionTweenDelegate`).

Keep the inheritance tree identical to the original one.

---

## 3. Convert `cc.Class.extend` to ES6 Class Syntax

### 3.1. Class wrapper

Change:

```js
cc.SomeClass = cc.BaseClass.extend({
  // body
});
```

To:

```js
cc.SomeClass = class SomeClass extends cc.BaseClass {
  // body
};
```

Use the `cc.SomeClass = class SomeClass ...` pattern to keep the global symbol and readable stack traces.

### 3.2. Constructor (`ctor` → `constructor`)

Change the `ctor` function into an ES6 `constructor` and replace manual base ctor calls with `super()`:

```js
// Before
ctor: function (arg1, arg2) {
  cc.BaseClass.prototype.ctor.call(this);
  this._field = 123;
  if (arg1 !== undefined) this.initWithFoo(arg1, arg2);
},

// After
constructor(arg1, arg2) {
  super();                 // always first
  this._field = 123;       // then initialize fields
  if (arg1 !== undefined) this.initWithFoo(arg1, arg2);
}
```

Rules:

- **Always** call `super(...)` as the first statement in every subclass constructor.
- **Never** access `this` before `super(...)` (ES6 runtime error otherwise).
- After `super`, migrate any default field initialization from the old `ctor`.

### 3.3. Methods

Convert object-literal methods to ES6 instance methods:

```js
// Before
initWithDuration: function (duration, percent) {
  if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
    this._to = percent;
    return true;
  }
  return false;
},

// After
initWithDuration(duration, percent) {
  if (super.initWithDuration(duration)) {
    this._to = percent;
    return true;
  }
  return false;
}
```

Drop commas and `function` keywords; keep JSDoc comments above methods.

### 3.4. Instance fields

For simple fields, you can either:

- Initialize in the constructor:

  ```js
  constructor() {
    super();
    this._elapsed = 0;
    this._firstTick = false;
  }
  ```

- Or use class fields when it matches existing patterns:

  ```js
  class ActionInterval extends cc.FiniteTimeAction {
    _elapsed = 0;
    _firstTick = false;
    // ...
  }
  ```

Use whichever keeps the code closest to the surrounding style.

---

## 4. Replace Prototype-Based Parent Calls with `super`

Search for patterns like:

```js
cc.BaseClass.prototype.startWithTarget.call(this, target);
cc.BaseClass.prototype.stop.call(this);
```

Replace them with `super` **only when `BaseClass` is the direct superclass**:

```js
startWithTarget(target) {
  super.startWithTarget(target);
  // subclass logic
}

stop() {
  // subclass cleanup
  super.stop();
}
```

Guidelines:

- If the legacy code calls `Parent.prototype.method.call(this, ...)` and the ES6 class extends `Parent`, it should become `super.method(...)`.
- Avoid changing calls that intentionally skip the immediate parent (grandparent calls). If you find such a case, check the behavior carefully before changing it.
- After a migration pass, run a search for `cc.*.prototype.*.call(this,` in the folder; the goal is to reduce this to zero for migrated ES6 code.

---

## 5. Preserve Factory Functions and Statics

Many engine APIs expose factories alongside classes, e.g.:

```js
var action = cc.moveBy(2, cc.p(10, 0));
```

These are usually defined as:

```js
cc.MoveBy = cc.ActionInterval.extend({
  /* ... */
});

cc.moveBy = function (duration, deltaPos, deltaY) {
  return new cc.MoveBy(duration, deltaPos, deltaY);
};
```

When migrating:

- Keep the **factory functions** as plain functions that `new` the ES6 class.
- Do **not** change their signatures; user code expects the same parameters.

Statics from `statics: { ... }` blocks can be moved to `static` methods or attached after the class:

```js
// Before
statics: {
  SOME_CONST: 42,
  helper: function () { ... }
}

// After
cc.SomeClass = class SomeClass extends cc.BaseClass {
  // ...

  static helper() { ... }
};

cc.SomeClass.SOME_CONST = 42;
```

Choose `static` vs post-attach based on what the surrounding code uses.

---

## 6. Backward Compatibility: `.extend = cc.Class.extend`

To allow legacy user code to keep doing `cc.SomeClass.extend({ ... })` on migrated ES6 classes, reattach the legacy `extend` function to important classes:

```js
cc.SomeBaseClass = class SomeBaseClass extends cc.NewClass {
  /* ... */
};

cc.SomeBaseClass.extend = cc.Class.extend;
```

This preserves the `extend` entry point while the engine’s core implementation is ES6-based.

Use this for engine-level types that are likely extension points, for example:

- `cc.Action`, `cc.FiniteTimeAction`, `cc.ActionInterval`, `cc.ActionInstant`, `cc.ActionEase`.
- Spline actions like `cc.CardinalSplineTo`.
- Tween-related helpers (`cc.ActionTweenDelegate`, `cc.ActionTween`).

You usually **don’t** need it on small leaf classes that are unlikely to be subclassed directly by user code.

---

## 7. Progress Timer / Other Subsystems: Applying the Pattern

For files like `cocos2d/progress-timer/CCActionProgressTimer.js` the steps are:

1. Convert `cc.ProgressTo = cc.ActionInterval.extend({ ... })` and `cc.ProgressFromTo = cc.ActionInterval.extend({ ... })` into ES6 classes extending `cc.ActionInterval`.
2. Turn `ctor` into `constructor`, replacing `cc.ActionInterval.prototype.ctor.call(this)` with `super()`.
3. Replace `cc.ActionInterval.prototype.initWithDuration.call(this, duration)` with `super.initWithDuration(duration)`.
4. Keep the factory functions `cc.progressTo(...)` and `cc.progressFromTo(...)` as they are, just pointing at the new ES6 classes.

The same migration pattern has already been applied to the spline-based actions in
`cocos2d/actions/CCActionCatmullRom.js`, including:

- `cc.CardinalSplineTo` / `cc.CardinalSplineBy` plus factories `cc.cardinalSplineTo(...)` / `cc.cardinalSplineBy(...)`
- `cc.CatmullRomTo` / `cc.CatmullRomBy` plus factories `cc.catmullRomTo(...)` / `cc.catmullRomBy(...)`

These classes are now ES6 subclasses of `cc.ActionInterval`/`cc.CardinalSplineTo`/`cc.CardinalSplineBy` with
their original factory helpers preserved on the `cc` namespace.

Follow the same cloning and update logic as in the actions migration.

---

## 8. Mechanical Migration Checklist

For each file you migrate:

1. **Wrap in an ES6 class**
   - `cc.X = cc.Y.extend({ ... })` → `cc.X = class X extends cc.Y { ... }`.

2. **Convert `ctor` to `constructor`**
   - Insert `super(...);` as the first line.
   - Move any `this.*` initialization after `super`.

3. **Update parent calls**
   - `cc.Parent.prototype.method.call(this, ...)` → `super.method(...)` (when Parent is the superclass).

4. **Keep factories**
   - Leave `cc.helperX(...) { return new cc.X(...); }` intact, updating only the constructor name if needed.

5. **Handle statics**
   - Move `statics:` members to `static` methods or `cc.X.SOMETHING = ...`.

6. **Reattach `.extend` where needed**
   - For extensible engine bases: `cc.X.extend = cc.Class.extend;`.

7. **Search for leftovers**
   - Search for `cc.*.prototype.*.call(this,` and clean up remaining prototype-based parent calls in that file.

8. **Build/test**
   - Run the Rollup build and load sample scenes to confirm behavior.

---

## 9. Testing and Verification

After migrating a group of files:

- Run the bundle build (e.g. via `npm run build`) to ensure there are no syntax or reference errors.
- Open existing examples that exercise the migrated code:
  - For actions: movement, rotation, scale, fade, tint, sequences, repeats, easing, splines, tweens.
  - For progress timers: any UI or HUD elements using `cc.ProgressTimer` and these actions.
- Compare behavior against the pre-migration build when possible.

---

By following these steps, you can gradually modernize cocos2d-html5 internals to ES6 classes while preserving the public `cc` API and backwards compatibility with most existing projects.
