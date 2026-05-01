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

//------------------------------------------------------------------
//
// MenuLayer2
//
//------------------------------------------------------------------
import { TAG_MENU } from "./menu-test-constants";
import {
  s_aboutNormal,
  s_aboutSelect,
  s_highNormal,
  s_highSelect,
  s_playNormal,
  s_playSelect
} from "../resources";
import { director } from "../constants";
import { Point } from "@aspect/core";

export class MenuLayer2 extends cc.Layer {
  constructor() {
    super();

    this._centeredMenu = null;

    this._alignedH = false;
    for (var i = 0; i < 2; i++) {
      var item1 = new cc.MenuItemImage(
        s_playNormal,
        s_playSelect,
        this.onMenuCallback,
        this
      );
      var item2 = new cc.MenuItemImage(
        s_highNormal,
        s_highSelect,
        this.onMenuCallbackOpacity,
        this
      );
      var item3 = new cc.MenuItemImage(
        s_aboutNormal,
        s_aboutSelect,
        this.onMenuCallbackAlign,
        this
      );

      item1.scaleX = 1.5;
      item2.scaleX = 0.5;
      item3.scaleX = 0.5;

      var menu = new cc.Menu(item1, item2, item3);
      var winSize = director.getWinSize();

      menu.tag = TAG_MENU;
      menu.x = winSize.width / 2;
      menu.y = winSize.height / 2;

      this.addChild(menu, 0, 100 + i);

      this._centeredMenu = new Point(menu.x, menu.y);
    }
    this._alignedH = true;
    this.alignMenuH();
  }
  init() {
    super.init();
  }
  alignMenuH() {
    for (var i = 0; i < 2; i++) {
      var menu = this.getChildByTag(100 + i);
      menu.x = this._centeredMenu.x;
      menu.y = this._centeredMenu.y;
      if (i === 0) {
        menu.alignItemsHorizontally();
        menu.y += 30;
      } else {
        menu.alignItemsHorizontallyWithPadding(40);
        menu.y -= 30;
      }
    }
  }
  alignMenusV() {
    for (var i = 0; i < 2; i++) {
      var menu = this.getChildByTag(100 + i);
      menu.x = this._centeredMenu.x;
      menu.y = this._centeredMenu.y;
      if (i === 0) {
        menu.alignItemsVertically();
        menu.x += 100;
      } else {
        menu.alignItemsVerticallyWithPadding(40);
        menu.x -= 100;
      }
    }
  }
  // callbacks
  onMenuCallback(sender) {
    this.parent.switchTo(0, false);
  }
  onMenuCallbackOpacity(sender) {
    var menu = sender.parent;
    var opacity = menu.opacity;
    if (opacity == 128) menu.opacity = 255;
    else menu.opacity = 128;
  }
  onMenuCallbackAlign(sender) {
    this._alignedH = !this._alignedH;
    if (this._alignedH) this.alignMenuH();
    else this.alignMenusV();
  }
}
