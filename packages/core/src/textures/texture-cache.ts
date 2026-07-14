/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import Path from "../boot/path";
import { log, assert, _LogInfos } from "../boot/debugger";
import { Texture2D } from "./texture-2d";

import type Loader from "../boot/loader";
import type { Texture2DInterface, TextureElement } from "./texture-2d/types";

type TextureLoadCallback = (texture: Texture2DInterface | Error, data?: unknown) => void;
type TextureLoader = Loader & {
  getBasePath?: () => string;
  loadImg(
    url: string,
    callback: (err: Error | null, img: TextureElement) => void
  ): unknown;
};

/**
 * TextureCache is a singleton class, it's the global cache for Texture2D
 */
export default class TextureCache {
  #loader: TextureLoader;
  #rendererInitialized: boolean;
  #textureColorsCache: Map<string, HTMLCanvasElement[]>;
  #textures: Map<string, Texture2D>;

  constructor(loader: TextureLoader) {
    this.#loader = loader;
    this.#textures = new Map();
    this.#textureColorsCache = new Map();
    this.#rendererInitialized = false;
  }

  /**
   * Initialize the renderer-specific logic. This should be called
   * from Game._initRenderer() after the renderer type is determined.
   */
  initRenderer(): void {
    this.#rendererInitialized = true;

    for (const [url, texture] of this.#textures) {
      if (texture.htmlElement && !texture.loaded) {
        texture.renderer.handleLoadedTexture(Path.extname(url) === ".png");
      }
    }
  }

  /**
   * <p>
   *     Returns a Texture2D object given an ETC filename                                                               <br/>
   *     If the file image was not previously loaded, it will create a new Texture2D                                  <br/>
   *     object and it will return it. Otherwise it will return a reference of a previously loaded image                <br/>
   *    note:addETCImage does not support on HTML5
   * </p>
   */
  addETCImage(filename: string): void {
    log(_LogInfos.textureCache_addETCImage);
  }

  /**
   * String representation.
   */
  toString(): string {
    return `<TextureCache | Texture count = ${this.#textures.size}>`;
  }

  /**
   * Returns an already created texture. Returns null if the texture doesn't exist.
   * @example
   * //example
   * var key = textureCache.getTextureForKey("hello.png");
   */
  getTextureForKey(textureKeyName: string): Texture2D | null {
    return (
      this.#textures.get(textureKeyName) ||
      this.#textures.get(this.#loader._getAliase(textureKeyName)) || null
    );
  }

  /**
   * @example
   * //example
   * var key = textureCache.getKeyByTexture(texture);
   */
  getKeyByTexture(texture: Texture2D): string | null {
    for (const [key, cachedTexture] of this.#textures) {
      if (cachedTexture === texture) {
        return key;
      }
    }
    return null;
  }

