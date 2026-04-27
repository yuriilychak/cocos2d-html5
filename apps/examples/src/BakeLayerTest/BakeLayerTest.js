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

var _bakeLayerTestIdx = -1;

//------------------------------------------------------------------
//
// ActionManagerTest
//
//------------------------------------------------------------------
var BakeLayerBaseTest = class BakeLayerBaseTest extends BaseTestLayer {
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
        var s = new BakeLayerTestScene();
        s.addChild(previousBakeLayerTest());
        director.runScene(s);
    }
    onRestartCallback(sender) {
        var s = new BakeLayerTestScene();
        s.addChild(restartBakeLayerTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new BakeLayerTestScene();
        s.addChild(nextBakeLayerTest());
        director.runScene(s);
    }
    // automation
    numberOfPendingTests() {
        return ( (arrayOfBakeLayerTest.length-1) - _bakeLayerTestIdx );
    }

    getTestNumber() {
        return _bakeLayerTestIdx;
    }

};

var BakeLayerTest1 = class BakeLayerTest1 extends BakeLayerBaseTest {

    title() {
        return "Test 1. Bake Layer (Canvas only)";
    }

    constructor(){
        super();


        this._bakeLayer = null;

        var winSize = cc.winSize;
        var bakeItem = new cc.MenuItemFont("bake", this.onBake, this);
        var unbakeItem = new cc.MenuItemFont("unbake", this.onUnbake, this);
        var runActionItem = new cc.MenuItemFont("run action", this.onRunAction, this);
        var menu = new cc.Menu(bakeItem, unbakeItem, runActionItem);

        menu.alignItemsVertically();
        menu.x = winSize.width - 70;
        menu.y = winSize.height - 120;
        this.addChild(menu, 10);

        var rootLayer = new cc.Layer();
        rootLayer.setPosition(20,20);
        this.addChild(rootLayer);

        var bakeLayer = new cc.Layer();
        bakeLayer.bake();
        bakeLayer.setRotation(30);
        rootLayer.addChild(bakeLayer);

        for(var i = 0; i < 9; i++){
            var sprite1 = new cc.Sprite(s_pathGrossini);
            if (i % 2 === 0) {
                sprite1.setPosition(90 + i * 80, winSize.height / 2 - 50);
            } else {
                sprite1.setPosition(90 + i * 80, winSize.height / 2 + 50);
            }
            if(i === 4)
                this._actionSprite = sprite1;
            sprite1.rotation = 360 * Math.random();
            bakeLayer.addChild(sprite1);
        }
        this._bakeLayer = bakeLayer;
        bakeLayer.runAction(cc.sequence(new cc.MoveBy(2, new cc.Point(100,100)), new cc.MoveBy(2, new cc.Point(-100,-100))));
    }

    onBake(){
        this._bakeLayer.bake();
    }

    onUnbake(){
        this._bakeLayer.unbake();
    }

    onRunAction(){
        this._actionSprite.runAction(new cc.RotateBy(1, 180));
    }

};

var BakeLayerTest2 = class BakeLayerTest2 extends BakeLayerBaseTest {

    title() {
        return "Test 2. Bake Layer with other layer (Canvas only)";
    }

    subtitle() {
        return "Changing top layer shouldn't increase draw call number";
    }

    constructor(){
        super();


        this._bakeLayer = null;

        var winSize = cc.winSize;
        var bakeItem = new cc.MenuItemFont("bake", this.onBake, this);
        var unbakeItem = new cc.MenuItemFont("unbake", this.onUnbake, this);
        var chTopItem = new cc.MenuItemFont("change top layer", this.onChangeZOrder, this);
        var chBakeItem = new cc.MenuItemFont("change bake layer", this.onChangeBakeZOrder, this);
        var menu = new cc.Menu(bakeItem, unbakeItem, chTopItem, chBakeItem);

        menu.alignItemsVertically();
        menu.x = winSize.width - 70;
        menu.y = winSize.height - 120;
        this.addChild(menu, 10);

        var rootLayer = new cc.Layer();
        rootLayer.setPosition(20,20);
        this.addChild(rootLayer);

        var bakeLayer = new cc.Layer();
        bakeLayer.bake();
        bakeLayer.setRotation(30);
        rootLayer.addChild(bakeLayer);

        for(var i = 0; i < 9; i++){
            var sprite1 = new cc.Sprite(s_pathGrossini);
            if (i % 2 === 0) {
                sprite1.setPosition(50 + i * 30, winSize.height / 2 - 150);
            } else {
                sprite1.setPosition(50 + i * 30, winSize.height / 2 - 100);
            }
            if(i === 4)
                this._actionSprite = sprite1;
            sprite1.rotation = 360 * Math.random();
            bakeLayer.addChild(sprite1);
        }
        this._bakeLayer = bakeLayer;

        var normalLayer = new cc.Layer();
        rootLayer.addChild(normalLayer);

        for(var i = 0; i < 9; i++){
            var sprite1 = new cc.Sprite(s_pathSister1);
            if (i % 2 === 0) {
                sprite1.setPosition(400 + i * 40, winSize.height / 2 - 50);
            } else {
                sprite1.setPosition(400 + i * 40, winSize.height / 2 + 50);
            }
            if(i === 4)
                this._actionSprite = sprite1;
            sprite1.rotation = 360 * Math.random();
            normalLayer.addChild(sprite1);
        }
        this._normalLayer = normalLayer;

        this.zOrder = 0;
    }

    onBake(){
        this._bakeLayer.bake();
    }

    onUnbake(){
        this._bakeLayer.unbake();
    }

    onChangeZOrder(){
        this.zOrder++;
        var childId = Math.floor(Math.random() * 9);
        this._normalLayer.children[childId].setLocalZOrder(this.zOrder);
        this._normalLayer.children[childId].rotation = 360 * Math.random();
    }

    onChangeBakeZOrder(){
        this.zOrder++;
        var childId = Math.floor(Math.random() * 9);
        this._bakeLayer.children[childId].setLocalZOrder(this.zOrder);
    }

};

