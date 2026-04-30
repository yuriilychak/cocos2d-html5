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
    ScheduleUsingSchedulerTest
*/
export class ScheduleUsingSchedulerTest extends SchedulerTestLayer {
    constructor() {
        super();
        this._accum = 0;
    }


    onEnter() {
        //----start9----onEnter
        super.onEnter();

        this._accum = 0;
        var scheduler = director.getScheduler();

        var priority = 0;  // priority 0. default.
        var paused = false; // not paused, queue it now.
        scheduler.scheduleUpdate(this, priority, paused);

        var interval = 0.25; // every 1/4 of second
        var repeat = REPEAT_FOREVER; // how many repeats. REPEAT_FOREVER means forever
        var delay = 2; // start after 2 seconds;
        paused = false; // not paused. queue it now.
        scheduler.schedule(this.onSchedUpdate, this, interval, repeat, delay, paused);
        //----end9----
    }
    onExit() {
        // should unschedule here if it is not unscheduled before exit
        this.unscheduleAll();
        super.onExit();
    }
    title() {
        return "Schedule / Unschedule using Scheduler";
    }
    subtitle() {
        return "After 5 seconds all callbacks should be removed";
    }

    // callbacks
    update(dt) {
        //----start9----update
        log("update: " + dt);
        //----end9----
    }
    onSchedUpdate(dt) {
        //----start9----onSchedUpdate
        log("onSchedUpdate delta: " + dt);

        this._accum += dt;
        if( this._accum > 3 ) {
            this.unscheduleAll();
        }
        log("onSchedUpdate accum: " + this._accum);
        //----end9----
    }
    unscheduleAll() {
        var scheduler = director.getScheduler();
        scheduler.unscheduleUpdate(this);
        scheduler.unscheduleAllCallbacksForTarget(this);
    }

}
