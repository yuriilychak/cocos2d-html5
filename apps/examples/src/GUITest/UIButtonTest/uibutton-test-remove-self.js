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
import { Button, Layout, Widget } from "@aspect/ccui";

export class UIButtonTestRemoveSelf extends UIMainLayer {
  init() {
    if (super.init()) {
      //init text
      this._topDisplayLabel.setString("No Event");
      this._bottomDisplayLabel.setString(
        "Remove Self in the Button's Callback shouldn't cause crash!"
      );
      this._bottomDisplayLabel.setFontSize(15);

      var widgetSize = this._widget.getContentSize();

      var layout = new Layout();
      layout.setContentSize(widgetSize.width * 0.6, widgetSize.height * 0.6);
      layout.setBackGroundColor(Color.GREEN);
      layout.setBackGroundColorType(Layout.BG_COLOR_SOLID);
      layout.setBackGroundColorOpacity(100);
      layout.setPosition(widgetSize.width / 2, widgetSize.height / 2);
      layout.setAnchorPoint(0.5, 0.5);
      layout.tag = 12;
      this._mainNode.addChild(layout);

      // Create the button
      var button = new Button(
        "ccs-res/cocosui/animationbuttonnormal.png",
        "ccs-res/cocosui/animationbuttonpressed.png"
      );
      button.setPosition(layout.width / 2.0, layout.height / 2.0);
      button.addTouchEventListener(this.touchEvent, this);
      layout.addChild(button);
      return true;
    }
    return false;
  }

  touchEvent(sender, type) {
    switch (type) {
      case Widget.TOUCH_BEGAN:
        this._topDisplayLabel.setString("Touch Down");
        break;

      case Widget.TOUCH_MOVED:
        this._topDisplayLabel.setString("Touch Move");
        break;

      case Widget.TOUCH_ENDED:
        this._topDisplayLabel.setString("Touch Up");
        var layout = this._mainNode.getChildByTag(12);
        layout.removeFromParent(true);
        break;

      case Widget.TOUCH_CANCELED:
        this._topDisplayLabel.setString("Touch Cancelled");
        break;

      default:
        break;
    }
  }
}
