/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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


var effectsTestSceneIdx = -1;

//
// Base Layer
//

var EffectsBaseLayer = class EffectsBaseLayer extends BaseTestLayer {
    code() {
        return "";
    }
    // callbacks
    onRestartCallback(sender) {
        var s = new EffectsTestScene();
        s.addChild(restartEffectsTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new EffectsTestScene();
        s.addChild(nextEffectsTest());
        director.runScene(s);
    }
    onBackCallback(sender) {
        var s = new EffectsTestScene();
        s.addChild(previousEffectsTest());
        director.runScene(s);
    }
    onEnter() {
        super.onEnter();

        var node = new cc.Node();

        //Whether to demonstrate the effects inside a smaller rect
        var nodeGrid = new cc.NodeGrid();
        nodeGrid.addChild(node);
        nodeGrid.runAction(this.getEffect(3));
        this.addChild( nodeGrid );

        // back gradient
        var gradient = new cc.LayerGradient( new cc.Color(255,0,0,255), new cc.Color(255,255,0,255));
        node.addChild( gradient );

        // back image
        var bg = new cc.Sprite(s_back3);
        bg.x = winSize.width/2;
        bg.y = winSize.height/2;
        node.addChild( bg );

        var sister1 = new cc.Sprite(s_pathSister1);
        sister1.x = winSize.width/3;
        sister1.y = winSize.height/2;
        node.addChild( sister1, 1 );

        var sister2 = new cc.Sprite(s_pathSister2);
        sister2.x = winSize.width*2/3;
        sister2.y = winSize.height/2;
        node.addChild( sister2, 1 );

        var sc = new cc.ScaleBy(2, 5);
        var sc_back = sc.reverse();
        var seq = cc.sequence( sc, sc_back );
        var repeat = seq.repeatForever();

        sister1.runAction( repeat );
        sister2.runAction( repeat.clone() );
    }

    getEffect(duration) {
        // override me
        return new cc.MoveBy(2, new cc.Point(10,10) );
    }

    // automation
    numberOfPendingTests() {
        return ( (arrayOfEffectsTest.length-1) - effectsTestSceneIdx );
    }

    getTestNumber() {
        return effectsTestSceneIdx;
    }


};

//------------------------------------------------------------------
//
// Tests
//
//------------------------------------------------------------------
var Shaky3DTest = class Shaky3DTest extends EffectsBaseLayer {
    title() {
        return "Shaky 3D";
    }
    code() {
        return "a = cc.shaky3D(duration, gridSize, range, shakeZ)";
    }
    getEffect(duration) {
        return cc.shaky3D( duration, new cc.Size(15,10), 5, false );
    }

};

var Waves3DTest = class Waves3DTest extends EffectsBaseLayer {
    title() {
        return "Waves 3D";
    }
    code() {
        return "a = cc.waves3D(duration, gridSize, range, shakeZ)";
    }
    getEffect(duration) {
        return cc.waves3D(duration, new cc.Size(15,10), 5, 40 );
    }

};

var FlipXTest = class FlipXTest extends EffectsBaseLayer {
    title() {
        return "FlipX3D";
    }
    code() {
        return "a = cc.flipX3D(duration )";
    }
    getEffect(duration) {
        var a = cc.flipX3D(duration);
        var delay = new cc.DelayTime(2);
        var r = a.reverse();
        return cc.sequence( a, delay, r );
    }

};

var FlipYTest = class FlipYTest extends EffectsBaseLayer {
    title() {
        return "FlipY3D";
    }
    code() {
        return "a = cc.flipY3D(duration )";
    }
    getEffect(duration) {
        var a = cc.flipY3D(duration );
        var delay = new cc.DelayTime(2);
        var r = a.reverse();
        return cc.sequence( a, delay, r );
    }

};

var Lens3DTest = class Lens3DTest extends EffectsBaseLayer {
    title() {
        return "Lens3D";
    }
    code() {
        return "a = cc.lens3D(duration, gridSize, position, radius)";
    }
    getEffect(duration) {
        return cc.lens3D( duration, new cc.Size(15,10), new cc.Point(winSize.width/2, winSize.height/2), 240);
    }

};

var Ripple3DTest = class Ripple3DTest extends EffectsBaseLayer {
    title() {
        return "Ripple3D";
    }
    code() {
        return "a = cc.ripple3D(duration, gridSize, position, radius, waves, amplitude)";
    }
    getEffect(duration) {
        return cc.ripple3D( duration, new cc.Size(32,24), new cc.Point(winSize.width/2, winSize.height/2), 240, 4, 160);
    }

};

var LiquidTest = class LiquidTest extends EffectsBaseLayer {
    title() {
        return "Liquid";
    }
    code() {
        return "a = cc.liquid(duration, gridSize, waves, amplitude)";
    }
    getEffect(duration) {
        return cc.liquid( duration, new cc.Size(16,12), 4, 20);
    }

};

var WavesTest = class WavesTest extends EffectsBaseLayer {
    title() {
        return "Waves";
    }
    code() {
        return "a = cc.waves(duration, gridSize, waves, amplitude, horizontal, vertical)";
    }
    getEffect(duration) {
        return cc.waves( duration, new cc.Size(16,12), 4, 20, true, true);
    }

};

var TwirlTest = class TwirlTest extends EffectsBaseLayer {
    title() {
        return "Twirl";
    }
    code() {
        return "a = cc.twirl(duration, gridSize, position, twirls, amplitude)";
    }
    getEffect(duration) {
        return cc.twirl( duration, new cc.Size(12,8), new cc.Point(winSize.width/2, winSize.height/2), 1, 2.5);
    }

};

var ShakyTiles3DTest = class ShakyTiles3DTest extends EffectsBaseLayer {
    title() {
        return "ShakyTiles3D";
    }
    code() {
        return "a = cc.shakyTiles3D(duration, gridSize, range, shakeZ)";
    }
    getEffect(duration) {
        return cc.shakyTiles3D( duration, new cc.Size(16,12), 5, false);
    }

};

var ShatteredTiles3DTest = class ShatteredTiles3DTest extends EffectsBaseLayer {
    title() {
        return "ShatteredTiles3D";
    }
    code() {
        return "a = cc.shatteredTiles3D(duration, gridSize, range, shatterZ)";
    }
    getEffect(duration) {
        return cc.shatteredTiles3D( duration, new cc.Size(16,12), 5, false);
    }

};

var ShuffleTilesTest = class ShuffleTilesTest extends EffectsBaseLayer {
    title() {
        return "ShuffleTiles";
    }
    code() {
        return "a = cc.shuffleTiles(duration, gridSize, seed)";
    }
    getEffect(duration) {
        var action = cc.shuffleTiles( duration, new cc.Size(16,12), 25);
        var delay = new cc.DelayTime(2);
        var back = action.reverse();
        var seq = cc.sequence( action, delay, back);
        return seq;
    }

};

var FadeOutTRTilesTest = class FadeOutTRTilesTest extends EffectsBaseLayer {
    title() {
        return "FadeOutTRTilesTest";
    }
    code() {
        return "a = cc.fadeOutTRTiles(duration, gridSize)";
    }
    getEffect(duration) {
        var action = cc.fadeOutTRTiles( duration, new cc.Size(16,12));
        var delay = new cc.DelayTime(0.5);
        var back = action.reverse();
        var seq = cc.sequence( action, delay, back);
        return seq;
    }

};

var FadeOutBLTilesTest = class FadeOutBLTilesTest extends EffectsBaseLayer {
    title() {
        return "FadeOutBLTilesTest";
    }
    code() {
        return "a = cc.fadeOutBLTiles(duration, gridSize)";
    }
    getEffect(duration) {
        var action = cc.fadeOutBLTiles( duration, new cc.Size(16,12));
        var delay = new cc.DelayTime(0.5);
        var back = action.reverse();
        var seq = cc.sequence( action, delay, back);
        return seq;
    }

};

var FadeOutUpTilesTest = class FadeOutUpTilesTest extends EffectsBaseLayer {
    title() {
        return "FadeOutUpTilesTest";
    }
    code() {
        return "a = cc.fadeOutUpTiles(duration, gridSize)";
    }
    getEffect(duration) {
        var action = cc.fadeOutUpTiles( duration, new cc.Size(16,12));
        var delay = new cc.DelayTime(0.5);
        var back = action.reverse();
        var seq = cc.sequence( action, delay, back);
        return seq;
    }

};

var FadeOutDownTilesTest = class FadeOutDownTilesTest extends EffectsBaseLayer {
    title() {
        return "FadeOutDownTilesTest";
    }
    code() {
        return "a = cc.fadeOutDownTiles(duration, gridSize)";
    }
    getEffect(duration) {
        var action = cc.fadeOutDownTiles( duration, new cc.Size(16,12));
        var delay = new cc.DelayTime(0.5);
        var back = action.reverse();
        var seq = cc.sequence( action, delay, back);
        return seq;
    }

};

var TurnOffTilesTest = class TurnOffTilesTest extends EffectsBaseLayer {
    title() {
        return "TurnOffTiles";
    }
    code() {
        return "a = cc.turnOffTiles(duration, gridSize, seed)";
    }
    getEffect(duration) {
        var action = cc.turnOffTiles( duration, new cc.Size(48,32), 25);
        var delay = new cc.DelayTime(0.5);
        var back = action.reverse();
        var seq = cc.sequence( action, delay, back);
        return seq;
    }

};

var WavesTiles3DTest = class WavesTiles3DTest extends EffectsBaseLayer {
    title() {
        return "WavesTiles3D";
    }
    code() {
        return "a = cc.wavesTiles3D(duration, gridSize, waves, amplitude)";
    }
    getEffect(duration) {
        var action = cc.wavesTiles3D( duration, new cc.Size(16,12), 4, 120);
        return action;
    }

};


var JumpTiles3DTest = class JumpTiles3DTest extends EffectsBaseLayer {
    title() {
        return "JumpTiles3D";
    }
    code() {
        return "a = cc.jumpTiles3D(duration, gridSize, jumps, amplitude)";
    }
    getEffect(duration) {
        var action = cc.jumpTiles3D(duration, new cc.Size(16,12), 2, 30);
        return action;
    }

};

var SplitRowsTest = class SplitRowsTest extends EffectsBaseLayer {
    title() {
        return "SplitRows";
    }
    code() {
        return "a = cc.splitRows(duration, rows)";
    }
    getEffect(duration) {
        var action = cc.splitRows(duration, 9);
        var delay = new cc.DelayTime(0.5);
        var back = action.reverse();
        var seq = cc.sequence( action, delay, back);
        return seq;
    }

};

var SplitColsTest = class SplitColsTest extends EffectsBaseLayer {
    title() {
        return "SplitCols";
    }
    code() {
        return "a = cc.splitCols(duration, cols)";
    }
    getEffect(duration) {
        var action = cc.splitCols(duration, 9);
        var delay = new cc.DelayTime(0.5);
        var back = action.reverse();
        var seq = cc.sequence( action, delay, back);
        return seq;
    }

};

var PageTurn3DTest = class PageTurn3DTest extends EffectsBaseLayer {
    title() {
        return "PageTurn3D";
    }
    code() {
        return "a = cc.pageTurn3D(duration, gridSize)";
    }
    getEffect(duration) {
        var action = cc.pageTurn3D(duration, new cc.Size(15,10));
        return action;
    }

};

var PageTurn3DInRectTest = class PageTurn3DInRectTest extends BaseTestLayer {
    title() {
        return "PageTurn3DInRectTest";
    }
    code() {
        return "a = cc.pageTurn3D(duration, gridSize)";
    }
    // callbacks
    onRestartCallback(sender) {
        var s = new EffectsTestScene();
        s.addChild(restartEffectsTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new EffectsTestScene();
        s.addChild(nextEffectsTest());
        director.runScene(s);
    }
    onBackCallback(sender) {
        var s = new EffectsTestScene();
        s.addChild(previousEffectsTest());
        director.runScene(s);
    }
    onEnter(){
        super.onEnter();

        //var node = new cc.Node();
        var visiableSize = director.getVisibleSize();
        var gridRect = new cc.Rect(visiableSize.width*0.1,
            visiableSize.height*0.1,
            visiableSize.width*0.4,
            visiableSize.height*0.4);
        var gridNodeTarget = new cc.NodeGrid(gridRect);

        gridNodeTarget.runAction(this.getEffect(3));
        this.addChild( gridNodeTarget );

        // back gradient
        var background = new cc.LayerGradient( new cc.Color(255,0,0,255), new cc.Color(255,255,0,255));
        gridNodeTarget.addChild( background );

        // back image
        var bg = new cc.Sprite(s_back3);
        bg.x = winSize.width/2;
        bg.y = winSize.height/2;
        gridNodeTarget.addChild( bg );

        var sister1 = new cc.Sprite(s_pathSister1);
        sister1.x = winSize.width/3;
        sister1.y = winSize.height/2;
        gridNodeTarget.addChild( sister1, 1 );

        var sister2 = new cc.Sprite(s_pathSister2);
        sister2.x = winSize.width*2/3;
        sister2.y = winSize.height/2;
        gridNodeTarget.addChild( sister2, 1 );

        var sc = new cc.ScaleBy(2, 5);
        var sc_back = sc.reverse();
        var seq = cc.sequence( sc, sc_back );
        var repeat = seq.repeatForever();

        sister1.runAction( repeat );
        sister2.runAction( repeat.clone() );
    }

    getEffect(duration) {
        var action = cc.pageTurn3D(duration, new cc.Size(15,10));
        return action;
    }

};

//
// Order of tests
//
var EffectsTestScene = class EffectsTestScene extends TestScene {
    runThisTest(num) {
        effectsTestSceneIdx = (num || num == 0) ? (num - 1) : -1;
        var layer = nextEffectsTest();
        this.addChild(layer);

        director.runScene(this);
    }

};

//
// Flow control
//
var arrayOfEffectsTest = [
    Shaky3DTest,
    Waves3DTest,
    FlipXTest,
    FlipYTest,
    Lens3DTest,
    Ripple3DTest,
    LiquidTest,
    WavesTest,
    TwirlTest,
    ShakyTiles3DTest,
    ShatteredTiles3DTest,
    ShuffleTilesTest,
    FadeOutTRTilesTest,
    FadeOutBLTilesTest,
    FadeOutUpTilesTest,
    FadeOutDownTilesTest,
    TurnOffTilesTest,
    WavesTiles3DTest,
    JumpTiles3DTest,
    SplitRowsTest,
    SplitColsTest,
    PageTurn3DTest,
    PageTurn3DInRectTest
];

var nextEffectsTest = function () {
    effectsTestSceneIdx++;
    effectsTestSceneIdx = effectsTestSceneIdx % arrayOfEffectsTest.length;

    if(window.sideIndexBar){
        effectsTestSceneIdx = window.sideIndexBar.changeTest(effectsTestSceneIdx, 14);
    }

    return new arrayOfEffectsTest[effectsTestSceneIdx]();
};
var previousEffectsTest = function () {
    effectsTestSceneIdx--;
    if (effectsTestSceneIdx < 0)
        effectsTestSceneIdx += arrayOfEffectsTest.length;

    if(window.sideIndexBar){
        effectsTestSceneIdx = window.sideIndexBar.changeTest(effectsTestSceneIdx, 14);
    }

    return new arrayOfEffectsTest[effectsTestSceneIdx]();
};
var restartEffectsTest = function () {
    return new arrayOfEffectsTest[effectsTestSceneIdx]();
};