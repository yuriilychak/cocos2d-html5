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
import { s_fire, s_simpleFont_fnt } from "../resources";
import { Color, Director, EventListener, EventManager, Rect, RendererConfig, Sprite, Texture2D } from "@aspect/core";
import { BMButton, Widget } from "@aspect/ccui";

import { RenderTexture } from "@aspect/render-texture";
export class RenderTextureTestDepthStencil extends RenderTextureBaseLayer {
  constructor() {
    super();

    this._spriteDraw = null;

    this._rend = null;
    var winSize = Director.getInstance().getWinSize();

    this._spriteDraw = new Sprite(s_fire);
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

    this._rend = new RenderTexture(
      winSize.width,
      winSize.height,
      Texture2D.PIXEL_FORMAT_RGBA4444,
      gl.DEPTH24_STENCIL8_OES
    );
    this._rend.x = winSize.width * 0.5;
    this._rend.y = winSize.height * 0.5;
    this.addChild(this._rend);
    const clickBtn = new BMButton("default_theme/rounded_shadow_2.png", "default_theme/rounded_shadow_2.png", "default_theme/rounded_shadow_2.png", Widget.PLIST_TEXTURE);
    clickBtn.setScale9Enabled(true);
    clickBtn.setCapInsets(new Rect(12, 12, 12, 12));
    clickBtn.setContentSize(196, 32);
    clickBtn.setTitleFntFile(s_simpleFont_fnt);
    clickBtn.setTitleText("Click Me");
    clickBtn.setTitleFontSize(12);
    clickBtn.setNormalBgColor(new Color(0x00, 0x99, 0x00));
    clickBtn.setPressedBgColor(new Color(0x00, 0x66, 0x00));
    clickBtn.setDisabledBgColor(new Color(0x55, 0x55, 0x55));
    clickBtn.pressedActionEnabled = true;
    clickBtn.x = winSize.width - 108;
    clickBtn.y = winSize.height - 80;
    clickBtn.addClickEventListener(() => this.maskTest());
    this.addChild(clickBtn, 10);
    this.addChild(this._spriteDraw);
  }

  releaseMask() {
    var gl = RendererConfig.getInstance().renderContext;
    gl.stencilFunc(gl.NOTEQUAL, 1, 0xff);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    gl.disable(gl.STENCIL_TEST);
    this.onRestartCallback();
  }

  maskTest(sender) {
    var gl = RendererConfig.getInstance().renderContext;

    gl.clear(gl.STENCIL_BUFFER_BIT);
    this._rend.beginWithClear(0, 0, 0, 0, 0, 0);

    gl.stencilMask(0xff);
    EventManager.getInstance().removeListeners(EventListener.TOUCH_ONE_BY_ONE);
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
