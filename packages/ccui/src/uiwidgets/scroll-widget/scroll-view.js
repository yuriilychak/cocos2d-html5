/****************************************************************************
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

import { Point, Color, Size, RendererConfig, log, assert } from '@aspect/core';
import { Layout } from '../../layouts/layout';
import { Widget } from '../../base-classes/widget';
import { ScrollViewBar } from './scroll-view-bar';
import { ScrollViewCanvasRenderCmd } from './scroll-view-canvas-render-cmd';
import { ScrollViewWebGLRenderCmd } from './scroll-view-webgl-render-cmd';

/**
 * The ScrollView control of Cocos UI
 *
 * @property {Number}               innerWidth              - Inner container width of the scroll view
 * @property {Number}               innerHeight             - Inner container height of the scroll view
 * @property {ScrollView.DIR_NONE | ScrollView.DIR_VERTICAL | ScrollView.DIR_HORIZONTAL | ScrollView.DIR_BOTH}    direction               - Scroll direction of the scroll view
 * @property {Boolean}              bounceEnabled           - Indicate whether bounce is enabled
 * @property {Boolean}              inertiaScrollEnabled    - Indicate whether inertiaScroll is enabled
 * @property {Number}               touchTotalTimeThreshold - Touch total time threshold
 */
export class ScrollView extends Layout {
    _direction = null;

    _topBoundary = 0;
    _bottomBoundary = 0;
    _leftBoundary = 0;
    _rightBoundary = 0;

    _touchMoveDisplacements = null;
    _touchMoveTimeDeltas = null;
    _touchMovePreviousTimestamp = 0;
    _touchTotalTimeThreshold = 0.5;

    _autoScrolling = false;
    _autoScrollTargetDelta = null;
    _autoScrollAttenuate = true;
    _autoScrollStartPosition = null;
    _autoScrollTotalTime = 0;
    _autoScrollAccumulatedTime = 0;
    _autoScrollCurrentlyOutOfBoundary = false;
    _autoScrollBraking = false;
    _autoScrollBrakingStartPosition = null;

    _bePressed = false;

    _childFocusCancelOffset = 0;

    bounceEnabled = false;

    _outOfBoundaryAmount = null;
    _outOfBoundaryAmountDirty = true;

    inertiaScrollEnabled = false;

    _scrollBarEnabled = true;
    _verticalScrollBar = null;
    _horizontalScrollBar = null;

    _scrollViewEventListener = null;
    _scrollViewEventSelector = null;
    _className = "ScrollView";

    /**
     * Allocates and initializes a UIScrollView.
     * Constructor of ScrollView. override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
     * @example
     * // example
     * var uiScrollView = new ScrollView();
     */
    constructor() {
        super();

        this._direction = ScrollView.DIR_NONE;

        this._childFocusCancelOffset = 5;
        this.inertiaScrollEnabled = true;

        this._outOfBoundaryAmount = new Point(0, 0);
        this._autoScrollTargetDelta = new Point(0, 0);
        this._autoScrollStartPosition = new Point(0, 0);
        this._autoScrollBrakingStartPosition = new Point(0, 0);
        this._touchMoveDisplacements = [];
        this._touchMoveTimeDeltas = [];
        this._touchMovePreviousTimestamp = 0;

        this._scrollBarEnabled = true;
        this._initScrollBar();

        this.setTouchEnabled(true);
    }

    get innerWidth() { return this._getInnerWidth(); }
    set innerWidth(v) { this._setInnerWidth(v); }

    get innerHeight() { return this._getInnerHeight(); }
    set innerHeight(v) { this._setInnerHeight(v); }

    get direction() { return this.getDirection(); }
    set direction(v) { this.setDirection(v); }

    get touchTotalTimeThreshold() { return this.getTouchTotalTimeThreshold(); }
    set touchTotalTimeThreshold(v) { this.setTouchTotalTimeThreshold(v); }


    /**
     * Calls the parent class' onEnter and schedules update function.
     * @override
     */
    onEnter() {
        super.onEnter();
        this.scheduleUpdate();
    }

    onExit() {
        RendererConfig.getInstance().renderer._removeCache(this.__instanceId);
        super.onExit();
    }

    visit(parent) {
        var cmd = this._renderCmd, parentCmd = parent ? parent._renderCmd : null;

        // quick return if not visible
        if (!this._visible) {
            cmd._propagateFlagsDown(parentCmd);
            return;
        }

        this._adaptRenderers();
        this._doLayout();

        var renderer = RendererConfig.getInstance().renderer;
        cmd.visit(parentCmd);

        renderer.pushRenderCommand(cmd);
        if (cmd instanceof ScrollViewWebGLRenderCmd) {
            var currentID = this.__instanceId;
            renderer._turnToCacheMode(currentID);
        }

        var stencilClipping = this._clippingEnabled && this._clippingType === Layout.CLIPPING_STENCIL;
        var scissorClipping = this._clippingEnabled && this._clippingType === Layout.CLIPPING_SCISSOR;

        if (stencilClipping) {
            cmd.stencilClippingVisit(parentCmd);
        }
        else if (scissorClipping) {
            cmd.scissorClippingVisit(parentCmd);
        }

        var i, children = this._children, len = children.length, child;
        var j, pChildren = this._protectedChildren, pLen = pChildren.length, pChild;

        if (this._reorderChildDirty) this.sortAllChildren();
        if (this._reorderProtectedChildDirty) this.sortAllProtectedChildren();
        for (i = 0; i < len; i++) {
            child = children[i];
            if (child && child._visible) {
                child.visit(this);
            }
        }
        for (j = 0; j < pLen; j++) {
            pChild = pChildren[j];
            if (pChild && pChild._visible) {
                cmd._changeProtectedChild(pChild);
                pChild.visit(this);
            }
        }

        if (stencilClipping) {
            cmd.postStencilVisit();
        }
        else if (scissorClipping) {
            cmd.postScissorVisit();
        }

        if (cmd instanceof ScrollViewWebGLRenderCmd) {
            renderer._turnToNormalMode();
        }

        // Need to update children after do layout
        this.updateChildren();

        cmd._dirtyFlag = 0;
    }

    /**
     * When a widget is in a layout, you could call this method to get the next focused widget within a specified _direction.             <br/>
     * If the widget is not in a layout, it will return itself
     *
     * @param {Number} _direction the _direction to look for the next focused widget in a layout
     * @param {Widget} current the current focused widget
     * @returns {Widget}
     */
    findNextFocusedWidget(direction, current) {
        if (this.getLayoutType() === Layout.LINEAR_VERTICAL
            || this.getLayoutType() === Layout.LINEAR_HORIZONTAL) {
            return this._innerContainer.findNextFocusedWidget(direction, current);
        } else
            return Widget.prototype.findNextFocusedWidget.call(this, direction, current);
    }

    _initRenderer() {
        super._initRenderer();

        this._innerContainer = new Layout();
        this._innerContainer.setColor(new Color(255, 255, 255));
        this._innerContainer.setOpacity(255);
        this._innerContainer.setCascadeColorEnabled(true);
        this._innerContainer.setCascadeOpacityEnabled(true);
        this._innerContainer.setTouchEnabled(false);

        this.addProtectedChild(this._innerContainer, 1, 1);

        this.setClippingEnabled(true);
    }

    _createRenderCmd() {
        if (RendererConfig.getInstance().isWebGL)
            return new ScrollViewWebGLRenderCmd(this);
        else
            return new ScrollViewCanvasRenderCmd(this);
    }

