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

import { ChipmunkBaseLayer } from "./chipmunk-base-layer.js";
import { NOT_GRABABLE_MASK, v } from "./chipmunk-test-helpers.js";

export class ChipmunkDemo extends ChipmunkBaseLayer {
    constructor() {
        super();
        //cc.base(this);

        this.remainder = 0;

        // debug only
        this._debugNode.visible = true ;

        this.scheduleUpdate();
    }

    update(dt) {
        this.space.step(dt);
    }

    addFloor() {
        var space = this.space;
        var floor = space.addShape(new cp.SegmentShape(space.staticBody, v(0, 0), v(640, 0), 0));
        floor.setElasticity(1);
        floor.setFriction(1);
        floor.setLayers(NOT_GRABABLE_MASK);
    }

    addWalls() {
        var space = this.space;
        var wall1 = space.addShape(new cp.SegmentShape(space.staticBody, v(0, 0), v(0, 480), 0));
        wall1.setElasticity(1);
        wall1.setFriction(1);
        wall1.setLayers(NOT_GRABABLE_MASK);

        var wall2 = space.addShape(new cp.SegmentShape(space.staticBody, v(640, 0), v(640, 480), 0));
        wall2.setElasticity(1);
        wall2.setFriction(1);
        wall2.setLayers(NOT_GRABABLE_MASK);
    }

}
