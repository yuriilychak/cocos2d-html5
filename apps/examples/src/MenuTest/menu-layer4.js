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

import { s_bitmapFontTest3_fnt } from "../resources";
import { director } from "../constants";
import { Layer, log } from "@aspect/core";
import { LabelBMFont } from "@aspect/labels";
import { Menu, MenuItemFont, MenuItemLabel, MenuItemToggle } from "@aspect/menus";

export class MenuLayer4 extends Layer {
    constructor() {
        super();
        this.init();
    }
    init() {
        //super.init();
        MenuItemFont.setFontName("American Typewriter");
        MenuItemFont.setFontSize(18);

        var title1 = new MenuItemFont("Sound");
        title1.enabled = false;
        MenuItemFont.setFontName("Marker Felt");
        MenuItemFont.setFontSize(34);

        // you can create a ToggleItem by passing the items
        // and later setting the callback
        var item1 = new MenuItemToggle(
            new MenuItemFont("On"),
            new MenuItemFont("Off"));
        item1.setCallback(this.onMenuCallback, this);

        MenuItemFont.setFontName("American Typewriter");
        MenuItemFont.setFontSize(18);
        var title2 = new MenuItemFont("Music");
        title2.enabled = false;
        MenuItemFont.setFontName("Marker Felt");
        MenuItemFont.setFontSize(34);

        // or you can create a ToggleItem by passing the items
        // an the callback at the last arguments.
        var item2 = new MenuItemToggle(
            new MenuItemFont("Off"),
            new MenuItemFont("On"),
            this.onMenuCallback.bind(this)
        );

        MenuItemFont.setFontName("American Typewriter");
        MenuItemFont.setFontSize(18);
        var title3 = new MenuItemFont("Quality");
        title3.enabled = false;
        MenuItemFont.setFontName("Marker Felt");
        MenuItemFont.setFontSize(34);
        var item3 = new MenuItemToggle(
            new MenuItemFont("High"),
            new MenuItemFont("Low"),
            this.onMenuCallback, this
        );

        MenuItemFont.setFontName("American Typewriter");
        MenuItemFont.setFontSize(18);
        var title4 = new MenuItemFont("Orientation");
        title4.enabled = false;
        MenuItemFont.setFontName("Marker Felt");
        MenuItemFont.setFontSize(34);
        var item4 = new MenuItemToggle(
            new MenuItemFont("Off"),
            new MenuItemFont("33%"),
            new MenuItemFont("66%"),
            new MenuItemFont("100%"),
            this.onMenuCallback, this
        );

        // you can change the one of the items by doing this
        item4.setSelectedIndex(2);

        MenuItemFont.setFontName("Marker Felt");
        MenuItemFont.setFontSize(34);

        var label = new LabelBMFont("go back", s_bitmapFontTest3_fnt);
        var back = new MenuItemLabel(label, this.onBackCallback, this);

        var menu = new Menu(
            title1, title2,
            item1, item2,
            title3, title4,
            item3, item4,
            back); // 9 items.

        menu.alignItemsInColumns(2, 2, 2, 2, 1);

        this.addChild(menu);

        var winSize = director.getWinSize();
        menu.x = winSize.width / 2;
        menu.y = winSize.height / 2;
    }
    onMenuCallback(sender) {
        log("Callback called");
    }
    onBackCallback(sender) {
        this.parent.switchTo(0, false);
    }

}