    _onSizeChanged() {
        super._onSizeChanged();
        var locSize = this._contentSize;
        this._topBoundary = locSize.height;
        this._rightBoundary = locSize.width;
        var innerSize = this._innerContainer.getContentSize();
        this._innerContainer.setContentSize(new Size(Math.max(innerSize.width, locSize.width), Math.max(innerSize.height, locSize.height)));
        this._innerContainer.setPosition(0, locSize.height - this._innerContainer.getContentSize().height);

        if(this._verticalScrollBar)
            this._verticalScrollBar.onScrolled(this._getHowMuchOutOfBoundary());

        if(this._horizontalScrollBar)
            this._horizontalScrollBar.onScrolled(this._getHowMuchOutOfBoundary());
    }

    /**
     * Changes inner container size of ScrollView.     <br/>
     * Inner container size must be larger than or equal the size of ScrollView.
     * @param {cc.Size} size inner container size.
     */
    setInnerContainerSize(size) {
         var innerContainer = this._innerContainer,
            locSize = this._contentSize,
            innerSizeWidth = locSize.width, innerSizeHeight = locSize.height;

        if (size.width < locSize.width)
            log("Inner width <= ScrollView width, it will be force sized!");
        else
            innerSizeWidth = size.width;

        if (size.height < locSize.height)
            log("Inner height <= ScrollView height, it will be force sized!");
        else
            innerSizeHeight = size.height;

        innerContainer.setContentSize(new Size(innerSizeWidth, innerSizeHeight));

        var pos = this._innerContainer.getPosition();
        var contAP = this._innerContainer.getAnchorPoint();

        if (this._innerContainer.getLeftBoundary() != 0.0)
        {
            pos.x = contAP.x * innerSizeWidth;
        }
        if (this._innerContainer.getTopBoundary() != this._contentSize.height)
        {
            pos.y = this._contentSize.height - (1.0 - contAP.y) * innerSizeHeight;
        }
        this.setInnerContainerPosition(pos);

        this._updateScrollBar(new Point(0 ,0));
    }

    _setInnerWidth(width) {
        var locW = this._contentSize.width,
            innerWidth = locW,
            container = this._innerContainer,
            oldInnerWidth = container.width;
        if (width < locW)
            log("Inner width <= scrollview width, it will be force sized!");
        else
            innerWidth = width;
        container.width = innerWidth;

        switch (this._direction) {
            case ScrollView.DIR_HORIZONTAL:
            case ScrollView.DIR_BOTH:
                if (container.getRightBoundary() <= locW) {
                    var newInnerWidth = container.width;
                    var offset = oldInnerWidth - newInnerWidth;
                    this._scrollChildren(offset, 0);
                }
                break;
        }
        var innerAX = container.anchorX;
        if (container.getLeftBoundary() > 0.0)
            container.x = innerAX * innerWidth;
        if (container.getRightBoundary() < locW)
            container.x = locW - ((1.0 - innerAX) * innerWidth);
    }

    _setInnerHeight(height) {
        var locH = this._contentSize.height,
            innerHeight = locH,
            container = this._innerContainer,
            oldInnerHeight = container.height;
        if (height < locH)
            log("Inner height <= scrollview height, it will be force sized!");
        else
            innerHeight = height;
        container.height = innerHeight;

        switch (this._direction) {
            case ScrollView.DIR_VERTICAL:
            case ScrollView.DIR_BOTH:
                var newInnerHeight = innerHeight;
                var offset = oldInnerHeight - newInnerHeight;
                this._scrollChildren(0, offset);
                break;
        }
        var innerAY = container.anchorY;
        if (container.getLeftBoundary() > 0.0)
            container.y = innerAY * innerHeight;
        if (container.getRightBoundary() < locH)
            container.y = locH - ((1.0 - innerAY) * innerHeight);
    }

    /**
     * Set inner container position
     *
     * @param {Point} position Inner container position.
     */
    setInnerContainerPosition(position) {
        if (position.x === this._innerContainer.getPositionX() && position.y === this._innerContainer.getPositionY()) {
            return;
        }
        this._innerContainer.setPosition(position);
        this._outOfBoundaryAmountDirty = true;

        // Process bouncing events
        if (this.bounceEnabled) {
            for (var _direction = ScrollView.MOVEDIR_TOP; _direction < ScrollView.MOVEDIR_RIGHT; ++_direction) {
                if (this._isOutOfBoundary(_direction)) {
                    this._processScrollEvent(_direction, true);
                }
            }
        }

        this._dispatchEvent(ScrollView.EVENT_CONTAINER_MOVED);
    }

    /**
     * Get inner container position
     *
     * @return The inner container position.
     */
    getInnerContainerPosition() {
        return this._innerContainer.getPosition();
    }

    /**
     * Returns inner container size of ScrollView.     <br/>
     * Inner container size must be larger than or equal ScrollView's size.
     *
     * @return {cc.Size} inner container size.
     */
    getInnerContainerSize() {
        return this._innerContainer.getContentSize();
    }

    _getInnerWidth() {
        return this._innerContainer.width;
    }

    _getInnerHeight() {
        return this._innerContainer.height;
    }

    _isInContainer(widget) {
        if (!this._clippingEnabled)
            return true;
        var wPos = widget._position,
            wSize = widget._contentSize,
            wAnchor = widget._anchorPoint,
            size = this._customSize,
            pos = this._innerContainer._position,
            bottom = 0, left = 0;
        if (
            // Top
        (bottom = wPos.y - wAnchor.y * wSize.height) >= size.height - pos.y ||
            // Bottom
        bottom + wSize.height <= -pos.y ||
            // right
        (left = wPos.x - wAnchor.x * wSize.width) >= size.width - pos.x ||
            // left
        left + wSize.width <= -pos.x
        )
            return false;
        else return true;
    }

    updateChildren() {
        var child, i, l;
        var childrenArray = this._innerContainer._children;
        for (i = 0, l = childrenArray.length; i < l; i++) {
            child = childrenArray[i];
            if (child._inViewRect === true && this._isInContainer(child) === false)
                child._inViewRect = false;
            else if (child._inViewRect === false && this._isInContainer(child) === true)
                child._inViewRect = true;
        }
    }

    /**
     * Add child to ScrollView.
     * @param {cc.Node} widget
     * @param {Number} [zOrder]
     * @param {Number|string} [tag] tag or name
     * @returns {boolean}
     */
    addChild(widget, zOrder, tag) {
        if (!widget)
            return false;
        if (this._isInContainer(widget) === false)
            widget._inViewRect = false;
        zOrder = zOrder || widget.getLocalZOrder();
        tag = tag || widget.getTag();
        return this._innerContainer.addChild(widget, zOrder, tag);
    }

    /**
     * Removes all children.
     */
    removeAllChildren() {
        this.removeAllChildrenWithCleanup(true);
    }

    /**
     * Removes all children.
     * @param {Boolean} cleanup
     */
    removeAllChildrenWithCleanup(cleanup) {
        this._innerContainer.removeAllChildrenWithCleanup(cleanup);
    }

    /**
     * Removes widget child
     * @override
     * @param {Widget} child
     * @param {Boolean} cleanup
     * @returns {boolean}
     */
    removeChild(child, cleanup) {
        return this._innerContainer.removeChild(child, cleanup);
    }

    /**
     * Returns inner container's children
     * @returns {Array}
     */
    getChildren() {
        return this._innerContainer.getChildren();
    }

    /**
     * Gets the count of inner container's children
     * @returns {Number}
     */
    getChildrenCount() {
        return this._innerContainer.getChildrenCount();
    }

    /**
     * Gets a child from the container given its tag
     * @param {Number} tag
     * @returns {Widget}
     */
    getChildByTag(tag) {
        return this._innerContainer.getChildByTag(tag);
    }

