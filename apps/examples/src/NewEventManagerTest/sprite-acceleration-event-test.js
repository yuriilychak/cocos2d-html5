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
import { director } from "../constants";
import { EventListener, EventListenerType, Sprite, log, ServiceLocator } from "@aspect/core";
export class SpriteAccelerationEventTest extends EventDispatcherTestDemo {
  onEnter() {
    //----start5----onEnter
    super.onEnter();

    var origin = director.getVisibleOrigin();
    var size = director.getVisibleSize();

    ServiceLocator.inputManager.setAccelerometerEnabled(true);

    var sprite = new Sprite("Images/ball.png");
    sprite.setPosition(origin.x + size.width / 2, origin.y + size.height / 2);
    this.addChild(sprite);

    ServiceLocator.eventManager.addListener(
      {
        event: EventListenerType.ACCELERATION,
        callback: function (accumulator, event) {
          var target = event.getCurrentTarget();
          var ballSize = target.getContentSize();
          var ptNow = target.getPosition();

          target.x = SpriteAccelerationEventTest._fix_pos(
            ptNow.x + accumulator.x * 9.81,
            ServiceLocator.eglView.visibleRect.left.x + ballSize.width / 2.0,
            ServiceLocator.eglView.visibleRect.right.x - ballSize.width / 2.0
          );
          target.y = SpriteAccelerationEventTest._fix_pos(
            ptNow.y + accumulator.y * 9.81,
            ServiceLocator.eglView.visibleRect.bottom.y + ballSize.height / 2.0,
            ServiceLocator.eglView.visibleRect.top.y - ballSize.height / 2.0
          );
        }
      },
      sprite
    );
    //----end5----
  }

  onExit() {
    //----start5----onEnter
    ServiceLocator.inputManager.setAccelerometerEnabled(false);
    super.onExit();
    //----end----
  }

  title() {
    return "Sprite Receives Acceleration Event";
  }

  subtitle() {
    return "Please move your device\n(Only available on mobile)";
  }
}
