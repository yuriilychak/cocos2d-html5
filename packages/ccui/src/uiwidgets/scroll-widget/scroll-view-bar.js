/****************************************************************************
 Copyright (c) 2015 Neo Kim (neo.kim@neofect.com)
 Copyright (c) 2015 Nikita Besshaposhnikov (nikita.besshaposhnikov@gmail.com)

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

import { Point, Color } from '@aspect/core';
import { ProtectedNode } from '../../base-classes/protected-node';
import { helper } from '../../system/helper';

// Local copies of ScrollView direction constants to avoid a circular import
// (ScrollView imports ScrollViewBar; if ScrollViewBar imported ScrollView the cycle would break).
const DIR_VERTICAL = 1;   // ScrollView.DIR_VERTICAL
const DIR_HORIZONTAL = 2; // ScrollView.DIR_HORIZONTAL

/**
 * The ScrollViewBar control of Cocos UI <br/>
 * Scroll bar being attached to ScrollView layout container.
 *
 * @property {Number}               opacity              - Opacity of the scroll view bar
 * @property {Boolean}              autoHideEnabled             - Auto hide is enabled in the scroll view bar
 * @property {Number}               autoHideTime             - Auto hide time of the scroll view bar
 */
export class ScrollViewBar extends ProtectedNode {
    _parentScroll = null;
    _direction = null;

    _opacity = 255;

    _marginFromBoundary = 0;
    _marginForLength = 0;

    _touching = false;

    _autoHideEnabled = true;
    autoHideTime = 0;
    _autoHideRemainingTime = 0;
    _className = "ScrollViewBar";

    /**
     * Allocates and initializes a UIScrollViewBar.
     * Constructor of ScrollViewBar. override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
     * @param {ScrollView} parent A parent of scroll bar.
     * @param {ScrollView.DIR_NONE | ScrollView.DIR_HORIZONTAL | ScrollView.DIR_VERTICAL | ScrollView.DIR_BOTH} direction
     */
    constructor(parent, direction) {
        super();
        this._direction = direction;
        this._parentScroll = parent;

        this._marginFromBoundary = ScrollViewBar.DEFAULT_MARGIN;
        this._marginForLength = ScrollViewBar.DEFAULT_MARGIN;
        this.opacity = 255 * ScrollViewBar.DEFAULT_SCROLLBAR_OPACITY;
        this.autoHideTime = ScrollViewBar.DEFAULT_AUTO_HIDE_TIME;
        this._autoHideEnabled = true;

        this.init();

        this.setCascadeColorEnabled(true);
        this.setCascadeOpacityEnabled(true);
    }

    get opacity() { return this.getOpacity(); }
    set opacity(v) { this.setOpacity(v); }

    get autoHideEnabled() { return this.isAutoHideEnabled(); }
    set autoHideEnabled(v) { this.setAutoHideEnabled(v); }


    /**
     * Initializes a ScrollViewBar. Please do not call this function by yourself, you should pass the parameters to constructor to initialize it.
     * @returns {boolean}
     */
    init() {
        this._upperHalfCircle = helper._createSpriteFromBase64(ScrollViewBar.HALF_CIRCLE_IMAGE, ScrollViewBar.HALF_CIRCLE_IMAGE_KEY);
        this._upperHalfCircle.setAnchorPoint(new Point(0.5, 0));

        this._lowerHalfCircle = helper._createSpriteFromBase64(ScrollViewBar.HALF_CIRCLE_IMAGE, ScrollViewBar.HALF_CIRCLE_IMAGE_KEY);
        this._lowerHalfCircle.setAnchorPoint(new Point(0.5, 0));
        this._lowerHalfCircle.setScaleY(-1);

        this.addProtectedChild(this._upperHalfCircle);
        this.addProtectedChild(this._lowerHalfCircle);

        this._body = helper._createSpriteFromBase64(ScrollViewBar.BODY_IMAGE_1_PIXEL_HEIGHT, ScrollViewBar.BODY_IMAGE_1_PIXEL_HEIGHT_KEY);
        this._body.setAnchorPoint(new Point(0.5, 0));
        this.addProtectedChild(this._body);

        this.setColor(ScrollViewBar.DEFAULT_COLOR);
        this.onScrolled(new Point(0, 0));
        super.setOpacity(0);
        this._autoHideRemainingTime = 0;

        if (this._direction === DIR_HORIZONTAL) {
            this.setRotation(90);
        }
    }

