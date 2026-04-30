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

import { Balls } from "./balls.js";
import { Buoyancy } from "./buoyancy.js";
import { ChipmunkBaseLayer } from "./chipmunk-base-layer.js";
import { ChipmunkCollisionMemoryLeakTest } from "./chipmunk-collision-memory-leak-test.js";
import { ChipmunkCollisionTestB } from "./chipmunk-collision-test-b.js";
import { ChipmunkCollisionTest_no_specific_type } from "./chipmunk-collision-test-no-specific-type.js";
import { ChipmunkCollisionTest } from "./chipmunk-collision-test.js";
import { ChipmunkReleaseTest } from "./chipmunk-release-test.js";
import { ChipmunkSpriteAnchorPoint } from "./chipmunk-sprite-anchor-point.js";
import { ChipmunkSpriteBatchTest } from "./chipmunk-sprite-batch-test.js";
import { ChipmunkSprite } from "./chipmunk-sprite.js";
import { chipmunkTestSceneIdx , _setchipmunkTestSceneIdx} from "./chipmunk-test-constants.js";
import { Issue1073 } from "./issue1073.js";
import { Issue1083 } from "./issue1083.js";
import { Issue1092 } from "./issue1092.js";
import { Joints } from "./joints.js";
import { PyramidStack } from "./pyramid-stack.js";
import { PyramidTopple } from "./pyramid-topple.js";
import { Query } from "./query.js";
import { s_hole_stencil_png } from "../tests_resources.js";

;

;

;

;

;

;

;

;

;

//
// Base class for Chipmunk Demo
//
// Chipmunk Demos from Chipmunk-JS project
// https://github.com/josephg/chipmunk-js
//
export var v = cp.v;

export var ctx;

export var GRABABLE_MASK_BIT = 1<<31;

export var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;

;

;

;

;

;

//------------------------------------------------------------------
//
// Buoyancy
//
//------------------------------------------------------------------
export var FLUID_DENSITY = 0.00014;

export var FLUID_DRAG = 2.0;

;

;

;

//------------------------------------------------------------------
 //
 // LogoSmash
 //
 //------------------------------------------------------------------
