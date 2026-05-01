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
// Test2
//
//------------------------------------------------------------------
import { ActionManagerTest } from "./action-manager-test";
import { s_pathGrossini } from "../resources";
import { autoTestEnabled } from "../constants";
import { Point, Sprite } from "@aspect/core";
import { CallFunc, MoveBy, ScaleTo, sequence } from "@aspect/actions";

export class LogicTest extends ActionManagerTest {
  constructor() {
    super();
    this.testDuration = 4.0;
  }

  title() {
    return "Logic test";
  }
  onEnter() {
    //----start1----onEnter
    super.onEnter();

    var grossini = new Sprite(s_pathGrossini);
    this.addChild(grossini, 0, 2);
    grossini.x = 200;
    grossini.y = 200;

    grossini.runAction(
      sequence(
        new MoveBy(1, new Point(150, 0)),
        new CallFunc(this.onBugMe, this)
      )
    );

    //
    // only for automation
    //
    if (autoTestEnabled) {
      this._grossini = grossini;
    }
    //----end1----
  }
  onBugMe(node) {
    //----start1----onBugMe
    node.stopAllActions(); //After this stop next action not working, if remove this stop everything is working
    node.runAction(new ScaleTo(2, 2));
    //----end1----
  }

  //
  // Automation
  //
  getExpectedResult() {
    var ret = [{ scaleX: 2, scaleY: 2 }];
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret = [
      { scaleX: this._grossini.scaleX, scaleY: this._grossini.scaleY }
    ];
    return JSON.stringify(ret);
  }
}
