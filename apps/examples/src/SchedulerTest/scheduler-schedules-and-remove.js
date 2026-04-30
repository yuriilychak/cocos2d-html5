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
    SchedulerSchedulesAndRemove
*/
export class SchedulerSchedulesAndRemove extends SchedulerTestLayer {
    onEnter() {
        //----start4----onEnter
        super.onEnter();

        this.schedule(this.onTick1, 0.5);
        this.schedule(this.onTick2, 1.0);
        this.schedule(this.onScheduleAndUnschedule, 4.0);
        //----end4----
    }
    title() {
        return "Schedule from Schedule";
    }
    subtitle() {
        return "Will unschedule and schedule callbacks in 4s. See console";
    }

    onTick1(dt) {
        //----start4----onTick1
        cc.log("SchedulerSchedulesAndRemove tick1");
        //----end4----
    }
    onTick2(dt) {
        //----start4----onTick2
        cc.log("SchedulerSchedulesAndRemove tick2");
        //----end4----
    }
    onTick3(dt) {
        //----start4----onTick3
        cc.log("SchedulerSchedulesAndRemove tick3");
        //----end4----
    }
    onTick4(dt) {
        //----start4----onTick4
        cc.log("SchedulerSchedulesAndRemove tick4");
        //----end4----
    }
    onScheduleAndUnschedule(dt) {
        //----start4----onScheduleAndUnschedule
        this.unschedule(this.onTick1);
        this.unschedule(this.onTick2);
        this.unschedule(this.onScheduleAndUnschedule);

        this.schedule(this.onTick3, 1.0);
        this.schedule(this.onTick4, 1.0)
        //----end4----
    }

}
