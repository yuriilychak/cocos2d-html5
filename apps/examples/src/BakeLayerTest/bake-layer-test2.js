/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

import { BakeLayerBaseTest } from "./bake-layer-base-test";
import { s_pathGrossini, s_pathSister1, s_simpleFont_fnt } from "../resources";
import { Color, Layer, Rect, Sprite } from "@aspect/core";
import { BMButton, Widget } from "@aspect/ccui";
import { winSize } from "../constants";

export class BakeLayerTest2 extends BakeLayerBaseTest {
  title() {
    return "Test 2. Bake Layer with other layer (Canvas only)";
  }

  subtitle() {
    return "Changing top layer shouldn't increase draw call number";
  }

  constructor() {
    super();

    this._bakeLayer = null;

    const bakeBtn = new BMButton("default_theme/rounded_shadow_2.png", "default_theme/rounded_shadow_2.png", "default_theme/rounded_shadow_2.png", Widget.PLIST_TEXTURE);
    bakeBtn.setScale9Enabled(true);
    bakeBtn.setCapInsets(new Rect(12, 12, 12, 12));
    bakeBtn.setContentSize(196, 32);
    bakeBtn.setTitleFntFile(s_simpleFont_fnt);
    bakeBtn.setTitleText("bake");
    bakeBtn.setTitleFontSize(12);
    bakeBtn.setNormalBgColor(new Color(0x00, 0x99, 0x00));
    bakeBtn.setPressedBgColor(new Color(0x00, 0x66, 0x00));
    bakeBtn.setDisabledBgColor(new Color(0x55, 0x55, 0x55));
    bakeBtn.pressedActionEnabled = true;
    bakeBtn.x = winSize.width - 108;
    bakeBtn.y = winSize.height - 80;
    bakeBtn.addClickEventListener(() => this.onBake());
    this.addChild(bakeBtn, 10);

    const unbakeBtn = new BMButton("default_theme/rounded_shadow_2.png", "default_theme/rounded_shadow_2.png", "default_theme/rounded_shadow_2.png", Widget.PLIST_TEXTURE);
    unbakeBtn.setScale9Enabled(true);
    unbakeBtn.setCapInsets(new Rect(12, 12, 12, 12));
    unbakeBtn.setContentSize(196, 32);
    unbakeBtn.setTitleFntFile(s_simpleFont_fnt);
    unbakeBtn.setTitleText("unbake");
    unbakeBtn.setTitleFontSize(12);
    unbakeBtn.setNormalBgColor(new Color(0x00, 0x99, 0x00));
    unbakeBtn.setPressedBgColor(new Color(0x00, 0x66, 0x00));
    unbakeBtn.setDisabledBgColor(new Color(0x55, 0x55, 0x55));
    unbakeBtn.pressedActionEnabled = true;
    unbakeBtn.x = winSize.width - 108;
    unbakeBtn.y = winSize.height - 120;
    unbakeBtn.addClickEventListener(() => this.onUnbake());
    this.addChild(unbakeBtn, 10);

    const chTopBtn = new BMButton("default_theme/rounded_shadow_2.png", "default_theme/rounded_shadow_2.png", "default_theme/rounded_shadow_2.png", Widget.PLIST_TEXTURE);
    chTopBtn.setScale9Enabled(true);
    chTopBtn.setCapInsets(new Rect(12, 12, 12, 12));
    chTopBtn.setContentSize(196, 32);
    chTopBtn.setTitleFntFile(s_simpleFont_fnt);
    chTopBtn.setTitleText("change top layer");
    chTopBtn.setTitleFontSize(12);
    chTopBtn.setNormalBgColor(new Color(0x00, 0x99, 0x00));
    chTopBtn.setPressedBgColor(new Color(0x00, 0x66, 0x00));
    chTopBtn.setDisabledBgColor(new Color(0x55, 0x55, 0x55));
    chTopBtn.pressedActionEnabled = true;
    chTopBtn.x = winSize.width - 108;
    chTopBtn.y = winSize.height - 160;
    chTopBtn.addClickEventListener(() => this.onChangeZOrder());
    this.addChild(chTopBtn, 10);

    const chBakeBtn = new BMButton("default_theme/rounded_shadow_2.png", "default_theme/rounded_shadow_2.png", "default_theme/rounded_shadow_2.png", Widget.PLIST_TEXTURE);
    chBakeBtn.setScale9Enabled(true);
    chBakeBtn.setCapInsets(new Rect(12, 12, 12, 12));
    chBakeBtn.setContentSize(196, 32);
    chBakeBtn.setTitleFntFile(s_simpleFont_fnt);
    chBakeBtn.setTitleText("change bake layer");
    chBakeBtn.setTitleFontSize(12);
    chBakeBtn.setNormalBgColor(new Color(0x00, 0x99, 0x00));
    chBakeBtn.setPressedBgColor(new Color(0x00, 0x66, 0x00));
    chBakeBtn.setDisabledBgColor(new Color(0x55, 0x55, 0x55));
    chBakeBtn.pressedActionEnabled = true;
    chBakeBtn.x = winSize.width - 108;
    chBakeBtn.y = winSize.height - 200;
    chBakeBtn.addClickEventListener(() => this.onChangeBakeZOrder());
    this.addChild(chBakeBtn, 10);

    var rootLayer = new Layer();
    rootLayer.setPosition(20, 20);
    this.addChild(rootLayer);

    var bakeLayer = new Layer();
    bakeLayer.bake();
    bakeLayer.setRotation(30);
    rootLayer.addChild(bakeLayer);

    for (var i = 0; i < 9; i++) {
      var sprite1 = new Sprite(s_pathGrossini);
      if (i % 2 === 0) {
        sprite1.setPosition(50 + i * 30, winSize.height / 2 - 150);
      } else {
        sprite1.setPosition(50 + i * 30, winSize.height / 2 - 100);
      }
      if (i === 4) this._actionSprite = sprite1;
      sprite1.rotation = 360 * Math.random();
      bakeLayer.addChild(sprite1);
    }
    this._bakeLayer = bakeLayer;

    var normalLayer = new Layer();
    rootLayer.addChild(normalLayer);

    for (var i = 0; i < 9; i++) {
      var sprite1 = new Sprite(s_pathSister1);
      if (i % 2 === 0) {
        sprite1.setPosition(400 + i * 40, winSize.height / 2 - 50);
      } else {
        sprite1.setPosition(400 + i * 40, winSize.height / 2 + 50);
      }
      if (i === 4) this._actionSprite = sprite1;
      sprite1.rotation = 360 * Math.random();
      normalLayer.addChild(sprite1);
    }
    this._normalLayer = normalLayer;

    this.zOrder = 0;
  }

  onBake() {
    this._bakeLayer.bake();
  }

  onUnbake() {
    this._bakeLayer.unbake();
  }

  onChangeZOrder() {
    this.zOrder++;
    var childId = Math.floor(Math.random() * 9);
    this._normalLayer.children[childId].setLocalZOrder(this.zOrder);
    this._normalLayer.children[childId].rotation = 360 * Math.random();
  }

  onChangeBakeZOrder() {
    this.zOrder++;
    var childId = Math.floor(Math.random() * 9);
    this._bakeLayer.children[childId].setLocalZOrder(this.zOrder);
  }
}
