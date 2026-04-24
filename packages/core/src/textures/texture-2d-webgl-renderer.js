import { RendererConfig } from "../renderer/renderer-config";
import { Size } from "../cocoa/geometry/size";
import Game from "../boot/game";
import { log, assert, _LogInfos } from "../boot/debugger";
import { glBindTexture2D } from "../shaders/CCGLStateCache";
import ShaderCache from "../shaders/CCShaderCache";
import { NextPOT } from "../platform/macro/utils";
import {
  SHADER_POSITION_TEXTURE,
  VERTEX_ATTRIB_POSITION,
  VERTEX_ATTRIB_TEX_COORDS
} from "../platform/macro/constants";

export default class WebGLTextureRenderer {
  constructor(texture) {
    this._texture = texture;
    this._pixelFormat = null;
    this._name = "";
    this._maxS = 0;
    this._maxT = 0;
    this._hasPremultipliedAlpha = false;
    this._hasMipmaps = false;
    this._shaderProgram = null;
    this._webTextureObj = null;
  }

  initWithElement(element) {
    if (!element) return;
    var t = this._texture;
    this._webTextureObj =
      RendererConfig.getInstance().renderContext.createTexture();
    t._htmlElementObj = element;
    t._pixelsWide = t._contentSize.width = element.width;
    t._pixelsHigh = t._contentSize.height = element.height;
    t._textureLoaded = true;
    this._hasPremultipliedAlpha = true;
  }

  handleLoadedTexture(premultiplied) {
    var t = this._texture;
    premultiplied =
      premultiplied !== undefined ? premultiplied : this._hasPremultipliedAlpha;
    if (!Game.getInstance()._rendererInitialized) return;
    if (!t._htmlElementObj) return;
    if (!t._htmlElementObj.width || !t._htmlElementObj.height) return;

    var gl = RendererConfig.getInstance().renderContext;

    glBindTexture2D(t);

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    if (premultiplied) gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      t._htmlElementObj
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this._shaderProgram = ShaderCache.getInstance().programForKey(
      SHADER_POSITION_TEXTURE
    );
    glBindTexture2D(null);
    if (premultiplied) gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);

    var pixelsWide = t._htmlElementObj.width;
    var pixelsHigh = t._htmlElementObj.height;

    t._pixelsWide = t._contentSize.width = pixelsWide;
    t._pixelsHigh = t._contentSize.height = pixelsHigh;
    this._pixelFormat = cc.Texture2D.PIXEL_FORMAT_RGBA8888;
    this._maxS = 1;
    this._maxT = 1;

    this._hasPremultipliedAlpha = premultiplied;
    this._hasMipmaps = false;
    if (window.ENABLE_IMAEG_POOL) {
      t._htmlElementObj = null;
    }

