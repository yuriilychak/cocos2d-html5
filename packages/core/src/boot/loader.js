import {
  ImageLoaderStrategy,
  TextLoaderStrategy,
  JsonLoaderStrategy,
  CsbLoaderStrategy,
  PlistLoaderStrategy,
  FontLoaderStrategy,
  BinaryLoaderStrategy,
  ServerImageLoaderStrategy
} from "./strategies";
import { LoaderStrategyKey } from "../enums";
import AsyncPool from "./async-pool";
import Path from "./path";
import { error, log } from "./debugger";

/**
 * Resource loading management. Singleton accessed via this.
 * @name Loader
 */
export default class Loader {
  #register = new Map();
  #langPathCache = new Map();
  #aliases = new Map();
  #cache = new Map();
  #strategies = new Map();
  #noCache = false;
  #sys = null;
  #resPath = "";
  #audioPath = "";
  
  static #urlRegExp = new RegExp("^(?:https?|ftp)://\\S*$", "i");
  static #noCacheRex = /\?/;

  constructor(sys) {
    this.#sys = sys;
    const strategies = [
      new ImageLoaderStrategy(sys, this),
      new TextLoaderStrategy(this),
      new JsonLoaderStrategy(this),
      new CsbLoaderStrategy(this),
      new PlistLoaderStrategy(this),
      new FontLoaderStrategy(this),
      new BinaryLoaderStrategy(this),
      new ServerImageLoaderStrategy(sys, this)
    ];
    for (const strategy of strategies) {
      this.addStrategy(strategy);
    }
  }

  setNoCache(value) {
    this.#noCache = value;
  }

  get(key) {
    return this.#cache.get(key) || this.#cache.get(this.#aliases.get(key));
  }

  set(key, value) {
    this.#cache.set(key, value);
    return this;
  }

  addStrategy(strategy) {
    this.#strategies.set(strategy.strategyKey, strategy);
    if (strategy.supportedTypes.length > 0)
      this.register(strategy.supportedTypes, strategy);
    return this;
  }

  /**
   * Root path of resources.
   * @type {String}
   */

  get resPath() {
    return this.#resPath;
  }

  set resPath(value) {
    this.#resPath = value;
  }

  /**
   * Root path of audio resources
   * @type {String}
   */
  get audioPath() {
    return this.#audioPath;
  }

  set audioPath(value) {
    this.#audioPath = value;
  }

  /**
   * Get XMLHttpRequest.
   * @returns {XMLHttpRequest}
   */
  get XMLHttpRequest() {
    var xhr = window.XMLHttpRequest
      ? new window.XMLHttpRequest()
      : new ActiveXObject("MSXML2.XMLHTTP");
    xhr.timeout = 10000;
    if (xhr.ontimeout === undefined) {
      xhr._timeoutId = -1;
    }
    return xhr;
  }

