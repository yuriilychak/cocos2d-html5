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
import { EventListener, KEY, ServiceLocator } from "@aspect/core";
import { TextBMFont } from "@aspect/ccui";
export class LabelKeyboardEventTest extends EventDispatcherTestDemo {
  onEnter() {
    //----start4----onEnter
    super.onEnter();

    var origin = director.getVisibleOrigin();
    var size = director.getVisibleSize();

    var statusLabel = new TextBMFont("No keyboard event received!", s_simpleFont_fnt);
    statusLabel.setPosition(
      origin.x + size.width / 2,
      origin.x + size.height / 2
    );
    this.addChild(statusLabel);

    var that = this;
    ServiceLocator.eventManager.addListener(
      {
        event: EventListener.KEYBOARD,
        onKeyPressed: function (keyCode, event) {
          var label = event.getCurrentTarget();
          label.string = "Key " +
              (ServiceLocator.sys.isNative
                ? that.getNativeKeyName(keyCode)
                : String.fromCharCode(keyCode)) +
              "(" +
              keyCode.toString() +
              ") was pressed!";
        },
        onKeyReleased: function (keyCode, event) {
          var label = event.getCurrentTarget();
          label.string = "Key " +
              (ServiceLocator.sys.isNative
                ? that.getNativeKeyName(keyCode)
                : String.fromCharCode(keyCode)) +
              "(" +
              keyCode.toString() +
              ") was released!";
        }
      },
      statusLabel
    );
    //----end4----
  }

  getNativeKeyName(keyCode) {
    var allCode = Object.getOwnPropertyNames(KEY);
    var keyName = "";
    for (var x in allCode) {
      if (KEY[allCode[x]] == keyCode) {
        keyName = allCode[x];
        break;
      }
    }
    return keyName;
  }

  title() {
    return "Label Receives Keyboard Event";
  }

  subtitle() {
    return "Please click keyboard\n(Only available on Desktop and Android)";
  }
}
