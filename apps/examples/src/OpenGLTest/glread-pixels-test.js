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
// ReadPixelsTest
//
//------------------------------------------------------------------
export class GLReadPixelsTest extends OpenGLTestLayer {

    constructor() {
        super();

        if( 'opengl' in cc.sys.capabilities ) {
            var x = winSize.width;
            var y = winSize.height;

            var blue = new cc.LayerColor(new cc.Color(0, 0, 255, 255));
            var red = new cc.LayerColor(new cc.Color(255, 0, 0, 255));
            var green = new cc.LayerColor(new cc.Color(0, 255, 0, 255));
            var white = new cc.LayerColor(new cc.Color(255, 255, 255, 255));

            blue.scale = 0.5;
            blue.x = -x / 4;
            blue.y = -y / 4;

            red.scale = 0.5;
            red.x = x / 4;
            red.y = -y / 4;

            green.scale = 0.5;
            green.x = -x / 4;
            green.y = y / 4;

            white.scale = 0.5;
            white.x = x / 4;
            white.y = y / 4;

            this.addChild(blue,10);
            this.addChild(white,11);
            this.addChild(green,12);
            this.addChild(red,13);
        }
    }

    title() {
        return "gl.ReadPixels()";
    }
    subtitle() {
        return "Tests ReadPixels. See console";
    }

    //
    // Automation
    //
    getExpectedResult() {
        // red, green, blue, white
        var ret = [{"0":255,"1":0,"2":0,"3":255},{"0":0,"1":255,"2":0,"3":255},{"0":0,"1":0,"2":255,"3":255},{"0":255,"1":255,"2":255,"3":255}];
        return JSON.stringify(ret);
    }

    getCurrentResult() {
        var x = winSize.width;
        var y = winSize.height;

        var rPixels = new Uint8Array(4);
        var gPixels = new Uint8Array(4);
        var bPixels = new Uint8Array(4);
        var wPixels = new Uint8Array(4);

        // blue
        gl.readPixels(0,   0,   1, 1, gl.RGBA, gl.UNSIGNED_BYTE, bPixels);

        // red
        gl.readPixels(x-1, 0,   1, 1, gl.RGBA, gl.UNSIGNED_BYTE, rPixels);

        // green
        gl.readPixels(0,   y-1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, gPixels);

        // white
        gl.readPixels(x-1, y-1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, wPixels);

        var ret = [ rPixels, gPixels, bPixels, wPixels];
        return JSON.stringify(ret);
    }


}
