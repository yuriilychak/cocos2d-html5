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
import { Size, Color } from "@aspect/core";
import { Button } from "@aspect/ccui";

export class UIButtonTitleEffectTest extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();

      // Add a label in which the button events will be displayed
      this._topDisplayLabel.setString("Button Title Effect");
      this._bottomDisplayLabel.setString("");

      // Create the button
      var button = new Button(
        "ccs-res/cocosui/animationbuttonnormal.png",
        "ccs-res/cocosui/animationbuttonpressed.png"
      );
      button.setNormalizedPosition(0.3, 0.5);
      button.setTitleText("PLAY GAME");
      //button.setTitleFontName("Marker Felt");
      button.setZoomScale(0.3);
      button.scale = 2.0;
      button.setPressedActionEnabled(true);
      var title = button.getTitleRenderer();
      button.setTitleColor(Color.RED);
      title.enableShadow(Color.BLACK, new Size(2, -2));
      this.addChild(button);

      // Create the button
      var button2 = new Button(
        "ccs-res/cocosui/animationbuttonnormal.png",
        "ccs-res/cocosui/animationbuttonpressed.png"
      );
      button2.setNormalizedPosition(0.8, 0.5);
      button2.setTitleText("PLAY GAME");
      var title2 = button2.getTitleRenderer();
      title2.enableStroke(Color.GREEN, 3);
      this.addChild(button2);
      return true;
    }
    return false;
  }
}
