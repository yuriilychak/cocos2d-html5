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

TAG_ACTION1_EASE_ACTIONS = 1;
TAG_ACTION2_EASE_ACTIONS = 2;
TAG_SLIDER_EASE_ACTIONS = 1;

var easeActionsTestIdx = -1;

// the class inherit from TestScene
// every .Scene each test used must inherit from TestScene,
// make sure the test have the menu item for back to main menu
var EaseActionsTestScene = class EaseActionsTestScene extends TestScene {
    runThisTest(num) {
        easeActionsTestIdx = (num || num == 0) ? (num - 1) : -1;
        this.addChild(nextEaseActionsTest());
        director.runScene(this);
    }

};


var EaseSpriteDemo = class EaseSpriteDemo extends BaseTestLayer {

    constructor() {
        super(new cc.Color(0, 0, 0, 255), new cc.Color(98, 99, 117, 255));


        this._grossini = null;


        this._tamara = null;


        this._kathia = null;


        this._title = null;


        this.testDuration = 2.05;
    }

    title() {
        return "No title";
    }
    onEnter() {
        super.onEnter();

        // Or you can create an sprite using a filename. PNG and BMP files are supported. Probably TIFF too
        this._grossini = new cc.Sprite(s_pathGrossini);
        this._tamara = new cc.Sprite(s_pathSister1);
        this._kathia = new cc.Sprite(s_pathSister2);

        this.addChild(this._grossini, 3);
        this.addChild(this._kathia, 2);
        this.addChild(this._tamara, 1);

        this._grossini.x = 60;

        this._grossini.y = winSize.height / 5;
        this._kathia.x = 60;
        this._kathia.y = winSize.height / 2;
        this._tamara.x = 60;
        this._tamara.y = winSize.height * 4 / 5;

        this.twoSprites = false;
    }

    onRestartCallback(sender) {
        var s = new EaseActionsTestScene();
        s.addChild(restartEaseActionsTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new EaseActionsTestScene();
        s.addChild(nextEaseActionsTest());
        director.runScene(s);
    }
    onBackCallback(sender) {
        var s = new EaseActionsTestScene();
        s.addChild(previousEaseActionsTest());
        director.runScene(s);
    }
    positionForTwo() {
        this.twoSprites = true;
        this._grossini.x = 60;
	    this._grossini.y = winSize.height / 5;
        this._tamara.x = 60;
	    this._tamara.y = winSize.height * 4 / 5;
        this._kathia.visible = false;
    }

    //
    // Automation
    //
    numberOfPendingTests() {
        return ( (arrayOfEaseActionsTest.length-1) - easeActionsTestIdx );
    }

    getTestNumber() {
        return easeActionsTestIdx;
    }

    // default values for automation
    getExpectedResult() {
        var ret;
        var w = 60 + winSize.width - 80;
        if( this.twoSprites )
            ret = [w, w];
        else
            ret = [w, w, w];
        return JSON.stringify(ret);
    }

    getCurrentResult() {
        var ret;
        if( this.twoSprites)
            ret = [ this._grossini.x, this._tamara.x];
        else
            ret = [ this._grossini.x, this._tamara.x, this._kathia.x ];
        return JSON.stringify(ret);
    }


};

//------------------------------------------------------------------
//
// SpriteEase
//
//------------------------------------------------------------------
var SpriteEase = class SpriteEase extends EaseSpriteDemo {
    constructor() {
        super();
        this.testDuration = 4.2;
    }


    onEnter() {
        //----start0----onEnter
        super.onEnter();

        var move = new cc.MoveBy(2, new cc.Point(winSize.width - 80, 0));
        var move_back = move.reverse();


        var move_ease_in = move.clone().easing(cc.easeIn(2.0));
        var move_ease_in_back = move_ease_in.reverse();

        var move_ease_out = move.clone().easing(cc.easeOut(2.0));
        var move_ease_out_back = move_ease_out.reverse();


        var delay = new cc.DelayTime(0.10);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease_in, delay.clone(), move_ease_in_back, delay.clone());
        var seq3 = cc.sequence(move_ease_out, delay.clone(), move_ease_out_back, delay.clone());


        var a2 = this._grossini.runAction(seq1.repeatForever());
        a2.tag = 1;

        var a1 = this._tamara.runAction(seq2.repeatForever());
        a1.tag = 1;

        var a = this._kathia.runAction(seq3.repeatForever());
        a.tag = 1;

        this.scheduleOnce(this.testStopAction, 4.1);
        //----end0----
    }
    title() {
        return "EaseIn - EaseOut - Stop";
    }

    testStopAction(dt) {
        this._tamara.stopActionByTag(1);
        this._kathia.stopActionByTag(1);
        this._grossini.stopActionByTag(1);
    }

    //
    // Automation
    //
    getExpectedResult() {
        var ret = [60,60,60];
        return JSON.stringify(ret);
    }

    getCurrentResult() {
        var ret = [ this._grossini.x, this._tamara.x, this._kathia.x ];
        return JSON.stringify(ret);
    }


};

