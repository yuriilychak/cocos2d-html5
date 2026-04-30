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

import { UIMainLayer } from "../uimain-layer.js";

export class UIListViewTest_Magnetic extends UIMainLayer {
    constructor() {
        super();
        this._listView = null;
    }

    init() {
        if(super.init()) {
            var widgetSize = this._widget.getContentSize();
            var background = this._widget.getChildByName("background_Panel");
            var backgroundSize = background.getContentSize();

            this._topDisplayLabel.setString("1");
            this._topDisplayLabel.setFontSize(14);
            this._topDisplayLabel.x = widgetSize.width / 2.0;
            this._topDisplayLabel.y = widgetSize.height / 2 + 90;
            this._bottomDisplayLabel.setString("");
            this._bottomDisplayLabel.x = widgetSize.width / 2;
            this._bottomDisplayLabel.y = widgetSize.height / 2 - this._bottomDisplayLabel.height * 3;

            // Create the list view
            this._listView = new ccui.ListView();
            // set list view ex direction
            this._listView.setDirection(this._getListViewDirection());
            this._listView.setTouchEnabled(true);
            this._listView.setBounceEnabled(true);
            this._listView.setBackGroundImage("ccs-res/cocosui/green_edit.png");
            this._listView.setBackGroundImageScale9Enabled(true);
            this._listView.setContentSize(widgetSize.width / 2, widgetSize.height / 2);
            this._listView.setScrollBarPositionFromCorner(new cc.Point(7, 7));
            this._listView.setItemsMargin(2.0);
            this._listView.setAnchorPoint(new cc.Point(0.5 ,0.5));

            this._listView.x = widgetSize.width / 2;
            this._listView.y = widgetSize.height / 2;

            this._listView.setGravity(ccui.ListView.GRAVITY_CENTER_VERTICAL);

            this._mainNode.addChild(this._listView);

            {
                var pNode = new cc.DrawNode();

                var center = new cc.Point(widgetSize.width / 2, widgetSize.height / 2);
                if(this._getListViewDirection() == ccui.ScrollView.DIR_HORIZONTAL)
                {
                    var halfY = 110;
                    pNode.drawSegment(new cc.Point(center.x, center.y - halfY), new cc.Point(center.x, center.y + halfY), 1, new cc.Color(0, 0, 0, 255));
                }
                else
                {
                    var halfX = 150;
                    pNode.drawSegment(new cc.Point(center.x - halfX, center.y), new cc.Point(center.x + halfX, center.y), 1, new cc.Color(0, 0, 0, 255));
                }
                pNode.setContentSize(this._listView.getContentSize());
                this._mainNode.addChild(pNode);
            }

            // Initial magnetic type
            this._listView.setMagneticType(ccui.ListView.MAGNETIC_NONE);
            this._topDisplayLabel.setString("MagneticType - NONE");

            // Magnetic change button
            var pButton = new ccui.Button("ccs-res/cocosui/backtotoppressed.png", "ccs-res/cocosui/backtotopnormal.png");
            pButton.setAnchorPoint(new cc.Point(0.5, 0.5));
            pButton.setScale(0.8);
            pButton.setPosition(cc.Point.add(new cc.Point(widgetSize.width / 2, widgetSize.height / 2), new cc.Point(130, -60)));
            pButton.setTitleText("Next Magnetic");
            pButton.addClickEventListener(function() {
                var eCurrentType = this._listView.getMagneticType();
                var eNextType;
                var sString;
                if(eCurrentType == ccui.ListView.MAGNETIC_NONE)
                {
                    eNextType = ccui.ListView.MAGNETIC_CENTER;
                    sString = "CENTER";
                }
                else if(eCurrentType == ccui.ListView.MAGNETIC_CENTER)
                {
                    eNextType = ccui.ListView.MAGNETIC_BOTH_END;
                    sString = "BOTH_END";
                }
                else if(eCurrentType == ccui.ListView.MAGNETIC_BOTH_END)
                {
                    if(this._getListViewDirection() == ccui.ScrollView.DIR_HORIZONTAL)
                    {
                        eNextType = ccui.ListView.MAGNETIC_LEFT;
                        sString = "LEFT";
                    }
                    else
                    {
                        eNextType = ccui.ListView.MAGNETIC_TOP;
                        sString = "TOP";
                    }
                }
                else if(eCurrentType == ccui.ListView.MAGNETIC_LEFT)
                {
                    eNextType = ccui.ListView.MAGNETIC_RIGHT;
                    sString = "RIGHT";
                }
                else if(eCurrentType == ccui.ListView.MAGNETIC_RIGHT)
                {
                    eNextType = ccui.ListView.MAGNETIC_NONE;
                    sString = "NONE";
                }
                else if(eCurrentType == ccui.ListView.MAGNETIC_TOP)
                {
                    eNextType = ccui.ListView.MAGNETIC_BOTTOM;
                    sString = "BOTTOM";
                }
                else if(eCurrentType == ccui.ListView.MAGNETIC_BOTTOM)
                {
                    eNextType = ccui.ListView.MAGNETIC_NONE;
                    sString = "NONE";
                }
                this._listView.setMagneticType(eNextType);

                this._topDisplayLabel.setString("MagneticType - " + sString);
            }.bind(this));
            this._mainNode.addChild(pButton);


            // Add list items
            for (var i = 0; i < 40; ++i)
            {
                var button = new ccui.Button("ccs-res/cocosui/button.png", "ccs-res/cocosui/buttonHighlighted.png");
                button.setTitleText("Button-" + i);
                button.setContentSize(100, 70);
                button.setScale9Enabled(true);
                this._listView.pushBackCustomItem(button);
            }

            return true;
        }
        return false;
    }

    _getListViewDirection()
    {

    }

}
