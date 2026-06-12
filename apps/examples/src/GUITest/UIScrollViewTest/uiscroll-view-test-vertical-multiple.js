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
import { Color, Size } from "@aspect/core";
import { Button, ScrollView, Text } from "@aspect/ccui";
import { ButtonLayout } from "../../button-layout";

export class UIScrollViewTest_Vertical_Multiple extends UIMainLayer {
  constructor() {
    super();
    this._scrollView = null;
    this._itemNumber = 1000;
  }

  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();
      //init text
      this._topDisplayLabel.string = "Move by vertical direction";
      this._topDisplayLabel.x = widgetSize.width / 2.0;
      this._topDisplayLabel.y =
        widgetSize.height / 2.0 + this._topDisplayLabel.height * 1.5;
      this._bottomDisplayLabel.string = "Compare drawCalls and FPS with Previous Version";
      this._bottomDisplayLabel.setFontSize(25);
      this._bottomDisplayLabel.x = widgetSize.width / 2;
      this._bottomDisplayLabel.y =
        widgetSize.height / 2 - this._bottomDisplayLabel.height * 4;

      // Create the scrollview
      var scrollView = (this._scrollView = new ScrollView());
      scrollView.setDirection(ScrollView.DIR_VERTICAL);
      scrollView.setTouchEnabled(true);
      scrollView.setContentSize(new Size(280, 150));

      scrollView.x =
        (widgetSize.width - scrollView.width) / 2;
      scrollView.y =
        (widgetSize.height - scrollView.height) / 2;
      this._mainNode.addChild(scrollView);

      this.addChild(new ButtonLayout(
        [
          { label: "Texts", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
          { label: "Buttons", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
          { label: "s9Sprites", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) }
        ],
        196, "Draw Mode",
        (i) => {
          if (i === 0) this.drawTexts();
          else if (i === 1) this.drawButtons();
          else this.drawS9Buttons();
        }
      ), 1);
      this.drawTexts();
      return true;
    }
    return false;
  }
  drawTexts() {
    var scrollView = this._scrollView;
    var n = this._itemNumber / 2;
    if (scrollView.children) scrollView.removeAllChildren(true);
    var Texts = [];
    var start = new Text("---start---", "Thonburi", 10);
    var innerWidth = scrollView.width;
    var innerHeight = n * start.height;
    scrollView.setInnerContainerSize(new Size(innerWidth, innerHeight));

    start.x = innerWidth / 2;
    start.y = scrollView.getInnerContainerSize().height - start.height / 2;
    Texts[0] = start;
    scrollView.addChild(start);

    for (var i = 1; i < n; i++) {
      var text = new Text("This is a test label: " + i, "Thonburi", 10);
      text.x = innerWidth / 2;
      text.y = Texts[i - 1].getBottomBoundary() - text.height / 2;
      Texts[i] = text;
      scrollView.addChild(Texts[i]);
    }
  }
  drawButtons() {
    var scrollView = this._scrollView;
    var n = this._itemNumber / 2;
    if (scrollView.children) scrollView.removeAllChildren(true);
    var Buttons = [];
    var innerWidth = scrollView.width;

    for (var j = 0; j < n; j++) {
      var button = new Button();
      button.setTouchEnabled(true);
      button.loadTextures(
        "ccs-res/cocosui/animationbuttonnormal.png",
        "ccs-res/cocosui/animationbuttonpressed.png",
        ""
      );
      button.x = innerWidth / 2;
      if (j === 0) {
        var innerHeight = n * button.height;
        scrollView.setInnerContainerSize(new Size(innerWidth, innerHeight));
        button.y =
          scrollView.getInnerContainerSize().height - button.height / 2;
      } else button.y = Buttons[j - 1].getBottomBoundary() - button.height / 2;
      Buttons.push(button);
      scrollView.addChild(button);
    }
  }
  drawS9Buttons() {
    var scrollView = this._scrollView;
    var n = this._itemNumber;
    if (scrollView.children) scrollView.removeAllChildren(true);
    var Buttons = [];
    var innerWidth = scrollView.width;

    for (var j = 0; j < n; j++) {
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
      if (j === 0) {
        var innerHeight = n * 32;
        scrollView.setInnerContainerSize(new Size(innerWidth, innerHeight));
        button_scale9.y =
          scrollView.getInnerContainerSize().height - button_scale9.height / 2;
      } else
        button_scale9.y =
          Buttons[j - 1].getBottomBoundary() - button_scale9.height / 2;
      Buttons.push(button_scale9);
      scrollView.addChild(button_scale9);
    }
  }
}