    /**
     * Set the scroll bar position from the left-bottom corner (horizontal) or right-top corner (vertical).
     * @param {Point} positionFromCorner The position from the left-bottom corner (horizontal) or right-top corner (vertical).
     */
    setPositionFromCorner(positionFromCorner) {
        if (this._direction === DIR_VERTICAL) {
            this._marginForLength = positionFromCorner.y;
            this._marginFromBoundary = positionFromCorner.x;
        }
        else {
            this._marginForLength = positionFromCorner.x;
            this._marginFromBoundary = positionFromCorner.y;
        }
    }

    onEnter() {
        super.onEnter();
        this.scheduleUpdate();
    }

    /**
     * Get the scroll bar position from the left-bottom corner (horizontal) or right-top corner (vertical).
     * @returns {Point}
     */
    getPositionFromCorner() {
        if (this._direction === DIR_VERTICAL) {
            return new Point(this._marginFromBoundary, this._marginForLength);
        }
        else {
            return new Point(this._marginForLength, this._marginFromBoundary);
        }
    }

    /**
     * Set the scroll bar's width
     * @param {number} width The scroll bar's width
     */
    setWidth(width) {
        var scale = width / this._body.width;
        this._body.setScaleX(scale);
        this._upperHalfCircle.setScale(scale);
        this._lowerHalfCircle.setScale(-scale);
    }

    /**
     * Get the scroll bar's width
     * @returns {number} the scroll bar's width
     */
    getWidth() {
        return this._body.getBoundingBox().width;
    }

    /**
     * Set scroll bar auto hide state
     * @param {boolean} autoHideEnabled scroll bar auto hide state
     */
    setAutoHideEnabled(autoHideEnabled) {
        this._autoHideEnabled = autoHideEnabled;

        if (!this._autoHideEnabled && !this._touching && this._autoHideRemainingTime <= 0)
            super.setOpacity(this.opacity);
        else
            super.setOpacity(0);
    }

    /**
     * Query scroll bar auto hide state
     * @returns {boolean} True if scroll bar auto hide is enabled, false otherwise.
     */
    isAutoHideEnabled() {
        return this._autoHideEnabled;
    }

    /**
     * Set scroll bar opacity
     * @param {number} opacity scroll bar opacity
     */
    setOpacity(opacity) {
        this._opacity = opacity;
    }

    /**
     * Get scroll bar opacity
     * @returns {number}
     */
    getOpacity() {
        return this._opacity;
    }

    _updateLength(length) {
        var ratio = length / this._body.getTextureRect().height;
        this._body.setScaleY(ratio);
        this._upperHalfCircle.setPositionY(this._body.getPositionY() + length);
    }

    _processAutoHide(dt) {
        if (!this._autoHideEnabled || this._autoHideRemainingTime <= 0) {
            return;
        }
        else if (this._touching) {
            // If it is touching, don't auto hide.
            return;
        }

        this._autoHideRemainingTime -= dt;
        if (this._autoHideRemainingTime <= this.autoHideTime) {
            this._autoHideRemainingTime = Math.max(0, this._autoHideRemainingTime);
            super.setOpacity(this._opacity * (this._autoHideRemainingTime / this.autoHideTime));
        }
    }

    update(dt) {
        this._processAutoHide(dt);
    }

    /**
     * This is called by parent ScrollView when a touch is began. Don't call this directly.
     */
    onTouchBegan() {
        if (!this._autoHideEnabled) {
            return;
        }
        this._touching = true;
    }

    /**
     * This is called by parent ScrollView when a touch is ended. Don't call this directly.
     */
    onTouchEnded() {
        if (!this._autoHideEnabled) {
            return;
        }
        this._touching = false;

        if (this._autoHideRemainingTime <= 0) {
            // If the remaining time is 0, it means that it didn't moved after touch started so scroll bar is not showing.
            return;
        }
        this._autoHideRemainingTime = this.autoHideTime;
    }

