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

import { UILayoutTestBase } from "./uilayout-test-base.js";

export class UILayoutTest_Layout_Relative extends UILayoutTestBase {
    createLayout() {
        var layout = new ccui.Layout();
        layout.ignoreContentAdaptWithSize(false);
        layout.setLayoutType(ccui.Layout.RELATIVE);
        layout.sizeType = ccui.Widget.SIZE_PERCENT;
        layout.setSizePercent(new cc.Point(0.5, 0.5));
        //layout.setContentSize(new cc.Size(280, 150));
        layout.setPositionType(ccui.Widget.POSITION_PERCENT);
        layout.setPositionPercent(new cc.Point(0.25, 0.25));
        //layout.setPosition(new cc.Point(cc.winSize.width/2, cc.winSize.height/2));
        layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        layout.setBackGroundColor(cc.Color.GREEN);
        return layout;
    }
    getText() {
        return "Layout Layout Relative";
    }
    setLayoutParameter() {
        var lp1 = new ccui.RelativeLayoutParameter();
        this.button.setLayoutParameter(lp1);
        lp1.setAlign(ccui.RelativeLayoutParameter.PARENT_TOP_LEFT);

        var lp2 = new ccui.RelativeLayoutParameter();
        this.textButton.setLayoutParameter(lp2);
        lp2.setAlign(ccui.RelativeLayoutParameter.CENTER_IN_PARENT);

        var lp3 = new ccui.RelativeLayoutParameter();
        this.button_scale9.setLayoutParameter(lp3);
        lp3.setAlign(ccui.RelativeLayoutParameter.PARENT_RIGHT_BOTTOM);
    }

}
