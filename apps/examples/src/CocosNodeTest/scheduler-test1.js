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

export class SchedulerTest1 extends TestNodeDemo {
    constructor() {
        //----start7----ctor
        super();

        this.testDuration = 0.5;

        this.testBool = true;
        var layer = new cc.Layer();
        //UXLOG("retain count after init is %d", layer->retainCount());
        // 1

        this.addChild(layer, 0);
        //UXLOG("retain count after addChild is %d", layer->retainCount());
        // 2

        layer.schedule(this.doSomething);
        //UXLOG("retain count after schedule is %d", layer->retainCount());
        // 3 : (objective-c version), but win32 version is still 2, because CCTimer class don't save target.

        layer.unschedule(this.doSomething);
        //UXLOG("retain count after unschedule is %d", layer->retainCount());
        // STILL 3!  (win32 is '2')
        //----end7----
    }

    doSomething(dt) {
        //----start7----doSomething
        this.testBool = false;
        //----end7----
    }

    title() {
        return "cocosnode scheduler test #1";
    }
    //
    // Automation
    //
    getExpectedResult() {
        return true;
    }
    getCurrentResult() {
        return this.testBool;
    }

}
