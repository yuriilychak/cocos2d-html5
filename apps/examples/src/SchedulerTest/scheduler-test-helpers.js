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

import { RescheduleCallback } from "./reschedule-callback.js";
import { ScheduleUsingSchedulerTest } from "./schedule-using-scheduler-test.js";
import { SchedulerAutoremove } from "./scheduler-autoremove.js";
import { SchedulerPauseResume } from "./scheduler-pause-resume.js";
import { SchedulerSchedulesAndRemove } from "./scheduler-schedules-and-remove.js";
import { schedulerTestSceneIdx , _setschedulerTestSceneIdx} from "./scheduler-test-constants.js";
import { SchedulerTimeScale } from "./scheduler-time-scale.js";
import { SchedulerUnscheduleAllHard } from "./scheduler-unschedule-all-hard.js";
import { SchedulerUnscheduleAll } from "./scheduler-unschedule-all.js";
import { SchedulerUpdateAndCustom } from "./scheduler-update-and-custom.js";
import { SchedulerUpdateFromCustom } from "./scheduler-update-from-custom.js";
import { SchedulerUpdate } from "./scheduler-update.js";
import { unScheduleAndRepeatTest } from "./un-schedule-and-repeat-test.js";

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

//
// Flow control
//
export var arrayOfSchedulerTest = [
    SchedulerTimeScale,
    SchedulerAutoremove,
    SchedulerPauseResume,
    SchedulerUnscheduleAll,
    SchedulerUnscheduleAllHard,
    SchedulerSchedulesAndRemove,
    SchedulerUpdate,
    SchedulerUpdateAndCustom,
    SchedulerUpdateFromCustom,
    RescheduleCallback,
    ScheduleUsingSchedulerTest,
    unScheduleAndRepeatTest
];

export function nextSchedulerTest() {
    _setschedulerTestSceneIdx(schedulerTestSceneIdx + 1);
    _setschedulerTestSceneIdx(schedulerTestSceneIdx % arrayOfSchedulerTest.length);

    if(window.sideIndexBar){
        _setschedulerTestSceneIdx(window.sideIndexBar.changeTest(schedulerTestSceneIdx, 34));
    }

    return new arrayOfSchedulerTest[schedulerTestSceneIdx]();
}

;

export function previousSchedulerTest() {
    _setschedulerTestSceneIdx(schedulerTestSceneIdx - 1);
    if (schedulerTestSceneIdx < 0)
        _setschedulerTestSceneIdx(schedulerTestSceneIdx + (arrayOfSchedulerTest.length));

    if(window.sideIndexBar){
        _setschedulerTestSceneIdx(window.sideIndexBar.changeTest(schedulerTestSceneIdx, 34));
    }

    return new arrayOfSchedulerTest[schedulerTestSceneIdx]();
}

;

export function restartSchedulerTest() {
    return new arrayOfSchedulerTest[schedulerTestSceneIdx]();
}

;
