// Side-effect: sets up cc namespace, window props, log stubs, polyfills
import './init';

// Utilities
import {
    each, isFunction, isNumber, isString, isArray,
    isUndefined, isObject, isCrossOrigin, formatStr
} from './utils';

cc.each = each;
cc.isFunction = isFunction;
cc.isNumber = isNumber;
cc.isString = isString;
cc.isArray = isArray;
cc.isUndefined = isUndefined;
cc.isObject = isObject;
cc.isCrossOrigin = isCrossOrigin;
cc.formatStr = formatStr;

// Async
import AsyncPool from './async-pool';
import Async from './async';

cc.AsyncPool = AsyncPool;
cc.async = new Async();

// Path
import Path from './path';

cc.path = Path;

// Loader
import Loader from './loader';

cc.loader = new Loader();

// Sys & Engine
import { create3DContext, initSys } from './sys';
import { initEngine } from './engine';

cc.create3DContext = create3DContext;
cc.sys = initSys();
cc.initEngine = initEngine;

// Game
import Game from './game';

cc.game = new Game();

// Debugger
import { _LogInfos, logToWebPage, formatString, initDebugSetting } from './debugger';

cc._LogInfos = _LogInfos;
cc._logToWebPage = logToWebPage;
cc._formatString = formatString;
cc._initDebugSetting = initDebugSetting;

// Base64 images
import { _loadingImage, _fpsImage, _loaderImage } from './base64-images';

cc._loadingImage = _loadingImage;
cc._fpsImage = _fpsImage;
cc._loaderImage = _loaderImage;
