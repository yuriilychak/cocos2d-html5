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
// ActionCatmullRom
//
//------------------------------------------------------------------
export class ActionCatmullRom extends ActionsDemo {

      get _code() { 
        return "a = new cc.CatmullRomBy( time, array_of_points );\n" +
        " a = new cc.CatmullRomTo( time, array_of_points );";
      }

  constructor() {
    super();


      this._drawNode1 = null;


      this._drawNode2 = null;


      this.testDuration = 3.1;

    this._drawNode1 = new cc.DrawNode();
    this._drawNode1.x = 50;
    this._drawNode1.y = 50;
    this._drawNode1.setDrawColor(new cc.Color(255, 255, 255, 255));
    this.addChild(this._drawNode1);

    this._drawNode2 = new cc.DrawNode();
    this._drawNode2.setDrawColor(new cc.Color(255, 255, 255, 255));
    this.addChild(this._drawNode2);
  }

  onEnter() {
    //----start12----onEnter
    super.onEnter();

    this.centerSprites(2);

    var delay = new cc.DelayTime(0.25);

    //
    // sprite 1 (By)
    //
    // startPosition can be any coordinate, but since the movement
    // is relative to the Catmull Rom curve, it is better to start with (0,0).
    //
    this._tamara.x = 50;
    this._tamara.y = 50;

    var array = [
      new cc.Point(0, 0),
      new cc.Point(80, 80),
      new cc.Point(winSize.width - 80, 80),
      new cc.Point(winSize.width - 80, winSize.height - 80),
      new cc.Point(80, winSize.height - 80),
      new cc.Point(80, 80),
      new cc.Point(winSize.width / 2, winSize.height / 2)
    ];

    var action1 = new cc.CatmullRomBy(3, array);
    var reverse1 = action1.reverse();
    var seq1 = cc.sequence(action1, delay, reverse1);

    this._tamara.runAction(seq1);

    //
    // sprite 2 (To)
    //
    // The startPosition is not important here, because it uses a "To" action.
    // The initial position will be the 1st point of the Catmull Rom path
    //
    var array2 = [
      new cc.Point(winSize.width / 2, 30),
      new cc.Point(winSize.width - 80, 30),
      new cc.Point(winSize.width - 80, winSize.height - 80),
      new cc.Point(winSize.width / 2, winSize.height - 80),
      new cc.Point(winSize.width / 2, 30)
    ];

    var action2 = new cc.CatmullRomTo(3, array2);
    var reverse2 = action2.reverse();

    var seq2 = cc.sequence(action2, delay.clone(), reverse2);

    this._kathia.runAction(seq2);

    this._drawNode1.drawCatmullRom(array, 50, 1);
    this._drawNode2.drawCatmullRom(array2, 50, 1);
    //----end12----
  }
  subtitle() {
    return "Catmull Rom spline paths. Testing reverse too";
  }
  title() {
    return "CatmullRomBy / CatmullRomTo";
  }
  //
  // Automation
  //
  setupAutomation() {
    this.scheduleOnce(this.checkControl1, (3 / 4) * 0);
    this.scheduleOnce(this.checkControl2, (3 / 4) * 1);
    this.scheduleOnce(this.checkControl3, (3 / 4) * 2);
  }
  checkControl1(dt) {
    this.control1 = new cc.Point(this._kathia.x, this._kathia.y);
  }
  verifyControl1(dt) {
    var x = Math.abs(winSize.width / 2 - this.control1.x);
    var y = Math.abs(30 - this.control1.y);
    //  -/+ 5 pixels of error
    return x < 5 && y < 5;
  }
  checkControl2(dt) {
    this.control2 = new cc.Point(this._kathia.x, this._kathia.y);
  }
  verifyControl2(dt) {
    var x = Math.abs(winSize.width - 80 - this.control2.x);
    var y = Math.abs(30 - this.control2.y);
    //  -/+ 5 pixels of error
    return x < 5 && y < 5;
  }
  checkControl3(dt) {
    this.control3 = new cc.Point(this._kathia.x, this._kathia.y);
  }
  verifyControl3(dt) {
    var x = Math.abs(winSize.width - 80 - this.control3.x);
    var y = Math.abs(winSize.height - 80 - this.control3.y);
    //  -/+ 5 pixels of error
    return x < 5 && y < 5;
  }

  getExpectedResult() {
    var ret = [true, true, true, { x: winSize.width / 2, y: 30 }];
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var ret = [];
    ret.push(this.verifyControl1());
    ret.push(this.verifyControl2());
    ret.push(this.verifyControl3());
    ret.push(new cc.Point(this._kathia.x, this._kathia.y));

    return JSON.stringify(ret);
  }

}
