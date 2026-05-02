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
// AnimationCache
//
//------------------------------------------------------------------
import { SpriteTestDemo } from "./sprite-test-demo";
import { s_grossiniPlist, s_grossini_bluePlist, s_grossini_grayPlist } from "../resources";
import { winSize } from "../constants";
import { Animate, sequence } from "@aspect/actions";
import { Animation, AnimationCache, AnimationFrame, Sprite, SpriteFrameCache } from "@aspect/core";
export class AnimationCacheTest extends SpriteTestDemo {


    constructor() {
        //----start40----ctor
        super();



        this._title = "AnimationCache";



        this._subtitle = "Sprite should be animated";



        this.testDuration = 6.5;



        this.ePixel1 = {"0":51, "1":0, "2":51, "3":255};



        this.ePixel2 = {"0":15, "1":15, "2":15, "3":255};



        this.ePixel3 = {"0":0, "1":38, "2":0, "3":255};



        this.cPixel1 = null;



        this.cPixel2 = null;



        this.cPixel3 = null;
        SpriteFrameCache.getInstance().addSpriteFrames(s_grossiniPlist);
        SpriteFrameCache.getInstance().addSpriteFrames(s_grossini_grayPlist);
        SpriteFrameCache.getInstance().addSpriteFrames(s_grossini_bluePlist);

        //
        // create animation "dance"
        //
        var animFrames = [];
        var frame, animFrame;
        var str = "";
        for (var i = 1; i < 15; i++) {
            str = "grossini_dance_" + (i < 10 ? ("0" + i) : i) + ".png";
            frame = SpriteFrameCache.getInstance().getSpriteFrame(str);
            animFrame = new AnimationFrame(frame, 1);
            animFrames.push(animFrame);
        }

        var animation = new Animation(animFrames, 0.2);

        // Add an animation to the Cache
        AnimationCache.getInstance().addAnimation(animation, "dance");

        //
        // create animation "dance gray"
        //
        animFrames = [];
        for (i = 1; i < 15; i++) {
            str = "grossini_dance_gray_" + (i < 10 ? ("0" + i) : i) + ".png";
            frame = SpriteFrameCache.getInstance().getSpriteFrame(str);
            animFrames.push(frame);
        }

        animation = new Animation(animFrames, 0.2);

        // Add an animation to the Cache
        AnimationCache.getInstance().addAnimation(animation, "dance_gray");

        //
        // create animation "dance blue"
        //
        animFrames = [];
        for (i = 1; i < 4; i++) {
            str = "grossini_blue_0" + i + ".png";
            frame = SpriteFrameCache.getInstance().getSpriteFrame(str);
            animFrames.push(frame);
        }

        animation = new Animation(animFrames, 0.2);

        // Add an animation to the Cache
        AnimationCache.getInstance().addAnimation(animation, "dance_blue");

        var animCache = AnimationCache.getInstance();

        var normal = animCache.getAnimation("dance");
        normal.setRestoreOriginalFrame(true);
        var dance_grey = animCache.getAnimation("dance_gray");
        dance_grey.setRestoreOriginalFrame(true);
        var dance_blue = animCache.getAnimation("dance_blue");
        dance_blue.setRestoreOriginalFrame(true);

        var animN = new Animate(normal);
        var animG = new Animate(dance_grey);
        var animB = new Animate(dance_blue);

        var seq = sequence(animN, animG, animB);

        frame = SpriteFrameCache.getInstance().getSpriteFrame("grossini_dance_01.png");
        var grossini = new Sprite(frame);

        grossini.x = winSize.width / 2;

        grossini.y = winSize.height / 2;
        this.addChild(grossini);

        // run the animation
        grossini.runAction(seq);
        //----end40----
    }
    //
    // Automation
    //
    setupAutomation() {
        //----start40----setupAutomation
        var fun1 = function () {
            this.cPixel1 = this.readPixels(winSize.width / 2, winSize.height / 2, 5, 5);
        }
        this.scheduleOnce(fun1, 0.4);

        var fun2 = function () {
            this.cPixel2 = this.readPixels(winSize.width / 2, winSize.height / 2, 5, 5);
        }
        this.scheduleOnce(fun2, 3.2);

        var fun3 = function () {
            this.cPixel3 = this.readPixels(winSize.width / 2, winSize.height / 2, 5, 5);
        }
        this.scheduleOnce(fun3, 6);
        //----end40----
    }
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes", "pixel3":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret = {"pixel1":this.containsPixel(this.cPixel1, this.ePixel1) ? "yes" : "no", "pixel2":this.containsPixel(this.cPixel2, this.ePixel2) ? "yes" : "no", "pixel3":this.containsPixel(this.cPixel3, this.ePixel3, true, 5) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

}
