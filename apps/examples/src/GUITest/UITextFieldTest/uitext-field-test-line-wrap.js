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
import { Color, Point, TEXT_ALIGNMENT_CENTER, TEXT_ALIGNMENT_LEFT, VERTICAL_TEXT_ALIGNMENT_TOP } from "@aspect/core";
import { MoveTo } from "@aspect/actions";
import { Text, TextField } from "@aspect/ccui";

export class UITextFieldTest_LineWrap extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();

      // Add a label in which the textfield events will be displayed
      this._topDisplayLabel.setString("No Event");
      this._topDisplayLabel.setPosition(
        widgetSize.width / 2,
        widgetSize.height / 2 + this._topDisplayLabel.height * 1.5
      );
      this._bottomDisplayLabel.setString("");

      // Add the alert
      var alert = new Text("TextField line wrap", "Marker Felt", 30);
      alert.setColor(new Color(159, 168, 176));
      alert.setPosition(
        new Point(
          widgetSize.width / 2,
          widgetSize.height / 2 - alert.height * 3.075
        )
      );
      this._mainNode.addChild(alert);

      // Create the textfield
      var textField = new TextField("input words here", "Marker Felt", 30);
      textField.ignoreContentAdaptWithSize(false);
      //textField.getVirtualRenderer().setLineBreakWithoutSpace(true);
      textField.setContentSize(240, 120);
      textField.setString("input words here");
      textField.setTextHorizontalAlignment(TEXT_ALIGNMENT_CENTER);
      textField.setTextVerticalAlignment(TEXT_ALIGNMENT_CENTER);
      textField.setPosition(widgetSize.width / 2, widgetSize.height / 2);
      textField.addEventListener(this.textFieldEvent, this);
      this._mainNode.addChild(textField);
      return true;
    }
  }

  textFieldEvent(textField, type) {
    var widgetSize = this._widget.getContentSize();
    switch (type) {
      case TextField.EVENT_ATTACH_WITH_IME:
        textField.runAction(
          new MoveTo(
            0.225,
            new Point(widgetSize.width / 2, widgetSize.height / 2 + 30)
          )
        );
        textField.setTextHorizontalAlignment(TEXT_ALIGNMENT_LEFT);
        textField.setTextVerticalAlignment(VERTICAL_TEXT_ALIGNMENT_TOP);
        this._topDisplayLabel.setString("attach with IME");
        break;
      case TextField.EVENT_DETACH_WITH_IME:
        textField.runAction(
          new MoveTo(
            0.175,
            new Point(widgetSize.width / 2, widgetSize.height / 2)
          )
        );
        textField.setTextHorizontalAlignment(TEXT_ALIGNMENT_CENTER);
        textField.setTextVerticalAlignment(TEXT_ALIGNMENT_CENTER);
        this._topDisplayLabel.setString("detach with IME");
        break;
      case TextField.EVENT_INSERT_TEXT:
        this._topDisplayLabel.setString("insert words");
        break;
      case TextField.EVENT_DELETE_BACKWARD:
        this._topDisplayLabel.setString("delete word");
        break;
      default:
        break;
    }
    this._bottomDisplayLabel.setString(textField.getString());
  }
}
