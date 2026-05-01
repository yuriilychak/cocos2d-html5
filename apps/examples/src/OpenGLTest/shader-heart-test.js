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
// ShaderHeartTest
//
//------------------------------------------------------------------
import { OpenGLTestLayer } from "./open-gltest-layer";
import { ShaderNode } from "./shader-node";
import { ccbjs } from "../resources";
import { winSize } from "../constants";

export class ShaderHeartTest extends OpenGLTestLayer {
    constructor() {
        super();

        if( 'opengl' in cc.sys.capabilities ) {
            var shaderNode = new ShaderNode(ccbjs + "Shaders/example_Heart.vsh", ccbjs + "Shaders/example_Heart.fsh");
            this.addChild(shaderNode,10);
            shaderNode.x = winSize.width/2;
            shaderNode.y = winSize.height/2;
        }
    }

    title() {
        return "Shader Heart Test";
    }
    subtitle() {
        return "You should see a heart in the center";
    }

    //
    // Automation
    //
    getExpectedResult() {
        // redish pixel
        var ret = {"0":255,"1":0,"2":0,"3":255};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret = this.readPixels(winSize.width/2, winSize.height/2,  1, 1);
        ret[0] = ret[0] > 240 ? 255 : 0;
        ret[3] = ret[3] > 240 ? 255 : 0;
        return JSON.stringify(ret);
    }

}
