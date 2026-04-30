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
// ActionJump
//
//------------------------------------------------------------------
export class ActionJump extends ActionsDemo {
    constructor() {
        super();
        this.testDuration = 2.1;
    }

      get _code() { 
        return "a = new cc.JumpBy( time, point, height, #_of_jumps );\n" +
        "a = new cc.JumpTo( time, point, height, #_of_jumps );";
      }

  onEnter() {
    //----start7----onEnter
    super.onEnter();
    this.centerSprites(3);

    var actionTo = new cc.JumpTo(2, new cc.Point(300, 300), 50, 4);
    var actionBy = new cc.JumpBy(2, new cc.Point(300, 0), 50, 4);
    var actionUp = new cc.JumpBy(2, new cc.Point(0, 0), 80, 4);
    var actionByBack = actionBy.reverse();

    var delay = new cc.DelayTime(0.25);

    this._tamara.runAction(actionTo);
    this._grossini.runAction(cc.sequence(actionBy, delay, actionByBack));

    var action = cc.sequence(actionUp, delay.clone()).repeatForever();
    this._kathia.runAction(action);
    //----end7----
  }
  title() {
    return "cc.jumpTo / cc.jumpBy";
  }
  subtitle() {
    return "Actions will stop for 0.25s after 2 seconds";
  }

  //
  // Automation
  //
  getExpectedResult() {
    var ret = [
      { x: 300, y: 300 },
      { x: winSize.width / 2 + 300, y: winSize.height / 2 },
      { x: (3 * winSize.width) / 4, y: winSize.height / 2 }
    ];
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var ret = [];
    ret.push(new cc.Point(this._tamara.x, this._tamara.y));
    ret.push(new cc.Point(this._grossini.x, this._grossini.y));
    ret.push(new cc.Point(this._kathia.x, this._kathia.y));

    return JSON.stringify(ret);
  }

}
