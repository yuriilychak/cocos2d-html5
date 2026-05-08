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
import { s_pathGrossini, s_simpleFont_fnt } from "../resources";
import { Color, Layer, Point, Rect, Sprite } from "@aspect/core";
import { MoveBy, RotateBy, Sequence } from "@aspect/actions";
import { BMButton, Widget } from "@aspect/ccui";
import { winSize } from "../constants";

export class BakeLayerTest1 extends BakeLayerBaseTest {
  title() {
    return "Test 1. Bake Layer (Canvas only)";
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

    const runActionBtn = new BMButton("default_theme/rounded_shadow_2.png", "default_theme/rounded_shadow_2.png", "default_theme/rounded_shadow_2.png", Widget.PLIST_TEXTURE);
    runActionBtn.setScale9Enabled(true);
    runActionBtn.setCapInsets(new Rect(12, 12, 12, 12));
    runActionBtn.setContentSize(196, 32);
    runActionBtn.setTitleFntFile(s_simpleFont_fnt);
    runActionBtn.setTitleText("run action");
    runActionBtn.setTitleFontSize(12);
    runActionBtn.setNormalBgColor(new Color(0x00, 0x99, 0x00));
    runActionBtn.setPressedBgColor(new Color(0x00, 0x66, 0x00));
    runActionBtn.setDisabledBgColor(new Color(0x55, 0x55, 0x55));
    runActionBtn.pressedActionEnabled = true;
    runActionBtn.x = winSize.width - 108;
    runActionBtn.y = winSize.height - 160;
    runActionBtn.addClickEventListener(() => this.onRunAction());
    this.addChild(runActionBtn, 10);

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
        sprite1.setPosition(90 + i * 80, winSize.height / 2 - 50);
      } else {
        sprite1.setPosition(90 + i * 80, winSize.height / 2 + 50);
      }
      if (i === 4) this._actionSprite = sprite1;
      sprite1.rotation = 360 * Math.random();
      bakeLayer.addChild(sprite1);
    }
    this._bakeLayer = bakeLayer;
    bakeLayer.runAction(
      new Sequence(
        new MoveBy(2, new Point(100, 100)),
        new MoveBy(2, new Point(-100, -100))
      )
    );
  }

  onBake() {
    this._bakeLayer.bake();
  }

  onUnbake() {
    this._bakeLayer.unbake();
  }

  onRunAction() {
    this._actionSprite.runAction(new RotateBy(1, 180));
  }
}
