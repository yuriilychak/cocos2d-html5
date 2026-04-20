// Boot (barrel — re-exports boot modules; init side-effect runs on import)
import {
  each, isFunction, isNumber, isString, isArray,
  isUndefined, isObject, isCrossOrigin, formatStr,
  AsyncPool, Async, Path, Loader,
  create3DContext, Sys, initEngine, Game,
  _LogInfos, log, warn, error, assert, logToWebPage, formatString, initDebugSetting,
  _loadingImage, _fpsImage, _loaderImage
} from "./boot";

// ======================================================================
// Platform — Foundation
// ======================================================================
import { classManager, NewClass } from "./platform/class";
import {
  KEY,
  FMT_JPG,
  FMT_PNG,
  FMT_TIFF,
  FMT_RAWDATA,
  FMT_WEBP,
  FMT_UNKNOWN,
  getImageFormatByData,
  associateWithNative
} from "./platform/common";
import {
  FIX_ARTIFACTS_BY_STRECHING_TEXEL,
  DIRECTOR_STATS_POSITION,
  DIRECTOR_FPS_INTERVAL,
  COCOSNODE_RENDER_SUBPIXEL,
  SPRITEBATCHNODE_RENDER_SUBPIXEL,
  OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA,
  TEXTURE_ATLAS_USE_TRIANGLE_STRIP,
  TEXTURE_ATLAS_USE_VAO,
  TEXTURE_NPOT_SUPPORT,
  RETINA_DISPLAY_FILENAME_SUFFIX,
  USE_LA88_LABELS,
  SPRITE_DEBUG_DRAW,
  SPRITEBATCHNODE_DEBUG_DRAW,
  LABELBMFONT_DEBUG_DRAW,
  LABELATLAS_DEBUG_DRAW,
  DRAWNODE_TOTAL_VERTICES,
  DEFAULT_ENGINE,
  ENGINE_VERSION
} from "./platform/config";
import * as macroConstants from "./platform/macro/constants";
import * as macroUtils from "./platform/macro/utils";
import { SAXParser } from "./platform/sax-parser/sax-parser";
import { PlistParser } from "./platform/sax-parser/plist-parser";
import {
  _txtLoader,
  _jsonLoader,
  _jsLoader,
  _imgLoader,
  _serverImgLoader,
  _plistLoader,
  _fontLoader,
  _binaryLoader,
  _csbLoader
} from "./platform/loaders";
import { screen } from "./platform/screen";
import { visibleRect } from "./platform/visible-rect";
import {
  UIInterfaceOrientationLandscapeLeft,
  UIInterfaceOrientationLandscapeRight,
  UIInterfaceOrientationPortraitUpsideDown,
  UIInterfaceOrientationPortrait,
  inputManager
} from "./platform/input-manager";
import { initInputExtension } from "./platform/input-extension";

// Platform — Types
import {
  Color,
  color,
  colorEqual,
  hexToColor,
  colorToHex,
  Acceleration,
  TEXT_ALIGNMENT_LEFT,
  TEXT_ALIGNMENT_CENTER,
  TEXT_ALIGNMENT_RIGHT,
  VERTICAL_TEXT_ALIGNMENT_TOP,
  VERTICAL_TEXT_ALIGNMENT_CENTER,
  VERTICAL_TEXT_ALIGNMENT_BOTTOM
} from "./platform/types/color";
import {
  Vertex2F,
  Vertex3F,
  Tex2F,
  Quad2,
  Quad3,
  V3F_C4B_T2F,
  V3F_C4B_T2F_Quad,
  V3F_C4B_T2F_QuadZero,
  V3F_C4B_T2F_QuadCopy,
  V3F_C4B_T2F_QuadsCopy,
  V2F_C4B_T2F,
  V2F_C4B_T2F_Triangle,
  vertex2,
  vertex3,
  tex2
} from "./platform/types/vertex";
import { BlendFunc, blendFuncDisable } from "./platform/types/blend-func";
import { FontDefinition } from "./platform/types/font-definition";
import { _Dictionary } from "./platform/types/dictionary";

// Platform — EGLView
import { EGLView } from "./platform/egl-view/egl-view";
import { ContainerStrategy } from "./platform/egl-view/container-strategy";
import { ContentStrategy } from "./platform/egl-view/content-strategy";
import { ResolutionPolicy } from "./platform/egl-view/resolution-policy";
import {
  Touches,
  TouchesIntergerDict,
  DENSITYDPI_DEVICE,
  DENSITYDPI_HIGH,
  DENSITYDPI_MEDIUM,
  DENSITYDPI_LOW
} from "./platform/egl-view/constants";

