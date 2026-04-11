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

var memoryModelTestSceneIdx = -1;

//------------------------------------------------------------------
//
// MemoryModelTestBase
//
//------------------------------------------------------------------
var MemoryModelTestBase = class MemoryModelTestBase extends BaseTestLayer {
    constructor() {
        super();
        this._title = "";
        this._subtitle = "";
    }


    onRestartCallback(sender) {
        var s = new MemoryModelTestScene();
        s.addChild(restartMemoryModelTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new MemoryModelTestScene();
        s.addChild(nextMemoryModelTest());
        director.runScene(s);
    }
    onBackCallback(sender) {
        var s = new MemoryModelTestScene();
        s.addChild(previousMemoryModelTest());
        director.runScene(s);
    }

    // automation
    numberOfPendingTests() {
        return ( (arrayOfMemoryModelTest.length-1) - memoryModelTestSceneIdx );
    }

    getTestNumber() {
        return memoryModelTestSceneIdx;
    }


};

//------------------------------------------------------------------
//
// Set property on sprite
//
//------------------------------------------------------------------
var SetPropertyMemoryModelTest = class SetPropertyMemoryModelTest extends MemoryModelTestBase {

    constructor() {
        cc.sys.garbageCollect();
        super();


        this._title = "Set Property Test";


        this._subtitle = "See console for possible errors";
        var sprite = new cc.Sprite(s_grossini_dance_atlas, cc.rect(0, 0, 85, 121));
        var tag = 10;
        this.addChild(sprite, 0, tag);
        var x = winSize.width / 2;
        var y = winSize.height / 2;
        sprite.setPosition(x, y);

        // add random property
        sprite.randomProperty = "hello world";

        sprite = this.getChildByTag(tag);
        
        // should print "hello world"
        this.log(sprite.randomProperty);
    }

};

//------------------------------------------------------------------
//
// Using Ivar 1: from ctor to onEnter
//
//------------------------------------------------------------------
var Ivar1MemoryModelTest = class Ivar1MemoryModelTest extends MemoryModelTestBase {

    constructor() {
        super();


        this._title = "Using ivars to hold C++ objects";


        this._subtitle = "From ctor to onEnter";
        this.sprite = new cc.Sprite(s_grossini_dance_atlas, cc.rect(0, 0, 85, 121));
    }
    onEnter() {
        super.onEnter();
        this.addChild(this.sprite);
        var x = winSize.width / 2;
        var y = winSize.height / 2;
        this.sprite.setPosition(x, y);
    }

};

//------------------------------------------------------------------
//
// Using Ivar 2: from ctor to update 
//
//------------------------------------------------------------------
var Ivar2MemoryModelTest = class Ivar2MemoryModelTest extends MemoryModelTestBase {

    constructor() {
        super();


        this._title = "Using ivars to hold C++ objects";


        this._subtitle = "From ctor to update";
        this.sprite = new cc.Sprite(s_grossini_dance_atlas, cc.rect(0, 0, 85, 121));
        this.scheduleOnce(this.showSprite, 0.5);
    }
    showSprite() {
        this.addChild(this.sprite);
        var x = winSize.width / 2;
        var y = winSize.height / 2;
        this.sprite.setPosition(x, y);
    }

};

var MemoryModelTestScene = class MemoryModelTestScene extends TestScene {
    runThisTest(num) {
        memoryModelTestSceneIdx = (num || num == 0) ? (num - 1) : -1;
        var layer = nextMemoryModelTest();
        this.addChild(layer);

        director.runScene(this);
    }

};

//------------------------------------------------------------------
//
// Using Local vars
//
//------------------------------------------------------------------
var LocalVarMemoryModelTest = class LocalVarMemoryModelTest extends MemoryModelTestBase {

    constructor() {
        super();


        this._title = "Using local vars + GC";


        this._subtitle = "native objects should get destroyed";
        var sprite1 = new cc.Sprite(s_grossini_dance_atlas, cc.rect(0, 0, 85, 121));
        var sprite2 = new cc.Sprite(s_grossini_dance_atlas, cc.rect(0, 0, 85, 121));
        var sprite3 = new cc.Sprite(s_grossini_dance_atlas, cc.rect(0, 0, 85, 121));
        var a = 10;
        this.addChild(sprite1);
        this.removeChild(sprite1);
//        this.addChild(sprite2);
//        this.removeChild(sprite2);
        this.addChild(sprite3);
        this.removeChild(sprite3);
        //cc.sys.dumpRoot();
        cc.sys.garbageCollect();
        cc.log(sprite1);
        cc.log(sprite2);
        cc.log(sprite3);
        cc.log(a);
    }

};

//------------------------------------------------------------------
//
// Using Local vars
//
//------------------------------------------------------------------
var RetainRootsMemoryModelTest = class RetainRootsMemoryModelTest extends MemoryModelTestBase {

    constructor() {
        super();


        this._title = "retain must root";


        this._subtitle = "native objects should not get destroyed";
        var sprite = new cc.Sprite(s_grossini_dance_atlas, cc.rect(0, 0, 85, 121));
        // addChild should root the sprite
        this.addChild(sprite);
        cc.sys.garbageCollect();

        var x = winSize.width / 2;
        var y = winSize.height / 2;
        sprite.setPosition(x, y);
    }

};

//------------------------------------------------------------------
//
// Testing Root/Unroot
//
//------------------------------------------------------------------
var RootUnrootMemoryModelTest = class RootUnrootMemoryModelTest extends MemoryModelTestBase {

    constructor() {
        super();


        this._title = "root/unroot";


        this._subtitle = "rooting/unrooting with GC memory model";
        var sprite = new cc.Sprite(s_grossini_dance_atlas, cc.rect(0, 0, 85, 121));
        // addChild should root the sprite
        this.addChild(sprite);

        // should unroot the sprite
        this.removeChild(sprite)
        cc.sys.garbageCollect();
    }

};


//
// Entry point
//
var MemoryModelTestScene = class MemoryModelTestScene extends TestScene {
    runThisTest(num) {
        memoryModelTestSceneIdx = (num || num == 0) ? (num - 1) : -1;
        var layer = nextMemoryModelTest();
        this.addChild(layer);

        director.runScene(this);
    }

};


//
// Flow control
//

var arrayOfMemoryModelTest = [
    SetPropertyMemoryModelTest,
    Ivar1MemoryModelTest,
    Ivar2MemoryModelTest,
    LocalVarMemoryModelTest,
    RetainRootsMemoryModelTest,
    RootUnrootMemoryModelTest,
];

var nextMemoryModelTest = function () {
    memoryModelTestSceneIdx++;
    memoryModelTestSceneIdx = memoryModelTestSceneIdx % arrayOfMemoryModelTest.length;

    return new arrayOfMemoryModelTest[memoryModelTestSceneIdx]();
};
var previousMemoryModelTest = function () {
    memoryModelTestSceneIdx--;
    if (memoryModelTestSceneIdx < 0)
        memoryModelTestSceneIdx += arrayOfMemoryModelTest.length;

    return new arrayOfMemoryModelTest[memoryModelTestSceneIdx]();
};
var restartMemoryModelTest = function () {
    return new arrayOfMemoryModelTest[memoryModelTestSceneIdx]();
};