//------------------------------------------------------------------
//
// SpriteEaseInOut
//
//------------------------------------------------------------------
var SpriteEaseInOut = class SpriteEaseInOut extends EaseSpriteDemo {

    onEnter() {
        //----start1----onEnter
        super.onEnter();

        var move = new cc.MoveBy(2, new cc.Point(winSize.width - 80, 0));

        var move_ease_inout1 = move.clone().easing(cc.easeInOut(2.0));
        var move_ease_inout_back1 = move_ease_inout1.reverse();

        var move_ease_inout2 = move.clone().easing(cc.easeInOut(3.0));
        var move_ease_inout_back2 = move_ease_inout2.reverse();

        var move_ease_inout3 = move.clone().easing(cc.easeInOut(4.0));
        var move_ease_inout_back3 = move_ease_inout3.reverse();

        var delay = new cc.DelayTime(0.1);

        var seq1 = cc.sequence(move_ease_inout1, delay, move_ease_inout_back1, delay.clone());
        var seq2 = cc.sequence(move_ease_inout2, delay.clone(), move_ease_inout_back2, delay.clone());
        var seq3 = cc.sequence(move_ease_inout3, delay.clone(), move_ease_inout_back3, delay.clone());

        this._tamara.runAction(seq1.repeatForever());
        this._kathia.runAction(seq2.repeatForever());
        this._grossini.runAction(seq3.repeatForever());
        //----end1----
    }
    title() {
        return "EaseInOut and rates";
    }

};

//------------------------------------------------------------------
//
// SpriteEaseExponential
//
//------------------------------------------------------------------
var SpriteEaseExponential = class SpriteEaseExponential extends EaseSpriteDemo {

    onEnter() {
        //----start2----onEnter
        super.onEnter();

        var move = new cc.MoveBy(2, new cc.Point(winSize.width - 80, 0));
        var move_back = move.reverse();

        var move_ease_in = move.clone().easing(cc.easeExponentialIn());
        var move_ease_in_back = move_ease_in.reverse();

        var move_ease_out = move.clone().easing(cc.easeExponentialOut());
        var move_ease_out_back = move_ease_out.reverse();

        var delay = new cc.DelayTime(0.1);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease_in, delay.clone(), move_ease_in_back, delay.clone());
        var seq3 = cc.sequence(move_ease_out, delay.clone(), move_ease_out_back, delay.clone());


        this._grossini.runAction(seq1.repeatForever());
        this._tamara.runAction(seq2.repeatForever());
        this._kathia.runAction(seq3.repeatForever());
        //----end2-----
    }
    title() {
        return "ExpIn - ExpOut actions";
    }

};

//------------------------------------------------------------------
//
// SpriteEaseExponentialInOut
//
//------------------------------------------------------------------
var SpriteEaseExponentialInOut = class SpriteEaseExponentialInOut extends EaseSpriteDemo {
    onEnter() {
        //----start3----onEnter
        super.onEnter();

        var move = new cc.MoveBy(2, new cc.Point(winSize.width - 80, 0));
        var move_back = move.reverse();

        var move_ease = move.clone().easing(cc.easeExponentialInOut());
        var move_ease_back = move_ease.reverse();

        var delay = new cc.DelayTime(0.1);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease, delay.clone(), move_ease_back, delay.clone());

        this.positionForTwo();

        this._grossini.runAction(seq1.repeatForever());
        this._tamara.runAction(seq2.repeatForever());
        //----end3----
    }
    title() {
        return "EaseExponentialInOut action";
    }

};