export var LogoSmash = (function(){

    var image_width = 188;
    var image_height = 35;
    var image_row_length = 24;

    var image_bitmap = [
        15,-16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,-64,15,63,-32,-2,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,31,-64,15,127,-125,-1,-128,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,127,-64,15,127,15,-1,-64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,-1,-64,15,-2,
        31,-1,-64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,-1,-64,0,-4,63,-1,-32,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,1,-1,-64,15,-8,127,-1,-32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        1,-1,-64,0,-8,-15,-1,-32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,-31,-1,-64,15,-8,-32,
        -1,-32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,-15,-1,-64,9,-15,-32,-1,-32,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,31,-15,-1,-64,0,-15,-32,-1,-32,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,63,-7,-1,-64,9,-29,-32,127,-61,-16,63,15,-61,-1,-8,31,-16,15,-8,126,7,-31,
        -8,31,-65,-7,-1,-64,9,-29,-32,0,7,-8,127,-97,-25,-1,-2,63,-8,31,-4,-1,15,-13,
        -4,63,-1,-3,-1,-64,9,-29,-32,0,7,-8,127,-97,-25,-1,-2,63,-8,31,-4,-1,15,-13,
        -2,63,-1,-3,-1,-64,9,-29,-32,0,7,-8,127,-97,-25,-1,-1,63,-4,63,-4,-1,15,-13,
        -2,63,-33,-1,-1,-32,9,-25,-32,0,7,-8,127,-97,-25,-1,-1,63,-4,63,-4,-1,15,-13,
        -1,63,-33,-1,-1,-16,9,-25,-32,0,7,-8,127,-97,-25,-1,-1,63,-4,63,-4,-1,15,-13,
        -1,63,-49,-1,-1,-8,9,-57,-32,0,7,-8,127,-97,-25,-8,-1,63,-2,127,-4,-1,15,-13,
        -1,-65,-49,-1,-1,-4,9,-57,-32,0,7,-8,127,-97,-25,-8,-1,63,-2,127,-4,-1,15,-13,
        -1,-65,-57,-1,-1,-2,9,-57,-32,0,7,-8,127,-97,-25,-8,-1,63,-2,127,-4,-1,15,-13,
        -1,-1,-57,-1,-1,-1,9,-57,-32,0,7,-1,-1,-97,-25,-8,-1,63,-1,-1,-4,-1,15,-13,-1,
        -1,-61,-1,-1,-1,-119,-57,-32,0,7,-1,-1,-97,-25,-8,-1,63,-1,-1,-4,-1,15,-13,-1,
        -1,-61,-1,-1,-1,-55,-49,-32,0,7,-1,-1,-97,-25,-8,-1,63,-1,-1,-4,-1,15,-13,-1,
        -1,-63,-1,-1,-1,-23,-49,-32,127,-57,-1,-1,-97,-25,-1,-1,63,-1,-1,-4,-1,15,-13,
        -1,-1,-63,-1,-1,-1,-16,-49,-32,-1,-25,-1,-1,-97,-25,-1,-1,63,-33,-5,-4,-1,15,
        -13,-1,-1,-64,-1,-9,-1,-7,-49,-32,-1,-25,-8,127,-97,-25,-1,-1,63,-33,-5,-4,-1,
        15,-13,-1,-1,-64,-1,-13,-1,-32,-49,-32,-1,-25,-8,127,-97,-25,-1,-2,63,-49,-13,
        -4,-1,15,-13,-1,-1,-64,127,-7,-1,-119,-17,-15,-1,-25,-8,127,-97,-25,-1,-2,63,
        -49,-13,-4,-1,15,-13,-3,-1,-64,127,-8,-2,15,-17,-1,-1,-25,-8,127,-97,-25,-1,
        -8,63,-49,-13,-4,-1,15,-13,-3,-1,-64,63,-4,120,0,-17,-1,-1,-25,-8,127,-97,-25,
        -8,0,63,-57,-29,-4,-1,15,-13,-4,-1,-64,63,-4,0,15,-17,-1,-1,-25,-8,127,-97,
        -25,-8,0,63,-57,-29,-4,-1,-1,-13,-4,-1,-64,31,-2,0,0,103,-1,-1,-57,-8,127,-97,
        -25,-8,0,63,-57,-29,-4,-1,-1,-13,-4,127,-64,31,-2,0,15,103,-1,-1,-57,-8,127,
        -97,-25,-8,0,63,-61,-61,-4,127,-1,-29,-4,127,-64,15,-8,0,0,55,-1,-1,-121,-8,
        127,-97,-25,-8,0,63,-61,-61,-4,127,-1,-29,-4,63,-64,15,-32,0,0,23,-1,-2,3,-16,
        63,15,-61,-16,0,31,-127,-127,-8,31,-1,-127,-8,31,-128,7,-128,0,0
    ];

    var get_pixel = function(x, y)
    {
        return (image_bitmap[(x>>3) + y*image_row_length]>>(~x&0x7)) & 1;
    };

    var make_ball = function(x, y)
    {
        var body = new cp.Body(1, Infinity);
        body.setPos(cp.v(x, y));

        var shape = new cp.CircleShape(body, 0.95, cp.vzero);
        shape.setElasticity(0);
        shape.setFriction(0);

        return shape;
    };

    return class extends ChipmunkBaseLayer {
        constructor() {
            super();
            this._title =  "LogoSmash";
            this._subtitle = "Chipmunk Demo";
        }
        onEnter() {
            super.onEnter();
            var space = this.space;
            space.setIterations(1);

            // The space will contain a very large number of similary sized objects.
            // This is the perfect candidate for using the spatial hash.
            // Generally you will never need to do this.
            //
            // (... Except the spatial hash isn't implemented in JS)
            // but it is implemented in JSB :)
            if(cc.sys.isNative)
                space.useSpatialHash(2.0, 10000);

            var batch = new cc.SpriteBatchNode(s_hole_stencil_png);
            this.addChild(batch);

            var body;
            var shape;
            var sprite;

            for(var y=0; y<image_height; y++){
                for(var x=0; x<image_width; x++){
                    if(!get_pixel(x, y)) continue;

                    var x_jitter = 0.05*Math.random();
                    var y_jitter = 0.05*Math.random();

                    var posx = 2*(x - image_width/2 + x_jitter) + 320;
                    var posy = 2*(image_height/2 - y + y_jitter) + 240;
                    shape = make_ball(posx, posy);
                    space.addBody(shape.getBody());
                    space.addShape(shape);

                    sprite = new cc.Sprite(batch.texture);
                    sprite.setPosition(posx, posy);
                    batch.addChild(sprite);

                    shape.sprite = sprite;
                }
            }

            body = space.addBody(new cp.Body(9999, Infinity));
            body.setPos(cp.v(-1000, 240-10));
            body.setVel(cp.v(400, 0));

            shape = space.addShape(new cp.CircleShape(body, 8, cp.vzero));
            shape.setElasticity(0);
            shape.setFriction(0);
            shape.setLayers(NOT_GRABABLE_MASK);
            shape.ball = true;

            sprite = new cc.Sprite(batch.texture);
            sprite.setPosition(posx, posy);
            batch.addChild(sprite);
            shape.sprite = sprite;

            this.scheduleUpdate();
        }

        update(dt) {
            var space = this.space;
            space.step(dt);
            space.eachShape(function(shape){
                var pos = shape.body.p;
                shape.sprite.setPosition(pos.x, pos.y);
                //no need to set rotation for this case, for all sprites are round
            });
        }
    };
})();

