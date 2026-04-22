/****************************************************************************
 Copyright (c) 2017 Chukong Technologies Inc.

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

sp.SkeletonTexture = class SkeletonTexture extends sp.spine.Texture {
    name = 'sp.SkeletonTexture';
    _texture = null;

    constructor(image) {
        super(image);
    }

    setRealTexture(tex) {
        this._texture = tex;
    }

    getRealTexture() {
        return this._texture;
    }

    setFilters(minFilter, magFilter) {
        if (cc.rendererConfig.isWebGL) {
            var gl = cc.rendererConfig.renderContext;
            this.bind();
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        }
    }

    setWraps(uWrap, vWrap) {
        if (cc.rendererConfig.isWebGL) {
            var gl = cc.rendererConfig.renderContext;
            this.bind();
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, uWrap);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, vWrap);
        }
    }

    dispose() {
    }

    bind() {
        if (cc.rendererConfig.isWebGL) {
            cc.glBindTexture2D(this._texture);
        }
    }
};