//------------------------------------------------------------------
//
// SpriteEaseSine
//
//------------------------------------------------------------------
var SpriteEaseSine = class SpriteEaseSine extends EaseSpriteDemo {
    onEnter() {
        //----start4----onEnter
        super.onEnter();

        var move = new cc.MoveBy(2, new cc.Point(winSize.width - 80, 0));
        var move_back = move.reverse();

        var move_ease_in = move.clone().easing(cc.easeSineIn());
        var move_ease_in_back = move_ease_in.reverse();

        var move_ease_out = move.clone().easing(cc.easeSineOut());
        var move_ease_out_back = move_ease_out.reverse();

        var delay = new cc.DelayTime(0.1);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease_in, delay, move_ease_in_back, delay.clone());
        var seq3 = cc.sequence(move_ease_out, delay, move_ease_out_back, delay.clone());


        this._grossini.runAction(seq1.repeatForever());
        this._tamara.runAction(seq2.repeatForever());
        this._kathia.runAction(seq3.repeatForever());
        //----end4----
    }
    title() {
        return "EaseSineIn - EaseSineOut";
    }

};

//------------------------------------------------------------------
//
// SpriteEaseSineInOut
//
//------------------------------------------------------------------
var SpriteEaseSineInOut = class SpriteEaseSineInOut extends EaseSpriteDemo {
    onEnter() {
        //----start5----onEnter
        super.onEnter();

        var move = new cc.MoveBy(2, new cc.Point(winSize.width - 80, 0));
        var move_back = move.reverse();

        //old api
        //var move_ease = cc.EaseSineInOutmove.clone());

        var move_ease = move.clone().easing(cc.easeSineInOut());
        var move_ease_back = move_ease.reverse();

        var delay = new cc.DelayTime(0.1);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease, delay.clone(), move_ease_back, delay.clone());

        this.positionForTwo();

        this._grossini.runAction(seq1.repeatForever());
        this._tamara.runAction(seq2.repeatForever());
        //----end5----
    }
    title() {
        return "EaseSineInOut action";
    }

};

//------------------------------------------------------------------
//
// SpriteEaseElastic
//
//------------------------------------------------------------------
var SpriteEaseElastic = class SpriteEaseElastic extends EaseSpriteDemo {
    onEnter() {
        //----start6----onEnter
        super.onEnter();

        var move = new cc.MoveBy(2, new cc.Point(winSize.width - 80, 0));
        var move_back = move.reverse();

        var move_ease_in = move.clone().easing(cc.easeElasticIn());
        var move_ease_in_back = move_ease_in.reverse();

        var move_ease_out = move.clone().easing(cc.easeElasticOut());
        var move_ease_out_back = move_ease_out.reverse();

        var delay = new cc.DelayTime(0.1);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease_in, delay.clone(), move_ease_in_back, delay.clone());
        var seq3 = cc.sequence(move_ease_out, delay.clone(), move_ease_out_back, delay.clone());

        this._grossini.runAction(seq1.repeatForever());
        this._tamara.runAction(seq2.repeatForever());
        this._kathia.runAction(seq3.repeatForever());
        //----end6----
    }
    title() {
        return "Elastic In - Out actions";
    }

};

//------------------------------------------------------------------
//
// SpriteEaseElasticInOut
//
//------------------------------------------------------------------
var SpriteEaseElasticInOut = class SpriteEaseElasticInOut extends EaseSpriteDemo {
    onEnter() {
        //----start7----onEnter
        super.onEnter();

        var move = new cc.MoveBy(2, new cc.Point(winSize.width - 80, 0));

        var move_ease_inout1 = move.clone().easing(cc.easeElasticInOut(0.3));
        var move_ease_inout_back1 = move_ease_inout1.reverse();

        var move_ease_inout2 = move.clone().easing(cc.easeElasticInOut(0.45));
        var move_ease_inout_back2 = move_ease_inout2.reverse();

        var move_ease_inout3 = move.clone().easing(cc.easeElasticInOut(0.6));
        var move_ease_inout_back3 = move_ease_inout3.reverse();

        var delay = new cc.DelayTime(0.1);

        var seq1 = cc.sequence(move_ease_inout1, delay, move_ease_inout_back1, delay.clone());
        var seq2 = cc.sequence(move_ease_inout2, delay.clone(), move_ease_inout_back2, delay.clone());
        var seq3 = cc.sequence(move_ease_inout3, delay.clone(), move_ease_inout_back3, delay.clone());

        this._tamara.runAction(seq1.repeatForever());
        this._kathia.runAction(seq2.repeatForever());
        this._grossini.runAction(seq3.repeatForever());
        //----end7----
    }
    title() {
        return "EaseElasticInOut action";
    }

};

