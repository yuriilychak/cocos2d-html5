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

var sysTestSceneIdx = -1;
//------------------------------------------------------------------
//
// SysTestBase
//
//------------------------------------------------------------------
var SysTestBase = class SysTestBase extends BaseTestLayer {

    constructor() {
        super(cc.color(0,0,0,0), cc.color(98,99,117,0));


        this._title = "";


        this._subtitle = "";
    }
    onRestartCallback(sender) {
        var s = new SysTestScene();
        s.addChild(restartSysTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new SysTestScene();
        s.addChild(nextSysTest());
        director.runScene(s);
    }
    onBackCallback(sender) {
        var s = new SysTestScene();
        s.addChild(previousSysTest());
        director.runScene(s);
    }
    // automation
    numberOfPendingTests() {
        return ( (arrayOfSysTest.length-1) - sysTestSceneIdx );
    }

    getTestNumber() {
        return sysTestSceneIdx;
    }


};

//------------------------------------------------------------------
//
// setClearColorTest
//
//------------------------------------------------------------------
var setClearColorTest = class setClearColorTest extends SysTestBase {
    constructor()
    {
        super();

        this._title = "Set clearColor to red with alpha = 0 ";
        var bg = new cc.Sprite(s_back,cc.rect(0,0, 200, 200));
        bg.x = winSize.width/2;
        bg.y = winSize.height/2;
        this.addChild(bg);
    }
    onEnter()
    {
        super.onEnter();
        var clearColor = cc.color(255, 0, 0, 0);
        director.setClearColor(clearColor);
    }
    onExit()
    {
        director.setClearColor(cc.color(0, 0, 0, 255));
        super.onExit();
    }

};

//------------------------------------------------------------------
//
// LocalStorageTest
//
//------------------------------------------------------------------
var LocalStorageTest = class LocalStorageTest extends SysTestBase {

    constructor() {
        super();


        this._title = "LocalStorage Test ";


        this._subtitle = "See the console";

        var key = 'key_' + Math.random();
        var ls = cc.sys.localStorage;
        cc.log("- Adding items");
        ls.setItem(key, "Hello world");
        var key1 = "1" + key;
        ls.setItem(key1, "Hello JavaScript");
        var key2 = "2" + key;
        ls.setItem(key2, "Hello Cocos2d-JS");
        var key3 = "3" + key;
        ls.setItem(key3, "Hello Cocos");

        cc.log("- Getting Hello world");
        var r = ls.getItem(key);
        cc.log(r);

        cc.log("- Removing Hello world");
        ls.removeItem(key);

        cc.log("- Getting Hello world");
        r = ls.getItem(key);
        cc.log(r);

        cc.log("- Getting other items");
        cc.log( ls.getItem(key1) );
        cc.log( ls.getItem(key2) );
        cc.log( ls.getItem(key3) );

        cc.log("- Clearing local storage");
        ls.clear();
        cc.log("- Getting other items");
        cc.log( ls.getItem(key1) );
        cc.log( ls.getItem(key2) );
        cc.log( ls.getItem(key3) );
    }


};

//------------------------------------------------------------------
//
// CapabilitiesTest
//
//------------------------------------------------------------------
var CapabilitiesTest = class CapabilitiesTest extends SysTestBase {

    constructor() {
        super();


        this._title = "Capabilities Test ";


        this._subtitle = "See the console";

        var c = cc.sys.capabilities;
        for( var i in c )
            cc.log( i + " = " + c[i] );
    }


};

var SysTestScene = class SysTestScene extends TestScene {
    runThisTest(num) {
        sysTestSceneIdx = (num || num == 0) ? (num - 1) : -1;
        var layer = nextSysTest();
        this.addChild(layer);
        director.runScene(this);
    }

};

//------------------------------------------------------------------
//
// Script dynamic reload test
//
//------------------------------------------------------------------
var tempJSFileName = "ScriptTestTempFile.js";
var ScriptTestLayer = class ScriptTestLayer extends SysTestBase {
    startDownload() {
        if (!cc.sys.isNative)
        {
            return;
        }
        var that = this;
        var manifestPath = "Manifests/ScriptTest/project.manifest";
        var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "JSBTests/AssetsManagerTest/ScriptTest/");
        cc.log("Storage path for this test : " + storagePath);

        if (this._am){
            this._am = null;
        }

        this._am = new jsb.AssetsManager(manifestPath, storagePath);
        if (!this._am.getLocalManifest().isLoaded()){
            cc.log("Fail to update assets, step skipped.");
            that.clickMeShowTempLayer();
        }else {
            var listener = new jsb.EventListenerAssetsManager(this._am, function (event) {
                var scene;
                switch (event.getEventCode()) {
                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                        cc.log("No local manifest file found, skip assets update.");
                        that.clickMeShowTempLayer();
                        break;
                    case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                        cc.log(event.getPercent() + "%");
                        break;
                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                        cc.log("Fail to download manifest file, update skipped.");
                        that.clickMeShowTempLayer();
                        break;
                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                    case jsb.EventAssetsManager.UPDATE_FINISHED:
                        cc.log("Update finished. " + event.getMessage());
                        require(tempJSFileName);
                        that.clickMeShowTempLayer();
                        break;
                    case jsb.EventAssetsManager.UPDATE_FAILED:
                        cc.log("Update failed. " + event.getMessage());
                        break;
                    case jsb.EventAssetsManager.ERROR_UPDATING:
                        cc.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
                        break;
                    case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                        cc.log(event.getMessage());
                        break;
                    default:
                        break;
                }
            });
            cc.eventManager.addListener(listener, 1);
            this._am.update();
        }
    }
    clickMeShowTempLayer() {
        this.removeChildByTag(233, true);
        this._tempLayer = new ScriptTestTempLayer();
        this.addChild(this._tempLayer, 0, 233);
    }
    clickMeReloadTempLayer(){
        cc.sys.cleanScript(tempJSFileName);
        if (!cc.sys.isNative){
            this.clickMeShowTempLayer();
        }else{
            this.startDownload();
        }

    }
    onExit() {
        if (this._am)
        {
            this._am = null;
        }

        super.onExit();
    }
    constructor() {
        super();

        this._tempLayer = null;

        this._am = null;

        var menu = new cc.Menu();
        menu.setPosition(cc.p(0, 0));
        menu.width = winSize.width;
        menu.height = winSize.height;
        this.addChild(menu, 1);
        var item1 = new cc.MenuItemLabel(new cc.LabelTTF("Click me show tempLayer", "Arial", 22), this.clickMeShowTempLayer, this);
        menu.addChild(item1);

        var item2 = new cc.MenuItemLabel(new cc.LabelTTF("Click me reload tempLayer", "Arial", 22), this.clickMeReloadTempLayer, this);
        menu.addChild(item2);

        menu.alignItemsVerticallyWithPadding(8);
        menu.setPosition(cc.pAdd(cc.visibleRect.left, cc.p(+180, 0)));
    }

    getTitle() {
        return "ScriptTest only used in native";
    }


};

