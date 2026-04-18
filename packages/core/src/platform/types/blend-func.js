/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
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

import { defineGetterSetter } from '../class';

/**
 * Blend Function used for textures
 * @Class BlendFunc
 * @Constructor
 * @param {Number} src1 source blend function
 * @param {Number} dst1 destination blend function
 */
export var BlendFunc = function (src1, dst1) {
    this.src = src1;
    this.dst = dst1;
};

/**
 * @function
 * @returns {BlendFunc}
 */
export function blendFuncDisable() {
    return new BlendFunc(cc.ONE, cc.ZERO);
}

BlendFunc._disable = function(){
    return new BlendFunc(cc.ONE, cc.ZERO);
};
BlendFunc._alphaPremultiplied = function(){
    return new BlendFunc(cc.ONE, cc.ONE_MINUS_SRC_ALPHA);
};
BlendFunc._alphaNonPremultiplied = function(){
    return new BlendFunc(cc.SRC_ALPHA, cc.ONE_MINUS_SRC_ALPHA);
};
BlendFunc._additive = function(){
    return new BlendFunc(cc.SRC_ALPHA, cc.ONE);
};

/** @expose */
BlendFunc.DISABLE;
defineGetterSetter(BlendFunc, "DISABLE", BlendFunc._disable);
/** @expose */
BlendFunc.ALPHA_PREMULTIPLIED;
defineGetterSetter(BlendFunc, "ALPHA_PREMULTIPLIED", BlendFunc._alphaPremultiplied);
/** @expose */
BlendFunc.ALPHA_NON_PREMULTIPLIED;
defineGetterSetter(BlendFunc, "ALPHA_NON_PREMULTIPLIED", BlendFunc._alphaNonPremultiplied);
/** @expose */
BlendFunc.ADDITIVE;
defineGetterSetter(BlendFunc, "ADDITIVE", BlendFunc._additive);
