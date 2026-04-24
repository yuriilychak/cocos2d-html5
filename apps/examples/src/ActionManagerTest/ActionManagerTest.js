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

var TAG_NODE = 5560;
var TAG_GROSSINI = 5561;
var TAG_SEQUENCE = 5562;

var ActionMgrTestIdx  = -1;
var NOT_CRASHED_CONST = "NOT_CRASHED";


//------------------------------------------------------------------
//
// ActionManagerTest
//
//------------------------------------------------------------------
var ActionManagerTest = class ActionManagerTest extends BaseTestLayer {
    constructor() {
        super();
        this._atlas = null;
        this._title = "";
    }


    title() {
        return "No title";
    }

    subtitle() {
        return "";
    }

    onBackCallback(sender) {
        var s = new ActionManagerTestScene();
        s.addChild(previousActionMgrTest());
        director.runScene(s);
    }
    onRestartCallback(sender) {
        var s = new ActionManagerTestScene();
        s.addChild(restartActionMgrTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new ActionManagerTestScene();
        s.addChild(nextActionMgrTest());
        director.runScene(s);
    }
    // automation
    numberOfPendingTests() {
        return ( (arrayOfActionMgrTest.length-1) - ActionMgrTestIdx );
    }

    getTestNumber() {
        return ActionMgrTestIdx;
    }

};

//------------------------------------------------------------------
//
// Test1
//
//------------------------------------------------------------------
var CrashTest = class CrashTest extends ActionManagerTest {
    title() {
        return "Test 1. Should not crash";
    }
    onEnter() {
        //----start0----onEnter
        super.onEnter();

        var child = new cc.Sprite(s_pathGrossini);
        child.x = 200;
        child.y = 200;
        this.addChild(child, 1);

        //Sum of all action's duration is 1.5 second.
        child.runAction(cc.rotateBy(1.5, 90));
        // child.runAction(cc.sequence(
        //     cc.delayTime(1.4),
        //     cc.fadeOut(1.1))
        // );

        //After 1.5 second, self will be removed.
        this.runAction(cc.sequence(
           cc.delayTime(1.4),
           cc.callFunc(this.onRemoveThis, this))
        );
        //----end0----
    }

    onExitTransitionDidStart() {
        this.stopAllActions();
        super.onExitTransitionDidStart();
    }

    onRemoveThis() {
        //----start0----onRemoveThis
        this.parent.removeChild(this);
        this.onNextCallback(this);
        //----end0----
    }

    //
    // Automation
    //
    getExpectedResult() {
        return NOT_CRASHED_CONST;
    }
    getCurrentResult() {
        return NOT_CRASHED_CONST;
    }

};

//------------------------------------------------------------------
//
// Test2
//
//------------------------------------------------------------------
var LogicTest = class LogicTest extends ActionManagerTest {
    constructor() {
        super();
        this.testDuration = 4.0;
    }

    title() {
        return "Logic test";
    }
    onEnter() {
        //----start1----onEnter
        super.onEnter();

        var grossini = new cc.Sprite(s_pathGrossini);
        this.addChild(grossini, 0, 2);
        grossini.x = 200;
	    grossini.y = 200;

        grossini.runAction(cc.sequence(
            cc.moveBy(1, new cc.Point(150, 0)),
            cc.callFunc(this.onBugMe, this))
        );


        //
        // only for automation
        //
        if ( autoTestEnabled ) {
            this._grossini = grossini;
        }
        //----end1----
    }
    onBugMe(node) {
        //----start1----onBugMe
        node.stopAllActions(); //After this stop next action not working, if remove this stop everything is working
        node.runAction(cc.scaleTo(2, 2));
        //----end1----
    }

    //
    // Automation
    //
    getExpectedResult() {
        var ret = [ {"scaleX":2, "scaleY":2} ];
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret = [ {"scaleX":this._grossini.scaleX, "scaleY":this._grossini.scaleY} ];
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// PauseTest
//
//------------------------------------------------------------------
var PauseTest = class PauseTest extends ActionManagerTest {
    constructor() {
        super();
        this.testDuration = 5.5;
    }

    title() {
        return "Pause Test";
    }
    onEnter() {
        //----start2----onEnter
        //
        // This test MUST be done in 'onEnter' and not on 'init'
        // otherwise the paused action will be resumed at 'onEnter' time
        //
        super.onEnter();

        var s = director.getWinSize();
        var l = new cc.LabelTTF("After 3 seconds grossini should move", "Thonburi", 16);
        this.addChild(l);
        l.x = s.width / 2;
	    l.y = 245;

        //
        // Also, this test MUST be done, after [super onEnter]
        //
        var grossini = new cc.Sprite(s_pathGrossini);
        this.addChild(grossini, 0, TAG_GROSSINI);
        grossini.x = 200;
	    grossini.y = 200;


        var action = cc.moveBy(1, new cc.Point(150, 0));

        director.getActionManager().addAction(action, grossini, true);

        this.schedule(this.onUnpause, 3);

        //
        // only for automation
        //
        if ( autoTestEnabled ) {
            this.scheduleOnce(this.checkControl1, 2.0);
            this.scheduleOnce(this.checkControl2, 4.5);
            this._grossini = grossini;
        }
        //----end2----
    }

    onUnpause(dt) {
        //----start2----onUnpause
        this.unschedule(this.onUnpause);
        var node = this.getChildByTag(TAG_GROSSINI);
        director.getActionManager().resumeTarget(node);
        //----end2----
    }

    //
    // Automation
    //
    checkControl1(dt) {
        this.control1 = new cc.Point(this._grossini.x, this._grossini.y);
    }
    checkControl2(dt) {
        this.control2 = new cc.Point(this._grossini.x, this._grossini.y);
    }
    getExpectedResult() {
        var ret = [ {"x":200, "y":200}, {"x":350, "y":200} ];
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret = [ {"x":this.control1.x, "y":this.control1.y}, {"x":this.control2.x, "y":this.control2.y} ];
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// RemoveTest
//
//------------------------------------------------------------------
var RemoveTest = class RemoveTest extends ActionManagerTest {
    constructor() {
        super();
        this.testDuration = 3.5;
    }

    title() {
        return "Stop Action Test";
    }
    onEnter() {
        //----start3----onEnter
        super.onEnter();

        var s = director.getWinSize();
        var l = new cc.LabelTTF("Should not crash", "Thonburi", 16);
        this.addChild(l);
        l.x = s.width / 2;
	    l.y = 245;

        var move = cc.moveBy(2, new cc.Point(200, 0));
        var callback = cc.callFunc(this.stopAction, this);
        var sequence = cc.sequence(move, callback);
        sequence.tag = TAG_SEQUENCE;

        var child = new cc.Sprite(s_pathGrossini);
        child.x = 200;
	    child.y = 200;

        this.addChild(child, 1, TAG_GROSSINI);
        child.runAction(sequence);
        //----end3----
    }

    stopAction() {
        //----start3----onEnter
        var sprite = this.getChildByTag(TAG_GROSSINI);
        sprite.stopActionByTag(TAG_SEQUENCE);
        //----end3----
    }

    //
    // Automation
    //
    getExpectedResult() {
        return NOT_CRASHED_CONST;
    }
    getCurrentResult() {
        return NOT_CRASHED_CONST;
    }

};

//------------------------------------------------------------------
//
// ResumeTest
//
//------------------------------------------------------------------
var ResumeTest = class ResumeTest extends ActionManagerTest {
    constructor() {
        super();
        this.testDuration = 6.0;
    }

    title() {
        return "Resume Test";
    }
    onEnter() {
        //----start4----onEnter
        super.onEnter();

        var s = director.getWinSize();
        var l = new cc.LabelTTF("Grossini only rotate/scale in 3 seconds", "Thonburi", 16);
        this.addChild(l);
        l.x = s.width / 2;
	    l.y = 245;

        var grossini = new cc.Sprite(s_pathGrossini);
        this._grossini = grossini;
        this.addChild(grossini, 0, TAG_GROSSINI);
        grossini.x = s.width / 2;
	    grossini.y = s.height / 2;

        grossini.runAction(cc.scaleBy(2, 2));

        director.getActionManager().pauseTarget(grossini);
        grossini.runAction(cc.rotateBy(2, 360));

        this.schedule(this.resumeGrossini, 3.0);
        //----end4----

    }
    resumeGrossini(time) {
        //----start4----resumeGrossini
        this.unschedule(this.resumeGrossini);

        var grossini = this.getChildByTag(TAG_GROSSINI);
        director.getActionManager().resumeTarget(grossini);
        //----end4----
    }

    //
    // Automation
    //
    setupAutomation() {
        this.scheduleOnce(this.checkControl1, 1.0);
        this.scheduleOnce(this.checkControl2, 5.5);
    }
    checkControl1(dt) {
        this.control1ScaleX    = this._grossini.scaleX;
        this.control1ScaleY    = this._grossini.scaleY;
        this.control1Rotation  = this._grossini.rotation;
    }
    checkControl2(dt) {
        this.control2ScaleX    = this._grossini.scaleX;
        this.control2ScaleY    = this._grossini.scaleY;
        this.control2Rotation  = this._grossini.rotation;
    }
    getExpectedResult() {
        var ret = [ {"Rot":0 }, {"sX":1, "sY":1}, {"Rot":360 }, {"sX":2, "sY":2} ];
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret = [ {"Rot": this.control1Rotation }, {"sX": this.control1ScaleX, "sY": this.control1ScaleY}, {"Rot": this.control2Rotation }, {"sX": this.control2ScaleX, "sY": this.control2ScaleY} ];
        return JSON.stringify(ret);
    }

};

var ActionManagerTestScene = class ActionManagerTestScene extends TestScene {
    runThisTest(num) {
        ActionMgrTestIdx = (num || 0) - 1;
        this.addChild(nextActionMgrTest());
        director.runScene(this);
    }

};


//-
//
// Flow control
//
var arrayOfActionMgrTest = [
    CrashTest,
    LogicTest,
    PauseTest,
    RemoveTest,
    ResumeTest
];

var nextActionMgrTest = function (num) {

    ActionMgrTestIdx = num ? num - 1 : ActionMgrTestIdx;

    ActionMgrTestIdx++;
    ActionMgrTestIdx = ActionMgrTestIdx % arrayOfActionMgrTest.length;

    if(window.sideIndexBar){
        ActionMgrTestIdx = window.sideIndexBar.changeTest(ActionMgrTestIdx, 0);
    }

    return new arrayOfActionMgrTest[ActionMgrTestIdx]();
};
var previousActionMgrTest = function () {
    ActionMgrTestIdx--;
    if (ActionMgrTestIdx < 0)
        ActionMgrTestIdx += arrayOfActionMgrTest.length;

    if(window.sideIndexBar){
        ActionMgrTestIdx = window.sideIndexBar.changeTest(ActionMgrTestIdx, 0);
    }

    return new arrayOfActionMgrTest[ActionMgrTestIdx]();
};
var restartActionMgrTest = function () {
    return new arrayOfActionMgrTest[ActionMgrTestIdx]();
};
