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

var unitTestSceneIdx = -1;

//------------------------------------------------------------------
//
// UnitTestBase
//
//------------------------------------------------------------------
var UnitTestBase = class UnitTestBase extends BaseTestLayer {
    constructor() {
        super();
        this._title = "";
        this._subtitle = "";
    }


    onRestartCallback(sender) {
        var s = new UnitTestScene();
        s.addChild(restartUnitTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new UnitTestScene();
        s.addChild(nextUnitTest());
        director.runScene(s);
    }
    onBackCallback(sender) {
        var s = new UnitTestScene();
        s.addChild(previousUnitTest());
        director.runScene(s);
    }

    // automation
    numberOfPendingTests() {
        return ( (arrayOfUnitTest.length-1) - unitTestSceneIdx );
    }

    getTestNumber() {
        return unitTestSceneIdx;
    }


};

//------------------------------------------------------------------
//
// RectUnitTest
//
//------------------------------------------------------------------
var RectUnitTest = class RectUnitTest extends UnitTestBase {
    constructor() {
        super();
        this._title = "Rect Unit Test";
        this._subtitle = "See console for possible errors";
        this.testDuration = 0.1;
    }


    onEnter() {
        super.onEnter();
        this.runTest();
    }

    runTest() {

        var ret = [];
        var rectA;
        var rectB;
        var rectC;
        var point;
        var r;

        this.log("Test 1: rectIntersectsRect 1");
        rectA = new cc.Rect(0,0,5,10);
        rectB = new cc.Rect(4,9,5,10);
        r = cc.Rect.intersects(rectA, rectB);
        if(!r)
            throw "Fail rectIntersectsRect 1";
        ret.push(r);

        this.log("Test 2: rectIntersectsRect 2");
        rectA = new cc.Rect(0,0,5,10);
        rectB = new cc.Rect(40,90,5,10);
        r = cc.Rect.intersects(rectA, rectB);
        if(r)
            throw "Fail rectIntersectsRect 2";
        ret.push(r);

        this.log("Test 3: rectIntersection");
        rectA = new cc.Rect(0,0,5,10);
        rectB = new cc.Rect(4,9,5,10);
        rectC = cc.Rect.intersection(rectA, rectB);
        r = cc.Rect.equalTo(rectC, new cc.Rect(4,9,1,1) );
        if(!r)
            throw "Fail rectIntersection";
        ret.push(r);

        this.log("Test 4: rectUnion");
        rectA = new cc.Rect(0,0,5,10);
        rectB = new cc.Rect(4,9,5,10);
        rectC = cc.Rect.union(rectA, rectB);
        r = cc.Rect.equalTo(rectC, new cc.Rect(0,0,9,19) );
        if(!r)
            throw "Fail rectUnion";
        ret.push(r);

        this.log("Test 5: rectContainsPoint 1");
        rectA = new cc.Rect(0,0,5,10);
        point = new cc.Point(1,1);
        r = cc.Rect.containsPoint(rectA, point);
        if(!r)
            throw "Fail rectContainsPoint 1";
        ret.push(r);

        this.log("Test 6: rectContainsPoint 2");
        rectA = new cc.Rect(0,0,5,10);
        point = new cc.Point(1,-1);
        r = cc.Rect.containsPoint(rectA, point);
        if(r)
            throw "Fail rectContainsPoint 2";
        ret.push(r);

        this.log("Test 7: rect property x");
        rectA = new cc.Rect(1,2,3,4);
        if( rectA.x != 1)
            throw "Fail rect property x";
        ret.push(rectA.x);

        this.log("Test 8: rect property y");
        rectA = new cc.Rect(1,2,3,4);
        if( rectA.y != 2)
            throw "Fail rect property y";
        ret.push(rectA.y);

        this.log("Test 9: rect property width");
        rectA = new cc.Rect(1,2,3,4);
        if( rectA.width != 3)
            throw "Fail rect property width";
        ret.push(rectA.width);

        this.log("Test 10: rect property height");
        rectA = new cc.Rect(1,2,3,4);
        if( rectA.height != 4)
            throw "Fail rect property height";
        ret.push(rectA.height);

        this.log("Test 11: getBoundingBox()");
        var node = new cc.Node();
        node.width = 99;
	    node.height = 101;
        var bb = node.getBoundingBox();
        if( bb.height != 101 || bb.width != 99)
            throw "Fail getBoundingBox()";
        ret.push( bb.height );
        ret.push( bb.width );
        return ret;
    }

    //
    // Automation
    //

    getExpectedResult() {
        var ret = [true,false,true,true,true,false,1,2,3,4,101,99];
        return JSON.stringify(ret);
    }

    getCurrentResult() {
        var ret = this.runTest();
        return JSON.stringify(ret);
    }


};

//------------------------------------------------------------------
//
// DictionaryToFromTest
//
//------------------------------------------------------------------
var DictionaryToFromTest = class DictionaryToFromTest extends UnitTestBase {

    constructor() {
        super();


        this._title = "Dictionary To/From Test";


        this._subtitle = "Sends and receives a dictionary to JSB";


        this.testDuration = 0.1;

        this.runTest();
    }

    runTest() {
        var frameCache = cc.spriteFrameCache;
        frameCache.addSpriteFrames(s_grossiniPlist);

        // Purge previously loaded animation
        var animCache = cc.animationCache;
        animCache.addAnimations(s_animations2Plist);

        var normal = animCache.getAnimation("dance_1");
        var frame = normal.getFrames()[0];
        var dict = frame.getUserInfo();
        this.log( JSON.stringify(dict) );
        frame.setUserInfo( {
                            "array":[1,2,3,"hello world"],
                            "bool0":0,  // false  XXX
                            "bool1":1,  // true   XXX
                            "dict":{"key1":"value1", "key2":2},
                            "number":42,
                            "string":"hello!"
                        });

        dict = frame.getUserInfo();
        this.log(JSON.stringify(dict));
        return dict;
    }

    //
    // Automation
    //

    getExpectedResult() {
        var ret = this.sortObject( {"array":[1,2,3,"hello world"],"bool0":0,"bool1":1,"dict":{"key1":"value1","key2":2},"number":42,"string":"hello!"} );

        return JSON.stringify(ret);
    }

    getCurrentResult() {
        var ret = this.sortObject( this.runTest() );
        return JSON.stringify(ret);
    }

};

var UnitTestScene = class UnitTestScene extends TestScene {
    runThisTest(num) {
        unitTestSceneIdx = (num || num == 0) ? (num - 1) : -1;
        var layer = nextUnitTest();
        this.addChild(layer);

        director.runScene(this);
    }

};

//
// Flow control
//

var arrayOfUnitTest = [

    RectUnitTest,
    DictionaryToFromTest

];

var nextUnitTest = function () {
    unitTestSceneIdx++;
    unitTestSceneIdx = unitTestSceneIdx % arrayOfUnitTest.length;

    return new arrayOfUnitTest[unitTestSceneIdx]();
};
var previousUnitTest = function () {
    unitTestSceneIdx--;
    if (unitTestSceneIdx < 0)
        unitTestSceneIdx += arrayOfUnitTest.length;

    return new arrayOfUnitTest[unitTestSceneIdx]();
};
var restartUnitTest = function () {
    return new arrayOfUnitTest[unitTestSceneIdx]();
};

