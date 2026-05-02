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
import { Color, Director, LayerColor, RendererConfig, Sprite } from "@aspect/core";
import { Menu, MenuItemFont } from "@aspect/menus";

import { RenderTexture } from "@aspect/render-texture";
export class RenderTextureTargetNode extends RenderTextureBaseLayer {
  constructor() {
    super();

    this._sprite1 = null;

    this._sprite2 = null;

    this._time = 0;

    this._winSize = null;

    this._renderTexture = null;
    /*
     *     1    2
     * A: A1   A2
     *
     * B: B1   B2
     *
     *  A1: premulti sprite
     *  A2: premulti render
     *
     *  B1: non-premulti sprite
     *  B2: non-premulti render
     */
    var background = new LayerColor(new Color(40, 40, 40, 255));
    this.addChild(background);

    var winSize = Director.getInstance().getWinSize();
    this._winSize = winSize;

    // sprite 1
    var sprite1 = new Sprite(s_fire);
    sprite1.x = winSize.width;
    sprite1.y = winSize.height;
    this._sprite1 = sprite1;

    // sprite 2
    //todo Images/fire_rgba8888.pvr
    var sprite2 = new Sprite(s_fire);
    sprite2.x = winSize.width;
    sprite2.y = winSize.height;
    this._sprite2 = sprite2;

    /* Create the render texture */
    //var renderTexture = new RenderTexture(winSize.width, winSize.height, TEXTURE_2D_PIXEL_FORMAT_RGBA4444);
    var renderTexture = new RenderTexture(winSize.width, winSize.height);
    this._renderTexture = renderTexture;

    renderTexture.x = winSize.width / 2;
    renderTexture.y = winSize.height / 2;

    /* add the sprites to the render texture */
    renderTexture.addChild(this._sprite1);
    renderTexture.addChild(this._sprite2);
    renderTexture.clearColorVal = new Color(0, 0, 0, 0);
    renderTexture.clearFlags = RendererConfig.getInstance().renderContext.COLOR_BUFFER_BIT;

    /* add the render texture to the scene */
    this.addChild(renderTexture);

    renderTexture.setAutoDraw(true);

    this.scheduleUpdate();

    // Toggle clear on / off
    var item = new MenuItemFont("Clear On/Off", this.touched, this);
    var menu = new Menu(item);
    this.addChild(menu);

    menu.x = winSize.width / 2;
    menu.y = winSize.height / 2;
  }

  update(dt) {
    var r = 80;
    var locWinSize = this._winSize;
    var locTime = this._time;
    this._sprite1.x = Math.cos(locTime * 2) * r + locWinSize.width / 2;
    this._sprite1.y = Math.sin(locTime * 2) * r + locWinSize.height / 2;
    this._sprite2.x = Math.sin(locTime * 2) * r + locWinSize.width / 2;
    this._sprite2.y = Math.cos(locTime * 2) * r + locWinSize.height / 2;

    this._time += dt;
  }

  title() {
    return "Testing Render Target Node";
  }

  subtitle() {
    return "Sprites should be equal and move with each frame";
  }

  touched(sender) {
    if (this._renderTexture.clearFlags == 0)
      this._renderTexture.clearFlags =
        RendererConfig.getInstance().renderContext.COLOR_BUFFER_BIT;
    else {
      this._renderTexture.clearFlags = 0;
      this._renderTexture.clearColorVal = new Color(
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255,
        255
      );
    }
  }
}
