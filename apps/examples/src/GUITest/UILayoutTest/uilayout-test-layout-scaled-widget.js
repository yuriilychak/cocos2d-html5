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
import { ImageView, Layout, Text } from "@aspect/ccui";

export class UILayoutTest_Layout_Scaled_Widget extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();

      // Add the alert
      var alert = new Text("Layout Scaled Widget", "Marker Felt", 20);
      alert.setColor(new Color(159, 168, 176));
      alert.setPosition(
        widgetSize.width / 2.0,
        widgetSize.height / 2.0 - alert.height * 4.5
      );
      this._mainNode.addChild(alert);

      // Create the layout
      var layout = new Layout();
      layout.setLayoutType(Layout.LINEAR_HORIZONTAL);
      layout.setContentSize(280, 150);
      layout.setPosition(
        (widgetSize.width - layout.width) / 2.0,
        (widgetSize.height - layout.height) / 2.0
      );
      this._mainNode.addChild(layout);

      // center
      var imageView_Center1 = new ImageView(
        "ccs-res/cocosui/scrollviewbg.png"
      );
      imageView_Center1.scale = 0.5;
      layout.addChild(imageView_Center1);

      var imageView_Center2 = new ImageView(
        "ccs-res/cocosui/scrollviewbg.png"
      );
      imageView_Center2.scale = 1.2;
      layout.addChild(imageView_Center2);

      var imageView_Center3 = new ImageView(
        "ccs-res/cocosui/scrollviewbg.png"
      );
      imageView_Center3.scale = 0.8;
      layout.addChild(imageView_Center3);

      return true;
    }
    return false;
  }
}
