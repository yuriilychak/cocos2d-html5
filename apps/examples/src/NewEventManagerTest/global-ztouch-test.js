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

import { EventDispatcherTestDemo } from "./event-dispatcher-test-demo";
import { Rect } from "@aspect/core";

export class GlobalZTouchTest extends EventDispatcherTestDemo {
  constructor() {
    super();

    this._sprite = null;

    this._accum = null;

    var listener = cc.EventListener.create({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: function (touch, event) {
        var target = event.getCurrentTarget();

        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = new Rect(0, 0, s.width, s.height);

        if (Rect.containsPoint(rect, locationInNode)) {
          cc.log(
            "sprite began... x = %f, y = %f",
            locationInNode.x,
            locationInNode.y
          );
          target.setOpacity(180);
          return true;
        }
        return false;
      },
      onTouchMoved: function (touch, event) {
        var target = event.getCurrentTarget(),
          delta = touch.getDelta();
        target.x += delta.x;
        target.y += delta.y;
      },
      onTouchEnded: function (touch, event) {
        cc.log("sprite onTouchesEnded.. ");
        event.getCurrentTarget().setOpacity(255);
      }
    });

    var SPRITE_COUNT = 8,
      sprite;
    for (var i = 0; i < SPRITE_COUNT; i++) {
      if (i == 4) {
        sprite = new cc.Sprite("Images/CyanSquare.png");
        this._sprite = sprite;
        this._sprite.setGlobalZOrder(-1);
      } else sprite = new cc.Sprite("Images/YellowSquare.png");

      cc.eventManager.addListener(listener.clone(), sprite);
      this.addChild(sprite);

      var visibleSize = cc.director.getVisibleSize();
      sprite.x =
        cc.visibleRect.left.x + (visibleSize.width / (SPRITE_COUNT - 1)) * i;
      sprite.y = cc.visibleRect.center.y;
    }

    this.scheduleUpdate();
  }

  update(dt) {
    this._accum += dt;
    if (this._accum > 2.0) {
      var z = this._sprite.getGlobalZOrder();
      this._sprite.setGlobalZOrder(-z);
      this._accum = 0;
    }
  }

  title() {
    return "Global Z Value, Try touch blue sprite";
  }

  subtitle() {
    return "Blue Sprite should change go from foreground to background";
  }
}
