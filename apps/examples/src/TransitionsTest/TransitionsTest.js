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
TRANSITION_DURATION = 1.2;

var arrayOfTransitionsTest = [

    {title:"JumpZoomTransition", transitionFunc:function (t, s) {
        return new JumpZoomTransition(t, s);
    }},

    {title:"TransitionProgressRadialCCW", transitionFunc:function (t, s) {
        return new cc.TransitionProgressRadialCCW(t, s);
    }},

    {title:"TransitionProgressRadialCW", transitionFunc:function (t, s) {
        return new cc.TransitionProgressRadialCW(t, s);
    }},

    {title:"TransitionProgressHorizontal", transitionFunc:function (t, s) {
        return new cc.TransitionProgressHorizontal(t, s);
    }},

    {title:"TransitionProgressVertical", transitionFunc:function (t, s) {
        return new cc.TransitionProgressVertical(t, s);
    }},

    {title:"TransitionProgressInOut", transitionFunc:function (t, s) {
        return new cc.TransitionProgressInOut(t, s);
    }},

    {title:"TransitionProgressOutIn", transitionFunc:function (t, s) {
        return new cc.TransitionProgressOutIn(t, s);
    }},

    //ok
    {title:"FadeTransition", transitionFunc:function (t, s) {
        return FadeTransition(t, s);
    }},
    {title:"FadeWhiteTransition", transitionFunc:function (t, s) {
        return FadeWhiteTransition(t, s);
    }},

    {title:"ShrinkGrowTransition", transitionFunc:function (t, s) {
        return ShrinkGrowTransition(t, s);
    }},
    {title:"RotoZoomTransition", transitionFunc:function (t, s) {
        return RotoZoomTransition(t, s);
    }},
    {title:"MoveInLTransition", transitionFunc:function (t, s) {
        return MoveInLTransition(t, s);
    }},
    {title:"MoveInRTransition", transitionFunc:function (t, s) {
        return MoveInRTransition(t, s);
    }},
    {title:"MoveInTTransition", transitionFunc:function (t, s) {
        return MoveInTTransition(t, s);
    }},
    {title:"MoveInBTransition", transitionFunc:function (t, s) {
        return MoveInBTransition(t, s);
    }},
    {title:"SlideInLTransition", transitionFunc:function (t, s) {
        return SlideInLTransition(t, s);
    }},
    {title:"SlideInRTransition", transitionFunc:function (t, s) {
        return SlideInRTransition(t, s);
    }},
    {title:"SlideInTTransition", transitionFunc:function (t, s) {
        return SlideInTTransition(t, s);
    }},
    {title:"SlideInBTransition", transitionFunc:function (t, s) {
        return SlideInBTransition(t, s);
    }},
    {title:"CCTransitionRadialCCW", transitionFunc:function (t, s) {
        return CCTransitionRadialCCW(t, s);
    }},
    {title:"CCTransitionRadialCW", transitionFunc:function (t, s) {
        return CCTransitionRadialCW(t, s);
    }}
];

if (!cc.rendererConfig.isCanvas) {
    arrayOfTransitionsTest = arrayOfTransitionsTest.concat(
        [
            {title: "PageTransitionForward", transitionFunc: function (t, s) {
                return PageTransitionForward(t, s);
            }},
            {title: "PageTransitionBackward", transitionFunc: function (t, s) {
                return PageTransitionBackward(t, s);
            }},
            {title: "FadeTRTransition", transitionFunc: function (t, s) {
                return FadeTRTransition(t, s);
            }},
            {title: "FadeBLTransition", transitionFunc: function (t, s) {
                return FadeBLTransition(t, s);
            }},
            {title: "FadeUpTransition", transitionFunc: function (t, s) {
                return FadeUpTransition(t, s);
            }},
            {title: "FadeDownTransition", transitionFunc: function (t, s) {
                return FadeDownTransition(t, s);
            }},
            {title: "TurnOffTilesTransition", transitionFunc: function (t, s) {
                return TurnOffTilesTransition(t, s);
            }},
            {title: "SplitRowsTransition", transitionFunc: function (t, s) {
                return SplitRowsTransition(t, s);
            }},
            {title: "CCTransitionCrossFade", transitionFunc: function (t, s) {
                return CCTransitionCrossFade(t, s);
            }},
            {title: "SplitColsTransition", transitionFunc: function (t, s) {
                return SplitColsTransition(t, s);
            }}
        ]);
}

var transitionsIdx = 0;

// the class inherit from TestScene
// every .Scene each test used must inherit from TestScene,
// make sure the test have the menu item for back to main menu
export class TransitionsTestScene extends TestScene {
    onEnter() {
        super.onEnter();
        director.setDepthTest(false);
    }
    runThisTest() {
        var layer = new TestLayer1();
        this.addChild(layer);
        director.runScene(this);
    }

};

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
        transitionsIdx++;
        transitionsIdx = transitionsIdx % arrayOfTransitionsTest.length;

        var s = new TransitionsTestScene();

        var layer = this.createNextScene();
        s.addChild(layer);

        var scene = arrayOfTransitionsTest[transitionsIdx].transitionFunc(TRANSITION_DURATION, s);
        if (scene)
            director.runScene(scene);
    }
    onBackCallback(sender) {
        transitionsIdx--;
        if (transitionsIdx < 0)
            transitionsIdx += arrayOfTransitionsTest.length;

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


};
export class TestLayer1 extends TransitionBase {
    constructor() {
        super(s_back1, "Scene 1", new cc.Color(0,0,0,255), new cc.Color(160,99,117,255));
    }