//------------------------------------------------------------------
//
// SpriteEaseBounce
//
//------------------------------------------------------------------
var SpriteEaseBounce = class SpriteEaseBounce extends EaseSpriteDemo {
    onEnter() {
        //----start8----onEnter
        super.onEnter();

        var move = new cc.MoveBy(2, new cc.Point(winSize.width - 80, 0));
        var move_back = move.reverse();

        var move_ease_in = move.clone().easing(cc.easeBounceIn());
        var move_ease_in_back = move_ease_in.reverse();

        var move_ease_out = move.clone().easing(cc.easeBounceOut());
        var move_ease_out_back = move_ease_out.reverse();

        var delay = new cc.DelayTime(0.1);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease_in, delay.clone(), move_ease_in_back, delay.clone());
        var seq3 = cc.sequence(move_ease_out, delay.clone(), move_ease_out_back, delay.clone());

        this._grossini.runAction(seq1.repeatForever());
        this._tamara.runAction(seq2.repeatForever());
        this._kathia.runAction(seq3.repeatForever());
        //----end8----
    }
    title() {
        return "Bounce In - Out actions";
    }

};

//------------------------------------------------------------------
//
// SpriteEaseBounceInOut
//
//------------------------------------------------------------------
var SpriteEaseBounceInOut = class SpriteEaseBounceInOut extends EaseSpriteDemo {
    onEnter() {
        //----start9----onEnter
        super.onEnter();

        var move = new cc.MoveBy(2, new cc.Point(winSize.width - 80, 0));
        var move_back = move.reverse();

        var move_ease = move.clone().easing(cc.easeBounceInOut());
        var move_ease_back = move_ease.reverse();

        var delay = new cc.DelayTime(0.1);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease, delay.clone(), move_ease_back, delay.clone());

        this.positionForTwo();

        this._grossini.runAction(seq1.repeatForever());
        this._tamara.runAction(seq2.repeatForever());
        //----end9----
    }
    title() {
        return "EaseBounceInOut action";
    }

};

//------------------------------------------------------------------
//
// SpriteEaseBack
//
//------------------------------------------------------------------
var SpriteEaseBack = class SpriteEaseBack extends EaseSpriteDemo {
    onEnter() {
        //----start10----onEnter
        super.onEnter();

        var move = new cc.MoveBy(2, new cc.Point(winSize.width - 80, 0));
        var move_back = move.reverse();

        var move_ease_in = move.clone().easing(cc.easeBackIn());
        var move_ease_in_back = move_ease_in.reverse();

        var move_ease_out = move.clone().easing(cc.easeBackOut());
        var move_ease_out_back = move_ease_out.reverse();

        var delay = new cc.DelayTime(0.1);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease_in, delay.clone(), move_ease_in_back, delay.clone());
        var seq3 = cc.sequence(move_ease_out, delay.clone(), move_ease_out_back, delay.clone());

        this._grossini.runAction(seq1.repeatForever());
        this._tamara.runAction(seq2.repeatForever());
        this._kathia.runAction(seq3.repeatForever());
        //----end10----
    }
    title() {
        return "Back In - Out actions";
    }

};

//------------------------------------------------------------------
//
// SpriteEaseBackInOut
//
//------------------------------------------------------------------
var SpriteEaseBackInOut = class SpriteEaseBackInOut extends EaseSpriteDemo {
    onEnter() {
        //----start11----onEnter
        super.onEnter();

        var move = new cc.MoveBy(2, new cc.Point(winSize.width - 80, 0));
        var move_back = move.reverse();

        var move_ease = move.clone().easing(cc.easeBackInOut());
        var move_ease_back = move_ease.reverse();

        var delay = new cc.DelayTime(0.1);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease, delay.clone(), move_ease_back, delay.clone());

        this.positionForTwo();

        this._grossini.runAction(seq1.repeatForever());
        this._tamara.runAction(seq2.repeatForever());
        //----end11----
    }
    title() {
        return "EaseBackInOut action";
    }

};

