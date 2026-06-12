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
import { ImageView, Layout, PageView, Text } from "@aspect/ccui";

export class UIPageViewIndicatorTest extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();

      this._topDisplayLabel.string = "PageView indicator custom texture\nscale : 0.5, index color: RED";
      this._topDisplayLabel.setFontSize(14);
      this._topDisplayLabel.x = widgetSize.width / 2.0;
      this._topDisplayLabel.y =
        widgetSize.height / 2.0 + this._topDisplayLabel.height;

      this._bottomDisplayLabel.string = "PageView";
      this._bottomDisplayLabel.x = widgetSize.width / 2;
      this._bottomDisplayLabel.y =
        widgetSize.height / 2 - this._bottomDisplayLabel.height * 3;

      var pageView = new PageView();
      pageView.setContentSize(new Size(240, 130));
      pageView.x =
        (widgetSize.width - pageView.width) / 2;
      pageView.y =
        (widgetSize.height - pageView.height) / 2;
      pageView.removeAllPages();

      pageView.setIndicatorEnabled(true);
      pageView.setIndicatorSpaceBetweenIndexNodes(5);
      pageView.setIndicatorIndexNodesScale(0.5);
      pageView.setIndicatorIndexNodesTexture("ccs-res/cocosui/green_edit.png");
      pageView.setIndicatorIndexNodesColor(Color.RED);

      var pageCount = 4;
      for (var i = 0; i < pageCount; i++) {
        var layout = new Layout();
        layout.setContentSize(new Size(240, 130));

        var imageView = new ImageView();
        imageView.setScale9Enabled(true);
        imageView.loadTexture("ccs-res/cocosui/scrollviewbg.png");
        imageView.setContentSize(new Size(240, 130));
        imageView.x = layout.getContentSize().width / 2;
        imageView.y = layout.getContentSize().height / 2;
        layout.addChild(imageView);
        var pageNumber = i + 1;
        var label = new Text("page" + pageNumber, "Marker Felt", 30);
        label.color = new Color(192, 192, 192);
        label.setPosition(
          new Point(
            layout.getContentSize().width / 2,
            layout.getContentSize().height / 2
          )
        );
        layout.addChild(label);

        pageView.insertPage(layout, i);
      }
      this._mainNode.addChild(pageView);
      return true;
    }
    return false;
  }
}
