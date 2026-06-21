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

import { SysTestBase } from "./sys-test-base";
import { s_simpleFont_fnt } from "../resources";
import { EventListener, EventListenerType, ServiceLocator } from "@aspect/core";
import { TextBMFont } from "@aspect/ccui";
import { winSize } from "../constants";

export class OpenURLTest extends SysTestBase {
  getTitle() {
    return "Open URL Test";
  }

  constructor() {
    super();

    var label = new TextBMFont(
      "Touch the screen to open\nthe cocos2d-x home page",
      s_simpleFont_fnt
    );
    this.addChild(label);
    label.setPosition(winSize.width / 2, winSize.height / 2);

    ServiceLocator.eventManager.addListener(
      {
        event: EventListenerType.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function () {
          return true;
        },
        onTouchEnded: function () {
          ServiceLocator.sys.openURL("http://www.cocos2d-x.org/");
        }
      },
      this
    );
  }
}
