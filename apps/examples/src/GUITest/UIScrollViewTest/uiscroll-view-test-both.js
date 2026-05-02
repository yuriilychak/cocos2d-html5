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
import { Size } from "@aspect/core";
import { ImageView, ScrollView } from "@aspect/ccui";

export class UIScrollViewTest_Both extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();
      //init text
      this._topDisplayLabel.setString("Move by any direction");
      this._topDisplayLabel.x = widgetSize.width / 2.0;
      this._topDisplayLabel.y =
        widgetSize.height / 2.0 + this._topDisplayLabel.height * 1.5;
      this._bottomDisplayLabel.setString("ScrollView both");
      this._bottomDisplayLabel.x = widgetSize.width / 2;
      this._bottomDisplayLabel.y =
        widgetSize.height / 2 - this._bottomDisplayLabel.height * 3;

      var background = this._widget.getChildByName("background_Panel");

      // Create the scrollview
      var scrollView = new ScrollView();
      scrollView.setDirection(ScrollView.DIR_BOTH);
      scrollView.setTouchEnabled(true);
      scrollView.setBounceEnabled(true);
      scrollView.setBackGroundImageScale9Enabled(true);
      scrollView.setBackGroundImage("ccs-res/cocosui/green_edit.png");
      scrollView.setContentSize(new Size(210, 122));
      var scrollViewSize = scrollView.getContentSize();

      scrollView.x =
        (widgetSize.width - background.width) / 2 +
        (background.width - scrollViewSize.width) / 2;
      scrollView.y =
        (widgetSize.height - background.height) / 2 +
        (background.height - scrollViewSize.height) / 2;
      this._mainNode.addChild(scrollView);

      var imageView = new ImageView();
      imageView.loadTexture("ccs-res/cocosui/b11.png");
      scrollView.addChild(imageView);

      scrollView.setInnerContainerSize(
        new Size(imageView.width, imageView.height)
      );
      imageView.x = imageView.width / 2;
      imageView.y = imageView.height / 2;

      return true;
    }
    return false;
  }
}