// ======================================================================
// Cocoa — Geometry & Transforms
// ======================================================================
import { Point, p, pointEqualToPoint } from "./cocoa/geometry/point";
import { Size, size, sizeEqualToSize } from "./cocoa/geometry/size";
import {
  Rect,
  rect,
  rectEqualToRect,
  _rectEqualToZero,
  rectContainsRect,
  rectGetMaxX,
  rectGetMidX,
  rectGetMinX,
  rectGetMaxY,
  rectGetMidY,
  rectGetMinY,
  rectContainsPoint,
  rectIntersectsRect,
  rectOverlapsRect,
  rectUnion,
  rectIntersection
} from "./cocoa/geometry/rect";
import {
  AffineTransform,
  affineTransformMake,
  pointApplyAffineTransform,
  _pointApplyAffineTransform,
  sizeApplyAffineTransform,
  affineTransformMakeIdentity,
  rectApplyAffineTransform,
  _rectApplyAffineTransformIn,
  affineTransformTranslate,
  affineTransformScale,
  affineTransformRotate,
  affineTransformConcat,
  affineTransformConcatIn,
  affineTransformEqualToTransform,
  affineTransformInvert,
  affineTransformInvertOut
} from "./cocoa/affine-transform";

// ======================================================================
// Support
// ======================================================================
import {
  POINT_EPSILON,
  pNeg,
  pAdd,
  pSub,
  pMult,
  pMidpoint,
  pDot,
  pCross,
  pPerp,
  pRPerp,
  pProject,
  pRotate,
  pUnrotate,
  pLengthSQ,
  pDistanceSQ,
  pLength,
  pDistance,
  pNormalize,
  pForAngle,
  pToAngle,
  clampf,
  pClamp,
  pFromSize,
  pCompOp,
  pLerp,
  pFuzzyEqual,
  pCompMult,
  pAngleSigned,
  pAngle,
  pRotateByAngle,
  pLineIntersect,
  pSegmentIntersect,
  pIntersectPoint,
  pSameAs,
  pZeroIn,
  pIn,
  pMultIn,
  pSubIn,
  pAddIn,
  pNormalizeIn
} from "./support/point-extension";
import {
  vertexLineToPolygon,
  vertexLineIntersect,
  vertexListIsClockwise
} from "./support/vertex";
import { CGAffineToGL, GLToCGAffine } from "./support/transform-utils";

// ======================================================================
// Events
// ======================================================================
import EventHelper from "./event-manager/event-helper";
import Touch from "./event-manager/touch";
import Event from "./event-manager/event/event";
import EventCustom from "./event-manager/event/event-custom";
import EventMouse from "./event-manager/event/event-mouse";
import EventTouch from "./event-manager/event/event-touch";
import EventFocus from "./event-manager/event/event-focus";
import {
  TOUCH,
  KEYBOARD,
  ACCELERATION,
  MOUSE,
  FOCUS,
  CUSTOM
} from "./event-manager/event/constants";
import EventListener from "./event-manager/event-listener/event-listener";
import _EventListenerCustom from "./event-manager/event-listener/event-listener-custom";
import _EventListenerMouse from "./event-manager/event-listener/event-listener-mouse";
import _EventListenerTouchOneByOne from "./event-manager/event-listener/event-listener-touch-one-by-one";
import _EventListenerTouchAllAtOnce from "./event-manager/event-listener/event-listener-touch-all-at-once";
import _EventListenerFocus from "./event-manager/event-listener/event-listener-focus";
import { _EventListenerVector } from "./event-manager/event-manager";
import EventManager from "./event-manager/event-manager";
import EventAcceleration from "./event-manager/event-extension/event-acceleration";
import EventKeyboard from "./event-manager/event-extension/event-keyboard";
import _EventListenerKeyboard from "./event-manager/event-extension/event-listener-keyboard";
import _EventListenerAcceleration from "./event-manager/event-extension/event-listener-acceleration";

// ======================================================================
// Renderer & Utils
// ======================================================================
import { GlobalVertexBuffer } from "./renderer/global-vertex-buffer";
import {
  rendererCanvas,
  CanvasContextWrapper
} from "./renderer/renderer-canvas";
import { rendererWebGL } from "./renderer/renderer-webgl";
import { Region, DirtyRegion } from "./renderer/dirty-region";
import {
  _convertResponseBodyToText,
  loadBinary,
  _str2Uint8Array,
  loadBinarySync,
  initBinaryLoader
} from "./utils/binary-loader";
import { profiler } from "./utils/profiler";

