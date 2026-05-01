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

//------------------------------------------------------------------
//
// ActionManagerTest
//
//------------------------------------------------------------------
import { ActionMgrTestIdx } from "./constants";
import {
  arrayOfActionMgrTest,
  nextActionMgrTest,
  previousActionMgrTest,
  restartActionMgrTest
} from "./utils";
import { ActionManagerTestScene } from "./action-manager-test-scene";
import { BaseTestLayer } from "../BaseTestLayer/BaseTestLayer";
import { director } from "../constants";

export class ActionManagerTest extends BaseTestLayer {
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
    var s = new ActionManagerTestScene();
    s.addChild(previousActionMgrTest());
    director.runScene(s);
  }
  onRestartCallback(sender) {
    var s = new ActionManagerTestScene();
    s.addChild(restartActionMgrTest());
    director.runScene(s);
  }
  onNextCallback(sender) {
    var s = new ActionManagerTestScene();
    s.addChild(nextActionMgrTest());
    director.runScene(s);
  }
  // automation
  numberOfPendingTests() {
    return arrayOfActionMgrTest.length - 1 - ActionMgrTestIdx;
  }

  getTestNumber() {
    return ActionMgrTestIdx;
  }
}
