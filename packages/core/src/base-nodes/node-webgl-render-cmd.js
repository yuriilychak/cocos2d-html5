/****************************************************************************
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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
import { RenderCmd } from './node-canvas-render-cmd';

// ------------------------------ The ode's render command for WebGL ----------------------------------
export class WebGLRenderCmd extends RenderCmd {
    constructor(renderable) {
        super(renderable);
        this._glProgramState = null;
    }

    _updateColor() {
    }

    setShaderProgram(shaderProgram) {
        this._glProgramState = cc.GLProgramState.getOrCreateWithGLProgram(shaderProgram);
    }

    getShaderProgram() {
        return this._glProgramState ? this._glProgramState.getGLProgram() : null;
    }

    getGLProgramState() {
        return this._glProgramState;
    }

    setGLProgramState(glProgramState) {
        this._glProgramState = glProgramState;
    }

    // Use a property getter/setter for backwards compatability, and
    // to ease the transition from using glPrograms directly, to
    // using glProgramStates.
    set _shaderProgram(value) { this.setShaderProgram(value); }
    get _shaderProgram() { return this.getShaderProgram(); }
}


