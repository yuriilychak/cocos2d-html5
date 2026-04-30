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

import { s_pathGrossini, s_pathSister1, s_pathSister2 } from "../tests_resources.js";
import { director } from "../tests-main-constants.js";

export class SpriteLayer extends cc.Layer {
    constructor() {
        super();
        this.init();
    }

    onEnter() {
        super.onEnter();

        var x, y;

        var size = director.getWinSize();
        x = size.width;
        y = size.height;

        var sprite = new cc.Sprite(s_pathGrossini);
        var spriteSister1 = new cc.Sprite(s_pathSister1);
        var spriteSister2 = new cc.Sprite(s_pathSister2);

        sprite.scale = 1.5;
        spriteSister1.scale = 1.5;
        spriteSister2.scale = 1.5;

        sprite.x = x / 2;
        sprite.y = y / 2;
        spriteSister1.x = 40;
        spriteSister1.y = y / 2;
        spriteSister2.x = x - 40;
        spriteSister2.y = y / 2;

        var rot = new cc.RotateBy(16, -3600);

        this.addChild(sprite);
        this.addChild(spriteSister1);
        this.addChild(spriteSister2);

        sprite.runAction(rot);

        var jump1 = new cc.JumpBy(4, new cc.Point(-400, 0), 100, 4);
        var jump2 = jump1.reverse();

        var rot1 = new cc.RotateBy(4, 360 * 2);
        var rot2 = rot1.reverse();

        spriteSister1.runAction(cc.sequence(jump2, jump1).repeat(5));
        spriteSister2.runAction(cc.sequence(jump1.clone(), jump2.clone()).repeat(5));

        spriteSister1.runAction(cc.sequence(rot1, rot2).repeat(5));
        spriteSister2.runAction(cc.sequence(rot2.clone(), rot1.clone()).repeat(5));
    }

}
