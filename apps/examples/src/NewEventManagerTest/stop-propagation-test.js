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

export class StopPropagationTest extends EventDispatcherTestDemo {
    constructor(){
        //----start9----ctor
        super();

        var touchOneByOneListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan: function(touch, event){
                // Skip if don't touch top half screen.
                if (!this._isPointInTopHalfAreaOfScreen(touch.getLocation()))
                    return false;

                var target = event.getCurrentTarget();
                if(target.getTag() != StopPropagationTest._TAG_BLUE_SPRITE)
                    cc.log("Yellow blocks shouldn't response event.");

                if (this._isPointInNode(touch.getLocation(), target)) {
                    target.setOpacity(180);
                    return true;
                }

                // Stop propagation, so yellow blocks will not be able to receive event.
                event.stopPropagation();
                return false;
            }.bind(this),
            onTouchEnded: function(touch, event){
                event.getCurrentTarget().setOpacity(255);
            }
        });

        var touchAllAtOnceListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function(touches, event){
                // Skip if don't touch top half screen.
                if (this._isPointInTopHalfAreaOfScreen(touches[0].getLocation()))
                    return;

                var target = event.getCurrentTarget();
                if(target.getTag() != StopPropagationTest._TAG_BLUE_SPRITE2)
                    cc.log("Yellow blocks shouldn't response event.");

                if (this._isPointInNode(touches[0].getLocation(), target))
                    target.setOpacity(180);
                // Stop propagation, so yellow blocks will not be able to receive event.
                event.stopPropagation();
            }.bind(this),
            onTouchesEnded: function(touches, event){
                // Skip if don't touch top half screen.
                if (this._isPointInTopHalfAreaOfScreen(touches[0].getLocation()))
                    return;

                var target = event.getCurrentTarget();
                if(target.getTag() != StopPropagationTest._TAG_BLUE_SPRITE2)
                    cc.log("Yellow blocks shouldn't response event.");

                if (this._isPointInNode(touches[0].getLocation(), target))
                    target.setOpacity(255);
                // Stop propagation, so yellow blocks will not be able to receive event.
                event.stopPropagation();
            }.bind(this)
        });

        var keyboardEventListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(key, event){
                var target = event.getCurrentTarget();
                if(!(target.getTag() == StopPropagationTest._TAG_BLUE_SPRITE || target.getTag() == StopPropagationTest._TAG_BLUE_SPRITE2)){
                    cc.log("Yellow blocks shouldn't response event.");
                }
                // Stop propagation, so yellow blocks will not be able to receive event.
                event.stopPropagation();
            }
        });

        var SPRITE_COUNT = 8, sprite1, sprite2;

        for (var i = 0; i < SPRITE_COUNT; i++) {
            if(i==4) {
                sprite1 = new cc.Sprite("Images/CyanSquare.png");
                sprite1.setTag(StopPropagationTest._TAG_BLUE_SPRITE);
                this.addChild(sprite1, 100);

                sprite2 = new cc.Sprite("Images/CyanSquare.png");
                sprite2.setTag(StopPropagationTest._TAG_BLUE_SPRITE2);
                this.addChild(sprite2, 100);
            } else {
                sprite1 = new cc.Sprite("Images/YellowSquare.png");
                this.addChild(sprite1, 0);
                sprite2 = new cc.Sprite("Images/YellowSquare.png");
                this.addChild(sprite2, 0);
            }


            cc.eventManager.addListener(touchOneByOneListener.clone(), sprite1);
            cc.eventManager.addListener(keyboardEventListener.clone(), sprite1);

            cc.eventManager.addListener(touchAllAtOnceListener.clone(), sprite2);
            cc.eventManager.addListener(keyboardEventListener.clone(), sprite2);


            var visibleSize = cc.director.getVisibleSize();
            sprite1.x = cc.visibleRect.left.x + visibleSize.width / (SPRITE_COUNT - 1) * i;
            sprite1.y = cc.visibleRect.center.y + sprite2.getContentSize().height / 2 + 10;
            sprite2.x = cc.visibleRect.left.x + visibleSize.width / (SPRITE_COUNT - 1) * i;
            sprite2.y = cc.visibleRect.center.y - sprite2.getContentSize().height / 2 - 10;
        }
        //----end9----
    }

    _isPointInNode(pt, node) {
        //----start9----_isPointInNode
        var s = node.getContentSize();
        return cc.Rect.containsPoint(new cc.Rect(0, 0, s.width, s.height), node.convertToNodeSpace(pt));
        //----end9----
    }

    _isPointInTopHalfAreaOfScreen(pt){
        //----start9----_isPointInTopHalfAreaOfScreen
        var winSize = cc.director.getWinSize();
        return (pt.y >= winSize.height/2);
        //----end9----
    }

    title(){
        return "Stop Propagation Test";
    }

    subtitle() {
        return "Shouldn't crash and only blue block could be clicked";
    }

}
