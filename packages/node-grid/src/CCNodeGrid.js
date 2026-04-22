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
 * <p>NodeGrid class is a class serves as a decorator of cc.Node,<br/>
 * Grid node can run grid actions over all its children   (WebGL only)
 * </p>
 * @type {Class}
 *
 * @property {cc.GridBase}  grid    - Grid object that is used when applying effects
 * @property {cc.Node}      target  - <@writeonly>Target
 */
cc.NodeGrid = class NodeGrid extends cc.Node {
    grid = null;
    _target = null;
    _gridRect = null;

    constructor(rect) {
        super();
        if(rect === undefined) rect = cc.rect();
        this._gridRect = rect;
    }

    set target(v) { this.setTarget(v); }

    /**
     * Gets the grid object.
     * @returns {cc.GridBase}
     */
    getGrid() {
        return this.grid;
    }

    /**
     * Set the grid object.
     * @param {cc.GridBase} grid
     */
    setGrid(grid) {
        this.grid = grid;
    }

    /**
     * @brief Set the effect grid rect.
     * @param {cc.Rect} rect
     */
    setGridRect(rect) {
        this._gridRect = rect;
    }

    /**
     * @brief Get the effect grid rect.
     * @return {cc.Rect} rect.
    */
    getGridRect() {
        return this._gridRect;
    }

    /**
     * Set the target
     * @param {cc.Node} target
     */
    setTarget(target) {
        this._target = target;
    }

    /**
     * Override visit to delegate entirely to the render command.
     * NodeGrid.WebGLRenderCmd.visit() handles children traversal with
     * grid begin/end wrapping — cc.Node.visit() must not re-traverse children.
     */
    visit(parent) {
        var cmd = this._renderCmd;
        var parentCmd = parent ? parent._renderCmd : null;
        if (!this._visible) {
            cmd._propagateFlagsDown(parentCmd);
            return;
        }
        cmd.visit(parentCmd);
        cmd._dirtyFlag = 0;
    }

    _createRenderCmd() {
        if (cc.rendererConfig.isWebGL)
            return new cc.NodeGrid.WebGLRenderCmd(this);
        else
            return new cc.Node.CanvasRenderCmd(this);            // cc.NodeGrid doesn't support Canvas mode.
    }
};



