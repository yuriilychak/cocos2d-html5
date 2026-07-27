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

//2015-01-14
import { UIMainLayer } from "../uimain-layer";
import { Point, Size } from "@aspect/core";
import { Button, ImageView, ScrollView } from "@aspect/ccui";

export class UIScrollViewRotated extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.contentSize;

      // Add a label in which the scrollview alert will be displayed
      this._topDisplayLabel.string = "Move by vertical direction";

      // Add the alert
      this._bottomDisplayLabel.string = "ScrollView vertical";
      this._bottomDisplayLabel.position = { x: widgetSize.width / 2.0, y: widgetSize.height / 2.0 - this._bottomDisplayLabel.height * 3.075 };

      // Create the scrollview by vertical
      var scrollView = new ScrollView();
      scrollView.width = 280.0;
      scrollView.height = 150.0;
      scrollView.setDirection(ScrollView.DIR_BOTH);
      scrollView.position = new Point(
          (widgetSize.width - scrollView.width) / 2.0,
          (widgetSize.height - scrollView.height) / 2.0 + 100
        );
      scrollView.rotation = 45;
      this._mainNode.addChild(scrollView);

      var imageView = new ImageView("ccs-res/cocosui/ccicon.png");

      var innerWidth = scrollView.width;
      var innerHeight = scrollView.height + imageView.height;
      scrollView.setInnerContainerSize(new Size(innerWidth, innerHeight));

      var button = new Button(
        "ccs-res/cocosui/animationbuttonnormal.png",
        "ccs-res/cocosui/animationbuttonpressed.png"
      );
      button.position = new Point(
          innerWidth / 2.0,
          scrollView.getInnerContainerSize().height - button.height / 2.0
        );
      scrollView.addChild(button);

      var titleButton = new Button(
        "ccs-res/cocosui/backtotopnormal.png",
        "ccs-res/cocosui/backtotoppressed.png"
      );
      titleButton.setTitleText("Title Button");
      titleButton.position = new Point(innerWidth / 2.0, button.getBottomBoundary() - button.height);
      scrollView.addChild(titleButton);

      var button_scale9 = new Button(
        "ccs-res/cocosui/button.png",
        "ccs-res/cocosui/buttonHighlighted.png"
      );
      button_scale9.setScale9Enabled(true);
      button_scale9.width = 100.0;
      button_scale9.height = button_scale9.getVirtualRendererSize().height;
      button_scale9.position = new Point(
          innerWidth / 2.0,
          titleButton.getBottomBoundary() - titleButton.height
        );
      scrollView.addChild(button_scale9);

      imageView.position = new Point(innerWidth / 2.0, imageView.height / 2.0);
      scrollView.addChild(imageView);

      return true;
    }
  }
}
