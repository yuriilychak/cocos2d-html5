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

//------------------------------------------------------------------
//
// Planet
//
//------------------------------------------------------------------
import { ChipmunkDemo } from "./chipmunk-demo";
import { NOT_GRABABLE_MASK } from "./chipmunk-test-helpers";
import { winSize } from "../constants";

export class Planet extends ChipmunkDemo {
  constructor() {
    super();
    // cc.base(this);
    this._subtitle = "Chipmunk Demo";
    this._title = "Planet";

    var space = this.space;

    // global
    this.gravityStrength = 5000000;

    // Create a rouge body to control the planet manually.
    //var planetBody = this.planetBody = new cp.BodyStatic();
    var planetBody = (this.planetBody = new cp.StaticBody());
    planetBody.setAngVel(0.2);
    planetBody.setPos(cp.v(winSize.width / 2, winSize.height / 2));

    space.iterations = 20;

    for (var i = 0; i < 30; i++) this.add_box();

    var shape = space.addShape(new cp.CircleShape(planetBody, 70.0, cp.vzero));
    shape.setElasticity(1.0);
    shape.setFriction(1.0);
    shape.setLayers(NOT_GRABABLE_MASK);
  }

  update(dt) {
    var steps = 1;
    dt /= steps;
    for (var i = 0; i < 3; i++) {
      this.space.step(dt);

      // Update the static body spin so that it looks like it's rotating.
      // this.planetBody.position_func(dt);
    }
  }

  planetGravityVelocityFunc(gravity, damping, dt) {
    // Gravitational acceleration is proportional to the inverse square of
    // distance, and directed toward the origin. The central planet is assumed
    // to be massive enough that it affects the satellites but not vice versa.
    var p = this.p;
    var sqdist = cp.v.lengthsq(p);
    var g = cp.v.mult(p, this.gravityStrength / (sqdist * Math.sqrt(sqdist)));

    body.velocity_func(g, damping, dt);
  }

  rand_pos(radius) {
    var v;
    do {
      v = cp.v(
        Math.random() * (640 - 2 * radius) - (320 - radius),
        Math.random() * (480 - 2 * radius) - (240 - radius)
      );
    } while (cp.v.len(v) < 85.0);

    return v;
  }

  add_box() {
    var size = 10.0;
    var mass = 1.0;

    var verts = [-size, -size, -size, size, size, size, size, -size];

    var radius = cp.v.len(cp.v(size, size));
    var pos = this.rand_pos(radius);

    var body = this.space.addBody(
      new cp.Body(mass, cp.momentForPoly(mass, verts, cp.vzero))
    );
    body.velocity_func = this.planetGravityVelocityFunc;
    body.setPos(cp.v.add(pos, cp.v(winSize.width / 2, winSize.height / 2)));

    // Set the box's velocity to put it into a circular orbit from its
    // starting position.
    var r = cp.v.len(pos);
    var v = Math.sqrt(this.gravityStrength / r) / r;
    body.setVel(cp.v.mult(cp.v.perp(pos), v));

    // Set the box's angular velocity to match its orbital period and
    // align its initial angle with its position.
    body.setAngVel(v);
    body.setAngle(Math.atan2(pos.y, pos.x));

    var shape = this.space.addShape(new cp.PolyShape(body, verts, cp.vzero));
    shape.setElasticity(0.0);
    shape.setFriction(0.7);
  }

  title() {
    return "Planet";
  }
}
