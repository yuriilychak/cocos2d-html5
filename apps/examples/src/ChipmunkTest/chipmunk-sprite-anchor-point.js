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
// Test Anchor Point with PhysicsSprite
//
//------------------------------------------------------------------
import { ChipmunkBaseLayer } from "./chipmunk-base-layer.js";
import { v } from "./chipmunk-test-helpers.js";
import { s_pathGrossini } from "../tests_resources.js";
import { winSize } from "../tests-main-constants.js";

export class ChipmunkSpriteAnchorPoint extends ChipmunkBaseLayer {

    constructor() {
        super();
        // cc.base(this);

        this._title = 'AnchorPoint in PhysicsSprite';
        this._subtitle = 'Tests AnchorPoint in PhysicsSprite. See animated sprites';
    }

    onEnter() {
        super.onEnter();
        // cc.base(this, 'onEnter');

        this._debugNode.visible = true ;

        this.space.gravity = v(0, 0);

        var sprite1 = this.createPhysicsSprite( cp.v(winSize.width/4*1, winSize.height/2) );
        var sprite2 = this.createPhysicsSprite( cp.v(winSize.width/4*2, winSize.height/2) );
        var sprite3 = this.createPhysicsSprite( cp.v(winSize.width/4*3, winSize.height/2) );

        sprite1.anchorX = 0;
        sprite1.anchorY = 0;
        sprite2.anchorX = 0.5;
        sprite2.anchorY = 0.5;
        sprite3.anchorX = 1;
        sprite3.anchorY = 1;

        // scale sprite
        var scaledown = new cc.ScaleBy(0.5, 0.5);
        var scaleup = scaledown.reverse();
        var seq = cc.sequence( scaledown, scaleup);
        var repeat = seq.repeatForever();

        sprite1.runAction( repeat );
        sprite2.runAction( repeat.clone() );
        sprite3.runAction( repeat.clone() );

        this.addChild(sprite1);
        this.addChild(sprite2);
        this.addChild(sprite3);

        this.scheduleUpdate();
    }

    title(){
        return 'AnchorPoint in PhysicsSprite';
    }

    createPhysicsSprite(pos) {

        // create body
        var body = new cp.Body(1, cp.momentForBox(1, 48, 108) );
        body.setPos( pos );
        this.space.addBody( body );

        // create shape
        var shape = new cp.BoxShape( body, 48, 108);
        shape.setElasticity( 0.5 );
        shape.setFriction( 0.5 );
        this.space.addShape( shape );

        // create sprite
        var sprite = new cc.PhysicsSprite(s_pathGrossini);

        // associate sprite with body
        sprite.setBody( body );

        return sprite;
    }

    update(dt) {
        var steps = 1;
        dt /= steps;
        for (var i = 0; i < steps; i++){
            this.space.step(dt);
        }
    }

}
