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
    SchedulerPauseResume
*/
export class SchedulerPauseResume extends SchedulerTestLayer {
    onEnter() {
        //----start1----onEnter
        super.onEnter();

        this.schedule(this.onTick1, 0.5);
        this.schedule(this.onTick2, 0.5);
        this.schedule(this.onPause, 3);
        //----end1----
    }
    title() {
        return "Pause / Resume";
    }
    subtitle() {
        return "Scheduler should be paused after 3 seconds. See console";
    }

    onTick1(dt) {
        //----start1----onTick1
        log("SchedulerPauseResume tick1");
        //----end1----
    }
    onTick2(dt) {
        //----start1----onTick2
        log("SchedulerPauseResume tick2");
        //----end1----
    }
    onPause(dt) {
        //----start1----onPause
        director.getScheduler().pauseTarget(this);
        //----end1----
    }

}
