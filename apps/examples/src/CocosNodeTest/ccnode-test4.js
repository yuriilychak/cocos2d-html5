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

export class CCNodeTest4 extends TestNodeDemo {
    constructor() {
        //----start1----ctor
        super();

        this.testDuration = 1;
        var sp1 = new Sprite(s_pathSister1);
        var sp2 = new Sprite(s_pathSister2);
        sp1.x = 150;
        sp1.y = winSize.height / 2;
        sp2.x = winSize.width - 150;
        sp2.y = winSize.height / 2;

        this.addChild(sp1, 0, 2);
        this.addChild(sp2, 0, 3);

        this.schedule(this.delay2, 2.0);
        this.schedule(this.delay4, 4.0);

        //Automation param
        this.autoParam = sp1;
        //----end1----
    }
    delay2(dt) {
        //----start1----delay2
        var node = this.getChildByTag(2);
        var action1 = new RotateBy(1, 360);
        node.runAction(action1);
        //----end1----
    }
    delay4(dt) {
        //----start1----delay4
        this.unschedule(this.delay4);
        this.removeChildByTag(3, false);
        //----end1----
    }
    title() {
        return "tags";
    }
    //
    // Automation
    //
    getExpectedResult() {
        return this.autoParam;
    }
    getCurrentResult() {
        var node = this.getChildByTag(2);
        return node;
    }

}