// ======================================================================
// Base Nodes
// ======================================================================
import {
  CustomRenderCmd,
  dirtyFlags,
  RenderCmd,
  CanvasRenderCmd as NodeCanvasRenderCmd
} from "./base-nodes/node-canvas-render-cmd";
import { WebGLRenderCmd as NodeWebGLRenderCmd } from "./base-nodes/node-webgl-render-cmd";
import {
  Node,
  NODE_TAG_INVALID,
  s_globalOrderOfArrival
} from "./base-nodes/node";
import { AtlasNode } from "./base-nodes/atlas-node";
import { AtlasNodeCanvasRenderCmd } from "./base-nodes/atlas-node-canvas-render-cmd";
import { AtlasNodeWebGLRenderCmd } from "./base-nodes/atlas-node-webgl-render-cmd";

// ======================================================================
// Textures (side-effect imports — deferred cc.Texture2D via event handler)
// ======================================================================
import {
  ALIGN_CENTER,
  ALIGN_TOP,
  ALIGN_TOP_RIGHT,
  ALIGN_RIGHT,
  ALIGN_BOTTOM_RIGHT,
  ALIGN_BOTTOM,
  ALIGN_BOTTOM_LEFT,
  ALIGN_LEFT,
  ALIGN_TOP_LEFT
} from "./textures/constants";
import { textureCache } from "./textures/texture-cache";
import { TextureAtlas } from "./textures/texture-atlas";
import "./textures/texture-2d";

// ======================================================================
// Scenes & Layers
// ======================================================================
import { Scene } from "./scenes/scene";
import { LoaderScene } from "./scenes/loader-scene";
import { Layer } from "./layers/layer";
import { LayerColor } from "./layers/layer-color";
import { LayerGradient } from "./layers/layer-gradient";
import { LayerMultiplex } from "./layers/layer-multiplex";
import {
  LayerCanvasRenderCmd,
  LayerColorCanvasRenderCmd,
  LayerGradientCanvasRenderCmd
} from "./layers/layer-canvas-render-cmd";
import {
  LayerWebGLRenderCmd,
  LayerColorWebGLRenderCmd,
  LayerGradientWebGLRenderCmd
} from "./layers/layer-webgl-render-cmd";

// ======================================================================
// Sprites
// ======================================================================
import { Sprite } from "./sprites/sprite";
import { SpriteCanvasRenderCmd } from "./sprites/sprite-canvas-render-cmd";
import { SpriteWebGLRenderCmd } from "./sprites/sprite-webgl-render-cmd";
import { SpriteBatchNode } from "./sprites/sprite-batch-node";
import { BakeSprite } from "./sprites/bake-sprite";
import { AnimationFrame } from "./sprites/animation/animation-frame";
import { Animation } from "./sprites/animation/animation";
import { animationCache } from "./sprites/animation-cache";
import { SpriteFrame } from "./sprites/sprite-frame";
import { spriteFrameCache } from "./sprites/sprite-frame-cache";

// ======================================================================
// Director, Scheduler, ActionManager
// ======================================================================
import { Configuration } from "./configuration";
import {
  Director,
  DisplayLinkDirector,
  g_NumberOfDraws,
  defaultFPS
} from "./director/director";
import { DirectorDelegate } from "./director/director-webgl";
import { Scheduler } from "./scheduler";
import { PI2, DrawingPrimitiveCanvas } from "./drawing-primitives-canvas";
import { DrawingPrimitiveWebGL } from "./drawing-primitives-webgl";

// ======================================================================
// LabelTTF
// ======================================================================
import { LabelTTF } from "./labelttf/label-ttf";
import {
  CanvasRenderCmd as LabelTTFCanvasRenderCmd,
  CacheCanvasRenderCmd as LabelTTFCacheCanvasRenderCmd,
  _textAlign,
  _textBaseline,
  wrapInspection as LabelTTFWrapInspection,
  _wordRex as LabelTTFWordRex,
  _symbolRex as LabelTTFSymbolRex,
  _lastWordRex as LabelTTFLastWordRex,
  _lastEnglish as LabelTTFLastEnglish,
  _firsrEnglish as LabelTTFFirsrEnglish
} from "./labelttf/label-ttf-canvas-render-cmd";
import { WebGLRenderCmd as LabelTTFWebGLRenderCmd } from "./labelttf/label-ttf-webgl-render-cmd";

// ======================================================================
// Action Manager, Components
// ======================================================================
import { HashElement, ActionManager } from "./action-manager";
import { Component } from "./components/component";
import { ComponentContainer } from "./components/component-container";

