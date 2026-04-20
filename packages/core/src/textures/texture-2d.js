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
import { Size } from "../cocoa/geometry/size";
import Game from "../boot/game";
import Loader from "../boot/loader";
import CanvasTextureRenderer from "./texture-2d-canvas-renderer";
import WebGLTextureRenderer from "./texture-2d-webgl-renderer";
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

// By default PVR images are treated as if they don't have the alpha channel premultiplied
export let PVRHaveAlphaPremultiplied_ = false;

/**
 * <p>
 * This class allows to easily create OpenGL or Canvas 2D textures from images, text or raw data.                                    <br/>
 * The created Texture2D object will always have power-of-two dimensions.                                                <br/>
 * Depending on how you create the Texture2D object, the actual image area of the texture might be smaller than the texture dimensions <br/>
 *  i.e. "contentSize" != (pixelsWide, pixelsHigh) and (maxS, maxT) != (1.0, 1.0).                                           <br/>
 * Be aware that the content of the generated textures will be upside-down! </p>
 * @name Texture2D
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
export class Texture2D extends EventHelper(NewClass) {
  constructor() {
    super();
    this._contentSize = new Size(0, 0);
    this._textureLoaded = false;
    this._htmlElementObj = null;
    this.url = null;
    this._pattern = "";
    this._pixelsWide = 0;
    this._pixelsHigh = 0;

    this._renderer = cc._renderType === Game.RENDER_TYPE_CANVAS
      ? new CanvasTextureRenderer(this)
      : new WebGLTextureRenderer(this);
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
    this._renderer.initWithElement(element);
  }

  getHtmlElementObj() {
    return this._htmlElementObj;
  }

  isLoaded() {
    return this._textureLoaded;
  }

  handleLoadedTexture(premultiplied) {
    this._renderer.handleLoadedTexture(premultiplied);
  }

  description() {
    return this._renderer.description();
  }

  initWithData(data, pixelFormat, pixelsWide, pixelsHigh, contentSize) {
    return this._renderer.initWithData(data, pixelFormat, pixelsWide, pixelsHigh, contentSize);
  }

  initWithImage(uiImage) {
    return this._renderer.initWithImage(uiImage);
  }

  initWithString(text, fontName, fontSize, dimensions, hAlignment, vAlignment) {
    return this._renderer.initWithString(text, fontName, fontSize, dimensions, hAlignment, vAlignment);
  }

  releaseTexture() {
    this._renderer.releaseTexture();
    Loader.getInstance().release(this.url);
  }

  getName() {
    return this._renderer.getName();
  }

  getMaxS() {
    return this._renderer.getMaxS();
  }

  setMaxS(maxS) {
    this._renderer.setMaxS(maxS);
  }

  getMaxT() {
    return this._renderer.getMaxT();
  }

  setMaxT(maxT) {
    this._renderer.setMaxT(maxT);
  }

  getPixelFormat() {
    return this._renderer.getPixelFormat();
  }

  getShaderProgram() {
    return this._renderer.getShaderProgram();
  }

  setShaderProgram(shaderProgram) {
    this._renderer.setShaderProgram(shaderProgram);
  }

  hasPremultipliedAlpha() {
    return this._renderer.hasPremultipliedAlpha();
  }

  hasMipmaps() {
    return this._renderer.hasMipmaps();
  }

  releaseData(data) {
    data = null;
  }

  keepData(data, length) {
    return data;
  }

  drawAtPoint(point) {
    this._renderer.drawAtPoint(point);
  }

  drawInRect(rect) {
    this._renderer.drawInRect(rect);
  }

  initWithETCFile(file) {
    log(_LogInfos.Texture2D_initWithETCFile);
    return false;
  }

  initWithPVRFile(file) {
    log(_LogInfos.Texture2D_initWithPVRFile);
    return false;
  }

  initWithPVRTCData(data, level, bpp, hasAlpha, length, pixelFormat) {
    log(_LogInfos.Texture2D_initWithPVRTCData);
    return false;
  }

  setTexParameters(texParams, magFilter, wrapS, wrapT) {
    this._renderer.setTexParameters(texParams, magFilter, wrapS, wrapT);
  }

  setAntiAliasTexParameters() {
    this._renderer.setAntiAliasTexParameters();
  }

  setAliasTexParameters() {
    this._renderer.setAliasTexParameters();
  }

  generateMipmap() {
    this._renderer.generateMipmap();
  }

  stringForFormat() {
    return this._renderer.stringForFormat();
  }

  bitsPerPixelForFormat(format) {
    return this._renderer.bitsPerPixelForFormat(format);
  }

  removeLoadedEventListener(target) {
    this.removeEventTarget("load", target);
  }

  _generateColorTexture(r, g, b, rect, canvas) {
    return this._renderer._generateColorTexture(r, g, b, rect, canvas);
  }

  _generateTextureCacheForColor() {
    return this._renderer._generateTextureCacheForColor();
  }

  _switchToGray(toGray) {
    this._renderer._switchToGray(toGray);
  }

  _generateGrayTexture() {
    return this._renderer._generateGrayTexture();
  }

  get name() {
    return this.getName();
  }

  get pixelFormat() {
    return this.getPixelFormat();
  }

  get pixelsWidth() {
    return this.getPixelsWide();
  }

  get pixelsHeight() {
    return this.getPixelsHigh();
  }

  get width() {
    return this._getWidth();
  }

  get height() {
    return this._getHeight();
  }

  get _webTextureObj() {
    return this._renderer._webTextureObj;
  }

  set _webTextureObj(value) {
    this._renderer._webTextureObj = value;
  }

  static PVRImagesHavePremultipliedAlpha(haveAlphaPremultiplied) {
    PVRHaveAlphaPremultiplied_ = haveAlphaPremultiplied;
  }

  static PIXEL_FORMAT_RGBA8888 = 2;
  static PIXEL_FORMAT_RGB888 = 3;
  static PIXEL_FORMAT_RGB565 = 4;
  static PIXEL_FORMAT_A8 = 5;
  static PIXEL_FORMAT_I8 = 6;
  static PIXEL_FORMAT_AI88 = 7;
  static PIXEL_FORMAT_RGBA4444 = 8;
  static PIXEL_FORMAT_RGB5A1 = 7;
  static PIXEL_FORMAT_PVRTC4 = 9;
  static PIXEL_FORMAT_PVRTC2 = 10;
  static PIXEL_FORMAT_DEFAULT = Texture2D.PIXEL_FORMAT_RGBA8888;
  static defaultPixelFormat = Texture2D.PIXEL_FORMAT_DEFAULT;

  static _M = {
    [Texture2D.PIXEL_FORMAT_RGBA8888]: "RGBA8888",
    [Texture2D.PIXEL_FORMAT_RGB888]: "RGB888",
    [Texture2D.PIXEL_FORMAT_RGB565]: "RGB565",
    [Texture2D.PIXEL_FORMAT_A8]: "A8",
    [Texture2D.PIXEL_FORMAT_I8]: "I8",
    [Texture2D.PIXEL_FORMAT_AI88]: "AI88",
    [Texture2D.PIXEL_FORMAT_RGBA4444]: "RGBA4444",
    [Texture2D.PIXEL_FORMAT_RGB5A1]: "RGB5A1",
    [Texture2D.PIXEL_FORMAT_PVRTC4]: "PVRTC4",
    [Texture2D.PIXEL_FORMAT_PVRTC2]: "PVRTC2",
  };

  static _B = {
    [Texture2D.PIXEL_FORMAT_RGBA8888]: 32,
    [Texture2D.PIXEL_FORMAT_RGB888]: 24,
    [Texture2D.PIXEL_FORMAT_RGB565]: 16,
    [Texture2D.PIXEL_FORMAT_A8]: 8,
    [Texture2D.PIXEL_FORMAT_I8]: 8,
    [Texture2D.PIXEL_FORMAT_AI88]: 16,
    [Texture2D.PIXEL_FORMAT_RGBA4444]: 16,
    [Texture2D.PIXEL_FORMAT_RGB5A1]: 16,
    [Texture2D.PIXEL_FORMAT_PVRTC4]: 4,
    [Texture2D.PIXEL_FORMAT_PVRTC2]: 3,
  };

  static _generateGrayTexture = CanvasTextureRenderer.generateGrayTexture;
}





