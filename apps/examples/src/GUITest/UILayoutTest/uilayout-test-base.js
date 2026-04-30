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

export class UILayoutTestBase extends UIMainLayer {
    constructor() {
        super();
        this.layout = null;
        this.button = null;
        this.textButton = null;
        this.button_scale9 = null;
    }

    init() {
        if (super.init()) {
            var widgetSize = this._widget.getContentSize();
            //init text
            this._topDisplayLabel.setString("");
            this._bottomDisplayLabel.setString(this.getText());
            this._bottomDisplayLabel.x = widgetSize.width / 2;
            this._bottomDisplayLabel.y = widgetSize.height / 2 - this._bottomDisplayLabel.height * 3;

            var background = this._widget.getChildByName("background_Panel");
            this._mainNode.width = widgetSize.width;
            this._mainNode.height = widgetSize.height;

            // Create the layout
            this.layout = this.createLayout();
            var layoutRect = this.layout.getContentSize();
            var backgroundRect = background.getContentSize();
            this.layout.x = (widgetSize.width - backgroundRect.width) / 2 + (backgroundRect.width - layoutRect.width) / 2;
	        this.layout.y = (widgetSize.height - backgroundRect.height) / 2 + (backgroundRect.height - layoutRect.height) / 2;
            this._mainNode.addChild(this.layout);

            this.button = new ccui.Button();
            this.button.setTouchEnabled(true);
            this.button.loadTextures("ccs-res/cocosui/animationbuttonnormal.png", "ccs-res/cocosui/animationbuttonpressed.png", "");
            this.button.x = this.button.width / 2;
            this.button.y = layoutRect.height - this.button.height / 2;
            this.layout.addChild(this.button);

            this.textButton = new ccui.Button();
            this.textButton.setTouchEnabled(true);
            this.textButton.loadTextures("ccs-res/cocosui/backtotopnormal.png", "ccs-res/cocosui/backtotoppressed.png", "");
            this.textButton.setTitleText("Text Button");
            this.textButton.x = layoutRect.width / 2;
            this.textButton.y = layoutRect.height / 2;
            this.layout.addChild(this.textButton);

            this.button_scale9 = new ccui.Button();
            this.button_scale9.setTouchEnabled(true);
            this.button_scale9.setScale9Enabled(true);
            this.button_scale9.loadTextures("ccs-res/cocosui/button.png", "ccs-res/cocosui/buttonHighlighted.png", "");
            this.button_scale9.width = 100;
	        this.button_scale9.height = 32;
            this.button_scale9.x = layoutRect.width - this.button_scale9.width / 2;
            this.button_scale9.y = this.button_scale9.height / 2;
            this.layout.addChild(this.button_scale9);

            this.setLayoutParameter();
            return true;
        }
        return false;
    }
    getText() {
        return "";
    }
    createLayout() {
        var layout = new ccui.Layout();
        layout.setContentSize(new cc.Size(280, 150));
        return layout;
    }
    setLayoutParameter() {

    }

}
