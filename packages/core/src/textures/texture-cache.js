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

import Game from "../boot/game";
import Loader from "../boot/loader";
import Path from "../boot/path";
import { log, assert, _LogInfos } from "../boot/debugger";
import TextureCacheCanvasRenderer from "./texture-cache-canvas-renderer";
import TextureCacheWebGLRenderer from "./texture-cache-webgl-renderer";

/**
 * TextureCache is a singleton class, it's the global cache for Texture2D
 */
export default class TextureCache {
  static _instance = null;

  static getInstance() {
    if (!TextureCache._instance) {
      TextureCache._instance = new TextureCache();
    }
    return TextureCache._instance;
  }

  constructor() {
    if (TextureCache._instance) {
      return TextureCache._instance;
    }
    
    this._textures = {};
    this._textureColorsCache = {};
    this._textureKeySeq = 0 | (Math.random() * 1000);
    this._loadedTexturesBefore = {};
    this._renderer = null; // Will be set by initRenderer()
    
    TextureCache._instance = this;
  }

  /**
   * Initialize the renderer-specific logic. This should be called
   * from Game._initRenderer() after the renderer type is determined.
   */
  initRenderer() {
    if (cc._renderType === Game.RENDER_TYPE_CANVAS) {
      this._renderer = new TextureCacheCanvasRenderer(this);
    } else {
      this._renderer = new TextureCacheWebGLRenderer(this);
    }
    
    // Process any textures that were loaded before renderer was ready
    this._initializingRenderer();
  }

  //handleLoadedTexture move to Canvas/WebGL

  _initializingRenderer() {
    var selPath;
    //init texture from _loadedTexturesBefore
    var locLoadedTexturesBefore = this._loadedTexturesBefore,
      locTextures = this._textures;
    for (selPath in locLoadedTexturesBefore) {
      var tex2d = locLoadedTexturesBefore[selPath];
      tex2d.handleLoadedTexture();
      locTextures[selPath] = tex2d;
    }
    this._loadedTexturesBefore = {};
  }

  /**
   * <p>
   *     Returns a Texture2D object given an PVR filename                                                              <br/>
   *     If the file image was not previously loaded, it will create a new Texture2D                                 <br/>
   *     object and it will return it. Otherwise it will return a reference of a previously loaded image              <br/>
   *     note: AddPVRTCImage does not support on HTML5
   * </p>
   * @param {String} filename
   * @return {Texture2D}
   */
  addPVRTCImage(filename) {
    log(_LogInfos.textureCache_addPVRTCImage);
  }

  /**
   * <p>
   *     Returns a Texture2D object given an ETC filename                                                               <br/>
   *     If the file image was not previously loaded, it will create a new Texture2D                                  <br/>
   *     object and it will return it. Otherwise it will return a reference of a previously loaded image                <br/>
   *    note:addETCImage does not support on HTML5
   * </p>
   * @param {String} filename
   * @return {Texture2D}
   */
  addETCImage(filename) {
    log(_LogInfos.textureCache_addETCImage);
  }

  /**
   * Description
   * @return {String}
   */
  description() {
    return (
      "<TextureCache | Number of textures = " + this._textures.length + ">"
    );
  }

  /**
   * Returns an already created texture. Returns null if the texture doesn't exist.
   * @param {String} textureKeyName
   * @return {Texture2D|Null}
   * @example
   * //example
   * var key = textureCache.getTextureForKey("hello.png");
   */
  getTextureForKey(textureKeyName) {
    return (
      this._textures[textureKeyName] ||
      this._textures[Loader.getInstance()._getAliase(textureKeyName)]
    );
  }

  /**
   * @param {Image} texture
   * @return {String|Null}
   * @example
   * //example
   * var key = cc.textureCache.getKeyByTexture(texture);
   */
  getKeyByTexture(texture) {
    for (var key in this._textures) {
      if (this._textures[key] === texture) {
        return key;
      }
    }
    return null;
  }

  _generalTextureKey(id) {
    return "_textureKey_" + id;
  }

  /**
   * @param {Image} texture
   * @return {Array}
   * @example
   * //example
   * var cacheTextureForColor = cc.textureCache.getTextureColors(texture);
   */
  getTextureColors(texture) {
    var image = texture._htmlElementObj;
    var key = this.getKeyByTexture(image);
    if (!key) {
      if (image instanceof HTMLImageElement) key = image.src;
      else key = this._generalTextureKey(texture.__instanceId);
    }

    if (!this._textureColorsCache[key])
      this._textureColorsCache[key] = texture._generateTextureCacheForColor();
    return this._textureColorsCache[key];
  }

