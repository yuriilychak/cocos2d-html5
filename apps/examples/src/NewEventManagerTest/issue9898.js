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
import { Color, EventCustom, EventListener, EventManager, Node } from "@aspect/core";
import { ButtonLayout } from "../button-layout";

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

    var node = new Node();
    this.addChild(node);

    var _listener = EventListener.create({
      event: EventListener.CUSTOM,
      eventName: "Issue9898",
      callback: function (event) {
        EventManager.getInstance().removeListener(_listener);
        event = new EventCustom("Issue9898");
        EventManager.getInstance().dispatchEvent(event);
      }
    });
    EventManager.getInstance().addListener(_listener, 1);

    const layout = new ButtonLayout(
      [{ label: "Dispatch Custom Event1", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) }],
      196,
      "Actions",
      () => {
        var event = new EventCustom("Issue9898");
        EventManager.getInstance().dispatchEvent(event);
      }
    );
    this.addChild(layout);
    //----end12----
  }
}
