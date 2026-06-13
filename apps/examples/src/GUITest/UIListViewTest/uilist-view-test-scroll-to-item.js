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
import { Point, Color } from "@aspect/core";
import { DrawNode } from "@aspect/shape-nodes";
import { Button, Layout, ListView, ScrollView } from "@aspect/ccui";

export class UIListViewTest_ScrollToItem extends UIMainLayer {
  constructor() {
    super();
    this._nextIndex = 0;
  }

  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();

      this._topDisplayLabel.string = "";
      this._topDisplayLabel.x = widgetSize.width / 2.0;
      this._topDisplayLabel.y =
        widgetSize.height / 2.0 + this._topDisplayLabel.height * 1.5;
      this._bottomDisplayLabel.string = "";
      this._bottomDisplayLabel.x = widgetSize.width / 2;
      this._bottomDisplayLabel.y =
        widgetSize.height / 2 - this._bottomDisplayLabel.height * 3;

      // Create the list view
      var listView = new ListView();
      // set list view ex direction
      listView.setDirection(this._getListViewDirection());
      listView.setBounceEnabled(true);
      listView.setBackGroundImage("ccs-res/cocosui/green_edit.png");
      listView.setBackGroundImageScale9Enabled(true);
      listView.setContentSize(widgetSize.width / 2, widgetSize.height / 2);
      listView.setScrollBarPositionFromCorner(new Point(7, 7));
      listView.setItemsMargin(2.0);

      listView.x =
        (widgetSize.width - listView.width) / 2;
      listView.y =
        (widgetSize.height - listView.height) / 2;
      this._mainNode.addChild(listView);

      {
        var pNode = new DrawNode();

        var center = new Point(widgetSize.width / 2, widgetSize.height / 2);
        if (this._getListViewDirection() == ScrollView.DIR_HORIZONTAL) {
          var halfY = 110;
          pNode.drawSegment(
            new Point(center.x, center.y - halfY),
            new Point(center.x, center.y + halfY),
            2,
            new Color(0, 0, 0, 255)
          );
        } else {
          var halfX = 150;
          pNode.drawSegment(
            new Point(center.x - halfX, center.y),
            new Point(center.x + halfX, center.y),
            2,
            new Color(0, 0, 0, 255)
          );
        }
        pNode.setContentSize(listView.getContentSize());
        this._mainNode.addChild(pNode);
      }
      var NUMBER_OF_ITEMS = 31;
      // Button
      var pButton = new Button(
        "ccs-res/cocosui/backtotoppressed.png",
        "ccs-res/cocosui/backtotopnormal.png"
      );
      pButton.setAnchorPoint(new Point(0, 0.5));
      pButton.scale = 0.8;
      pButton.setPosition(
        Point.add(
          new Point(widgetSize.width / 2, widgetSize.height / 2),
          new Point(120, -60)
        )
      );
      pButton.setTitleText("Go to '" + this._nextIndex + "'");
      pButton.addClickEventListener(
        function (pButton) {
          listView.scrollToItem(
            this._nextIndex,
            new Point(0.5, 0.5),
            new Point(0.5, 0.5)
          );
          this._nextIndex =
            (this._nextIndex + Math.floor(NUMBER_OF_ITEMS / 2)) %
            NUMBER_OF_ITEMS;
          pButton.setTitleText("Go to '" + this._nextIndex + "'");
        }.bind(this)
      );
      this._mainNode.addChild(pButton);

      // Add list items

      var default_button = new Button();
      default_button.name = "TextButton";
      default_button.setTouchEnabled(true);
      default_button.loadTextures(
        "ccs-res/cocosui/backtotoppressed.png",
        "ccs-res/cocosui/backtotopnormal.png",
        ""
      );

      var default_item = new Layout();
      default_item.setTouchEnabled(true);
      default_item.setContentSize(default_button.getContentSize());
      default_button.x = default_item.width / 2;
      default_button.y = default_item.height / 2;
      default_item.addChild(default_button);

      // set model
      listView.setItemModel(default_item);

      // Add list items
      for (var i = 0; i < NUMBER_OF_ITEMS; ++i) {
        var item = default_item.clone();
        item.getChildByName("TextButton").setTitleText("Button-" + i);
        listView.pushBackCustomItem(item);
      }

      return true;
    }
    return false;
  }
  _getListViewDirection() {}
}
