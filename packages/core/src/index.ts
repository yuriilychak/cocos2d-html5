// Boot (barrel — re-exports boot modules; init side-effect runs on import)
import "./boot";

// ======================================================================
// Renderer & Utils
// ======================================================================
import { ServiceLocator } from "./service-locator";
import { KMGLMatrixMode } from "./enums";
import type { Mat4Like } from "./kazmath";

// ======================================================================
// Layers
// ======================================================================
import { Layer } from "./layers/layer";
import { LayerCanvasRenderer, LayerWebGLRenderer } from "./layers/renderer";

// ======================================================================
// Textures
// ======================================================================

// ======================================================================
// Sprites
// ======================================================================
import { Sprite } from "./sprites/sprite";
import { SpriteCanvasRenderCmd } from "./sprites/sprite-canvas-render-cmd";
import { SpriteWebGLRenderCmd } from "./sprites/sprite-webgl-render-cmd";

// ======================================================================
// LabelTTF
// ======================================================================
import { LabelTTF } from "./labelttf/label-ttf";
import {
  CanvasRenderCmd as LabelTTFCanvasRenderCmd,
  CacheCanvasRenderCmd as LabelTTFCacheCanvasRenderCmd,
  wrapInspection as LabelTTFWrapInspection,
  _wordRex as LabelTTFWordRex,
  _symbolRex as LabelTTFSymbolRex,
  _lastWordRex as LabelTTFLastWordRex,
  _lastEnglish as LabelTTFLastEnglish,
  _firsrEnglish as LabelTTFFirsrEnglish
} from "./labelttf/label-ttf-canvas-render-cmd";
import { WebGLRenderCmd as LabelTTFWebGLRenderCmd } from "./labelttf/label-ttf-webgl-render-cmd";

// Construct, wire and configure all core services up front. All service setup
// (dependency injection, loader registration, matrix init) lives in the
// locator, so index.js never manipulates service instances directly.
ServiceLocator.construct();

// Render command wiring
Layer.CanvasRenderCmd = LayerCanvasRenderer;
Layer.WebGLRenderCmd = LayerWebGLRenderer;
Sprite.CanvasRenderCmd = SpriteCanvasRenderCmd;
Sprite.WebGLRenderCmd = SpriteWebGLRenderCmd;
LabelTTF.wrapInspection = LabelTTFWrapInspection;
LabelTTF._wordRex = LabelTTFWordRex;
LabelTTF._symbolRex = LabelTTFSymbolRex;
LabelTTF._lastWordRex = LabelTTFLastWordRex;
LabelTTF._lastEnglish = LabelTTFLastEnglish;
LabelTTF._firsrEnglish = LabelTTFFirsrEnglish;
LabelTTF.CacheCanvasRenderCmd = LabelTTFCacheCanvasRenderCmd;
LabelTTF.CanvasRenderCmd = LabelTTFCanvasRenderCmd;
LabelTTF.WebGLRenderCmd = LabelTTFWebGLRenderCmd;

