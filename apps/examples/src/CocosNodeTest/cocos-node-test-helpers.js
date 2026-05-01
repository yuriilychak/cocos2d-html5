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

import { BoundingBoxTest } from "./bounding-box-test";
import { CCNodeTest2 } from "./ccnode-test2";
import { CCNodeTest4 } from "./ccnode-test4";
import { CCNodeTest5 } from "./ccnode-test5";
import { CCNodeTest6 } from "./ccnode-test6";
import {
  nodeTestSceneIdx,
  _setnodeTestSceneIdx
} from "./cocos-node-test-constants";
import { ConvertToNode } from "./convert-to-node";
import { NodeNonOpaqueTest } from "./node-non-opaque-test";
import { NodeOpaqueTest } from "./node-opaque-test";
import { NodeToWorld } from "./node-to-world";
import { SchedulerTest1 } from "./scheduler-test1";
import { StressTest1 } from "./stress-test1";
import { StressTest2 } from "./stress-test2";

export var SID_DELAY2 = 1;

export var SID_DELAY4 = 2;

//
// Flow control
//
export var arrayOfNodeTest = [
  CCNodeTest2,
  CCNodeTest4,
  CCNodeTest5,
  CCNodeTest6,
  StressTest1,
  StressTest2,
  NodeToWorld,
  SchedulerTest1,
  BoundingBoxTest,
  ConvertToNode
];

if ("opengl" in cc.sys.capabilities) {
  arrayOfNodeTest.push(NodeOpaqueTest);
  arrayOfNodeTest.push(NodeNonOpaqueTest);
}

export function nextNodeTest() {
  _setnodeTestSceneIdx(nodeTestSceneIdx + 1);
  _setnodeTestSceneIdx(nodeTestSceneIdx % arrayOfNodeTest.length);

  if (window.sideIndexBar) {
    _setnodeTestSceneIdx(window.sideIndexBar.changeTest(nodeTestSceneIdx, 24));
  }

  return new arrayOfNodeTest[nodeTestSceneIdx]();
}

export function previousNodeTest() {
  _setnodeTestSceneIdx(nodeTestSceneIdx - 1);
  if (nodeTestSceneIdx < 0)
    _setnodeTestSceneIdx(nodeTestSceneIdx + arrayOfNodeTest.length);

  if (window.sideIndexBar) {
    _setnodeTestSceneIdx(window.sideIndexBar.changeTest(nodeTestSceneIdx, 24));
  }

  return new arrayOfNodeTest[nodeTestSceneIdx]();
}

export function restartNodeTest() {
  return new arrayOfNodeTest[nodeTestSceneIdx]();
}

new RegExp();