var SpeedTest = class SpeedTest extends EaseSpriteDemo {
    constructor() {
        super();
        this.testDuration = 0.1;
    }

    onEnter() {
        //----start12----onEnter
        super.onEnter();

        // rotate and jump
        var jump1 = new cc.JumpBy(4, new cc.Point(-winSize.width + 80, 0), 100, 4);
        var jump2 = jump1.reverse();
        var rot1 = new cc.RotateBy(4, 360 * 2);
        var rot2 = rot1.reverse();

        var seq3_1 = cc.sequence(jump2, jump1);
        var seq3_2 = cc.sequence(rot1, rot2);
        var spawn = cc.spawn(seq3_1, seq3_2);

        var action = spawn.repeatForever().speed(2);
        action.tag = TAG_ACTION1_EASE_ACTIONS;

        var action2 = action.clone();
        var action3 = action.clone();

        action2.tag = TAG_ACTION1_EASE_ACTIONS;
        action3.tag = TAG_ACTION1_EASE_ACTIONS;

        this._grossini.runAction(action2);
        this._tamara.runAction(action3);
        this._kathia.runAction(action);

        this.schedule(this.altertime, 1.0);
        //----end12----
    }
    title() {
        return "Speed action";
    }

    altertime(dt) {
        //----start12----altertime
        var action1 = this._grossini.getActionByTag(TAG_ACTION1_EASE_ACTIONS);
        var action2 = this._tamara.getActionByTag(TAG_ACTION1_EASE_ACTIONS);
        var action3 = this._kathia.getActionByTag(TAG_ACTION1_EASE_ACTIONS);

        action1.setSpeed(Math.random() * 2);
        action2.setSpeed(Math.random() * 2);
        action3.setSpeed(Math.random() * 2);
        //----end12----
    }
    // automation
    getExpectedResult() {
        throw "Not Implemented";
    }
    getCurrentResult() {
        throw "Not Implemented";
    }

};

//------------------------------------------------------------------
//
// SchedulerTest
//
//------------------------------------------------------------------
var SchedulerTest = class SchedulerTest extends EaseSpriteDemo {
    constructor() {
        super();
        this.testDuration = 0.1;
    }

    onEnter() {
        //----start13----onEnter
        super.onEnter();

        // rotate and jump
        var jump1 = new cc.JumpBy(4, new cc.Point(-winSize.width + 80, 0), 100, 4);
        var jump2 = jump1.reverse();
        var rot1 = new cc.RotateBy(4, 360 * 2);
        var rot2 = rot1.reverse();

        var seq3_1 = cc.sequence(jump2, jump1);
        var seq3_2 = cc.sequence(rot1, rot2);
        var spawn = cc.spawn(seq3_1, seq3_2);
        var action = spawn.repeatForever();

        var action2 = action.clone();
        var action3 = action.clone();

        //old api
        //this._grossini.runAction(new cc.Speed(action, 0.5));
        //this._tamara.runAction(new cc.Speed(action2, 1.5));
        //this._kathia.runAction(new cc.Speed(action3, 1.0));

        this._grossini.runAction(action.speed(0.5));
        this._tamara.runAction(action2.speed(1.5));
        this._kathia.runAction(action3.speed(1.0));

        var emitter = new cc.ParticleFireworks();
        emitter.setTotalParticles(250);
        emitter.texture = cc.textureCache.addImage("Images/fire.png");
        this.addChild(emitter);
        //----end13----
    }
    title() {
        return "Scheduler scaleTime Test";
    }

    // automation
    getExpectedResult() {
        throw "Not Implemented";
    }
    getCurrentResult() {
        throw "Not Implemented";
    }

};

