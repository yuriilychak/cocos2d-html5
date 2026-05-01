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

import { ChipmunkDemo } from "./chipmunk-demo";
import { v } from "./chipmunk-test-helpers";

export class Issue1083 extends ChipmunkDemo {
  constructor() {
    super();
    this._subtitle = "Chipmunk Demo";
    this._title = "Issue 1083";

    var space = this.space;

    //add a segment
    var mass = 1;
    var length = 100;
    var a = v(-length / 2, 0),
      b = v(length / 2, 0);
    var body = space.addBody(
      new cp.Body(mass, cp.momentForSegment(mass, a, b))
    );
    body.setPos(v(320, 340));
    var segment = new cp.SegmentShape(body, a, b, 20);
    space.addShape(segment);

    //add a poly
    var mass = 1;
    var NUM_VERTS = 5;
    var verts = new Array(NUM_VERTS * 2);
    for (var i = 0; i < NUM_VERTS * 2; i += 2) {
      var angle = (-Math.PI * i) / NUM_VERTS;
      verts[i] = 30 * Math.cos(angle);
      verts[i + 1] = 30 * Math.sin(angle);
    }
    var body = space.addBody(
      new cp.Body(mass, cp.momentForPoly(mass, verts, v(0, 0)))
    );
    body.setPos(v(350 + 60, 220 + 60));
    var poly = new cp.PolyShape(body, verts, v(0, 0));
    space.addShape(poly);

    cc.assert(
      segment.a.x == -length / 2,
      "SegmentShape assertion failed : a.x"
    );
    cc.assert(segment.a.y == 0, "SegmentShape assertion failed : a.y");
    cc.assert(segment.b.x == length / 2, "SegmentShape assertion failed : b.x");
    cc.assert(segment.b.y == 0, "SegmentShape assertion failed : b.y");
    var normal = cp.v.perp(cp.v.normalize(cp.v.sub(b, a)));
    cc.assert(segment.n.x == normal.x, "SegmentShape assertion failed : n.x");
    cc.assert(segment.n.y == normal.y, "SegmentShape assertion failed : n.y");
    cc.assert(segment.r == 20, "SegmentShape assertion failed : r");

    for (var i = 0; i < verts.length; ++i) {
      cc.assert(
        verts[i] == poly.verts[i],
        "PolyShape assertion failed : verts"
      );
    }

    // FIXME: Chipmunk v7.0 does export planes
    // var plane = poly.planes[0];
    // cc.assert(plane.d.toFixed(4) == 24.2705, "PolyShape assertion failed : planes d");
    // cc.assert(plane.n.x.toFixed(4) == 0.8090, "PolyShape assertion failed : planes n");
  }
}
