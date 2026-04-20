import Game from './game';
import Loader from './loader';
import Path from './path';
import Sys from './sys';

var _jsAddedCache = {},
    _engineInitCalled = false,
    _engineLoadedCallback = null;

function _determineRenderType(config) {
    var CONFIG_KEY = Game.CONFIG_KEY,
        userRenderMode = parseInt(config[CONFIG_KEY.renderMode]) || 0;

    if (isNaN(userRenderMode) || userRenderMode > 2 || userRenderMode < 0)
        config[CONFIG_KEY.renderMode] = 0;

    cc._renderType = Game.RENDER_TYPE_CANVAS;
    cc._supportRender = false;

    if (userRenderMode === 0) {
        if (Sys.getInstance().capabilities["opengl"]) {
            cc._renderType = Game.RENDER_TYPE_WEBGL;
            cc._supportRender = true;
        }
        else if (Sys.getInstance().capabilities["canvas"]) {
            cc._renderType = Game.RENDER_TYPE_CANVAS;
            cc._supportRender = true;
        }
    }
    else if (userRenderMode === 1 && Sys.getInstance().capabilities["canvas"]) {
        cc._renderType = Game.RENDER_TYPE_CANVAS;
        cc._supportRender = true;
    }
    else if (userRenderMode === 2 && Sys.getInstance().capabilities["opengl"]) {
        cc._renderType = Game.RENDER_TYPE_WEBGL;
        cc._supportRender = true;
    }
}

function _getJsListOfModule(moduleMap, moduleName, dir) {
    if (_jsAddedCache[moduleName]) return null;
    dir = dir || "";
    var jsList = [];
    var tempList = moduleMap[moduleName];
    if (!tempList) throw new Error("can not find module [" + moduleName + "]");
    for (var i = 0, li = tempList.length; i < li; i++) {
        var item = tempList[i];
        if (_jsAddedCache[item]) continue;
        var extname = Path.extname(item);
        if (!extname) {
            var arr = _getJsListOfModule(moduleMap, item, dir);
            if (arr) jsList = jsList.concat(arr);
        } else if (extname.toLowerCase() === ".js") jsList.push(Path.join(dir, item));
        _jsAddedCache[item] = 1;
    }
    return jsList;
}

function _afterEngineLoaded(config) {
    if (cc._initDebugSetting)
        cc._initDebugSetting(config[Game.CONFIG_KEY.debugMode]);
    cc._engineLoaded = true;
    console.log(cc.ENGINE_VERSION);
    if (_engineLoadedCallback) _engineLoadedCallback();
}

function _load(config) {
    var CONFIG_KEY = Game.CONFIG_KEY, engineDir = config[CONFIG_KEY.engineDir], loader = Loader.getInstance();

    if (cc.NewClass) {
        _afterEngineLoaded(config);
    } else {
        var ccModulesPath = Path.join(engineDir, "moduleConfig.json");
        loader.loadJson(ccModulesPath, function (err, modulesJson) {
            if (err) throw new Error(err);
            var modules = config["modules"] || [];
            var moduleMap = modulesJson["module"];
            var jsList = [];
            if (Sys.getInstance().capabilities["opengl"] && modules.indexOf("base4webgl") < 0) modules.splice(0, 0, "base4webgl");
            else if (modules.indexOf("core") < 0) modules.splice(0, 0, "core");
            for (var i = 0, li = modules.length; i < li; i++) {
                var arr = _getJsListOfModule(moduleMap, modules[i], engineDir);
                if (arr) jsList = jsList.concat(arr);
            }
            Loader.getInstance().loadJsWithImg(jsList, function (err) {
                if (err) throw err;
                _afterEngineLoaded(config);
            });
        });
    }
}

function _windowLoaded() {
    this.removeEventListener('load', _windowLoaded, false);
    _load(Game.getInstance().config);
}

export function initEngine(config, cb) {
    var game = Game.getInstance();

    if (_engineInitCalled) {
        var previousCallback = _engineLoadedCallback;
        _engineLoadedCallback = function () {
            previousCallback && previousCallback();
            cb && cb();
        }
        return;
    }

    _engineLoadedCallback = cb;

    if (!game.config && config) {
        game.config = config;
    }
    else if (!game.config) {
        game._loadConfig();
    }
    config = game.config;

    _determineRenderType(config);

    document.body ? _load(config) : cc._addEventListener(window, 'load', _windowLoaded, false);
    _engineInitCalled = true;
}