//
// SpriteEaseBezier action
//
var SpriteEaseBezierTest = class SpriteEaseBezierTest extends EaseSpriteDemo {

    onEnter(){
        super.onEnter();
        //----start14----onEnter

        var size = director.getWinSize();

        //
        // startPosition can be any coordinate, but since the movement
        // is relative to the Bezier curve, make it (0,0)
        //

        this._grossini.setPosition( new cc.Point(size.width/2, size.height/2));
        this._tamara.setPosition( new cc.Point(size.width/4, size.height/2));
        this._kathia.setPosition( new cc.Point(3 * size.width/4, size.height/2));

        // sprite 1
        var bezier = [
            new cc.Point(0, size.height / 2),
            new cc.Point(300 / 480 * 800, -size.height / 2),
            new cc.Point(300 / 480 * 800, 100 / 320 * 450)
        ];
        var bezierForward = new cc.BezierBy(3, bezier);
        var bezierEaseForward = bezierForward.easing(cc.easeBezierAction(0.5, 0.5, 1.0, 1.0));

        var bezierEaseBack = bezierEaseForward.reverse();
        var bezierEaseTo = cc.sequence(bezierEaseForward, bezierEaseBack).repeatForever();

        // sprite 2
        this._tamara.setPosition(new cc.Point(135,225));
        var bezier2 = [
            new cc.Point(100 / 480 * 800, size.height / 2),
            new cc.Point(200 / 480 * 800, -size.height / 2),
            new cc.Point(200 / 480 * 800, 160 / 320 * 450)
        ];
        var bezierTo1 = new cc.BezierTo(2, bezier2);
        var bezierEaseTo1 = bezierTo1.easing(cc.easeBezierAction(0.5, 0.5, 1.0, 1.0));

        // sprite 3
        this._kathia.setPosition(new cc.Point(667, 225));
        var bezierTo2 = new cc.BezierTo(2, bezier2);
        var bezierEaseTo2 = bezierTo2.easing(cc.easeBezierAction(0.0, 0.5, -5.0, 1.0));


        this._grossini.runAction(bezierEaseTo);
        this._tamara.runAction(bezierEaseTo1);
        this._kathia.runAction(bezierEaseTo2);

        //----end14----
    }
    title(){
        return "SpriteEaseBezier action";
    }

};


//
// SpriteEaseQuadratic
//
var SpriteEaseQuadraticTest = class SpriteEaseQuadraticTest extends EaseSpriteDemo {

    onEnter(){
        super.onEnter();
        //----start15----onEnter

        var move = new cc.MoveBy(3, new cc.Point(winSize.width - 130, 0));
        var move_back = move.reverse();

        var move_ease_in = move.clone().easing(cc.easeQuadraticActionIn());
        var move_ease_in_back = move_ease_in.reverse();

        var move_ease_out = move.clone().easing(cc.easeQuadraticActionOut());
        var move_ease_out_back = move_ease_out.reverse();

        var delay = new cc.DelayTime(0.25);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease_in, delay.clone(), move_ease_in_back, delay.clone());
        var seq3 = cc.sequence(move_ease_out, delay.clone(), move_ease_out_back, delay.clone());

        this._grossini.runAction( seq1.repeatForever() );
        this._tamara.runAction( seq2.repeatForever() );
        this._kathia.runAction( seq3.repeatForever() );

        //----end15----
    }
    title(){
        return "SpriteEaseQuadratic action";
    }

};

//
// SpriteEaseQuadraticInOut
//
var SpriteEaseQuadraticInOutTest = class SpriteEaseQuadraticInOutTest extends EaseSpriteDemo {

    onEnter(){
        super.onEnter();
        //----start16----onEnter

        var move = new cc.MoveBy(3, new cc.Point(winSize.width - 130, 0));
        var move_back = move.reverse();

        var move_ease = move.clone().easing(cc.easeQuadraticActionInOut());
        var move_ease_back = move_ease.reverse();

        var delay = new cc.DelayTime(0.25);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone()).repeatForever();
        var seq2 = cc.sequence(move_ease, delay.clone(), move_ease_back, delay.clone()).repeatForever();

        this.positionForTwo();

        this._grossini.runAction( seq1 );
        this._tamara.runAction( seq2 );
        //----end16----
    }
    title(){
        return "SpriteEaseQuadraticInOut action";
    }

};

//
// SpriteEaseQuartic
//
var SpriteEaseQuarticTest = class SpriteEaseQuarticTest extends EaseSpriteDemo {

    onEnter(){
        super.onEnter();
        //----start17----onEnter

        var move = new cc.MoveBy(3, new cc.Point(winSize.width - 130, 0));
        var move_back = move.reverse();

        var move_ease_in = move.clone().easing(cc.easeQuarticActionIn());
        var move_ease_in_back = move_ease_in.reverse();

        var move_ease_out = move.clone().easing(cc.easeQuarticActionOut());
        var move_ease_out_back = move_ease_out.reverse();

        var delay = new cc.DelayTime(0.25);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease_in, delay.clone(), move_ease_in_back, delay.clone());
        var seq3 = cc.sequence(move_ease_out, delay.clone(), move_ease_out_back, delay.clone());

        this._grossini.runAction( seq1.repeatForever() );
        this._tamara.runAction( seq2.repeatForever() );
        this._kathia.runAction( seq3.repeatForever() );
        //----end17----
    }
    title(){
        return "SpriteEaseQuartic action";
    }

};

