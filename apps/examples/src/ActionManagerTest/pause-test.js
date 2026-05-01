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
// PauseTest
//
//------------------------------------------------------------------
import { TAG_GROSSINI } from "./constants";
import { ActionManagerTest } from "./action-manager-test";
import { s_pathGrossini } from "../resources";
import { autoTestEnabled, director } from "../constants";
import { Point } from "@aspect/core";

export class PauseTest extends ActionManagerTest {
  constructor() {
    super();
    this.testDuration = 5.5;
  }

  title() {
    return "Pause Test";
  }
  onEnter() {
    //----start2----onEnter
    //
    // This test MUST be done in 'onEnter' and not on 'init'
    // otherwise the paused action will be resumed at 'onEnter' time
    //
    super.onEnter();

    var s = director.getWinSize();
    var l = new cc.LabelTTF(
      "After 3 seconds grossini should move",
      "Thonburi",
      16
    );
    this.addChild(l);
    l.x = s.width / 2;
    l.y = 245;

    //
    // Also, this test MUST be done, after [super onEnter]
    //
    var grossini = new cc.Sprite(s_pathGrossini);
    this.addChild(grossini, 0, TAG_GROSSINI);
    grossini.x = 200;
    grossini.y = 200;

    var action = new cc.MoveBy(1, new Point(150, 0));

    director.getActionManager().addAction(action, grossini, true);

    this.schedule(this.onUnpause, 3);

    //
    // only for automation
    //
    if (autoTestEnabled) {
      this.scheduleOnce(this.checkControl1, 2.0);
      this.scheduleOnce(this.checkControl2, 4.5);
      this._grossini = grossini;
    }
    //----end2----
  }

  onUnpause(dt) {
    //----start2----onUnpause
    this.unschedule(this.onUnpause);
    var node = this.getChildByTag(TAG_GROSSINI);
    director.getActionManager().resumeTarget(node);
    //----end2----
  }

  //
  // Automation
  //
  checkControl1(dt) {
    this.control1 = new Point(this._grossini.x, this._grossini.y);
  }
  checkControl2(dt) {
    this.control2 = new Point(this._grossini.x, this._grossini.y);
  }
  getExpectedResult() {
    var ret = [
      { x: 200, y: 200 },
      { x: 350, y: 200 }
    ];
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret = [
      { x: this.control1.x, y: this.control1.y },
      { x: this.control2.x, y: this.control2.y }
    ];
    return JSON.stringify(ret);
  }
}
