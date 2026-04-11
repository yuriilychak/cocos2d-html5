/**
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2008, Luke Benstead.
 All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.
 Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

(function (cc) {
    /**
     * The stack of cc.math.Matrix4
     * @param {cc.math.Matrix4} [top]
     * @param {Array} [stack]
     */
    cc.math.Matrix4Stack = class Matrix4Stack {
        constructor(top, stack) {
            this.top = top;
            this.stack = stack || [];
            this.lastUpdated = 0;
            // this._matrixPool = []; // use pool in next version
        }

        initialize() {
            this.stack.length = 0;
            this.top = null;
            return this;
        }

        push(item) {
            item = item || this.top;
            this.stack.push(this.top);
            this.top = new cc.math.Matrix4(item);
        }

        pop() {
            this.top = this.stack.pop();
        }

        release() {
            this.stack = null;
            this.top = null;
            this._matrixPool = null;
        }

        _getFromPool(item) {
            const pool = this._matrixPool || [];
            if (pool.length === 0) return new cc.math.Matrix4(item);
            const ret = pool.pop();
            ret.assignFrom(item);
            return ret;
        }

        _putInPool(matrix) {
            this._matrixPool = this._matrixPool || [];
            this._matrixPool.push(matrix);
        }
    };

    cc.km_mat4_stack = cc.math.Matrix4Stack;

    // Compatibility wrappers
    cc.km_mat4_stack_push = function (stack, item) {
        stack.push(item);
    };

    cc.km_mat4_stack_pop = function (stack) {
        stack.pop();
    };

    cc.km_mat4_stack_release = function (stack) {
        stack.release();
    };
})(cc);
