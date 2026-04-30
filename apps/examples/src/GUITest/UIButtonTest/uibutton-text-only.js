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

export class UIButtonTextOnly extends UIMainLayer {
    init(){
        if (super.init()) {
            // Add a label in which the button events will be displayed
            this._topDisplayLabel.setString("Text Only Button");
            this._bottomDisplayLabel.setString("");

            // Create the button
            var button = new ccui.Button();
            button.setNormalizedPosition(0.5, 0.5);

            button.setTitleText("PLAY GAME");
            cc.log("content size should be greater than 0:  width = %f, height = %f", button.width, button.height);
            button.setZoomScale(0.3);
            button.setPressedActionEnabled(true);
            button.addClickEventListener(function () {
                cc.log("clicked!");
            });
            this.addChild(button);
            return true;
        }
        return false;
    }

}
