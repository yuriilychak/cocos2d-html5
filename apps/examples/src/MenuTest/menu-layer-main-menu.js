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
// LayerMainMenu
//
//------------------------------------------------------------------
import { s_bitmapFontTest3_fnt, s_fpsImages, s_menuItem, s_pressSendScore, s_sendScore } from "../tests_resources.js";

export class MenuLayerMainMenu extends cc.Layer {

    constructor() {
        //----start0----ctor
        super();


        this._disabledItem = null;


        this._touchListener = null;

        // Font Item
        var spriteNormal = new cc.Sprite(s_menuItem, new cc.Rect(0,23*2,115,23));
        var spriteSelected = new cc.Sprite(s_menuItem, new cc.Rect(0,23,115,23));
        var spriteDisabled = new cc.Sprite(s_menuItem, new cc.Rect(0,0,115,23));

        var item1 = new cc.MenuItemSprite(spriteNormal, spriteSelected, spriteDisabled, this.onMenuCallback, this);

        // Image Item
        var sendScoreSF = new cc.SpriteFrame(s_sendScore, new cc.Rect(0, 0, 145, 26));
        cc.spriteFrameCache.addSpriteFrame(sendScoreSF, "send_score_sf");
        var item2 = new cc.MenuItemImage("#send_score_sf", s_pressSendScore, this.onMenuCallback2, this);

        // Label Item (LabelAtlas)
        var labelAtlas = new cc.LabelAtlas("0123456789", s_fpsImages, 12, 32, '.');
        var item3 = new cc.MenuItemLabel(labelAtlas, this.onMenuCallbackDisabled, this );
        item3.setDisabledColor( new cc.Color(32,32,64) );
        item3.color = new cc.Color(200,200,255);
        cc.log("test MenuItemLabel getString()" + item3.getString());

        // Font Item
        var item4 = new cc.MenuItemFont("I toggle enable items", function(sender) {
            this._disabledItem.enabled = !this._disabledItem.enabled;
        }, this);

        item4.fontSize = 20;
        item4.fontName = "Arial";

        // Label Item (LabelBMFont)
        var label = new cc.LabelBMFont("configuration", s_bitmapFontTest3_fnt);
        var item5 = new cc.MenuItemLabel(label, this.onMenuCallbackConfig, this);

        // Testing issue #500
        item5.scale = 0.8;

        // Events
        cc.MenuItemFont.setFontName("Arial");

        // Bugs Item
        var item7 = new cc.MenuItemFont("Bugs", this.onMenuCallbackBugsTest, this);

        // Font Item
        var item8 = new cc.MenuItemFont("Quit", this.onQuit, this);

        var item9 = new cc.MenuItemFont("Remove menu item when moving", this.onMenuMovingCallback, this);

        var color_action = new cc.TintBy(0.5, 0, -255, -255);
        var color_back = color_action.reverse();
        var seq = cc.sequence(color_action, color_back);
        item8.runAction(seq.repeatForever());

        var menu = new cc.Menu( item1, item2, item3, item4, item5, item7, item8, item9);
        menu.alignItemsVertically();

        // elastic effect
        var winSize = cc.director.getWinSize();

        var locChildren = menu.children;
        var dstPoint = new cc.Point(0,0);
        for(var i = 0; i < locChildren.length; i++){
            var selChild = locChildren[i];
            if(selChild){
                dstPoint.x = selChild.x;
                dstPoint.y = selChild.y;
                var offset = 0|(winSize.width/2 + 50);
                if( i % 2 == 0)
                    offset = -offset;

                selChild.x = dstPoint.x + offset;
                selChild.y = dstPoint.y;
                selChild.runAction(new cc.MoveBy(2, new cc.Point(dstPoint.x - offset,0)).easing(cc.easeElasticOut(0.35)));
            }
        }
        this._disabledItem = item3;
        this._disabledItem.enabled = false;
        this.addChild(menu);
        menu.x = winSize.width/2;
        menu.y = winSize.height/2;
        //----end0----
    }

    onMenuCallback(sender) {
        this.parent.switchTo(1, false);
    }

    onMenuCallbackConfig(sender) {
        this.parent.switchTo(3, false);
    }

    onAllowTouches(dt) {
        cc.eventManager.setPriority(this._touchListener, 1);
        this.unscheduleAllCallbacks();
        cc.log("TOUCHES ALLOWED AGAIN");
    }

    onMenuCallbackDisabled(sender) {
        // hijack all touch events for 5 seconds
        cc.eventManager.setPriority(this._touchListener, -1);
        this.schedule(this.onAllowTouches, 5.0);
        cc.log("TOUCHES DISABLED FOR 5 SECONDS");
    }

    onMenuCallback2(sender) {
        this.parent.switchTo(2, false);
    }

	onEnter() {
		super.onEnter();
		this._touchListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan:function () {
				return true;
			}
		});
		cc.eventManager.addListener(this._touchListener, 1);
	}

	onExit() {
		super.onExit();
		cc.eventManager.removeListener(this._touchListener);
	}

    onQuit(sender) {
        cc.log("Quit called");
    }

    onMenuCallbackBugsTest(sender){
        this.parent.switchTo(4, false);
    }

    onMenuMovingCallback(sender){
        this.parent.switchTo(5, false);
    }

}