    /**
     * Gets a child from the container given its name
     * @param {String} name
     * @returns {Widget}
     */
    getChildByName(name) {
        return this._innerContainer.getChildByName(name);
    }

    _flattenVectorByDirection(vector) {
        var result = new Point(0, 0);
        result.x = (this._direction === ScrollView.DIR_VERTICAL ? 0 : vector.x);
        result.y = (this._direction === ScrollView.DIR_HORIZONTAL ? 0 : vector.y);
        return result;
    }

    _getHowMuchOutOfBoundary(addition) {
        if (addition === undefined)
            addition = new Point(0, 0);

        if (addition.x === 0 && addition.y === 0 && !this._outOfBoundaryAmountDirty) {
            return this._outOfBoundaryAmount;
        }

        var outOfBoundaryAmount = new Point(0, 0);

        if (this._innerContainer.getLeftBoundary() + addition.x > this._leftBoundary) {
            outOfBoundaryAmount.x = this._leftBoundary - (this._innerContainer.getLeftBoundary() + addition.x);
        }
        else if (this._innerContainer.getRightBoundary() + addition.x < this._rightBoundary) {
            outOfBoundaryAmount.x = this._rightBoundary - (this._innerContainer.getRightBoundary() + addition.x);
        }

        if (this._innerContainer.getTopBoundary() + addition.y < this._topBoundary) {
            outOfBoundaryAmount.y = this._topBoundary - (this._innerContainer.getTopBoundary() + addition.y);
        }
        else if (this._innerContainer.getBottomBoundary() + addition.y > this._bottomBoundary) {
            outOfBoundaryAmount.y = this._bottomBoundary - (this._innerContainer.getBottomBoundary() + addition.y);
        }

        if (addition.x === 0 && addition.y === 0) {
            this._outOfBoundaryAmount = outOfBoundaryAmount;
            this._outOfBoundaryAmountDirty = false;
        }
        return outOfBoundaryAmount;
    }

    _isOutOfBoundary(dir) {
        var outOfBoundary = this._getHowMuchOutOfBoundary();
        if (dir !== undefined) {
            switch (dir) {
                case ScrollView.MOVEDIR_TOP:
                    return outOfBoundary.y > 0;
                case ScrollView.MOVEDIR_BOTTOM:
                    return outOfBoundary.y < 0;
                case ScrollView.MOVEDIR_LEFT:
                    return outOfBoundary.x < 0;
                case ScrollView.MOVEDIR_RIGHT:
                    return outOfBoundary.x > 0;
            }
        }
        else {
            return !this._fltEqualZero(outOfBoundary);
        }

        return false;
    }


    _moveInnerContainer(deltaMove, canStartBounceBack) {
        var adjustedMove = this._flattenVectorByDirection(deltaMove);

        this.setInnerContainerPosition(cc.Point.add(this.getInnerContainerPosition(), adjustedMove));

        var outOfBoundary = this._getHowMuchOutOfBoundary();
        this._updateScrollBar(outOfBoundary);

        if (this.bounceEnabled && canStartBounceBack) {
            this._startBounceBackIfNeeded();
        }
    }

    _updateScrollBar(outOfBoundary) {
        if(this._verticalScrollBar)
        {
            this._verticalScrollBar.onScrolled(outOfBoundary);
        }
        if(this._horizontalScrollBar)
        {
            this._horizontalScrollBar.onScrolled(outOfBoundary);
        }
    }

    _calculateTouchMoveVelocity() {
        var totalTime = 0;
        for (var i = 0; i < this._touchMoveTimeDeltas.length; ++i) {
            totalTime += this._touchMoveTimeDeltas[i];
        }
        if (totalTime == 0 || totalTime >= this._touchTotalTimeThreshold) {
            return new Point(0, 0);
        }

        var totalMovement = new Point(0, 0);

        for (var i = 0; i < this._touchMoveDisplacements.length; ++i) {
            totalMovement.x += this._touchMoveDisplacements[i].x;
            totalMovement.y += this._touchMoveDisplacements[i].y;
        }

        return cc.Point.mult(totalMovement, 1 / totalTime);
    }

    /**
     * Set the touch total time threshold
     * @param {Number} touchTotalTimeThreshold
     */
    setTouchTotalTimeThreshold(touchTotalTimeThreshold) {
        this._touchTotalTimeThreshold = touchTotalTimeThreshold;
    }

    /**
     * Get the touch total time threshold
     * @returns {Number}
     */
    getTouchTotalTimeThreshold() {
        return this._touchTotalTimeThreshold;
    }

    _startInertiaScroll(touchMoveVelocity) {
        var MOVEMENT_FACTOR = 0.7;
        var inertiaTotalMovement = cc.Point.mult(touchMoveVelocity, MOVEMENT_FACTOR);
        this._startAttenuatingAutoScroll(inertiaTotalMovement, touchMoveVelocity);
    }

    _startBounceBackIfNeeded() {
        if (!this.bounceEnabled) {
            return false;
        }
        var bounceBackAmount = this._getHowMuchOutOfBoundary();
        if (this._fltEqualZero(bounceBackAmount)) {
            return false;
        }

        var BOUNCE_BACK_DURATION = 1.0;
        this._startAutoScroll(bounceBackAmount, BOUNCE_BACK_DURATION, true);
        return true;
    }

    _startAutoScrollToDestination(destination, timeInSec, attenuated) {
        this._startAutoScroll(cc.Point.sub(destination, this._innerContainer.getPosition()), timeInSec, attenuated);
    }

    _calculateAutoScrollTimeByInitialSpeed(initialSpeed) {
        // Calculate the time from the initial speed according to quintic polynomial.
        return Math.sqrt(Math.sqrt(initialSpeed / 5));
    }

    _startAttenuatingAutoScroll(deltaMove, initialVelocity) {
        var time = this._calculateAutoScrollTimeByInitialSpeed(cc.Point.length(initialVelocity));
        this._startAutoScroll(deltaMove, time, true);
    }

    _startAutoScroll(deltaMove, timeInSec, attenuated) {
        var adjustedDeltaMove = this._flattenVectorByDirection(deltaMove);

        this._autoScrolling = true;
        this._autoScrollTargetDelta = adjustedDeltaMove;
        this._autoScrollAttenuate = attenuated;
        this._autoScrollStartPosition = this._innerContainer.getPosition();
        this._autoScrollTotalTime = timeInSec;
        this._autoScrollAccumulatedTime = 0;
        this._autoScrollBraking = false;
        this._autoScrollBrakingStartPosition = new Point(0, 0);

        // If the destination is also out of boundary of same side, start brake from beggining.
        var currentOutOfBoundary = this._getHowMuchOutOfBoundary();
        if (!this._fltEqualZero(currentOutOfBoundary)) {
            this._autoScrollCurrentlyOutOfBoundary = true;
            var afterOutOfBoundary = this._getHowMuchOutOfBoundary(adjustedDeltaMove);
            if (currentOutOfBoundary.x * afterOutOfBoundary.x > 0 || currentOutOfBoundary.y * afterOutOfBoundary.y > 0) {
                this._autoScrollBraking = true;
            }
        }
    }

    /**
     * Immediately stops inner container scroll initiated by any of the "scrollTo*" member functions
     */
    stopAutoScroll() {
        this._autoScrolling = false;
        this._autoScrollAttenuate = true;
        this._autoScrollTotalTime = 0;
        this._autoScrollAccumulatedTime = 0;
    }

