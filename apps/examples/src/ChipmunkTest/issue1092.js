/****************************************************************************
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

//
// Flow control
//
import { ChipmunkDemo } from "./chipmunk-demo";
import { winSize } from "../constants";

export class Issue1092 extends ChipmunkDemo {
  constructor() {
    super();
    this._subtitle = "Chipmunk Demo";
    this._title = "Issue 1092";

    var space = this.space;

    var body = space.addBody(new cp.Body(100, 50));
    body.setPos(cp.v(winSize.width / 2, winSize.height / 2));
    space.addShape(cp.BoxShape(body, 50, 50));

    cc.assert(body.vx == 0, "assertion failed : vx");
    cc.assert(body.vy == 0, "assertion failed : vy");
    cc.assert(body.v_limit == Infinity, "assertion failed : v_limit");
    cc.assert(body.w_limit == Infinity, "assertion failed : w_limit");
    cc.assert(body.f.x == 0, "assertion failed : f");
    cc.assert(body.t == 0, "assertion failed : t");
    cc.assert(body.m == 100, "assertion failed : m");
    cc.assert(body.m_inv == 0.01, "assertion failed : m_inv");
    cc.assert(body.i == 50, "assertion failed : i");
    cc.assert(body.i_inv == 0.02, "assertion failed : i_inv");
    cc.assert(body.rot.x == Math.cos(0), "assertion failed : rot");

    space.addConstraint(
      new cp.PivotJoint(
        body,
        space.staticBody,
        cp.v(winSize.width / 2, winSize.height / 2)
      )
    );
    body.applyImpulse(
      cp.v(winSize.width / 2, winSize.height / 2 - 20),
      cp.v(1, -1)
    );

    body.eachShape(function (shape) {
      cc.log(shape);
    });
    body.eachConstraint(function (joint) {
      cc.log(joint);
    });
    body.eachArbiter(function (arbiter) {
      cc.log(arbiter);
    });
  }
}
