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

import {
  ITEM_TAG_BASIC,
  LINE_SPACE,
  extensionsTestItemNames
} from "./extensions-test-constants";
import { Director, Layer } from "@aspect/core";
import { Menu, MenuItemFont } from "@aspect/menus";

export class ExtensionsMainLayer extends Layer {
  onEnter() {
    super.onEnter();

    var winSize = Director.getInstance().getWinSize();

    var pMenu = new Menu();
    pMenu.x = 0;
    pMenu.y = 0;
    MenuItemFont.setFontName("Arial");
    MenuItemFont.setFontSize(24);
    for (var i = 0; i < extensionsTestItemNames.length; ++i) {
      var selItem = extensionsTestItemNames[i];
      var pItem = new MenuItemFont(
        selItem.itemTitle,
        this.menuCallback,
        this
      );
      pItem.x = winSize.width / 2;
      pItem.y = winSize.height - (i + 1) * LINE_SPACE;
      pMenu.addChild(pItem, ITEM_TAG_BASIC + i);
    }
    this.addChild(pMenu);
  }

  menuCallback(sender) {
    var nIndex = sender.zIndex - ITEM_TAG_BASIC;
    extensionsTestItemNames[nIndex].testScene();
  }
}
