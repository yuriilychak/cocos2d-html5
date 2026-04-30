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
// TextFieldTTFActionTest
//////////////////////////////////////////////////////////////////////////
import { KeyboardNotificationLayer } from "./keyboard-notification-layer.js";
import { TEXT_INPUT_FONT_NAME, TEXT_INPUT_FONT_SIZE } from "./text-input-test-constants.js";

export class TextFieldTTFActionTest extends KeyboardNotificationLayer {

    constructor() {
        super();


        this._textField = null;


        this._textFieldAction = null;


        this._action = false;


        this._charLimit = 0; // the textfield max char limit
    }

    callbackRemoveNodeWhenDidAction(node) {
        this.removeChild(node, true);
    }

    // KeyboardNotificationLayer
    subtitle() {
        return "CCTextFieldTTF with action and char limit test";
    }
    onClickTrackNode(clicked) {
        var textField = this._trackNode;
        if (clicked) {
            // TextFieldTTFTest be clicked
            cc.log("TextFieldTTFActionTest:CCTextFieldTTF attachWithIME");
            textField.attachWithIME();
        } else {
            // TextFieldTTFTest not be clicked
            cc.log("TextFieldTTFActionTest:CCTextFieldTTF detachWithIME");
            textField.detachWithIME();
        }
    }

    //CCLayer
    onEnter() {
        super.onEnter();

        this._charLimit = 20;
        this._textFieldAction = cc.sequence(
            new cc.FadeOut(0.25),
            new cc.FadeIn(0.25)
        ).repeatForever();
        this._action = false;

        // add CCTextFieldTTF
        var winSize = cc.director.getWinSize();

        this._textField = new cc.TextFieldTTF("<click here for input>",
            TEXT_INPUT_FONT_NAME,
            TEXT_INPUT_FONT_SIZE);
        this.addChild(this._textField);
        this._textField.setDelegate(this);

        this._textField.x = winSize.width / 2;
        this._textField.y = winSize.height / 2;
        this._trackNode = this._textField;
    }

    //CCTextFieldDelegate
    onTextFieldAttachWithIME(sender) {
        if (!this._action) {
            this._textField.runAction(this._textFieldAction);
            this._action = true;
        }
        return false;
    }
    onTextFieldDetachWithIME(sender) {
        if (this._action) {
            this._textField.stopAction(this._textFieldAction);
            this._textField.opacity = 255;
            this._action = false;
        }
        return false;
    }
    onTextFieldInsertText(sender, text, len) {
        // if insert enter, treat as default to detach with ime
        if ('\n' == text) {
            return false;
        }

        // if the textfield's char count more than m_nCharLimit, doesn't insert text anymore.
        if (sender.getCharCount() >= this._charLimit) {
            return true;
        }

        // create a insert text sprite and do some action
        var label = new cc.LabelTTF(text, TEXT_INPUT_FONT_NAME, TEXT_INPUT_FONT_SIZE);
        this.addChild(label);
        var color = new cc.Color(226, 121, 7);
        label.color = color;

        // move the sprite from top to position
        var endX = sender.x, endY = sender.y;
        if (sender.getCharCount()) {
            endX += sender.width / 2;
        }

        var duration = 0.5;
        label.x = endX;
        label.y = cc.director.getWinSize().height - label.height * 2;
        label.scale = 8;

        var seq = cc.sequence(
            cc.spawn(
                new cc.MoveTo(duration, new cc.Point(endX, endY)),
                new cc.ScaleTo(duration, 1),
                new cc.FadeOut(duration)),
            new cc.CallFunc(this.callbackRemoveNodeWhenDidAction, this));
        label.runAction(seq);
        return false;
    }

    onTextFieldDeleteBackward(sender, delText, len) {
        // create a delete text sprite and do some action
        var label = new cc.LabelTTF(delText, TEXT_INPUT_FONT_NAME, TEXT_INPUT_FONT_SIZE);
        this.addChild(label);

        // move the sprite to fly out
        var beginX = sender.x, beginY = sender.y;
        beginX += (sender.width - label.width) / 2.0;

        var winSize = cc.director.getWinSize();
        var endPos = new cc.Point(-winSize.width / 4.0, winSize.height * (0.5 + Math.random() / 2.0));

        var duration = 1;
        var rotateDuration = 0.2;
        var repeatTime = 5;
        label.x = beginX;
        label.y = beginY;

        var seq = cc.sequence(
            cc.spawn(
                new cc.MoveTo(duration, endPos),
                new cc.RotateBy(rotateDuration, (Math.random() % 2) ? 360 : -360).repeat(repeatTime),
                new cc.FadeOut(duration)),
            new cc.CallFunc(this.callbackRemoveNodeWhenDidAction, this));
        label.runAction(seq);
        return false;
    }
    onDraw(sender) {
        return false;
    }

}
