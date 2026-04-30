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

// S9FrameNameSpriteSheet
import { S9SpriteTestDemo } from "./s9-sprite-test-demo.js";
import { winSize } from "../../tests-main-constants.js";

export class S9FrameNameSpriteSheet extends S9SpriteTestDemo {


    constructor() {
        super();



        this._title = "Scale9Sprite from sprite sheet";



        this._subtitle = "createWithSpriteFrameName(); default cap insets";

        var x = winSize.width / 2;
        var y = 0 + (winSize.height / 2);

        cc.log("S9FrameNameSpriteSheet ...");

        var blocks = new cc.Scale9Sprite('blocks9.png');
        cc.log("... created");

        blocks.x = x;
        blocks.y = y;
        cc.log("... setPosition");

        this.addChild(blocks);
        cc.log("this..addChild");

        cc.log("... S9FrameNameSpriteSheet done.");

        var moveBy = new cc.MoveBy(1, new cc.Point(80, 80));
        var moveByBack = moveBy.reverse();
        blocks.runAction(cc.sequence(moveBy,moveByBack));
    }

}
