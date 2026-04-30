/****************************************************************************
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

import { UIFocusTestBase } from "./uifocus-test-base.js";

export class UIFocusTestNestedLayout3 extends UIFocusTestBase {
    constructor() {
        super();
        this._horizontalLayout = null;
        this._loopText = null;
    }


    init(){
        if (super.init()) {
            var winSize = cc.director.getVisibleSize();

            this._verticalLayout = new ccui.VBox();
            this._verticalLayout.setPosition(winSize.height / 2 + 80, winSize.height - 150);
            this.addChild(this._verticalLayout);
            //this._verticalLayout.setScale(0.8);

            this._verticalLayout.setFocused(true);
            this._verticalLayout.setLoopFocus(true);
            this._verticalLayout.setTag(-1000);
            this._firstFocusedWidget = this._verticalLayout;

            var upperHBox = new ccui.HBox();
            upperHBox.setTag(-200);
            this._verticalLayout.addChild(upperHBox);

            var params = new ccui.LinearLayoutParameter();
            params.setMargin(new ccui.Margin(0,0,50,0));

            var vparams = new ccui.LinearLayoutParameter();
            vparams.setMargin(new ccui.Margin(10, 0, 0, 140));
            upperHBox.setLayoutParameter(vparams);

            var count = 3, i, w;
            for (i = 0; i < count; ++i) {
                var firstVbox = new ccui.VBox();
                firstVbox.setScale(0.5);
                firstVbox.setLayoutParameter(params);
                firstVbox.setTag((i+1) * 100);

                var count1 = 3;
                for (var j = 0; j < count1; ++j) {
                    w = new ccui.ImageView("ccs-res/cocosui/scrollviewbg.png");
                    w.setTouchEnabled(true);
                    w.setTag(j + firstVbox.getTag() + 1);
                    w.addTouchEventListener(this.onImageViewClicked, this);
                    firstVbox.addChild(w);
                }
                upperHBox.addChild(firstVbox);
            }

            var bottomHBox = new ccui.HBox();
            bottomHBox.setScale(0.5);
            bottomHBox.setTag(600);
            bottomHBox.setLayoutParameter(vparams);
            count = 3;
            var bottomParams = new ccui.LinearLayoutParameter();
            bottomParams.setMargin(new ccui.Margin(0, 0, 8, 0));
            for (i = 0; i < count; ++i) {
                w = new ccui.ImageView("ccs-res/cocosui/scrollviewbg.png");
                w.setLayoutParameter(bottomParams);
                w.setTouchEnabled(true);
                w.setTag(i + 601);
                w.addTouchEventListener(this.onImageViewClicked, this);
                bottomHBox.addChild(w);
            }
            this._verticalLayout.addChild(bottomHBox);

            this._loopText = new ccui.Text("loop enabled", "Arial", 20);
            this._loopText.setPosition(winSize.width/2, winSize.height - 50);
            this._loopText.setColor(cc.Color.GREEN);
            this.addChild(this._loopText);

            this._btn.addTouchEventListener(this.toggleFocusLoop,this);
            return true;
        }
        return false;
    }

    toggleFocusLoop(ref, touchType){
        if (touchType == ccui.Widget.TOUCH_ENDED) {
            this._verticalLayout.setLoopFocus(!this._verticalLayout.isLoopFocus());
            if (this._verticalLayout.isLoopFocus()) {
                this._loopText.setString("loop enabled");
            }else{
                this._loopText.setString("loop disabled");
            }
        }
    }

}
