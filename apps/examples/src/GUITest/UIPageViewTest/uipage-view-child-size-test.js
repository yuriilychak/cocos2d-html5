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
import { ImageView, PageView, Text } from "@aspect/ccui";

export class UIPageViewChildSizeTest extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();
      //init text
      this._topDisplayLabel.string = "Move by horizontal direction";
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
        var imageView = new ImageView("ccs-res/cocosui/scrollviewbg.png");
        var label = new Text("page " + (i + 1), "Arial", 30);

        imageView.setScale9Enabled(true);
        label.color = new Color(192, 192, 192);
        label.setAnchorPoint(new Point(0, 0));
        imageView.addChild(label);

        pageView.insertCustomItem(imageView, i);
      }

      pageView.addEventListener(this.pageViewEvent, this);

      this._mainNode.addChild(pageView);

      return true;
    }
    return false;
  }

  pageViewEvent(sender, type) {
    switch (type) {
      case PageView.EVENT_TURNING:
        var pageView = sender;
        this._topDisplayLabel.string = "page = " + (pageView.getCurPageIndex().valueOf() - 0 + 1);
        break;
      default:
        break;
    }
  }
}
