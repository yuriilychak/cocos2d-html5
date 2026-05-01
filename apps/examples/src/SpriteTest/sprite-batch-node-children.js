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
// SpriteBatchNodeChildren
//
//------------------------------------------------------------------
import { TAG_SPRITE_BATCH_NODE } from "./sprite-test-constants";
import { SpriteTestDemo } from "./sprite-test-demo";
import { s_grossini, s_grossiniPlist } from "../resources";
import { winSize } from "../constants";
import { Point } from "@aspect/core";
import { Animate, MoveBy, RotateBy, ScaleBy, sequence } from "@aspect/actions";

export class SpriteBatchNodeChildren extends SpriteTestDemo {

    constructor() {
        //----start29----ctor
        super();


        this._title = "SpriteBatchNode Grand Children";


        this.testDuration = 0.5;


        this.pixel = {"0":255, "1":204, "2":153, "3":255};
        // parents
        var batch = new cc.SpriteBatchNode(s_grossini, 50);
        this.addChild(batch, 0, TAG_SPRITE_BATCH_NODE);

        cc.spriteFrameCache.addSpriteFrames(s_grossiniPlist);

        var sprite1 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_01.png"));
        sprite1.x = winSize.width / 3;
        sprite1.y = winSize.height / 2;

        var sprite2 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_02.png"));
        sprite2.x = 50;
        sprite2.y = 50;

        var sprite3 = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("grossini_dance_03.png"));
        sprite3.x = -50;
        sprite3.y = -50;

        batch.addChild(sprite1);
        sprite1.addChild(sprite2);
        sprite1.addChild(sprite3);

        // BEGIN NEW CODE
        var animFrames = [];
        var str = "";
        for (var i = 1; i < 15; i++) {
            str = "grossini_dance_" + (i < 10 ? ("0" + i) : i) + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        var animation = new cc.Animation(animFrames, 0.2);
        sprite1.runAction(new Animate(animation).repeatForever());
        // END NEW CODE

        var action = new MoveBy(2, new Point(200, 0));
        var action_back = action.reverse();
        var action_rot = new RotateBy(2, 360);
        var action_s = new ScaleBy(2, 2);
        var action_s_back = action_s.reverse();

        var seq2 = action_rot.reverse();
        sprite2.runAction(seq2.repeatForever());

        sprite1.runAction(action_rot.repeatForever());
        sprite1.runAction(sequence(action, action_back).repeatForever());
        sprite1.runAction(sequence(action_s, action_s_back).repeatForever());
        //----end29----
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(winSize.width / 3 - 47, winSize.height / 2 + 107, 5, 5);
        var ret2 = this.readPixels(winSize.width / 3 + 95, winSize.height / 2 - 5, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel) ? "yes" : "no", "pixel2":this.containsPixel(ret2, this.pixel) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}
