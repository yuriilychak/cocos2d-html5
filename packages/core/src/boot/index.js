// Re-export boot modules
export {
    isFunction, isNumber, isString, isArray,
    isUndefined, isObject, isCrossOrigin, formatStr
} from './utils';

export { default as AsyncPool } from './async-pool';
export { default as Async } from './async';
export { default as Path } from './path';
export { default as Loader } from './loader';
export { default as Game } from './game';
export { _LogInfos, log, warn, error, assert, logToWebPage, formatString, initDebugSetting } from './debugger';
export { _loadingImage, _fpsImage, _loaderImage } from './base64-images';
