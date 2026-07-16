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
import { LoaderStrategyKey } from "../../enums";
import AsyncPool from "../async-pool";
import Path from "../path";
import { log } from "../debugger";
import { isString } from "../utils";
import LoadError from "./load-error";

import type { ImageLoaderCallback, LoaderAsyncPoolCallback, LoaderCallback, LoaderError, LoaderInterface, LoaderRegistration, LoaderStrategyInterface, LoadOptions, TriggerCallback } from "./types";
import type { Sys } from "../../sys";
import type { TextureCache } from "../../textures";

/**
 * Resource loading management. Singleton accessed via this.
 */
export default class Loader implements LoaderInterface {
  #register: Map<string, LoaderStrategyInterface> = new Map();
  #langPathCache: Map<string, string> = new Map();
  #aliases: Map<string, string> = new Map();
  #cache: Map<string, unknown> = new Map();
  #strategies: Map<string, LoaderStrategyInterface> = new Map();
  #noCache: boolean = false;
  #sys: Sys;
  #resPath: string = "";
  #audioPath: string = "";
  
  static #urlRegExp: RegExp = new RegExp("^(?:https?|ftp)://\\S*$", "i");
  static #noCacheRex: RegExp = /\?/;

  constructor(sys: Sys) {
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

  public setNoCache(value: boolean): void {
    this.#noCache = value;
  }

  public get<T>(key: string): T | null {
    return (this.#cache.get(key) || this.#cache.get(this.#aliases.get(key)!) || null) as (T | null);
  }

  public has(key: string): boolean {
    return this.#cache.has(key) || this.#cache.has(this.#aliases.get(key)!);
  }

  set(key: string, value: unknown): void {
    this.#cache.set(key, value);
  }

  public addStrategy(strategy: LoaderStrategyInterface): void  {
    this.#strategies.set(strategy.strategyKey, strategy);
    if (strategy.supportedTypes.length > 0)
      this.register(strategy.supportedTypes, strategy);
  }

  /**
   * Root path of resources.
   */

  public get resPath(): string {
    return this.#resPath;
  }

  public set resPath(value: string) {
    this.#resPath = value;
  }

  /**
   * Root path of audio resources
   */
  public get audioPath(): string {
    return this.#audioPath;
  }

  public set audioPath(value: string) {
    this.#audioPath = value;
  }

  /**
   * Get XMLHttpRequest.
   */
  public get XMLHttpRequest(): XMLHttpRequest {
    const xhr = (window.XMLHttpRequest
      ? new window.XMLHttpRequest()
      : new ActiveXObject("MSXML2.XMLHTTP")) as XMLHttpRequest & { _timeoutId?: number };
    xhr.timeout = 10000;
    if (xhr.ontimeout === undefined) {
      xhr._timeoutId = -1;
    }
    return xhr;
  }

  #load<T = unknown>(strategyKey: string, realUrl: string, cb: LoaderCallback<T>, url: string = '', res: unknown = null) {
    return this.#strategies.get(strategyKey)!.load(realUrl, url, res, cb as LoaderCallback);
  }

  /**
   * Load a single resource as txt.
   * @param {string} url
   * @param {function} [cb] arguments are : err, txt
   */
  public loadTxt(url: string, cb: LoaderCallback<string>) {
    return this.#load(LoaderStrategyKey.TEXT, url, cb);
  }

  /**
   * Load a single resource as json.
   */
  public loadJson(url: string, cb: LoaderCallback<object>) {
    return this.#load(LoaderStrategyKey.JSON, url, cb);
  }

  /**
   * Load a single image.
   */
  loadImg(url: string): HTMLImageElement | null;
  loadImg(
    url: string,
    callback: ImageLoaderCallback
  ): HTMLImageElement | null;
  loadImg(
    url: string,
    options: object,
    callback?: ImageLoaderCallback | null,
    image?: HTMLImageElement
  ): HTMLImageElement | null;
  loadImg(url: string, option?: object | ImageLoaderCallback, callback?: ImageLoaderCallback | null, img?: HTMLImageElement): HTMLImageElement | null {
    const strategy = this.#getStrategy<ImageLoaderStrategy>(LoaderStrategyKey.IMAGE);
    if(!option) {
      return strategy.loadImage(url);
    }

    if(typeof option !== 'object') {
      return strategy.loadImage(url, option);
    }

    return strategy.loadImage(url, option, callback!, img!);
  }

  loadBinary(url: string, cb: LoaderCallback<Uint8Array>) {
    return this.#load(LoaderStrategyKey.BINARY, url, cb);
  }

  public loadBinarySync(url: string): Uint8Array | null  {
    return this.#getStrategy<BinaryLoaderStrategy>(LoaderStrategyKey.BINARY).loadSync(url);
  }

  /**
   * Iterator function to load res
   */
  #loadResIterator(url: string, callback: LoaderCallback) {
    const type = Path.extname(url);

    var obj = this.get(url);
    if (obj) return callback(null, obj);
    let loader: LoaderStrategyInterface | undefined;
    if (type) {
      loader = this.#register.get(type.toLowerCase());
    }
    if (!loader) {
      return callback(new LoadError("loader for [" + type + "] doesn't exist!", 0));
    }
    var realUrl = url;
    if (!Loader.#urlRegExp.test(url)) {
      var basePath = loader.getBasePath ? loader.getBasePath() : this.resPath;
      realUrl = this.getUrl(basePath, url);
    }

    if (this.#noCache && typeof realUrl === "string") {
      if (Loader.#noCacheRex.test(realUrl))
        realUrl += `&_t=${Date.now()}`;
      else realUrl += `?_t=${Date.now()}`;
    }
    loader.load(realUrl, url, url, (err: unknown, data?: unknown) => {
      if (err !== null) {
        log(err);
        this.#cache.delete(url);
        callback(err as LoaderError);
      } else {
        this.#cache.set(url, data!);
        callback(null, data);
      }
    });
  }

  /**
   * Get url with basePath.
   */
  public getUrl(basePath: string, url?: string): string {
    if (basePath !== undefined && url === undefined) {
      url = basePath;
      var type = Path.extname(url);
      type = type ? type.toLowerCase() : "";
      var loader = this.#register.get(type);
      if (!loader) basePath = this.resPath;
      else basePath = loader.getBasePath ? loader.getBasePath() : this.resPath;
    }
    url = Path.join(basePath || "", url!);
    if (url.match(/[\/(\\\\)]lang[\/(\\\\)]/i)) {
      if (this.#langPathCache.has(url)) return this.#langPathCache.get(url)!;
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
   */
  load(resources: string | string[]): AsyncPool<string, LoadError, string[]>;
  load(resources: string | string[], callback: ImageLoaderCallback): AsyncPool<string, LoadError, string[]>;
  load(resources: string | string[], options: LoadOptions): AsyncPool<string, LoadError, string[]>;
  load(resources: string | string[], callback: ImageLoaderCallback): AsyncPool<string, LoadError, string[]>;
  load(resources: string | string[], optioloadns: ImageLoaderCallback, loadCallback: ImageLoaderCallback): AsyncPool<string, LoadError, string[]>;
  load(resources: string | string[], trigger: TriggerCallback, loadCallback: ImageLoaderCallback): AsyncPool<string, LoadError, string[]>;
  load(resources: string | string[], loadCallback: ImageLoaderCallback, target: unknown): AsyncPool<string, LoadError, string[]>;
  load(resources: string | string[], option?: LoadOptions | ImageLoaderCallback | TriggerCallback, loadCallback?: ImageLoaderCallback | unknown): AsyncPool<string, LoadError, string[]> {
    let localOptions: LoadOptions = option as LoadOptions;
    switch (arguments.length) {
      case 0:
        throw new Error("arguments error!");
      case 3:
        if (typeof option === "function") {
          if (typeof loadCallback === "function")
            localOptions = { trigger: option as TriggerCallback, cb: loadCallback as LoaderAsyncPoolCallback };
          else localOptions = { cb: option as LoaderAsyncPoolCallback, cbTarget: loadCallback };
        } else {
          localOptions = option!;
        }
        break;
      case 2:
        localOptions = typeof option === "function" ? { cb: option as LoaderAsyncPoolCallback } : option!;
        break;
      case 1:
        localOptions = {};
        break;
    }

    const localResources = resources instanceof Array ? resources : [resources];
    const limit = this.#sys.specification.isMobile ? 20 : 0;
    const asyncPool = new AsyncPool<string, LoadError, string[]>(
      localResources,
      limit,
      (value: string, _index: number, asyncPoolCallback: LoaderCallback, aPool: AsyncPool<string, LoadError, string[]>) => {
        this.#loadResIterator(value, (errOrTarget: LoadError | unknown, data?: unknown) => {
          if (localOptions.trigger) {
            localOptions.trigger.call(
              localOptions.triggerTarget,
              data,
              aPool.size,
              aPool.finishedSize
            );
          }
          asyncPoolCallback(errOrTarget, data);
        });
      },
      localOptions.cb,
      localOptions.cbTarget
    );
    asyncPool.flow();
    return asyncPool;
  }

  #handleAliases(names: Record<string, string>, cb: ImageLoaderCallback) {
    const resList: string[] = [];
    for (const name in names) {
      var value = names[name];
      this.#aliases.set(name, value);
      // Alias files may contain array values at runtime, although the cache
      // and loader APIs address each alias by a single resource URL.
      resList.push(value as string);
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
  loadAliases(url: string, callback: ImageLoaderCallback): void {
    const dict = this.get<{ filenames: Record<string, string | string[]> }>(url);

    if (!dict) {
      this.load(url, ((err: unknown, results?: unknown) => {
        if (err) return;
        const aliases = results as Record<string, string | string[]>[];
        this.#handleAliases(aliases[0].filenames as unknown as Record<string, string>, callback);
      }) as ImageLoaderCallback);
      return;
    } 

    this.#handleAliases(dict.filenames as unknown as Record<string, string>, callback);
  }

  /**
   * Register a resource loader into loader.
   */
  register(extension: string, loader: LoaderRegistration): void;
  register(extensions: string[], loader: LoaderRegistration): void;
  register(extNames: string | string[], loader: LoaderRegistration): void {
    if (!extNames || !extNames.length || !loader) {
      return;
    }

    const strategy: LoaderStrategyInterface = typeof loader === "function"
      ? {
        strategyKey: "",
        supportedTypes: [],
        getBasePath: () => this.resPath,
        load: (realUrl, url, resource, callback) => loader(realUrl, url, resource, callback)
      }
      : loader;
    const extensions: string[] = isString(extNames) ? [extNames] : extNames;

    for (let i = 0, li = extensions.length; i < li; ++i) {
      this.#register.set("." + extensions[i].trim().toLowerCase(), strategy);
    }
  }

  public registerDefaultLoaders(textureCache: TextureCache): void {
    this.#getStrategy<ImageLoaderStrategy>(LoaderStrategyKey.IMAGE).setTextureCache(textureCache);
    this.#getStrategy<ServerImageLoaderStrategy>(LoaderStrategyKey.SERVER_IMAGE)
      .setTextureCache(textureCache);
  }

  public registerTileMap(): void {
    const strategy = this.#getStrategy<TextLoaderStrategy>(LoaderStrategyKey.TEXT);
    this.register(strategy.tileMapTypes, strategy);
  }

  public registerBinaries(types: string[]): void {
    this.register(types, this.#getStrategy(LoaderStrategyKey.BINARY));
  }

  /**
   * Get aliase by url.
   */
  public getAliase(url: string): string {
    return this.#aliases.get(url) || '';
  }

  /**
   * Release the cache of resource by url.
   */
  public release(url: string): void {
    this.#getStrategy<ImageLoaderStrategy>(LoaderStrategyKey.IMAGE).release(url);
    this.#cache.delete(url);
    this.#cache.delete(this.#aliases.get(url)!);
    this.#aliases.delete(url);
  }

  /**
   * Resource cache of all resources.
   */
  public releaseAll(): void {
    this.#cache.clear();
    this.#aliases.clear();
  }

  #getStrategy<T extends LoaderStrategyInterface = LoaderStrategyInterface>(key: string): T {
    return this.#strategies.get(key)! as T;
  }
}
