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
// ActionBezierToCopy
//
//------------------------------------------------------------------
export class ActionBezierToCopy extends ActionsDemo {
  onEnter() {
    //----start9----onEnter
    super.onEnter();

    //
    // startPosition can be any coordinate, but since the movement
    // is relative to the Bezier curve, make it (0,0)
    //

    this.centerSprites(2);

    // sprite 1
    this._tamara.x = 80;
    this._tamara.y = 160;

    // 3 and only 3 control points should be used for Bezier actions.
    var controlPoints2 = [
      new Point(100, winSize.height / 2),
      new Point(200, -winSize.height / 2),
      new Point(240, 160)
    ];
    var bezierTo1 = new BezierTo(2, controlPoints2);

    // sprite 2
    this._kathia.x = 80;
    this._kathia.y = 160;
    var bezierTo2 = bezierTo1.clone();

    this._tamara.runAction(bezierTo1);
    this._kathia.runAction(bezierTo2);
    //----end9----
  }
  title() {
    return "bezierTo copy test";
  }
  subtitle() {
    return "Both sprites should move across the same path";
  }

}
