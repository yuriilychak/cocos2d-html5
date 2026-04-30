/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

import { EventDispatcherTestDemo } from "./event-dispatcher-test-demo.js";

export class RemoveListenerAfterAddingTest extends EventDispatcherTestDemo {
    onEnter(){
        //----start7----onEnter
        super.onEnter();
        var selfPointer = this;
        var item1 = new cc.MenuItemFont("Click Me 1", function(sender){
            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan: function (touch, event) {
                    cc.assert(false, "Should not come here!");
                    return true;
                }
            });
            cc.eventManager.addListener(listener, -1);
            cc.eventManager.removeListener(listener);
        });
        var vCenter = cc.visibleRect.center;
        item1.setPosition(vCenter.x, vCenter.y + 80);

        var addNextButton = function(){
            var next = new cc.MenuItemFont("Please Click Me To Reset!", function(sender){
                selfPointer.onRestartCallback();
            });
            next.setPosition(vCenter.x, vCenter.y - 40);

            var menu = new cc.Menu(next);
            menu.setPosition(cc.visibleRect.bottomLeft);
            menu.setAnchorPoint(0,0);
            selfPointer.addChild(menu);
        };

        var item2 = new cc.MenuItemFont("Click Me 2", function(sender){
            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan: function(touch, event){
                    cc.assert("Should not come here!");
                    return true;
                }
            });
            cc.eventManager.addListener(listener, -1);
            cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE);
            addNextButton();
        }, this);
        item2.setPosition(vCenter.x, vCenter.y + 40);

        var item3 = new cc.MenuItemFont("Click Me 3", function(sender){
            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan: function(touch, event){
                    cc.assert(false, "Should not come here!");
                    return true;
                }
            });
            cc.eventManager.addListener(listener, -1);
            cc.eventManager.removeAllListeners();
            addNextButton();
        }, this);
        item3.setPosition(cc.visibleRect.center);

        var menu = new cc.Menu(item1, item2, item3);
        menu.setPosition(cc.visibleRect.bottomLeft);
        menu.setAnchorPoint(0, 0);
        this.addChild(menu);
        //----end7----
    }

    title(){
        return "RemoveListenerAfterAddingTest";
    }

    subtitle(){
        return "Should not crash!";
    }

}
