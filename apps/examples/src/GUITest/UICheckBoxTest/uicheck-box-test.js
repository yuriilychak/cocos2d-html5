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

export class UICheckBoxTest extends UIMainLayer {
    init() {
        if (super.init()) {
            //init text
            this._topDisplayLabel.setString("No Event");
            this._bottomDisplayLabel.setString("CheckBox");

            var widgetSize = this._widget.getContentSize();
            // Create the checkbox
            var checkBox = new ccui.CheckBox();
            checkBox.setTouchEnabled(true);
            checkBox.loadTextures("ccs-res/cocosui/check_box_normal.png",
                "ccs-res/cocosui/check_box_normal_press.png",
                "ccs-res/cocosui/check_box_active.png",
                "ccs-res/cocosui/check_box_normal_disable.png",
                "ccs-res/cocosui/check_box_active_disable.png");
            checkBox.x = widgetSize.width / 2.0;
	        checkBox.y = widgetSize.height / 2.0;
            checkBox.addEventListener(this.selectedStateEvent, this);
            this._mainNode.addChild(checkBox);

            return true;
        }
        return false;
    }

    selectedStateEvent(sender, type) {
        switch (type) {
            case  ccui.CheckBox.EVENT_UNSELECTED:
                this._topDisplayLabel.setString("Unselected");
                break;
            case ccui.CheckBox.EVENT_SELECTED:
                this._topDisplayLabel.setString("Selected");
                break;

            default:
                break;
        }
    }

}
