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
import { s_simpleFont_fnt } from "../resources";
import { director } from "../constants";
import { Color, EventCustom, EventListener, ServiceLocator } from "@aspect/core";
import { TextBMFont } from "@aspect/ccui";
import { ButtonLayout } from "../button-layout";

export class CustomEventTest extends EventDispatcherTestDemo {
  constructor() {
    super();
    this._listener1 = null;
    this._listener2 = null;
    this._item1Count = 0;
    this._item2Count = 0;
  }

  onEnter() {
    //----start3----onEnter
    super.onEnter();

    var origin = director.getVisibleOrigin(),
      size = director.getVisibleSize();

    var statusLabel = new TextBMFont("No custom event 1 received!", s_simpleFont_fnt);
    statusLabel.setPosition(
      origin.x + size.width / 2,
      origin.y + size.height - 90
    );
    this.addChild(statusLabel);

    this._listener1 = EventListener.create({
      event: EventListener.CUSTOM,
      eventName: "game_custom_event1",
      callback: function (event) {
        statusLabel.string = "Custom event 1 received, " + event.getUserData() + " times";
      }
    });
    ServiceLocator.eventManager.addListener(this._listener1, 1);

    var statusLabel2 = new TextBMFont("No custom event 2 received!", s_simpleFont_fnt);
    statusLabel2.setPosition(
      origin.x + size.width / 2,
      origin.y + size.height - 120
    );
    this.addChild(statusLabel2);

    this._listener2 = EventListener.create({
      event: EventListener.CUSTOM,
      eventName: "game_custom_event2",
      callback: function (event) {
        statusLabel2.string = "Custom event 2 received, " + event.getUserData() + " times";
      }
    });
    ServiceLocator.eventManager.addListener(this._listener2, 1);

    const layout = new ButtonLayout(
      [
        { label: "Send Custom Event 1", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Send Custom Event 2", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) }
      ],
      196,
      "Events",
      (i) => {
        switch (i) {
          case 0: {
            const event = new EventCustom("game_custom_event1");
            event.setUserData((++this._item1Count).toString());
            ServiceLocator.eventManager.dispatchEvent(event);
            break;
          }
          case 1: {
            const event = new EventCustom("game_custom_event2");
            event.setUserData((++this._item2Count).toString());
            ServiceLocator.eventManager.dispatchEvent(event);
            break;
          }
        }
      }
    );
    this.addChild(layout, 1);
    //----end3----
  }

  onExit() {
    //----start3----onExit
    ServiceLocator.eventManager.removeListener(this._listener1);
    ServiceLocator.eventManager.removeListener(this._listener2);
    super.onExit();
    //----end3----
  }

  title() {
    return "Send custom event";
  }

  subtitle() {
    return "";
  }
}
