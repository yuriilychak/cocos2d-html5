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
import { EventTest } from "./event-test";
import { s_pathR2 } from "../resources";
import { Color, EventListener, EventListenerType, EventMouse, Sprite, log, ServiceLocator, MouseButton } from "@aspect/core";

export class MouseTest extends EventTest {
  init() {
    super.init();
    var sprite = (this.sprite = new Sprite(s_pathR2));
    this.addChild(sprite);
    sprite.x = 0;
    sprite.y = 0;
    sprite.scale = 1;
    sprite.color = new Color(
      Math.random() * 200 + 55,
      Math.random() * 200 + 55,
      Math.random() * 200 + 55
    );

    if ("mouse" in ServiceLocator.sys.capabilities) {
      ServiceLocator.eventManager.addListener(
        {
          event: EventListenerType.MOUSE,
          onMouseDown: function (event) {
            var target = event.getCurrentTarget();
            if (event.button === MouseButton.RIGHT)
              log("onRightMouseDown at: " + event.x + " " + event.y);
            else if (event.button === BUTTON_LEFT.LEFT)
              log("onLeftMouseDown at: " + event.x + " " + event.y);
            target.sprite.x = event.x;
            target.sprite.y = event.y;
          },
          onMouseMove: function (event) {
            var target = event.getCurrentTarget();
            log("onMouseMove at: " + event.x + " " + event.y);
            target.sprite.x = event.x;
            target.sprite.y = event.y;
          },
          onMouseUp: function (event) {
            var target = event.getCurrentTarget();
            target.sprite.x = event.x;
            target.sprite.y = event.y;
            log("onMouseUp at: " + event.x + " " + event.y);
          }
        },
        this
      );
    } else {
      log("MOUSE Not supported");
    }
  }
  subtitle() {
    return "Mouse test. Move mouse and see console";
  }
}
