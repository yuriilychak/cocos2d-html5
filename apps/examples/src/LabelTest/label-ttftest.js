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

export class LabelTTFTest extends AtlasDemo {
  constructor() {
    //----start19----ctor
    super();

    this._label = null;

    this._horizAlign = null;

    this._vertAlign = null;
    var blockSize = new cc.Size(200, 160);
    var s = director.getWinSize();

    var colorLayer = new cc.LayerColor(
      new cc.Color(100, 100, 100, 255),
      blockSize.width,
      blockSize.height
    );
    colorLayer.anchorX = 0;
    colorLayer.anchorY = 0;
    colorLayer.x = (s.width - blockSize.width) / 2;
    colorLayer.y = (s.height - blockSize.height) / 2;

    this.addChild(colorLayer);

    cc.MenuItemFont.setFontSize(30);
    var menu = new cc.Menu(
      new cc.MenuItemFont("Left", this.setAlignmentLeft, this),
      new cc.MenuItemFont("Center", this.setAlignmentCenter, this),
      new cc.MenuItemFont("Right", this.setAlignmentRight, this)
    );
    menu.alignItemsVerticallyWithPadding(4);
    menu.x = 50;
    menu.y = s.height / 2 - 20;
    this.addChild(menu);

    menu = new cc.Menu(
      new cc.MenuItemFont("Top", this.setAlignmentTop, this),
      new cc.MenuItemFont("Middle", this.setAlignmentMiddle, this),
      new cc.MenuItemFont("Bottom", this.setAlignmentBottom, this)
    );
    menu.alignItemsVerticallyWithPadding(4);
    menu.x = s.width - 50;
    menu.y = s.height / 2 - 20;
    this.addChild(menu);

    this._label = null;
    this._horizAlign = cc.TEXT_ALIGNMENT_LEFT;
    this._vertAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;

    this.updateAlignment();
    //----end19----
  }
  updateAlignment() {
    //----start19----updateAlignment
    var blockSize = new cc.Size(200, 160);
    var s = director.getWinSize();

    if (this._label) {
      this._label.removeFromParent();
    }

    this._label = new cc.LabelTTF(
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
    this._horizAlign = cc.TEXT_ALIGNMENT_LEFT;
    this.updateAlignment();
  }
  setAlignmentCenter(sender) {
    this._horizAlign = cc.TEXT_ALIGNMENT_CENTER;
    this.updateAlignment();
  }
  setAlignmentRight(sender) {
    this._horizAlign = cc.TEXT_ALIGNMENT_RIGHT;
    this.updateAlignment();
  }
  setAlignmentTop(sender) {
    this._vertAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
    this.updateAlignment();
  }
  setAlignmentMiddle(sender) {
    this._vertAlign = cc.VERTICAL_TEXT_ALIGNMENT_CENTER;
    this.updateAlignment();
  }
  setAlignmentBottom(sender) {
    this._vertAlign = cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM;
    this.updateAlignment();
  }
  getCurrentAlignment() {
    //----start19----getCurrentAlignment
    var vertical = null;
    var horizontal = null;
    switch (this._vertAlign) {
      case cc.VERTICAL_TEXT_ALIGNMENT_TOP:
        vertical = "Top";
        break;
      case cc.VERTICAL_TEXT_ALIGNMENT_CENTER:
        vertical = "Middle";
        break;
      case cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM:
        vertical = "Bottom";
        break;
    }
    switch (this._horizAlign) {
      case cc.TEXT_ALIGNMENT_LEFT:
        horizontal = "Left";
        break;
      case cc.TEXT_ALIGNMENT_CENTER:
        horizontal = "Center";
        break;
      case cc.TEXT_ALIGNMENT_RIGHT:
        horizontal = "Right";
        break;
    }

    return "Alignment " + vertical + " " + horizontal;
    //----end19----
  }
  title() {
    return "Testing cc.LabelTTF";
  }
  subtitle() {
    return "Select the buttons on the sides to change alignment";
  }
}
