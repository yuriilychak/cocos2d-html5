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

//------------------------------------------------------------------
//
// GLGetActiveTest
//
//------------------------------------------------------------------
import { OpenGLTestLayer } from "./open-gltest-layer";
import { winSize } from "../constants";

export class GLGetActiveTest extends OpenGLTestLayer {
  constructor() {
    super();

    if ("opengl" in cc.sys.capabilities) {
      var sprite = (this.sprite = new cc.Sprite("Images/grossini.png"));
      sprite.x = winSize.width / 2;
      sprite.y = winSize.height / 2;
      this.addChild(sprite);

      // after auto test
      this.scheduleOnce(this.onTest, 0.5);
    }
  }

  onTest(dt) {
    cc.log(this.getCurrentResult());
  }

  title() {
    return "gl.getActiveXXX Function Test";
  }
  subtitle() {
    return "Tests gl.getActiveUniform / getActiveAttrib. See console";
  }

  //
  // Automation
  //
  getExpectedResult() {
    // redish pixel
    var ret = [
      { size: 1, type: 35666, name: "a_position" },
      { size: 1, type: 35678, name: "CC_Texture" },
      [2, 3]
    ];
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var ret = [];
    var p = this.sprite.shaderProgram.getProgram();
    ret.push(gl.getActiveAttrib(p, 0));
    ret.push(gl.getActiveUniform(p, 0));
    return JSON.stringify(ret);
  }
}
