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
import { Point, Size, Color } from "@aspect/core";
import { Button, ImageView, Layout, ScrollView } from "@aspect/ccui";

export class UIScrollViewNestTest extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();

      // Add a label in which the scrollview alert will be displayed
      this._topDisplayLabel.setString("Move by vertical direction");

      // Add the alert
      this._bottomDisplayLabel.setString("ScrollView vertical");
      this._bottomDisplayLabel.setPosition(
        widgetSize.width / 2.0,
        widgetSize.height / 2.0 - this._bottomDisplayLabel.height * 3.075
      );

      // Create the scrollview by vertical
      var scrollView = new ScrollView();
      scrollView.setContentSize(new Size(280.0, 150.0));
      scrollView.setDirection(ScrollView.DIR_BOTH);
      scrollView.setPosition(
        new Point(
          (widgetSize.width - scrollView.getContentSize().width) / 2.0,
          (widgetSize.height - scrollView.getContentSize().height) / 2.0
        )
      );
      this._mainNode.addChild(scrollView);

      var imageView = new ImageView("ccs-res/cocosui/ccicon.png");

      var innerWidth = scrollView.getContentSize().width;
      var innerHeight =
        scrollView.getContentSize().height + imageView.getContentSize().height;

      scrollView.setInnerContainerSize(new Size(innerWidth, innerHeight));

      var button = new Button(
        "ccs-res/cocosui/animationbuttonnormal.png",
        "ccs-res/cocosui/animationbuttonpressed.png"
      );
      button.setPosition(
        new Point(
          innerWidth / 2.0,
          scrollView.getInnerContainerSize().height -
            button.getContentSize().height / 2.0
        )
      );
      scrollView.addChild(button);

      var titleButton = new Button(
        "ccs-res/cocosui/backtotopnormal.png",
        "ccs-res/cocosui/backtotoppressed.png"
      );
      titleButton.setTitleText("Title Button");
      titleButton.setPosition(
        new Point(
          innerWidth / 2.0,
          button.getBottomBoundary() - button.getContentSize().height
        )
      );
      scrollView.addChild(titleButton);

      var button_scale9 = new Button(
        "ccs-res/cocosui/button.png",
        "ccs-res/cocosui/buttonHighlighted.png"
      );
      button_scale9.setScale9Enabled(true);
      button_scale9.setContentSize(
        new Size(100.0, button_scale9.getVirtualRendererSize().height)
      );
      button_scale9.setPosition(
        new Point(
          innerWidth / 2.0,
          titleButton.getBottomBoundary() - titleButton.getContentSize().height
        )
      );
      scrollView.addChild(button_scale9);

      imageView.setPosition(
        new Point(innerWidth / 2.0, imageView.getContentSize().height / 2.0)
      );
      scrollView.addChild(imageView);

      // Create the scrollview by horizontal
      var sc = new ScrollView();
      sc.setBackGroundColor(Color.GREEN);
      sc.setBackGroundColorType(Layout.BG_COLOR_SOLID);
      sc.setBounceEnabled(true);
      sc.setDirection(ScrollView.DIR_BOTH);
      sc.setInnerContainerSize(new Size(480, 320));
      sc.setContentSize(new Size(100, 100));
      sc.setPropagateTouchEvents(false);
      sc.setPosition(new Point(180, 100));
      sc.scrollToPercentBothDirection(new Point(50, 50), 1, true);
      var iv = new ImageView("ccs-res/cocosui/Hello.png");
      iv.setPosition(new Point(240, 160));
      sc.addChild(iv);
      scrollView.addChild(sc);

      return true;
    }
  }
}