  #load(strategyKey, realUrl, cb, url = null, res = null) {
    return this.#strategies.get(strategyKey).load(realUrl, url, res, cb);
  }

  /**
   * Load a single resource as txt.
   * @param {string} url
   * @param {function} [cb] arguments are : err, txt
   */
  loadTxt(url, cb) {
    return this.#load(LoaderStrategyKey.TEXT, url, cb);
  }

  /**
   * Load a single resource as json.
   * @param {string} url
   * @param {function} [cb] arguments are : err, json
   */
  loadJson(url, cb) {
    return this.#load(LoaderStrategyKey.JSON, url, cb);
  }

  /**
   * Load a single image.
   * @param {!string} url
   * @param {object} [option]
   * @param {function} callback
   * @returns {Image}
   */
  loadImg(url, option, callback, img) {
    return this.#strategies
      .get(LoaderStrategyKey.IMAGE)
      .loadImage(url, option, callback, img);
  }

  loadBinary(url, cb) {
    return this.#load(LoaderStrategyKey.BINARY, url, cb);
  }

  loadBinarySync(url) {
    return this.#strategies.get(LoaderStrategyKey.BINARY).loadSync(url);
  }

  /**
   * Iterator function to load res
   * @param {object} item
   * @param {number} index
   * @param {function} [cb]
   * @returns {*}
   * @private
   */
  #loadResIterator(item, index, cb) {
    var url = null;
    var type = item.type;
    if (type) {
      type = "." + type.toLowerCase();
      url = item.src ? item.src : item.name + type;
    } else {
      url = item;
      type = Path.extname(url);
    }

    var obj = this.get(url);
    if (obj) return cb(null, obj);
    var loader = null;
    if (type) {
      loader = this.#register.get(type.toLowerCase());
    }
    if (!loader) {
      error("loader for [" + type + "] doesn't exist!");
      return cb();
    }
    var realUrl = url;
    if (!Loader.#urlRegExp.test(url)) {
      var basePath = loader.getBasePath ? loader.getBasePath() : this.resPath;
      realUrl = this.getUrl(basePath, url);
    }

    if (this.#noCache && typeof realUrl === "string") {
      if (Loader.#noCacheRex.test(realUrl))
        realUrl += "&_t=" + (new Date() - 0);
      else realUrl += "?_t=" + (new Date() - 0);
    }
    loader(realUrl, url, item, (err, data) => {
      if (err) {
        log(err);
        this.#cache.delete(url);
        cb({ status: 520, errorMessage: err }, null);
      } else {
        this.#cache.set(url, data);
        cb(null, data);
      }
    });
  }

  /**
   * Get url with basePath.
   * @param {string} basePath
   * @param {string} [url]
   * @returns {*}
   */
  getUrl(basePath, url) {
    if (basePath !== undefined && url === undefined) {
      url = basePath;
      var type = Path.extname(url);
      type = type ? type.toLowerCase() : "";
      var loader = this.#register.get(type);
      if (!loader) basePath = this.resPath;
      else basePath = loader.getBasePath ? loader.getBasePath() : this.resPath;
    }
    url = Path.join(basePath || "", url);
    if (url.match(/[\/(\\\\)]lang[\/(\\\\)]/i)) {
      if (this.#langPathCache.has(url)) return this.#langPathCache.get(url);
      var extname = Path.extname(url) || "";
      var langUrl =
        url.substring(0, url.length - extname.length) +
        "_" +
        this.#sys.specification.language +
        extname;
      this.#langPathCache.set(url, langUrl);
      url = langUrl;
    }
    return url;
  }

  /**
   * Load resources then call the callback.
   * @param {string} resources
   * @param {function} [option] callback or trigger
   * @param {function|Object} [loadCallback]
   * @return {AsyncPool}
   */
  load(resources, option, loadCallback) {
    switch (arguments.length) {
      case 0:
        throw new Error("arguments error!");
      case 3:
        if (typeof option === "function") {
          if (typeof loadCallback === "function")
            option = { trigger: option, cb: loadCallback };
          else option = { cb: option, cbTarget: loadCallback };
        }
        break;
      case 2:
        if (typeof option === "function") option = { cb: option };
        break;
      case 1:
        option = {};
        break;
    }

    if (!(resources instanceof Array)) resources = [resources];
    var asyncPool = new AsyncPool(
      resources,
      this.#sys.specification.isMobile ? 20 : 0,
      (value, index, AsyncPoolCallback, aPool) => {
        this.#loadResIterator(value, index, (err, ...rest) => {
          if (option.trigger)
            option.trigger.call(
              option.triggerTarget,
              rest[0],
              aPool.size,
              aPool.finishedSize
            );
          AsyncPoolCallback(err, rest[0]);
        });
      },
      option.cb,
      option.cbTarget
    );
    asyncPool.flow();
    return asyncPool;
  }

  #handleAliases(fileNames, cb) {
    var resList = [];
    for (var key in fileNames) {
      var value = fileNames[key];
      this.#aliases.set(key, value);
      resList.push(value);
    }
    this.load(resList, cb);
  }

  /**
   * <p>
   *     Loads alias map from the contents of a filename.
   * </p>
   * @param {String} url  The plist file name.
   * @param {Function} [callback]
   */
  loadAliases(url, callback) {
    var dict = this.get(url);
    if (!dict) {
      this.load(url, (err, results) => {
        this.#handleAliases(results[0]["filenames"], callback);
      });
    } else this.#handleAliases(dict["filenames"], callback);
  }

  /**
   * Register a resource loader into loader.
   * @param {string} extNames
   * @param {function} loader
   */
  register(extNames, loader) {
    if (!extNames || !loader) return;
    if (typeof loader !== "function") {
      if (!loader.load) return;
      const loaderInstance = loader;
      var getBasePath = loaderInstance.getBasePath;
      loader = loaderInstance.load.bind(loaderInstance);
      if (getBasePath) loader.getBasePath = getBasePath.bind(loaderInstance);
    }
    if (typeof extNames === "string")
      return this.#register.set(extNames.trim().toLowerCase(), loader);
    for (var i = 0, li = extNames.length; i < li; i++) {
      this.#register.set("." + extNames[i].trim().toLowerCase(), loader);
    }
  }

  registerDefaultLoaders(textureCache) {
    this.#strategies.get(LoaderStrategyKey.IMAGE).setTextureCache(textureCache);
    this.#strategies
      .get(LoaderStrategyKey.SERVER_IMAGE)
      .setTextureCache(textureCache);
  }

  registerTileMap() {
    const strategy = this.#strategies.get(LoaderStrategyKey.TEXT);
    this.register(strategy.tileMapTypes, strategy);
  }

  registerBinaries(types) {
    this.register(types, this.#strategies.get(LoaderStrategyKey.BINARY));
  }

  /**
   * Get aliase by url.
   * @param url
   * @returns {*}
   */
  getAliase(url) {
    return this.#aliases.get(url);
  }

  /**
   * Release the cache of resource by url.
   * @param url
   */
  release(url) {
    this.#strategies.get(LoaderStrategyKey.IMAGE).release(url);
    this.#cache.delete(url);
    this.#cache.delete(this.#aliases.get(url));
    this.#aliases.delete(url);
  }

  /**
   * Resource cache of all resources.
   */
  releaseAll() {
    this.#cache.clear();
    this.#aliases.clear();
  }
}
