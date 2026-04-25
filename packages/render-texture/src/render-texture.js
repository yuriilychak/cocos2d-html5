/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2009      Jason Booth

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

import { Node, RendererConfig, Texture2D, Color, log } from "@aspect/core";

export const IMAGE_FORMAT_JPEG = 0;
export const IMAGE_FORMAT_PNG = 1;
export const IMAGE_FORMAT_RAWDATA = 9;

/**
 * cc.RenderTexture is a generic rendering target. To render things into it,<br/>
 * simply construct a render target, call begin on it, call visit on any cocos<br/>
 * scenes or objects to render them, and call end. For convenience, render texture<br/>
 * adds a sprite as it's display child with the results, so you can simply add<br/>
 * the render texture to your scene and treat it like any other CocosNode.<br/>
 * There are also functions for saving the render texture to disk in PNG or JPG format.
 *
 * @property {Sprite}    sprite          - The sprite.
 * @property {Sprite}    clearFlags      - Code for "auto" update.
 * @property {Number}       clearDepthVal   - Clear depth value.
 * @property {Boolean}      autoDraw        - Indicate auto draw mode activate or not.
 * @property {Number}       clearStencilVal - Clear stencil value.
 * @property {Color}     clearColorVal   - Clear color value, valid only when "autoDraw" is true.
 */
export class RenderTexture extends Node {
  sprite = null;

  //
  // <p>Code for "auto" update<br/>
  // Valid flags: GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT, GL_STENCIL_BUFFER_BIT.<br/>
  // They can be OR'ed. Valid when "autoDraw is YES.</p>
  // @public
  //
  clearFlags = 0;

  clearDepthVal = 0;
  autoDraw = false;

  _texture = null;
  _pixelFormat = 0;

  clearStencilVal = 0;
  _clearColor = null;

  _className = "RenderTexture";

  /**
   * creates a RenderTexture object with width and height in Points and a pixel format, only RGB and RGBA formats are valid
   * Constructor of cc.RenderTexture for Canvas
   * @param {Number} width
   * @param {Number} height
   * @param {IMAGE_FORMAT_JPEG|IMAGE_FORMAT_PNG|IMAGE_FORMAT_RAWDATA} format
   * @param {Number} depthStencilFormat
   */
  constructor(width, height, format, depthStencilFormat) {
    super();
    this._cascadeColorEnabled = true;
    this._cascadeOpacityEnabled = true;
    this._pixelFormat = Texture2D.PIXEL_FORMAT_RGBA8888;
    this._clearColor = new Color(0, 0, 0, 255);

    if (width !== undefined && height !== undefined) {
      format = format || Texture2D.PIXEL_FORMAT_RGBA8888;
      depthStencilFormat = depthStencilFormat || 0;
      this.initWithWidthAndHeight(width, height, format, depthStencilFormat);
    }
    this.setAnchorPoint(0, 0);
  }

  get clearColorVal() {
    return this.getClearColor();
  }
  set clearColorVal(v) {
    this.setClearColor(v);
  }

  _createRenderCmd() {
    if (RendererConfig.getInstance().isCanvas)
      return new RenderTexture.CanvasRenderCmd(this);
    else return new RenderTexture.WebGLRenderCmd(this);
  }

  visit(parent) {
    var cmd = this._renderCmd,
      parentCmd = parent ? parent._renderCmd : null;

    // quick return if not visible
    if (!this._visible) {
      cmd._propagateFlagsDown(parentCmd);
      return;
    }

    var renderer = RendererConfig.getInstance().renderer;

    cmd.visit(parentCmd);
    renderer.pushRenderCommand(cmd);
    this.sprite.visit(this);
    cmd._dirtyFlag = 0;
  }

  /**
   * Clear RenderTexture.
   */
  cleanup() {
    super.onExit();
    this._renderCmd.cleanup();
  }

  /**
   * Gets the sprite
   * @return {Sprite}
   */
  getSprite() {
    return this.sprite;
  }

  /**
   * Set the sprite
   * @param {Sprite} sprite
   */
  setSprite(sprite) {
    this.sprite = sprite;
  }

  /**
   * Used for grab part of screen to a texture.
   * @param {Point} rtBegin
   * @param {Rect} fullRect
   * @param {Rect} fullViewport
   */
  setVirtualViewport(rtBegin, fullRect, fullViewport) {
    this._renderCmd.setVirtualViewport(rtBegin, fullRect, fullViewport);
  }

  /**
   * Initializes the instance of cc.RenderTexture
   * @param {Number} width
   * @param {Number} height
   * @param {IMAGE_FORMAT_JPEG|IMAGE_FORMAT_PNG|IMAGE_FORMAT_RAWDATA} [format]
   * @param {Number} [depthStencilFormat]
   * @return {Boolean}
   */
  initWithWidthAndHeight(width, height, format, depthStencilFormat) {
    return this._renderCmd.initWithWidthAndHeight(
      width,
      height,
      format,
      depthStencilFormat
    );
  }

  /**
   * starts grabbing
   */
  begin() {
    RendererConfig.getInstance().renderer._turnToCacheMode(this.__instanceId);
    this._renderCmd.begin();
  }