//
// SpriteEaseQuarticInOut
//
var SpriteEaseQuarticInOutTest = class SpriteEaseQuarticInOutTest extends EaseSpriteDemo {
    onEnter(){
        super.onEnter();
        //----start18----onEnter

        var move = new cc.MoveBy(3, new cc.Point(winSize.width - 130, 0));
        var move_back = move.reverse();

        var move_ease = move.clone().easing(cc.easeQuarticActionInOut());
        var move_ease_back = move_ease.reverse();

        var delay = new cc.DelayTime(0.25);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease, delay.clone(), move_ease_back, delay.clone());

        this.positionForTwo();

        this._grossini.runAction( seq1.repeatForever() );
        this._tamara.runAction( seq2.repeatForever() );

        //----end18----
    }
    title(){
        return "SpriteEaseQuarticInOut action";
    }

};

//
// SpriteEaseQuintic
//
var SpriteEaseQuinticTest = class SpriteEaseQuinticTest extends EaseSpriteDemo {
    onEnter(){
        super.onEnter();
        //----start19----onEnter

        var move = new cc.MoveBy(3, new cc.Point(winSize.width - 130, 0));
        var move_back = move.reverse();

        var move_ease_in = move.clone().easing(cc.easeQuinticActionIn());
        var move_ease_in_back = move_ease_in.reverse();

        var move_ease_out = move.clone().easing(cc.easeQuinticActionOut());
        var move_ease_out_back = move_ease_out.reverse();

        var delay = new cc.DelayTime(0.25);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease_in, delay.clone(), move_ease_in_back, delay.clone());
        var seq3 = cc.sequence(move_ease_out, delay.clone(), move_ease_out_back, delay.clone());

        this._grossini.runAction( seq1.repeatForever() );
        this._tamara.runAction( seq2.repeatForever() );
        this._kathia.runAction( seq3.repeatForever() );


        //----end19----
    }
    title(){
        return "SpriteEaseQuintic action";
    }

};

//
// SpriteEaseQuinticInOut
//
var SpriteEaseQuinticInOutTest = class SpriteEaseQuinticInOutTest extends EaseSpriteDemo {
    onEnter(){
        super.onEnter();
        //----start20----onEnter

        var move = new cc.MoveBy(3, new cc.Point(winSize.width - 130, 0));
        var move_back = move.reverse();

        var move_ease = move.clone().easing(cc.easeQuinticActionInOut());
        var move_ease_back = move_ease.reverse();

        var delay = new cc.DelayTime(0.25);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease, delay.clone(), move_ease_back, delay.clone());

        this.positionForTwo();

        this._grossini.runAction( seq1.repeatForever() );
        this._tamara.runAction( seq2.repeatForever() );

        //----end20----
    }
    title(){
        return "SpriteEaseQuinticInOut action";
    }

};

//
// SpriteEaseCircle
//
var SpriteEaseCircleTest = class SpriteEaseCircleTest extends EaseSpriteDemo {
    onEnter(){
        super.onEnter();
        //----start21----onEnter

        var move = new cc.MoveBy(3, new cc.Point(winSize.width - 130, 0));
        var move_back = move.reverse();

        var move_ease_in = move.clone().easing(cc.easeCircleActionIn());
        var move_ease_in_back = move_ease_in.reverse();

        var move_ease_out = move.clone().easing(cc.easeCircleActionOut());
        var move_ease_out_back = move_ease_out.reverse();

        var delay = new cc.DelayTime(0.25);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease_in, delay.clone(), move_ease_in_back, delay.clone());
        var seq3 = cc.sequence(move_ease_out, delay.clone(), move_ease_out_back, delay.clone());

        this._grossini.runAction( seq1.repeatForever() );
        this._tamara.runAction( seq2.repeatForever() );
        this._kathia.runAction( seq3.repeatForever() );

        //----end21----
    }
    title(){
        return "SpriteEaseCircle action";
    }

};

//
// SpriteEaseCircleInOut
//
var SpriteEaseCircleInOutTest = class SpriteEaseCircleInOutTest extends EaseSpriteDemo {
    onEnter(){
        super.onEnter();
        //----start22----onEnter

        var move = new cc.MoveBy(3, new cc.Point(winSize.width - 130, 0));
        var move_back = move.reverse();

        var move_ease = move.clone().easing(cc.easeCircleActionInOut());
        var move_ease_back = move_ease.reverse();

        var delay = new cc.DelayTime(0.25);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease, delay.clone(), move_ease_back, delay.clone());

        this.positionForTwo();

        this._grossini.runAction( seq1.repeatForever() );
        this._tamara.runAction( seq2.repeatForever() );

        //----end22----
    }
    title(){
        return "SpriteEaseCircleInOut action";
    }

};

