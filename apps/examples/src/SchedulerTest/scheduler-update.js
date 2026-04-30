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

import { SchedulerTestLayer } from "./scheduler-test-layer.js";
import { TestNode } from "./test-node.js";

export class SchedulerUpdate extends SchedulerTestLayer {
    onEnter() {
        //----start5----onEnter
        super.onEnter();

        var str = "---";
        var d = new TestNode(str,50);
        this.addChild(d);

        str = "3rd";
        var b = new TestNode(str,0);
        this.addChild(b);

        str = "1st";
        var a = new TestNode(str, -10);
        this.addChild(a);

        str = "4th";
        var c = new TestNode(str,10);
        this.addChild(c);

        str = "5th";
        var e = new TestNode(str,20);
        this.addChild(e);

        str = "2nd";
        var f = new TestNode(str,-5);
        this.addChild(f);

        this.schedule(this.onRemoveUpdates, 4.0);
        //----end5----
    }
    title() {
        return "Schedule update with priority";
    }
    subtitle() {
        return "3 scheduled updates. Priority should work. Stops in 4s. See console";
    }

    onRemoveUpdates(dt) {
        //----start5----onRemoveUpdates
        var children = this.children;

        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            if (node) {
                node.unscheduleAllCallbacks();
            }
        }
        //----end5----
    }

}
