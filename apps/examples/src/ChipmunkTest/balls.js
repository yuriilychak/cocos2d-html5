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
// Chipmunk Demo: Balls
//
//------------------------------------------------------------------
export class Balls extends ChipmunkDemo {
    constructor() {
        super();
        // cc.base(this);
        this._subtitle = 'Chipmunk Demo';
        this._title = 'Balls';

        var space = this.space;
        space.iterations = 60;
        space.gravity = v(0, -500);
        space.sleepTimeThreshold = 0.5;
        space.collisionSlop = 0.5;
        space.sleepTimeThreshold = 0.5;

        this.addFloor();
        this.addWalls();

        var width = 50;
        var height = 60;
        var mass = width * height * 1/1000;
        var rock = space.addBody(new cp.Body(mass, cp.momentForBox(mass, width, height)));
        rock.setPos(v(500, 100));
        rock.setAngle(1);
        var shape = space.addShape(new cp.BoxShape(rock, width, height));
        shape.setFriction(0.3);
        shape.setElasticity(0.3);

        for (var i = 1; i <= 10; i++) {
            var radius = 20;
            mass = 3;
            var body = space.addBody(new cp.Body(mass, cp.momentForCircle(mass, 0, radius, v(0, 0))));
            body.setPos(v(200 + i, (2 * radius + 5) * i));
            var circle = space.addShape(new cp.CircleShape(body, radius, v(0, 0)));
            circle.setElasticity(0.8);
            circle.setFriction(1);
        }
        /*
         * atom.canvas.onmousedown = function(e) {
         radius = 10;
         mass = 3;
         body = space.addBody(new cp.Body(mass, cp.momentForCircle(mass, 0, radius, v(0, 0))));
         body.setPos(v(e.clientX, e.clientY));
         circle = space.addShape(new cp.CircleShape(body, radius, v(0, 0)));
         circle.setElasticity(0.5);
         return circle.setFriction(1);
         };
         */

        // this.ctx.strokeStyle = "black";

        var ramp = space.addShape(new cp.SegmentShape(space.staticBody, v(100, 100), v(300, 200), 10));
        ramp.setElasticity(1);
        ramp.setFriction(1);
        ramp.setLayers(NOT_GRABABLE_MASK);
    }

    title(){
        return 'Balls';
    }

}
