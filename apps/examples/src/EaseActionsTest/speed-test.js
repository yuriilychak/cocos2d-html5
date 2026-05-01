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

import { EaseSpriteDemo } from "./ease-sprite-demo.js";
import { winSize } from "../tests-main-constants.js";
import { TAG_ACTION1_EASE_ACTIONS } from "./ease-actions-test-constants.js";

export class SpeedTest extends EaseSpriteDemo {
    constructor() {
        super();
        this.testDuration = 0.1;
    }

    onEnter() {
        //----start12----onEnter
        super.onEnter();

        // rotate and jump
        var jump1 = new cc.JumpBy(4, new cc.Point(-winSize.width + 80, 0), 100, 4);
        var jump2 = jump1.reverse();
        var rot1 = new cc.RotateBy(4, 360 * 2);
        var rot2 = rot1.reverse();

        var seq3_1 = cc.sequence(jump2, jump1);
        var seq3_2 = cc.sequence(rot1, rot2);
        var spawn = cc.spawn(seq3_1, seq3_2);

        var action = spawn.repeatForever().speed(2);
        action.tag = TAG_ACTION1_EASE_ACTIONS;

        var action2 = action.clone();
        var action3 = action.clone();

        action2.tag = TAG_ACTION1_EASE_ACTIONS;
        action3.tag = TAG_ACTION1_EASE_ACTIONS;

        this._grossini.runAction(action2);
        this._tamara.runAction(action3);
        this._kathia.runAction(action);

        this.schedule(this.altertime, 1.0);
        //----end12----
    }
    title() {
        return "Speed action";
    }

    altertime(dt) {
        //----start12----altertime
        var action1 = this._grossini.getActionByTag(TAG_ACTION1_EASE_ACTIONS);
        var action2 = this._tamara.getActionByTag(TAG_ACTION1_EASE_ACTIONS);
        var action3 = this._kathia.getActionByTag(TAG_ACTION1_EASE_ACTIONS);

        action1.setSpeed(Math.random() * 2);
        action2.setSpeed(Math.random() * 2);
        action3.setSpeed(Math.random() * 2);
        //----end12----
    }
    // automation
    getExpectedResult() {
        throw "Not Implemented";
    }
    getCurrentResult() {
        throw "Not Implemented";
    }

}
