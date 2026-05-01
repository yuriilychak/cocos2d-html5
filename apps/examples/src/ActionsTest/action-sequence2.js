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
//	ActionSequence2
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo";
import { director } from "../constants";
import { LabelTTF, Point } from "@aspect/core";

export class ActionSequence2 extends ActionsDemo {
  constructor() {
    super();
    this.testDuration = 1.1;
  }

  onEnter() {
    //----start17----onEnter
    super.onEnter();
    this.centerSprites(1);
    this._grossini.visible = false;
    var action = new cc.Sequence(
      new cc.Place(new Point(200, 200)),
      new cc.Show(),
      new cc.MoveBy(1, new Point(100, 0)),
      new cc.CallFunc(this.onCallback1, this),
      new cc.CallFunc(this.onCallback2.bind(this)),
      new cc.CallFunc(this.onCallback3, this)
    );
    this._grossini.runAction(action);

    this.called1 = this.called2 = this.called3 = false;
    //----end17----
  }
  onCallback1() {
    var s = director.getWinSize();
    var label = new LabelTTF("callback 1 called", "Marker Felt", 16);
    label.x = (s.width / 4) * 1;
    label.y = s.height / 2;

    this.addChild(label);
    this.called1 = true;
  }
  onCallback2() {
    var s = director.getWinSize();
    var label = new LabelTTF("callback 2 called", "Marker Felt", 16);
    label.x = (s.width / 4) * 2;
    label.y = s.height / 2;

    this.addChild(label);
    this.called2 = true;
  }
  onCallback3() {
    var s = director.getWinSize();
    var label = new LabelTTF("callback 3 called", "Marker Felt", 16);
    label.x = (s.width / 4) * 3;
    label.y = s.height / 2;

    this.addChild(label);
    this.called3 = true;
  }
  title() {
    return "Sequence of InstantActions";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = [true, true, true, true, { x: 300, y: 200 }];
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret = [];
    ret.push(this.called1);
    ret.push(this.called2);
    ret.push(this.called3);
    ret.push(this._grossini.visible);
    ret.push(new Point(this._grossini.x, this._grossini.y));
    return JSON.stringify(ret);
  }
}
