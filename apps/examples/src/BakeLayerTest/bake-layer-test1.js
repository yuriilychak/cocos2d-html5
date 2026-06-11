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
import { s_pathGrossini } from "../resources";
import { Color, Layer, Point, Sprite } from "@aspect/core";
import { MoveBy, RotateBy, Sequence } from "@aspect/actions";
import { ButtonLayout } from "../button-layout";
import { winSize } from "../constants";

const TINT_DEFAULT = new Color(0x00, 0x99, 0x00);
const TINT_PRESSED = new Color(0x00, 0x66, 0x00);

export class BakeLayerTest1 extends BakeLayerBaseTest {
  title() {
    return "Test 1. Bake Layer (Canvas only)";
  }

  constructor() {
    super();

    this._bakeLayer = null;

    const buttons = new ButtonLayout(
      [
        { label: "bake",       tintDefault: TINT_DEFAULT, tintPressed: TINT_PRESSED },
        { label: "unbake",     tintDefault: TINT_DEFAULT, tintPressed: TINT_PRESSED },
        { label: "run action", tintDefault: TINT_DEFAULT, tintPressed: TINT_PRESSED },
      ],
      196,
      "Actions",
      this.onButtonClicked.bind(this)
    );
    this.addChild(buttons, 10);

    var rootLayer = new Layer();
    rootLayer.setPosition(20, 20);
    this.addChild(rootLayer);

    var bakeLayer = new Layer();
    bakeLayer.bake();
    bakeLayer.rotation = 30;
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

  onButtonClicked(index) {
    switch (index) {
      case 0: this.onBake(); break;
      case 1: this.onUnbake(); break;
      case 2: this.onRunAction(); break;
    }
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
