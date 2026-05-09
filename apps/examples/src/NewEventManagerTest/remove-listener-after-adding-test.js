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
import { Color, EventListener, EventManager, assert } from "@aspect/core";
import { ButtonLayout } from "../button-layout";

export class RemoveListenerAfterAddingTest extends EventDispatcherTestDemo {
  onEnter() {
    //----start7----onEnter
    super.onEnter();

    const layout = new ButtonLayout(
      [
        { label: "Click Me 1", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Click Me 2", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Click Me 3", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Please Click Me To Reset!", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) }
      ],
      196,
      "Listeners",
      (i) => {
        switch (i) {
          case 0: {
            var listener = EventListener.create({
              event: EventListener.TOUCH_ONE_BY_ONE,
              onTouchBegan: function (touch, event) {
                assert(false, "Should not come here!");
                return true;
              }
            });
            EventManager.getInstance().addListener(listener, -1);
            EventManager.getInstance().removeListener(listener);
            break;
          }
          case 1: {
            var listener = EventListener.create({
              event: EventListener.TOUCH_ONE_BY_ONE,
              onTouchBegan: function (touch, event) {
                assert("Should not come here!");
                return true;
              }
            });
            EventManager.getInstance().addListener(listener, -1);
            EventManager.getInstance().removeListeners(EventListener.TOUCH_ONE_BY_ONE);
            layout.showButton(3);
            break;
          }
          case 2: {
            var listener = EventListener.create({
              event: EventListener.TOUCH_ONE_BY_ONE,
              onTouchBegan: function (touch, event) {
                assert(false, "Should not come here!");
                return true;
              }
            });
            EventManager.getInstance().addListener(listener, -1);
            EventManager.getInstance().removeAllListeners();
            layout.showButton(3);
            break;
          }
          case 3:
            this.onRestartCallback();
            break;
        }
      }
    );
    layout.hideButton(3);
    this.addChild(layout);
    //----end7----
  }

  title() {
    return "RemoveListenerAfterAddingTest";
  }

  subtitle() {
    return "Should not crash!";
  }
}
