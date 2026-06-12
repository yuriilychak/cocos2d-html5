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
import { s_simpleFont_fnt } from "../resources";
import { director } from "../constants";
import { Color, EventListener, Rect, ServiceLocator } from "@aspect/core";
import { TextBMFont } from "@aspect/ccui";
import { ButtonLayout } from "../button-layout";

export class RemoveListenerWhenDispatching extends EventDispatcherTestDemo {
  onEnter() {
    //----start2----onEnter
    super.onEnter();

    var origin = director.getVisibleOrigin();
    var size = director.getVisibleSize();

    var sprite1 = createColoredView(new Color(0, 255, 255));
    sprite1.setPosition(origin.x + size.width / 2, origin.y + size.height / 2);
    this.addChild(sprite1, 10);

    // Make sprite1 touchable
    var listener1 = EventListener.create({
      event: EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: function (touch, event) {
        var locationInNode = sprite1.convertToNodeSpace(touch.getLocation());
        var s = sprite1.getContentSize();
        var rect = new Rect(0, 0, s.width, s.height);

        if (Rect.containsPoint(rect, locationInNode)) {
          sprite1.color = Color.RED;
          return true;
        }
        return false;
      },
      onTouchEnded: function (touch, event) {
        sprite1.color = Color.WHITE;
      }
    });
    this.setUserObject(listener1);

    ServiceLocator.eventManager.addListener(listener1, sprite1);

    var statusLabel = new TextBMFont("The sprite could be touched!", s_simpleFont_fnt);
    statusLabel.setPosition(
      origin.x + size.width / 2,
      origin.y + size.height - 90
    );
    this.addChild(statusLabel);

    var enable = true;

    const layout = new ButtonLayout(
      [{ label: "Enabled", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) }],
      196,
      "Touch",
      () => {
        if (enable) {
          ServiceLocator.eventManager.removeListener(listener1);
          statusLabel.string = "The sprite could not be touched!";
          layout.setLabelText(0, "Disabled");
          enable = false;
        } else {
          ServiceLocator.eventManager.addListener(listener1, sprite1);
          statusLabel.string = "The sprite could be touched!";
          layout.setLabelText(0, "Enabled");
          enable = true;
        }
      }
    );
    this.addChild(layout, 1);
    //----end2----
  }

  title() {
    return "Add and remove listener\n when dispatching event";
  }

  subtitle() {
    return "";
  }
}
