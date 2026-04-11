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
var TAG_ANIMATION_DANCE = 1;
var schedulerTestSceneIdx = -1;

/*
    Base Layer
*/
var SchedulerTestLayer = class SchedulerTestLayer extends BaseTestLayer {

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
        return ( (arrayOfSchedulerTest.length-1) - schedulerTestSceneIdx );
    }

    getTestNumber() {
        return schedulerTestSceneIdx;
    }


};

/*
    SchedulerAutoremove
*/
var SchedulerAutoremove = class SchedulerAutoremove extends SchedulerTestLayer {
    constructor() {
        super();
        this._accum = 0;
    }


    onEnter() {
        //----start0----onEnter
        super.onEnter();

        this.schedule(this.onAutoremove, 0.5);
        this.schedule(this.onTick, 0.5);
        this._accum = 0;
        //----end0----
    }
    title() {
        return "Self-remove an scheduler";
    }
    subtitle() {
        return "1 scheduler will be autoremoved in 3 seconds. See console";
    }

    onAutoremove(dt) {
        //----start0----onAutoremove
        this._accum += dt;
        cc.log("Time: " + this._accum);

        if (this._accum > 3) {
            this.unschedule(this.onAutoremove);
            cc.log("scheduler removed");
        }
        //----end0----
    }
    onTick(dt) {
        cc.log("This scheduler should not be removed");
    }

};

/*
    SchedulerPauseResume
*/
var SchedulerPauseResume = class SchedulerPauseResume extends SchedulerTestLayer {
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
        cc.log("SchedulerPauseResume tick1");
        //----end1----
    }
    onTick2(dt) {
        //----start1----onTick2
        cc.log("SchedulerPauseResume tick2");
        //----end1----
    }
    onPause(dt) {
        //----start1----onPause
        director.getScheduler().pauseTarget(this);
        //----end1----
    }

};

/*
    SchedulerUnscheduleAll
*/
var SchedulerUnscheduleAll = class SchedulerUnscheduleAll extends SchedulerTestLayer {
    onEnter() {
        //----start2----onEnter
        super.onEnter();

        this.schedule(this.onTick1, 0.5);
        this.schedule(this.onTick2, 1.0);
        this.schedule(this.onTick3, 1.5);
        this.schedule(this.onTick4, 1.5);
        this.schedule(this.onUnscheduleAll, 4);
        //----end2----
    }
    title() {
        return "Unschedule All callbacks";
    }
    subtitle() {
        return "All scheduled callbacks will be unscheduled in 4 seconds. See console";
    }

    onTick1(dt) {
        //----start2----onTick1
        cc.log("SchedulerUnscheduleAll tick1");
        //----end2----
    }
    onTick2(dt) {
        //----start2----onTick2
        cc.log("SchedulerUnscheduleAll tick2");
        //----end2----
    }
    onTick3(dt) {
        //----start2----onTick3
        cc.log("SchedulerUnscheduleAll tick3");
        //----end2----
    }
    onTick4(dt) {
        //----start2----onTick4
        cc.log("SchedulerUnscheduleAll tick4");
        //----end2----
    }
    onUnscheduleAll(dt) {
        //----start2----onUnscheduleAll
        this.unscheduleAllCallbacks();
        //----end2----
    }

};

/*
    SchedulerUnscheduleAllHard
*/
var SchedulerUnscheduleAllHard = class SchedulerUnscheduleAllHard extends SchedulerTestLayer {
    onEnter() {
        //----start3----onEnter
        super.onEnter();

        this.schedule(this.onTick1, 0.5);
        this.schedule(this.onTick2, 1.0);
        this.schedule(this.onTick3, 1.5);
        this.schedule(this.onTick4, 1.5);
        this.schedule(this.onUnscheduleAll, 4);
        //----end3----
    }
    title() {
        return "Unschedule All callbacks #2";
    }
    subtitle() {
        return "Unschedules all callbacks after 4s. Uses CCScheduler. See console";
    }

    onTick1(dt) {
        //----start3----onTick1
        cc.log("SchedulerUnscheduleAllHard tick1");
        //----end3----
    }
    onTick2(dt) {
        //----start3----onTick2
        cc.log("SchedulerUnscheduleAllHard tick2");
        //----end3----
    }
    onTick3(dt) {
        //----start3----onTick3
        cc.log("SchedulerUnscheduleAllHard tick3");
        //----end3----
    }
    onTick4(dt) {
        //----start3----onTick4
        cc.log("SchedulerUnscheduleAllHard tick4");
        //----end3----
    }
    onUnscheduleAll(dt) {
        //----start3----onUnscheduleAll
        director.getScheduler().unscheduleAllCallbacks();
        //----end3----
    }

};