  #generalTextureKey(id: number): string {
    return "_textureKey_" + id;
  }

  /**
   * @example
   * //example
   * var cacheTextureForColor = textureCache.getTextureColors(texture);
   */
  getTextureColors(texture: Texture2D): HTMLCanvasElement[] {
    const image = texture.htmlElement;
    let key = this.getKeyByTexture(texture);

    if (!key) {
      key =
        image instanceof HTMLImageElement
          ? image.src
          : this.#generalTextureKey(texture.instanceId);
    }

    if (!this.#textureColorsCache.has(key)) {
      const cache = texture.renderer.generateTextureCacheForColor() ?? [];
      this.#textureColorsCache.set(key, cache);

      return cache;
    }
    return this.#textureColorsCache.get(key) ?? [];
  }

  /**
   * <p>Returns a Texture2D object given an PVR filename<br />
   * If the file image was not previously loaded, it will create a new Texture2D<br />
   *  object and it will return it. Otherwise it will return a reference of a previously loaded image </p>
   */
  addPVRImage(path: string): void {
    log(_LogInfos.textureCache_addPVRImage);
  }

  /**
   * <p>Purges the dictionary of loaded textures. <br />
   * Call this method if you receive the "Memory Warning"  <br />
   * In the short term: it will free some resources preventing your app from being killed  <br />
   * In the medium term: it will allocate more resources <br />
   * In the long term: it will be the same</p>
   * @example
   * //example
   * textureCache.removeAllTextures();
   */
  removeAllTextures(): void {
    for (const texture of this.#textures.values()) {
      if (texture) {
        texture.releaseTexture();
      }
    }
    this.#textures.clear();
  }

  /**
   * Deletes a texture from the cache given a texture
   * @example
   * //example
   * textureCache.removeTexture(texture);
   */
  removeTexture(texture: Texture2D | null): void {
    if (!texture) return;

    const locTextures = this.#textures;
    for (const [selKey, cachedTexture] of locTextures) {
      if (cachedTexture === texture) {
        cachedTexture.releaseTexture();
        locTextures.delete(selKey);
      }
    }
  }

  /**
   * Deletes a texture from the cache given a its key name
   * @example
   * //example
   * textureCache.removeTexture("hello.png");
   */
  removeTextureForKey(textureKeyName: string | null): void {
    if (textureKeyName == null) return;
    const tex = this.#textures.get(textureKeyName);
    if (tex) {
      tex.releaseTexture();
      this.#textures.delete(textureKeyName);
    }
  }

  /**
   *  Cache the image data
   */
  cacheImage(path: string, texture: Texture2D | TextureElement): void {
    if (texture instanceof Texture2D) {
      this.#textures.set(path, texture as Texture2D);
      return;
    }
    const texture2d = new Texture2D() as Texture2D;
    texture2d.htmlElement = texture;
    texture2d.renderer.handleLoadedTexture();
    this.#textures.set(path, texture2d);
  }

  /**
   * <p>Returns a Texture2D object given an UIImage image<br />
   * If the image was not previously loaded, it will create a new Texture2D object and it will return it.<br />
   * Otherwise it will return a reference of a previously loaded image<br />
   * The "key" parameter will be used as the "key" for the cache.<br />
   * If "key" is null, then a new texture will be created each time.</p>
   */
  addUIImage(
    image: TextureElement,
    key?: string | null
  ): Texture2D {
    assert(image, _LogInfos.textureCache_addUIImage_2);

    if (key) {
      const cachedTexture = this.#textures.get(key);
      if (cachedTexture) return cachedTexture;
    }

    // prevents overloading the autorelease pool
    const texture = new Texture2D() as Texture2D;
    texture.initWithImage(image);
    if (key != null) this.#textures.set(key, texture);
    else log(_LogInfos.textureCache_addUIImage);
    return texture;
  }

  /**
   * <p>Output to log the current contents of this TextureCache <br />
   * This will attempt to calculate the size of each texture, and the total texture memory in use. </p>
   */
  dumpCachedTextureInfo(): void {
    let count = 0;
    let totalBytes = 0;
    const locTextures = this.#textures;

    for (const [key, selTexture] of locTextures) {
      count++;
      if (selTexture.htmlElement instanceof HTMLImageElement)
        log(
          _LogInfos.textureCache_dumpCachedTextureInfo,
          key,
          selTexture.htmlElement.src,
          selTexture.pixelsWidth,
          selTexture.pixelsHeight
        );
      else {
        log(
          _LogInfos.textureCache_dumpCachedTextureInfo_2,
          key,
          selTexture.pixelsWidth,
          selTexture.pixelsHeight
        );
      }
      totalBytes += selTexture.pixelsWidth * selTexture.pixelsHeight * 4;
    }

    const locTextureColorsCache = this.#textureColorsCache;
    for (const [key, selCanvasColorsArr] of locTextureColorsCache) {
      if (!selCanvasColorsArr) continue;
      for (const selCanvasKey in selCanvasColorsArr) {
        const selCanvas = selCanvasColorsArr[selCanvasKey];
        count++;
        log(
          _LogInfos.textureCache_dumpCachedTextureInfo_2,
          key,
          selCanvas.width,
          selCanvas.height
        );
        totalBytes += selCanvas.width * selCanvas.height * 4;
      }
    }
    log(
      _LogInfos.textureCache_dumpCachedTextureInfo_3,
      count,
      totalBytes / 1024,
      (totalBytes / (1024.0 * 1024.0)).toFixed(2)
    );
  }

  clear(): void {
    this.#textures.clear();
    this.#textureColorsCache.clear();
  }

  handleLoadedTexture(url: string, img: TextureElement): Texture2D {
    let texture = this.#textures.get(url);

    if (!texture) {
      texture = new Texture2D() as Texture2D;
      texture.url = url;
      this.#textures.set(url, texture);
    }

    texture.htmlElement = img;

    if (this.#rendererInitialized) {
      const extension = Path.extname(url);

      const premultiplied =
        extension === ".png" || texture.renderer.hasPremultipliedAlpha;

      texture.renderer.handleLoadedTexture(premultiplied);
    }

    return texture;
  }

  addImage(
    url: string,
    cb?: TextureLoadCallback,
    target?: unknown
  ): Texture2D {
    assert(url, _LogInfos.Texture2D_addImage);

    const callCallback = (
      target: unknown,
      data: Texture2D | Error
    ): void => {
      cb?.call(target, data);
    };
    let texture =
      this.#textures.get(url) ||
      this.#textures.get(this.#loader._getAliase(url))!;

    if (texture) {
      if (texture.loaded) {
        callCallback(target, texture);
        return texture;
      }

      texture.addEventListener(
        "load",
        () => callCallback(target, texture),
        target
      );

      return texture;
    }

    texture = new Texture2D() as Texture2D;
    texture.url = url;
    this.#textures.set(url, texture);
    const basePath = this.#loader.getBasePath
      ? this.#loader.getBasePath()
      : this.#loader.resPath;

    this.#loader.loadImg(Path.join(basePath || "", url), (err, img) => {
      if (err) return callCallback(target, err);

      const texResult = this.handleLoadedTexture(url, img);
      callCallback(target, texResult);
    });

    return texture;
  }

  addImageAsync(
    url: string,
    cb?: TextureLoadCallback,
    target?: unknown
  ): Texture2D {
    return this.addImage(url, cb, target);
  }
}
