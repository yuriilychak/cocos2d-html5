// Boot - init (side-effect: sets up cc namespace, window props, log stubs, polyfills)
import './boot/init';

// Boot - utilities
import {
    each, isFunction, isNumber, isString, isArray,
    isUndefined, isObject, isCrossOrigin, formatStr
} from './boot/utils';

cc.each = each;
cc.isFunction = isFunction;
cc.isNumber = isNumber;
cc.isString = isString;
cc.isArray = isArray;
cc.isUndefined = isUndefined;
cc.isObject = isObject;
cc.isCrossOrigin = isCrossOrigin;
cc.formatStr = formatStr;

// Boot - async
import AsyncPool from './boot/async-pool';
import Async from './boot/async';

cc.AsyncPool = AsyncPool;
cc.async = new Async();

// Boot - path
import Path from './boot/path';

cc.path = Path;

// Boot - loader
import Loader from './boot/loader';

cc.loader = new Loader();

// Boot - sys & engine
import { create3DContext, initSys } from './boot/sys';
import { initEngine } from './boot/engine';

cc.create3DContext = create3DContext;
cc.sys = initSys();
cc.initEngine = initEngine;

// Boot - game
import Game from './boot/game';

cc.game = new Game();

// Boot - debugger
import { _LogInfos, logToWebPage, formatString, initDebugSetting } from './boot/debugger';

cc._LogInfos = _LogInfos;
cc._logToWebPage = logToWebPage;
cc._formatString = formatString;
cc._initDebugSetting = initDebugSetting;

// Boot - base64 images
import { _loadingImage, _fpsImage, _loaderImage } from './boot/base64-images';

cc._loadingImage = _loadingImage;
cc._fpsImage = _fpsImage;
cc._loaderImage = _loaderImage;

// Core
import './event-manager/CCEventHelper.js';
import './utils/BinaryLoader.js';
import './platform/CCClass.js';
import './platform/CCCommon.js';
import './cocoa/CCGeometry.js';
import './platform/CCSAXParser.js';
import './platform/CCLoaders.js';
import './platform/CCConfig.js';
import './platform/CCMacro.js';
import './platform/CCTypes.js';
import './platform/CCEGLView.js';
import './platform/CCScreen.js';
import './platform/CCVisibleRect.js';
import './platform/CCInputManager.js';
import './platform/CCInputExtension.js';
import './cocoa/CCAffineTransform.js';
import './support/CCPointExtension.js';
import './support/CCVertex.js';
import './support/TransformUtils.js';
import './event-manager/CCTouch.js';
import './event-manager/CCEvent.js';
import './event-manager/CCEventListener.js';
import './event-manager/CCEventManager.js';
import './event-manager/CCEventExtension.js';
import './renderer/GlobalVertexBuffer.js';
import './renderer/RendererCanvas.js';
import './renderer/RendererWebGL.js';
import './renderer/DirtyRegion.js';
import './base-nodes/BaseNodesPropertyDefine.js';
import './base-nodes/CCNode.js';
import './base-nodes/CCNodeCanvasRenderCmd.js';
import './base-nodes/CCNodeWebGLRenderCmd.js';
import './base-nodes/CCAtlasNode.js';
import './base-nodes/CCAtlasNodeCanvasRenderCmd.js';
import './base-nodes/CCAtlasNodeWebGLRenderCmd.js';
import './textures/TexturesWebGL.js';
import './textures/TexturesPropertyDefine.js';
import './textures/CCTexture2D.js';
import './textures/CCTextureCache.js';
import './textures/CCTextureAtlas.js';
import './scenes/CCScene.js';
import './scenes/CCLoaderScene.js';
import './layers/CCLayer.js';
import './layers/CCLayerCanvasRenderCmd.js';
import './layers/CCLayerWebGLRenderCmd.js';
import './sprites/SpritesPropertyDefine.js';
import './sprites/CCSprite.js';
import './sprites/CCSpriteCanvasRenderCmd.js';
import './sprites/CCSpriteWebGLRenderCmd.js';
import './sprites/CCSpriteBatchNode.js';
import './sprites/CCBakeSprite.js';
import './sprites/CCAnimation.js';
import './sprites/CCAnimationCache.js';
import './sprites/CCSpriteFrame.js';
import './sprites/CCSpriteFrameCache.js';
import './CCConfiguration.js';
import './CCDirector.js';
import './CCDirectorCanvas.js';
import './CCDirectorWebGL.js';
import './CCScheduler.js';
import './CCDrawingPrimitivesCanvas.js';
import './CCDrawingPrimitivesWebGL.js';
import './labelttf/LabelTTFPropertyDefine.js';
import './labelttf/CCLabelTTF.js';
import './labelttf/CCLabelTTFCanvasRenderCmd.js';
import './labelttf/CCLabelTTFWebGLRenderCmd.js';
import './CCActionManager.js';
import './components/CCComponent.js';
import './components/CCComponentContainer.js';
import './utils/CCProfiler.js';

// Kazmath
import './kazmath/index.js';
