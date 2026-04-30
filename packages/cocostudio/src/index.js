// Must be first: initializes the ccs global namespace
import './setup.js';

// ─── Armature ────────────────────────────────────────────────────────────────
export * from './armature-define.js';
export * from './data-reader-helper.js';
export * from './sprite-frame-cache-helper.js';
export * from './transform-help.js';
export * from './tween-function.js';
export * from './util-math.js';
export * from './armature-data-manager.js';
export * from './datas.js';
export * from './decorative-display.js';
export * from './display-factory.js';
export * from './display-manager.js';

import { Skin } from './skin.js';
import { SkinCanvasRenderCmd, SkinWebGLRenderCmd } from './skin-render-cmd.js';
Skin.CanvasRenderCmd = SkinCanvasRenderCmd;
Skin.WebGLRenderCmd = SkinWebGLRenderCmd;
export { Skin } from './skin.js';
export * from './skin-render-cmd.js';

export * from './process-base.js';
export * from './armature-animation.js';
export * from './tween.js';
export * from './collider-detector.js';

import { Armature } from './armature.js';
import { ArmatureCanvasRenderCmd } from './armature-canvas-render-cmd.js';
import { ArmatureWebGLRenderCmd } from './armature-webgl-render-cmd.js';
Armature.CanvasRenderCmd = ArmatureCanvasRenderCmd;
Armature.WebGLRenderCmd = ArmatureWebGLRenderCmd;
export { Armature } from './armature.js';
export * from './armature-canvas-render-cmd.js';
export * from './armature-webgl-render-cmd.js';

export * from './bone.js';

// ─── Action ──────────────────────────────────────────────────────────────────
export * from './action-frame.js';
export * from './action-manager.js';
export * from './action-node.js';
export * from './action-object.js';

// ─── Components ──────────────────────────────────────────────────────────────
export * from './com-attribute.js';
export * from './com-audio.js';
export * from './com-controller.js';
export * from './com-render.js';

// ─── Trigger ─────────────────────────────────────────────────────────────────
export * from './object-factory.js';
export * from './trigger-base.js';
export * from './trigger-mng.js';
export * from './trigger-obj.js';

// ─── Timeline ────────────────────────────────────────────────────────────────
export * from './action-timeline.js';
export * from './frame.js';
export * from './timeline.js';
export * from './skin-node.js';
export * from './bone-node.js';
export * from './skeleton-node.js';

// ─── Loader ──────────────────────────────────────────────────────────────────
export * from './load.js';
import './action-parser.js';
import './timeline-parser.js';
