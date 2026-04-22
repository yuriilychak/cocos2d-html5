import ImagePool from "./image-pool";
import Game from "./game";
import Async from "./async";
import AsyncPool from "./async-pool";
import Path from "./path";
import Sys from "./sys";
import { error, log } from './debugger';

var imagePool = new ImagePool();

/**
 * Resource loading management. Singleton accessed via Loader.getInstance().
 * @name Loader
 */
export default class Loader {
  static _instance = null;

  static getInstance() {
    if (!Loader._instance) {
      Loader._instance = new Loader();
    }
    return Loader._instance;
  }

  _jsCache = {};
  _register = {};
  _langPathCache = {};
  _aliases = {};
  _queue = {};
  _urlRegExp = new RegExp("^(?:https?|ftp)://\\S*$", "i");
  _noCacheRex = /\?/;

  /**
   * Root path of resources.
   * @type {String}
   */
  resPath = "";

  /**
   * Root path of audio resources
   * @type {String}
   */
  audioPath = "";

  /**
   * Cache for data loaded.
   * @type {Object}
   */
  cache = {};

  /**
   * Get XMLHttpRequest.
   * @returns {XMLHttpRequest}
   */
  getXMLHttpRequest() {
    var xhr = window.XMLHttpRequest
      ? new window.XMLHttpRequest()
      : new ActiveXObject("MSXML2.XMLHTTP");
    xhr.timeout = 10000;
    if (xhr.ontimeout === undefined) {
      xhr._timeoutId = -1;
    }
    return xhr;
  }

  //@MODE_BEGIN DEV

  _getArgs4Js(args) {
    var a0 = args[0],
      a1 = args[1],
      a2 = args[2],
      results = ["", null, null];

    if (args.length === 1) {
      results[1] = a0 instanceof Array ? a0 : [a0];
    } else if (args.length === 2) {
      if (typeof a1 === "function") {
        results[1] = a0 instanceof Array ? a0 : [a0];
        results[2] = a1;
      } else {
        results[0] = a0 || "";
        results[1] = a1 instanceof Array ? a1 : [a1];
      }
    } else if (args.length === 3) {
      results[0] = a0 || "";
      results[1] = a1 instanceof Array ? a1 : [a1];
      results[2] = a2;
    } else throw new Error("arguments error to load js!");
    return results;
  }

  isLoading(url) {
    return this._queue[url] !== undefined;
  }

  /**
   * Load js files.
   * If the third parameter doesn't exist, then the baseDir turns to be "".
   *
   * @param {string} [baseDir]   The pre path for jsList or the list of js path.
   * @param {array} jsList    List of js path.
   * @param {function} [cb]  Callback function
   * @returns {*}
   */
  loadJs(baseDir, jsList, cb) {
    var args = this._getArgs4Js(arguments);

    var preDir = args[0],
      list = args[1],
      callback = args[2];
    if (navigator.userAgent.indexOf("Trident/5") > -1) {
      this._loadJs4Dependency(preDir, list, 0, callback);
    } else {
      Async.map(
        list,
        (item, index, cb1) => {
          var jsPath = Path.join(preDir, item);
          if (this._jsCache[jsPath]) return cb1(null);
          this._createScript(jsPath, false, cb1);
        },
        callback
      );
    }
  }

  /**
   * Load js width loading image.
   *
   * @param {string} [baseDir]
   * @param {array} jsList
   * @param {function} [cb]
   */
  loadJsWithImg(baseDir, jsList, cb) {
    var jsLoadingImg = this._loadJsImg(),
      args = this._getArgs4Js(arguments);
    this.loadJs(args[0], args[1], (err) => {
      if (err) throw new Error(err);
      jsLoadingImg.parentNode.removeChild(jsLoadingImg);
      if (args[2]) args[2]();
    });
  }

  _createScript(jsPath, isAsync, cb) {
    var d = document,
      s = document.createElement("script");
    s.async = isAsync;
    this._jsCache[jsPath] = true;
    if (Game.getInstance().config["noCache"] && typeof jsPath === "string") {
      if (this._noCacheRex.test(jsPath))
        s.src = jsPath + "&_t=" + (new Date() - 0);
      else s.src = jsPath + "?_t=" + (new Date() - 0);
    } else {
      s.src = jsPath;
    }
    var onLoad = () => {
      s.parentNode.removeChild(s);
      s.removeEventListener("load", onLoad, false);
      cb();
    };
    s.addEventListener("load", onLoad, false);
    s.addEventListener(
      "error",
      () => {
        s.parentNode.removeChild(s);
        cb("Load " + jsPath + " failed!");
      },
      false
    );
    d.body.appendChild(s);
  }

