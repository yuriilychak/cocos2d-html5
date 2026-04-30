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

import { DoubleSprite } from "./double-sprite.js";
import { SpriteTestDemo } from "./sprite-test-demo.js";
import { s_grossiniDance08, s_pathGrossini } from "../tests_resources.js";
import { winSize } from "../tests-main-constants.js";

export class SpriteDoubleResolution extends SpriteTestDemo {


    constructor() {
        //----start52----ctor
        super();



        this._title = "Sprite Double resolution";



        this._subtitle = "Retina Display. SD (left) should be equal to HD (right)";

        //
        // LEFT: SD sprite
        //
        // there is no HD resolution file of grossini_dance_08.
        var spriteSD = new DoubleSprite(s_grossiniDance08);
        this.addChild(spriteSD);
        spriteSD.x = winSize.width / 4;
        spriteSD.y = winSize.height / 2;

        var child1_left = new DoubleSprite(s_grossiniDance08);
        spriteSD.addChild(child1_left);
        child1_left.x = -30;
        child1_left.y = 0;

        var child1_right = new cc.Sprite(s_pathGrossini);
        spriteSD.addChild(child1_right);
        child1_left.x = spriteSD.height;
        child1_left.y = 0;

        //
        // RIGHT: HD sprite
        //
        // there is an HD version of grossini.png
        var spriteHD = new cc.Sprite(s_pathGrossini);
        this.addChild(spriteHD);
        spriteHD.x = winSize.width / 4 * 3;
        spriteHD.y = winSize.height / 2;

        var child2_left = new DoubleSprite(s_grossiniDance08);
        spriteHD.addChild(child2_left);
        child2_left.x = -30;
        child2_left.y = 0;

        var child2_right = new cc.Sprite(s_pathGrossini);
        spriteHD.addChild(child2_right);
        child2_left.x = spriteHD.height;
        child2_left.y = 0;


        // Actions
        var scale = new cc.ScaleBy(2, 0.5);
        var scale_back = scale.reverse();
        var seq = cc.sequence(scale, scale_back);

        var seq_copy = seq.clone();

        spriteSD.runAction(seq);
        spriteHD.runAction(seq_copy);
        //----end52----
    }

}