// ======================================================================
// Named re-exports for direct imports from other packages
// ======================================================================
export {
  Point,
  Size,
  Rect,
  AffineTransform,
  cardinalSplineAt,
  getControlPointAt
} from "./geometry";
export {
  BrowserType,
  DebugMode,
  ALIGN,
  DensityDPI,
  DeviceOrientation,
  DirectorEvent,
  DirectorProjection,
  EventListenerType,
  EventType,
  CONFIG_KEY,
  ContainerStrategyKey,
  ContentStrategyKey,
  ConfigurationValueType,
  GameEvent,
  ImageFormat,
  KMGLMatrixMode,
  GLServerState,
  GLState,
  Language,
  OperatingSystem,
  PIXEL_FORMAT,
  Platform,
  GLVersion,
  RenderType,
  ShaderName,
  ShaderType,
  TextAlignment,
  Uniform,
  UniformName,
  VertexAttribFlag,
  VertexAttribute,
  VertexType,
  VerticalTextAlignment,
  AttributeName,
  MouseEvent,
  MouseButton,
  NodeStateCallbackType,
  TouchEvent,
  UserRenderMode,
  UniformValueType,
  LoaderStrategyKey
} from "./enums";
export {
  ACTION_TAG_INVALID,
  Acceleration,
  BATCH_VERTEX_COUNT,
  BaseClass,
  BlendFunc,
  Color,
  ContainerStrategy,
  ContentStrategy,
  CURRENT_ITEM,
  DISABLE_TAG,
  DRAWNODE_TOTAL_VERTICES,
  EGLView,
  ENABLE_STACKABLE_ACTIONS,
  FIX_ARTIFACTS_BY_STRECHING_TEXEL,
  FLT_EPSILON,
  FLT_MAX,
  FLT_MIN,
  FontDefinition,
  INVALID_INDEX,
  InputManager,
  ITEM_SIZE,
  LABELATLAS_DEBUG_DRAW,
  NextPOT,
  NORMAL_TAG,
  OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA,
  Quad3,
  randomMinus1To1,
  rand,
  REPEAT_FOREVER,
  ResolutionPolicy,
  SAXParser,
  Screen,
  SELECTED_TAG,
  UINT_MAX,
  V3F_C4B_T2F,
  V3F_C4B_T2F_Quad,
  Vertex3F,
  VisibleRect,
  ZOOM_ACTION_TAG,
  arrayRemoveObject,
  arrayVerifyType,
  classManager,
  contentScaleFactor,
  degreesToRadians,
  getImageFormatByData,
  incrementGLDraws,
  lerp,
  plistParser,
  pointPixelsToPoints,
  radiansToDegrees,
  rectPixelsToPoints,
  rectPointsToPixels,
  sizePixelsToPoints,
  vertexLineToPolygon
} from "./platform";
export { log, warn } from "./boot/debugger";
export { RendererConfig } from "./sys/renderer-config";
export { default as Director } from "./director";
export { Sys } from "./sys";
export { Texture2D, defaultPixelFormat, PIXEL_FORMAT_NAMES, PIXEL_FORMAT_BITS } from "./textures";
// Export TextureCache class
export { default as TextureCache } from "./textures/texture-cache";
export { GLProgramState, ShaderCache } from "./shaders";
export { GLStateCache } from "./shaders/gl-state-cache";
export { Matrix4, KMGLMatrix } from "./kazmath";
export const KM_GL_MODELVIEW = KMGLMatrixMode.MODELVIEW;
export const KM_GL_PROJECTION = KMGLMatrixMode.PROJECTION;
export const KM_GL_TEXTURE = KMGLMatrixMode.TEXTURE;
export function kmGLMatrixMode(mode: number): void {
  ServiceLocator.kmglMatrix.matrixMode(mode);
}
export function kmGLPushMatrix(): void {
  ServiceLocator.kmglMatrix.pushMatrix();
}
export function kmGLPopMatrix(): void {
  ServiceLocator.kmglMatrix.popMatrix();
}
export function kmGLLoadMatrix(matrix: Mat4Like): void {
  ServiceLocator.kmglMatrix.loadMatrix(matrix);
}
export type {
  AABBLike,
  Mat3Like,
  Mat4Like,
  Matrix4StackLike,
  NumericArrayLike,
  PlaneLike,
  QuaternionLike,
  QuaterionLike,
  Ray2Like,
  Vec2Like,
  Vec3Like,
  Vec4Like
} from "./kazmath";
export { BYTE, FULL_BYTE } from "./constants";
export { default as GlobalVertexBuffer } from "./sys/renderer/global-vertex-buffer";

export { Scene } from "./scenes/scene";
export { LoaderScene } from "./scenes/loader-scene";
export { LayerColor } from "./layers/layer-color";
export * from "./event-manager";
export {
  NODE_TAG_INVALID,
  s_globalOrderOfArrival,
  setGlobalOrderOfArrival,
  Node,
  AtlasNode,
  WebGLRenderCmd as NodeWebGLRenderCmd,
  CanvasRenderCmd as NodeCanvasRenderCmd,
  CustomRenderCmd
} from "./base-nodes";
export { CanvasContextWrapper, RendererCanvas } from "./sys/renderer";
export { Sprite } from "./sprites/sprite";
export { Configuration } from "./sys/configuration";
export { setProgramForNode } from "./shaders/utils";
export { KEY } from "./enums";
export { LabelTTF } from "./labelttf/label-ttf";
export { SpriteBatchNode } from "./sprites/sprite-batch-node";
export { Layer } from "./layers/layer";
export { isFunction, isString } from "./boot/utils";
export { Animation, AnimationFrame, PolygonInfo, Triangles, SpriteFrame, type TriangleLike, type TriangleVertex } from "./sprites";
export { Component, ComponentContainer } from "./components";
export { assert, error, Path, Loader, isObject, isUndefined, LoaderStrategy } from "./boot";
export { LayerGradient } from "./layers/layer-gradient";
export { TextureAtlas } from "./textures/texture-atlas";
export { GLProgram } from "./shaders";
export { Scheduler } from "./scheduler";
export { ActionManager } from "./action-manager";
export { LayerMultiplex } from "./layers/layer-multiplex";
export { isArray, isNumber } from "./boot/utils";
export { default as DirtyRegion } from "./sys/renderer/dirty-region";
export { ServiceLocator } from "./service-locator";