    /**
     * @brief This is called by parent ScrollView when the parent is scrolled. Don't call this directly.
     *
     * @param {Point} outOfBoundary amount how much the inner container of ScrollView is out of boundary
     */
    onScrolled(outOfBoundary) {
        if (this._autoHideEnabled) {
            this._autoHideRemainingTime = this.autoHideTime;
            super.setOpacity(this.opacity);
        }

        var innerContainer = this._parentScroll.getInnerContainer();

        var innerContainerMeasure = 0;
        var scrollViewMeasure = 0;
        var outOfBoundaryValue = 0;
        var innerContainerPosition = 0;

        if (this._direction === DIR_VERTICAL) {
            innerContainerMeasure = innerContainer.height;
            scrollViewMeasure = this._parentScroll.height;
            outOfBoundaryValue = outOfBoundary.y;
            innerContainerPosition = -innerContainer.getPositionY();
        }
        else if (this._direction === DIR_HORIZONTAL) {
            innerContainerMeasure = innerContainer.width;
            scrollViewMeasure = this._parentScroll.width;
            outOfBoundaryValue = outOfBoundary.x;
            innerContainerPosition = -innerContainer.getPositionX();
        }

        var length = this._calculateLength(innerContainerMeasure, scrollViewMeasure, outOfBoundaryValue);
        var position = this._calculatePosition(innerContainerMeasure, scrollViewMeasure, innerContainerPosition, outOfBoundaryValue, length);
        this._updateLength(length);
        this.setPosition(position);
    }

    _calculateLength(innerContainerMeasure, scrollViewMeasure, outOfBoundaryValue) {
        var denominatorValue = innerContainerMeasure;
        if (outOfBoundaryValue !== 0) {
            // If it is out of boundary, the length of scroll bar gets shorter quickly.
            var GETTING_SHORTER_FACTOR = 20;
            denominatorValue += (outOfBoundaryValue > 0 ? outOfBoundaryValue : -outOfBoundaryValue) * GETTING_SHORTER_FACTOR;
        }

        var lengthRatio = scrollViewMeasure / denominatorValue;
        return Math.abs(scrollViewMeasure - 2 * this._marginForLength) * lengthRatio;
    }

    _calculatePosition(innerContainerMeasure, scrollViewMeasure, innerContainerPosition, outOfBoundaryValue, length) {
        var denominatorValue = innerContainerMeasure - scrollViewMeasure;
        if (outOfBoundaryValue !== 0) {
            denominatorValue += Math.abs(outOfBoundaryValue);
        }

        var positionRatio = 0;

        if (denominatorValue !== 0) {
            positionRatio = innerContainerPosition / denominatorValue;
            positionRatio = Math.max(positionRatio, 0);
            positionRatio = Math.min(positionRatio, 1);
        }

        var position = (scrollViewMeasure - length - 2 * this._marginForLength) * positionRatio + this._marginForLength;

        if (this._direction === DIR_VERTICAL) {
            return new Point(this._parentScroll.width - this._marginFromBoundary, position);
        }
        else {
            return new Point(position, this._marginFromBoundary);
        }
    }
}

/**
 * @ignore
 */
ScrollViewBar.DEFAULT_COLOR = new Color(52, 65, 87);
ScrollViewBar.DEFAULT_MARGIN = 20;
ScrollViewBar.DEFAULT_AUTO_HIDE_TIME = 0.2;
ScrollViewBar.DEFAULT_SCROLLBAR_OPACITY = 0.4;
ScrollViewBar.HALF_CIRCLE_IMAGE_KEY = "/__half_circle_image";
ScrollViewBar.HALF_CIRCLE_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGCAMAAADAMI+zAAAAJ1BMVEX///////////////////////////////////////////////////9Ruv0SAAAADHRSTlMABgcbbW7Hz9Dz+PmlcJP5AAAAMElEQVR4AUXHwQ2AQAhFwYcLH1H6r1djzDK3ASxUpTBeK/uTCyz7dx54b44m4p5cD1MwAooEJyk3AAAAAElFTkSuQmCC";
ScrollViewBar.BODY_IMAGE_1_PIXEL_HEIGHT_KEY = "/__body_image_height";
ScrollViewBar.BODY_IMAGE_1_PIXEL_HEIGHT = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAABCAMAAADdNb8LAAAAA1BMVEX///+nxBvIAAAACklEQVR4AWNABgAADQABYc2cpAAAAABJRU5ErkJggg==";
