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

export class UIButtonTest extends UIMainLayer {
  constructor() {
    super();
    this._button = null;
  }

  init() {
    if (super.init()) {
      //init text
      this._topDisplayLabel.setString("No Event");
      this._bottomDisplayLabel.setString("Button");

      var widgetSize = this._widget.getContentSize();
      // Create the button
      var button = (this._button = new ccui.Button());
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

      var label = new cc.LabelTTF("setOpacity", "Arial", 25);
      var menuItem = new cc.MenuItemLabel(label, this.setOpacityTest, this);
      var menu = new cc.Menu(menuItem);
      menu.x = 0;
      menu.y = 0;
      menuItem.x = widgetSize.width - 100;
      menuItem.y = 270;
      this._mainNode.addChild(menu);
      return true;
    }
    return false;
  }
  setOpacityTest() {
    var button = this._button;
    var opacity = button._realOpacity === 255 ? 100 : 255;
    button.setOpacity(opacity);
  }
  touchEvent(sender, type) {
    switch (type) {
      case ccui.Widget.TOUCH_BEGAN:
        this._topDisplayLabel.setString("Touch Down");
        break;

      case ccui.Widget.TOUCH_MOVED:
        this._topDisplayLabel.setString("Touch Move");
        break;

      case ccui.Widget.TOUCH_ENDED:
        this._topDisplayLabel.setString("Touch Up");
        break;

      case ccui.Widget.TOUCH_CANCELED:
        this._topDisplayLabel.setString("Touch Cancelled");
        break;

      default:
        break;
    }
  }
}
