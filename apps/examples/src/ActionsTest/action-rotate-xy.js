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

//------------------------------------------------------------------
//
//  ActionRotateXY
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo";
import { winSize } from "../constants";
import { ServiceLocator } from "@aspect/core";
import { DelayTime, RotateBy, RotateTo, Sequence } from "@aspect/actions";
import { TextBMFont } from "@aspect/ccui";
import { s_simpleFont_fnt } from "../resources";

export class ActionRotateXY extends ActionsDemo {
  constructor() {
    super();
    this.testDuration = 2.1;
  }

  onEnter() {
    //----start4----onEnter
    super.onEnter();
    this.centerSprites(3);
    var actionTo = new RotateTo(2, 37.2, -37.2);
    var actionToBack = new RotateTo(2, 0, 0);
    var actionBy = new RotateBy(2, 0, -90);
    var actionBy2 = new RotateBy(2, 45.0, 45.0);

    var delay = new DelayTime(0.25);

    this._tamara.runAction(new Sequence(actionTo, delay, actionToBack));
    this._grossini.runAction(
      new Sequence(actionBy, delay.clone(), actionBy.reverse())
    );
    this._kathia.runAction(
      new Sequence(actionBy2, delay.clone(), actionBy2.reverse())
    );

    if (
      !ServiceLocator.sys.isNative &&
      !ServiceLocator.sys.capabilities.opengl
    ) {
      var label = new TextBMFont(
        "Not support Actions on HTML5-canvas",
        s_simpleFont_fnt
      );
      label.x = winSize.width / 2;
      label.y = winSize.height / 2 + 50;
      this.addChild(label, 100);
    }
    //----end4----
  }
  title() {
    return "RotateBy(x,y) / RotateTo(x,y)";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = ["37.20", "-37.20", 0, -90, 45, 45];
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var ret = [];
    ret.push(this._tamara.rotationX.toFixed(2));
    ret.push(this._tamara.rotationY.toFixed(2));

    ret.push(this._grossini.rotationX);
    ret.push(this._grossini.rotationY);

    ret.push(this._kathia.rotationX);
    ret.push(this._kathia.rotationY);

    return JSON.stringify(ret);
  }
}
