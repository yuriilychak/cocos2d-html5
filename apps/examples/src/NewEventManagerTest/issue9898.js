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
import { Director, EventListener, EventManager, Node } from "@aspect/core";
import { Menu, MenuItemFont } from "@aspect/menus";

export class Issue9898 extends EventDispatcherTestDemo {
  title() {
    return "Issue9898";
  }

  subtitle() {
    return "Should not crash if dispatch event after remove\n event listener in callback";
  }

  constructor() {
    super();
    //----start12----ctor

    var origin = Director.getInstance().getVisibleOrigin();
    var size = Director.getInstance().getVisibleSize();

    var node = new Node();
    this.addChild(node);

    var _listener = EventListener.create({
      event: EventListener.CUSTOM,
      eventName: "Issue9898",
      callback: function (event) {
        EventManager.getInstance().removeListener(_listener);
        event = new cc.EventCustom("Issue9898");
        EventManager.getInstance().dispatchEvent(event);
      }
    });
    EventManager.getInstance().addListener(_listener, 1);
    var menuItem = new MenuItemFont("Dispatch Custom Event1", function (
      sender
    ) {
      var event = new cc.EventCustom("Issue9898");
      EventManager.getInstance().dispatchEvent(event);
    });
    menuItem.setPosition(origin.x + size.width / 2, origin.y + size.height / 2);

    var menu = new Menu(menuItem);
    menu.setPosition(0, 0);
    this.addChild(menu);
    //----end12----
  }
}
