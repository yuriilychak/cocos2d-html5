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
// Testing DrawNode API 2
//
//------------------------------------------------------------------
import { DrawTestDemo } from "./draw-test-demo";
import { Color, Director, Point, degreesToRadians } from "@aspect/core";
import { DrawNode } from "@aspect/shape-nodes";

export class DrawNewAPITest2 extends DrawTestDemo {
  constructor() {
    super();
    this._title = "DrawNode";
    this._subtitle = "Testing DrawNode API 2";
  }

  onEnter() {
    //----start0----ctor
    super.onEnter();
    var draw = new DrawNode();
    this.addChild(draw, 10);
    var winSize = Director.getInstance().getWinSize();
    var centerPos = new Point(winSize.width / 2, winSize.height / 2);
    //drawSegment
    draw.drawSegment(
      new Point(0, 0),
      new Point(winSize.width, winSize.height),
      1,
      new Color(255, 255, 255, 255)
    );
    draw.drawSegment(
      new Point(0, winSize.height),
      new Point(winSize.width, 0),
      5,
      new Color(255, 0, 0, 255)
    );

    //drawDot
    draw.drawDot(
      new Point(winSize.width / 2, winSize.height / 2),
      40,
      new Color(0, 0, 255, 128)
    );
    var points = [
      new Point(60, 60),
      new Point(70, 70),
      new Point(60, 70),
      new Point(70, 60)
    ];
    for (var i = 0; i < points.length; i++) {
      draw.drawDot(points[i], 4, new Color(0, 255, 255, 255));
    }
    //drawCircle
    draw.drawCircle(
      new Point(winSize.width / 2, winSize.height / 2),
      100,
      0,
      10,
      false,
      6,
      new Color(0, 255, 0, 255)
    );
    draw.drawCircle(
      new Point(winSize.width / 2, winSize.height / 2),
      50,
      degreesToRadians(90),
      50,
      true,
      2,
      new Color(0, 255, 255, 255)
    );

    //draw poly
    //not fill
    var vertices = [
      new Point(0, 0),
      new Point(50, 50),
      new Point(100, 50),
      new Point(100, 100),
      new Point(50, 100)
    ];
    draw.drawPoly(vertices, null, 5, new Color(255, 255, 0, 255));
    var vertices2 = [
      new Point(30, 130),
      new Point(30, 230),
      new Point(50, 200)
    ];
    draw.drawPoly(vertices2, null, 2, new Color(255, 0, 255, 255));
    //fill
    var vertices3 = [
      new Point(60, 130),
      new Point(60, 230),
      new Point(80, 200)
    ];
    draw.drawPoly(
      vertices3,
      new Color(0, 255, 255, 50),
      2,
      new Color(255, 0, 255, 255)
    );

    //draw rect
    //not fill
    draw.drawRect(
      new Point(120, 120),
      new Point(200, 200),
      null,
      2,
      new Color(255, 0, 255, 255)
    );
    //fill
    draw.drawRect(
      new Point(120, 220),
      new Point(200, 300),
      new Color(0, 255, 255, 50),
      2,
      new Color(128, 128, 0, 255)
    );

    // draw quad bezier path
    draw.drawQuadBezier(
      new Point(0, winSize.height),
      new Point(centerPos.x, centerPos.y),
      new Point(winSize.width, winSize.height),
      50,
      2,
      new Color(255, 0, 255, 255)
    );

    // draw cubic bezier path
    draw.drawCubicBezier(
      new Point(winSize.width / 2, winSize.height / 2),
      new Point(winSize.width / 2 + 30, winSize.height / 2 + 50),
      new Point(winSize.width / 2 + 60, winSize.height / 2 - 50),
      new Point(winSize.width, winSize.height / 2),
      100,
      2,
      new Color(255, 0, 255, 255)
    );

    //draw cardinal spline
    var vertices4 = [
      new Point(centerPos.x - 130, centerPos.y - 130),
      new Point(centerPos.x - 130, centerPos.y + 130),
      new Point(centerPos.x + 130, centerPos.y + 130),
      new Point(centerPos.x + 130, centerPos.y - 130),
      new Point(centerPos.x - 130, centerPos.y - 130)
    ];
    draw.drawCardinalSpline(
      vertices4,
      0.5,
      100,
      2,
      new Color(255, 255, 255, 255)
    );
    //----end0----
  }
}