//------------------------------------------------------------------
//
// Restart game test
//
//------------------------------------------------------------------
var RestartGameLayerTest = class RestartGameLayerTest extends SysTestBase {
    getTitle() {
        return "RestartGameTest only used in native";
    }
    restartGame()
    {
        cc.game.restart();
    }
    constructor() {
        super();
        var menu = new cc.Menu();
        menu.setPosition(cc.p(0, 0));
        menu.width = winSize.width;
        menu.height = winSize.height;
        this.addChild(menu, 1);
        var item1 = new cc.MenuItemLabel(new cc.LabelTTF("restartGame", "Arial", 22), this.restartGame, this);
        menu.addChild(item1);
        menu.setPosition(cc.pAdd(cc.visibleRect.left, cc.p(+180, 0)));
    }

};

var OpenURLTest = class OpenURLTest extends SysTestBase {
    getTitle(){
        return "Open URL Test";
    }

    constructor(){
        super();
        
        var label = new cc.LabelTTF("Touch the screen to open\nthe cocos2d-x home page", "Arial", 22);
        this.addChild(label);
        label.setPosition(cc.winSize.width/2, cc.winSize.height/2);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){
                return true;
            },
            onTouchEnded: function(){
                cc.sys.openURL("http://www.cocos2d-x.org/");
            }
        }, this);

    }

};

//
// Flow control
//

var arrayOfSysTest = [
    LocalStorageTest,
    CapabilitiesTest,
    OpenURLTest,
    setClearColorTest
];

if (cc.sys.isNative && cc.sys.OS_WINDOWS != cc.sys.os) {
    arrayOfSysTest.push(ScriptTestLayer);
    arrayOfSysTest.push(RestartGameLayerTest);
}

var nextSysTest = function () {
    sysTestSceneIdx++;
    sysTestSceneIdx = sysTestSceneIdx % arrayOfSysTest.length;

    return new arrayOfSysTest[sysTestSceneIdx]();
};
var previousSysTest = function () {
    sysTestSceneIdx--;
    if (sysTestSceneIdx < 0)
        sysTestSceneIdx += arrayOfSysTest.length;

    return new arrayOfSysTest[sysTestSceneIdx]();
};
var restartSysTest = function () {
    return new arrayOfSysTest[sysTestSceneIdx]();
};

