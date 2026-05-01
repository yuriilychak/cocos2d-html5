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

import { SpriteDemo } from "./sprite-demo";
import { s_pathSister1, s_pathSister2 } from "../resources";
import { winSize } from "../constants";
import { LabelTTF, Point } from "@aspect/core";

export class SpriteProgressBarTintAndFade extends SpriteDemo {
    onEnter() {
        //----start5----onEnter
        super.onEnter();

        var to = cc.progressFromTo(6, 0, 100);
        var tint = cc.sequence(
            new cc.TintTo(1, 255, 0, 0),
            new cc.TintTo(1, 0, 255, 0),
            new cc.TintTo(1, 0, 0, 255)
        );

        var fade = cc.sequence(new cc.FadeTo(1.0, 0), new cc.FadeTo(1.0, 255));

        var left = new cc.ProgressTimer(new cc.Sprite(s_pathSister1));
        left.type = cc.ProgressTimer.TYPE_BAR;

        //    Setup for a bar starting from the bottom since the midpoint is 0 for the y
        left.midPoint = new Point(0.5, 0.5);
        //    Setup for a vertical bar since the bar change rate is 0 for x meaning no horizontal change
        left.barChangeRate = new Point(1, 0);
        this.addChild(left);
        left.x = 150;
        left.y = winSize.height / 2;
        left.runAction(to.clone().repeatForever());
        left.runAction(tint.clone().repeatForever());

        left.addChild(new LabelTTF("Tint", "Marker Felt", 20.0));

        var middle = new cc.ProgressTimer(new cc.Sprite(s_pathSister2));
        middle.type = cc.ProgressTimer.TYPE_BAR;
        //    Setup for a bar starting from the bottom since the midpoint is 0 for the y
        middle.midPoint = new Point(0.5, 0.5);
        //    Setup for a vertical bar since the bar change rate is 0 for x meaning no horizontal change
        middle.barChangeRate = new Point(1, 1);
        this.addChild(middle);
        middle.x = winSize.width / 2;
        middle.y = winSize.height / 2;
        middle.runAction(to.clone().repeatForever());
        middle.runAction(fade.clone().repeatForever());

        middle.addChild(new LabelTTF("Fade", "Marker Felt", 20.0));

        var right = new cc.ProgressTimer(new cc.Sprite(s_pathSister2));
        right.type = cc.ProgressTimer.TYPE_BAR;
        //    Setup for a bar starting from the bottom since the midpoint is 0 for the y
        right.midPoint = new Point(0.5, 0.5);
        //    Setup for a vertical bar since the bar change rate is 0 for x meaning no horizontal change
        right.barChangeRate = new Point(0, 1);
        this.addChild(right);
        right.x = winSize.width - 150;
        right.y = winSize.height / 2;
        right.runAction(to.clone().repeatForever());
        right.runAction(tint.clone().repeatForever());
        right.runAction(fade.clone().repeatForever());

        right.addChild(new LabelTTF("Tint and Fade", "Marker Felt", 20.0));
        //----end5----
    }

    title() {
        return "ProgressFromTo Bar Mid";
    }

}
