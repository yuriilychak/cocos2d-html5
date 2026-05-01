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
import { Point, Sprite } from "@aspect/core";
import { sequence } from "@aspect/actions";

export class SpriteProgressToVertical extends SpriteDemo {
    onEnter() {
        //----start2----onEnter
        super.onEnter();

        var to1 = sequence(cc.progressTo(2, 100), cc.progressTo(0, 0));
        var to2 = sequence(cc.progressTo(2, 100), cc.progressTo(0, 0));

        var left = new cc.ProgressTimer(new Sprite(s_pathSister1));
        left.type = cc.ProgressTimer.TYPE_BAR;
        //    Setup for a bar starting from the bottom since the midpoint is 0 for the y
        left.midPoint = new Point(0, 0);
        //    Setup for a vertical bar since the bar change rate is 0 for x meaning no horizontal change
        left.barChangeRate = new Point(0, 1);
        this.addChild(left);
        left.x = 200;
        left.y = winSize.height / 2;
        left.runAction(to1.repeatForever());

        var right = new cc.ProgressTimer(new Sprite(s_pathSister2));
        right.type = cc.ProgressTimer.TYPE_BAR;
        //    Setup for a bar starting from the bottom since the midpoint is 0 for the y
        right.midPoint = new Point(0, 1);
        //    Setup for a vertical bar since the bar change rate is 0 for x meaning no horizontal change
        right.barChangeRate = new Point(0, 1);
        this.addChild(right);
        right.x = winSize.width - 200;
        right.y = winSize.height / 2;
        right.runAction(to2.repeatForever());
        //----end2----
    }
    title() {
        return "ProgressTo Vertical";
    }

}
