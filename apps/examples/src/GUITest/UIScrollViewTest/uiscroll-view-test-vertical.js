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
import { Button, ImageView, ScrollView } from "@aspect/ccui";

export class UIScrollViewTest_Vertical extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();
      //init text
      this._topDisplayLabel.string = "Move by vertical direction";
      this._topDisplayLabel.x = widgetSize.width / 2.0;
      this._topDisplayLabel.y =
        widgetSize.height / 2.0 + this._topDisplayLabel.height * 1.5;
      this._bottomDisplayLabel.string = "ScrollView";
      this._bottomDisplayLabel.x = widgetSize.width / 2;
      this._bottomDisplayLabel.y =
        widgetSize.height / 2 - this._bottomDisplayLabel.height * 3;

      // Create the scrollview
      var scrollView = new ScrollView();
      scrollView.setDirection(ScrollView.DIR_VERTICAL);
      scrollView.setTouchEnabled(true);
      scrollView.setContentSize(new Size(280, 150));

      scrollView.x =
        (widgetSize.width - scrollView.width) / 2;
      scrollView.y =
        (widgetSize.height - scrollView.height) / 2;
      this._mainNode.addChild(scrollView);

      var imageView = new ImageView();
      imageView.loadTexture("ccs-res/cocosui/ccicon.png");

      var innerWidth = scrollView.width;
      var innerHeight = scrollView.height + imageView.height;

      scrollView.setInnerContainerSize(new Size(innerWidth, innerHeight));

      var button = new Button();
      button.setTouchEnabled(true);
      button.loadTextures(
        "ccs-res/cocosui/animationbuttonnormal.png",
        "ccs-res/cocosui/animationbuttonpressed.png",
        ""
      );
      button.x = innerWidth / 2;
      button.y = scrollView.getInnerContainerSize().height - button.height / 2;
      scrollView.addChild(button);

      var textButton = new Button();
      textButton.setTouchEnabled(true);
      textButton.loadTextures(
        "ccs-res/cocosui/backtotopnormal.png",
        "ccs-res/cocosui/backtotoppressed.png",
        ""
      );
      textButton.setTitleText("Text Button");
      textButton.x = innerWidth / 2;
      textButton.y = button.getBottomBoundary() - button.height;
      scrollView.addChild(textButton);

      var button_scale9 = new Button();
      button_scale9.setTouchEnabled(true);
      button_scale9.setScale9Enabled(true);
      button_scale9.loadTextures(
        "ccs-res/cocosui/button.png",
        "ccs-res/cocosui/buttonHighlighted.png",
        ""
      );
      button_scale9.width = 100;
      button_scale9.height = 32;
      button_scale9.x = innerWidth / 2;
      button_scale9.y = textButton.getBottomBoundary() - textButton.height;
      scrollView.addChild(button_scale9);

      imageView.x = innerWidth / 2;
      imageView.y = imageView.height / 2;
      scrollView.addChild(imageView);

      return true;
    }
    return false;
  }
}
