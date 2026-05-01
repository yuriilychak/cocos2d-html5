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
      size = director.getVisibleSize(),
      selfPointer = this;

    cc.MenuItemFont.setFontSize(20);

    var statusLabel = new cc.LabelTTF("No custom event 1 received!", "", 20);
    statusLabel.setPosition(
      origin.x + size.width / 2,
      origin.y + size.height - 90
    );
    this.addChild(statusLabel);

    this._listener1 = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      eventName: "game_custom_event1",
      callback: function (event) {
        statusLabel.setString(
          "Custom event 1 received, " + event.getUserData() + " times"
        );
      }
    });
    cc.eventManager.addListener(this._listener1, 1);

    var sendItem = new cc.MenuItemFont("Send Custom Event 1", function (
      sender
    ) {
      ++selfPointer._item1Count;
      var event = new cc.EventCustom("game_custom_event1");
      event.setUserData(selfPointer._item1Count.toString());
      cc.eventManager.dispatchEvent(event);
    });
    sendItem.setPosition(origin.x + size.width / 2, origin.y + size.height / 2);

    var statusLabel2 = new cc.LabelTTF("No custom event 2 received!", "", 20);
    statusLabel2.setPosition(
      origin.x + size.width / 2,
      origin.y + size.height - 120
    );
    this.addChild(statusLabel2);

    this._listener2 = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      eventName: "game_custom_event2",
      callback: function (event) {
        statusLabel2.setString(
          "Custom event 2 received, " + event.getUserData() + " times"
        );
      }
    });

    cc.eventManager.addListener(this._listener2, 1);
    var sendItem2 = new cc.MenuItemFont("Send Custom Event 2", function (
      sender
    ) {
      ++selfPointer._item2Count;
      var event = new cc.EventCustom("game_custom_event2");
      event.setUserData(selfPointer._item2Count.toString());
      cc.eventManager.dispatchEvent(event);
    });
    sendItem2.setPosition(
      origin.x + size.width / 2,
      origin.x + size.height / 2 - 40
    );

    var menu = new cc.Menu(sendItem, sendItem2);
    menu.setPosition(0, 0);
    menu.setAnchorPoint(0, 0);
    this.addChild(menu, 1);
    //----end3----
  }

  onExit() {
    //----start3----onExit
    cc.eventManager.removeListener(this._listener1);
    cc.eventManager.removeListener(this._listener2);
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