//
// SpriteEaseCubic
//
var SpriteEaseCubicTest = class SpriteEaseCubicTest extends EaseSpriteDemo {
    onEnter(){
        super.onEnter();
        //----start23----onEnter

        var move = new cc.MoveBy(3, new cc.Point(winSize.width - 130, 0));
        var move_back = move.reverse();

        var move_ease_in = move.clone().easing(cc.easeCubicActionIn());
        var move_ease_in_back = move_ease_in.reverse();

        var move_ease_out = move.clone().easing(cc.easeCubicActionOut());
        var move_ease_out_back = move_ease_out.reverse();

        var delay = new cc.DelayTime(0.25);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease_in, delay.clone(), move_ease_in_back, delay.clone());
        var seq3 = cc.sequence(move_ease_out, delay.clone(), move_ease_out_back, delay.clone());

        this._grossini.runAction( seq1.repeatForever() );
        this._tamara.runAction( seq2.repeatForever() );
        this._kathia.runAction( seq3.repeatForever() );


        //----end23----
    }
    title(){
        return "SpriteEaseCubic action";
    }

};

//
// SpriteEaseCubicInOut
//
var SpriteEaseCubicInOutTest = class SpriteEaseCubicInOutTest extends EaseSpriteDemo {
    onEnter(){
        super.onEnter();
        //----start24----onEnter

        var move = new cc.MoveBy(3, new cc.Point(winSize.width - 130, 0));
        var move_back = move.reverse();

        var move_ease = move.clone().easing(cc.easeCubicActionInOut());
        var move_ease_back = move_ease.reverse();

        var delay = new cc.DelayTime(0.25);

        var seq1 = cc.sequence(move, delay, move_back, delay.clone());
        var seq2 = cc.sequence(move_ease, delay.clone(), move_ease_back, delay.clone());

        this.positionForTwo();

        this._grossini.runAction( seq1.repeatForever() );
        this._tamara.runAction( seq2.repeatForever() );


        //----end24----
    }
    title(){
        return "SpriteEaseCubicInOut action";
    }

};

//
// Flow control
//
var arrayOfEaseActionsTest = [
    SpriteEase,
    SpriteEaseInOut,
    SpriteEaseExponential,
    SpriteEaseExponentialInOut,
    SpriteEaseSine,
    SpriteEaseSineInOut,
    SpriteEaseElastic,
    SpriteEaseElasticInOut,
    SpriteEaseBounce,
    SpriteEaseBounceInOut,
    SpriteEaseBack,
    SpriteEaseBackInOut,
    SpeedTest,
    SchedulerTest,
    SpriteEaseBezierTest,
    SpriteEaseQuadraticTest,
    SpriteEaseQuadraticInOutTest,
    SpriteEaseQuarticTest,
    SpriteEaseQuarticInOutTest,
    SpriteEaseQuinticTest,
    SpriteEaseQuinticInOutTest,
    SpriteEaseCircleTest,
    SpriteEaseCircleInOutTest,
    SpriteEaseCubicTest,
    SpriteEaseCubicInOutTest
];

var nextEaseActionsTest = function () {
    easeActionsTestIdx++;
    easeActionsTestIdx = easeActionsTestIdx % arrayOfEaseActionsTest.length;

    if(window.sideIndexBar){
        easeActionsTestIdx = window.sideIndexBar.changeTest(easeActionsTestIdx, 10);
    }

    return new arrayOfEaseActionsTest[easeActionsTestIdx]();
};
var previousEaseActionsTest = function () {
    easeActionsTestIdx--;
    if (easeActionsTestIdx < 0)
        easeActionsTestIdx += arrayOfEaseActionsTest.length;

    if(window.sideIndexBar){
        easeActionsTestIdx = window.sideIndexBar.changeTest(easeActionsTestIdx, 10);
    }

    return new arrayOfEaseActionsTest[easeActionsTestIdx]();
};
var restartEaseActionsTest = function () {
    return new arrayOfEaseActionsTest[easeActionsTestIdx]();
};
