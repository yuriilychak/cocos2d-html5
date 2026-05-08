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
import { Point, Size, Color } from "@aspect/core";
import { ImageView, Layout, ScrollView } from "@aspect/ccui";

export class UIScrollViewTest_ScrollToPercentBothDirection_Bounce extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();
      //init text
      this._topDisplayLabel.setString("");
      this._bottomDisplayLabel.setString(
        "ScrollView scroll to percent both directrion bounce"
      );
      this._bottomDisplayLabel.x = widgetSize.width / 2;
      this._bottomDisplayLabel.y =
        widgetSize.height / 2 - this._bottomDisplayLabel.height * 3;

      // Create the scrollview
      var scrollView = new ScrollView();
      scrollView.setTouchEnabled(true);
      scrollView.setBounceEnabled(true);
      scrollView.setBackGroundColor(Color.GREEN);
      scrollView.setBackGroundColorType(Layout.BG_COLOR_SOLID);
      scrollView.setDirection(ScrollView.DIR_BOTH);
      scrollView.setInnerContainerSize(new Size(480, 320));
      scrollView.setContentSize(new Size(100, 100));
      var scrollViewSize = scrollView.getContentSize();

      scrollView.x =
        (widgetSize.width - scrollViewSize.width) / 2;
      scrollView.y =
        (widgetSize.height - scrollViewSize.height) / 2;
      scrollView.scrollToPercentBothDirection(new Point(50, 50), 1, true);

      this._mainNode.addChild(scrollView);

      var imageView = new ImageView();
      imageView.loadTexture("ccs-res/cocosui/Hello.png");
      imageView.x = 240;
      imageView.y = 160;
      scrollView.addChild(imageView);

      return true;
    }
    return false;
  }
}