// ======================================================================
// Kazmath
// ======================================================================
import {
  EPSILON, square, almostEqual,
  Vec2, Vec3, Vec4, Ray2,
  Matrix3, Matrix4, Plane, Quaternion, AABB,
  Matrix4Stack,
  kmMat4Identity, kmMat4Inverse, kmMat4Multiply,
  getMat4MultiplyValue, kmMat4Assign, kmMat4Translation,
  kmMat4PerspectiveProjection, kmMat4LookAt, kmMat4RotationAxisAngle,
  km_mat4_stack_push, km_mat4_stack_pop, km_mat4_stack_release,
  KM_GL_MODELVIEW, KM_GL_PROJECTION, KM_GL_TEXTURE,
  lazyInitialize, kmGLFreeAll,
  kmGLPushMatrix, kmGLPushMatrixWitMat4, kmGLPopMatrix,
  kmGLMatrixMode, kmGLLoadIdentity, kmGLLoadMatrix,
  kmGLMultMatrix, kmGLTranslatef, kmGLRotatef,
  kmGLScalef, kmGLGetMatrix
} from "./kazmath";

// ======================================================================
// cc.* namespace assignments
// ======================================================================

// Boot — Utilities
cc.each = each;
cc.isFunction = isFunction;
cc.isNumber = isNumber;
cc.isString = isString;
cc.isArray = isArray;
cc.isUndefined = isUndefined;
cc.isObject = isObject;
cc.isCrossOrigin = isCrossOrigin;
cc.formatStr = formatStr;

// Boot — Async, Path, Loader
cc.AsyncPool = AsyncPool;
cc.async = Async;
cc.path = Path;
cc.loader = Loader.getInstance();

// Boot — Sys & Engine
cc.create3DContext = create3DContext;
cc.sys = Sys.getInstance();
cc.initEngine = initEngine;

// Boot — Game
cc.game = Game.getInstance();

// Boot — Debugger
cc._LogInfos = _LogInfos;
cc.log = log;
cc.warn = warn;
cc.error = error;
cc.assert = assert;
cc._logToWebPage = logToWebPage;
cc._formatString = formatString;
cc._initDebugSetting = initDebugSetting;

// Boot — Base64 images
cc._loadingImage = _loadingImage;
cc._fpsImage = _fpsImage;
cc._loaderImage = _loaderImage;

// Platform — Foundation
cc.classManager = classManager;
cc.NewClass = NewClass;
cc.Class = NewClass;
cc.KEY = KEY;
cc.FMT_JPG = FMT_JPG;
cc.FMT_PNG = FMT_PNG;
cc.FMT_TIFF = FMT_TIFF;
cc.FMT_RAWDATA = FMT_RAWDATA;
cc.FMT_WEBP = FMT_WEBP;
cc.FMT_UNKNOWN = FMT_UNKNOWN;
cc.getImageFormatByData = getImageFormatByData;
cc.associateWithNative = associateWithNative;

// Platform — Config
cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL = FIX_ARTIFACTS_BY_STRECHING_TEXEL;
cc.DIRECTOR_STATS_POSITION = DIRECTOR_STATS_POSITION;
cc.DIRECTOR_FPS_INTERVAL = DIRECTOR_FPS_INTERVAL;
cc.COCOSNODE_RENDER_SUBPIXEL = COCOSNODE_RENDER_SUBPIXEL;
cc.SPRITEBATCHNODE_RENDER_SUBPIXEL = SPRITEBATCHNODE_RENDER_SUBPIXEL;
cc.OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA =
  OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA;
cc.TEXTURE_ATLAS_USE_TRIANGLE_STRIP = TEXTURE_ATLAS_USE_TRIANGLE_STRIP;
cc.TEXTURE_ATLAS_USE_VAO = TEXTURE_ATLAS_USE_VAO;
cc.TEXTURE_NPOT_SUPPORT = TEXTURE_NPOT_SUPPORT;
cc.RETINA_DISPLAY_FILENAME_SUFFIX = RETINA_DISPLAY_FILENAME_SUFFIX;
cc.USE_LA88_LABELS = USE_LA88_LABELS;
cc.SPRITE_DEBUG_DRAW = SPRITE_DEBUG_DRAW;
cc.SPRITEBATCHNODE_DEBUG_DRAW = SPRITEBATCHNODE_DEBUG_DRAW;
cc.LABELBMFONT_DEBUG_DRAW = LABELBMFONT_DEBUG_DRAW;
cc.LABELATLAS_DEBUG_DRAW = LABELATLAS_DEBUG_DRAW;
cc.DRAWNODE_TOTAL_VERTICES = DRAWNODE_TOTAL_VERTICES;
cc.DEFAULT_ENGINE = DEFAULT_ENGINE;
cc.ENGINE_VERSION = ENGINE_VERSION;