/*
    SchedulerSchedulesAndRemove
*/
var SchedulerSchedulesAndRemove = class SchedulerSchedulesAndRemove extends SchedulerTestLayer {
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

};

/*
    SchedulerUpdate
*/
var TestNode = class TestNode extends cc.Node {

    constructor(str, priority) {
        super();


        this._pString = "";
        this.init();
        this._pString = str;
        this.scheduleUpdateWithPriority(priority);
    }
    update(dt) {
        cc.log( this._pString );
    }

};

var SchedulerUpdate = class SchedulerUpdate extends SchedulerTestLayer {
    onEnter() {
        //----start5----onEnter
        super.onEnter();

        var str = "---";
        var d = new TestNode(str,50);
        this.addChild(d);

        str = "3rd";
        var b = new TestNode(str,0);
        this.addChild(b);

        str = "1st";
        var a = new TestNode(str, -10);
        this.addChild(a);

        str = "4th";
        var c = new TestNode(str,10);
        this.addChild(c);

        str = "5th";
        var e = new TestNode(str,20);
        this.addChild(e);

        str = "2nd";
        var f = new TestNode(str,-5);
        this.addChild(f);

        this.schedule(this.onRemoveUpdates, 4.0);
        //----end5----
    }
    title() {
        return "Schedule update with priority";
    }
    subtitle() {
        return "3 scheduled updates. Priority should work. Stops in 4s. See console";
    }

    onRemoveUpdates(dt) {
        //----start5----onRemoveUpdates
        var children = this.children;

        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            if (node) {
                node.unscheduleAllCallbacks();
            }
        }
        //----end5----
    }

};

/*
    SchedulerUpdateAndCustom
*/
var SchedulerUpdateAndCustom = class SchedulerUpdateAndCustom extends SchedulerTestLayer {
    onEnter() {
        //----start6----onEnter
        super.onEnter();

        this.scheduleUpdate();
        this.schedule(this.onTick);
        this.schedule(this.onStopCallbacks, 4);
        //----end6----
    }
    title() {
        return "Schedule Update + custom callback";
    }
    subtitle() {
        return "Update + custom callback at the same time. Stops in 4s. See console";
    }

    update(dt) {
        //----start6----update
        cc.log("update called:" + dt);
        //----end6----
    }
    onTick(dt) {
        //----start6----onTick
        cc.log("custom callback called:" + dt);
        //----end6----
    }
    onStopCallbacks(dt) {
        //----start6----onStopCallbacks
        this.unscheduleAllCallbacks();
        //----end6----
    }

};

/*
    SchedulerUpdateFromCustom
*/
var SchedulerUpdateFromCustom = class SchedulerUpdateFromCustom extends SchedulerTestLayer {
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

};


/*
    RescheduleCallback
*/
var RescheduleCallback = class RescheduleCallback extends SchedulerTestLayer {
    constructor() {
        super();
        this._interval = 1.0;
        this._ticks = 0;
    }


    onEnter() {
        //----start8----onEnter
        super.onEnter();

        this._interval = 1.0;
        this._ticks = 0;
        this.schedule(this.onSchedUpdate, this._interval);
        //----end8----
    }
    title() {
        return "Reschedule Callback";
    }
    subtitle() {
        return "Interval is 1 second, then 2, then 3...";
    }

    onSchedUpdate(dt) {
        //----start8----onSchedUpdate
        this._ticks++;

        cc.log("schedUpdate: " + dt.toFixed(2));
        if (this._ticks > 3) {
            this._interval += 1.0;
            this.schedule(this.onSchedUpdate, this._interval);
            this._ticks = 0;
        }
        //----end8----
    }

};

