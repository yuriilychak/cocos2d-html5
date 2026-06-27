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
export { Point, Size, Rect, AffineTransform, cardinalSplineAt, getControlPointAt } from "./geometry";
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
export { Vertex3F, Quad3, V3F_C4B_T2F } from "./platform/types/vertex";
export {
  rand,
  NextPOT,
  incrementGLDraws,
  arrayVerifyType,
  contentScaleFactor
} from "./platform/macro/utils";
export { log, warn } from "./boot/debugger";
export { RendererConfig } from "./sys/renderer-config";
export { Director, DisplayLinkDirector } from "./director/director";
export { Sys } from "./sys";
export { BaseClass, classManager } from "./platform/class";
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
export {
  Matrix4,
  KMGLMatrix
} from "./kazmath";
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
export {
  ACTION_TAG_INVALID,
  FLT_EPSILON,
  FLT_MAX
} from "./platform/macro/constants";
export {
  ENABLE_STACKABLE_ACTIONS,
  DRAWNODE_TOTAL_VERTICES
} from "./platform/config";
export { Color, Acceleration } from "./platform/types";
export { BlendFunc } from "./platform/types/blend-func";
export { GlobalVertexBuffer } from "./renderer/global-vertex-buffer";
export { Animation } from "./sprites/animation/animation";
export { AnimationFrame } from "./sprites/animation/animation-frame";
export { Node } from "./base-nodes/node";
export { Scene } from "./scenes/scene";
export { LoaderScene } from "./scenes/loader-scene";
export { LayerColor } from "./layers/layer-color";
export { default as EventManager } from "./event-manager/event-manager";
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
export { isUndefined } from "./boot";
export { KEY } from "./platform/common";
export {
  arrayRemoveObject,
  pointPixelsToPoints,
  sizePixelsToPoints,
  rectPixelsToPoints,
  lerp,
  radiansToDegrees,
  degreesToRadians
} from "./platform/macro/utils";
export { LabelTTF } from "./labelttf/label-ttf";
export { AtlasNode } from "./base-nodes/atlas-node";
export { SpriteBatchNode } from "./sprites/sprite-batch-node";
export { default as EventHelper } from "./event-manager/event-helper";
export {
  FIX_ARTIFACTS_BY_STRECHING_TEXEL,
  LABELATLAS_DEBUG_DRAW
} from "./platform/config";
export { Layer } from "./layers/layer";
export { default as EventListener } from "./event-manager/event-listener/event-listener";
export { isFunction, isString } from "./boot/utils";
export {
  ITEM_SIZE,
  CURRENT_ITEM,
  ZOOM_ACTION_TAG,
  NORMAL_TAG,
  SELECTED_TAG,
  DISABLE_TAG,
  UINT_MAX
} from "./platform/macro/constants";
export { visibleRect } from "./platform/visible-rect";
export { ResolutionPolicy } from "./platform/egl-view/resolution-policy";
export { ContainerStrategy } from "./platform/egl-view/container-strategy";
export { ContentStrategy } from "./platform/egl-view/content-strategy";
export { SpriteFrame } from "./sprites/sprite-frame";
export { PolygonInfo, Triangles } from "./sprites/polygon-info";
export { Component, ComponentContainer } from "./components";
export { assert, error } from "./boot";
export { FontDefinition } from "./platform/types/font-definition";
export { default as Touch } from "./event-manager/touch";
export { default as EventFocus } from "./event-manager/event/event-focus";
export { NODE_TAG_INVALID, s_globalOrderOfArrival, setGlobalOrderOfArrival } from "./base-nodes/node";
export { Screen } from "./platform/screen";
export { default as SpriteFrameCache } from "./sprites/sprite-frame-cache";
export { LayerGradient } from "./layers/layer-gradient";
export { FLT_MIN, BATCH_VERTEX_COUNT } from "./platform/macro/constants";
export { OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA } from "./platform/config";
export { INVALID_INDEX, REPEAT_FOREVER } from "./platform/macro/constants";
export { rectPointsToPixels } from "./platform/macro/utils";
export { Path, Loader } from "./boot";
export { EGLView } from "./platform/egl-view/egl-view";
export { TextureAtlas } from "./textures/texture-atlas";
export { isObject } from "./boot";
export { V3F_C4B_T2F_Quad, V3F_C4B_T2F_QuadZero } from "./platform/types/vertex";
export { glBlendFuncForParticle } from "./shaders/CCGLStateCache";
export { randomMinus1To1 } from "./platform/macro/utils";
export { getImageFormatByData } from "./platform/common";
export { SAXParser } from "./platform/sax-parser/sax-parser";
export { _txtLoader } from "./platform/loaders";
export { default as EventMouse } from "./event-manager/event/event-mouse";
export { default as EventTouch } from "./event-manager/event/event-touch";
export { default as EventCustom } from "./event-manager/event/event-custom";
export { default as EventKeyboard } from "./event-manager/event-extension/event-keyboard";
export { GLProgram } from "./shaders";
export { default as AnimationCache } from "./sprites/animation-cache";
export { InputManager } from "./platform/input-manager";
export { Scheduler } from "./scheduler";
export { ActionManager } from "./action-manager";
export { LayerMultiplex } from "./layers/layer-multiplex";
export { Device } from "./platform/device";
export { isArray, isNumber } from "./boot/utils";
export { vertexLineToPolygon } from "./support/vertex";
export { plistParser } from "./platform/sax-parser";
export { DirtyRegion } from "./renderer/dirty-region";
export { _convertResponseBodyToText } from "./utils/binary-loader";
export { ServiceLocator } from "./service-locator";