  /**
   * starts rendering to the texture while clearing the texture first.<br/>
   * This is more efficient then calling -clear first and then -begin
   * @param {Number} r red 0-255
   * @param {Number} g green 0-255
   * @param {Number} b blue 0-255
   * @param {Number} a alpha 0-255 0 is transparent
   * @param {Number} [depthValue=]
   * @param {Number} [stencilValue=]
   */
  beginWithClear(r, g, b, a, depthValue, stencilValue) {
    var gl = RendererConfig.getInstance().renderContext;
    depthValue = depthValue || gl.COLOR_BUFFER_BIT;
    stencilValue = stencilValue || gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT;

    this._beginWithClear(
      r,
      g,
      b,
      a,
      depthValue,
      stencilValue,
      gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT
    );
  }

  _beginWithClear(r, g, b, a, depthValue, stencilValue, flags) {
    this.begin();
    this._renderCmd._beginWithClear(
      r,
      g,
      b,
      a,
      depthValue,
      stencilValue,
      flags
    );
  }

  /**
   * ends grabbing
   */
  end() {
    this._renderCmd.end();
  }

  /**
   * clears the texture with a color
   * @param {Number} r red 0-255
   * @param {Number} g green 0-255
   * @param {Number} b blue 0-255
   * @param {Number} a alpha 0-255
   */
  clear(r, g, b, a) {
    this.beginWithClear(r, g, b, a);
    this.end();
  }

  /**
   * clears the texture with rect.
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  clearRect(x, y, width, height) {
    this._renderCmd.clearRect(x, y, width, height);
  }

  /**
   * clears the texture with a specified depth value
   * @param {Number} depthValue
   */
  clearDepth(depthValue) {
    this._renderCmd.clearDepth(depthValue);
  }

  /**
   * clears the texture with a specified stencil value
   * @param {Number} stencilValue
   */
  clearStencil(stencilValue) {
    this._renderCmd.clearStencil(stencilValue);
  }

  /**
   * Valid flags: GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT, GL_STENCIL_BUFFER_BIT. They can be OR'ed. Valid when "autoDraw is YES.
   * @return {Number}
   */
  getClearFlags() {
    return this.clearFlags;
  }

  /**
   * Set the clearFlags
   * @param {Number} clearFlags
   */
  setClearFlags(clearFlags) {
    this.clearFlags = clearFlags;
  }

  /**
   * Clear color value. Valid only when "autoDraw" is true.
   * @return {Color}
   */
  getClearColor() {
    return this._clearColor;
  }

  /**
   * Set the clear color value. Valid only when "autoDraw" is true.
   * @param {Color} clearColor The clear color
   */
  setClearColor(clearColor) {
    var locClearColor = this._clearColor;
    locClearColor.r = clearColor.r;
    locClearColor.g = clearColor.g;
    locClearColor.b = clearColor.b;
    locClearColor.a = clearColor.a;
    this._renderCmd.updateClearColor(clearColor);
  }

  /**
   * Value for clearDepth. Valid only when autoDraw is true.
   * @return {Number}
   */
  getClearDepth() {
    return this.clearDepthVal;
  }

  /**
   * Set value for clearDepth. Valid only when autoDraw is true.
   * @param {Number} clearDepth
   */
  setClearDepth(clearDepth) {
    this.clearDepthVal = clearDepth;
  }

  /**
   * Value for clear Stencil. Valid only when autoDraw is true
   * @return {Number}
   */
  getClearStencil() {
    return this.clearStencilVal;
  }

  /**
   * Set value for clear Stencil. Valid only when autoDraw is true
   * @param {Number} clearStencil
   */
  setClearStencil(clearStencil) {
    this.clearStencilVal = clearStencil;
  }

  /**
   * When enabled, it will render its children into the texture automatically. Disabled by default for compatibility reasons.
   * @return {Boolean}
   */
  isAutoDraw() {
    return this.autoDraw;
  }

  /**
   * When enabled, it will render its children into the texture automatically. Disabled by default for compatibility reasons.
   * @param {Boolean} autoDraw
   */
  setAutoDraw(autoDraw) {
    this.autoDraw = autoDraw;
  }

  /**
   * saves the texture into a file using JPEG format. The file will be saved in the Documents folder.
   * (doesn't support in HTML5)
   * @param {Number} filePath
   * @param {Number} format
   */
  saveToFile(filePath, format) {
    log("saveToFile isn't supported on Cocos2d-Html5");
  }

  /**
   * creates a new Image from with the texture's data. Caller is responsible for releasing it by calling delete.
   * @return {*}
   */
  newCCImage(flipImage) {
    log("saveToFile isn't supported on cocos2d-html5");
    return null;
  }

  /**
   * Listen "come to background" message, and save render texture. It only has effect on Android.
   * @param {Class} obj
   */
  listenToBackground(obj) {}

  /**
   * Listen "come to foreground" message and restore the frame buffer object. It only has effect on Android.
   * @param {Class} obj
   */
  listenToForeground(obj) {}
}
