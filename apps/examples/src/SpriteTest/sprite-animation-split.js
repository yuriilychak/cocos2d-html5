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
// SpriteAnimationSplit
//
//------------------------------------------------------------------
import { SpriteTestDemo } from "./sprite-test-demo";
import { s_dragon_animation } from "../resources";
import { winSize } from "../constants";
import { Rect, Sprite, SpriteFrame } from "@aspect/core";
import { Animate, DelayTime, FlipX, sequence } from "@aspect/actions";

export class SpriteAnimationSplit extends SpriteTestDemo {

    constructor() {
        //----start10----ctor
        super();


        this._title = "Sprite: Animation + flip";


        this.testDuration = 2.8;


        this.pixel1 = {"0":208, "1":208, "2":208, "3":255};


        this.pixel2 = {"0":0, "1":0, "2":0, "3":255};
        var texture = cc.textureCache.addImage(s_dragon_animation);

        // manually add frames to the frame cache
        var frame0 = new SpriteFrame(texture, new Rect(132 * 0, 132 * 0, 132, 132));
        var frame1 = new SpriteFrame(texture, new Rect(132 * 1, 132 * 0, 132, 132));
        var frame2 = new SpriteFrame(texture, new Rect(132 * 2, 132 * 0, 132, 132));
        var frame3 = new SpriteFrame(texture, new Rect(132 * 3, 132 * 0, 132, 132));
        var frame4 = new SpriteFrame(texture, new Rect(132 * 0, 132 * 1, 132, 132));
        var frame5 = new SpriteFrame(texture, new Rect(132 * 1, 132 * 1, 132, 132));

        //
        // Animation using Sprite BatchNode
        //
        var sprite = new Sprite(frame0);
        sprite.x = winSize.width / 2;
        sprite.y = winSize.height / 2;
        this.addChild(sprite);

        var animFrames = [];
        animFrames.push(frame0);
        animFrames.push(frame1);
        animFrames.push(frame2);
        animFrames.push(frame3);
        animFrames.push(frame4);
        animFrames.push(frame5);

        var animation = new cc.Animation(animFrames, 0.2);
        var animate = new Animate(animation);
        var delay = new DelayTime(0.5);
        var seq = sequence(animate,
            new FlipX(true),
            animate.clone(),
            delay,
            new FlipX(false));

        sprite.runAction(seq.repeatForever());
        //----end10----
    }
    onExit() {
        super.onExit();
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(winSize.width / 2 + 52, winSize.height / 2 - 29, 5, 5);
        var ret2 = this.readPixels(winSize.width / 2, winSize.height / 2 - 22, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel1, true, 3) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel2, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}
