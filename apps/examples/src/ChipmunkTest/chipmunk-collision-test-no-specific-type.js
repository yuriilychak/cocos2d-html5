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
 // Chipmunk Collision Test
 // Using setDefaultCollisionHandler
 // The default collision handler is invoked for each colliding pair of shapes that isn't explicitly handled by a specific collision handler.
 //
 //------------------------------------------------------------------
export class ChipmunkCollisionTest_no_specific_type extends ChipmunkBaseLayer {
    constructor() {
        super();

        this._title = 'Chipmunk Collision test';
        this._subtitle = 'Using setDefaultCollisionHandler';
    }

    // init physics
    initPhysics() {
        var staticBody = this.space.staticBody;

        // Walls
        var walls = [ new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(winSize.width,0), 0 )               // bottom
            // new cp.SegmentShape( staticBody, cp.v(0,winSize.height), cp.v(winSize.width,winSize.height), 0),    // top
            // new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(0,winSize.height), 0),             // left
            // new cp.SegmentShape( staticBody, cp.v(winSize.width,0), cp.v(winSize.width,winSize.height), 0)  // right
        ];
        for( var i=0; i < walls.length; i++ ) {
            var wall = walls[i];
            wall.setElasticity(1);
            wall.setFriction(1);
            this.space.addStaticShape( wall );
        }

        // Gravity:
        // testing properties
        this.space.gravity = cp.v(0,-100);
        this.space.iterations = 15;
    }

    createPhysicsSprite( pos, file ) {
        var body = new cp.Body(1, cp.momentForBox(1, 48, 108) );
        body.setPos(pos);
        this.space.addBody(body);
        var shape = new cp.BoxShape( body, 48, 108);
        shape.setElasticity( 0.5 );
        shape.setFriction( 0.5 );
        this.space.addShape( shape );

        var sprite = new cc.PhysicsSprite(file);
        sprite.setBody( body );
        return sprite;
    }

    onEnter() {
        super.onEnter();

        this.initPhysics();
        this.scheduleUpdate();

        var sprite1 = this.createPhysicsSprite( new cc.Point(winSize.width/2, winSize.height-20), s_pathGrossini);
        this.addChild( sprite1 );

        this.space.setDefaultCollisionHandler(
            this.collisionBegin.bind(this),
            this.collisionPre.bind(this),
            this.collisionPost.bind(this),
            this.collisionSeparate.bind(this)
        );
    }

    onExit() {
        super.onExit();
    }

    update( delta ) {
        this.space.step( delta );
    }

    collisionBegin( arbiter, space ) {
        cc.log('collision begin');
        return true;
    }

    collisionPre( arbiter, space ) {
        cc.log('collision pre');
        return true;
    }

    collisionPost( arbiter, space ) {
        cc.log('collision post');
    }

    collisionSeparate( arbiter, space ) {
        cc.log('collision separate');
    }

}
