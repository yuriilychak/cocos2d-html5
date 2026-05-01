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

import { SchedulerTestLayer } from "./scheduler-test-layer";
import { log } from "@aspect/core";

export class unScheduleAndRepeatTest extends SchedulerTestLayer {
  constructor() {
    super();
    this._times = 5;
  }

  onEnter() {
    super.onEnter();
    log("start schedule 'repeat': run once and repeat 4 times");
    this.schedule(this.repeat, 0.5, 4);
    log("start schedule 'forever': repeat forever (stop in 8s)");
    this.schedule(this.forever, 0.5);
    this.schedule(function () {
      log("stop the 'forever'");
      this.unschedule(this.forever);
    }, 8);
  }

  repeat() {
    log("Repeat - the remaining number: " + this._times--);
  }

  forever() {
    log("Repeat Forever...");
  }

  title() {
    return "Repeat And unschedule Test";
  }

  subtitle() {
    return "Repeat will print 5 times\nForever will stop in 8 seconds.";
  }
}
