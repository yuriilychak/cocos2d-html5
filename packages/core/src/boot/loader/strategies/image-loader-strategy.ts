import ImagePool from "../../image-pool";
import LoaderStrategy from "./loader-strategy";
import { LoaderStrategyKey } from "../../../enums";
import LoadError from "../load-error";

import type { Sys } from "../../../sys";
import type { ImageQueueEntry, LoaderCallback, LoaderInterface, ImageLoaderCallback } from "../types";
import type { Texture2D, TextureCache } from "../../../textures";

export default class ImageLoaderStrategy extends LoaderStrategy<Texture2D> {
  #queue: Map<string, ImageQueueEntry> = new Map();
  #imagePool: ImagePool = new ImagePool();
  #sys: Sys;
  #textureCache: TextureCache | null = null;

  constructor(
    sys: Sys,
    loader: LoaderInterface,
    key: string = LoaderStrategyKey.IMAGE,
    supportedTypes: string[] = [
      "png",
      "jpg",
      "bmp",
      "jpeg",
      "gif",
      "ico",
      "tiff",
      "webp"
    ]
  ) {
    super(loader, key, supportedTypes);
    this.#sys = sys;
  }

  setTextureCache(textureCache: TextureCache) {
    this.#textureCache = textureCache;
  }

  loadImage(url: string): HTMLImageElement | null;
  loadImage(
    url: string,
    callback: ImageLoaderCallback
  ): HTMLImageElement | null;
  loadImage(
    url: string,
    options: object,
    callback: ImageLoaderCallback | null,
    image: HTMLImageElement
  ): HTMLImageElement | null;
  loadImage(
    url: string,
    optionOrCallback?: object | ImageLoaderCallback,
    callback?: ImageLoaderCallback | null,
    image?: HTMLImageElement
  ): HTMLImageElement | null {
    let cb: ImageLoaderCallback | null = null;
    const totalOptions = { isCrossOrigin: true };
    if (typeof optionOrCallback === "object") {
      totalOptions.isCrossOrigin =
        "isCrossOrigin" in optionOrCallback
          ? !!optionOrCallback.isCrossOrigin
          : true;
      cb = callback || null;
    } else if (!!optionOrCallback) {
      cb = optionOrCallback;
    }

    if (this.loader.has(url)) {
      const texture = this.loader.get<HTMLImageElement>(url)!;

      cb && cb(null, texture);
      return null;
    }

    if (this.#queue.has(url)) {
      const queue = this.#queue.get(url)!;

      if (cb) {
        queue.callbacks.push(cb);
      }
      return queue.image;
    }

    const localImage: HTMLImageElement = image || this.#imagePool.get();
    localImage.crossOrigin =
      totalOptions.isCrossOrigin && location.origin !== "file://"
        ? "Anonymous"
        : null;

    var onLoad = () => {
      localImage.removeEventListener("load", onLoad, false);
      localImage.removeEventListener("error", onError, false);

      this.#handleCallbacks(url, null, localImage);

      // WebGL uploads can be consumed after texImage2D returns on some browsers.
    };

    const onError = () => {
      localImage.removeEventListener("load", onLoad, false);
      localImage.removeEventListener("error", onError, false);

      if (
        window.location.protocol !== "https:" &&
        localImage.crossOrigin &&
        localImage.crossOrigin.toLowerCase() === "anonymous"
      ) {
        totalOptions.isCrossOrigin = false;
        this.loader.release(url);
        this.loadImage(url, totalOptions, cb, localImage);
      } else {
        this.#handleCallbacks(url, new LoadError("load image failed", 0));

        if (this.#sys.rendererConfig.isWebGL) {
          this.#imagePool.put(localImage);
        }
      }
    };

    this.#queue.set(url, {
      image: localImage,
      callbacks: cb ? [cb] : []
    });

    localImage.addEventListener("load", onLoad);
    localImage.addEventListener("error", onError);
    localImage.src = url;
    return localImage;
  }

  release(url: string): void {
    this.#queue.delete(url);
  }

  load(
    realUrl: string,
    url: string,
    res: unknown,
    cb: LoaderCallback<Texture2D>
  ) {
    const callback: ImageLoaderCallback = this.#queue.has(realUrl)
      ? (err: unknown, img?: HTMLImageElement) => {
          if (err) {
            return cb(err);
          }
          const texture =
            this.#textureCache!.getTextureForKey(url) ||
            this.#textureCache!.handleLoadedTexture(url, img!);
          cb(null, texture);
        }
      : (err: unknown, img?: HTMLImageElement) => {
          if (err) {
            return cb(err);
          }
          const texture = this.#textureCache!.handleLoadedTexture(url, img!);
          cb(null, texture);
        };

    this.loadImage(realUrl, callback);
  }

  #handleCallbacks(url: string, error: LoadError): void;
  #handleCallbacks(url: string, target: unknown, data?: HTMLImageElement): void;
  #handleCallbacks(
    url: string,
    targetOrError: unknown | LoadError,
    data?: HTMLImageElement
  ): void {
    if (this.#queue.has(url)) {
      const queue = this.#queue.get(url)!;
      const callbacks = queue.callbacks;
      for (let i = 0; i < callbacks.length; ++i) {
        const callback = callbacks[i];
        if (callback) callback(targetOrError, data);
      }
      this.#queue.delete(url);
    }
  }
}
