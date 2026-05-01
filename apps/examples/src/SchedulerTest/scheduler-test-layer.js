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
    Base Layer
*/
import { BaseTestLayer } from "../BaseTestLayer/BaseTestLayer";
import { schedulerTestSceneIdx } from "./scheduler-test-constants";
import {
  arrayOfSchedulerTest,
  nextSchedulerTest,
  previousSchedulerTest,
  restartSchedulerTest
} from "./scheduler-test-helpers";
import { SchedulerTestScene } from "./scheduler-test-scene";
import { director } from "../constants";

export class SchedulerTestLayer extends BaseTestLayer {
  title() {
    return "No title";
  }
  subtitle() {
    return "";
  }

  onBackCallback(sender) {
    var scene = new SchedulerTestScene();
    var layer = previousSchedulerTest();

    scene.addChild(layer);
    director.runScene(scene);
  }
  onNextCallback(sender) {
    var scene = new SchedulerTestScene();
    var layer = nextSchedulerTest();

    scene.addChild(layer);
    director.runScene(scene);
  }
  onRestartCallback(sender) {
    var scene = new SchedulerTestScene();
    var layer = restartSchedulerTest();

    scene.addChild(layer);
    director.runScene(scene);
  }
  // automation
  numberOfPendingTests() {
    return arrayOfSchedulerTest.length - 1 - schedulerTestSceneIdx;
  }

  getTestNumber() {
    return schedulerTestSceneIdx;
  }
}
