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

/**
 * Parallax Object. <br />
 * Parallax required attributes are stored.
 */
cc.PointObject = class PointObject extends cc.NewClass {
    _ratio = null;
    _offset = null;
    _child = null;

    constructor(ratio, offset) {
        super();
        this.initWithCCPoint(ratio, offset);
    }

    /**
     * Gets the ratio.
     * @return  {cc.Point} Not point, this is ratio.
     */
    getRatio() {
        return this._ratio;
    }

    /**
     * Set the ratio.
     * @param  {cc.Point} value
     */
    setRatio(value) {
        this._ratio = value;
    }

    /**
     * Gets the offset.
     * @return  {cc.Point}
     */
    getOffset() {
        return this._offset;
    }

    /**
     * Set the offset.
     * @param {cc.Point} value
     */
    setOffset(value) {
        this._offset = value;
    }

    /**
     * Gets the child.
     * @return {cc.Node}
     */
    getChild() {
        return this._child;
    }

    /**
     * Set the child.
     * @param  {cc.Node} value
     */
    setChild(value) {
        this._child = value;
    }

    /**
     * initializes cc.PointObject
     * @param  {cc.Point} ratio Not point, this is a ratio.
     * @param  {cc.Point} offset
     * @return {Boolean}
     */
    initWithCCPoint(ratio, offset) {
        this._ratio = ratio;
        this._offset = offset;
        this._child = null;
        return true;
    }
};


/**
 * <p>cc.ParallaxNode: A node that simulates a parallax scroller<br />
 * The children will be moved faster / slower than the parent according the the parallax ratio. </p>
 *
 * @property {Array}    parallaxArray   - Parallax nodes array
 */
cc.ParallaxNode = class ParallaxNode extends cc.Node {
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
        this._lastPosition = cc.p(-100, -100);
    }

    /**
     * Adds a child to the container with a z-order, a parallax ratio and a position offset
     * It returns self, so you can chain several addChilds.
     * @param {cc.Node} child
     * @param {Number} z
     * @param {cc.Point} ratio
     * @param {cc.Point} offset
     * @example
     * //example
     * voidNode.addChild(background, -1, cc.p(0.4, 0.5), cc.p(0,0));
     */
    addChild(child, z, ratio, offset) {
        if (arguments.length === 3) {
            cc.log("ParallaxNode: use addChild(child, z, ratio, offset) instead");
            return;
        }
        if(!child)
            throw new Error("cc.ParallaxNode.addChild(): child should be non-null");
        var obj = new cc.PointObject(ratio, offset);
        obj.setChild(child);
        this.parallaxArray.push(obj);

	    child.setPosition(this._position.x * ratio.x + offset.x, this._position.y * ratio.y + offset.y);

        super.addChild(child, z, child.tag);
    }

    /**
     *  Remove Child
     * @param {cc.Node} child
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
        if (!cc.pointEqualToPoint(pos, this._lastPosition)) {
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
            ret = cc.pAdd(ret, cn.getPosition());
        }
        return ret;
    }

    _createRenderCmd() {
        if(cc.rendererConfig.isCanvas)
            return new cc.ParallaxNode.CanvasRenderCmd(this);
        else
            return new cc.ParallaxNode.WebGLRenderCmd(this);
    }
};