    _isNecessaryAutoScrollBrake() {
        if (this._autoScrollBraking) {
            return true;
        }

        if (this._isOutOfBoundary()) {
            // It just went out of boundary.
            if (!this._autoScrollCurrentlyOutOfBoundary) {
                this._autoScrollCurrentlyOutOfBoundary = true;
                this._autoScrollBraking = true;
                this._autoScrollBrakingStartPosition = this.getInnerContainerPosition();
                return true;
            }
        }
        else {
            this._autoScrollCurrentlyOutOfBoundary = false;
        }
        return false;
    }

    _getAutoScrollStopEpsilon() {
        return 0.0001;
    }

    _fltEqualZero(point) {
        return (Math.abs(point.x) <= 0.0001 && Math.abs(point.y) <= 0.0001);
    }

    _processAutoScrolling(deltaTime) {
        var OUT_OF_BOUNDARY_BREAKING_FACTOR = 0.05;
        // Make auto scroll shorter if it needs to deaccelerate.
        var brakingFactor = (this._isNecessaryAutoScrollBrake() ? OUT_OF_BOUNDARY_BREAKING_FACTOR : 1);

        // Elapsed time
        this._autoScrollAccumulatedTime += deltaTime * (1 / brakingFactor);

        // Calculate the progress percentage
        var percentage = Math.min(1, this._autoScrollAccumulatedTime / this._autoScrollTotalTime);
        if (this._autoScrollAttenuate) {
            percentage -= 1;
            percentage = percentage * percentage * percentage * percentage * percentage + 1;
        }

        // Calculate the new position
        var newPosition = cc.Point.add(this._autoScrollStartPosition, cc.Point.mult(this._autoScrollTargetDelta, percentage));
        var reachedEnd = Math.abs(percentage - 1) <= this._getAutoScrollStopEpsilon();

        if (this.bounceEnabled) {
            // The new position is adjusted if out of boundary
            newPosition = cc.Point.add(this._autoScrollBrakingStartPosition, cc.Point.mult(cc.Point.sub(newPosition, this._autoScrollBrakingStartPosition), brakingFactor));
        }
        else {
            // Don't let go out of boundary
            var moveDelta = cc.Point.sub(newPosition, this.getInnerContainerPosition());
            var outOfBoundary = this._getHowMuchOutOfBoundary(moveDelta);
            if (!this._fltEqualZero(outOfBoundary)) {
                newPosition.x += outOfBoundary.x;
                newPosition.y += outOfBoundary.y;

                reachedEnd = true;
            }
        }

        // Finish auto scroll if it ended
        if (reachedEnd) {
            this._autoScrolling = false;
            this._dispatchEvent(ScrollView.EVENT_AUTOSCROLL_ENDED);
        }

        this._moveInnerContainer(cc.Point.sub(newPosition, this.getInnerContainerPosition()), reachedEnd);
    }

    _jumpToDestination(desOrX, y) {
        if (desOrX.x === undefined) {
            desOrX = new Point(desOrX, y);
        }

        this._autoScrolling = false;
        this._moveInnerContainer(cc.Point.sub(desOrX, this.getInnerContainerPosition()), true);
    }

    _scrollChildren(deltaMove) {
        var realMove = deltaMove;
        if (this.bounceEnabled) {
            // If the position of the inner container is out of the boundary, the offsets should be divided by two.
            var outOfBoundary = this._getHowMuchOutOfBoundary();
            realMove.x *= (outOfBoundary.x == 0 ? 1 : 0.5);
            realMove.y *= (outOfBoundary.y == 0 ? 1 : 0.5);
        }

        if (!this.bounceEnabled) {
            var outOfBoundary = this._getHowMuchOutOfBoundary(realMove);
            realMove.x += outOfBoundary.x;
            realMove.y += outOfBoundary.y;
        }

        var scrolledToLeft = false;
        var scrolledToRight = false;
        var scrolledToTop = false;
        var scrolledToBottom = false;

        if (realMove.y > 0.0) // up
        {
            var icBottomPos = this._innerContainer.getBottomBoundary();
            if (icBottomPos + realMove.y >= this._bottomBoundary) {
                scrolledToBottom = true;
            }
        }
        else if (realMove.y < 0.0) // down
        {
            var icTopPos = this._innerContainer.getTopBoundary();
            if (icTopPos + realMove.y <= this._topBoundary) {
                scrolledToTop = true;
            }
        }

        if (realMove.x < 0.0) // left
        {
            var icRightPos = this._innerContainer.getRightBoundary();
            if (icRightPos + realMove.x <= this._rightBoundary) {
                scrolledToRight = true;
            }
        }
        else if (realMove.x > 0.0) // right
        {
            var icLeftPos = this._innerContainer.getLeftBoundary();
            if (icLeftPos + realMove.x >= this._leftBoundary) {
                scrolledToLeft = true;
            }
        }
        this._moveInnerContainer(realMove, false);

        if (realMove.x != 0 || realMove.y != 0) {
            this._processScrollingEvent();
        }
        if (scrolledToBottom) {
            this._processScrollEvent(ScrollView.MOVEDIR_BOTTOM, false);
        }
        if (scrolledToTop) {
            this._processScrollEvent(ScrollView.MOVEDIR_TOP, false);
        }
        if (scrolledToLeft) {
            this._processScrollEvent(ScrollView.MOVEDIR_LEFT, false);
        }
        if (scrolledToRight) {
            this._processScrollEvent(ScrollView.MOVEDIR_RIGHT, false);
        }
    }

    /**
     * Scroll inner container to bottom boundary of ScrollView.
     * @param {Number} time
     * @param {Boolean} attenuated
     */
    scrollToBottom(time, attenuated) {
        this._startAutoScrollToDestination(new Point(this._innerContainer.getPositionX(), 0), time, attenuated);
    }

    /**
     * Scroll inner container to top boundary of ScrollView.
     * @param {Number} time
     * @param {Boolean} attenuated
     */
    scrollToTop(time, attenuated) {
        this._startAutoScrollToDestination(
            new Point(this._innerContainer.getPositionX(), this._contentSize.height - this._innerContainer.getContentSize().height), time, attenuated);
    }

    /**
     * Scroll inner container to left boundary of ScrollView.
     * @param {Number} time
     * @param {Boolean} attenuated
     */
    scrollToLeft(time, attenuated) {
        this._startAutoScrollToDestination(new Point(0, this._innerContainer.getPositionY()), time, attenuated);
    }

    /**
     * Scroll inner container to right boundary of ScrollView.
     * @param {Number} time
     * @param {Boolean} attenuated
     */
    scrollToRight(time, attenuated) {
        this._startAutoScrollToDestination(
            new Point(this._contentSize.width - this._innerContainer.getContentSize().width, this._innerContainer.getPositionY()), time, attenuated);
    }

    /**
     * Scroll inner container to top and left boundary of ScrollView.
     * @param {Number} time
     * @param {Boolean} attenuated
     */
    scrollToTopLeft(time, attenuated) {
        if (this._direction !== ScrollView.DIR_BOTH) {
            log("Scroll direction is not both!");
            return;
        }
        this._startAutoScrollToDestination(new Point(0, this._contentSize.height - this._innerContainer.getContentSize().height), time, attenuated);
    }

    /**
     * Scroll inner container to top and right boundary of ScrollView.
     * @param {Number} time
     * @param {Boolean} attenuated
     */
    scrollToTopRight(time, attenuated) {
        if (this._direction !== ScrollView.DIR_BOTH) {
            log("Scroll direction is not both!");
            return;
        }
        var inSize = this._innerContainer.getContentSize();
        this._startAutoScrollToDestination(new Point(this._contentSize.width - inSize.width,
            this._contentSize.height - inSize.height), time, attenuated);
    }

