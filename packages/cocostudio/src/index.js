// Initialize the ccs global namespace before any module runs.
import { Node, Sprite, Component } from "@aspect/core";

window.ccs = window.ccs || {};

ccs.Node = Node;
ccs.Sprite = Sprite;
ccs.Component = Component;

ccs.cocostudioVersion = "v1.3.0.0";

// ─── Armature ────────────────────────────────────────────────────────────────
export * from './armature/armature-define.js';
export * from './armature/utils/data-reader-helper.js';
export * from './armature/utils/sprite-frame-cache-helper.js';
export * from './armature/utils/transform-help.js';
export * from './armature/animation/tween-function.js';
export * from './armature/utils/util-math.js';
export * from './armature/utils/armature-data-manager.js';
export * from './armature/utils/datas.js';
export * from './armature/display/decorative-display.js';
export * from './armature/display/display-factory.js';
export * from './armature/display/display-manager.js';

import { Skin } from './armature/display/skin.js';
import { SkinCanvasRenderCmd, SkinWebGLRenderCmd } from './armature/display/skin-render-cmd.js';
Skin.CanvasRenderCmd = SkinCanvasRenderCmd;
Skin.WebGLRenderCmd = SkinWebGLRenderCmd;
export { Skin } from './armature/display/skin.js';
export * from './armature/display/skin-render-cmd.js';

export * from './armature/animation/process-base.js';
export * from './armature/animation/armature-animation.js';
export * from './armature/animation/tween.js';
export * from './armature/physics/collider-detector.js';

import { Armature } from './armature/armature.js';
import { ArmatureCanvasRenderCmd } from './armature/armature-canvas-render-cmd.js';
import { ArmatureWebGLRenderCmd } from './armature/armature-webgl-render-cmd.js';
Armature.CanvasRenderCmd = ArmatureCanvasRenderCmd;
Armature.WebGLRenderCmd = ArmatureWebGLRenderCmd;
export { Armature } from './armature/armature.js';
export * from './armature/armature-canvas-render-cmd.js';
export * from './armature/armature-webgl-render-cmd.js';

export * from './armature/bone.js';

// ─── Action ──────────────────────────────────────────────────────────────────
export * from './action/action-frame.js';
export * from './action/action-manager.js';
export * from './action/action-node.js';
export * from './action/action-object.js';

// ─── Components ──────────────────────────────────────────────────────────────
export * from './components/com-attribute.js';
export * from './components/com-audio.js';
export * from './components/com-controller.js';
export * from './components/com-render.js';

// ─── Trigger ─────────────────────────────────────────────────────────────────
export * from './trigger/object-factory.js';
export * from './trigger/trigger-base.js';
export * from './trigger/trigger-mng.js';
export * from './trigger/trigger-obj.js';

// ─── Timeline ────────────────────────────────────────────────────────────────
export * from './timeline/action-timeline.js';
export * from './timeline/frame.js';
export * from './timeline/timeline.js';
export * from './timeline/skin-node.js';
export * from './timeline/bone-node.js';
export * from './timeline/skeleton-node.js';

// ─── Loader ──────────────────────────────────────────────────────────────────
export * from './loader/load.js';
import './loader/action-parser.js';
import './loader/timeline-parser.js';
