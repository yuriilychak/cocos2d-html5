import ImagePool from "../image-pool";
import LoaderStrategy from "./loader-strategy";
import { LoaderStrategyKey } from "../../enums";

export default class ImageLoaderStrategy extends LoaderStrategy {
  get strategyKey() {
    return LoaderStrategyKey.IMAGE;
  }
  get supportedTypes() {
    return ["png", "jpg", "bmp", "jpeg", "gif", "ico", "tiff", "webp"];
  }

  #queue = new Map();
  #imagePool = new ImagePool();
  #sys;
  #textureCache = null;

  constructor(sys, loader) {
    super(loader);
    this.#sys = sys;
  }

  setTextureCache(textureCache) {
    this.#textureCache = textureCache;
  }

  loadImage(url, option, callback, img) {
    var opt = { isCrossOrigin: true };
    if (callback !== undefined) {
      opt.isCrossOrigin =
        option.isCrossOrigin === undefined
          ? opt.isCrossOrigin
          : option.isCrossOrigin;
    } else if (option !== undefined) callback = option;

    var texture = this.loader.get(url);
    if (texture) {
      callback && callback(null, texture);
      return null;
    }

    if (this.#queue.has(url)) {
      const queue = this.#queue.get(url);
      queue.callbacks.push(callback);
      return queue.img;
    }

    img = img || this.#imagePool.get();
    if (opt.isCrossOrigin && location.origin !== "file://")
      img.crossOrigin = "Anonymous";
    else img.crossOrigin = null;

    var loadCallback = () => {
      img.removeEventListener("load", loadCallback, false);
      img.removeEventListener("error", errorCallback, false);

      this.#handleCallbacks(url, null, img);

      // WebGL uploads can be consumed after texImage2D returns on some browsers.
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
        this.loader.release(url);
        this.loadImage(url, opt, callback, img);
      } else {
        this.#handleCallbacks(url, "load image failed");

        if (this.#sys.rendererConfig.isWebGL) {
          this.#imagePool.put(img);
        }
      }
    };

    this.#queue.set(url, {
      img: img,
      callbacks: callback ? [callback] : []
    });

    img.addEventListener("load", loadCallback);
    img.addEventListener("error", errorCallback);
    img.src = url;
    return img;
  }

  release(url) {
    this.#queue.delete(url);
  }

  load(realUrl, url, res, cb) {
    const callback = this.#queue.has(realUrl)
      ? (err, img) => {
          if (err) return cb(err);
          var tex =
            this.#textureCache.getTextureForKey(url) ||
            this.#textureCache.handleLoadedTexture(url, img);
          cb(null, tex);
        }
      : (err, img) => {
          if (err) return cb(err);
          var tex = this.#textureCache.handleLoadedTexture(url, img);
          cb(null, tex);
        };

    this.loadImage(realUrl, callback);
  }

  #handleCallbacks(url, target, data) {
    if (this.#queue.has(url)) {
      const queue = this.#queue.get(url);
      const callbacks = queue.callbacks;
      for (let i = 0; i < callbacks.length; ++i) {
        const callback = callbacks[i];
        if (callback) callback(target, data);
      }
      this.#queue.delete(url);
    }
  }
}