// Platform — Macro constants & utils
Object.assign(cc, macroConstants);
Object.assign(cc, macroUtils);

// Platform — SAX/Plist
cc.SAXParser = SAXParser;
cc.PlistParser = PlistParser;
cc.saxParser = new SAXParser();
cc.plistParser = new PlistParser();

// Platform — Loaders
cc._txtLoader = _txtLoader;
cc._jsonLoader = _jsonLoader;
cc._jsLoader = _jsLoader;
cc._imgLoader = _imgLoader;
cc._serverImgLoader = _serverImgLoader;
cc._plistLoader = _plistLoader;
cc._fontLoader = _fontLoader;
cc._binaryLoader = _binaryLoader;
cc._csbLoader = _csbLoader;

Loader.getInstance().register(["txt", "xml", "vsh", "fsh", "atlas"], _txtLoader);
Loader.getInstance().register(["json", "ExportJson"], _jsonLoader);
Loader.getInstance().register(["js"], _jsLoader);
Loader.getInstance().register(["png", "jpg", "bmp", "jpeg", "gif", "ico", "tiff", "webp"], _imgLoader);
Loader.getInstance().register(["serverImg"], _serverImgLoader);
Loader.getInstance().register(["plist"], _plistLoader);
Loader.getInstance().register(["font", "eot", "ttf", "woff", "svg", "ttc"], _fontLoader);
Loader.getInstance().register(["csb"], _csbLoader);

// Platform — Screen, VisibleRect, InputManager
cc.screen = screen;
cc.visibleRect = visibleRect;
cc.UIInterfaceOrientationLandscapeLeft = UIInterfaceOrientationLandscapeLeft;
cc.UIInterfaceOrientationLandscapeRight = UIInterfaceOrientationLandscapeRight;
cc.UIInterfaceOrientationPortraitUpsideDown =
  UIInterfaceOrientationPortraitUpsideDown;
cc.UIInterfaceOrientationPortrait = UIInterfaceOrientationPortrait;
cc.inputManager = inputManager;

// Platform — Types
cc.Color = Color;
cc.color = color;
cc.colorEqual = colorEqual;
cc.hexToColor = hexToColor;
cc.colorToHex = colorToHex;
cc.Acceleration = Acceleration;
cc.TEXT_ALIGNMENT_LEFT = TEXT_ALIGNMENT_LEFT;
cc.TEXT_ALIGNMENT_CENTER = TEXT_ALIGNMENT_CENTER;
cc.TEXT_ALIGNMENT_RIGHT = TEXT_ALIGNMENT_RIGHT;
cc.VERTICAL_TEXT_ALIGNMENT_TOP = VERTICAL_TEXT_ALIGNMENT_TOP;
cc.VERTICAL_TEXT_ALIGNMENT_CENTER = VERTICAL_TEXT_ALIGNMENT_CENTER;
cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM = VERTICAL_TEXT_ALIGNMENT_BOTTOM;
cc.Vertex2F = Vertex2F;
cc.Vertex3F = Vertex3F;
cc.Tex2F = Tex2F;
cc.Quad2 = Quad2;
cc.Quad3 = Quad3;
cc.V3F_C4B_T2F = V3F_C4B_T2F;
cc.V3F_C4B_T2F_Quad = V3F_C4B_T2F_Quad;
cc.V3F_C4B_T2F_QuadZero = V3F_C4B_T2F_QuadZero;
cc.V3F_C4B_T2F_QuadCopy = V3F_C4B_T2F_QuadCopy;
cc.V3F_C4B_T2F_QuadsCopy = V3F_C4B_T2F_QuadsCopy;
cc.V2F_C4B_T2F = V2F_C4B_T2F;
cc.V2F_C4B_T2F_Triangle = V2F_C4B_T2F_Triangle;
cc.vertex2 = vertex2;
cc.vertex3 = vertex3;
cc.tex2 = tex2;
cc.BlendFunc = BlendFunc;
cc.blendFuncDisable = blendFuncDisable;
cc.FontDefinition = FontDefinition;
cc._Dictionary = _Dictionary;

// Platform — EGLView
cc.EGLView = EGLView;
cc.ContainerStrategy = ContainerStrategy;
cc.ContentStrategy = ContentStrategy;
cc.ResolutionPolicy = ResolutionPolicy;
cc.Touches = Touches;
cc.TouchesIntergerDict = TouchesIntergerDict;
cc.DENSITYDPI_DEVICE = DENSITYDPI_DEVICE;
cc.DENSITYDPI_HIGH = DENSITYDPI_HIGH;
cc.DENSITYDPI_MEDIUM = DENSITYDPI_MEDIUM;
cc.DENSITYDPI_LOW = DENSITYDPI_LOW;