;

;

;

;

// Chipmunk Demos
export var arrayOfChipmunkTest =  [

// Chipmunk "C" Tests
        // Planet,
        LogoSmash,
        Query,
        Buoyancy,
        PyramidStack,
        PyramidTopple,
        Joints,
        Balls,

// Custom Tests
        ChipmunkSprite ,
        ChipmunkSpriteBatchTest ,
        ChipmunkCollisionTest_no_specific_type,
        ChipmunkCollisionTest,
        ChipmunkCollisionMemoryLeakTest,
        ChipmunkSpriteAnchorPoint,

        Issue1073,
        Issue1083,
        Issue1092
        ];

if( cc.sys.isNative ) {
    arrayOfChipmunkTest.push( ChipmunkCollisionTestB );
    arrayOfChipmunkTest.push( ChipmunkReleaseTest );
}

export function nextChipmunkTest() {
    _setchipmunkTestSceneIdx(chipmunkTestSceneIdx + 1);
    _setchipmunkTestSceneIdx(chipmunkTestSceneIdx % arrayOfChipmunkTest.length);

    if(window.sideIndexBar){
        _setchipmunkTestSceneIdx(window.sideIndexBar.changeTest(chipmunkTestSceneIdx, 3));
    }

    return new arrayOfChipmunkTest[chipmunkTestSceneIdx]();
}

;

export function previousChipmunkTest() {
    _setchipmunkTestSceneIdx(chipmunkTestSceneIdx - 1);
    if (chipmunkTestSceneIdx < 0)
        _setchipmunkTestSceneIdx(chipmunkTestSceneIdx + (arrayOfChipmunkTest.length));

    if(window.sideIndexBar){
        _setchipmunkTestSceneIdx(window.sideIndexBar.changeTest(chipmunkTestSceneIdx, 3));
    }

    return new arrayOfChipmunkTest[chipmunkTestSceneIdx]();
}

;

export function restartChipmunkTest() {
    return new arrayOfChipmunkTest[chipmunkTestSceneIdx]();
}

;