    /**
     * Scroll inner container to bottom and left boundary of ScrollView.
     * @param {Number} time
     * @param {Boolean} attenuated
     */
    scrollToBottomLeft(time, attenuated) {
        if (this._direction !== ScrollView.DIR_BOTH) {
            log("Scroll direction is not both!");
            return;
        }
        this._startAutoScrollToDestination(new Point(0, 0), time, attenuated);
    }

    /**
     * Scroll inner container to bottom and right boundary of ScrollView.
     * @param {Number} time
     * @param {Boolean} attenuated
     */
    scrollToBottomRight(time, attenuated) {
        if (this._direction !== ScrollView.DIR_BOTH) {
            log("Scroll direction is not both!");
            return;
        }
        this._startAutoScrollToDestination(new Point(this._contentSize.width - this._innerContainer.getContentSize().width, 0), time, attenuated);
    }

    /**
     * Scroll inner container to vertical percent position of ScrollView.
     * @param {Number} percent
     * @param {Number} time
     * @param {Boolean} attenuated
     */
    scrollToPercentVertical(percent, time, attenuated) {
        var minY = this._contentSize.height - this._innerContainer.getContentSize().height;
        var h = -minY;
        this._startAutoScrollToDestination(new Point(this._innerContainer.getPositionX(), minY + percent * h / 100), time, attenuated);
    }

    /**
     * Scroll inner container to horizontal percent position of ScrollView.
     * @param {Number} percent
     * @param {Number} time
     * @param {Boolean} attenuated
     */
    scrollToPercentHorizontal(percent, time, attenuated) {
        var w = this._innerContainer.getContentSize().width - this._contentSize.width;
        this._startAutoScrollToDestination(new Point(-(percent * w / 100), this._innerContainer.getPositionY()), time, attenuated);
    }

    /**
     * Scroll inner container to both _direction percent position of ScrollView.
     * @param {Point} percent
     * @param {Number} time
     * @param {Boolean} attenuated
     */
    scrollToPercentBothDirection(percent, time, attenuated) {
        if (this._direction !== ScrollView.DIR_BOTH)
            return;
        var minY = this._contentSize.height - this._innerContainer.getContentSize().height;
        var h = -minY;
        var w = this._innerContainer.getContentSize().width - this._contentSize.width;
        this._startAutoScrollToDestination(new Point(-(percent.x * w / 100), minY + percent.y * h / 100), time, attenuated);
    }

    /**
     * Move inner container to bottom boundary of ScrollView.
     */
    jumpToBottom() {
        this._jumpToDestination(this._innerContainer.getPositionX(), 0);
    }

    /**
     * Move inner container to top boundary of ScrollView.
     */
    jumpToTop() {
        this._jumpToDestination(this._innerContainer.getPositionX(), this._contentSize.height - this._innerContainer.getContentSize().height);
    }

    /**
     * Move inner container to left boundary of ScrollView.
     */
    jumpToLeft() {
        this._jumpToDestination(0, this._innerContainer.getPositionY());
    }

    /**
     * Move inner container to right boundary of ScrollView.
     */
    jumpToRight() {
        this._jumpToDestination(this._contentSize.width - this._innerContainer.getContentSize().width, this._innerContainer.getPositionY());
    }

    /**
     * Move inner container to top and left boundary of ScrollView.
     */
    jumpToTopLeft() {
        if (this._direction !== ScrollView.DIR_BOTH) {
            log("Scroll _direction is not both!");
            return;
        }
        this._jumpToDestination(0, this._contentSize.height - this._innerContainer.getContentSize().height);
    }

    /**
     * Move inner container to top and right boundary of ScrollView.
     */
    jumpToTopRight() {
        if (this._direction !== ScrollView.DIR_BOTH) {
            log("Scroll _direction is not both!");
            return;
        }
        var inSize = this._innerContainer.getContentSize();
        this._jumpToDestination(this._contentSize.width - inSize.width, this._contentSize.height - inSize.height);
    }

    /**
     * Move inner container to bottom and left boundary of ScrollView.
     */
    jumpToBottomLeft() {
        if (this._direction !== ScrollView.DIR_BOTH) {
            log("Scroll _direction is not both!");
            return;
        }
        this._jumpToDestination(0, 0);
    }

    /**
     * Move inner container to bottom and right boundary of ScrollView.
     */
    jumpToBottomRight() {
        if (this._direction !== ScrollView.DIR_BOTH) {
            log("Scroll _direction is not both!");
            return;
        }
        this._jumpToDestination(this._contentSize.width - this._innerContainer.getContentSize().width, 0);
    }

    /**
     * Move inner container to vertical percent position of ScrollView.
     * @param {Number} percent The destination vertical percent, accept value between 0 - 100
     */
    jumpToPercentVertical(percent) {
        var minY = this._contentSize.height - this._innerContainer.getContentSize().height;
        var h = -minY;
        this._jumpToDestination(this._innerContainer.getPositionX(), minY + percent * h / 100);
    }

    /**
     * Move inner container to horizontal percent position of ScrollView.
     * @param {Number} percent The destination vertical percent, accept value between 0 - 100
     */
    jumpToPercentHorizontal(percent) {
        var w = this._innerContainer.getContentSize().width - this._contentSize.width;
        this._jumpToDestination(-(percent * w / 100), this._innerContainer.getPositionY());
    }

    /**
     * Move inner container to both _direction percent position of ScrollView.
     * @param {Point} percent The destination vertical percent, accept value between 0 - 100
     */
    jumpToPercentBothDirection(percent) {
        if (this._direction !== ScrollView.DIR_BOTH)
            return;
        var inSize = this._innerContainer.getContentSize();
        var minY = this._contentSize.height - inSize.height;
        var h = -minY;
        var w = inSize.width - this._contentSize.width;
        this._jumpToDestination(-(percent.x * w / 100), minY + percent.y * h / 100);
    }

    _gatherTouchMove(delta) {
        var NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED = 5;
        while (this._touchMoveDisplacements.length >= NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED) {
            this._touchMoveDisplacements.splice(0, 1);
            this._touchMoveTimeDeltas.splice(0, 1)
        }
        this._touchMoveDisplacements.push(delta);

        var timestamp = (new Date()).getTime();
        this._touchMoveTimeDeltas.push((timestamp - this._touchMovePreviousTimestamp) / 1000);
        this._touchMovePreviousTimestamp = timestamp;
    }

    _handlePressLogic(touch) {
        this._bePressed = true;
        this._autoScrolling = false;

        // Clear gathered touch move information

        this._touchMovePreviousTimestamp = (new Date()).getTime();
        this._touchMoveDisplacements.length = 0;
        this._touchMoveTimeDeltas.length = 0;


        if(this._verticalScrollBar)
        {
           this._verticalScrollBar.onTouchBegan();
        }
        if(this._horizontalScrollBar)
        {
            this._horizontalScrollBar.onTouchBegan();
        }
    }

    _handleMoveLogic(touch) {
        var touchPositionInNodeSpace = this.convertToNodeSpace(touch.getLocation()),
            previousTouchPositionInNodeSpace = this.convertToNodeSpace(touch.getPreviousLocation());
        var delta = cc.Point.sub(touchPositionInNodeSpace, previousTouchPositionInNodeSpace);

        this._scrollChildren(delta);
        this._gatherTouchMove(delta);
    }

