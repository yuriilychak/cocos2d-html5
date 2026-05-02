/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
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

//////////////////////////////////////////////////////////////////////////
// TextFieldTTFDefaultTest for test TextFieldTTF default behavior.
//////////////////////////////////////////////////////////////////////////
import { KeyboardNotificationLayer } from "./keyboard-notification-layer";
import {
  TEXT_INPUT_FONT_NAME,
  TEXT_INPUT_FONT_SIZE
} from "./text-input-test-constants";
import { Director, log } from "@aspect/core";

import { TextFieldTTF } from "@aspect/text-input";
export class TextFieldTTFDefaultTest extends KeyboardNotificationLayer {
  subtitle() {
    return "TextFieldTTF with default behavior test";
  }
  onClickTrackNode(clicked) {
    var textField = this._trackNode;
    if (clicked) {
      // TextFieldTTFTest be clicked
      log("TextFieldTTFDefaultTest:CCTextFieldTTF attachWithIME");
      textField.attachWithIME();
    } else {
      // TextFieldTTFTest not be clicked
      log("TextFieldTTFDefaultTest:CCTextFieldTTF detachWithIME");
      textField.detachWithIME();
    }
  }

  onEnter() {
    super.onEnter();

    // add CCTextFieldTTF
    var winSize = Director.getInstance().getWinSize();

    var textField = new TextFieldTTF(
      "<click here for input>",
      TEXT_INPUT_FONT_NAME,
      TEXT_INPUT_FONT_SIZE
    );
    this.addChild(textField);
    textField.x = winSize.width / 2;
    textField.y = winSize.height / 2;

    this._trackNode = textField;
  }
}
