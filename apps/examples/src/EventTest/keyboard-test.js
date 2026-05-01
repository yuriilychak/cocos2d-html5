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
// Keyboard test
//
//------------------------------------------------------------------
import { EventTest } from "./event-test";
import { Director, EventListener, EventManager, LabelTTF, Sys, log } from "@aspect/core";

export class KeyboardTest extends EventTest {
  init() {
    super.init();
    var self = this;
    var label = new LabelTTF("show key Code");
    var size = Director.getInstance().getWinSize();
    label.setPosition(size.width / 2, size.height / 2);
    this.addChild(label);
    if ("keyboard" in Sys.getInstance().capabilities) {
      EventManager.getInstance().addListener(
        {
          event: EventListener.KEYBOARD,
          onKeyPressed: function (key, event) {
            var strTemp = "Key down:" + key;
            var keyStr = self.getKeyStr(key);
            if (keyStr.length > 0) {
              strTemp += " the key name is:" + keyStr;
            }
            label.setString(strTemp);
          },
          onKeyReleased: function (key, event) {
            var strTemp = "Key up:" + key;
            var keyStr = self.getKeyStr(key);
            if (keyStr.length > 0) {
              strTemp += " the key name is:" + keyStr;
            }
            label.setString(strTemp);
          }
        },
        this
      );
    } else {
      log("KEYBOARD Not supported");
    }
  }
  getKeyStr(keycode) {
    if (keycode == cc.KEY.none) {
      return "";
    }

    for (var keyTemp in cc.KEY) {
      if (cc.KEY[keyTemp] == keycode) {
        return keyTemp;
      }
    }
    return "";
  }
  subtitle() {
    return "Keyboard test. Press keyboard and see console";
  }

  // this callback is only available on JSB + OS X
  // Not supported on cocos2d-html5
  onKeyFlagsChanged(key) {
    log("Key flags changed:" + key);
  }
}
