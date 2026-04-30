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

export class Buoyancy extends ChipmunkDemo {
    constructor() {
        super();
        // cc.base(this);
        this._subtitle = 'Chipmunk Demo';
        this._title = 'Buoyancy';

        var space = this.space;
        space.iterations = 30;
        space.gravity = cp.v(0,-500);
    //  cpSpaceSetDamping(space, 0.5);
        space.sleepTimeThreshold = 0.5;
        space.collisionSlop = 0.5;

        var staticBody = space.staticBody;

        // Create segments around the edge of the screen.
        var shape = space.addShape( new cp.SegmentShape(staticBody, cp.v(0,0), cp.v(0,480), 0.0));
        shape.setElasticity(1.0);
        shape.setFriction(1.0);
        shape.setLayers(NOT_GRABABLE_MASK);

        shape = space.addShape( new cp.SegmentShape(staticBody, cp.v(640,0), cp.v(640,480), 0.0));
        shape.setElasticity(1.0);
        shape.setFriction(1.0);
        shape.setLayers(NOT_GRABABLE_MASK);

        shape = space.addShape( new cp.SegmentShape(staticBody, cp.v(0,0), cp.v(640,0), 0.0));
        shape.setElasticity(1.0);
        shape.setFriction(1.0);
        shape.setLayers(NOT_GRABABLE_MASK);

        shape = space.addShape( new cp.SegmentShape(staticBody, cp.v(0,480), cp.v(640,480), 0.0));
        shape.setElasticity(1.0);
        shape.setFriction(1.0);
        shape.setLayers(NOT_GRABABLE_MASK);

        // {
            // Add the edges of the bucket
            var bb = new cp.BB(20, 40, 420, 240);
            var radius = 5.0;

            shape = space.addShape( new cp.SegmentShape(staticBody, cp.v(bb.l, bb.b), cp.v(bb.l, bb.t), radius));
            shape.setElasticity(1.0);
            shape.setFriction(1.0);
            shape.setLayers(NOT_GRABABLE_MASK);

            shape = space.addShape( new cp.SegmentShape(staticBody, cp.v(bb.r, bb.b), cp.v(bb.r, bb.t), radius));
            shape.setElasticity(1.0);
            shape.setFriction(1.0);
            shape.setLayers(NOT_GRABABLE_MASK);

            shape = space.addShape( new cp.SegmentShape(staticBody, cp.v(bb.l, bb.b), cp.v(bb.r, bb.b), radius));
            shape.setElasticity(1.0);
            shape.setFriction(1.0);
            shape.setLayers(NOT_GRABABLE_MASK);

            // Add the sensor for the water.
            shape = space.addShape( new cp.BoxShape2(staticBody, bb) );
            shape.setSensor(true);
            shape.setCollisionType(1);
        // }


        // {
            var width = 200.0;
            var height = 50.0;
            var mass = 0.3*FLUID_DENSITY*width*height;
            var moment = cp.momentForBox(mass, width, height);

            var body = space.addBody( new cp.Body(mass, moment));
            body.setPos( cp.v(270, 140));
            body.setVel( cp.v(0, -100));
            body.setAngVel( 1 );

            shape = space.addShape( new cp.BoxShape(body, width, height));
            shape.setFriction(0.8);
        // }

        // {
            width = 40.0;
            height = width*2;
            mass = 0.3*FLUID_DENSITY*width*height;
            moment = cp.momentForBox(mass, width, height);

            body = space.addBody( new cp.Body(mass, moment));
            body.setPos(cp.v(120, 190));
            body.setVel(cp.v(0, -100));
            body.setAngVel(1);

            shape = space.addShape(new cp.BoxShape(body, width, height));
            shape.setFriction(0.8);
        // }
    }

    update(dt) {
        var steps = 3;
        dt /= steps;
        for (var i = 0; i < 3; i++){
            this.space.step(dt);
        }
    }

    onEnter() {
        super.onEnter();
        this.space.addCollisionHandler( 1, 0, null, this.waterPreSolve, null, null);
    }

    onExit() {
        this.space.removeCollisionHandler(1, 0);
        super.onExit();
    }

    title() {
        return 'Buoyancy';
    }

    waterPreSolve(arb, space, ptr) {
        var shapes = arb.getShapes();
        var water = shapes[0];
        var poly = shapes[1];

        var body = poly.getBody();

        // Get the top of the water sensor bounding box to use as the water level.
        var level = water.getBB().t;

        // Clip the polygon against the water level
        var count = poly.getNumVerts();

        var clipped = [];

        var j=count-1;
        for(var i=0; i<count; i++) {
            var a = body.local2World(poly.getVert(j));
            var b = body.local2World(poly.getVert(i));

            if(a.y < level){
                clipped.push(a.x);
                clipped.push(a.y);
            }

            var a_level = a.y - level;
            var b_level = b.y - level;

            if(a_level*b_level < 0.0){
                var t = Math.abs(a_level)/(Math.abs(a_level) + Math.abs(b_level));

                var v = cp.v.lerp(a, b, t);
                clipped.push(v.x);
                clipped.push(v.y);
            }
            j=i;
        }

        // Calculate buoyancy from the clipped polygon area
        var clippedArea = cp.areaForPoly(clipped);

        var displacedMass = clippedArea*FLUID_DENSITY;
        var centroid = cp.centroidForPoly(clipped);

        var dt = space.getCurrentTimeStep();
        var g = space.gravity;

        // Apply the buoyancy force as an impulse.
        body.applyImpulse(cp.v.mult(g, -displacedMass*dt), centroid);

        // Apply linear damping for the fluid drag.
        var v_centroid = body.getVelAtWorldPoint(centroid)
        var k = k_scalar_body(body, centroid, cp.v.normalize(v_centroid));
        var damping = clippedArea*FLUID_DRAG*FLUID_DENSITY;
        var v_coef = Math.exp(-damping*dt*k); // linear drag
//  var v_coef = 1.0/(1.0 + damping*dt*cp.v.len(v_centroid)*k); // quadratic drag
        body.applyImpulse(cp.v.mult(cp.v.sub(cp.v.mult(v_centroid, v_coef), v_centroid), 1.0/k), centroid);

        // Apply angular damping for the fluid drag.
        var cog = body.local2World(body.getCenterOfGravity());
        var w_damping = cp.momentForPoly(FLUID_DRAG*FLUID_DENSITY*clippedArea, clipped, cp.v.neg(cog), 0);
        body.w *= Math.exp(-w_damping*dt* (1/body.i));

        return true;
    }

}
