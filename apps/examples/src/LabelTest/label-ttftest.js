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

import { AtlasDemo } from "./atlas-demo";
import { director } from "../constants";
import { Color, LabelTTF, LayerColor, Size, TEXT_ALIGNMENT_CENTER, TEXT_ALIGNMENT_LEFT, TEXT_ALIGNMENT_RIGHT, VERTICAL_TEXT_ALIGNMENT_BOTTOM, VERTICAL_TEXT_ALIGNMENT_CENTER, VERTICAL_TEXT_ALIGNMENT_TOP } from "@aspect/core";
import { ButtonLayout } from "../button-layout";

export class LabelTTFTest extends AtlasDemo {
  constructor() {
    //----start19----ctor
    super();

    this._label = null;

    this._horizAlign = null;

    this._vertAlign = null;
    var blockSize = new Size(200, 160);
    var s = director.getWinSize();

    var colorLayer = new LayerColor(
      new Color(100, 100, 100, 255),
      blockSize.width,
      blockSize.height
    );
    colorLayer.anchorX = 0;
    colorLayer.anchorY = 0;
    colorLayer.x = (s.width - blockSize.width) / 2;
    colorLayer.y = (s.height - blockSize.height) / 2;

    this.addChild(colorLayer);

    const hAlignLayout = new ButtonLayout(
      [
        { label: "Left", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Center", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Right", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) }
      ],
      100, "H-Align",
      (i) => {
        if (i === 0) this.setAlignmentLeft();
        else if (i === 1) this.setAlignmentCenter();
        else this.setAlignmentRight();
      }
    );
    hAlignLayout.x = 8;
    this.addChild(hAlignLayout);

    const vAlignLayout = new ButtonLayout(
      [
        { label: "Top", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Middle", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Bottom", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) }
      ],
      100, "V-Align",
      (i) => {
        if (i === 0) this.setAlignmentTop();
        else if (i === 1) this.setAlignmentMiddle();
        else this.setAlignmentBottom();
      }
    );
    this.addChild(vAlignLayout);

    this._label = null;
    this._horizAlign = TEXT_ALIGNMENT_LEFT;
    this._vertAlign = VERTICAL_TEXT_ALIGNMENT_TOP;

    this.updateAlignment();
    //----end19----
  }
  updateAlignment() {
    //----start19----updateAlignment
    var blockSize = new Size(200, 160);
    var s = director.getWinSize();

    if (this._label) {
      this._label.removeFromParent();
    }

    this._label = new LabelTTF(
      this.getCurrentAlignment(),
      "Arial",
      32,
      blockSize,
      this._horizAlign,
      this._vertAlign
    );

    this._label.anchorX = 0;
    this._label.anchorY = 0;
    this._label.x = (s.width - blockSize.width) / 2;
    this._label.y = (s.height - blockSize.height) / 2;

    this.addChild(this._label);
    //----end19----
  }
  setAlignmentLeft(sender) {
    this._horizAlign = TEXT_ALIGNMENT_LEFT;
    this.updateAlignment();
  }
  setAlignmentCenter(sender) {
    this._horizAlign = TEXT_ALIGNMENT_CENTER;
    this.updateAlignment();
  }
  setAlignmentRight(sender) {
    this._horizAlign = TEXT_ALIGNMENT_RIGHT;
    this.updateAlignment();
  }
  setAlignmentTop(sender) {
    this._vertAlign = VERTICAL_TEXT_ALIGNMENT_TOP;
    this.updateAlignment();
  }
  setAlignmentMiddle(sender) {
    this._vertAlign = VERTICAL_TEXT_ALIGNMENT_CENTER;
    this.updateAlignment();
  }
  setAlignmentBottom(sender) {
    this._vertAlign = VERTICAL_TEXT_ALIGNMENT_BOTTOM;
    this.updateAlignment();
  }
  getCurrentAlignment() {
    //----start19----getCurrentAlignment
    var vertical = null;
    var horizontal = null;
    switch (this._vertAlign) {
      case VERTICAL_TEXT_ALIGNMENT_TOP:
        vertical = "Top";
        break;
      case VERTICAL_TEXT_ALIGNMENT_CENTER:
        vertical = "Middle";
        break;
      case VERTICAL_TEXT_ALIGNMENT_BOTTOM:
        vertical = "Bottom";
        break;
    }
    switch (this._horizAlign) {
      case TEXT_ALIGNMENT_LEFT:
        horizontal = "Left";
        break;
      case TEXT_ALIGNMENT_CENTER:
        horizontal = "Center";
        break;
      case TEXT_ALIGNMENT_RIGHT:
        horizontal = "Right";
        break;
    }

    return "Alignment " + vertical + " " + horizontal;
    //----end19----
  }
  title() {
    return "Testing LabelTTF";
  }
  subtitle() {
    return "Select the buttons on the sides to change alignment";
  }
}