// Cocoa — Geometry
cc.Point = Point;
cc.p = p;
cc.pointEqualToPoint = pointEqualToPoint;
cc.Size = Size;
cc.size = size;
cc.sizeEqualToSize = sizeEqualToSize;
cc.Rect = Rect;
cc.rect = rect;
cc.rectEqualToRect = rectEqualToRect;
cc._rectEqualToZero = _rectEqualToZero;
cc.rectContainsRect = rectContainsRect;
cc.rectGetMaxX = rectGetMaxX;
cc.rectGetMidX = rectGetMidX;
cc.rectGetMinX = rectGetMinX;
cc.rectGetMaxY = rectGetMaxY;
cc.rectGetMidY = rectGetMidY;
cc.rectGetMinY = rectGetMinY;
cc.rectContainsPoint = rectContainsPoint;
cc.rectIntersectsRect = rectIntersectsRect;
cc.rectOverlapsRect = rectOverlapsRect;
cc.rectUnion = rectUnion;
cc.rectIntersection = rectIntersection;

// Cocoa — AffineTransform
cc.AffineTransform = AffineTransform;
cc.affineTransformMake = affineTransformMake;
cc.pointApplyAffineTransform = pointApplyAffineTransform;
cc._pointApplyAffineTransform = _pointApplyAffineTransform;
cc.sizeApplyAffineTransform = sizeApplyAffineTransform;
cc.affineTransformMakeIdentity = affineTransformMakeIdentity;
cc.rectApplyAffineTransform = rectApplyAffineTransform;
cc._rectApplyAffineTransformIn = _rectApplyAffineTransformIn;
cc.affineTransformTranslate = affineTransformTranslate;
cc.affineTransformScale = affineTransformScale;
cc.affineTransformRotate = affineTransformRotate;
cc.affineTransformConcat = affineTransformConcat;
cc.affineTransformConcatIn = affineTransformConcatIn;
cc.affineTransformEqualToTransform = affineTransformEqualToTransform;
cc.affineTransformInvert = affineTransformInvert;
cc.affineTransformInvertOut = affineTransformInvertOut;

// Support
cc.POINT_EPSILON = POINT_EPSILON;
cc.pNeg = pNeg;
cc.pAdd = pAdd;
cc.pSub = pSub;
cc.pMult = pMult;
cc.pMidpoint = pMidpoint;
cc.pDot = pDot;
cc.pCross = pCross;
cc.pPerp = pPerp;
cc.pRPerp = pRPerp;
cc.pProject = pProject;
cc.pRotate = pRotate;
cc.pUnrotate = pUnrotate;
cc.pLengthSQ = pLengthSQ;
cc.pDistanceSQ = pDistanceSQ;
cc.pLength = pLength;
cc.pDistance = pDistance;
cc.pNormalize = pNormalize;
cc.pForAngle = pForAngle;
cc.pToAngle = pToAngle;
cc.clampf = clampf;
cc.pClamp = pClamp;
cc.pFromSize = pFromSize;
cc.pCompOp = pCompOp;
cc.pLerp = pLerp;
cc.pFuzzyEqual = pFuzzyEqual;
cc.pCompMult = pCompMult;
cc.pAngleSigned = pAngleSigned;
cc.pAngle = pAngle;
cc.pRotateByAngle = pRotateByAngle;
cc.pLineIntersect = pLineIntersect;
cc.pSegmentIntersect = pSegmentIntersect;
cc.pIntersectPoint = pIntersectPoint;
cc.pSameAs = pSameAs;
cc.pZeroIn = pZeroIn;
cc.pIn = pIn;
cc.pMultIn = pMultIn;
cc.pSubIn = pSubIn;
cc.pAddIn = pAddIn;
cc.pNormalizeIn = pNormalizeIn;
cc.vertexLineToPolygon = vertexLineToPolygon;
cc.vertexLineIntersect = vertexLineIntersect;
cc.vertexListIsClockwise = vertexListIsClockwise;
cc.CGAffineToGL = CGAffineToGL;
cc.GLToCGAffine = GLToCGAffine;