    createNextScene() {
        return new TestLayer2();
    }

};

export class TestLayer2 extends TransitionBase {
    constructor() {
        super(s_back2, "Scene 2", new cc.Color(0,0,0,255), new cc.Color(99,160,117,255));
    }

    createNextScene() {
        return new TestLayer1();
    }

};

export function JumpZoomTransition(t, s) {
    return new cc.TransitionJumpZoom(t, s);
};
export function FadeTransition(t, s) {
    return new cc.TransitionFade(t, s);
};

export function FadeWhiteTransition(t, s) {
    return new cc.TransitionFade(t, s, new cc.Color(255, 255, 255));
};

export function FlipXLeftOver(t, s) {
    return new cc.TransitionFlipX(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
};

export function FlipXRightOver(t, s) {
    return new cc.TransitionFlipX(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
};

export function FlipYUpOver(t, s) {
    return new cc.TransitionFlipY(t, s, cc.TRANSITION_ORIENTATION_UP_OVER);
};

export function FlipYDownOver(t, s) {
    return new cc.TransitionFlipY(t, s, cc.TRANSITION_ORIENTATION_DOWN_OVER);
};

export function FlipAngularLeftOver(t, s) {
    return new cc.TransitionFlipAngular(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
};

export function FlipAngularRightOver(t, s) {
    return new cc.TransitionFlipAngular(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
};

export function ZoomFlipXLeftOver(t, s) {
    return new cc.TransitionZoomFlipX(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
};

export function ZoomFlipXRightOver(t, s) {
    return new cc.TransitionZoomFlipX(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
};

export function ZoomFlipYUpOver(t, s) {
    return new cc.TransitionZoomFlipY(t, s, cc.TRANSITION_ORIENTATION_UP_OVER);
};

export function ZoomFlipYDownOver(t, s) {
    return new cc.TransitionZoomFlipY(t, s, cc.TRANSITION_ORIENTATION_DOWN_OVER);
};

export function ZoomFlipAngularLeftOver(t, s) {
    return new cc.TransitionZoomFlipAngular(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
};

export function ZoomFlipAngularRightOver(t, s) {
    return new cc.TransitionZoomFlipAngular(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
};

export function ShrinkGrowTransition(t, s) {
    return new cc.TransitionShrinkGrow(t, s);
};

export function RotoZoomTransition(t, s) {
    return new cc.TransitionRotoZoom(t, s);
};

export function MoveInLTransition(t, s) {
    return new cc.TransitionMoveInL(t, s);
};

export function MoveInRTransition(t, s) {
    return new cc.TransitionMoveInR(t, s);
};

export function MoveInTTransition(t, s) {
    return new cc.TransitionMoveInT(t, s);
};

export function MoveInBTransition(t, s) {
    return new cc.TransitionMoveInB(t, s);
};

export function SlideInLTransition(t, s) {
    return new cc.TransitionSlideInL(t, s);
};

export function SlideInRTransition(t, s) {
    return new cc.TransitionSlideInR(t, s);
};

export function SlideInTTransition(t, s) {
    return new cc.TransitionSlideInT(t, s);
};

export function SlideInBTransition(t, s) {
    return new cc.TransitionSlideInB(t, s);
};

export function CCTransitionCrossFade(t, s) {
    return new cc.TransitionCrossFade(t, s);
};

export function CCTransitionRadialCCW(t, s) {
    return new cc.TransitionProgressRadialCCW(t, s);
};

export function CCTransitionRadialCW(t, s) {
    return new cc.TransitionProgressRadialCW(t, s);
};

export function PageTransitionForward(t, s) {
    director.setDepthTest(true);
    return new cc.TransitionPageTurn(t, s, false);
};

export function PageTransitionBackward(t, s) {
    director.setDepthTest(true);
    return new cc.TransitionPageTurn(t, s, true);
};

export function FadeTRTransition(t, s) {
    return new cc.TransitionFadeTR(t, s);
};

export function FadeBLTransition(t, s) {
    return new cc.TransitionFadeBL(t, s);
};

export function FadeUpTransition(t, s) {
    return new cc.TransitionFadeUp(t, s);
};

export function FadeDownTransition(t, s) {
    return new cc.TransitionFadeDown(t, s);
};

export function TurnOffTilesTransition(t, s) {
    return new cc.TransitionTurnOffTiles(t, s);
};

export function SplitRowsTransition(t, s) {
    return new cc.TransitionSplitRows(t, s);
};

export function SplitColsTransition(t, s) {
    return new cc.TransitionSplitCols(t, s);
};
