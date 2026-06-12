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
import { createColoredView } from "./touchable-sprite";
import { Color, EventListener, Rect, log, visibleRect, ServiceLocator } from "@aspect/core";

export class StopPropagationTest extends EventDispatcherTestDemo {
  constructor() {
    //----start9----ctor
    super();

    var touchOneByOneListener = EventListener.create({
      event: EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: function (touch, event) {
        // Skip if don't touch top half screen.
        if (!this._isPointInTopHalfAreaOfScreen(touch.getLocation()))
          return false;

        var target = event.getCurrentTarget();
        if (target.tag != StopPropagationTest._TAG_BLUE_SPRITE)
          log("Yellow blocks shouldn't response event.");

        if (this._isPointInNode(touch.getLocation(), target)) {
          target.opacity = 180;
          return true;
        }

        // Stop propagation, so yellow blocks will not be able to receive event.
        event.stopPropagation();
        return false;
      }.bind(this),
      onTouchEnded: function (touch, event) {
        event.getCurrentTarget().opacity = 255;
      }
    });

    var touchAllAtOnceListener = EventListener.create({
      event: EventListener.TOUCH_ALL_AT_ONCE,
      onTouchesBegan: function (touches, event) {
        // Skip if don't touch top half screen.
        if (this._isPointInTopHalfAreaOfScreen(touches[0].getLocation()))
          return;

        var target = event.getCurrentTarget();
        if (target.tag != StopPropagationTest._TAG_BLUE_SPRITE2)
          log("Yellow blocks shouldn't response event.");

        if (this._isPointInNode(touches[0].getLocation(), target))
          target.opacity = 180;
        // Stop propagation, so yellow blocks will not be able to receive event.
        event.stopPropagation();
      }.bind(this),
      onTouchesEnded: function (touches, event) {
        // Skip if don't touch top half screen.
        if (this._isPointInTopHalfAreaOfScreen(touches[0].getLocation()))
          return;

        var target = event.getCurrentTarget();
        if (target.tag != StopPropagationTest._TAG_BLUE_SPRITE2)
          log("Yellow blocks shouldn't response event.");

        if (this._isPointInNode(touches[0].getLocation(), target))
          target.opacity = 255;
        // Stop propagation, so yellow blocks will not be able to receive event.
        event.stopPropagation();
      }.bind(this)
    });

    var keyboardEventListener = EventListener.create({
      event: EventListener.KEYBOARD,
      onKeyPressed: function (key, event) {
        var target = event.getCurrentTarget();
        if (
          !(
            target.tag == StopPropagationTest._TAG_BLUE_SPRITE ||
            target.tag == StopPropagationTest._TAG_BLUE_SPRITE2
          )
        ) {
          log("Yellow blocks shouldn't response event.");
        }
        // Stop propagation, so yellow blocks will not be able to receive event.
        event.stopPropagation();
      }
    });

    var SPRITE_COUNT = 8,
      sprite1,
      sprite2;

    for (var i = 0; i < SPRITE_COUNT; i++) {
      if (i == 4) {
        sprite1 = createColoredView(new Color(0, 255, 255));
        sprite1.tag = StopPropagationTest._TAG_BLUE_SPRITE;
        this.addChild(sprite1, 100);

        sprite2 = createColoredView(new Color(0, 255, 255));
        sprite2.tag = StopPropagationTest._TAG_BLUE_SPRITE2;
        this.addChild(sprite2, 100);
      } else {
        sprite1 = createColoredView(new Color(255, 255, 0));
        this.addChild(sprite1, 0);
        sprite2 = createColoredView(new Color(255, 255, 0));
        this.addChild(sprite2, 0);
      }

      ServiceLocator.eventManager.addListener(touchOneByOneListener.clone(), sprite1);
      ServiceLocator.eventManager.addListener(keyboardEventListener.clone(), sprite1);

      ServiceLocator.eventManager.addListener(touchAllAtOnceListener.clone(), sprite2);
      ServiceLocator.eventManager.addListener(keyboardEventListener.clone(), sprite2);

      var visibleSize = ServiceLocator.director.getVisibleSize();
      sprite1.x =
        visibleRect.left.x + (visibleSize.width / (SPRITE_COUNT - 1)) * i;
      sprite1.y =
        visibleRect.center.y + sprite2.getContentSize().height / 2 + 10;
      sprite2.x =
        visibleRect.left.x + (visibleSize.width / (SPRITE_COUNT - 1)) * i;
      sprite2.y =
        visibleRect.center.y - sprite2.getContentSize().height / 2 - 10;
    }
    //----end9----
  }

  _isPointInNode(pt, node) {
    //----start9----_isPointInNode
    var s = node.getContentSize();
    return Rect.containsPoint(
      new Rect(0, 0, s.width, s.height),
      node.convertToNodeSpace(pt)
    );
    //----end9----
  }

  _isPointInTopHalfAreaOfScreen(pt) {
    //----start9----_isPointInTopHalfAreaOfScreen
    var winSize = ServiceLocator.director.getWinSize();
    return pt.y >= winSize.height / 2;
    //----end9----
  }

  title() {
    return "Stop Propagation Test";
  }

  subtitle() {
    return "Shouldn't crash and only blue block could be clicked";
  }
}