    _handleReleaseLogic(touch) {

        var touchPositionInNodeSpace = this.convertToNodeSpace(touch.getLocation()),
            previousTouchPositionInNodeSpace = this.convertToNodeSpace(touch.getPreviousLocation());
        var delta = cc.Point.sub(touchPositionInNodeSpace, previousTouchPositionInNodeSpace);

        this._gatherTouchMove(delta);

        this._bePressed = false;

        var bounceBackStarted = this._startBounceBackIfNeeded();
        if (!bounceBackStarted && this.inertiaScrollEnabled) {
            var touchMoveVelocity = this._calculateTouchMoveVelocity();
            if (touchMoveVelocity.x !== 0 || touchMoveVelocity.y !== 0) {
                this._startInertiaScroll(touchMoveVelocity);
            }
        }

        if(this._verticalScrollBar)
        {
            this._verticalScrollBar.onTouchEnded();
        }
        if(this._horizontalScrollBar)
        {
            this._horizontalScrollBar.onTouchEnded();
        }
    }

    /**
     * The touch began event callback handler of ScrollView.
     * @param {cc.Touch} touch
     * @param {cc.Event} event
     * @returns {boolean}
     */
    onTouchBegan(touch, event) {
        var pass = super.onTouchBegan(touch, event);
        if (!this._isInterceptTouch) {
            if (this._hit)
                this._handlePressLogic(touch);
        }
        return pass;
    }

    /**
     * The touch moved event callback handler of ScrollView.
     * @param {cc.Touch} touch
     * @param {cc.Event} event
     */
    onTouchMoved(touch, event) {
        super.onTouchMoved(touch, event);
        if (!this._isInterceptTouch)
            this._handleMoveLogic(touch);
    }

    /**
     * The touch ended event callback handler of ScrollView.
     * @param {cc.Touch} touch
     * @param {cc.Event} event
     */
    onTouchEnded(touch, event) {
        super.onTouchEnded(touch, event);
        if (!this._isInterceptTouch)
            this._handleReleaseLogic(touch);
        this._isInterceptTouch = false;
    }

    /**
     * The touch canceled event callback of ScrollView.
     * @param {cc.Touch} touch
     * @param {cc.Event} event
     */
    onTouchCancelled(touch, event) {
        super.onTouchCancelled(touch, event);
        if (!this._isInterceptTouch)
            this._handleReleaseLogic(touch);
        this._isInterceptTouch = false;
    }

    /**
     * The update callback handler.
     * @param {Number} dt
     */
    update(dt) {
        if (this._autoScrolling)
            this._processAutoScrolling(dt);
    }

    /**
     * Intercept touch event, handle its child's touch event.
     * @override
     * @param {number} event event type
     * @param {Widget} sender
     * @param {cc.Touch} touch
     */
    interceptTouchEvent(event, sender, touch) {
        if (!this._touchEnabled) {
            super.interceptTouchEvent(event, sender, touch);
            return;
        }

        if (this._direction === ScrollView.DIR_NONE)
            return;

        var touchPoint = touch.getLocation();
        switch (event) {
            case Widget.TOUCH_BEGAN:
                this._isInterceptTouch = true;
                this._touchBeganPosition.x = touchPoint.x;
                this._touchBeganPosition.y = touchPoint.y;
                this._handlePressLogic(touch);
                break;
            case Widget.TOUCH_MOVED:
                var offset = cc.Point.length(cc.Point.sub(sender.getTouchBeganPosition(), touchPoint));
                this._touchMovePosition.x = touchPoint.x;
                this._touchMovePosition.y = touchPoint.y;
                if (offset > this._childFocusCancelOffset) {
                    sender.setHighlighted(false);
                    this._handleMoveLogic(touch);
                }
                break;
            case Widget.TOUCH_CANCELED:
            case Widget.TOUCH_ENDED:
                this._touchEndPosition.x = touchPoint.x;
                this._touchEndPosition.y = touchPoint.y;
                this._handleReleaseLogic(touch);
                if (sender.isSwallowTouches())
                    this._isInterceptTouch = false;
                break;
        }
    }

    _processScrollEvent(_directionEvent, bounce) {
        var event = 0;

        switch (_directionEvent) {
            case ScrollView.MOVEDIR_TOP:
                event = (bounce ? ScrollView.EVENT_BOUNCE_TOP : ScrollView.EVENT_SCROLL_TO_TOP);
                break;
            case ScrollView.MOVEDIR_BOTTOM:
                event = (bounce ? ScrollView.EVENT_BOUNCE_BOTTOM : ScrollView.EVENT_SCROLL_TO_BOTTOM);
                break;
            case ScrollView.MOVEDIR_LEFT:
                event = (bounce ? ScrollView.EVENT_BOUNCE_LEFT : ScrollView.EVENT_SCROLL_TO_LEFT);
                break;
            case ScrollView.MOVEDIR_RIGHT:
                event = (bounce ? ScrollView.EVENT_BOUNCE_RIGHT : ScrollView.EVENT_SCROLL_TO_RIGHT);
                break;
        }

        this._dispatchEvent(event);
    }

    _processScrollingEvent() {
        this._dispatchEvent(ScrollView.EVENT_SCROLLING);
    }

    _dispatchEvent(event) {
        if (this._scrollViewEventSelector) {
            if (this._scrollViewEventListener)
                this._scrollViewEventSelector.call(this._scrollViewEventListener, this, event);
            else
                this._scrollViewEventSelector(this, event);
        }
        if (this._ccEventCallback)
            this._ccEventCallback(this, event);
    }

    /**
     * Adds callback function called ScrollView event triggered
     * @param {Function} selector
     * @param {Object} [target=]
     * @deprecated since v3.0, please use addEventListener instead.
     */
    addEventListenerScrollView(selector, target) {
        this._scrollViewEventSelector = selector;
        this._scrollViewEventListener = target;
    }

    /**
     * Adds callback function called ScrollView event triggered
     * @param {Function} selector
     */
    addEventListener(selector) {
        this._ccEventCallback = selector;
    }

    /**
     * Changes scroll _direction of ScrollView.
     * @param {ScrollView.DIR_NONE | ScrollView.DIR_VERTICAL | ScrollView.DIR_HORIZONTAL | ScrollView.DIR_BOTH} dir
     *   Direction::VERTICAL means vertical scroll, Direction::HORIZONTAL means horizontal scroll
     */
    setDirection(dir) {
        this._direction = dir;

        if(this._scrollBarEnabled)
        {
            this._removeScrollBar();
            this._initScrollBar();
        }
    }

    /**
     * Returns scroll direction of ScrollView.
     * @returns {ScrollView.DIR_NONE | ScrollView.DIR_VERTICAL | ScrollView.DIR_HORIZONTAL | ScrollView.DIR_BOTH}
     */
    getDirection() {
        return this._direction;
    }

    /**
     * Sets bounce enabled
     * @param {Boolean} enabled
     */
    setBounceEnabled(enabled) {
        this.bounceEnabled = enabled;
    }

    /**
     * Returns whether bounce is enabled
     * @returns {boolean}
     */
    isBounceEnabled() {
        return this.bounceEnabled;
    }

    /**
     * Sets inertiaScroll enabled
     * @param {boolean} enabled
     */
    setInertiaScrollEnabled(enabled) {
        this.inertiaScrollEnabled = enabled;
    }

    /**
     * Returns whether inertiaScroll is enabled
     * @returns {boolean}
     */
    isInertiaScrollEnabled() {
        return this.inertiaScrollEnabled;
    }

    /**
     * Toggle scroll bar enabled.
     * @param {boolean} enabled True if enable scroll bar, false otherwise.
     */
    setScrollBarEnabled(enabled) {
        if(this._scrollBarEnabled === enabled)
        {
            return;
        }

        if(this._scrollBarEnabled)
        {
            this._removeScrollBar();
        }
        this._scrollBarEnabled = enabled;
        if(this._scrollBarEnabled)
        {
            this._initScrollBar();
        }
    }

