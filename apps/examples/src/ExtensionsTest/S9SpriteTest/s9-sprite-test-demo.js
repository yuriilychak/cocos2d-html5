/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 Copyright (c) 2013      Surith Thekkiam

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
// S9SpriteTestDemo
//
//------------------------------------------------------------------
import { nextS9SpriteTest, previousS9SpriteTest, restartS9SpriteTest } from "./s9-sprite-test-helpers";
import { S9SpriteTestScene } from "./s9-sprite-test-scene";
import { s_pathB1, s_pathB2, s_pathF1, s_pathF2, s_pathR1, s_pathR2, s_s9s_blocks9_plist } from "../../resources";
import { director, winSize } from "../../constants";

export class S9SpriteTestDemo extends cc.LayerGradient {

    constructor() {
        super(new cc.Color(0,0,0,255), new cc.Color(98,99,117,255));


        this._title = "";


        this._subtitle = "";
        cc.spriteFrameCache.addSpriteFrames(s_s9s_blocks9_plist);
        cc.log('sprite frames added to sprite frame cache...');
    }
    onEnter() {
        super.onEnter();

        var label = new cc.LabelTTF(this._title, "Arial", 28);
        this.addChild(label, 1);
        label.x = winSize.width / 2;
        label.y = winSize.height - 50;

        if (this._subtitle !== "") {
            var l = new cc.LabelTTF(this._subtitle, "Thonburi", 16);
            this.addChild(l, 1);
            l.x = winSize.width / 2;
            l.y = winSize.height - 80;
        }

        var item1 = new cc.MenuItemImage(s_pathB1, s_pathB2, this.onBackCallback, this);
        var item2 = new cc.MenuItemImage(s_pathR1, s_pathR2, this.onRestartCallback, this);
        var item3 = new cc.MenuItemImage(s_pathF1, s_pathF2, this.onNextCallback, this);

        var menu = new cc.Menu(item1, item2, item3);

        menu.x = 0;
        menu.y = 0;
        var width = item2.width, height = item2.height;
        item1.x = winSize.width/2 - width*2;
        item1.y = height/2;
        item2.x = winSize.width/2;
        item2.y = height/2;
        item3.x = winSize.width/2 + width*2;
        item3.y = height/2;

        this.addChild(menu, 1);
    }

    onExit() {
        super.onExit();
    }

    onRestartCallback(sender) {
        var s = new S9SpriteTestScene();
        s.addChild(restartS9SpriteTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new S9SpriteTestScene();
        s.addChild(nextS9SpriteTest());
        director.runScene(s);
    }
    onBackCallback(sender) {
        var s = new S9SpriteTestScene();
        s.addChild(previousS9SpriteTest());
        director.runScene(s);
    }

}