    t.dispatchEvent("load");
  }

  releaseTexture() {
    var t = this._texture;
    if (this._webTextureObj)
      RendererConfig.getInstance().renderContext.deleteTexture(
        this._webTextureObj
      );
    t._htmlElementObj = null;
  }

  getPixelFormat() {
    return this._pixelFormat;
  }

  getName() {
    return this._webTextureObj;
  }

  getMaxS() {
    return this._maxS;
  }

  setMaxS(maxS) {
    this._maxS = maxS;
  }

  getMaxT() {
    return this._maxT;
  }

  setMaxT(maxT) {
    this._maxT = maxT;
  }

  getShaderProgram() {
    return this._shaderProgram;
  }

  setShaderProgram(shaderProgram) {
    this._shaderProgram = shaderProgram;
  }

  hasPremultipliedAlpha() {
    return this._hasPremultipliedAlpha;
  }

  hasMipmaps() {
    return this._hasMipmaps;
  }

  description() {
    var t = this._texture;
    return (
      "<Texture2D | Name = " +
      this._name +
      " | Dimensions = " +
      t._pixelsWide +
      " x " +
      t._pixelsHigh +
      " | Coordinates = (" +
      this._maxS +
      ", " +
      this._maxT +
      ")>"
    );
  }

  initWithData(data, pixelFormat, pixelsWide, pixelsHigh, contentSize) {
    var t = this._texture;
    var tex2d = cc.Texture2D;
    var gl = RendererConfig.getInstance().renderContext;
    var format = gl.RGBA,
      type = gl.UNSIGNED_BYTE;

    var bitsPerPixel = cc.Texture2D._B[pixelFormat];

    var bytesPerRow = (pixelsWide * bitsPerPixel) / 8;
    if (bytesPerRow % 8 === 0) {
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 8);
    } else if (bytesPerRow % 4 === 0) {
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    } else if (bytesPerRow % 2 === 0) {
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 2);
    } else {
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    }

    this._webTextureObj = gl.createTexture();
    glBindTexture2D(t);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    switch (pixelFormat) {
      case tex2d.PIXEL_FORMAT_RGBA8888:
        format = gl.RGBA;
        break;
      case tex2d.PIXEL_FORMAT_RGB888:
        format = gl.RGB;
        break;
      case tex2d.PIXEL_FORMAT_RGBA4444:
        type = gl.UNSIGNED_SHORT_4_4_4_4;
        break;
      case tex2d.PIXEL_FORMAT_RGB5A1:
        type = gl.UNSIGNED_SHORT_5_5_5_1;
        break;
      case tex2d.PIXEL_FORMAT_RGB565:
        type = gl.UNSIGNED_SHORT_5_6_5;
        break;
      case tex2d.PIXEL_FORMAT_AI88:
        format = gl.LUMINANCE_ALPHA;
        break;
      case tex2d.PIXEL_FORMAT_A8:
        format = gl.ALPHA;
        break;
      case tex2d.PIXEL_FORMAT_I8:
        format = gl.LUMINANCE;
        break;
      default:
        assert(0, _LogInfos.Texture2D_initWithData);
    }
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      format,
      pixelsWide,
      pixelsHigh,
      0,
      format,
      type,
      data
    );

    t._contentSize.width = contentSize.width;
    t._contentSize.height = contentSize.height;
    t._pixelsWide = pixelsWide;
    t._pixelsHigh = pixelsHigh;
    this._pixelFormat = pixelFormat;
    this._maxS = contentSize.width / pixelsWide;
    this._maxT = contentSize.height / pixelsHigh;

    this._hasPremultipliedAlpha = false;
    this._hasMipmaps = false;
    this._shaderProgram = ShaderCache.getInstance().programForKey(
      SHADER_POSITION_TEXTURE
    );

    t._textureLoaded = true;

    return true;
  }

  drawAtPoint(point) {
    var t = this._texture;
    var coordinates = [
        0.0,
        this._maxT,
        this._maxS,
        this._maxT,
        0.0,
        0.0,
        this._maxS,
        0.0
      ],
      gl = RendererConfig.getInstance().renderContext;

    var width = t._pixelsWide * this._maxS,
      height = t._pixelsHigh * this._maxT;

    var vertices = [
      point.x,
      point.y,
      0.0,
      width + point.x,
      point.y,
      0.0,
      point.x,
      height + point.y,
      0.0,
      width + point.x,
      height + point.y,
      0.0
    ];

    t._glProgramState.apply();
    t._glProgramState._glprogram.setUniformsForBuiltins();

    glBindTexture2D(t);

    gl.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);
    gl.enableVertexAttribArray(VERTEX_ATTRIB_TEX_COORDS);
    gl.vertexAttribPointer(
      VERTEX_ATTRIB_POSITION,
      2,
      gl.FLOAT,
      false,
      0,
      vertices
    );
    gl.vertexAttribPointer(
      VERTEX_ATTRIB_TEX_COORDS,
      2,
      gl.FLOAT,
      false,
      0,
      coordinates
    );

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  drawInRect(rect) {
    var t = this._texture;
    var coordinates = [
      0.0,
      this._maxT,
      this._maxS,
      this._maxT,
      0.0,
      0.0,
      this._maxS,
      0.0
    ];

    var vertices = [
      rect.x,
      rect.y,
      rect.x + rect.width,
      rect.y,
      rect.x,
      rect.y + rect.height,
      rect.x + rect.width,
      rect.y + rect.height
    ];

    t._glProgramState.apply();
    t._glProgramState._glprogram.setUniformsForBuiltins();

    glBindTexture2D(t);

    var gl = RendererConfig.getInstance().renderContext;
    gl.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);
    gl.enableVertexAttribArray(VERTEX_ATTRIB_TEX_COORDS);
    gl.vertexAttribPointer(
      VERTEX_ATTRIB_POSITION,
      2,
      gl.FLOAT,
      false,
      0,
      vertices
    );
    gl.vertexAttribPointer(
      VERTEX_ATTRIB_TEX_COORDS,
      2,
      gl.FLOAT,
      false,
      0,
      coordinates
    );

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  initWithImage(uiImage) {
    if (uiImage == null) {
      log(_LogInfos.Texture2D_initWithImage);
      return false;
    }

    var imageWidth = uiImage.getWidth();
    var imageHeight = uiImage.getHeight();

    var maxTextureSize = cc.configuration.getMaxTextureSize();
    if (imageWidth > maxTextureSize || imageHeight > maxTextureSize) {
      log(
        _LogInfos.Texture2D_initWithImage_2,
        imageWidth,
        imageHeight,
        maxTextureSize,
        maxTextureSize
      );
      return false;
    }
    this._texture._textureLoaded = true;

    return this._initPremultipliedATextureWithImage(
      uiImage,
      imageWidth,
      imageHeight
    );
  }

  initWithString(text, fontName, fontSize, dimensions, hAlignment, vAlignment) {
    log(_LogInfos.Texture2D_initWithString);
    return null;
  }

  setTexParameters(texParams, magFilter, wrapS, wrapT) {
    var t = this._texture;
    var gl = RendererConfig.getInstance().renderContext;

    if (magFilter !== undefined)
      texParams = {
        minFilter: texParams,
        magFilter: magFilter,
        wrapS: wrapS,
        wrapT: wrapT
      };

    assert(
      (t._pixelsWide === NextPOT(t._pixelsWide) &&
        t._pixelsHigh === NextPOT(t._pixelsHigh)) ||
        (texParams.wrapS === gl.CLAMP_TO_EDGE &&
          texParams.wrapT === gl.CLAMP_TO_EDGE),
      "WebGLRenderingContext.CLAMP_TO_EDGE should be used in NPOT textures"
    );

    glBindTexture2D(t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texParams.minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texParams.magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, texParams.wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, texParams.wrapT);
  }

  setAntiAliasTexParameters() {
    var gl = RendererConfig.getInstance().renderContext;
    var t = this._texture;

    glBindTexture2D(t);
    if (!this._hasMipmaps)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    else
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_NEAREST
      );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  setAliasTexParameters() {
    var gl = RendererConfig.getInstance().renderContext;
    var t = this._texture;

    glBindTexture2D(t);
    if (!this._hasMipmaps)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    else
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_NEAREST
      );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  }

  generateMipmap() {
    var t = this._texture;
    assert(
      t._pixelsWide === NextPOT(t._pixelsWide) &&
        t._pixelsHigh === NextPOT(t._pixelsHigh),
      "Mimpap texture only works in POT textures"
    );

    glBindTexture2D(t);
    RendererConfig.getInstance().renderContext.generateMipmap(
      RendererConfig.getInstance().renderContext.TEXTURE_2D
    );
    this._hasMipmaps = true;
  }

  stringForFormat() {
    return cc.Texture2D._M[this._pixelFormat];
  }

  bitsPerPixelForFormat(format) {
    format = format || this._pixelFormat;
    var value = cc.Texture2D._B[format];
    if (value != null) return value;
    log(_LogInfos.Texture2D_bitsPerPixelForFormat, format);
    return -1;
  }

  _initPremultipliedATextureWithImage(uiImage, width, height) {
    var t = this._texture;
    var tex2d = cc.Texture2D;
    var tempData = uiImage.getData();
    var inPixel32 = null;
    var inPixel8 = null;
    var outPixel16 = null;
    var hasAlpha = uiImage.hasAlpha();
    var imageSize = new Size(uiImage.getWidth(), uiImage.getHeight());
    var pixelFormat = tex2d.defaultPixelFormat;
    var bpp = uiImage.getBitsPerComponent();

    if (!hasAlpha) {
      if (bpp >= 8) {
        pixelFormat = tex2d.PIXEL_FORMAT_RGB888;
      } else {
        log(_LogInfos.Texture2D__initPremultipliedATextureWithImage);
        pixelFormat = tex2d.PIXEL_FORMAT_RGB565;
      }
    }

    var i,
      length = width * height;

    if (pixelFormat === tex2d.PIXEL_FORMAT_RGB565) {
      if (hasAlpha) {
        tempData = new Uint16Array(width * height);
        inPixel32 = uiImage.getData();

        for (i = 0; i < length; ++i) {
          tempData[i] =
            ((((inPixel32[i] >> 0) & 0xff) >> 3) << 11) |
            ((((inPixel32[i] >> 8) & 0xff) >> 2) << 5) |
            ((((inPixel32[i] >> 16) & 0xff) >> 3) << 0);
        }
      } else {
        tempData = new Uint16Array(width * height);
        inPixel8 = uiImage.getData();

        for (i = 0; i < length; ++i) {
          tempData[i] =
            (((inPixel8[i] & 0xff) >> 3) << 11) |
            (((inPixel8[i] & 0xff) >> 2) << 5) |
            (((inPixel8[i] & 0xff) >> 3) << 0);
        }
      }
    } else if (pixelFormat === tex2d.PIXEL_FORMAT_RGBA4444) {
      tempData = new Uint16Array(width * height);
      inPixel32 = uiImage.getData();

      for (i = 0; i < length; ++i) {
        tempData[i] =
          ((((inPixel32[i] >> 0) & 0xff) >> 4) << 12) |
          ((((inPixel32[i] >> 8) & 0xff) >> 4) << 8) |
          ((((inPixel32[i] >> 16) & 0xff) >> 4) << 4) |
          ((((inPixel32[i] >> 24) & 0xff) >> 4) << 0);
      }
    } else if (pixelFormat === tex2d.PIXEL_FORMAT_RGB5A1) {
      tempData = new Uint16Array(width * height);
      inPixel32 = uiImage.getData();

      for (i = 0; i < length; ++i) {
        tempData[i] =
          ((((inPixel32[i] >> 0) & 0xff) >> 3) << 11) |
          ((((inPixel32[i] >> 8) & 0xff) >> 3) << 6) |
          ((((inPixel32[i] >> 16) & 0xff) >> 3) << 1) |
          ((((inPixel32[i] >> 24) & 0xff) >> 7) << 0);
      }
    } else if (pixelFormat === tex2d.PIXEL_FORMAT_A8) {
      tempData = new Uint8Array(width * height);
      inPixel32 = uiImage.getData();

      for (i = 0; i < length; ++i) {
        tempData[i] = (inPixel32 >> 24) & 0xff;
      }
    }

    if (hasAlpha && pixelFormat === tex2d.PIXEL_FORMAT_RGB888) {
      inPixel32 = uiImage.getData();
      tempData = new Uint8Array(width * height * 3);

      for (i = 0; i < length; ++i) {
        tempData[i * 3] = (inPixel32 >> 0) & 0xff;
        tempData[i * 3 + 1] = (inPixel32 >> 8) & 0xff;
        tempData[i * 3 + 2] = (inPixel32 >> 16) & 0xff;
      }
    }

    this.initWithData(tempData, pixelFormat, width, height, imageSize);

    if (tempData != uiImage.getData()) tempData = null;

    this._hasPremultipliedAlpha = uiImage.isPremultipliedAlpha();
    return true;
  }

  // Canvas-only methods — no-ops for WebGL
  _generateColorTexture() {}
  _generateTextureCacheForColor() {
    return null;
  }
  _switchToGray(toGray) {}
  _generateGrayTexture() {
    return null;
  }
}