    /**
     * Query scroll bar state.
     * @returns {boolean} True if scroll bar is enabled, false otherwise.
     */
    isScrollBarEnabled() {
        return this._scrollBarEnabled;
    }

    /**
     * Set the scroll bar positions from the left-bottom corner (horizontal) and right-top corner (vertical).
     * @param {Point} positionFromCorner The position from the left-bottom corner (horizontal) and right-top corner (vertical).
     */
    setScrollBarPositionFromCorner(positionFromCorner) {
        if(this._direction !== ScrollView.DIR_HORIZONTAL)
        {
            this.setScrollBarPositionFromCornerForVertical(positionFromCorner);
        }
        if(this._direction !== ScrollView.DIR_VERTICAL)
        {
            this.setScrollBarPositionFromCornerForHorizontal(positionFromCorner);
        }
    }

    /**
     * Set the vertical scroll bar position from right-top corner.
     * @param {Point} positionFromCorner The position from right-top corner
     */
    setScrollBarPositionFromCornerForVertical(positionFromCorner) {
        assert(this._scrollBarEnabled, "Scroll bar should be enabled!");
        assert(this._direction !== ScrollView.DIR_HORIZONTAL, "Scroll view doesn't have a vertical scroll bar!");
        this._verticalScrollBar.setPositionFromCorner(positionFromCorner);
    }

    /**
     * Get the vertical scroll bar's position from right-top corner.
     * @returns {Point}
     */
    getScrollBarPositionFromCornerForVertical() {
        assert(this._scrollBarEnabled, "Scroll bar should be enabled!");
        assert(this._direction !== ScrollView.DIR_HORIZONTAL, "Scroll view doesn't have a vertical scroll bar!");
        return this._verticalScrollBar.getPositionFromCorner();
    }

    /**
     * Set the horizontal scroll bar position from left-bottom corner.
     * @param {Point} positionFromCorner The position from left-bottom corner
     */
    setScrollBarPositionFromCornerForHorizontal(positionFromCorner) {
        assert(this._scrollBarEnabled, "Scroll bar should be enabled!");
        assert(this._direction !== ScrollView.DIR_VERTICAL, "Scroll view doesn't have a horizontal scroll bar!");
        this._horizontalScrollBar.setPositionFromCorner(positionFromCorner);
    }

    /**
     * Get the horizontal scroll bar's position from right-top corner.
     * @returns {Point}
     */
    getScrollBarPositionFromCornerForHorizontal() {
        assert(this._scrollBarEnabled, "Scroll bar should be enabled!");
        assert(this._direction !== ScrollView.DIR_VERTICAL, "Scroll view doesn't have a horizontal scroll bar!");
        return this._horizontalScrollBar.getPositionFromCorner();
    }

    /**
     * Set the scroll bar's width
     * @param {number} width The scroll bar's width
     */
    setScrollBarWidth(width) {
        assert(this._scrollBarEnabled, "Scroll bar should be enabled!");
        if(this._verticalScrollBar)
        {
            this._verticalScrollBar.setWidth(width);
        }
        if(this._horizontalScrollBar)
        {
            this._horizontalScrollBar.setWidth(width);
        }
    }

    /**
     * Get the scroll bar's width
     * @returns {number} the scroll bar's width
     */
    getScrollBarWidth() {
        assert(this._scrollBarEnabled, "Scroll bar should be enabled!");
        if(this._verticalScrollBar)
        {
            return this._verticalScrollBar.getWidth();
        }
        if(this._horizontalScrollBar)
        {
            return this._horizontalScrollBar.getWidth();
        }
        return 0;
    }

    /**
     * Set the scroll bar's color
     * @param {Color} color the scroll bar's color
     */
    setScrollBarColor(color) {
        assert(this._scrollBarEnabled, "Scroll bar should be enabled!");
        if(this._verticalScrollBar)
        {
            this._verticalScrollBar.setColor(color);
        }
        if(this._horizontalScrollBar)
        {
            this._horizontalScrollBar.setColor(color);
        }
    }

    /**
     * Get the scroll bar's color
     * @returns {Color} the scroll bar's color
     */
    getScrollBarColor() {
        assert(this._scrollBarEnabled, "Scroll bar should be enabled!");
        if(this._verticalScrollBar)
        {
            this._verticalScrollBar.getColor();
        }
        if(this._horizontalScrollBar)
        {
            this._horizontalScrollBar.getColor();
        }
        return Color.WHITE;
    }

    /**
     * Set the scroll bar's opacity
     * @param {number} opacity the scroll bar's opacity
     */
    setScrollBarOpacity(opacity) {
        assert(this._scrollBarEnabled, "Scroll bar should be enabled!");
        if(this._verticalScrollBar)
        {
            this._verticalScrollBar.opacity = opacity;
        }
        if(this._horizontalScrollBar)
        {
            this._horizontalScrollBar.opacity = opacity;
        }
    }

    /**
     * Get the scroll bar's opacity
     * @returns {number}
     */
    getScrollBarOpacity() {
        assert(this._scrollBarEnabled, "Scroll bar should be enabled!");
        if(this._verticalScrollBar)
        {
            return this._verticalScrollBar.opacity;
        }
        if(this._horizontalScrollBar)
        {
            return this._horizontalScrollBar.opacity;
        }
        return -1;
    }

    /**
     * Set scroll bar auto hide state
     * @param {boolean} autoHideEnabled scroll bar auto hide state
     */
    setScrollBarAutoHideEnabled(autoHideEnabled) {
        assert(this._scrollBarEnabled, "Scroll bar should be enabled!");
        if(this._verticalScrollBar)
        {
            this._verticalScrollBar.autoHideEnabled = autoHideEnabled;
        }
        if(this._horizontalScrollBar)
        {
            this._horizontalScrollBar.autoHideEnabled = autoHideEnabled;
        }
    }

    /**
     * Query scroll bar auto hide state
     * @returns {boolean}
     */
    isScrollBarAutoHideEnabled() {
        assert(this._scrollBarEnabled, "Scroll bar should be enabled!");
        if(this._verticalScrollBar)
        {
            return this._verticalScrollBar.autoHideEnabled;
        }
        if(this._horizontalScrollBar)
        {
            return this._horizontalScrollBar.autoHideEnabled;
        }
        return false;
    }

    /**
     * Set scroll bar auto hide time
     * @param {number} autoHideTime scroll bar auto hide state
     */
    setScrollBarAutoHideTime(autoHideTime) {
        assert(this._scrollBarEnabled, "Scroll bar should be enabled!");
        if(this._verticalScrollBar)
        {
            this._verticalScrollBar.autoHideTime = autoHideTime;
        }
        if(this._horizontalScrollBar)
        {
            this._horizontalScrollBar.autoHideTime = autoHideTime;
        }
    }

    /**
     * Get the scroll bar's auto hide time
     * @returns {number}
     */
    getScrollBarAutoHideTime() {
        assert(this._scrollBarEnabled, "Scroll bar should be enabled!");
        if(this._verticalScrollBar)
        {
            return this._verticalScrollBar.autoHideTime;
        }
        if(this._horizontalScrollBar)
        {
            return this._horizontalScrollBar.autoHideTime;
        }
        return 0;
    }

    /**
     * Gets inner container of ScrollView. Inner container is the container of ScrollView's children.
     * @returns {Layout}
     */
    getInnerContainer() {
        return this._innerContainer;
    }

