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

import { NewClass } from "../platform/class";
import EventHelper from "../event-manager/event-helper";
import { initWebGLTexture2D } from "./texture-2d-webgl";
import { Rect } from "../cocoa/geometry/rect";
import { Size } from "../cocoa/geometry/size";
import Game from "../boot/game";
import Loader from "../boot/loader";
import Sys from "../boot/sys";
import { log, _LogInfos } from "../boot/debugger";

export {
  ALIGN_CENTER,
  ALIGN_TOP,
  ALIGN_TOP_RIGHT,
  ALIGN_RIGHT,
  ALIGN_BOTTOM_RIGHT,
  ALIGN_BOTTOM,
  ALIGN_BOTTOM_LEFT,
  ALIGN_LEFT,
  ALIGN_TOP_LEFT
} from "./constants";

//----------------------Possible texture pixel formats----------------------------

// By default PVR images are treated as if they don't have the alpha channel premultiplied
export let PVRHaveAlphaPremultiplied_ = false;

//cc.Texture2DWebGL move to TextureWebGL.js

Game.getInstance().addEventListener(Game.EVENT_RENDERER_INITED, function () {
  if (cc._renderType === Game.RENDER_TYPE_CANVAS) {
    /**
     * <p>
     * This class allows to easily create OpenGL or Canvas 2D textures from images, text or raw data.                                    <br/>
     * The created cc.Texture2D object will always have power-of-two dimensions.                                                <br/>
     * Depending on how you create the cc.Texture2D object, the actual image area of the texture might be smaller than the texture dimensions <br/>
     *  i.e. "contentSize" != (pixelsWide, pixelsHigh) and (maxS, maxT) != (1.0, 1.0).                                           <br/>
     * Be aware that the content of the generated textures will be upside-down! </p>
     * @name cc.Texture2D
     * @class
     * @extends cc.Class
     *
     * @property {WebGLTexture}     name            - <@readonly> WebGLTexture Object
     * @property {Number}           pixelFormat     - <@readonly> Pixel format of the texture
     * @property {Number}           pixelsWidth     - <@readonly> Width in pixels
     * @property {Number}           pixelsHeight    - <@readonly> Height in pixels
     * @property {Number}           width           - Content width in points
     * @property {Number}           height          - Content height in points
     * @property {GLProgram}     shaderProgram   - The shader program used by drawAtPoint and drawInRect
     * @property {Number}           maxS            - Texture max S
     * @property {Number}           maxT            - Texture max T
     */
    cc.Texture2D = class Texture2D extends EventHelper(NewClass) {
      constructor() {
        super();
        this._contentSize = new Size(0, 0);
        this._textureLoaded = false;
        this._htmlElementObj = null;
        this.url = null;
        this._pattern = "";
        this._pixelsWide = 0;
        this._pixelsHigh = 0;
        this._grayElementObj = null;
        this._backupElement = null;
        this._isGray = false;
      }

      getPixelsWide() {
        return this._pixelsWide;
      }

      getPixelsHigh() {
        return this._pixelsHigh;
      }

      getContentSize() {
        var locScaleFactor = cc.contentScaleFactor();
        return new Size(
          this._contentSize.width / locScaleFactor,
          this._contentSize.height / locScaleFactor
        );
      }

      _getWidth() {
        return this._contentSize.width / cc.contentScaleFactor();
      }
      _getHeight() {
        return this._contentSize.height / cc.contentScaleFactor();
      }

      getContentSizeInPixels() {
        return this._contentSize;
      }

      initWithElement(element) {
        if (!element) return;
        this._htmlElementObj = element;
        this._pixelsWide = this._contentSize.width = element.width;
        this._pixelsHigh = this._contentSize.height = element.height;
        this._textureLoaded = true;
      }

      getHtmlElementObj() {
        return this._htmlElementObj;
      }

      isLoaded() {
        return this._textureLoaded;
      }

      handleLoadedTexture() {
        var self = this;
        if (!self._htmlElementObj) {
          return;
        }

        var locElement = self._htmlElementObj;
        self._pixelsWide = self._contentSize.width = locElement.width;
        self._pixelsHigh = self._contentSize.height = locElement.height;

        //dispatch load event to listener.
        self.dispatchEvent("load");
      }

      description() {
        return (
          "<cc.Texture2D | width = " +
          this._contentSize.width +
          " height " +
          this._contentSize.height +
          ">"
        );
      }

      initWithData(data, pixelFormat, pixelsWide, pixelsHigh, contentSize) {
        //support only in WebGl rendering mode
        return false;
      }

      initWithImage(uiImage) {
        //support only in WebGl rendering mode
        return false;
      }

      initWithString(
        text,
        fontName,
        fontSize,
        dimensions,
        hAlignment,
        vAlignment
      ) {
        //support only in WebGl rendering mode
        return false;
      }

      releaseTexture() {
        this._htmlElementObj = null;
        Loader.getInstance().release(this.url);
      }

      getName() {
        //support only in WebGl rendering mode
        return null;
      }

      getMaxS() {
        //support only in WebGl rendering mode
        return 1;
      }

      setMaxS(maxS) {
        //support only in WebGl rendering mode
      }

      getMaxT() {
        return 1;
      }

      setMaxT(maxT) {
        //support only in WebGl rendering mode
      }

      getPixelFormat() {
        //support only in WebGl rendering mode
        return null;
      }

      getShaderProgram() {
        //support only in WebGl rendering mode
        return null;
      }

      setShaderProgram(shaderProgram) {
        //support only in WebGl rendering mode
      }

      hasPremultipliedAlpha() {
        //support only in WebGl rendering mode
        return false;
      }

      hasMipmaps() {
        //support only in WebGl rendering mode
        return false;
      }

      releaseData(data) {
        //support only in WebGl rendering mode
        data = null;
      }

      keepData(data, length) {
        //support only in WebGl rendering mode
        return data;
      }

      drawAtPoint(point) {
        //support only in WebGl rendering mode
      }

      drawInRect(rect) {
        //support only in WebGl rendering mode
      }

      /**
       * init with ETC file
       * @warning does not support on HTML5
       */
      initWithETCFile(file) {
        log(_LogInfos.Texture2D_initWithETCFile);
        return false;
      }

      /**
       * init with PVR file
       * @warning does not support on HTML5
       */
      initWithPVRFile(file) {
        log(_LogInfos.Texture2D_initWithPVRFile);
        return false;
      }

      /**
       * init with PVRTC data
       * @warning does not support on HTML5
       */
      initWithPVRTCData(data, level, bpp, hasAlpha, length, pixelFormat) {
        log(_LogInfos.Texture2D_initWithPVRTCData);
        return false;
      }

      setTexParameters(texParams, magFilter, wrapS, wrapT) {
        if (magFilter !== undefined)
          texParams = {
            minFilter: texParams,
            magFilter: magFilter,
            wrapS: wrapS,
            wrapT: wrapT
          };

        if (texParams.wrapS === cc.REPEAT && texParams.wrapT === cc.REPEAT) {
          this._pattern = "repeat";
          return;
        }

        if (texParams.wrapS === cc.REPEAT) {
          this._pattern = "repeat-x";
          return;
        }

        if (texParams.wrapT === cc.REPEAT) {
          this._pattern = "repeat-y";
          return;
        }

        this._pattern = "";
      }

      setAntiAliasTexParameters() {
        //support only in WebGl rendering mode
      }

      setAliasTexParameters() {
        //support only in WebGl rendering mode
      }

      generateMipmap() {
        //support only in WebGl rendering mode
      }

      stringForFormat() {
        //support only in WebGl rendering mode
        return "";
      }

      bitsPerPixelForFormat(format) {
        //support only in WebGl rendering mode
        return -1;
      }

      removeLoadedEventListener(target) {
        this.removeEventTarget("load", target);
      }

      _generateColorTexture() {
        /*overide*/
      }
      _generateTextureCacheForColor() {
        if (this.channelCache) return this.channelCache;

        var textureCache = [
          document.createElement("canvas"),
          document.createElement("canvas"),
          document.createElement("canvas"),
          document.createElement("canvas")
        ];
        //todo texture onload
        renderToCache(this._htmlElementObj, textureCache);
        return (this.channelCache = textureCache);
      }

      //hack for gray effect
      _switchToGray(toGray) {
        if (!this._textureLoaded || this._isGray === toGray) return;
        this._isGray = toGray;
        if (this._isGray) {
          this._backupElement = this._htmlElementObj;
          if (!this._grayElementObj)
            this._grayElementObj = cc.Texture2D._generateGrayTexture(
              this._htmlElementObj
            );
          this._htmlElementObj = this._grayElementObj;
        } else {
          if (this._backupElement !== null)
            this._htmlElementObj = this._backupElement;
        }
      }

      _generateGrayTexture() {
        if (!this._textureLoaded) return null;
        var grayElement = cc.Texture2D._generateGrayTexture(
          this._htmlElementObj
        );
        var newTexture = new cc.Texture2D();
        newTexture.initWithElement(grayElement);
        newTexture.handleLoadedTexture();
        return newTexture;
      }
    };

    var renderToCache = function (image, cache) {
      var w = image.width;
      var h = image.height;

      cache[0].width = w;
      cache[0].height = h;
      cache[1].width = w;
      cache[1].height = h;
      cache[2].width = w;
      cache[2].height = h;
      cache[3].width = w;
      cache[3].height = h;

      var cacheCtx = cache[3].getContext("2d");
      cacheCtx.drawImage(image, 0, 0);
      var pixels = cacheCtx.getImageData(0, 0, w, h).data;

      var ctx;
      for (var rgbI = 0; rgbI < 4; rgbI++) {
        ctx = cache[rgbI].getContext("2d");

        var to = ctx.getImageData(0, 0, w, h);
        var data = to.data;
        for (var i = 0; i < pixels.length; i += 4) {
          data[i] = rgbI === 0 ? pixels[i] : 0;
          data[i + 1] = rgbI === 1 ? pixels[i + 1] : 0;
          data[i + 2] = rgbI === 2 ? pixels[i + 2] : 0;
          data[i + 3] = pixels[i + 3];
        }
        ctx.putImageData(to, 0, 0);
      }
      image.onload = null;
    };

    //change color function
    if (Sys.getInstance()._supportCanvasNewBlendModes) {
      //multiply mode
      cc.Texture2D.prototype._generateColorTexture = function (
        r,
        g,
        b,
        rect,
        canvas
      ) {
        var onlyCanvas = false;
        if (canvas) onlyCanvas = true;
        else canvas = document.createElement("canvas");
        var textureImage = this._htmlElementObj;
        if (!rect)
          rect = new Rect(0, 0, textureImage.width, textureImage.height);

        canvas.width = rect.width;
        canvas.height = rect.height;

        var context = canvas.getContext("2d");
        context.globalCompositeOperation = "source-over";
        context.fillStyle =
          "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";
        context.fillRect(0, 0, rect.width, rect.height);
        context.globalCompositeOperation = "multiply";
        context.drawImage(
          textureImage,
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          0,
          0,
          rect.width,
          rect.height
        );
        context.globalCompositeOperation = "destination-atop";
        context.drawImage(
          textureImage,
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          0,
          0,
          rect.width,
          rect.height
        );
        if (onlyCanvas) return canvas;
        var newTexture = new cc.Texture2D();
        newTexture.initWithElement(canvas);
        newTexture.handleLoadedTexture();
        return newTexture;
      };
    } else {
      //Four color map overlay
      cc.Texture2D.prototype._generateColorTexture = function (
        r,
        g,
        b,
        rect,
        canvas
      ) {
        var onlyCanvas = false;
        if (canvas) onlyCanvas = true;
        else canvas = document.createElement("canvas");

        var textureImage = this._htmlElementObj;
        if (!rect)
          rect = new Rect(0, 0, textureImage.width, textureImage.height);
        var x, y, w, h;
        x = rect.x;
        y = rect.y;
        w = rect.width;
        h = rect.height;
        if (!w || !h) return;

        canvas.width = w;
        canvas.height = h;

        var context = canvas.getContext("2d");
        var tintedImgCache = cc.textureCache.getTextureColors(this);
        context.globalCompositeOperation = "lighter";
        context.drawImage(tintedImgCache[3], x, y, w, h, 0, 0, w, h);
        if (r > 0) {
          context.globalAlpha = r / 255;
          context.drawImage(tintedImgCache[0], x, y, w, h, 0, 0, w, h);
        }
        if (g > 0) {
          context.globalAlpha = g / 255;
          context.drawImage(tintedImgCache[1], x, y, w, h, 0, 0, w, h);
        }
        if (b > 0) {
          context.globalAlpha = b / 255;
          context.drawImage(tintedImgCache[2], x, y, w, h, 0, 0, w, h);
        }
        if (onlyCanvas) return canvas;

        var newTexture = new cc.Texture2D();
        newTexture.initWithElement(canvas);
        newTexture.handleLoadedTexture();
        return newTexture;
      };
    }

    cc.Texture2D._generateGrayTexture = function (texture, rect, renderCanvas) {
      if (texture === null) return null;
      renderCanvas = renderCanvas || document.createElement("canvas");
      rect = rect || new Rect(0, 0, texture.width, texture.height);
      renderCanvas.width = rect.width;
      renderCanvas.height = rect.height;

      var context = renderCanvas.getContext("2d");
      context.drawImage(
        texture,
        rect.x,
        rect.y,
        rect.width,
        rect.height,
        0,
        0,
        rect.width,
        rect.height
      );
      var imgData = context.getImageData(0, 0, rect.width, rect.height);
      var data = imgData.data;
      for (var i = 0, len = data.length; i < len; i += 4) {
        data[i] =
          data[i + 1] =
          data[i + 2] =
            0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      }
      context.putImageData(imgData, 0, 0);
      return renderCanvas;
    };
  } else if (cc._renderType === Game.RENDER_TYPE_WEBGL) {
    initWebGLTexture2D();
  }

  const _c = cc.Texture2D;

  _c.PVRImagesHavePremultipliedAlpha = function (haveAlphaPremultiplied) {
    cc.PVRHaveAlphaPremultiplied_ = haveAlphaPremultiplied;
  };

  _c.PIXEL_FORMAT_RGBA8888 = 2;
  _c.PIXEL_FORMAT_RGB888 = 3;
  _c.PIXEL_FORMAT_RGB565 = 4;
  _c.PIXEL_FORMAT_A8 = 5;
  _c.PIXEL_FORMAT_I8 = 6;
  _c.PIXEL_FORMAT_AI88 = 7;
  _c.PIXEL_FORMAT_RGBA4444 = 8;
  _c.PIXEL_FORMAT_RGB5A1 = 7;
  _c.PIXEL_FORMAT_PVRTC4 = 9;
  _c.PIXEL_FORMAT_PVRTC2 = 10;
  _c.PIXEL_FORMAT_DEFAULT = _c.PIXEL_FORMAT_RGBA8888;
  _c.defaultPixelFormat = _c.PIXEL_FORMAT_DEFAULT;

  const _M = (cc.Texture2D._M = {});
  _M[_c.PIXEL_FORMAT_RGBA8888] = "RGBA8888";
  _M[_c.PIXEL_FORMAT_RGB888] = "RGB888";
  _M[_c.PIXEL_FORMAT_RGB565] = "RGB565";
  _M[_c.PIXEL_FORMAT_A8] = "A8";
  _M[_c.PIXEL_FORMAT_I8] = "I8";
  _M[_c.PIXEL_FORMAT_AI88] = "AI88";
  _M[_c.PIXEL_FORMAT_RGBA4444] = "RGBA4444";
  _M[_c.PIXEL_FORMAT_RGB5A1] = "RGB5A1";
  _M[_c.PIXEL_FORMAT_PVRTC4] = "PVRTC4";
  _M[_c.PIXEL_FORMAT_PVRTC2] = "PVRTC2";

  const _B = (cc.Texture2D._B = {});
  _B[_c.PIXEL_FORMAT_RGBA8888] = 32;
  _B[_c.PIXEL_FORMAT_RGB888] = 24;
  _B[_c.PIXEL_FORMAT_RGB565] = 16;
  _B[_c.PIXEL_FORMAT_A8] = 8;
  _B[_c.PIXEL_FORMAT_I8] = 8;
  _B[_c.PIXEL_FORMAT_AI88] = 16;
  _B[_c.PIXEL_FORMAT_RGBA4444] = 16;
  _B[_c.PIXEL_FORMAT_RGB5A1] = 16;
  _B[_c.PIXEL_FORMAT_PVRTC4] = 4;
  _B[_c.PIXEL_FORMAT_PVRTC2] = 3;

  const _p = cc.Texture2D.prototype;

  Object.defineProperties(_p, {
    name: {
      get() {
        return this.getName();
      }
    },
    pixelFormat: {
      get() {
        return this.getPixelFormat();
      }
    },
    pixelsWidth: {
      get() {
        return this.getPixelsWide();
      }
    },
    pixelsHeight: {
      get() {
        return this.getPixelsHigh();
      }
    },
    width: {
      get() {
        return this._getWidth();
      }
    },
    height: {
      get() {
        return this._getHeight();
      }
    }
  });
});