  _loadJs4Dependency(baseDir, jsList, index, cb) {
    if (index >= jsList.length) {
      if (cb) cb();
      return;
    }
    this._createScript(Path.join(baseDir, jsList[index]), false, (err) => {
      if (err) return cb(err);
      this._loadJs4Dependency(baseDir, jsList, index + 1, cb);
    });
  }

  _loadJsImg() {
    var d = document,
      jsLoadingImg = d.getElementById("cocos2d_loadJsImg");
    if (!jsLoadingImg) {
      jsLoadingImg = document.createElement("img");

      if (cc._loadingImage) jsLoadingImg.src = cc._loadingImage;

      var canvasNode = d.getElementById(Game.getInstance().config["id"]);
      canvasNode.style.backgroundColor = "transparent";
      canvasNode.parentNode.appendChild(jsLoadingImg);

      var canvasStyle = getComputedStyle
        ? getComputedStyle(canvasNode)
        : canvasNode.currentStyle;
      if (!canvasStyle)
        canvasStyle = { width: canvasNode.width, height: canvasNode.height };
      jsLoadingImg.style.left =
        canvasNode.offsetLeft +
        (parseFloat(canvasStyle.width) - jsLoadingImg.width) / 2 +
        "px";
      jsLoadingImg.style.top =
        canvasNode.offsetTop +
        (parseFloat(canvasStyle.height) - jsLoadingImg.height) / 2 +
        "px";
      jsLoadingImg.style.position = "absolute";
    }
    return jsLoadingImg;
  }
  //@MODE_END DEV