// Events
cc.EventHelper = EventHelper;
cc.Touch = Touch;
cc.Event = Event;
cc.EventCustom = EventCustom;
cc.EventMouse = EventMouse;
cc.EventTouch = EventTouch;
cc.EventFocus = EventFocus;
cc.Event.TOUCH = TOUCH;
cc.Event.KEYBOARD = KEYBOARD;
cc.Event.ACCELERATION = ACCELERATION;
cc.Event.MOUSE = MOUSE;
cc.Event.FOCUS = FOCUS;
cc.Event.CUSTOM = CUSTOM;
cc.EventListener = EventListener;
cc._EventListenerCustom = _EventListenerCustom;
cc._EventListenerMouse = _EventListenerMouse;
cc._EventListenerTouchOneByOne = _EventListenerTouchOneByOne;
cc._EventListenerTouchAllAtOnce = _EventListenerTouchAllAtOnce;
cc._EventListenerFocus = _EventListenerFocus;
cc._EventListenerVector = _EventListenerVector;
cc.eventManager = EventManager.getInstance();
cc.EventAcceleration = EventAcceleration;
cc.EventKeyboard = EventKeyboard;
cc._EventListenerKeyboard = _EventListenerKeyboard;
cc._EventListenerAcceleration = _EventListenerAcceleration;

// Renderer & Utils
cc.GlobalVertexBuffer = GlobalVertexBuffer;
cc.rendererCanvas = rendererCanvas;
cc.CanvasContextWrapper = CanvasContextWrapper;
cc.rendererWebGL = rendererWebGL;
cc.Region = Region;
cc.DirtyRegion = DirtyRegion;
cc._convertResponseBodyToText = _convertResponseBodyToText;
cc.loadBinary = loadBinary;
cc._str2Uint8Array = _str2Uint8Array;
cc.loadBinarySync = loadBinarySync;
cc.profiler = profiler;

// Base Nodes
cc.CustomRenderCmd = CustomRenderCmd;
cc.Node = Node;
cc.Node._dirtyFlags = dirtyFlags;
cc.Node.RenderCmd = RenderCmd;
cc.Node.CanvasRenderCmd = NodeCanvasRenderCmd;
cc.Node.WebGLRenderCmd = NodeWebGLRenderCmd;
cc.NODE_TAG_INVALID = NODE_TAG_INVALID;
cc.s_globalOrderOfArrival = s_globalOrderOfArrival;
cc.AtlasNode = AtlasNode;
cc.AtlasNode.CanvasRenderCmd = AtlasNodeCanvasRenderCmd;
cc.AtlasNode.WebGLRenderCmd = AtlasNodeWebGLRenderCmd;

// Textures
cc.ALIGN_CENTER = ALIGN_CENTER;
cc.ALIGN_TOP = ALIGN_TOP;
cc.ALIGN_TOP_RIGHT = ALIGN_TOP_RIGHT;
cc.ALIGN_RIGHT = ALIGN_RIGHT;
cc.ALIGN_BOTTOM_RIGHT = ALIGN_BOTTOM_RIGHT;
cc.ALIGN_BOTTOM = ALIGN_BOTTOM;
cc.ALIGN_BOTTOM_LEFT = ALIGN_BOTTOM_LEFT;
cc.ALIGN_LEFT = ALIGN_LEFT;
cc.ALIGN_TOP_LEFT = ALIGN_TOP_LEFT;
cc.textureCache = textureCache;
cc.TextureAtlas = TextureAtlas;

// Scenes & Layers
cc.Scene = Scene;
cc.LoaderScene = LoaderScene;
cc.Layer = Layer;
cc.LayerColor = LayerColor;
cc.LayerGradient = LayerGradient;
cc.LayerMultiplex = LayerMultiplex;
cc.Layer.CanvasRenderCmd = LayerCanvasRenderCmd;
cc.Layer.WebGLRenderCmd = LayerWebGLRenderCmd;
cc.LayerColor.CanvasRenderCmd = LayerColorCanvasRenderCmd;
cc.LayerColor.WebGLRenderCmd = LayerColorWebGLRenderCmd;
cc.LayerGradient.CanvasRenderCmd = LayerGradientCanvasRenderCmd;
cc.LayerGradient.WebGLRenderCmd = LayerGradientWebGLRenderCmd;

// Sprites
cc.Sprite = Sprite;
cc.Sprite.CanvasRenderCmd = SpriteCanvasRenderCmd;
cc.Sprite.WebGLRenderCmd = SpriteWebGLRenderCmd;
cc.SpriteBatchNode = SpriteBatchNode;
cc.BakeSprite = BakeSprite;
cc.AnimationFrame = AnimationFrame;
cc.Animation = Animation;
cc.animationCache = animationCache;
cc.SpriteFrame = SpriteFrame;
cc.spriteFrameCache = spriteFrameCache;

