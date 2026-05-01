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
// ResumeTest
//
//------------------------------------------------------------------
import { TAG_GROSSINI } from "./constants";
import { ActionManagerTest } from "./action-manager-test";
import { s_pathGrossini } from "../resources";
import { director } from "../constants";
import { LabelTTF } from "@aspect/core";

export class ResumeTest extends ActionManagerTest {
  constructor() {
    super();
    this.testDuration = 6.0;
  }

  title() {
    return "Resume Test";
  }
  onEnter() {
    //----start4----onEnter
    super.onEnter();

    var s = director.getWinSize();
    var l = new LabelTTF(
      "Grossini only rotate/scale in 3 seconds",
      "Thonburi",
      16
    );
    this.addChild(l);
    l.x = s.width / 2;
    l.y = 245;

    var grossini = new cc.Sprite(s_pathGrossini);
    this._grossini = grossini;
    this.addChild(grossini, 0, TAG_GROSSINI);
    grossini.x = s.width / 2;
    grossini.y = s.height / 2;

    grossini.runAction(new cc.ScaleBy(2, 2));

    director.getActionManager().pauseTarget(grossini);
    grossini.runAction(new cc.RotateBy(2, 360));

    this.schedule(this.resumeGrossini, 3.0);
    //----end4----
  }
  resumeGrossini(time) {
    //----start4----resumeGrossini
    this.unschedule(this.resumeGrossini);

    var grossini = this.getChildByTag(TAG_GROSSINI);
    director.getActionManager().resumeTarget(grossini);
    //----end4----
  }

  //
  // Automation
  //
  setupAutomation() {
    this.scheduleOnce(this.checkControl1, 1.0);
    this.scheduleOnce(this.checkControl2, 5.5);
  }
  checkControl1(dt) {
    this.control1ScaleX = this._grossini.scaleX;
    this.control1ScaleY = this._grossini.scaleY;
    this.control1Rotation = this._grossini.rotation;
  }
  checkControl2(dt) {
    this.control2ScaleX = this._grossini.scaleX;
    this.control2ScaleY = this._grossini.scaleY;
    this.control2Rotation = this._grossini.rotation;
  }
  getExpectedResult() {
    var ret = [{ Rot: 0 }, { sX: 1, sY: 1 }, { Rot: 360 }, { sX: 2, sY: 2 }];
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret = [
      { Rot: this.control1Rotation },
      { sX: this.control1ScaleX, sY: this.control1ScaleY },
      { Rot: this.control2Rotation },
      { sX: this.control2ScaleX, sY: this.control2ScaleY }
    ];
    return JSON.stringify(ret);
  }
}
