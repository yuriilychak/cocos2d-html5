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

export class UIFocusTestNestedLayout1 extends UIFocusTestBase {
    constructor() {
        super();
        this._verticalLayout = null;
        this._loopText = null;
    }


    init(){
        if (super.init()) {
            var winSize = director.getVisibleSize();

            this._verticalLayout = new ccui.VBox();
            this._verticalLayout.setPosition(winSize.width/2 - 100, winSize.height - 100);
            this.addChild(this._verticalLayout);
            //this._verticalLayout.setScale(0.5);

            this._verticalLayout.setFocused(true);
            this._verticalLayout.setLoopFocus(true);
            this._verticalLayout.setTag(100);
            this._firstFocusedWidget = this._verticalLayout;

            var count1 = 1, i, w;
            for (i = 0; i < count1; ++i) {
                w = new ccui.ImageView("ccs-res/cocosui/scrollviewbg.png");
                w.setAnchorPoint(0, 0);
                w.setTouchEnabled(true);
                w.setScaleX(2.5);
                w.setTag(i + count1);
                w.addTouchEventListener(this.onImageViewClicked, this);
                this._verticalLayout.addChild(w);
            }
            //add HBox into VBox
            var hbox = new ccui.HBox();
            hbox.setScale(0.8);
            hbox.setTag(101);
            this._verticalLayout.addChild(hbox);

            var count2 = 2;
            for (i=0; i < count2; ++i) {
                w = new ccui.ImageView("ccs-res/cocosui/scrollviewbg.png");
                w.setAnchorPoint(0,1);
                w.setScaleY(2.0);
                w.setTouchEnabled(true);
                w.setTag(i+count1+count2);
                w.addTouchEventListener(this.onImageViewClicked, this);
                hbox.addChild(w);
            }
            var innerVBox = new ccui.VBox();
            hbox.addChild(innerVBox);
            innerVBox.setTag(102);
//          innerVBox.setPassFocusToChild(false);
//          innerVBox.setFocusEnabled(false);

            var count3 = 2;
            for (i=0; i<count3; ++i) {
                w = new ccui.ImageView("ccs-res/cocosui/scrollviewbg.png");
                w.setTouchEnabled(true);
                w.setTag(i+count1+count2+count3);
                w.addTouchEventListener(this.onImageViewClicked, this);
                innerVBox.addChild(w);
            }
            this._loopText = new ccui.Text("loop enabled", "Arial", 20);
            this._loopText.setPosition(winSize.width/2, winSize.height - 50);
            this._loopText.setColor(Color.GREEN);
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
