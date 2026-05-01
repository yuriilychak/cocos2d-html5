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

// S9_TexturePacker
import { S9SpriteTestDemo } from "./s9-sprite-test-demo";
import { s_s9s_ui_plist } from "../../resources";
import { winSize } from "../../constants";
import { SpriteFrameCache, log } from "@aspect/core";
import { Scale9Sprite } from "@aspect/ccui";

export class S9_TexturePacker extends S9SpriteTestDemo {


    constructor() {
        super();



        this._title = "Scale9Sprite from a spritesheet created with TexturePacker";



        this._subtitle = "createWithSpriteFrameName('button_normal.png');createWithSpriteFrameName('button_actived.png');";
        SpriteFrameCache.getInstance().addSpriteFrames(s_s9s_ui_plist);

        var x = winSize.width / 4;
        var y = 0 + (winSize.height / 2);

        log("S9_TexturePacker ...");

        var s = new Scale9Sprite('button_normal.png');
        log("... created");

        s.x = x;

        s.y = y;
        log("... setPosition");

        s.width = 21 * 16;

        s.height = 13 * 16;
        log("... setContentSize");

        this.addChild(s);
        log("this..addChild");

        x = winSize.width * 3/4;

        var s2 = new Scale9Sprite('button_actived.png');
        log("... created");

        s2.x = x;
        s2.y = y;
        log("... setPosition");

        s2.width = 21 * 16;
        s2.height = 13 * 16;
        log("... setContentSize");

        this.addChild(s2);
        log("this..addChild");

        log("... S9_TexturePacker done.");
    }

}
