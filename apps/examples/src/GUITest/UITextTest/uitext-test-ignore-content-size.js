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
export class UITextTest_IgnoreContentSize extends UIMainLayer {

    init(){
        if(super.init()){
            var widgetSize = this._widget.getContentSize();

            this._bottomDisplayLabel.setString("");

            var leftText = new ccui.Text("ignore content", "Marker Felt", 10);
            leftText.setPosition(new Point(widgetSize.width / 2 - 50,
                widgetSize.height / 2));
            leftText.ignoreContentAdaptWithSize(false);
            leftText.setTextAreaSize(new Size(60,60));
            leftText.setString("Text line with break\nText line with break\nText line with break\nText line with break\n");
            leftText.setTouchScaleChangeEnabled(true);
            leftText.setTouchEnabled(true);
            this._mainNode.addChild(leftText);

            var rightText = new ccui.Text("ignore content", "Marker Felt", 10);
            rightText.setPosition(new Point(widgetSize.width / 2 + 50,
                widgetSize.height / 2));
            rightText.setString("Text line with break\nText line with break\nText line with break\nText line with break\n");
            //note: setTextAreaSize must be used with ignoreContentAdaptWithSize(false)
            rightText.setTextAreaSize(new Size(100,30));
            rightText.ignoreContentAdaptWithSize(false);
            this._mainNode.addChild(rightText);

            var halighButton = new ccui.Button();
            halighButton.setTitleText("Alignment Right");
            halighButton.addClickEventListener(function(){
                leftText.setTextHorizontalAlignment(TEXT_ALIGNMENT_RIGHT);
                rightText.setTextHorizontalAlignment(TEXT_ALIGNMENT_RIGHT);
            });
            halighButton.setPosition(new Point(widgetSize.width/2 - 50,
                    widgetSize.height/2 - 50));
            this._mainNode.addChild(halighButton);

            return true;
        }
    }


}
