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
import { director } from "../constants";
import { Color, EventListener, Rect, log, ServiceLocator } from "@aspect/core";
import { CallFunc, DelayTime, Sequence } from "@aspect/actions";

export class RemoveAndRetainNodeTest extends EventDispatcherTestDemo {
  constructor() {
    super();
    this._sprite = null;
    this._spriteSaved = false;
  }

  onEnter() {
    //----start6----onEnter
    super.onEnter();

    var origin = director.getVisibleOrigin();
    var size = director.getVisibleSize();

    this._sprite = createColoredView(new Color(0, 255, 255));
    this._sprite.setPosition(
      origin.x + size.width / 2,
      origin.y + size.height / 2
    );
    this.addChild(this._sprite, 10);

    // Make sprite1 touchable
    var listener1 = EventListener.create({
      event: EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: function (touch, event) {
        var target = event.getCurrentTarget();

        var locationInNode = target.convertToNodeSpace(touch);
        var s = target.getContentSize();
        var rect = new Rect(0, 0, s.width, s.height);

        if (Rect.containsPoint(rect, locationInNode)) {
          log(
            "sprite began... x = " +
              locationInNode.x +
              ", y = " +
              locationInNode.y
          );
          target.opacity = 180;
          return true;
        }
        return false;
      },
      onTouchMoved: function (touch, event) {
        var target = event.getCurrentTarget();
        var delta = touch.getDelta();
        target.x += delta.x;
        target.y += delta.y;
      },
      onTouchEnded: function (touch, event) {
        var target = event.getCurrentTarget();
        log("sprite onTouchesEnded.. ");
        target.opacity = 255;
      }
    });
    ServiceLocator.eventManager.addListener(listener1, this._sprite);

    this.runAction(
      new Sequence(
        new DelayTime(5.0),
        new CallFunc(function () {
          this._spriteSaved = true;
          this._sprite.removeFromParent(false);
        }, this),
        new DelayTime(5.0),
        new CallFunc(function () {
          this._spriteSaved = false;
          this.addChild(this._sprite);
          if (!ServiceLocator.sys.isNative)
            ServiceLocator.eventManager.addListener(listener1, this._sprite);
        }, this)
      )
    );
    //----end6----
  }

  onExit() {
    //----start6----onExit
    super.onExit();
    //----end6----
  }

  title() {
    return "RemoveAndRetainNodeTest";
  }

  subtitle() {
    return "Sprite should be removed after 5s, add to scene again after 5s";
  }
}
