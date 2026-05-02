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
import { Button, ListView, ScrollView } from "@aspect/ccui";

export class UIListViewTest_Magnetic extends UIMainLayer {
  constructor() {
    super();
    this._listView = null;
  }

  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();
      var background = this._widget.getChildByName("background_Panel");
      var backgroundSize = background.getContentSize();

      this._topDisplayLabel.setString("1");
      this._topDisplayLabel.setFontSize(14);
      this._topDisplayLabel.x = widgetSize.width / 2.0;
      this._topDisplayLabel.y = widgetSize.height / 2 + 90;
      this._bottomDisplayLabel.setString("");
      this._bottomDisplayLabel.x = widgetSize.width / 2;
      this._bottomDisplayLabel.y =
        widgetSize.height / 2 - this._bottomDisplayLabel.height * 3;

      // Create the list view
      this._listView = new ListView();
      // set list view ex direction
      this._listView.setDirection(this._getListViewDirection());
      this._listView.setTouchEnabled(true);
      this._listView.setBounceEnabled(true);
      this._listView.setBackGroundImage("ccs-res/cocosui/green_edit.png");
      this._listView.setBackGroundImageScale9Enabled(true);
      this._listView.setContentSize(
        widgetSize.width / 2,
        widgetSize.height / 2
      );
      this._listView.setScrollBarPositionFromCorner(new Point(7, 7));
      this._listView.setItemsMargin(2.0);
      this._listView.setAnchorPoint(new Point(0.5, 0.5));

      this._listView.x = widgetSize.width / 2;
      this._listView.y = widgetSize.height / 2;

      this._listView.setGravity(ListView.GRAVITY_CENTER_VERTICAL);

      this._mainNode.addChild(this._listView);

      {
        var pNode = new DrawNode();

        var center = new Point(widgetSize.width / 2, widgetSize.height / 2);
        if (this._getListViewDirection() == ScrollView.DIR_HORIZONTAL) {
          var halfY = 110;
          pNode.drawSegment(
            new Point(center.x, center.y - halfY),
            new Point(center.x, center.y + halfY),
            1,
            new Color(0, 0, 0, 255)
          );
        } else {
          var halfX = 150;
          pNode.drawSegment(
            new Point(center.x - halfX, center.y),
            new Point(center.x + halfX, center.y),
            1,
            new Color(0, 0, 0, 255)
          );
        }
        pNode.setContentSize(this._listView.getContentSize());
        this._mainNode.addChild(pNode);
      }

      // Initial magnetic type
      this._listView.setMagneticType(ListView.MAGNETIC_NONE);
      this._topDisplayLabel.setString("MagneticType - NONE");

      // Magnetic change button
      var pButton = new Button(
        "ccs-res/cocosui/backtotoppressed.png",
        "ccs-res/cocosui/backtotopnormal.png"
      );
      pButton.setAnchorPoint(new Point(0.5, 0.5));
      pButton.setScale(0.8);
      pButton.setPosition(
        Point.add(
          new Point(widgetSize.width / 2, widgetSize.height / 2),
          new Point(130, -60)
        )
      );
      pButton.setTitleText("Next Magnetic");
      pButton.addClickEventListener(
        function () {
          var eCurrentType = this._listView.getMagneticType();
          var eNextType;
          var sString;
          if (eCurrentType == ListView.MAGNETIC_NONE) {
            eNextType = ListView.MAGNETIC_CENTER;
            sString = "CENTER";
          } else if (eCurrentType == ListView.MAGNETIC_CENTER) {
            eNextType = ListView.MAGNETIC_BOTH_END;
            sString = "BOTH_END";
          } else if (eCurrentType == ListView.MAGNETIC_BOTH_END) {
            if (
              this._getListViewDirection() == ScrollView.DIR_HORIZONTAL
            ) {
              eNextType = ListView.MAGNETIC_LEFT;
              sString = "LEFT";
            } else {
              eNextType = ListView.MAGNETIC_TOP;
              sString = "TOP";
            }
          } else if (eCurrentType == ListView.MAGNETIC_LEFT) {
            eNextType = ListView.MAGNETIC_RIGHT;
            sString = "RIGHT";
          } else if (eCurrentType == ListView.MAGNETIC_RIGHT) {
            eNextType = ListView.MAGNETIC_NONE;
            sString = "NONE";
          } else if (eCurrentType == ListView.MAGNETIC_TOP) {
            eNextType = ListView.MAGNETIC_BOTTOM;
            sString = "BOTTOM";
          } else if (eCurrentType == ListView.MAGNETIC_BOTTOM) {
            eNextType = ListView.MAGNETIC_NONE;
            sString = "NONE";
          }
          this._listView.setMagneticType(eNextType);

          this._topDisplayLabel.setString("MagneticType - " + sString);
        }.bind(this)
      );
      this._mainNode.addChild(pButton);

      // Add list items
      for (var i = 0; i < 40; ++i) {
        var button = new Button(
          "ccs-res/cocosui/button.png",
          "ccs-res/cocosui/buttonHighlighted.png"
        );
        button.setTitleText("Button-" + i);
        button.setContentSize(100, 70);
        button.setScale9Enabled(true);
        this._listView.pushBackCustomItem(button);
      }

      return true;
    }
    return false;
  }

  _getListViewDirection() {}
}
