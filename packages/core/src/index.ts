// Boot (barrel — re-exports boot modules; init side-effect runs on import)
import "./boot";

// ======================================================================
// Platform — Foundation
// ======================================================================

// ======================================================================
// Renderer & Utils
// ======================================================================
import { ServiceLocator } from "./service-locator";
import { KMGLMatrix } from "./kazmath";
import type { Mat4Like } from "./kazmath";

// ======================================================================
// Base Nodes
// ======================================================================
import { Node } from "./base-nodes/node";
import { CanvasRenderCmd as NodeCanvasRenderCmd } from "./base-nodes/node-canvas-render-cmd";
import { WebGLRenderCmd as NodeWebGLRenderCmd } from "./base-nodes/node-webgl-render-cmd";
import { AtlasNode } from "./base-nodes/atlas-node";
import { AtlasNodeCanvasRenderCmd } from "./base-nodes/atlas-node-canvas-render-cmd";
import { AtlasNodeWebGLRenderCmd } from "./base-nodes/atlas-node-webgl-render-cmd";

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

// ======================================================================
// Kazmath
// ======================================================================

// ======================================================================
// Namespace assignments
// ======================================================================

// Construct, wire and configure all core services up front. All service setup
// (dependency injection, loader registration, matrix init) lives in the
// locator, so index.js never manipulates service instances directly.
ServiceLocator.construct();

// Render command wiring
Node.CanvasRenderCmd = NodeCanvasRenderCmd;
Node.WebGLRenderCmd = NodeWebGLRenderCmd;
Layer.CanvasRenderCmd = LayerCanvasRenderer;
Layer.WebGLRenderCmd = LayerWebGLRenderer;
Sprite.CanvasRenderCmd = SpriteCanvasRenderCmd;
Sprite.WebGLRenderCmd = SpriteWebGLRenderCmd;
AtlasNode.CanvasRenderCmd = AtlasNodeCanvasRenderCmd;
AtlasNode.WebGLRenderCmd = AtlasNodeWebGLRenderCmd;
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
  DensityDPI,
  DeviceOrientation,
  DirectorEvent,
  DirectorProjection,
  EventListenerType,
  EventType,
  CONFIG_KEY,
  ConfigurationValueType,
  GameEvent,
  ImageFormat,
  GLServerState,
  GLState,
  Language,
  OperatingSystem,
  Platform,
  GLVersion,
  RenderType,
  ResolutionPolicyType,
  ShaderName,
  TextAlignment,
  Uniform,
  UniformName,
  VertexAttribFlag,
  VertexAttribute,
  VerticalTextAlignment,
  AttributeName,
  MouseEvent,
  MouseButton,
  TouchEvent,
  UserRenderMode,
  UniformValueType
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
  _txtLoader,
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
export { Director, DisplayLinkDirector } from "./director/director";
export { Sys } from "./sys";
export { Texture2D } from "./textures/texture-2d";
export {
  PIXEL_FORMAT_RGBA8888,
  PIXEL_FORMAT_RGB888,
  PIXEL_FORMAT_RGB565,
  PIXEL_FORMAT_A8,
  PIXEL_FORMAT_I8,
  PIXEL_FORMAT_AI88,
  PIXEL_FORMAT_RGBA4444,
  PIXEL_FORMAT_RGB5A1,
  PIXEL_FORMAT_PVRTC4,
  PIXEL_FORMAT_PVRTC2,
  PIXEL_FORMAT_DEFAULT,
  defaultPixelFormat,
  PIXEL_FORMAT_NAMES,
  PIXEL_FORMAT_BITS
} from "./textures/constants";
// Export TextureCache class
export { default as TextureCache } from "./textures/texture-cache";
export { GLProgramState, ShaderCache } from "./shaders";
export { GLStateCache } from "./shaders/CCGLStateCache";
export {
  glBlendFunc,
  glBindTexture2D,
  setProjectionMatrixDirty
} from "./shaders/CCGLStateCache";
export { Matrix4, KMGLMatrix } from "./kazmath";
export const KM_GL_MODELVIEW = KMGLMatrix.KM_GL_MODELVIEW;
export const KM_GL_PROJECTION = KMGLMatrix.KM_GL_PROJECTION;
export const KM_GL_TEXTURE = KMGLMatrix.KM_GL_TEXTURE;
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
export { GlobalVertexBuffer } from "./renderer/global-vertex-buffer";
export { Animation } from "./sprites/animation/animation";
export { AnimationFrame } from "./sprites/animation/animation-frame";
export { Node } from "./base-nodes/node";
export { Scene } from "./scenes/scene";
export { LoaderScene } from "./scenes/loader-scene";
export { LayerColor } from "./layers/layer-color";
export * from "./event-manager";
export {
  CanvasRenderCmd as NodeCanvasRenderCmd,
  CustomRenderCmd
} from "./base-nodes/node-canvas-render-cmd";
export { WebGLRenderCmd as NodeWebGLRenderCmd } from "./base-nodes/node-webgl-render-cmd";
export { CanvasContextWrapper } from "./renderer/renderer-canvas";
export { Sprite } from "./sprites/sprite";
export { Configuration } from "./sys/configuration";
export { glUseProgram } from "./shaders/CCGLStateCache";
export { setProgramForNode } from "./shaders/utils";
export { KEY } from "./enums";
export { LabelTTF } from "./labelttf/label-ttf";
export { AtlasNode } from "./base-nodes/atlas-node";
export { SpriteBatchNode } from "./sprites/sprite-batch-node";
export { Layer } from "./layers/layer";
export { isFunction, isString } from "./boot/utils";
export { SpriteFrame } from "./sprites/sprite-frame";
export { PolygonInfo, Triangles } from "./sprites/polygon-info";
export { Component, ComponentContainer } from "./components";
export { assert, error, Path, Loader, isObject, isUndefined } from "./boot";
export {
  NODE_TAG_INVALID,
  s_globalOrderOfArrival,
  setGlobalOrderOfArrival
} from "./base-nodes/node";
export { default as SpriteFrameCache } from "./sprites/sprite-frame-cache";
export { LayerGradient } from "./layers/layer-gradient";
export { TextureAtlas } from "./textures/texture-atlas";
export { glBlendFuncForParticle } from "./shaders/CCGLStateCache";
export { GLProgram } from "./shaders";
export { default as AnimationCache } from "./sprites/animation-cache";
export { Scheduler } from "./scheduler";
export { ActionManager } from "./action-manager";
export { LayerMultiplex } from "./layers/layer-multiplex";
export { isArray, isNumber } from "./boot/utils";
export { DirtyRegion } from "./renderer/dirty-region";
export { _convertResponseBodyToText } from "./utils/binary-loader";
export { ServiceLocator } from "./service-locator";
