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

/*
    SchedulerAutoremove
*/
export class SchedulerAutoremove extends SchedulerTestLayer {
    constructor() {
        super();
        this._accum = 0;
    }


    onEnter() {
        //----start0----onEnter
        super.onEnter();

        this.schedule(this.onAutoremove, 0.5);
        this.schedule(this.onTick, 0.5);
        this._accum = 0;
        //----end0----
    }
    title() {
        return "Self-remove an scheduler";
    }
    subtitle() {
        return "1 scheduler will be autoremoved in 3 seconds. See console";
    }

    onAutoremove(dt) {
        //----start0----onAutoremove
        this._accum += dt;
        log("Time: " + this._accum);

        if (this._accum > 3) {
            this.unschedule(this.onAutoremove);
            log("scheduler removed");
        }
        //----end0----
    }
    onTick(dt) {
        log("This scheduler should not be removed");
    }

}
