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
// MenuLayer3
//
//------------------------------------------------------------------
import { s_bitmapFontTest3_fnt, s_menuItem } from "../resources";
import { director } from "../constants";
import { Layer, Point, Rect, Sprite, log } from "@aspect/core";
import { LabelBMFont } from "@aspect/labels";
import { JumpBy, RotateBy, sequence } from "@aspect/actions";
import { Menu, MenuItemFont, MenuItemLabel, MenuItemSprite } from "@aspect/menus";

export class MenuLayer3 extends Layer {

    constructor() {
        super();


        this._disabledItem = null;
        this.init();
    }
    init() {
        super.init();
        MenuItemFont.setFontName("Marker Felt");
        MenuItemFont.setFontSize(28);

        var label = new LabelBMFont("Enable AtlasItem", s_bitmapFontTest3_fnt);
        var item1 = new MenuItemLabel(label, function(sender){
            this._disabledItem.enabled = !this._disabledItem.enabled;
            this._disabledItem.stopAllActions();
        }, this);
        var item2 = new MenuItemFont("--- Go Back ---", function(sender){
            this.parent.switchTo(0, false);
        }, this);

        var spriteNormal = new Sprite(s_menuItem, new Rect(0, 23 * 2, 115, 23));
        var spriteSelected = new Sprite(s_menuItem, new Rect(0, 23, 115, 23));
        var spriteDisabled = new Sprite(s_menuItem, new Rect(0, 0, 115, 23));

        var item3 = new MenuItemSprite(spriteNormal, spriteSelected, spriteDisabled, function(sender){
            log("sprite clicked!");
        }, this);
        this._disabledItem = item3;
        this._disabledItem.enabled = false;

        var menu = new Menu(item1, item2, item3);
        menu.x = 0;
        menu.y = 0;

        var s = director.getWinSize();

        item1.x = s.width / 2 - 150;
        item1.y = s.height / 2;
        item2.x = s.width / 2 - 200;
        item2.y = s.height / 2;
        item3.x = s.width / 2;
        item3.y = s.height / 2 - 100;

        var jump = new JumpBy(3, new Point(400, 0), 50, 4);
        item2.runAction(sequence(jump, jump.reverse()).repeatForever());
        var spin1 = new RotateBy(3, 360);
        var spin2 = spin1.clone();
        var spin3 = spin1.clone();

        item1.runAction(spin1.repeatForever());
        item2.runAction(spin2.repeatForever());
        item3.runAction(spin3.repeatForever());

        this.addChild(menu);
        menu.x = 0;
        menu.y = 0;
    }

}
