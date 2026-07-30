import { Sprite } from "./sprite";
import { SpriteCanvasRenderCmd } from "./sprite-canvas-render-cmd";
import { SpriteWebGLRenderCmd } from "./sprite-webgl-render-cmd";

Sprite.CanvasRenderCmd = SpriteCanvasRenderCmd;
Sprite.WebGLRenderCmd = SpriteWebGLRenderCmd;

export { Sprite, SpriteCanvasRenderCmd, SpriteWebGLRenderCmd };
export { PolygonInfo } from "./polygon-info";
export { Triangles } from "./triangles";
export { Animation, AnimationFrame } from './animation';
export { SpriteFrame } from './sprite-frame';
export type { TriangleLike, TriangleVertex } from "./types";
export { default as SpriteFrameCache } from './sprite-frame-cache';
export { default as AnimationCache } from './animation-cache';
export { SpriteBatchNode } from './sprite-batch-node';
