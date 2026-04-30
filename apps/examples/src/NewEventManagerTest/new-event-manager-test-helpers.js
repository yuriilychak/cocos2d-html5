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

import { CustomEventTest } from "./custom-event-test.js";
import { DirectorEventTest } from "./director-event-test.js";
import { FixedPriorityTest } from "./fixed-priority-test.js";
import { GlobalZTouchTest } from "./global-ztouch-test.js";
import { Issue4160 } from "./issue4160.js";
import { Issue9898 } from "./issue9898.js";
import { LabelKeyboardEventTest } from "./label-keyboard-event-test.js";
import { eventDispatcherSceneIdx , _seteventDispatcherSceneIdx} from "./new-event-manager-test-constants.js";
import { PauseResumeTargetTest } from "./pause-resume-target-test.js";
import { RemoveAndRetainNodeTest } from "./remove-and-retain-node-test.js";
import { RemoveListenerAfterAddingTest } from "./remove-listener-after-adding-test.js";
import { RemoveListenerWhenDispatching } from "./remove-listener-when-dispatching.js";
import { SpriteAccelerationEventTest } from "./sprite-acceleration-event-test.js";
import { StopPropagationTest } from "./stop-propagation-test.js";
import { TouchableSpriteTest } from "./touchable-sprite-test.js";
import { TouchableSprite } from "./touchable-sprite.js";

;

;

TouchableSpriteTest.create = function(){
    var test = new TouchableSpriteTest();
    test.init();
    return test;
};

;

TouchableSprite.create = function(priority){
    var test = new TouchableSprite(priority);
    test.init();
    return test;
};

;

FixedPriorityTest.create = function(){
    var test = new FixedPriorityTest();
    test.init();
    return test;
};

;

RemoveListenerWhenDispatching.create = function(){
    var test = new RemoveListenerWhenDispatching();
    test.init();
    return test;
};

;

CustomEventTest.create = function(){
    var test = new CustomEventTest();
    test.init();
    return test;
};

;

LabelKeyboardEventTest.create = function(){
    var test = new LabelKeyboardEventTest();
    test.init();
    return test;
};

;

SpriteAccelerationEventTest._fix_pos = function(pos, min, max){
    var ret = pos;
     if(pos < min)
         ret = min;
    else if(pos > max)
         ret = max;
    return ret;
};

SpriteAccelerationEventTest.create = function(){
    var test = new SpriteAccelerationEventTest();
    test.init();
    return test;
};

;

RemoveAndRetainNodeTest.create = function(){
    var test = new RemoveAndRetainNodeTest();
    test.init();
    return test;
};

;

RemoveListenerAfterAddingTest.create = function(){
    var test = new RemoveListenerAfterAddingTest();
    test.init();
    return test;
};

;

DirectorEventTest.create = function(){
    var test = new DirectorEventTest();
    test.init();
    return test;
};

;

GlobalZTouchTest.create = function(){
    var test = new GlobalZTouchTest();
    test.init();
    return test;
};

;

StopPropagationTest._TAG_BLUE_SPRITE = 101;

StopPropagationTest._TAG_BLUE_SPRITE2 = 102;

StopPropagationTest.create = function(){
    var test = new StopPropagationTest();
    test.init();
    return test;
};

;

Issue4160.create = function(){
    var test = new Issue4160();
    test.init();
    return test;
};

;

PauseResumeTargetTest.create = function(){
    var test = new Issue4160();
    test.init();
    return test;
};

;

Issue9898.create = function(){
    var test = new Issue9898();
    test.init();
    return test;
};

;

export var arrayOfEventDispatcherTest = [
    TouchableSpriteTest,
    FixedPriorityTest,
    RemoveListenerWhenDispatching,
    CustomEventTest,
    LabelKeyboardEventTest,
    SpriteAccelerationEventTest,
    RemoveAndRetainNodeTest,
    RemoveListenerAfterAddingTest,
    DirectorEventTest,
    //GlobalZTouchTest,
    StopPropagationTest,
    Issue4160,
    PauseResumeTargetTest,
    Issue9898
];

export function nextDispatcherTest() {
    _seteventDispatcherSceneIdx(eventDispatcherSceneIdx + 1);
    _seteventDispatcherSceneIdx(eventDispatcherSceneIdx % arrayOfEventDispatcherTest.length);

    if(window.sideIndexBar){
        _seteventDispatcherSceneIdx(window.sideIndexBar.changeTest(eventDispatcherSceneIdx, 11));
    }

    return new arrayOfEventDispatcherTest[eventDispatcherSceneIdx]();
}

;

export function previousDispatcherTest() {
    _seteventDispatcherSceneIdx(eventDispatcherSceneIdx - 1);
    if (eventDispatcherSceneIdx < 0)
        _seteventDispatcherSceneIdx(eventDispatcherSceneIdx + (arrayOfEventDispatcherTest.length));

    if(window.sideIndexBar){
        _seteventDispatcherSceneIdx(window.sideIndexBar.changeTest(eventDispatcherSceneIdx, 11));
    }

    return new arrayOfEventDispatcherTest[eventDispatcherSceneIdx]();
}

;

export function restartDispatcherTest() {
    return new arrayOfEventDispatcherTest[eventDispatcherSceneIdx]();
}

;
