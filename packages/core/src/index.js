// Boot (barrel — re-exports boot modules; init side-effect runs on import)
import {
  Loader,
  _LogInfos,
  _loadingImage,
  _fpsImage,
  _loaderImage
} from "./boot";

// ======================================================================
// Platform — Foundation
// ======================================================================
import {
  _txtLoader,
  _jsonLoader,
  _jsLoader,
  _imgLoader,
  _serverImgLoader,
  _plistLoader,
  _fontLoader,
  _csbLoader
} from "./platform/loaders";
import { inputManager } from "./platform/input-manager";
import { initInputExtension } from "./platform/input-extension";

// ======================================================================
// Renderer & Utils
// ======================================================================
import { RendererConfig } from "./renderer/renderer-config";
import { initBinaryLoader } from "./utils/binary-loader";

// ======================================================================
// Base Nodes
// ======================================================================
import { AtlasNode } from "./base-nodes/atlas-node";
import { AtlasNodeCanvasRenderCmd } from "./base-nodes/atlas-node-canvas-render-cmd";
import { AtlasNodeWebGLRenderCmd } from "./base-nodes/atlas-node-webgl-render-cmd";

// ======================================================================
// Textures
// ======================================================================
import TextureCache from "./textures/texture-cache";

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
  wrapInspection as LabelTTFWrapInspection
} from "./labelttf/label-ttf-canvas-render-cmd";
import { WebGLRenderCmd as LabelTTFWebGLRenderCmd } from "./labelttf/label-ttf-webgl-render-cmd";

// ======================================================================
// Kazmath
// ======================================================================
import { KMGLMatrix } from "./kazmath";

// ======================================================================
// Namespace assignments
// ======================================================================

// Boot — Debugger (used internally)
Loader.getInstance()._LogInfos = _LogInfos;

// Boot — Base64 images (used internally)
Loader.getInstance()._loadingImage = _loadingImage;
Loader.getInstance()._fpsImage = _fpsImage;
Loader.getInstance()._loaderImage = _loaderImage;

// Platform — Loaders
Loader.getInstance().register(
  ["txt", "xml", "vsh", "fsh", "atlas"],
  _txtLoader
);
Loader.getInstance().register(["json", "ExportJson"], _jsonLoader);
Loader.getInstance().register(["js"], _jsLoader);
Loader.getInstance().register(
  ["png", "jpg", "bmp", "jpeg", "gif", "ico", "tiff", "webp"],
  _imgLoader
);
Loader.getInstance().register(["serverImg"], _serverImgLoader);
Loader.getInstance().register(["plist"], _plistLoader);
Loader.getInstance().register(
  ["font", "eot", "ttf", "woff", "svg", "ttc"],
  _fontLoader
);
Loader.getInstance().register(["csb"], _csbLoader);

// Render command wiring
Sprite.CanvasRenderCmd = SpriteCanvasRenderCmd;
Sprite.WebGLRenderCmd = SpriteWebGLRenderCmd;
AtlasNode.CanvasRenderCmd = AtlasNodeCanvasRenderCmd;
AtlasNode.WebGLRenderCmd = AtlasNodeWebGLRenderCmd;
LabelTTF.wrapInspection = LabelTTFWrapInspection;
LabelTTF.CacheCanvasRenderCmd = LabelTTFCacheCanvasRenderCmd;
LabelTTF.CanvasRenderCmd = LabelTTFCanvasRenderCmd;
LabelTTF.WebGLRenderCmd = LabelTTFWebGLRenderCmd;

// ======================================================================
// Init functions (must run AFTER class assignments)
// ======================================================================
initInputExtension(inputManager);
initBinaryLoader();
KMGLMatrix.getInstance().lazyInitialize();