  /**
   * <p>Returns a Texture2D object given an PVR filename<br />
   * If the file image was not previously loaded, it will create a new Texture2D<br />
   *  object and it will return it. Otherwise it will return a reference of a previously loaded image </p>
   * @param {String} path
   * @return {Texture2D}
   */
  addPVRImage(path) {
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
  removeAllTextures() {
    var locTextures = this._textures;
    for (var selKey in locTextures) {
      if (locTextures[selKey]) locTextures[selKey].releaseTexture();
    }
    this._textures = {};
  }

  /**
   * Deletes a texture from the cache given a texture
   * @param {Image} texture
   * @example
   * //example
   * textureCache.removeTexture(texture);
   */
  removeTexture(texture) {
    if (!texture) return;

    var locTextures = this._textures;
    for (var selKey in locTextures) {
      if (locTextures[selKey] === texture) {
        locTextures[selKey].releaseTexture();
        delete locTextures[selKey];
      }
    }
  }

  /**
   * Deletes a texture from the cache given a its key name
   * @param {String} textureKeyName
   * @example
   * //example
   * textureCache.removeTexture("hello.png");
   */
  removeTextureForKey(textureKeyName) {
    if (textureKeyName == null) return;
    var tex = this._textures[textureKeyName];
    if (tex) {
      tex.releaseTexture();
      delete this._textures[textureKeyName];
    }
  }

  //addImage move to Canvas/WebGL

  /**
   *  Cache the image data
   * @param {String} path
   * @param {Image|HTMLImageElement|HTMLCanvasElement} texture
   */
  cacheImage(path, texture) {
    if (texture instanceof cc.Texture2D) {
      this._textures[path] = texture;
      return;
    }
    var texture2d = new cc.Texture2D();
    texture2d.initWithElement(texture);
    texture2d.handleLoadedTexture();
    this._textures[path] = texture2d;
  }

  /**
   * <p>Returns a Texture2D object given an UIImage image<br />
   * If the image was not previously loaded, it will create a new Texture2D object and it will return it.<br />
   * Otherwise it will return a reference of a previously loaded image<br />
   * The "key" parameter will be used as the "key" for the cache.<br />
   * If "key" is null, then a new texture will be created each time.</p>
   * @param {HTMLImageElement|HTMLCanvasElement} image
   * @param {String} key
   * @return {Texture2D}
   */
  addUIImage(image, key) {
    assert(image, _LogInfos.textureCache_addUIImage_2);

    if (key) {
      if (this._textures[key]) return this._textures[key];
    }

    // prevents overloading the autorelease pool
    var texture = new cc.Texture2D();
    texture.initWithImage(image);
    if (key != null) this._textures[key] = texture;
    else log(_LogInfos.textureCache_addUIImage);
    return texture;
  }

  /**
   * <p>Output to log the current contents of this TextureCache <br />
   * This will attempt to calculate the size of each texture, and the total texture memory in use. </p>
   */
  dumpCachedTextureInfo() {
    var count = 0;
    var totalBytes = 0,
      locTextures = this._textures;

    for (var key in locTextures) {
      var selTexture = locTextures[key];
      count++;
      if (selTexture.getHtmlElementObj() instanceof HTMLImageElement)
        log(
          _LogInfos.textureCache_dumpCachedTextureInfo,
          key,
          selTexture.getHtmlElementObj().src,
          selTexture.getPixelsWide(),
          selTexture.getPixelsHigh()
        );
      else {
        log(
          _LogInfos.textureCache_dumpCachedTextureInfo_2,
          key,
          selTexture.getPixelsWide(),
          selTexture.getPixelsHigh()
        );
      }
      totalBytes += selTexture.getPixelsWide() * selTexture.getPixelsHigh() * 4;
    }

    var locTextureColorsCache = this._textureColorsCache;
    for (key in locTextureColorsCache) {
      var selCanvasColorsArr = locTextureColorsCache[key];
      for (var selCanvasKey in selCanvasColorsArr) {
        var selCanvas = selCanvasColorsArr[selCanvasKey];
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

  _clear() {
    this._textures = {};
    this._textureColorsCache = {};
    this._textureKeySeq = 0 | (Math.random() * 1000);
    this._loadedTexturesBefore = {};
  }
  handleLoadedTexture(url, img) {
    if (!this._renderer) {
      // If renderer is not yet initialized, store in _loadedTexturesBefore
      // to be processed later by _initializingRenderer()
      var tex = this._loadedTexturesBefore[url];
      if (!tex) {
        tex = this._loadedTexturesBefore[url] = new cc.Texture2D();
        tex.url = url;
      }
      // Set basic dimensions before renderer is ready
      tex._htmlElementObj = img;
      tex._pixelsWide = tex._contentSize.width = img.width;
      tex._pixelsHigh = tex._contentSize.height = img.height;
      tex._textureLoaded = true;
      return tex;
    }
    return this._renderer.handleLoadedTexture(url, img);
  }

  addImage(url, cb, target) {
    if (!this._renderer) {
      // If renderer is not yet initialized, create texture in _loadedTexturesBefore
      var tex = this._loadedTexturesBefore[url] || this._loadedTexturesBefore[Loader.getInstance()._getAliase(url)];
      if (tex) {
        if (tex.isLoaded()) {
          cb && cb.call(target, tex);
          return tex;
        } else {
          tex.addEventListener(
            "load",
            function () {
              cb && cb.call(target, tex);
            },
            target
          );
          return tex;
        }
      }
      
      tex = this._loadedTexturesBefore[url] = new cc.Texture2D();
      tex.url = url;
      var basePath = Loader.getInstance().getBasePath
        ? Loader.getInstance().getBasePath()
        : Loader.getInstance().resPath;
      var textureCache = this;
      Loader.getInstance().loadImg(Path.join(basePath || "", url), function (err, img) {
        if (err) return cb && cb.call(target, err);

        var texResult = textureCache.handleLoadedTexture(url, img);
        cb && cb.call(target, texResult);
      });
      
      return tex;
    }
    return this._renderer.addImage(url, cb, target);
  }

  addImageAsync(url, cb, target) {
    return this.addImage(url, cb, target);
  }
}
