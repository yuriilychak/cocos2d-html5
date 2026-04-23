import { Rect } from "../cocoa/geometry/rect";
import Sys from "../boot/sys";
import TextureCache from "./texture-cache";
import { Texture2D } from "./texture-2d";
import {
  REPEAT
} from "../platform/macro/constants";

function renderToCache(image, cache) {
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
}

function generateGrayTexture(texture, rect, renderCanvas) {
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
}

function generateColorTextureMultiply(texture, r, g, b, rect, canvas) {
  var onlyCanvas = false;
  if (canvas) onlyCanvas = true;
  else canvas = document.createElement("canvas");
  var textureImage = texture._htmlElementObj;
  if (!rect) rect = new Rect(0, 0, textureImage.width, textureImage.height);

  canvas.width = rect.width;
  canvas.height = rect.height;

  var context = canvas.getContext("2d");
  context.globalCompositeOperation = "source-over";
  context.fillStyle = "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";
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

  var newTexture = new Texture2D();
  newTexture.initWithElement(canvas);
  newTexture.handleLoadedTexture();
  return newTexture;
}

function generateColorTextureFourChannel(texture, r, g, b, rect, canvas) {
  var onlyCanvas = false;
  if (canvas) onlyCanvas = true;
  else canvas = document.createElement("canvas");

  var textureImage = texture._htmlElementObj;
  if (!rect) rect = new Rect(0, 0, textureImage.width, textureImage.height);
  var x, y, w, h;
  x = rect.x;
  y = rect.y;
  w = rect.width;
  h = rect.height;
  if (!w || !h) return;

  canvas.width = w;
  canvas.height = h;

  var context = canvas.getContext("2d");
  var tintedImgCache = TextureCache.getInstance().getTextureColors(texture);
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

  var newTexture = new Texture2D();
  newTexture.initWithElement(canvas);
  newTexture.handleLoadedTexture();
  return newTexture;
}

export default class CanvasTextureRenderer {
  constructor(texture) {
    this._texture = texture;
    this._webTextureObj = null;
    this._grayElementObj = null;
    this._backupElement = null;
    this._isGray = false;
  }

  initWithElement(element) {
    if (!element) return;
    var t = this._texture;
    t._htmlElementObj = element;
    t._pixelsWide = t._contentSize.width = element.width;
    t._pixelsHigh = t._contentSize.height = element.height;
    t._textureLoaded = true;
  }

  handleLoadedTexture() {
    var t = this._texture;
    if (!t._htmlElementObj) return;

    var locElement = t._htmlElementObj;
    t._pixelsWide = t._contentSize.width = locElement.width;
    t._pixelsHigh = t._contentSize.height = locElement.height;

    t.dispatchEvent("load");
  }

  releaseTexture() {
    var t = this._texture;
    t._htmlElementObj = null;
  }

  getName() {
    return null;
  }

  getMaxS() {
    return 1;
  }

  setMaxS(maxS) {}

  getMaxT() {
    return 1;
  }

  setMaxT(maxT) {}

  getPixelFormat() {
    return null;
  }

  getShaderProgram() {
    return null;
  }

  setShaderProgram(shaderProgram) {}

  hasPremultipliedAlpha() {
    return false;
  }

  hasMipmaps() {
    return false;
  }

  initWithData(data, pixelFormat, pixelsWide, pixelsHigh, contentSize) {
    return false;
  }

  initWithImage(uiImage) {
    return false;
  }

  initWithString(text, fontName, fontSize, dimensions, hAlignment, vAlignment) {
    return false;
  }

  drawAtPoint(point) {}

  drawInRect(rect) {}

  setTexParameters(texParams, magFilter, wrapS, wrapT) {
    var t = this._texture;
    if (magFilter !== undefined)
      texParams = {
        minFilter: texParams,
        magFilter: magFilter,
        wrapS: wrapS,
        wrapT: wrapT
      };

    if (texParams.wrapS === REPEAT && texParams.wrapT === REPEAT) {
      t._pattern = "repeat";
      return;
    }

    if (texParams.wrapS === REPEAT) {
      t._pattern = "repeat-x";
      return;
    }

    if (texParams.wrapT === REPEAT) {
      t._pattern = "repeat-y";
      return;
    }

    t._pattern = "";
  }

  setAntiAliasTexParameters() {}

  setAliasTexParameters() {}

  generateMipmap() {}

  stringForFormat() {
    return "";
  }

  bitsPerPixelForFormat(format) {
    return -1;
  }

  description() {
    var t = this._texture;
    return (
      "<Texture2D | width = " +
      t._contentSize.width +
      " height " +
      t._contentSize.height +
      ">"
    );
  }

  _generateColorTexture(r, g, b, rect, canvas) {
    if (Sys.getInstance()._supportCanvasNewBlendModes) {
      return generateColorTextureMultiply(this._texture, r, g, b, rect, canvas);
    } else {
      return generateColorTextureFourChannel(
        this._texture,
        r,
        g,
        b,
        rect,
        canvas
      );
    }
  }

  _generateTextureCacheForColor() {
    var t = this._texture;
    if (t.channelCache) return t.channelCache;

    var textureCache = [
      document.createElement("canvas"),
      document.createElement("canvas"),
      document.createElement("canvas"),
      document.createElement("canvas")
    ];
    renderToCache(t._htmlElementObj, textureCache);
    return (t.channelCache = textureCache);
  }

  _switchToGray(toGray) {
    var t = this._texture;
    if (!t._textureLoaded || this._isGray === toGray) return;
    this._isGray = toGray;
    if (this._isGray) {
      this._backupElement = t._htmlElementObj;
      if (!this._grayElementObj)
        this._grayElementObj = generateGrayTexture(t._htmlElementObj);
      t._htmlElementObj = this._grayElementObj;
    } else {
      if (this._backupElement !== null) t._htmlElementObj = this._backupElement;
    }
  }

  _generateGrayTexture() {
    var t = this._texture;
    if (!t._textureLoaded) return null;
    var grayElement = generateGrayTexture(t._htmlElementObj);
    var newTexture = new Texture2D();
    newTexture.initWithElement(grayElement);
    newTexture.handleLoadedTexture();
    return newTexture;
  }
}

CanvasTextureRenderer.generateGrayTexture = generateGrayTexture;
