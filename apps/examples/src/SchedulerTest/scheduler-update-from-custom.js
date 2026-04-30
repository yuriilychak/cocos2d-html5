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
    SchedulerUpdateFromCustom
*/
import { SchedulerTestLayer } from "./scheduler-test-layer.js";

export class SchedulerUpdateFromCustom extends SchedulerTestLayer {
    onEnter() {
        //----start7----onEnter
        super.onEnter();

        this.schedule(this.onSchedUpdate, 2.0);
        //----end7----
    }
    title() {
        return "Schedule Update in 2 sec";
    }
    subtitle() {
        return "Update schedules in 2 secs. Stops 2 sec later. See console";
    }

    update(dt) {
        //----start7----update
        cc.log("update called:" + dt);
        //----end7----
    }
    onSchedUpdate(dt) {
        //----start7----onSchedUpdate
        this.unschedule(this.onSchedUpdate);
        this.scheduleUpdate();
        this.schedule(this.onStopUpdate, 2.0);
        //----end7----
    }
    onStopUpdate(dt) {
        //----start7----onStopUpdate
        this.unscheduleUpdate();
        this.unschedule(this.onStopUpdate);
        //----end7----
    }

}
