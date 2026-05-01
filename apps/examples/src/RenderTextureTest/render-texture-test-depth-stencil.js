/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

import { RenderTextureBaseLayer } from "./render-texture-base-layer";
import { s_fire } from "../resources";

export class RenderTextureTestDepthStencil extends RenderTextureBaseLayer {
  constructor() {
    super();

    this._spriteDraw = null;

    this._rend = null;
    var winSize = cc.director.getWinSize();

    this._spriteDraw = new cc.Sprite(s_fire);
    this._spriteDraw.x = winSize.width * 0.25;
    this._spriteDraw.y = 0;
    this._spriteDraw.scale = 10;

    this._spriteDraw.x =
      this._spriteDraw.x +
      this._spriteDraw.getContentSize().width *
        this._spriteDraw.getScale() *
        0.5;
    this._spriteDraw.y =
      this._spriteDraw.y +
      this._spriteDraw.getContentSize().height *
        this._spriteDraw.getScale() *
        0.5;

    this._rend = new cc.RenderTexture(
      winSize.width,
      winSize.height,
      cc.Texture2D.PIXEL_FORMAT_RGBA4444,
      gl.DEPTH24_STENCIL8_OES
    );
    this._rend.x = winSize.width * 0.5;
    this._rend.y = winSize.height * 0.5;
    this.addChild(this._rend);
    var item = new cc.MenuItemFont("Click Me", this.maskTest, this);
    var menu = new cc.Menu(item);
    menu.x = winSize.width - 90;
    menu.y = winSize.height - 100;

    this.addChild(menu);
    this.addChild(this._spriteDraw);
  }

  releaseMask() {
    var gl = cc.rendererConfig.renderContext;
    gl.stencilFunc(gl.NOTEQUAL, 1, 0xff);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    gl.disable(gl.STENCIL_TEST);
    this.onRestartCallback();
  }

  maskTest(sender) {
    var gl = cc.rendererConfig.renderContext;

    gl.clear(gl.STENCIL_BUFFER_BIT);
    this._rend.beginWithClear(0, 0, 0, 0, 0, 0);

    gl.stencilMask(0xff);
    cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE);
    gl.stencilFunc(gl.NEVER, 1, 0xff);
    gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
    gl.enable(gl.STENCIL_TEST);

    this._rend.end();
    this.schedule(this.releaseMask, 0.5);
  }

  title() {
    return "Testing depthStencil attachment";
  }
  subtitle() {
    return "Click to be masked and turn black\n Come back after 0.5s";
  }
}
