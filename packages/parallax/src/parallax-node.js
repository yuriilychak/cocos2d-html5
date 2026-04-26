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

import { Node, Point, pointEqualToPoint, RendererConfig } from "@aspect/core";
import { PointObject } from "./point-object";

/**
 * <p>ParallaxNode: A node that simulates a parallax scroller<br />
 * The children will be moved faster / slower than the parent according the the parallax ratio. </p>
 *
 * @property {Array}    parallaxArray   - Parallax nodes array
 */
export class ParallaxNode extends Node {
    parallaxArray = null;

    _lastPosition = null;
    _className = "ParallaxNode";

    /**
     * Gets the parallax array.
     * @return {Array}
     */
    getParallaxArray() {
        return this.parallaxArray;
    }

    /**
     * Set parallax array.
     * @param {Array} value
     */
    setParallaxArray(value) {
        this.parallaxArray = value;
    }

    /**
     * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
     */
    constructor() {
        super();
        this.parallaxArray = [];
        this._lastPosition = new Point(-100, -100);
    }

    /**
     * Adds a child to the container with a z-order, a parallax ratio and a position offset
     * It returns self, so you can chain several addChilds.
     * @param {Node} child
     * @param {Number} z
     * @param {Point} ratio
     * @param {Point} offset
     * @example
     * //example
     * voidNode.addChild(background, -1, new Point(0.4, 0.5), new Point(0,0));
     */
    addChild(child, z, ratio, offset) {
        if (arguments.length === 3) {
            cc.log("ParallaxNode: use addChild(child, z, ratio, offset) instead");
            return;
        }
        if(!child)
            throw new Error("ParallaxNode.addChild(): child should be non-null");
        var obj = new PointObject(ratio, offset);
        obj.setChild(child);
        this.parallaxArray.push(obj);

        child.setPosition(this._position.x * ratio.x + offset.x, this._position.y * ratio.y + offset.y);

        super.addChild(child, z, child.tag);
    }

    /**
     *  Remove Child
     * @param {Node} child
     * @param {Boolean} cleanup
     * @example
     * //example
     * voidNode.removeChild(background,true);
     */
    removeChild(child, cleanup) {
        var locParallaxArray = this.parallaxArray;
        for (var i = 0; i < locParallaxArray.length; i++) {
            var point = locParallaxArray[i];
            if (point.getChild() === child) {
                locParallaxArray.splice(i, 1);
                break;
            }
        }
        super.removeChild(child, cleanup);
    }

    /**
     *  Remove all children with cleanup
     * @param {Boolean} [cleanup=true]
     */
    removeAllChildren(cleanup) {
        this.parallaxArray.length = 0;
        super.removeAllChildren(cleanup);
    }

    _updateParallaxPosition() {
        var pos = this._absolutePosition();
        if (!pointEqualToPoint(pos, this._lastPosition)) {
            var locParallaxArray = this.parallaxArray;
            for (var i = 0, len = locParallaxArray.length; i < len; i++) {
                var point = locParallaxArray[i];
                var child = point.getChild();
                child.setPosition(-pos.x + pos.x * point.getRatio().x + point.getOffset().x,
                        -pos.y + pos.y * point.getRatio().y + point.getOffset().y);
            }
            this._lastPosition = pos;
        }
    }

    _absolutePosition() {
        var ret = this._position;
        var cn = this;
        while (cn.parent !== null) {
            cn = cn.parent;
            ret = Point.add(ret, cn.getPosition());
        }
        return ret;
    }

    _createRenderCmd() {
        if(RendererConfig.getInstance().isCanvas)
            return new this.constructor.CanvasRenderCmd(this);
        else
            return new this.constructor.WebGLRenderCmd(this);
    }
}