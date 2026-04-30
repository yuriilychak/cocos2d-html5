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

//2015-01-14
export class UIPageViewButtonTest extends UIMainLayer {
    init(){
        if (super.init()){
            var widgetSize = this._widget.getContentSize();

            // Add a label in which the dragpanel events will be displayed
            this._topDisplayLabel.setString("Move by horizontal direction");
            this._topDisplayLabel.x = widgetSize.width / 2.0;
            this._topDisplayLabel.y = widgetSize.height / 2.0 + this._topDisplayLabel.height * 1.5;

            // Add the black background
            this._bottomDisplayLabel.setString("PageView with Buttons");
            this._bottomDisplayLabel.setPosition(widgetSize.width / 2.0, widgetSize.height / 2.0 - this._bottomDisplayLabel.height * 3.075);

            var root = this._mainNode.getChildByTag(81);
            var background = root.getChildByName("background_Panel");

            // Create the page view
            var pageView = new ccui.PageView();
            pageView.setContentSize(new cc.Size(240.0, 130.0));
            var backgroundSize = background.getContentSize();
            pageView.setPosition(new cc.Point((widgetSize.width - backgroundSize.width) / 2.0 +
                (backgroundSize.width - pageView.getContentSize().width) / 2.0,
                (widgetSize.height - backgroundSize.height) / 2.0 +
                (backgroundSize.height - pageView.getContentSize().height) / 2.0));

            pageView.removeAllPages();

            var pageCount = 4;
            for (var i = 0; i < pageCount; ++i){
                var outerBox = new ccui.HBox();
                outerBox.setContentSize(new cc.Size(240.0, 130.0));

                for (var k = 0; k < 2; ++k) {
                    var innerBox = new ccui.VBox();

                    for (var j = 0; j < 3; j++) {
                        var btn = new ccui.Button("ccs-res/cocosui/animationbuttonnormal.png", "ccs-res/cocosui/animationbuttonpressed.png");
                        btn.setName("button " + j);
                        btn.addTouchEventListener( this.onButtonClicked, this);
                        innerBox.addChild(btn);
                    }

                    var parameter = new ccui.LinearLayoutParameter();
                    parameter.setMargin({left: 0, top: 0, right: 100, bottom: 0});
                    innerBox.setLayoutParameter(parameter);

                    outerBox.addChild(innerBox);
                }
                pageView.insertPage(outerBox,i);
            }

            pageView.removePageAtIndex(0);
            pageView.addEventListener(this.pageViewEvent, this);
            this._mainNode.addChild(pageView);

            return true;
        }
    }

    onButtonClicked(sender, type){
        cc.log("button %s clicked", sender.getName());
    }

    pageViewEvent(pageView, type){
        switch (type){
            case ccui.PageView.EVENT_TURNING:
                this._topDisplayLabel.setString("page = " + pageView.getCurPageIndex() + 1);
                break;
            default:
                break;
        }
    }

}
