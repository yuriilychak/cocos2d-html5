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
import { Button, ImageView, Layout, PageView, Text } from "@aspect/ccui";

export class UIPageViewJumpToPageTest extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();
      //init text
      this._topDisplayLabel.string = "setCurrentPageIndex API Test";
      this._topDisplayLabel.setFontSize(14);
      this._topDisplayLabel.x = widgetSize.width / 2.0;
      this._topDisplayLabel.y =
        widgetSize.height / 2.0 + this._topDisplayLabel.height * 4;
      this._bottomDisplayLabel.string = "";
      this._bottomDisplayLabel.x = widgetSize.width / 2;
      this._bottomDisplayLabel.y =
        widgetSize.height / 2 - this._bottomDisplayLabel.height * 3;

      // Create the page view
      var pageView = new PageView();
      pageView.setTouchEnabled(true);
      pageView.setContentSize(new Size(240, 130));
      pageView.x =
        (widgetSize.width - pageView.width) / 2;
      pageView.y =
        (widgetSize.height - pageView.height) / 2;
      pageView.setIndicatorEnabled(true);
      pageView.removeAllItems();

      var pageCount = 4;
      for (var i = 0; i < pageCount; ++i) {
        var layout = new Layout();
        layout.setContentSize(new Size(240.0, 130.0));

        var imageView = new ImageView("ccs-res/cocosui/scrollviewbg.png");
        imageView.setScale9Enabled(true);
        imageView.setContentSize(new Size(240, 130));
        imageView.setPosition(
          new Point(layout.width / 2.0, layout.height / 2.0)
        );
        layout.addChild(imageView);

        var label = new Text("page " + (i + 1), "Arial", 30);
        label.color = new Color(192, 192, 192);
        label.setPosition(
          new Point(layout.width / 2.0, layout.height / 2.0)
        );
        layout.addChild(label);

        pageView.insertCustomItem(layout, i);
      }

      pageView.setCurrentPageIndex(1);
      //add buttons to jump to specific page
      var button1 = new Button();
      button1.setPosition(
        new Point(pageView.x - 50, pageView.y + pageView.height)
      );
      button1.setTitleText("Jump to Page1");

      button1.addClickEventListener(function () {
        pageView.setCurrentPageIndex(0);
      });
      this._mainNode.addChild(button1);

      var button2 = button1.clone();
      button2.setTitleText("Jump to Page2");
      button2.setPosition(
        new Point(pageView.x - 50, pageView.y + pageView.height - 50)
      );
      button2.addClickEventListener(function () {
        pageView.setCurrentPageIndex(1);
      });
      this._mainNode.addChild(button2);

      var button3 = button2.clone();
      button3.setTitleText("Jump to Page3");
      button3.setPosition(
        new Point(
          pageView.x + pageView.width + 50,
          pageView.y + pageView.height
        )
      );
      button3.addClickEventListener(function () {
        pageView.setCurrentPageIndex(2);
      });
      this._mainNode.addChild(button3);

      var button4 = button3.clone();
      button4.setTitleText("Jump to Page4");
      button4.setPosition(
        new Point(
          pageView.x + pageView.width + 50,
          pageView.y + pageView.height - 50
        )
      );
      button4.addClickEventListener(function () {
        pageView.setCurrentPageIndex(3);
      });
      this._mainNode.addChild(button4);

      this._mainNode.addChild(pageView);

      return true;
    }
    return false;
  }
}