var BakeLayerColorTest = class BakeLayerColorTest extends BakeLayerBaseTest {

    title() {
        return "Test 3. Bake Layer Gradient (Canvas only)";
    }

    constructor(){
        super();


        this._bakeLayer = null;


        this._actionSprite = null;

        var winSize = cc.winSize;
        var bakeItem = new cc.MenuItemFont("bake", this.onBake, this);
        var unbakeItem = new cc.MenuItemFont("unbake", this.onUnbake, this);
        var runActionItem = new cc.MenuItemFont("run action", this.onRunAction, this);
        var menu = new cc.Menu(bakeItem, unbakeItem, runActionItem);

        menu.alignItemsVertically();
        menu.x = winSize.width - 70;
        menu.y = winSize.height - 120;
        this.addChild(menu, 10);

        var rootLayer = new cc.Layer();
        rootLayer.setPosition(20,20);
        this.addChild(rootLayer);


        var bakeLayer = new cc.LayerGradient(new cc.Color(128,0, 128, 255), new cc.Color(0, 0, 128, 255));
        bakeLayer.setPosition(60, 80);
        bakeLayer.setContentSize(700, 300);
        bakeLayer.setRotation(30);

        rootLayer.addChild(bakeLayer);

        for(var i = 0; i < 9; i++){
            var sprite1 = new cc.Sprite(s_pathGrossini);
            if (i % 2 === 0) {
                sprite1.setPosition(20 + i * 80, 100);
            } else {
                sprite1.setPosition(20 + i * 80, 200);
            }
            if(i === 4)
                this._actionSprite = sprite1;
            sprite1.rotation = 180 * Math.random();
            bakeLayer.addChild(sprite1);
        }

        this._bakeLayer = bakeLayer;
        bakeLayer.bake();
        bakeLayer.runAction(cc.sequence(new cc.MoveBy(2, new cc.Point(100,100)), new cc.MoveBy(2, new cc.Point(-100,-100))));
    }

    onBake(){
        this._bakeLayer.bake();
    }

    onUnbake(){
        this._bakeLayer.unbake();
    }

    onRunAction(){
        this._actionSprite.runAction(new cc.RotateBy(2, 180));
    }

};

var BakeLayerTestScene = class BakeLayerTestScene extends TestScene {
    runThisTest(num) {
        _bakeLayerTestIdx = (num || 0) - 1;
        this.addChild(nextBakeLayerTest());
        director.runScene(this);
    }

};

//-
//
// Flow control
//
var arrayOfBakeLayerTest = [
    BakeLayerTest1,
    BakeLayerTest2,
    BakeLayerColorTest
];

var nextBakeLayerTest = function (num) {
    _bakeLayerTestIdx = num ? num - 1 : _bakeLayerTestIdx;
    _bakeLayerTestIdx++;
    _bakeLayerTestIdx = _bakeLayerTestIdx % arrayOfBakeLayerTest.length;

    if(window.sideIndexBar){
        _bakeLayerTestIdx = window.sideIndexBar.changeTest(_bakeLayerTestIdx, 0);
    }
    return new arrayOfBakeLayerTest[_bakeLayerTestIdx]();
};

var previousBakeLayerTest = function () {
    _bakeLayerTestIdx--;
    if (_bakeLayerTestIdx < 0)
        _bakeLayerTestIdx += arrayOfBakeLayerTest.length;

    if(window.sideIndexBar){
        _bakeLayerTestIdx = window.sideIndexBar.changeTest(_bakeLayerTestIdx, 0);
    }
    return new arrayOfBakeLayerTest[_bakeLayerTestIdx]();
};
var restartBakeLayerTest = function () {
    return new arrayOfBakeLayerTest[_bakeLayerTestIdx]();
};