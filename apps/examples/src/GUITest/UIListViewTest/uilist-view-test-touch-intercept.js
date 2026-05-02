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
import { Button, Layout, ListView, ScrollView } from "@aspect/ccui";

export class UIListViewTest_TouchIntercept extends UIMainLayer {
    init() {
        if(super.init()) {
            var widgetSize = this._widget.getContentSize();
            var background = this._widget.getChildByName("background_Panel");
            var backgroundSize = background.getContentSize();

            this._topDisplayLabel.setString("TouchIntercept");
            this._topDisplayLabel.x = widgetSize.width / 2.0;
            this._topDisplayLabel.y = widgetSize.height / 2.0 + this._topDisplayLabel.height * 1.5;
            this._bottomDisplayLabel.setString("ListView Disable Touch");
            this._bottomDisplayLabel.x = widgetSize.width / 2;
            this._bottomDisplayLabel.y = widgetSize.height / 2 - this._bottomDisplayLabel.height * 3;

            // Create the list view
            var listView = new ListView();
            // set list view ex direction
            listView.setDirection(ScrollView.DIR_NONE);
            listView.setBounceEnabled(true);
            listView.setTouchEnabled(false);
            listView.setBackGroundImage("ccs-res/cocosui/green_edit.png");
            listView.setBackGroundImageScale9Enabled(true);
            listView.setContentSize(new Size(240, 130));
            listView.x = (widgetSize.width - backgroundSize.width) / 2 + (backgroundSize.width - listView.width) / 2;
            listView.y = (widgetSize.height - backgroundSize.height) / 2 + (backgroundSize.height - listView.height) / 2;
            this._mainNode.addChild(listView);

            // create model
            var default_button = new Button();
            default_button.setName("Title Button");
            default_button.loadTextures("ccs-res/cocosui/backtotoppressed.png", "ccs-res/cocosui/backtotopnormal.png", "");

            var default_item = new Layout();
            default_item.setTouchEnabled(true);
            default_item.setContentSize(default_button.getContentSize());
            default_item.width = listView.width;
            default_button.x = default_item.width / 2;
            default_button.y = default_item.height / 2;
            default_item.addChild(default_button);

            // set model
            listView.setItemModel(default_item);
            listView.pushBackDefaultItem();
            listView.pushBackDefaultItem();
            listView.pushBackDefaultItem();

            return true;
        }
        return false;
    }

}
