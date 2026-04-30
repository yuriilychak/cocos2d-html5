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

import { runCCPoolTest } from "./CCPoolTest/ccpool-test-helpers.js";
import { ControlSceneManager } from "./ControlExtensionTest/CCControlSceneManager.js";
import { runEditBoxTest } from "./EditBoxTest/EditBoxTest.js";
import { runSocketIOTest } from "./NetworkTest/SocketIOTest_simple.js";
import { runWebSocketTest } from "./NetworkTest/WebSocketTest.js";
import { runTableViewTest } from "./TableViewTest/table-view-test-scene-helpers.js";

export var LINE_SPACE = 40;

export var ITEM_TAG_BASIC = 1000;

export var TEST_NOTIFICATIONCENTER = 0;

export var TEST_CCCONTROLBUTTON = 1;

export var TEST_COCOSBUILDER = 2;

export var TEST_HTTPCLIENT = 3;

export var extensionsTestItemNames = [
    {
        itemTitle:"CCControlButtonTest",
        testScene:function () {
            var pManager = ControlSceneManager.getInstance();
            var pScene = pManager.currentControlScene();
	        cc.director.runScene(pScene);
        }
    },
    {
        itemTitle:"TableViewTest",
        testScene:function () {
            runTableViewTest();
        }
    },
    {
        itemTitle:"WebSocketTest",
        testScene:function () {
            runWebSocketTest();
        }
    },
    {
        itemTitle:"SocketIOTest",
        testScene:function () {
            runSocketIOTest();
        }
    },
    {
        itemTitle:"CCPoolTest",
        testScene:function () {
            runCCPoolTest();
        }
    }
];

if (!cc.sys.isNative || cc.sys.OS_LINUX !== cc.sys.os){
    extensionsTestItemNames.push({
        itemTitle:"EditBoxTest",
        testScene:function () {
            runEditBoxTest();
        }
    });
}