// ======================================================================
// Named re-exports for direct imports from other packages
// ======================================================================
export { Point, pointEqualToPoint } from "./cocoa/geometry/point";
export { Size } from "./cocoa/geometry/size";
export { cardinalSplineAt, getControlPointAt } from "./cocoa/geometry/spline-utils";
export { Vertex3F, Quad3, V3F_C4B_T2F } from "./platform/types/vertex";
export {
  rand,
  NextPOT,
  incrementGLDraws,
  arrayVerifyType,
  contentScaleFactor
} from "./platform/macro/utils";
export { log, warn } from "./boot/debugger";
export { RendererConfig } from "./renderer/renderer-config";
// Export rendererConfig singleton instance
export const rendererConfig = RendererConfig.getInstance();
export { Director, DisplayLinkDirector } from "./director/director";
export { Sys } from "./boot";
export { NewClass, classManager } from "./platform/class";
export { Rect } from "./cocoa/geometry/rect";
export {
  VERTEX_ATTRIB_POSITION,
  VERTEX_ATTRIB_COLOR,
  VERTEX_ATTRIB_TEX_COORDS,
  SHADER_POSITION_TEXTURE,
  SHADER_POSITION_LENGTHTEXTURECOLOR,
  SRC_ALPHA
} from "./platform/macro/constants";
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
// Export TextureCache class and singleton instance
export { default as TextureCache } from "./textures/texture-cache";
export const textureCache = TextureCache.getInstance();
export { GLProgramState, ShaderCache } from "./shaders";
export { GLStateCache } from "./shaders/CCGLStateCache";
export {
  glBlendFunc,
  glBindTexture2D,
  setProjectionMatrixDirty
} from "./shaders/CCGLStateCache";
export {
  Matrix4,
  KM_GL_MODELVIEW,
  KM_GL_PROJECTION,
  kmGLMatrixMode,
  kmGLLoadMatrix,
  kmGLLoadIdentity,
  kmGLMultMatrix,
  kmGLPushMatrix,
  kmGLPopMatrix,
  KMGLMatrix
} from "./kazmath";
export {
  ACTION_TAG_INVALID,
  FLT_EPSILON,
  FLT_MAX,
  ONE,
  ONE_MINUS_SRC_ALPHA,
  SHADER_SPRITE_POSITION_TEXTURECOLOR
} from "./platform/macro/constants";
export {
  ENABLE_STACKABLE_ACTIONS,
  DRAWNODE_TOTAL_VERTICES
} from "./platform/config";
export { Color, color } from "./platform/types/color";
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
export { Configuration } from "./configuration";
export { glUseProgram } from "./shaders/CCGLStateCache";
export { setProgramForNode } from "./shaders/utils";
export {
  SHADER_POSITION_TEXTURECOLORALPHATEST,
  UNIFORM_ALPHA_TEST_VALUE_S,
  UNIFORM_MVMATRIX_S
} from "./platform/macro/constants";
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
  TEXT_ALIGNMENT_LEFT,
  TEXT_ALIGNMENT_CENTER,
  TEXT_ALIGNMENT_RIGHT
} from "./platform/types/color";
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
export { SpriteFrame } from "./sprites/sprite-frame";
export { Component } from "./components/component";
export { assert, error } from "./boot";
export {
  VERTICAL_TEXT_ALIGNMENT_TOP,
  VERTICAL_TEXT_ALIGNMENT_CENTER,
  VERTICAL_TEXT_ALIGNMENT_BOTTOM
} from "./platform/types/color";
export { FontDefinition } from "./platform/types/font-definition";
export { default as Touch } from "./event-manager/touch";
export { default as EventFocus } from "./event-manager/event/event-focus";
export { NODE_TAG_INVALID, s_globalOrderOfArrival, setGlobalOrderOfArrival } from "./base-nodes/node";
export { screen } from "./platform/screen";
export { default as SpriteFrameCache } from "./sprites/sprite-frame-cache";
export { LayerGradient } from "./layers/layer-gradient";
export { BLEND_SRC, BLEND_DST, SHADER_SPRITE_POSITION_TEXTURECOLOR_GRAY, DST_COLOR, ONE_MINUS_SRC_COLOR, ONE_MINUS_DST_COLOR, FLT_MIN, BATCH_VERTEX_COUNT, ATTRIBUTE_NAME_COLOR, ATTRIBUTE_NAME_POSITION, ATTRIBUTE_NAME_TEX_COORD, DST_ALPHA, SRC_COLOR, ONE_MINUS_DST_ALPHA, ORIENTATION_LANDSCAPE } from "./platform/macro/constants";
export { OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA } from "./platform/config";
export { INVALID_INDEX, REPEAT_FOREVER } from "./platform/macro/constants";
export { rectPointsToPixels } from "./platform/macro/utils";
export { Path, Game, Loader, Engine } from "./boot";
export { EGLView } from "./platform/egl-view/egl-view";
export { AffineTransform } from "./cocoa/affine-transform";
export { TextureAtlas } from "./textures/texture-atlas";
export { isObject } from "./boot";
export { V3F_C4B_T2F_Quad, V3F_C4B_T2F_QuadZero } from "./platform/types/vertex";
export { SHADER_POSITION_TEXTURECOLOR } from "./platform/macro/constants";
export { glBlendFuncForParticle } from "./shaders/CCGLStateCache";
export { randomMinus1To1 } from "./platform/macro/utils";
export { FMT_PNG, FMT_TIFF, getImageFormatByData } from "./platform/common";
export { SAXParser } from "./platform/sax-parser/sax-parser";
export { _txtLoader } from "./platform/loaders";
export { SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST } from "./platform/macro/constants";
export { default as EventMouse } from "./event-manager/event/event-mouse";
export { default as EventTouch } from "./event-manager/event/event-touch";
export { default as EventCustom } from "./event-manager/event/event-custom";
export { default as EventKeyboard } from "./event-manager/event-extension/event-keyboard";
export { ZERO, REPEAT, LINEAR } from "./platform/macro/constants";
export { GLProgram } from "./shaders";
export { default as AnimationCache } from "./sprites/animation-cache";
export { inputManager } from "./platform/input-manager";
export { Scheduler } from "./scheduler";
export { ActionManager } from "./action-manager";
export { LayerMultiplex } from "./layers/layer-multiplex";
export { Device } from "./platform/device";
export { isArray, isNumber } from "./boot/utils";
export { vertexLineToPolygon } from "./support/vertex";
export { plistParser } from "./platform/sax-parser";
export { DirtyRegion } from "./renderer/dirty-region";
export { _convertResponseBodyToText } from "./utils/binary-loader";
