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

import { TestNodeDemo } from "./test-node-demo.js";
import { s_back3, s_playNormal, s_playSelect } from "../tests_resources.js";

export class NodeToWorld extends TestNodeDemo {
    constructor() {
        //----start6----ctor
        // This code tests that nodeToParent works OK:
        //  - It tests different anchor Points
        //  - It tests different children anchor points
        super();

        this.testDuration = 3.1;
        var back = new cc.Sprite(s_back3);
        this.addChild(back, 5);
        back.anchorX = 0;
        back.anchorY = 0;

        var item = new cc.MenuItemImage(s_playNormal, s_playSelect, this.onClicked);
        var menu = new cc.Menu(item);
        menu.alignItemsVertically();
        menu.x = back.width / 2;
        menu.y = back.height / 2;
        back.addChild(menu);

        var rot = new cc.RotateBy(3, 360);
        var delay = new cc.DelayTime(0.3);
        var fe = cc.sequence(rot, delay).repeatForever();
        item.runAction(fe);

        var move = new cc.MoveBy(3, new cc.Point(200, 0));
        var move_back = move.reverse();
        var seq = cc.sequence(move, delay.clone(), move_back);
        var fe2 = seq.repeatForever();
        back.runAction(fe2);

        //Automation parameters
        this.autoParam = item;
        //----end6----
    }
    onClicked() {
        //----start6----ctor
        cc.log("On clicked");
        //----end6----
    }
    title() {
        return "nodeToParent transform";
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"a":1, "b":"0.00", "c":"-0.00", "d":1, "tx":"378", "ty":"139"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret = this.autoParam.nodeToWorldTransform();
        ret.b = ret.b.toFixed(2);
        ret.c = ret.c.toFixed(2);
        ret.tx = ret.tx.toFixed(0);
        ret.ty = ret.ty.toFixed(0);
        return JSON.stringify(ret);
    }

}
