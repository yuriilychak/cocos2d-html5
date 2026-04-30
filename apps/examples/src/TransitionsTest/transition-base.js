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

import { BaseTestLayer } from "../BaseTestLayer/BaseTestLayer.js";
import { director } from "../tests-main-constants.js";
import { arrayOfTransitionsTest, transitionsIdx , _settransitionsIdx} from "./transitions-test-constants.js";
import { TransitionsTestScene } from "./transitions-test-scene.js";

export class TransitionBase extends BaseTestLayer {

    title() {
        return arrayOfTransitionsTest[transitionsIdx].title;
    }
    constructor(backgroundImage, sceneName, colorA, colorB) {
        super(colorA, colorB);

        this.backgroundImage = backgroundImage || "";
        this.sceneName = sceneName || "";
        this.testDuration = TRANSITION_DURATION + 0.1;

        var x, y;
        var size = director.getWinSize();
        x = size.width;
        y = size.height;

        var bg1 = new cc.Sprite(this.backgroundImage);
        bg1.x = size.width / 2;
        bg1.y = size.height / 2;
        bg1.scale = 1.7;
        this.addChild(bg1);

        var title = new cc.LabelTTF(this.title(), "Thonburi", 32);
        this.addChild(title);
        title.color = new cc.Color(255, 32, 32);
        title.x = x / 2;
        title.y = y - 100;

        var label = new cc.LabelTTF(this.sceneName, "Marker Felt", 38);
        label.color = new cc.Color(16, 16, 255);
        label.x = x / 2;
        label.y = y / 2;
        this.addChild(label);

        // this.schedule(this.step, 1.0);
    }
    onRestartCallback(sender) {
        var s = new TransitionsTestScene();

        var layer = this.createNextScene();
        s.addChild(layer);
        var scene = arrayOfTransitionsTest[transitionsIdx].transitionFunc(TRANSITION_DURATION, s);

        if (scene)
            director.runScene(scene);
    }
    onNextCallback(sender) {
        _settransitionsIdx(transitionsIdx + 1);
        _settransitionsIdx(transitionsIdx % arrayOfTransitionsTest.length);

        var s = new TransitionsTestScene();

        var layer = this.createNextScene();
        s.addChild(layer);

        var scene = arrayOfTransitionsTest[transitionsIdx].transitionFunc(TRANSITION_DURATION, s);
        if (scene)
            director.runScene(scene);
    }
    onBackCallback(sender) {
        _settransitionsIdx(transitionsIdx - 1);
        if (transitionsIdx < 0)
            _settransitionsIdx(transitionsIdx + (arrayOfTransitionsTest.length));

        var s = new TransitionsTestScene();
        var layer = this.createNextScene();
        s.addChild(layer);

        var scene = arrayOfTransitionsTest[transitionsIdx].transitionFunc(TRANSITION_DURATION, s);
        if (scene)
            director.runScene(scene);
    }

    step(dt) {
    }

    onEnter() {
        super.onEnter();
        this.log("" + this.sceneName + " onEnter");
    }
    onEnterTransitionDidFinish() {
        super.onEnterTransitionDidFinish();
        this.log("" + this.sceneName + " onEnterTransitionDidFinish");
    }

    onExitTransitionDidStart() {
        super.onExitTransitionDidStart();
        this.log("" + this.sceneName + " onExitTransitionDidStart");
    }

    onExit() {
        super.onExit();
        this.log("" + this.sceneName + " onExit");
    }
    // automation
    numberOfPendingTests() {
        return ( (arrayOfTransitionsTest.length-1) - transitionsIdx );
    }

    getTestNumber() {
        return transitionsIdx;
    }


}
