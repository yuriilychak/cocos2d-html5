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

//
// UIRichTextXMLSmallBig
//
export class UIRichTextXMLSmallBig extends UIMainLayer {
    constructor() {
        super();
        this._richText = null;
    }

    init() {
        if (super.init()) {
            //init text
            this._topDisplayLabel.setString("");
            this._bottomDisplayLabel.setString("RichText");

            var widgetSize = this._widget.getContentSize();
            var button = new ccui.Button();
            button.setTouchEnabled(true);
            button.loadTextures("ccs-res/cocosui/animationbuttonnormal.png", "ccs-res/cocosui/animationbuttonpressed.png", "");
            button.setTitleText("switch");
            button.setPosition(new Point(widgetSize.width / 2, widgetSize.height / 2 + button.getContentSize().height * 2.5));
            button.addTouchEventListener(this.touchEvent,this);
            this._mainNode.addChild(button);

            // RichText
            var richText = new ccui.RichText();
            richText.initWithXML("Regular size.<small>smaller size.</small><big>bigger.<small>normal.</small>bigger</big>.normal.");

            richText.ignoreContentAdaptWithSize(false);
            richText.width = 120;
            richText.height = 100;

            richText.x = widgetSize.width / 2;
            richText.y = widgetSize.height / 2;

            this._mainNode.addChild(richText);
            this._richText = richText;
            return true;
        }
        return false;
    }
    touchEvent(sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            if (this._richText.isIgnoreContentAdaptWithSize()) {
                this._richText.ignoreContentAdaptWithSize(false);
                this._richText.setContentSize(new Size(120, 100));
            } else {
                this._richText.ignoreContentAdaptWithSize(true);
            }
        }
    }

}
