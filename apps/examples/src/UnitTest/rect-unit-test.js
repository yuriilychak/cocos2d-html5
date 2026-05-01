/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
// RectUnitTest
//
//------------------------------------------------------------------
import { UnitTestBase } from "./unit-test-base";

export class RectUnitTest extends UnitTestBase {
  constructor() {
    super();
    this._title = "Rect Unit Test";
    this._subtitle = "See console for possible errors";
    this.testDuration = 0.1;
  }

  onEnter() {
    super.onEnter();
    this.runTest();
  }

  runTest() {
    var ret = [];
    var rectA;
    var rectB;
    var rectC;
    var point;
    var r;

    this.log("Test 1: rectIntersectsRect 1");
    rectA = new cc.Rect(0, 0, 5, 10);
    rectB = new cc.Rect(4, 9, 5, 10);
    r = cc.Rect.intersects(rectA, rectB);
    if (!r) throw "Fail rectIntersectsRect 1";
    ret.push(r);

    this.log("Test 2: rectIntersectsRect 2");
    rectA = new cc.Rect(0, 0, 5, 10);
    rectB = new cc.Rect(40, 90, 5, 10);
    r = cc.Rect.intersects(rectA, rectB);
    if (r) throw "Fail rectIntersectsRect 2";
    ret.push(r);

    this.log("Test 3: rectIntersection");
    rectA = new cc.Rect(0, 0, 5, 10);
    rectB = new cc.Rect(4, 9, 5, 10);
    rectC = cc.Rect.intersection(rectA, rectB);
    r = cc.Rect.equalTo(rectC, new cc.Rect(4, 9, 1, 1));
    if (!r) throw "Fail rectIntersection";
    ret.push(r);

    this.log("Test 4: rectUnion");
    rectA = new cc.Rect(0, 0, 5, 10);
    rectB = new cc.Rect(4, 9, 5, 10);
    rectC = cc.Rect.union(rectA, rectB);
    r = cc.Rect.equalTo(rectC, new cc.Rect(0, 0, 9, 19));
    if (!r) throw "Fail rectUnion";
    ret.push(r);

    this.log("Test 5: rectContainsPoint 1");
    rectA = new cc.Rect(0, 0, 5, 10);
    point = new cc.Point(1, 1);
    r = cc.Rect.containsPoint(rectA, point);
    if (!r) throw "Fail rectContainsPoint 1";
    ret.push(r);

    this.log("Test 6: rectContainsPoint 2");
    rectA = new cc.Rect(0, 0, 5, 10);
    point = new cc.Point(1, -1);
    r = cc.Rect.containsPoint(rectA, point);
    if (r) throw "Fail rectContainsPoint 2";
    ret.push(r);

    this.log("Test 7: rect property x");
    rectA = new cc.Rect(1, 2, 3, 4);
    if (rectA.x != 1) throw "Fail rect property x";
    ret.push(rectA.x);

    this.log("Test 8: rect property y");
    rectA = new cc.Rect(1, 2, 3, 4);
    if (rectA.y != 2) throw "Fail rect property y";
    ret.push(rectA.y);

    this.log("Test 9: rect property width");
    rectA = new cc.Rect(1, 2, 3, 4);
    if (rectA.width != 3) throw "Fail rect property width";
    ret.push(rectA.width);

    this.log("Test 10: rect property height");
    rectA = new cc.Rect(1, 2, 3, 4);
    if (rectA.height != 4) throw "Fail rect property height";
    ret.push(rectA.height);

    this.log("Test 11: getBoundingBox()");
    var node = new cc.Node();
    node.width = 99;
    node.height = 101;
    var bb = node.getBoundingBox();
    if (bb.height != 101 || bb.width != 99) throw "Fail getBoundingBox()";
    ret.push(bb.height);
    ret.push(bb.width);
    return ret;
  }

  //
  // Automation
  //

  getExpectedResult() {
    var ret = [true, false, true, true, true, false, 1, 2, 3, 4, 101, 99];
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var ret = this.runTest();
    return JSON.stringify(ret);
  }
}
