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

import { ActionsDemo } from "./actions-demo";
import { winSize } from "../constants";
import { Color } from "@aspect/core";

export class ActionSkewRotateScale extends ActionsDemo {
  constructor() {
    super();
    this.testDuration = 2.1;
  }

  onEnter() {
    //----start6----onEnter
    super.onEnter();

    this.centerSprites(0);

    var boxW = 100,
      boxH = 100;
    var box = new cc.LayerColor(new Color(255, 255, 0, 255));
    box.anchorX = 0;
    box.anchorY = 0;
    box.x = (winSize.width - boxW) / 2;
    box.y = (winSize.height - boxH) / 2;
    box.width = boxW;
    box.height = boxH;

    var markrside = 10.0;
    var uL = new cc.LayerColor(new Color(255, 0, 0, 255));
    box.addChild(uL);
    uL.width = markrside;
    uL.height = markrside;
    uL.x = 0;
    uL.y = boxH - markrside;
    uL.anchorX = 0;
    uL.anchorY = 0;

    var uR = new cc.LayerColor(new Color(0, 0, 255, 255));
    box.addChild(uR);
    uR.width = markrside;
    uR.height = markrside;
    uR.x = boxW - markrside;
    uR.y = boxH - markrside;
    uR.anchorX = 0;
    uR.anchorY = 0;

    this.addChild(box);
    var actionTo = new cc.SkewTo(2, 0, 2);
    var rotateTo = new cc.RotateTo(2, 61.0);
    var actionScaleTo = new cc.ScaleTo(2, -0.44, 0.47);

    var actionScaleToBack = new cc.ScaleTo(2, 1.0, 1.0);
    var rotateToBack = new cc.RotateTo(2, 0);
    var actionToBack = new cc.SkewTo(2, 0, 0);

    var delay = new cc.DelayTime(0.25);

    box.runAction(cc.sequence(actionTo, delay, actionToBack));
    box.runAction(cc.sequence(rotateTo, delay.clone(), rotateToBack));
    box.runAction(cc.sequence(actionScaleTo, delay.clone(), actionScaleToBack));

    this.box = box;
    //----end6----
  }
  title() {
    return "Skew + Rotate + Scale";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = [0, 2, 61, "-0.44", "0.47"];
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var ret = [];
    ret.push(this.box.skewX);
    ret.push(this.box.skewY);
    ret.push(this.box.rotation);
    ret.push(this.box.scaleX.toFixed(2));
    ret.push(this.box.scaleY.toFixed(2));

    return JSON.stringify(ret);
  }
}
