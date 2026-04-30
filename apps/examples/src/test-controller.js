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

import { s_pathClose } from "./tests_resources.js";
import { PLATFORM_HTML5, PLATFORM_HTML5_WEBGL, PLATFORM_JSB, PLATFORM_MAC, PLATFROM_ANDROID, PLATFROM_IOS, _setAutoTestCurrentTestName, _setAutoTestEnabled, autoTestEnabled, director, winSize } from "./tests-main-constants.js";
import { LINE_SPACE, curPos, testNames } from "./tests-main-helpers.js";

export class TestController extends cc.LayerGradient {

    constructor() {
        super(new cc.Color(0,0,0,255), new cc.Color(0x46,0x82,0xB4,255));


        this._itemMenu = null;


        this._beginPos = 0;


        this.isMouseDown = false;

        var winSizeLocal = cc.director.getWinSize();

        // add close menu
        var closeItem = new cc.MenuItemImage(s_pathClose, s_pathClose, this.onCloseCallback, this);
        closeItem.x = winSizeLocal.width - 30;
        closeItem.y = winSizeLocal.height - 30;

        var subItem1 = new cc.MenuItemFont("Automated Test: Off");
        subItem1.fontSize = 18;
        var subItem2 = new cc.MenuItemFont("Automated Test: On");
        subItem2.fontSize = 18;

        var toggleAutoTestItem = new cc.MenuItemToggle(subItem1, subItem2);
        toggleAutoTestItem.setCallback(this.onToggleAutoTest, this);
        toggleAutoTestItem.x = winSize.width - toggleAutoTestItem.width / 2 - 10;
        toggleAutoTestItem.y = 20;
        toggleAutoTestItem.setVisible(false);
        if( autoTestEnabled )
            toggleAutoTestItem.setSelectedIndex(1);


        var menu = new cc.Menu(closeItem, toggleAutoTestItem);//pmenu is just a holder for the close button
        menu.x = 0;
        menu.y = 0;

        // sort the test title
        testNames.sort(function(first, second){
            if (first.title > second.title)
            {
                return 1;
            }
            return -1;
        });

        // add menu items for tests
        this._itemMenu = new cc.Menu();//item menu is where all the label goes, and the one gets scrolled

        for (var i = 0, len = testNames.length; i < len; i++) {
            var label = new cc.LabelTTF((i + 1) +". "+ testNames[i].title, "Arial", 24);
            var menuItem = new cc.MenuItemLabel(label, this.onMenuCallback, this);
            this._itemMenu.addChild(menuItem, i + 10000);
            menuItem.x = winSize.width / 2;
            menuItem.y = (winSize.height - (i + 1) * LINE_SPACE);

            // enable disable
            if ( !cc.sys.isNative) {
                if( !cc.rendererConfig.isCanvas ){
                    menuItem.enabled = (testNames[i].platforms & PLATFORM_HTML5) | (testNames[i].platforms & PLATFORM_HTML5_WEBGL);
                }else{
                    menuItem.setEnabled( testNames[i].platforms & PLATFORM_HTML5 );
                }
            } else {
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    menuItem.setEnabled( testNames[i].platforms & ( PLATFORM_JSB | PLATFROM_ANDROID ) );
                } else if (cc.sys.os == cc.sys.OS_IOS) {
                    menuItem.setEnabled( testNames[i].platforms & ( PLATFORM_JSB | PLATFROM_IOS) );
                } else if (cc.sys.os == cc.sys.OS_OSX) {
                    menuItem.setEnabled( testNames[i].platforms & ( PLATFORM_JSB | PLATFORM_MAC) );
                } else {
                    menuItem.setEnabled( testNames[i].platforms & PLATFORM_JSB );
                }
            }
        }

        this._itemMenu.width = winSize.width;
        this._itemMenu.height = (testNames.length + 1) * LINE_SPACE;
        this._itemMenu.x = curPos.x;
        this._itemMenu.y = curPos.y;
        this.addChild(this._itemMenu);
        this.addChild(menu, 1);

        // 'browser' can use touches or mouse.
        // The benefit of using 'touches' in a browser, is that it works both with mouse events or touches events
        if ('touches' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved: function (touches, event) {
                    var target = event.getCurrentTarget();
                    var delta = touches[0].getDelta();
                    target.moveMenu(delta);
                    return true;
                }
            }, this);
        }
        else if ('mouse' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function (event) {
                    if(event.getButton() == cc.EventMouse.BUTTON_LEFT)
                        event.getCurrentTarget().moveMenu(event.getDelta());
                },
                onMouseScroll: function (event) {
                    var delta = cc.sys.isNative ? event.getScrollY() * 6 : -event.getScrollY();
                    event.getCurrentTarget().moveMenu({y : delta});
                    return true;
                }
            }, this);
        }
    }
    onEnter(){
        super.onEnter();
	    this._itemMenu.y = TestController.YOffset;
    }
    onMenuCallback(sender) {
        TestController.YOffset = this._itemMenu.y;
        var idx = sender.getLocalZOrder() - 10000;
        // get the userdata, it's the index of the menu item clicked
        // create the test scene and run it

        _setAutoTestCurrentTestName(testNames[idx].title);

        var testCase = testNames[idx];
        var res = testCase.resource || [];
        cc.LoaderScene.preload(res, function () {
            var scene = testCase.testScene();
            if (scene) {
                scene.runThisTest();
            }
        }, this);
    }
    onCloseCallback() {
        if (cc.sys.isNative)
        {
            cc.game.end();
        }
        else {
            window.history && window.history.go(-1);
        }
    }
    onToggleAutoTest() {
        _setAutoTestEnabled(!autoTestEnabled);
    }

    moveMenu(delta) {
        var newY = this._itemMenu.y + delta.y;
        if (newY < 0 )
            newY = 0;

        if( newY > ((testNames.length + 1) * LINE_SPACE - winSize.height))
            newY = ((testNames.length + 1) * LINE_SPACE - winSize.height);

        this._itemMenu.y = newY;
    }

}
