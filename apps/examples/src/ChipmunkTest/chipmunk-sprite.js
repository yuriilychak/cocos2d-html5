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
// Chipmunk + Sprite
//
//------------------------------------------------------------------
export class ChipmunkSprite extends ChipmunkBaseLayer {

    constructor() {
        super();
        //cc.base(this);

        this.addSprite = function( pos ) {
            var sprite =  this.createPhysicsSprite( pos );
            var child = new cc.Sprite(s_pathSister1);
            child.attr({
                scale: 0.4,
                anchorX: 0,
                anchorY: 0,
                x: sprite.width/2,
                y: sprite.height/2
            });
            sprite.addChild(child);
            this.addChild( sprite );
        };

        this._title = 'Chipmunk Sprite Test';
        this._subtitle = 'Chipmunk + cocos2d sprites tests. Tap screen.';

        this.initPhysics();
    }

    title(){
        return 'Chipmunk Sprite Test';
    }

    initPhysics() {
        var space = this.space ;
        var staticBody = space.staticBody;

        // Walls
        var walls = [ new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(winSize.width,0), 0 ),               // bottom
            new cp.SegmentShape( staticBody, cp.v(0,winSize.height), cp.v(winSize.width,winSize.height), 0),    // top
            new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(0,winSize.height), 0),             // left
            new cp.SegmentShape( staticBody, cp.v(winSize.width,0), cp.v(winSize.width,winSize.height), 0)  // right
        ];
        for( var i=0; i < walls.length; i++ ) {
            var shape = walls[i];
            shape.setElasticity(1);
            shape.setFriction(1);
            space.addStaticShape( shape );
        }

        // Gravity
        space.gravity = cp.v(0, -100);
    }

    createPhysicsSprite( pos ) {
        var body = new cp.Body(1, cp.momentForBox(1, 48, 108) );
        body.setPos( pos );
        this.space.addBody( body );
        var shape = new cp.BoxShape( body, 48, 108);
        shape.setElasticity( 0.5 );
        shape.setFriction( 0.5 );
        this.space.addShape( shape );

        var sprite = new cc.PhysicsSprite(s_pathGrossini);
        sprite.setBody( body );
        return sprite;
    }

    onEnter() {
        super.onEnter();
        //cc.base(this, 'onEnter');

        this.scheduleUpdate();
        for(var i=0; i<10; i++) {
            var variancex = cc.randomMinus1To1() * 5;
            var variancey = cc.randomMinus1To1() * 5;
            this.addSprite( cp.v(winSize.width/2 + variancex, winSize.height/2 + variancey) );
        }

        if( 'touches' in cc.sys.capabilities ){
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesEnded: function(touches, event){
                    var l = touches.length, target = event.getCurrentTarget();
                    for( var i=0; i < l; i++) {
                        target.addSprite( touches[i].getLocation() );
                    }
                }
            }, this);
        } else if( 'mouse' in cc.sys.capabilities )
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function(event){
                    event.getCurrentTarget().addSprite(event.getLocation());
                }
            }, this);
    }

    update( delta ) {
        this.space.step( delta );
    }

}
