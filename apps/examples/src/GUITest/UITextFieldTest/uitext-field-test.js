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

import { UIMainLayer } from "../uimain-layer";

export class UITextFieldTest extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();
      //init text
      this._topDisplayLabel.setString("No Event");
      this._topDisplayLabel.setAnchorPoint(new cc.Point(0.5, -1));
      this._topDisplayLabel.setPosition(
        new cc.Point(
          widgetSize.width / 2.0,
          widgetSize.height / 2.0 +
            this._topDisplayLabel.getContentSize().height * 1.5
        )
      );

      this._bottomDisplayLabel.setString("TextField");
      this._bottomDisplayLabel.setPosition(
        new cc.Point(
          widgetSize.width / 2.0,
          widgetSize.height / 2.0 -
            this._bottomDisplayLabel.getContentSize().height * 3.4
        )
      );
      this._bottomDisplayLabel.setColor(new cc.Color(255, 255, 255, 255));

      // Create the textfield
      var textField = new ccui.TextField("PlaceHolder", "Marker Felt", 30);
      textField.x = widgetSize.width / 2.0;
      textField.y = widgetSize.height / 2.0;
      textField.addEventListener(this.textFieldEvent, this);
      this._mainNode.addChild(textField);

      return true;
    }
    return false;
  }

  textFieldEvent(textField, type) {
    switch (type) {
      case ccui.TextField.EVENT_ATTACH_WITH_IME:
        var widgetSize = this._widget.getContentSize();
        textField.runAction(
          new cc.MoveTo(
            0.225,
            new cc.Point(widgetSize.width / 2, widgetSize.height / 2 + 30)
          )
        );
        this._topDisplayLabel.setString("attach with IME");
        break;
      case ccui.TextField.EVENT_DETACH_WITH_IME:
        var widgetSize = this._widget.getContentSize();
        textField.runAction(
          new cc.MoveTo(
            0.175,
            new cc.Point(widgetSize.width / 2.0, widgetSize.height / 2.0)
          )
        );
        this._topDisplayLabel.setString("detach with IME");
        break;
      case ccui.TextField.EVENT_INSERT_TEXT:
        this._topDisplayLabel.setString("insert words");
        break;
      case ccui.TextField.EVENT_DELETE_BACKWARD:
        this._topDisplayLabel.setString("delete word");
        break;
      default:
        break;
    }
  }
}
