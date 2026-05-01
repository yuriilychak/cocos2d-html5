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

//
// BoundingBox Test
//
import { TestNodeDemo } from "./test-node-demo";
import { s_pathGrossini } from "../resources";
import { winSize } from "../constants";

export class BoundingBoxTest extends TestNodeDemo {
  constructor() {
    //----start8----ctor
    super();

    this.testDuration = 0.5;

    this.testBB = null;
    var sprite = new cc.Sprite(s_pathGrossini);
    this.addChild(sprite);
    sprite.x = winSize.width / 2;
    sprite.y = winSize.height / 2;
    var bb = sprite.getBoundingBox();
    cc.log("BoundingBox:");
    //for( var i in bb )
    //    cc.log( i + " = " + bb[i] );
    cc.log("origin = [ " + bb.x + "," + bb.y + "]");
    cc.log("size = [ " + bb.width + "," + bb.height + "]");

    this.testBB = bb;
    //----end8----
  }
  title() {
    return "Bounding Box Test";
  }
  subtitle() {
    return "Testing getBoundingBox(). See console";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = {
      x: 0 | (winSize.width / 2 - 42.5),
      y: 0 | (winSize.height / 2 - 60.5),
      w: 85,
      h: 121
    };
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret = {
      x: 0 | this.testBB.x,
      y: 0 | this.testBB.y,
      w: this.testBB.width,
      h: this.testBB.height
    };
    return JSON.stringify(ret);
  }
}