// Director, Scheduler, ActionManager
cc.configuration = Configuration.getInstance();
cc.Director = Director;
cc.DisplayLinkDirector = DisplayLinkDirector;
cc.g_NumberOfDraws = g_NumberOfDraws;
cc.defaultFPS = defaultFPS;
cc.Scheduler = Scheduler;
cc.PI2 = PI2;
cc.DrawingPrimitiveCanvas = DrawingPrimitiveCanvas;
cc.DrawingPrimitiveWebGL = DrawingPrimitiveWebGL;
cc.DirectorDelegate = DirectorDelegate;
cc.HashElement = HashElement;
cc.ActionManager = ActionManager;

// LabelTTF
cc.LabelTTF = LabelTTF;
cc.LabelTTF._textAlign = _textAlign;
cc.LabelTTF._textBaseline = _textBaseline;
cc.LabelTTF.wrapInspection = LabelTTFWrapInspection;
cc.LabelTTF._wordRex = LabelTTFWordRex;
cc.LabelTTF._symbolRex = LabelTTFSymbolRex;
cc.LabelTTF._lastWordRex = LabelTTFLastWordRex;
cc.LabelTTF._lastEnglish = LabelTTFLastEnglish;
cc.LabelTTF._firsrEnglish = LabelTTFFirsrEnglish;
cc.LabelTTF.CacheCanvasRenderCmd = LabelTTFCacheCanvasRenderCmd;
cc.LabelTTF.CanvasRenderCmd = LabelTTFCanvasRenderCmd;
cc.LabelTTF.WebGLRenderCmd = LabelTTFWebGLRenderCmd;

// Components
cc.Component = Component;
cc.ComponentContainer = ComponentContainer;

// Kazmath
cc.math = cc.math || {};
cc.math.EPSILON = EPSILON;
cc.math.square = square;
cc.math.almostEqual = almostEqual;
cc.math.Vec2 = Vec2;
cc.math.Vec3 = Vec3;
cc.math.Vec4 = Vec4;
cc.math.Ray2 = Ray2;
cc.math.Matrix3 = Matrix3;
cc.math.Matrix4 = Matrix4;
cc.math.Plane = Plane;
cc.math.Quaternion = Quaternion;
cc.math.AABB = AABB;
cc.math.Matrix4Stack = Matrix4Stack;
cc.math.vec3 = function (x, y, z) {
    return new Vec3(x, y, z);
};
cc.kmVec3 = Vec3;
cc.kmMat3 = Matrix3;
cc.kmMat4 = Matrix4;
cc.kmPlane = Plane;
cc.kmQuaternion = Quaternion;
cc.kmRay2 = Ray2;
cc.km_mat4_stack = Matrix4Stack;
cc.kmMat4Identity = kmMat4Identity;
cc.kmMat4Inverse = kmMat4Inverse;
cc.kmMat4Multiply = kmMat4Multiply;
cc.getMat4MultiplyValue = getMat4MultiplyValue;
cc.kmMat4Assign = kmMat4Assign;
cc.kmMat4Translation = kmMat4Translation;
cc.kmMat4PerspectiveProjection = kmMat4PerspectiveProjection;
cc.kmMat4LookAt = kmMat4LookAt;
cc.kmMat4RotationAxisAngle = kmMat4RotationAxisAngle;
cc.km_mat4_stack_push = km_mat4_stack_push;
cc.km_mat4_stack_pop = km_mat4_stack_pop;
cc.km_mat4_stack_release = km_mat4_stack_release;
cc.KM_GL_MODELVIEW = KM_GL_MODELVIEW;
cc.KM_GL_PROJECTION = KM_GL_PROJECTION;
cc.KM_GL_TEXTURE = KM_GL_TEXTURE;
cc.modelview_matrix_stack = new Matrix4Stack();
cc.projection_matrix_stack = new Matrix4Stack();
cc.texture_matrix_stack = new Matrix4Stack();
cc.current_stack = null;
cc.lazyInitialize = lazyInitialize;
cc.kmGLFreeAll = kmGLFreeAll;
cc.kmGLPushMatrix = kmGLPushMatrix;
cc.kmGLPushMatrixWitMat4 = kmGLPushMatrixWitMat4;
cc.kmGLPopMatrix = kmGLPopMatrix;
cc.kmGLMatrixMode = kmGLMatrixMode;
cc.kmGLLoadIdentity = kmGLLoadIdentity;
cc.kmGLLoadMatrix = kmGLLoadMatrix;
cc.kmGLMultMatrix = kmGLMultMatrix;
cc.kmGLTranslatef = kmGLTranslatef;
cc.kmGLRotatef = kmGLRotatef;
cc.kmGLScalef = kmGLScalef;
cc.kmGLGetMatrix = kmGLGetMatrix;

// ======================================================================
// Init functions (must run AFTER cc.* class assignments)
// ======================================================================
initInputExtension(inputManager);
initBinaryLoader();
cc.lazyInitialize();
