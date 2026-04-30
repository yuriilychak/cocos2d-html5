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
export class UIPageViewDynamicAddAndRemoveTest extends UIMainLayer {
    init(){
        var self = this;
        if (super.init()){
            var widgetSize = this._widget.getContentSize();

            // Add a label in which the dragpanel events will be displayed
            this._topDisplayLabel.setString("Click Buttons on the Left");
            this._topDisplayLabel.x = widgetSize.width / 2.0;
            this._topDisplayLabel.y = widgetSize.height / 2.0 + this._topDisplayLabel.height * 1.5;

            // Add the black background
            this._bottomDisplayLabel.setString("PageView Dynamic Modification");
            this._bottomDisplayLabel.setPosition(widgetSize.width / 2.0, widgetSize.height / 2.0 - this._bottomDisplayLabel.height * 3.075);

            var root = this._mainNode.getChildByTag(81);
            var background = root.getChildByName("background_Panel");

            // Create the page view
            var pageView = new ccui.PageView();
            pageView.setContentSize(new cc.Size(240.0, 130.0));
            pageView.setAnchorPoint(new cc.Point(0.5,0.5));
            var backgroundSize = background.getContentSize();
            pageView.setPosition(new cc.Point(widgetSize.width / 2.0 ,widgetSize.height / 2.0));
            pageView.setBackGroundColor(cc.Color.GREEN);
            pageView.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);

            var pageCount = 4;
            for (var i = 0; i < pageCount; ++i){
                var outerBox = new ccui.HBox();
                outerBox.setContentSize(new cc.Size(240.0, 130.0));

                for (var k = 0; k < 2; ++k){
                    var innerBox = new ccui.VBox();
                    for (var j = 0; j < 3; j++){
                        var btn = new ccui.Button("ccs-res/cocosui/animationbuttonnormal.png",
                            "ccs-res/cocosui/animationbuttonpressed.png");
                        btn.setName("button " + j);
                        innerBox.addChild(btn);
                    }

                    var parameter = new ccui.LinearLayoutParameter();
                    parameter.setMargin({left: 0, top: 0, right: 100, bottom:0});
                    innerBox.setLayoutParameter(parameter);

                    outerBox.addChild(innerBox);
                }
                pageView.insertPage(outerBox,i);
            }

            pageView.addEventListener(this.pageViewEvent, this);
            pageView.setName("pageView");
            this._mainNode.addChild(pageView);

            //add buttons
            var button = new ccui.Button();
            button.setAnchorPoint(0, 0.5);
            button.setTitleFontSize(12);
            button.setPosition(20, 220);
            button.setTitleText("Add A Page");
            button.setZoomScale(0.3);
            button.setPressedActionEnabled(true);
            button.setTitleColor(cc.Color.RED);
            button.addClickEventListener(function(sender){
                var outerBox = new ccui.HBox();
                outerBox.setContentSize(new cc.Size(240.0, 130.0));

                for (var k = 0; k < 2; ++k){
                    var innerBox = new ccui.VBox();
                    for (var j = 0; j < 3; j++){
                        var btn = new ccui.Button("ccs-res/cocosui/animationbuttonnormal.png",
                            "ccs-res/cocosui/animationbuttonpressed.png");
                        btn.setName("button " + j);
                        innerBox.addChild(btn);
                    }

                    var parameter = new ccui.LinearLayoutParameter();
                    parameter.setMargin({left: 0, top: 0, right: 100, bottom: 0});
                    innerBox.setLayoutParameter(parameter);

                    outerBox.addChild(innerBox);
                }

                pageView.addPage(outerBox);
                self._topDisplayLabel.setString("page count = " + pageView.getPages().length);
            });
            this._mainNode.addChild(button);

            var button2 = new ccui.Button();
            button2.setAnchorPoint(0, 0.5);
            button2.setTitleFontSize(12);
            button2.setPosition(20, 180);
            button2.setTitleText("Remove A Page");
            button2.setZoomScale(0.3);
            button2.setPressedActionEnabled(true);
            button2.setTitleColor(cc.Color.RED);
            button2.addClickEventListener(function(sender){
                if (pageView.getPages().length > 0){
                    pageView.removePageAtIndex(pageView.getPages().length-1);
                }else{
                    cc.log("There is no page to remove!");
                }
                self._topDisplayLabel.setString("page count = " + pageView.getPages().length);

            });
            this._mainNode.addChild(button2);

            var button3 = new ccui.Button();
            button3.setAnchorPoint(0, 0.5);
            button3.setTitleFontSize(12);
            button3.setPosition(new cc.Point(20, 140));
            button3.setTitleText("Remove All Pages");
            button3.setZoomScale(0.3);
            button3.setPressedActionEnabled(true);
            button3.setTitleColor(cc.Color.RED);
            button3.addClickEventListener(function(sender){
                pageView.removeAllPages();
                self._topDisplayLabel.setString("page count = " + pageView.getPages().length);
            });
            this._mainNode.addChild(button3);

            return true;
        }
    }

    pageViewEvent(pageView, type){
        switch (type){
            case ccui.PageView.EVENT_TURNING:
                this._topDisplayLabel.setString("page = " + (pageView.getCurPageIndex() + 1));
                break;
            default:
                break;
        }
    }

}
