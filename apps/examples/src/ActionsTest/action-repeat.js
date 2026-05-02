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
// ActionRepeat
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo";
import { winSize } from "../constants";
import { Point } from "@aspect/core";
import { DelayTime, MoveBy, Place, Sequence } from "@aspect/actions";

export class ActionRepeat extends ActionsDemo {
  constructor() {
    super();
    this.testDuration = 4.3;
  }

  onEnter() {
    //----start21----onEnter
    super.onEnter();
    this.alignSpritesLeft(2);

    var a1 = new MoveBy(1, new Point(150, 0));

    var action1 = new Sequence(new Place(new Point(60, 60)), a1).repeat(
      3
    );
    var action2 = new Sequence(a1.clone(), a1.reverse(), new DelayTime(0.25))
      .repeatForever();

    this._kathia.runAction(action1);
    this._tamara.runAction(action2);
    //----end21----
  }
  title() {
    return "Repeat / RepeatForever actions";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = [
      { x: 210, y: 60 },
      { x: 60, y: (2 * winSize.height) / 3 }
    ];
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret = [];
    ret.push(new Point(this._kathia.x, this._kathia.y));
    ret.push(new Point(this._tamara.x, this._tamara.y));
    return JSON.stringify(ret);
  }
}
