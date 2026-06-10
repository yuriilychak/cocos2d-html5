import Game from "./game";
import Path from "./path";
import { initDebugSetting } from "./debugger";
import { ENGINE_VERSION } from "../platform/config";
import { ServiceLocator } from "../service-locator";

export class Engine {
  static #instance = null;

  #jsAddedCache = {};
  #engineInitCalled = false;
  #engineLoadedCallback = null;
  loaded = false;

  static getInstance() {
    if (!Engine.#instance) {
      Engine.#instance = new Engine();
    }
    return Engine.#instance;
  }

  #getJsListOfModule(moduleMap, moduleName, dir) {
    if (this.#jsAddedCache[moduleName]) return null;
    dir = dir || "";
    var jsList = [];
    var tempList = moduleMap[moduleName];
    if (!tempList) throw new Error("can not find module [" + moduleName + "]");
    for (var i = 0, li = tempList.length; i < li; i++) {
      var item = tempList[i];
      if (this.#jsAddedCache[item]) continue;
      var extname = Path.extname(item);
      if (!extname) {
        var arr = this.#getJsListOfModule(moduleMap, item, dir);
        if (arr) jsList = jsList.concat(arr);
      } else if (extname.toLowerCase() === ".js")
        jsList.push(Path.join(dir, item));
      this.#jsAddedCache[item] = 1;
    }
    return jsList;
  }

  #afterEngineLoaded(config) {
    initDebugSetting(config[Game.CONFIG_KEY.debugMode]);
    this.loaded = true;
    console.log(ENGINE_VERSION);
    if (this.#engineLoadedCallback) this.#engineLoadedCallback();
  }

  #load(config) {
    this.#afterEngineLoaded(config);
  }

  #boundWindowLoaded = () => {
    window.removeEventListener("load", this.#boundWindowLoaded, false);
    this.#load(ServiceLocator.game.config);
  };

  init(config, cb) {
    var game = ServiceLocator.game;

    if (this.#engineInitCalled) {
      var previousCallback = this.#engineLoadedCallback;
      this.#engineLoadedCallback = function () {
        previousCallback && previousCallback();
        cb && cb();
      };
      return;
    }

    this.#engineLoadedCallback = cb;

    if (!game.config && config) {
      game.config = config;
    } else if (!game.config) {
      game._loadConfig();
    }
    config = game.config;

    ServiceLocator.rendererConfig.determineRenderType(config);

    document.body
      ? this.#load(config)
      : window.addEventListener("load", this.#boundWindowLoaded, false);
    this.#engineInitCalled = true;
  }
}
