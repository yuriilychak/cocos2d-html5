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
import { Color } from "@aspect/core";
import { Button, Widget } from "@aspect/ccui";
import { ButtonLayout } from "../../button-layout";

export class UIButtonTest extends UIMainLayer {
  constructor() {
    super();
    this._button = null;
  }

  init() {
    if (super.init()) {
      //init text
      this._topDisplayLabel.string = "No Event";
      this._bottomDisplayLabel.string = "Button";

      var widgetSize = this._widget.getContentSize();
      // Create the button
      var button = (this._button = new Button());
      button.setTouchEnabled(true);
      button.loadTextures(
        "ccs-res/cocosui/animationbuttonnormal.png",
        "ccs-res/cocosui/animationbuttonpressed.png",
        ""
      );
      button.x = widgetSize.width / 2.0;
      button.y = widgetSize.height / 2.0;
      button.addTouchEventListener(this.touchEvent, this);
      this._mainNode.addChild(button);

      this.addChild(new ButtonLayout(
        [{ label: "setOpacity", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) }],
        196, "Actions",
        () => this.setOpacityTest()
      ));
      return true;
    }
    return false;
  }
  setOpacityTest() {
    var button = this._button;
    var opacity = button._realOpacity === 255 ? 100 : 255;
    button.opacity = opacity;
  }
  touchEvent(sender, type) {
    switch (type) {
      case Widget.TOUCH_BEGAN:
        this._topDisplayLabel.string = "Touch Down";
        break;

      case Widget.TOUCH_MOVED:
        this._topDisplayLabel.string = "Touch Move";
        break;

      case Widget.TOUCH_ENDED:
        this._topDisplayLabel.string = "Touch Up";
        break;

      case Widget.TOUCH_CANCELED:
        this._topDisplayLabel.string = "Touch Cancelled";
        break;

      default:
        break;
    }
  }
}
