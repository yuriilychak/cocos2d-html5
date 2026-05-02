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
import { ImageView, Layout, RelativeLayoutParameter, Text } from "@aspect/ccui";

export class UILayoutTest_Layout_Relative_Location extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();

      // Add the alert
      var alert = new Text("Layout Relative Location", "Marker Felt", 20);
      alert.setColor(new Color(159, 168, 176));
      alert.setPosition(
        widgetSize.width / 2.0,
        widgetSize.height / 2.0 - alert.height * 4.5
      );
      this._mainNode.addChild(alert);

      var root = this._mainNode.getChildByTag(81);
      var background = root.getChildByName("background_Panel");

      // Create the layout
      var layout = new Layout();
      layout.setLayoutType(Layout.RELATIVE);
      layout.setContentSize(280, 150);
      var backgroundSize = background.getContentSize();
      layout.setPosition(
        (widgetSize.width - backgroundSize.width) / 2.0 +
          (backgroundSize.width - layout.width) / 2.0,
        (widgetSize.height - backgroundSize.height) / 2.0 +
          (backgroundSize.height - layout.height) / 2.0
      );
      this._mainNode.addChild(layout);

      // center
      var imageView_Center = new ImageView(
        "ccs-res/cocosui/scrollviewbg.png"
      );
      layout.addChild(imageView_Center);
      var rp_Center = new RelativeLayoutParameter();
      rp_Center.setRelativeName("rp_Center");
      rp_Center.setAlign(RelativeLayoutParameter.CENTER_IN_PARENT);
      imageView_Center.setLayoutParameter(rp_Center);

      // above center
      var imageView_AboveCenter = new ImageView(
        "ccs-res/cocosui/switch-mask.png"
      );
      layout.addChild(imageView_AboveCenter);
      var rp_AboveCenter = new RelativeLayoutParameter();
      rp_AboveCenter.setRelativeToWidgetName("rp_Center");
      rp_AboveCenter.setAlign(
        RelativeLayoutParameter.LOCATION_ABOVE_CENTER
      );
      imageView_AboveCenter.setLayoutParameter(rp_AboveCenter);

      // below center
      var imageView_BelowCenter = new ImageView(
        "ccs-res/cocosui/switch-mask.png"
      );
      layout.addChild(imageView_BelowCenter);
      var rp_BelowCenter = new RelativeLayoutParameter();
      rp_BelowCenter.setRelativeToWidgetName("rp_Center");
      rp_BelowCenter.setAlign(
        RelativeLayoutParameter.LOCATION_BELOW_CENTER
      );
      imageView_BelowCenter.setLayoutParameter(rp_BelowCenter);

      // left center
      var imageView_LeftCenter = new ImageView(
        "ccs-res/cocosui/switch-mask.png"
      );
      layout.addChild(imageView_LeftCenter);
      var rp_LeftCenter = new RelativeLayoutParameter();
      rp_LeftCenter.setRelativeToWidgetName("rp_Center");
      rp_LeftCenter.setAlign(
        RelativeLayoutParameter.LOCATION_LEFT_OF_CENTER
      );
      imageView_LeftCenter.setLayoutParameter(rp_LeftCenter);

      // right center
      var imageView_RightCenter = new ImageView(
        "ccs-res/cocosui/switch-mask.png"
      );
      layout.addChild(imageView_RightCenter);
      var rp_RightCenter = new RelativeLayoutParameter();
      rp_RightCenter.setRelativeToWidgetName("rp_Center");
      rp_RightCenter.setAlign(
        RelativeLayoutParameter.LOCATION_RIGHT_OF_CENTER
      );
      imageView_RightCenter.setLayoutParameter(rp_RightCenter);

      return true;
    }
    return false;
  }
}
