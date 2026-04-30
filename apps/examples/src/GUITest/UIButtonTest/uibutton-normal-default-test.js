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

export class UIButtonNormalDefaultTest extends UIMainLayer {
    init(){
        if (super.init()) {
            var widgetSize = this._widget.getContentSize();

            // Add a label in which the button events will be displayed
            this._topDisplayLabel.setString("");
            this._bottomDisplayLabel.setString("");

            // Add the alert
            var alert = new ccui.Text("Button should scale when clicked","Arial",20);
            alert.setColor(new cc.Color(159, 168, 176));
            alert.setPosition(widgetSize.width / 2.0,
                    widgetSize.height / 2.0 - alert.height * 1.75);
            this._mainNode.addChild(alert);

            // Create the button
            var button = new ccui.Button("ccs-res/cocosui/animationbuttonnormal.png");
            button.setPosition(widgetSize.width / 2.0 - 80, widgetSize.height / 2.0 + 40);
            button.setZoomScale(0.4);
            button.setPressedActionEnabled(true);
            this._mainNode.addChild(button);

            // Create the button
            var buttonScale9 = new ccui.Button("ccs-res/cocosui/button.png");
            // open scale9 render
            buttonScale9.setScale9Enabled(true);
            buttonScale9.setPosition(widgetSize.width / 2.0 + 50, widgetSize.height / 2.0 + 40);
            buttonScale9.setContentSize(150, 70);
            buttonScale9.setPressedActionEnabled(true);
            this._mainNode.addChild(buttonScale9);
            return true;
        }
        return false;
    }

}
