/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
// OneByOne Touches
//
//------------------------------------------------------------------
import { EventTest } from "./event-test.js";
import { s_pathR2 } from "../tests_resources.js";
import { winSize } from "../tests-main-constants.js";

export class TouchOneByOneTest extends EventTest {
    init() {
        super.init();
        this.ids = {};
        this.unused_sprites = [];

        if( 'touches' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.onTouchBegan,
                onTouchMoved: this.onTouchMoved,
                onTouchEnded: this.onTouchEnded,
                onTouchCancelled: this.onTouchCancelled
            }, this);
        } else {
            cc.log("TOUCH-ONE-BY-ONE test is not supported on desktop");
        }

        for( var i=0; i < 5;i++) {
            var sprite = this.sprite = new cc.Sprite(s_pathR2);
            this.addChild(sprite,i+10);
            sprite.x = 0;
            sprite.y = 0;
            sprite.scale = 1;
            sprite.color = new cc.Color( Math.random()*200+55, Math.random()*200+55, Math.random()*200+55 );
            this.unused_sprites.push(sprite);
        }
    }
    subtitle() {
        return "Touches One by One. Touch the left / right and see console";
    }

    new_id( id, pos) {
        var s = this.unused_sprites.pop();
        this.ids[ id ] = s;
        s.x = pos.x;
        s.y = pos.y;
    }
    update_id(id, pos) {
        var s = this.ids[ id ];
        s.x = pos.x;
        s.y = pos.y;
    }
    release_id(id, pos) {
        var s = this.ids[ id ];
        this.ids[ id ] = null;
        this.unused_sprites.push( s );
        s.x = 0;
        s.y = 0;
    }

    onTouchBegan(touch, event) {
        var pos = touch.getLocation();
        var id = touch.getID();
        cc.log("onTouchBegan at: " + pos.x + " " + pos.y + " Id:" + id );
        if( pos.x < winSize.width/2) {
            event.getCurrentTarget().new_id(id,pos);
            return true;
        }
        return false;
    }
    onTouchMoved(touch, event) {
        var pos = touch.getLocation();
        var id = touch.getID();
        cc.log("onTouchMoved at: " + pos.x + " " + pos.y + " Id:" + id );
        event.getCurrentTarget().update_id(id,pos);
    }
    onTouchEnded(touch, event) {
        var pos = touch.getLocation();
        var id = touch.getID();
        cc.log("onTouchEnded at: " + pos.x + " " + pos.y + " Id:" + id );
        event.getCurrentTarget().release_id(id,pos);
    }
    onTouchCancelled(touch, event) {
        var pos = touch.getLocation();
        var id = touch.getID();
        cc.log("onTouchCancelled at: " + pos.x + " " + pos.y + " Id:" + id );
        event.getCurrentTarget().update_id(id,pos);
    }

}
