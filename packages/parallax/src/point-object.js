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

import { NewClass } from "@aspect/core";

/**
 * Parallax Object. <br />
 * Parallax required attributes are stored.
 */
export class PointObject extends NewClass {
    _ratio = null;
    _offset = null;
    _child = null;

    constructor(ratio, offset) {
        super();
        this.initWithCCPoint(ratio, offset);
    }

    /**
     * Gets the ratio.
     * @return  {Point} Not point, this is ratio.
     */
    getRatio() {
        return this._ratio;
    }

    /**
     * Set the ratio.
     * @param  {Point} value
     */
    setRatio(value) {
        this._ratio = value;
    }

    /**
     * Gets the offset.
     * @return  {Point}
     */
    getOffset() {
        return this._offset;
    }

    /**
     * Set the offset.
     * @param {Point} value
     */
    setOffset(value) {
        this._offset = value;
    }

    /**
     * Gets the child.
     * @return {Node}
     */
    getChild() {
        return this._child;
    }

    /**
     * Set the child.
     * @param  {Node} value
     */
    setChild(value) {
        this._child = value;
    }

    /**
     * initializes PointObject
     * @param  {Point} ratio Not point, this is a ratio.
     * @param  {Point} offset
     * @return {Boolean}
     */
    initWithCCPoint(ratio, offset) {
        this._ratio = ratio;
        this._offset = offset;
        this._child = null;
        return true;
    }
}