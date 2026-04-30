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
// Mouse test
//
//------------------------------------------------------------------
import { EventTest } from "./event-test.js";
import { s_pathR2 } from "../tests_resources.js";

export class MouseTest extends EventTest {
    init() {
        super.init();
        var sprite = this.sprite = new cc.Sprite(s_pathR2);
        this.addChild(sprite);
        sprite.x = 0;
        sprite.y = 0;
        sprite.scale = 1;
        sprite.color = new cc.Color(Math.random()*200+55, Math.random()*200+55, Math.random()*200+55);

        if( 'mouse' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function(event){
                    var pos = event.getLocation(), target = event.getCurrentTarget();
                    if(event.getButton() === cc.EventMouse.BUTTON_RIGHT)
                        cc.log("onRightMouseDown at: " + pos.x + " " + pos.y );
                    else if(event.getButton() === cc.EventMouse.BUTTON_LEFT)
                        cc.log("onLeftMouseDown at: " + pos.x + " " + pos.y );
                    target.sprite.x = pos.x;
                    target.sprite.y = pos.y;
                },
                onMouseMove: function(event){
                    var pos = event.getLocation(), target = event.getCurrentTarget();
                    cc.log("onMouseMove at: " + pos.x + " " + pos.y );
                    target.sprite.x = pos.x;
                    target.sprite.y = pos.y;
                },
                onMouseUp: function(event){
                    var pos = event.getLocation(), target = event.getCurrentTarget();
                    target.sprite.x = pos.x;
                    target.sprite.y = pos.y;
                    cc.log("onMouseUp at: " + pos.x + " " + pos.y );
                }
            }, this);
        } else {
            cc.log("MOUSE Not supported");
        }
    }
    subtitle() {
        return "Mouse test. Move mouse and see console";
    }

}
