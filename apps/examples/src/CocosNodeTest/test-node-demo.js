/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 Copyright (c) 2008-2009 Jason Booth

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

import { nodeTestSceneIdx } from "./cocos-node-test-constants";
import {
  arrayOfNodeTest,
  nextNodeTest,
  previousNodeTest,
  restartNodeTest
} from "./cocos-node-test-helpers";
import { NodeTestScene } from "./node-test-scene";
import { director } from "../constants";
import { Layer } from "@aspect/core";

export class TestNodeDemo extends Layer {
  constructor() {
    super();
    this.init();
  }
  title() {
    return "No title";
  }
  subtitle() {
    return "";
  }
  onRestartCallback(sender) {
    var s = new NodeTestScene();
    s.addChild(restartNodeTest());
    director.runScene(s);
  }
  onNextCallback(sender) {
    var s = new NodeTestScene();
    s.addChild(nextNodeTest());
    director.runScene(s);
  }
  onBackCallback(sender) {
    var s = new NodeTestScene();
    s.addChild(previousNodeTest());
    director.runScene(s);
  }
  // automation
  numberOfPendingTests() {
    return arrayOfNodeTest.length - 1 - nodeTestSceneIdx;
  }
  getTestNumber() {
    return nodeTestSceneIdx;
  }
  onEnter() {
    super.onEnter();
    let scene = this.parent;
    while (scene && !scene.setTestInfo) {
      scene = scene.parent;
    }
    if (scene) {
      scene.setTestInfo(this.title(), this.subtitle());
      scene.setNavCallbacks(
        () => this.onBackCallback(),
        () => this.onRestartCallback(),
        () => this.onNextCallback()
      );
    }
  }
}
