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
import { UIMainLayer } from "../uimain-layer";
import { Size, TEXT_ALIGNMENT_CENTER } from "@aspect/core";
export class UITextTest_LineWrap extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();

      this._bottomDisplayLabel.setString("Text line wrap");

      // Create the line wrap
      var text = new ccui.Text(
        "TextArea Widget can line wrap",
        "AmericanTypewriter",
        32
      );
      text.ignoreContentAdaptWithSize(false);
      text.setContentSize(new Size(280, 150));
      text.setTextHorizontalAlignment(TEXT_ALIGNMENT_CENTER);
      text.setTouchScaleChangeEnabled(true);
      text.setTouchEnabled(true);
      text.addTouchEventListener(function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
          if (text.width == 280) {
            text.setContentSize(new Size(380, 100));
          } else {
            text.setContentSize(new Size(280, 150));
          }
        }
      });
      text.setPosition(
        widgetSize.width / 2,
        widgetSize.height / 2 - text.height / 8
      );
      this._mainNode.addChild(text);

      return true;
    }
  }
}