/*
    ScheduleUsingSchedulerTest
*/
var ScheduleUsingSchedulerTest = class ScheduleUsingSchedulerTest extends SchedulerTestLayer {
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
        var repeat = cc.REPEAT_FOREVER; // how many repeats. cc.REPEAT_FOREVER means forever
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
        cc.log("update: " + dt);
        //----end9----
    }
    onSchedUpdate(dt) {
        //----start9----onSchedUpdate
        cc.log("onSchedUpdate delta: " + dt);

        this._accum += dt;
        if( this._accum > 3 ) {
            this.unscheduleAll();
        }
        cc.log("onSchedUpdate accum: " + this._accum);
        //----end9----
    }
    unscheduleAll() {
        var scheduler = director.getScheduler();
        scheduler.unscheduleUpdate(this);
        scheduler.unscheduleAllCallbacksForTarget(this);
    }

};

// SchedulerTimeScale

var SchedulerTimeScale = class SchedulerTimeScale extends SchedulerTestLayer {
    constructor() {
        super();
        this._newScheduler = null;
        this._newActionManager = null;
    }


    onEnter() {
        super.onEnter();

        this._newScheduler = new cc.Scheduler();
        this._newActionManager = new cc.ActionManager();
        
        var s = cc.winSize;

        // rotate and jump
        var jump1 = new cc.JumpBy(4, cc.p(-s.width+80,0), 100, 4);
        var jump2 = jump1.reverse();
        var rot1 = new cc.RotateBy(4, 360*2);
        var rot2 = rot1.reverse();

        var seq3_1 = new cc.Sequence(jump2, jump1);
        var seq3_2 = new cc.Sequence(rot1, rot2);
        var spawn = new cc.Spawn(seq3_1, seq3_2);
        var action = new cc.Repeat(spawn, 50);

        var action2 = action.clone();
        var action3 = action.clone();

        var grossini = new cc.Sprite("Images/grossini.png");
        var tamara = new cc.Sprite("Images/grossinis_sister1.png");
        var kathia = new cc.Sprite("Images/grossinis_sister2.png");
        
        grossini.setActionManager(this._newActionManager);
        grossini.setScheduler(this._newScheduler);

        grossini.setPosition(cc.p(40,80));
        tamara.setPosition(cc.p(40,80));
        kathia.setPosition(cc.p(40,80));

        this.addChild(grossini);
        this.addChild(tamara);
        this.addChild(kathia);

        grossini.runAction(new cc.Speed(action, 0.5));
        tamara.runAction(new cc.Speed(action2, 1.5));
        kathia.runAction(new cc.Speed(action3, 1.0));
        
        cc.director.getScheduler().scheduleUpdate(this._newScheduler, 0, false);
        
        this._newScheduler.scheduleUpdate(this._newActionManager, 0, false);

        var emitter = new cc.ParticleFireworks();
        emitter.setTexture( cc.textureCache.addImage(s_stars1) );
        this.addChild(emitter);

        var slider = null;
        var l = null;

        slider = new ccui.Slider();
        slider.setTouchEnabled(true);
        slider.loadBarTexture("ccs-res/cocosui/sliderTrack.png");
        slider.loadSlidBallTextures("ccs-res/cocosui/sliderThumb.png", "ccs-res/cocosui/sliderThumb.png", "");
        slider.loadProgressBarTexture("ccs-res/cocosui/sliderProgress.png");
        slider.x = cc.winSize.width / 2.0;
        slider.y = cc.winSize.height / 3.0 * 2;
        slider.addEventListener(this.sliderEventForGrossini, this);
        this.addChild(slider);
        slider.setPercent(20);

        l = new cc.LabelTTF("Control time scale only for Grossini", "Thonburi", 16);
        this.addChild(l);
        l.x = slider.x;
        l.y = slider.y + 30;

        slider = new ccui.Slider();
        slider.setTouchEnabled(true);
        slider.loadBarTexture("ccs-res/cocosui/sliderTrack.png");
        slider.loadSlidBallTextures("ccs-res/cocosui/sliderThumb.png", "ccs-res/cocosui/sliderThumb.png", "");
        slider.loadProgressBarTexture("ccs-res/cocosui/sliderProgress.png");
        slider.x = cc.winSize.width / 2.0;
        slider.y = cc.winSize.height / 3.0;
        slider.addEventListener(this.sliderEventForGlobal, this);
        this.addChild(slider);
        slider.setPercent(20);
        l = new cc.LabelTTF("Control time scale for all", "Thonburi", 16);
        this.addChild(l);
        l.x = slider.x;
        l.y = slider.y + 30;
    }

    sliderEventForGrossini(sender, type) {
        switch (type) {
            case ccui.Slider.EVENT_PERCENT_CHANGED:
                var slider = sender;
                var percent = slider.getPercent() / 100.0 * 5;
                this._newScheduler.setTimeScale(percent);
                break;
            default:
                break;
        }
    }

    sliderEventForGlobal(sender, type) {
        switch (type) {
            case ccui.Slider.EVENT_PERCENT_CHANGED:
                var slider = sender;
                var percent = slider.getPercent() / 100.0 * 5;
                cc.director.getScheduler().setTimeScale(percent);
                break;
            default:
                break;
        }
    }

    onExit() {
        cc.director.getScheduler().setTimeScale(1);
        // restore scale
        cc.director.getScheduler().unscheduleUpdate(this._newScheduler);
        super.onExit();
    }

    title() {
        return "Scheduler timeScale Test";
    }

    subtitle() {
        return "Fast-forward and rewind using scheduler.timeScale";
    }

};

