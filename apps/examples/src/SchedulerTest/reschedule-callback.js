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
    RescheduleCallback
*/
import { SchedulerTestLayer } from "./scheduler-test-layer.js";

export class RescheduleCallback extends SchedulerTestLayer {
    constructor() {
        super();
        this._interval = 1.0;
        this._ticks = 0;
    }


    onEnter() {
        //----start8----onEnter
        super.onEnter();

        this._interval = 1.0;
        this._ticks = 0;
        this.schedule(this.onSchedUpdate, this._interval);
        //----end8----
    }
    title() {
        return "Reschedule Callback";
    }
    subtitle() {
        return "Interval is 1 second, then 2, then 3...";
    }

    onSchedUpdate(dt) {
        //----start8----onSchedUpdate
        this._ticks++;

        cc.log("schedUpdate: " + dt.toFixed(2));
        if (this._ticks > 3) {
            this._interval += 1.0;
            this.schedule(this.onSchedUpdate, this._interval);
            this._ticks = 0;
        }
        //----end8----
    }

}
