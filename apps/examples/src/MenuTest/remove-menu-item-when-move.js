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
import { Director, EventListener, EventManager, LabelTTF, Layer } from "@aspect/core";
import { Menu, MenuItemFont } from "@aspect/menus";


export class RemoveMenuItemWhenMove extends Layer {
    constructor(){
        super();

        this._item = null;

        this._touchListener = null;

        var s = Director.getInstance().getWinSize();

        var label = new LabelTTF("click item and move, should not crash", "Arial", 20);
        label.x = s.width/2;
        label.y = s.height - 30;
        this.addChild(label);

        this._item = new MenuItemFont("item 1");

        var back = new MenuItemFont("go back", this.goBack, this);

        var menu = new Menu(this._item, back);
        this.addChild(menu);
        menu.alignItemsVertically();

        menu.x = s.width/2;
        menu.y = s.height/2;
    }

	onEnter() {
		super.onEnter();
		this._touchListener = EventListener.create({
			event: EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: false,
			onTouchBegan:function(touch, event){
				return true;
			},
			onTouchMoved: function(touch, event){
				if (this._item){
					this._item.removeFromParent(true);
					this._item = null;
				}
			}.bind(this)
		});
		EventManager.getInstance().addListener(this._touchListener, -129);
	}

	onExit() {
		super.onExit();
		EventManager.getInstance().removeListener(this._touchListener);
	}

    goBack(sender){
        this.parent.switchTo(0, false);
    }

}