var unScheduleAndRepeatTest = class unScheduleAndRepeatTest extends SchedulerTestLayer {
    constructor() {
        super();
        this._times = 5;
    }


    onEnter(){
        super.onEnter();
        cc.log("start schedule 'repeat': run once and repeat 4 times");
        this.schedule(this.repeat, 0.5, 4);
        cc.log("start schedule 'forever': repeat forever (stop in 8s)");
        this.schedule(this.forever, 0.5);
        this.schedule(function(){
            cc.log("stop the 'forever'");
            this.unschedule(this.forever);
        }, 8);
    }


    repeat(){
        cc.log("Repeat - the remaining number: " + this._times--);
    }

    forever(){
        cc.log("Repeat Forever...");
    }

    title(){
        return "Repeat And unschedule Test";
    }

    subtitle(){
        return "Repeat will print 5 times\nForever will stop in 8 seconds.";
    }

};

/*
    main entry
*/
var SchedulerTestScene = class SchedulerTestScene extends TestScene {
    runThisTest(num) {
        schedulerTestSceneIdx = (num || num == 0) ? (num - 1) : -1;
        var layer = nextSchedulerTest();
        this.addChild(layer);

        director.runScene(this);
    }

};

//
// Flow control
//

var arrayOfSchedulerTest = [
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

var nextSchedulerTest = function () {
    schedulerTestSceneIdx++;
    schedulerTestSceneIdx = schedulerTestSceneIdx % arrayOfSchedulerTest.length;

    if(window.sideIndexBar){
        schedulerTestSceneIdx = window.sideIndexBar.changeTest(schedulerTestSceneIdx, 34);
    }

    return new arrayOfSchedulerTest[schedulerTestSceneIdx]();
};
var previousSchedulerTest = function () {
    schedulerTestSceneIdx--;
    if (schedulerTestSceneIdx < 0)
        schedulerTestSceneIdx += arrayOfSchedulerTest.length;

    if(window.sideIndexBar){
        schedulerTestSceneIdx = window.sideIndexBar.changeTest(schedulerTestSceneIdx, 34);
    }

    return new arrayOfSchedulerTest[schedulerTestSceneIdx]();
};
var restartSchedulerTest = function () {
    return new arrayOfSchedulerTest[schedulerTestSceneIdx]();
};
