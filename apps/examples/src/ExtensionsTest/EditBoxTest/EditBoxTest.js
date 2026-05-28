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

import { TestScene } from "../../test-scene";
import { Color, Director, Layer, Size, log, Rect } from "@aspect/core";
import { Scale9Sprite } from "@aspect/ccui";
import { s_markerFelt_fnt } from "../../resources";

import { EditBox, EDITBOX_INPUT_FLAG_PASSWORD } from "@aspect/editbox";
export class EditBoxTestLayer extends Layer {
  constructor() {
    super();

    this._box1 = null;

    this._box2 = null;

    this._box3 = null;

    this._box4 = null;
    this.init();
  }

  init() {
    this._box1 = this.createEditBox(
      170,
      50,
      220,
      50,
      new Color(240, 200, 0),
      new Color(251, 250, 0)
    );

    this._box2 = this.createEditBox(
      130,
      50,
      220,
      190,
      new Color(0, 200, 0),
      new Color(255, 250, 0)
    );
    this._box2.string = "EditBox Sample";
    this._box2.inputFlag = EDITBOX_INPUT_FLAG_PASSWORD;
    this._box2.placeholder = "please enter password";
    this._box2.placeholderFontColor = new Color(255, 255, 255);

    this._box3 = this.createEditBox(
      65,
      50,
      220,
      250,
      new Color(200, 200, 0),
      new Color(15, 250, 245)
    );
    this._box3.string = "Image";
    this._box3.setTouchEnabled(false);
    this._box3.setTouchEnabled(true);
    this.addChild(this._box3);

    this._box4 = this.createEditBox(
      180,
      50,
      40,
      300,
      new Color(230, 230, 0),
      new Color(5, 4, 10)
    );
    this._box4.placeholderFontColor = new Color(255, 0, 0);
    this._box4.placeholder = "This editBox can't be touched!";
    this._box4.maxLength = 10;
    this._box4.setTouchEnabled(false);

    return true;
  }

  createEditBox(width, height, x, y, color, fontColor) {
    const background = new Scale9Sprite(
      "default_theme/rounded_shadow_4.png",
      new Rect(8, 8, 8, 8)
    );
    const editBox = new EditBox(
      new Size(width, height),
      background,
      "archivo_black_regular_12.fnt",
      new Rect(8, 8, 8, 8)
    );
    background.color = color;
    editBox.string = "EditBoxs";
    editBox.x = x;
    editBox.y = y;
    editBox.fontColor = fontColor;
    editBox.delegate = this;
    this.addChild(editBox);

    return editBox;
  }

  editBoxEditingDidBegin(editBox) {
    log("editBox " + this._getEditBoxName(editBox) + " DidBegin !");
  }

  editBoxEditingDidEnd(editBox) {
    log("editBox " + this._getEditBoxName(editBox) + " DidEnd !");
  }

  editBoxTextChanged(editBox, text) {
    log(
      "editBox " +
        this._getEditBoxName(editBox) +
        ", TextChanged, text: " +
        text
    );
  }

  editBoxReturn(editBox) {
    log("editBox " + this._getEditBoxName(editBox) + " was returned !");
  }

  _getEditBoxName(editBox) {
    switch (editBox) {
      case this._box1:
        return "box1";
      case this._box2:
        return "box2";
      case this._box3:
        return "box3";
      case this._box4:
        return "box4";
      default:
        return "Unknown EditBox";
    }
  }
}

export function runEditBoxTest() {
  var pScene = new TestScene("Edit Box");
  var pLayer = new EditBoxTestLayer();
  pScene.addChild(pLayer);
  Director.getInstance().runScene(pScene);
}
