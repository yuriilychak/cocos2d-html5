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
import { Color, EventListener, EventManager, Node, Rect, Sprite, log } from "@aspect/core";
import { ButtonLayout } from "../button-layout";

export class TouchableSpriteTest extends EventDispatcherTestDemo {
  onEnter() {
    //----start0----onEnter
    super.onEnter();

    var origin = director.getVisibleOrigin();
    var size = director.getVisibleSize();

    var containerForSprite1 = new Node();
    var sprite1 = new Sprite("Images/CyanSquare.png");
    sprite1.setPosition(
      origin.x + size.width / 2 - 80,
      origin.y + size.height / 2 + 80
    );
    containerForSprite1.addChild(sprite1);
    this.addChild(containerForSprite1, 10);

    var sprite2 = new Sprite("Images/MagentaSquare.png");
    sprite2.setPosition(origin.x + size.width / 2, origin.y + size.height / 2);
    this.addChild(sprite2, 20);

    var sprite3 = new Sprite("Images/YellowSquare.png");
    sprite3.setPosition(0, 0);
    sprite2.addChild(sprite3, 1);

    // Make sprite1 touchable
    var listener1 = EventListener.create({
      event: EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: function (touch, event) {
        var target = event.getCurrentTarget();

        var locationInNode = target.convertToNodeSpace(touch.getLocation());
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
        target.setOpacity(255);
        if (target == sprite2) {
          containerForSprite1.setLocalZOrder(100);
        } else if (target == sprite1) {
          containerForSprite1.setLocalZOrder(0);
        }
      }
    });

    EventManager.getInstance().addListener(listener1, sprite1);
    EventManager.getInstance().addListener(listener1.clone(), sprite2);
    EventManager.getInstance().addListener(listener1.clone(), sprite3);

    const layout = new ButtonLayout(
      [
        { label: "Remove All Touch Listeners", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Next", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) }
      ],
      196,
      "Actions",
      (i) => {
        switch (i) {
          case 0:
            layout.setLabelText(0, "Only Next item could be clicked");
            EventManager.getInstance().removeListeners(EventListener.TOUCH_ONE_BY_ONE);
            layout.showButton(1);
            break;
          case 1:
            this.onNextCallback();
            break;
        }
      }
    );
    layout.hideButton(1);
    this.addChild(layout);
    //----end0----
  }

  title() {
    return "Touchable Sprite Test";
  }

  subtitle() {
    return "Please drag the blocks";
  }
}
