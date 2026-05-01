/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 Copyright (c) 2013      Surith Thekkiam

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

import { S9SpriteTestDemo } from "./s9-sprite-test-demo";
import { winSize } from "../../constants";
import { Color, LayerColor } from "@aspect/core";
import { DelayTime, FadeIn, FadeOut, FadeTo, sequence } from "@aspect/actions";

export class S9SpriteOpacityWithFadeActionsTest extends S9SpriteTestDemo {
  constructor() {
    super();

    this._title =
      "Test opacity cascade for Scale9Sprite with fade actions\n(fade to opacity 144, then fadeOut, then fadeIn)";

    var colorLayer = new LayerColor(new Color(144, 144, 144));
    colorLayer.setContentSize(winSize.width / 2, winSize.height / 2);
    colorLayer.x = winSize.width / 4;
    colorLayer.y = winSize.height / 4;

    colorLayer.setCascadeOpacityEnabled(true);

    var blocks = new ccui.Scale9Sprite("blocks9.png");
    blocks.x = winSize.width / 4;
    blocks.y = winSize.height / 4;

    colorLayer.addChild(blocks);

    var fadeToAction = new FadeTo(1, 144);
    var delay = new DelayTime(0.5);
    var fadeOutAction = new FadeOut(0.8);
    var fadeInAction = new FadeIn(0.8);

    colorLayer.runAction(
      sequence(
        fadeToAction,
        delay,
        fadeOutAction,
        delay.clone(),
        fadeInAction
      )
    );

    this.addChild(colorLayer);
  }
}
