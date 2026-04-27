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

var MID_PUSHSCENE = 100;
var MID_PUSHSCENETRAN = 101;
var MID_QUIT = 102;
var MID_runScene = 103;
var MID_runSceneTRAN = 104;
var MID_GOBACK = 105;

var SceneTestLayer1 = class SceneTestLayer1 extends cc.Layer {
    constructor() {
        //----start0----Scene1-ctor
        super();
        this.init();

        var s = director.getWinSize();
        var item1 = new cc.MenuItemFont("Test pushScene", this.onPushScene, this);
        var item2 = new cc.MenuItemFont("Test pushScene w/transition", this.onPushSceneTran, this);
        var item3 = new cc.MenuItemFont("Quit", function () {
            cc.log("quit!");
        }, this);
        var item4 = new cc.MenuItemFont("setNotificationNode", function () {
            var layerTemp = new cc.LayerColor(new cc.Color(0, 255, 255, 120));
            var sprite = new cc.Sprite(s_pathGrossini);
            sprite.setPosition(new cc.Point(winSize.width/2,winSize.height/2));
            layerTemp.addChild(sprite);
            cc.director.setNotificationNode(layerTemp);
            var rotation = new cc.RotateBy(2,360);
            sprite.runAction(rotation.repeatForever());
            cc.log("setNotificationNode!");
        }, this);
        var item5 = new cc.MenuItemFont("clearNotificationNode", function () {
            cc.log("clearNotificationNode!");
            cc.director.setNotificationNode(null);
        }, this);

        var menu = new cc.Menu(item1, item2, item3, item4, item5);
        menu.alignItemsVertically();
        this.addChild(menu);

        var sprite = new cc.Sprite(s_pathGrossini);
        this.addChild(sprite);
        sprite.x = s.width - 40;
        sprite.y = s.height / 2;
        var rotate = new cc.RotateBy(2, 360);
        var repeat = rotate.repeatForever();
        sprite.runAction(repeat);
        //----end0----

        //cc.schedule(this.testDealloc);
    }


    onEnter() {
        cc.log("SceneTestLayer1#onEnter");
        super.onEnter();
    }

    onEnterTransitionDidFinish() {
        cc.log("SceneTestLayer1#onEnterTransitionDidFinish");
        super.onEnterTransitionDidFinish();
    }

    testDealloc(dt) {
        //cc.log("SceneTestLayer1:testDealloc");
    }

    onPushScene(sender) {
        var scene = new SceneTestScene();
        var layer = new SceneTestLayer2();
        scene.addChild(layer, 0);
        director.pushScene(scene);
    }

    onPushSceneTran(sender) {
        var scene = new SceneTestScene();
        var layer = new SceneTestLayer2();
        scene.addChild(layer, 0);

        director.pushScene(new cc.TransitionSlideInT(1, scene));
    }
    onExit(sender) {
        cc.director.setNotificationNode(null);
        super.onExit();
    }

    //CREATE_NODE(SceneTestLayer1);

};

var SceneTestLayer2 = class SceneTestLayer2 extends cc.Layer {


    constructor() {
        //----start0----Scene2-ctor
        super();



        this.timeCounter = 0;
        this.init();

        this.timeCounter = 0;

        var s = director.getWinSize();

        var item1 = new cc.MenuItemFont("runScene", this.runScene, this);
        var item2 = new cc.MenuItemFont("runScene w/transition", this.runSceneTran, this);
        var item3 = new cc.MenuItemFont("Go Back", this.onGoBack, this);

        var menu = new cc.Menu(item1, item2, item3);
        menu.alignItemsVertically();
        this.addChild(menu);

        var sprite = new cc.Sprite(s_pathGrossini);
        this.addChild(sprite);

        sprite.x = s.width - 40;
        sprite.y = s.height / 2;
        var rotate = new cc.RotateBy(2, 360);
        var repeat = rotate.repeatForever();
        sprite.runAction(repeat);
        //----end0----

        //cc.schedule(this.testDealloc);
    }

    testDealloc(dt) {

    }

    onGoBack(sender) {
        director.popScene();
    }

    runScene(sender) {
        var scene = new SceneTestScene();
        var layer = new SceneTestLayer3();
        scene.addChild(layer, 0);
        director.runScene(scene);

    }

    runSceneTran(sender) {
        var scene = new SceneTestScene();
        var layer = new SceneTestLayer3();
        scene.addChild(layer, 0);
        director.runScene(new cc.TransitionSlideInT(2, scene));
    }

    //CREATE_NODE(SceneTestLayer2);

};

var SceneTestLayer3 = class SceneTestLayer3 extends cc.LayerColor {
    
    constructor() {

        //----start0----Scene3-ctor
        super();
        this.init( new cc.Color(0,128,255,255) );

        var label = new cc.LabelTTF("Touch to popScene", "Arial", 28);
        this.addChild(label);
        var s = director.getWinSize();
        label.x = s.width / 2;
        label.y = s.height / 2;

        var sprite = new cc.Sprite(s_pathGrossini);
        this.addChild(sprite);

        sprite.x = s.width - 40;

        sprite.y = s.height / 2;
        var rotate = new cc.RotateBy(2, 360);
        var repeat = rotate.repeatForever();
        sprite.runAction(repeat);
        //----end0----
    }
    
    onEnterTransitionDidFinish() {
        if ('touches' in cc.sys.capabilities){
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesEnded: function(touches, event){
                    director.popScene();
                }
            }, this);
        } else if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseUp: function(event){
                    director.popScene();
                }
            }, this);
    }

    testDealloc(dt) {

    }

    //CREATE_NODE(SceneTestLayer3);

};

SceneTestScene = class SceneTestScene extends TestScene {

    runThisTest() {
        var layer = new SceneTestLayer1();
        this.addChild(layer);

        director.runScene(this);

    }

};

var arrayOfSceneTest = [
    SceneTestLayer1
];