    /**
     * Sets LayoutType of ScrollView.
     * @param {Layout.ABSOLUTE|Layout.LINEAR_VERTICAL|Layout.LINEAR_HORIZONTAL|Layout.RELATIVE} type
     */
    setLayoutType(type) {
        this._innerContainer.setLayoutType(type);
    }

    /**
     * Returns the layout type of ScrollView.
     * @returns {Layout.ABSOLUTE|Layout.LINEAR_VERTICAL|Layout.LINEAR_HORIZONTAL|Layout.RELATIVE}
     */
    getLayoutType() {
        return this._innerContainer.getLayoutType();
    }

    _doLayout() {
        if (!this._doLayoutDirty)
            return;
        this._doLayoutDirty = false;
    }

    /**
     * Returns the "class name" of ScrollView.
     * @returns {string}
     */
    getDescription() {
        return "ScrollView";
    }

    _createCloneInstance() {
        return new ScrollView();
    }

    _copyClonedWidgetChildren(model) {
        super._copyClonedWidgetChildren(model);
    }

    _copySpecialProperties(scrollView) {
        if (scrollView instanceof ScrollView) {
            super._copySpecialProperties(scrollView);
            this.setInnerContainerSize(scrollView.getInnerContainerSize());
            this.setInnerContainerPosition(scrollView.getInnerContainerPosition());
            this.setDirection(scrollView._direction);

            this._topBoundary = scrollView._topBoundary;
            this._bottomBoundary = scrollView._bottomBoundary;
            this._leftBoundary = scrollView._leftBoundary;
            this._rightBoundary = scrollView._rightBoundary;
            this._bePressed = scrollView._bePressed;
            this._childFocusCancelOffset = scrollView._childFocusCancelOffset;
            this._touchMoveDisplacements = scrollView._touchMoveDisplacements;
            this._touchMoveTimeDeltas = scrollView._touchMoveTimeDeltas;
            this._touchMovePreviousTimestamp = scrollView._touchMovePreviousTimestamp;
            this._autoScrolling = scrollView._autoScrolling;
            this._autoScrollAttenuate = scrollView._autoScrollAttenuate;
            this._autoScrollStartPosition = scrollView._autoScrollStartPosition;
            this._autoScrollTargetDelta = scrollView._autoScrollTargetDelta;
            this._autoScrollTotalTime = scrollView._autoScrollTotalTime;
            this._autoScrollAccumulatedTime = scrollView._autoScrollAccumulatedTime;
            this._autoScrollCurrentlyOutOfBoundary = scrollView._autoScrollCurrentlyOutOfBoundary;
            this._autoScrollBraking = scrollView._autoScrollBraking;
            this._autoScrollBrakingStartPosition = scrollView._autoScrollBrakingStartPosition;

            this.setBounceEnabled(scrollView.bounceEnabled);
            this.setInertiaScrollEnabled(scrollView.inertiaScrollEnabled);

            this._scrollViewEventListener = scrollView._scrollViewEventListener;
            this._scrollViewEventSelector = scrollView._scrollViewEventSelector;
            this._ccEventCallback = scrollView._ccEventCallback;

            this.setScrollBarEnabled(scrollView.isScrollBarEnabled());
            if(this.isScrollBarEnabled())
            {
                if(this._direction !== ScrollView.DIR_HORIZONTAL)
                {
                    this.setScrollBarPositionFromCornerForVertical(scrollView.getScrollBarPositionFromCornerForVertical());
                }
                if(this._direction !== ScrollView.DIR_VERTICAL)
                {
                    this.setScrollBarPositionFromCornerForHorizontal(scrollView.getScrollBarPositionFromCornerForHorizontal());
                }
                this.setScrollBarWidth(scrollView.getScrollBarWidth());
                this.setScrollBarColor(scrollView.getScrollBarColor());
                this.setScrollBarAutoHideEnabled(scrollView.isScrollBarAutoHideEnabled());
                this.setScrollBarAutoHideTime(scrollView.getScrollBarAutoHideTime());
            }
        }
    }

    _initScrollBar() {
        if(this._direction !== ScrollView.DIR_HORIZONTAL && !this._verticalScrollBar)
        {
            this._verticalScrollBar = new ScrollViewBar(this, ScrollView.DIR_VERTICAL);
            this.addProtectedChild(this._verticalScrollBar, 2);
        }
        if(this._direction !== ScrollView.DIR_VERTICAL && !this._horizontalScrollBar)
        {
            this._horizontalScrollBar = new ScrollViewBar(this, ScrollView.DIR_HORIZONTAL);
            this.addProtectedChild(this._horizontalScrollBar, 2);
        }
    }

    _removeScrollBar() {
        if(this._verticalScrollBar)
        {
            this.removeProtectedChild(this._verticalScrollBar);
            this._verticalScrollBar = null;
        }
        if(this._horizontalScrollBar)
        {
            this.removeProtectedChild(this._horizontalScrollBar);
            this._horizontalScrollBar = null;
        }
    }

    /**
     * Returns a node by tag
     * @param {Number} tag
     * @returns {cc.Node}
     * @deprecated  since v3.0, please use getChildByTag instead.
     */
    getNodeByTag(tag) {
        return this._innerContainer.getNodeByTag(tag);
    }

    /**
     * Returns all nodes of inner container
     * @returns {Array}
     * @deprecated since v3.0, please use getChildren instead.
     */
    getNodes() {
        return this._innerContainer.getNodes();
    }

    /**
     * Removes a node from ScrollView.
     * @param {cc.Node} node
     * @deprecated since v3.0, please use removeChild instead.
     */
    removeNode(node) {
        this._innerContainer.removeNode(node);
    }

    /**
     * Removes a node by tag
     * @param {Number} tag
     * @deprecated since v3.0, please use removeChildByTag instead.
     */
    removeNodeByTag(tag) {
        this._innerContainer.removeNodeByTag(tag);
    }

    /**
     * Remove all node from ScrollView.
     * @deprecated since v3.0, please use removeAllChildren instead.
     */
    removeAllNodes() {
        this._innerContainer.removeAllNodes();
    }

    /**
     * Add node for scrollView
     * @param {cc.Node} node
     * @param {Number} zOrder
     * @param {Number} tag
     * @deprecated since v3.0, please use addChild instead.
     */
    addNode(node, zOrder, tag) {
        this._innerContainer.addNode(node, zOrder, tag);
    }
}

// Constants
//ScrollView direction
ScrollView.DIR_NONE = 0;
ScrollView.DIR_VERTICAL = 1;
ScrollView.DIR_HORIZONTAL = 2;
ScrollView.DIR_BOTH = 3;

//ScrollView event
ScrollView.EVENT_SCROLL_TO_TOP = 0;
ScrollView.EVENT_SCROLL_TO_BOTTOM = 1;
ScrollView.EVENT_SCROLL_TO_LEFT = 2;
ScrollView.EVENT_SCROLL_TO_RIGHT = 3;
ScrollView.EVENT_SCROLLING = 4;
ScrollView.EVENT_BOUNCE_TOP = 5;
ScrollView.EVENT_BOUNCE_BOTTOM = 6;
ScrollView.EVENT_BOUNCE_LEFT = 7;
ScrollView.EVENT_BOUNCE_RIGHT = 8;
ScrollView.EVENT_CONTAINER_MOVED = 9;
ScrollView.EVENT_AUTOSCROLL_ENDED = 10;

ScrollView.MOVEDIR_TOP = 0;
ScrollView.MOVEDIR_BOTTOM = 1;
ScrollView.MOVEDIR_LEFT = 2;
ScrollView.MOVEDIR_RIGHT = 3;
