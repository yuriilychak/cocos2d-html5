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

import { TAG_SPRITE1, TAG_SPRITE2 } from "./cocos-node-test-constants.js";
import { TestNodeDemo } from "./test-node-demo.js";
import { s_pathSister1, s_pathSister2 } from "../tests_resources.js";
import { winSize } from "../tests-main-constants.js";

export class CCNodeTest6 extends TestNodeDemo {
    constructor() {
        //----start3----ctor
        super();

        this.testDuration = 2.1;
        var sp1 = new cc.Sprite(s_pathSister1);
        var sp11 = new cc.Sprite(s_pathSister1);

        var sp2 = new cc.Sprite(s_pathSister2);
        var sp21 = new cc.Sprite(s_pathSister2);

        sp1.x = 150;
        sp1.y = winSize.height / 2;
        sp2.x = winSize.width - 150;
        sp2.y = winSize.height / 2;

        var rot = new cc.RotateBy(2, 360);
        var rot_back = rot.reverse();
        var forever1 = cc.sequence(rot, rot_back).repeatForever();
        var forever11 = forever1.clone();

        var forever2 = forever1.clone();
        var forever21 = forever1.clone();

        this.addChild(sp1, 0, TAG_SPRITE1);
        sp1.addChild(sp11, 11);
        this.addChild(sp2, 0, TAG_SPRITE2);
        sp2.addChild(sp21, 21);

        sp1.runAction(forever1);
        sp11.runAction(forever11);
        sp2.runAction(forever2);
        sp21.runAction(forever21);

        this.schedule(this.onAddAndRemove, 2.0);
        //----end3----
    }
    onAddAndRemove(dt) {
        //----start3----onAddAndRemove
        var sp1 = this.getChildByTag(TAG_SPRITE1);
        var sp2 = this.getChildByTag(TAG_SPRITE2);

        this.removeChild(sp1, false);
        this.removeChild(sp2, true);

        //Automation parameters
        this.autoParam1 = sp1.getChildByTag(11);
        this.autoParam2 = sp2.getChildByTag(21);

        this.addChild(sp1, 0, TAG_SPRITE1);
        this.addChild(sp2, 0, TAG_SPRITE2);

    }
    title() {
        return "remove/cleanup with children";
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = [null, null];
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret = [this.autoParam1, this.autoParam2];
        return JSON.stringify(ret);
    }

}
