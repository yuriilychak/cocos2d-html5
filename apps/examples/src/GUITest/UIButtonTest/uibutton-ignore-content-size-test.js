/****************************************************************************
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

import { UIMainLayer } from "../uimain-layer";
import { ScaleTo } from "@aspect/actions";
import { log } from "@aspect/core";

export class UIButtonIgnoreContentSizeTest extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();

      // Add a label in which the button events will be displayed
      this._topDisplayLabel.setString("Button IgnoreContent Size Test");
      this._bottomDisplayLabel.setString("");

      // Create the button
      var button = new ccui.Button(
        "ccs-res/cocosui/animationbuttonnormal.png",
        "ccs-res/cocosui/animationbuttonpressed.png"
      );
      button.ignoreContentAdaptWithSize(false);
      button.setContentSize(200, 100);
      button.setNormalizedPosition(0.3, 0.5);
      button.setTitleText("PLAY GAME");
      button.setZoomScale(0.3);
      button.setPressedActionEnabled(true);
      button.addClickEventListener(function () {
        log("clicked!");
        button.setScale(1.2);
      });
      this.addChild(button);

      // Create the button
      var button2 = new ccui.Button(
        "ccs-res/cocosui/animationbuttonnormal.png",
        "ccs-res/cocosui/animationbuttonpressed.png"
      );
      button2.ignoreContentAdaptWithSize(false);
      button2.setContentSize(200, 100);
      button2.setNormalizedPosition(0.8, 0.5);
      button2.setTitleText("PLAY GAME");
      button2.setZoomScale(0.3);
      button2.setPressedActionEnabled(true);
      button2.addClickEventListener(function () {
        button2.runAction(new ScaleTo(1.0, 1.2));
        log("clicked!");
      });
      this.addChild(button2);

      return true;
    }
    return false;
  }
}