  /**
   * Load a single resource as txt.
   * @param {string} url
   * @param {function} [cb] arguments are : err, txt
   */
  loadTxt(url, cb) {
    if (!cc._isNodeJs) {
      var xhr = this.getXMLHttpRequest(),
        errInfo = "load " + url + " failed!";
      xhr.open("GET", url, true);
      if (
        /msie/i.test(navigator.userAgent) &&
        !/opera/i.test(navigator.userAgent)
      ) {
        // IE-specific logic here
        xhr.setRequestHeader("Accept-Charset", "utf-8");
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4)
            xhr.status === 200 || xhr.status === 0
              ? cb(null, xhr.responseText)
              : cb({ status: xhr.status, errorMessage: errInfo }, null);
        };
      } else {
        if (xhr.overrideMimeType)
          xhr.overrideMimeType("text\/plain; charset=utf-8");
        var loadCallback = () => {
          xhr.removeEventListener("load", loadCallback);
          xhr.removeEventListener("error", errorCallback);
          if (xhr._timeoutId >= 0) {
            clearTimeout(xhr._timeoutId);
          } else {
            xhr.removeEventListener("timeout", timeoutCallback);
          }
          if (xhr.readyState === 4) {
            xhr.status === 200 || xhr.status === 0
              ? cb(null, xhr.responseText)
              : cb({ status: xhr.status, errorMessage: errInfo }, null);
          }
        };
        var errorCallback = () => {
          xhr.removeEventListener("load", loadCallback);
          xhr.removeEventListener("error", errorCallback);
          if (xhr._timeoutId >= 0) {
            clearTimeout(xhr._timeoutId);
          } else {
            xhr.removeEventListener("timeout", timeoutCallback);
          }
          cb({ status: xhr.status, errorMessage: errInfo }, null);
        };
        var timeoutCallback = () => {
          xhr.removeEventListener("load", loadCallback);
          xhr.removeEventListener("error", errorCallback);
          if (xhr._timeoutId >= 0) {
            clearTimeout(xhr._timeoutId);
          } else {
            xhr.removeEventListener("timeout", timeoutCallback);
          }
          cb(
            { status: xhr.status, errorMessage: "Request timeout: " + errInfo },
            null
          );
        };
        xhr.addEventListener("load", loadCallback);
        xhr.addEventListener("error", errorCallback);
        if (xhr.ontimeout === undefined) {
          xhr._timeoutId = setTimeout(() => {
            timeoutCallback();
          }, xhr.timeout);
        } else {
          xhr.addEventListener("timeout", timeoutCallback);
        }
      }
      xhr.send(null);
    } else {
      var fs = require("fs");
      fs.readFile(url, (err, data) => {
        err ? cb(err) : cb(null, data.toString());
      });
    }
  }

  loadCsb(url, cb) {
    var xhr = this.getXMLHttpRequest(),
      errInfo = "load " + url + " failed!";
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";

    var loadCallback = () => {
      xhr.removeEventListener("load", loadCallback);
      xhr.removeEventListener("error", errorCallback);
      if (xhr._timeoutId >= 0) {
        clearTimeout(xhr._timeoutId);
      } else {
        xhr.removeEventListener("timeout", timeoutCallback);
      }
      var arrayBuffer = xhr.response; // Note: not oReq.responseText
      if (arrayBuffer) {
        window.msg = arrayBuffer;
      }
      if (xhr.readyState === 4) {
        xhr.status === 200 || xhr.status === 0
          ? cb(null, xhr.response)
          : cb({ status: xhr.status, errorMessage: errInfo }, null);
      }
    };
    var errorCallback = () => {
      xhr.removeEventListener("load", loadCallback);
      xhr.removeEventListener("error", errorCallback);
      if (xhr._timeoutId >= 0) {
        clearTimeout(xhr._timeoutId);
      } else {
        xhr.removeEventListener("timeout", timeoutCallback);
      }
      cb({ status: xhr.status, errorMessage: errInfo }, null);
    };
    var timeoutCallback = () => {
      xhr.removeEventListener("load", loadCallback);
      xhr.removeEventListener("error", errorCallback);
      if (xhr._timeoutId >= 0) {
        clearTimeout(xhr._timeoutId);
      } else {
        xhr.removeEventListener("timeout", timeoutCallback);
      }
      cb(
        { status: xhr.status, errorMessage: "Request timeout: " + errInfo },
        null
      );
    };
    xhr.addEventListener("load", loadCallback);
    xhr.addEventListener("error", errorCallback);
    if (xhr.ontimeout === undefined) {
      xhr._timeoutId = setTimeout(() => {
        timeoutCallback();
      }, xhr.timeout);
    } else {
      xhr.addEventListener("timeout", timeoutCallback);
    }
    xhr.send(null);
  }

  /**
   * Load a single resource as json.
   * @param {string} url
   * @param {function} [cb] arguments are : err, json
   */
  loadJson(url, cb) {
    this.loadTxt(url, (err, txt) => {
      if (err) {
        cb(err);
      } else {
        try {
          var result = JSON.parse(txt);
        } catch (e) {
          throw new Error("parse json [" + url + "] failed : " + e);
          return;
        }
        cb(null, result);
      }
    });
  }

  _checkIsImageURL(url) {
    var ext = /(\.png)|(\.jpg)|(\.bmp)|(\.jpeg)|(\.gif)/.exec(url);
    return ext != null;
  }

  /**
   * Load a single image.
   * @param {!string} url
   * @param {object} [option]
   * @param {function} callback
   * @returns {Image}
   */
  loadImg(url, option, callback, img) {
    var opt = {
      isCrossOrigin: true
    };
    if (callback !== undefined)
      opt.isCrossOrigin =
        option.isCrossOrigin === undefined
          ? opt.isCrossOrigin
          : option.isCrossOrigin;
    else if (option !== undefined) callback = option;

    var texture = this.getRes(url);
    if (texture) {
      callback && callback(null, texture);
      return null;
    }

    var queue = this._queue[url];
    if (queue) {
      queue.callbacks.push(callback);
      return queue.img;
    }

    img = img || imagePool.get();
    if (opt.isCrossOrigin && location.origin !== "file://")
      img.crossOrigin = "Anonymous";
    else img.crossOrigin = null;

    var loadCallback = () => {
      img.removeEventListener("load", loadCallback, false);
      img.removeEventListener("error", errorCallback, false);

      var queue = this._queue[url];
      if (queue) {
        var callbacks = queue.callbacks;
        for (var i = 0; i < callbacks.length; ++i) {
          var cb = callbacks[i];
          if (cb) {
            cb(null, img);
          }
        }
        queue.img = null;
        delete this._queue[url];
      }

      if (
        window.ENABLE_IMAEG_POOL &&
        cc._renderType === Game.RENDER_TYPE_WEBGL
      ) {
        imagePool.put(img);
      }
    };

    var errorCallback = () => {
      img.removeEventListener("load", loadCallback, false);
      img.removeEventListener("error", errorCallback, false);

      if (
        window.location.protocol !== "https:" &&
        img.crossOrigin &&
        img.crossOrigin.toLowerCase() === "anonymous"
      ) {
        opt.isCrossOrigin = false;
        this.release(url);
        Loader.getInstance().loadImg(url, opt, callback, img);
      } else {
        var queue = this._queue[url];
        if (queue) {
          var callbacks = queue.callbacks;
          for (var i = 0; i < callbacks.length; ++i) {
            var cb = callbacks[i];
            if (cb) {
              cb("load image failed");
            }
          }
          queue.img = null;
          delete this._queue[url];
        }

        if (cc._renderType === Game.RENDER_TYPE_WEBGL) {
          imagePool.put(img);
        }
      }
    };

    this._queue[url] = {
      img: img,
      callbacks: callback ? [callback] : []
    };

    img.addEventListener("load", loadCallback);
    img.addEventListener("error", errorCallback);
    img.src = url;
    return img;
  }

  /**
   * Iterator function to load res
   * @param {object} item
   * @param {number} index
   * @param {function} [cb]
   * @returns {*}
   * @private
   */
  _loadResIterator(item, index, cb) {
    var url = null;
    var type = item.type;
    if (type) {
      type = "." + type.toLowerCase();
      url = item.src ? item.src : item.name + type;
    } else {
      url = item;
      type = Path.extname(url);
    }

    var obj = this.getRes(url);
    if (obj) return cb(null, obj);
    var loader = null;
    if (type) {
      loader = this._register[type.toLowerCase()];
    }
    if (!loader) {
      error("loader for [" + type + "] doesn't exist!");
      return cb();
    }
    var realUrl = url;
    if (!this._urlRegExp.test(url)) {
      var basePath = loader.getBasePath ? loader.getBasePath() : this.resPath;
      realUrl = this.getUrl(basePath, url);
    }

    if (Game.getInstance().config["noCache"] && typeof realUrl === "string") {
      if (this._noCacheRex.test(realUrl)) realUrl += "&_t=" + (new Date() - 0);
      else realUrl += "?_t=" + (new Date() - 0);
    }
    loader.load(realUrl, url, item, (err, data) => {
      if (err) {
        log(err);
        this.cache[url] = null;
        delete this.cache[url];
        cb({ status: 520, errorMessage: err }, null);
      } else {
        this.cache[url] = data;
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
      var loader = this._register[type];
      if (!loader) basePath = this.resPath;
      else basePath = loader.getBasePath ? loader.getBasePath() : this.resPath;
    }
    url = Path.join(basePath || "", url);
    if (url.match(/[\/(\\\\)]lang[\/(\\\\)]/i)) {
      if (this._langPathCache[url]) return this._langPathCache[url];
      var extname = Path.extname(url) || "";
      url = this._langPathCache[url] =
        url.substring(0, url.length - extname.length) +
        "_" +
        Sys.getInstance().language +
        extname;
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
    var len = arguments.length;
    if (len === 0) throw new Error("arguments error!");

    if (len === 3) {
      if (typeof option === "function") {
        if (typeof loadCallback === "function")
          option = { trigger: option, cb: loadCallback };
        else option = { cb: option, cbTarget: loadCallback };
      }
    } else if (len === 2) {
      if (typeof option === "function") option = { cb: option };
    } else if (len === 1) {
      option = {};
    }

    if (!(resources instanceof Array)) resources = [resources];
    var asyncPool = new AsyncPool(
      resources,
      cc.CONCURRENCY_HTTP_REQUEST_COUNT,
      (value, index, AsyncPoolCallback, aPool) => {
        this._loadResIterator(value, index, (err, ...rest) => {
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

  _handleAliases(fileNames, cb) {
    var resList = [];
    for (var key in fileNames) {
      var value = fileNames[key];
      this._aliases[key] = value;
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
    var dict = this.getRes(url);
    if (!dict) {
      this.load(url, (err, results) => {
        this._handleAliases(results[0]["filenames"], callback);
      });
    } else this._handleAliases(dict["filenames"], callback);
  }

  /**
   * Register a resource loader into loader.
   * @param {string} extNames
   * @param {function} loader
   */
  register(extNames, loader) {
    if (!extNames || !loader) return;
    if (typeof extNames === "string")
      return (this._register[extNames.trim().toLowerCase()] = loader);
    for (var i = 0, li = extNames.length; i < li; i++) {
      this._register["." + extNames[i].trim().toLowerCase()] = loader;
    }
  }

  /**
   * Get resource data by url.
   * @param url
   * @returns {*}
   */
  getRes(url) {
    return this.cache[url] || this.cache[this._aliases[url]];
  }

  /**
   * Get aliase by url.
   * @param url
   * @returns {*}
   */
  _getAliase(url) {
    return this._aliases[url];
  }

  /**
   * Release the cache of resource by url.
   * @param url
   */
  release(url) {
    var cache = this.cache;
    var queue = this._queue[url];
    if (queue) {
      queue.img = null;
      delete this._queue[url];
    }
    delete cache[url];
    delete cache[this._aliases[url]];
    delete this._aliases[url];
  }

  /**
   * Resource cache of all resources.
   */
  releaseAll() {
    var locCache = this.cache;
    for (var key in locCache) delete locCache[key];
    for (var key in this._aliases) delete this._aliases[key];
  }
}
