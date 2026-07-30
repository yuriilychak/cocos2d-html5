import { ServiceLocator } from "./service-locator";

// Construct, wire and configure all core services up front. All service setup
// (dependency injection, loader registration, matrix init) lives in the
// locator, so index.js never manipulates service instances directly.
ServiceLocator.construct();

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
  NodeComponentName,
  NodeStateCallbackType,
  TouchEvent,
  UserRenderMode,
  UniformValueType,
  LoaderStrategyKey,
  KEY
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
export { Texture2D, defaultPixelFormat, PIXEL_FORMAT_NAMES, PIXEL_FORMAT_BITS, TextureAtlas } from "./textures";
export { GLProgramState, GLProgram, setProgramForNode } from "./shaders";
export type {
  Matrix4, 
  KMGLMatrix,
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
export { GlobalVertexBuffer, CanvasContextWrapper, RendererCanvas } from "./sys";
export { Scene, LoaderScene } from "./scenes";
export * from "./event-manager";
export {
  NODE_TAG_INVALID,
  s_globalOrderOfArrival,
  setGlobalOrderOfArrival,
  Node,
  NodeActionManager,
  NodeColor,
  NodeOrder,
  NodeScheduler,
  NodeTransform,
  AtlasNode,
  WebGLRenderCmd as NodeWebGLRenderCmd,
  CanvasRenderCmd as NodeCanvasRenderCmd,
  CustomRenderCmd
} from "./base-nodes";
export { Sprite } from "./sprites";
export { LabelTTF } from "./labelttf";
export { Animation, AnimationFrame, PolygonInfo, Triangles, SpriteFrame, type TriangleLike, type TriangleVertex, SpriteBatchNode } from "./sprites";
export { Component, ComponentContainer } from "./components";
export { assert, error, Path, Loader, isObject, isUndefined, LoaderStrategy, isString, isFunction, isNumber, isArray, log, warn } from "./boot";
export { LayerGradient, Layer, LayerMultiplex, LayerColor } from "./layers";
export { Scheduler } from "./scheduler";
export { ActionManager } from "./action-manager";
export { ServiceLocator } from "./service-locator";
