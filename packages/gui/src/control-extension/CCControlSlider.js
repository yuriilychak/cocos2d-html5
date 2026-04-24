/**
 *
 * Copyright (c) 2008-2010 Ricardo Quesada
 * Copyright (c) 2011-2012 cocos2d-x.org
 * Copyright (c) 2013-2014 Chukong Technologies Inc.
 *
 * Copyright 2011 Yannick Loriot. All rights reserved.
 * http://yannickloriot.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 *
 * converted to Javascript / cocos2d-x by Angus C
 */

/**
 * @ignore
 */
cc.SLIDER_MARGIN_H = 24;
cc.SLIDER_MARGIN_V = 8;

/**
 * ControlSlider: Slider ui component.
 *
 * @property {Number}       value               - The value of the slider
 * @property {Number}       minValue            - The minimum value of the slider
 * @property {Number}       maxValue            - The maximum value of the slider
 * @property {Number}       minAllowedValue     - The minimum allowed value of the slider
 * @property {Number}       maxAllowedValue     - The maximum allowed value of the slider
 * @property {Number}       thumbSprite         - <@readonly> Brightness value of the picker
 * @property {cc.Sprite}    progressSprite      - <@readonly> The background sprite
 * @property {cc.Sprite}    backgroundSprite    - <@readonly> The overlay sprite
 */
cc.ControlSlider = class ControlSlider extends cc.Control {
    _value = 0;
    _minimumValue = 0;
    _maximumValue = 0;
    _minimumAllowedValue = 0;
    _maximumAllowedValue = 0;

    _thumbSprite = null;
    _progressSprite = null;
    _backgroundSprite = null;
    _className = "ControlSlider";

    get value() { return this.getValue(); }
    set value(v) { this.setValue(v); }
    get minValue() { return this.getMinimumValue(); }
    set minValue(v) { this.setMinimumValue(v); }
    get maxValue() { return this.getMaximumValue(); }
    set maxValue(v) { this.setMaximumValue(v); }
    get minAllowedValue() { return this.getMinimumAllowedValue(); }
    set minAllowedValue(v) { this.setMinimumAllowedValue(v); }
    get maxAllowedValue() { return this.getMaximumAllowedValue(); }
    set maxAllowedValue(v) { this.setMaximumAllowedValue(v); }
    get thumbSprite() { return this.getThumbSprite(); }
    get progressSprite() { return this.getProgressSprite(); }
    get backgroundSprite() { return this.getBackgroundSprite(); }

    constructor(bgFile, progressFile, thumbFile) {
        super();
        if (thumbFile != undefined) {
            // Prepare background for slider
            var bgSprite = new cc.Sprite(bgFile);

            // Prepare progress for slider
            var progressSprite = new cc.Sprite(progressFile);

            // Prepare thumb (menuItem) for slider
            var thumbSprite = new cc.Sprite(thumbFile);

            this.initWithSprites(bgSprite, progressSprite, thumbSprite);
        }
    }

    getValue() {
        return this._value;
    }
    setValue(value) {
        //clamp between the two bounds
        value = Math.max(value, this._minimumValue);
        value = Math.min(value, this._maximumValue);
        this._value = value;
        this.needsLayout();
        this.sendActionsForControlEvents(cc.CONTROL_EVENT_VALUECHANGED);
    }

    getMinimumValue() {
        return this._minimumValue;
    }
    setMinimumValue(minimumValue) {
        this._minimumValue = minimumValue;
        this._minimumAllowedValue = minimumValue;
        if (this._minimumValue >= this._maximumValue)
            this._maximumValue = this._minimumValue + 1.0;
        this.setValue(this._value);
    }

    getMaximumValue() {
        return this._maximumValue;
    }
    setMaximumValue(maximumValue) {
        this._maximumValue = maximumValue;
        this._maximumAllowedValue = maximumValue;
        if (this._maximumValue <= this._minimumValue)
            this._minimumValue = this._maximumValue - 1.0;
        this.setValue(this._value);
    }
    isTouchInside(touch) {
        var touchLocation = touch.getLocation();
        touchLocation = this.getParent().convertToNodeSpace(touchLocation);

        var rect = this.getBoundingBox();
        rect.width += this._thumbSprite.getContentSize().width;
        rect.x -= this._thumbSprite.getContentSize().width / 2;

        return cc.rectContainsPoint(rect, touchLocation);
    }
    locationFromTouch(touch) {
        var touchLocation = touch.getLocation();                      // Get the touch position
        touchLocation = this.convertToNodeSpace(touchLocation);                  // Convert to the node space of this class

        if (touchLocation.x < 0) {
            touchLocation.x = 0;
        } else if (touchLocation.x > this._backgroundSprite.getContentSize().width) {
            touchLocation.x = this._backgroundSprite.getContentSize().width;
        }

        return touchLocation;
    }
    getMinimumAllowedValue() {
        return this._minimumAllowedValue;
    }
    setMinimumAllowedValue(val) {
        this._minimumAllowedValue = val;
    }

    getMaximumAllowedValue() {
        return this._maximumAllowedValue;
    }

    setMaximumAllowedValue(val) {
        this._maximumAllowedValue = val;
    }

    getThumbSprite() {
        return this._thumbSprite;
    }
    getProgressSprite() {
        return this._progressSprite;
    }
    getBackgroundSprite() {
        return this._backgroundSprite;
    }

    /**
     * Initializes a slider with a background sprite, a progress bar and a thumb
     * item.
     *
     * @param {cc.Sprite} backgroundSprite  Sprite, that is used as a background.
     * @param {cc.Sprite} progressSprite    Sprite, that is used as a progress bar.
     * @param {cc.Sprite} thumbSprite         MenuItem, that is used as a thumb.
     */
    initWithSprites(backgroundSprite, progressSprite, thumbSprite) {
        if (super.init()) {
            this.ignoreAnchorPointForPosition(false);

            this._backgroundSprite = backgroundSprite;
            this._progressSprite = progressSprite;
            this._thumbSprite = thumbSprite;

            // Defines the content size
            var maxRect = cc.ControlUtils.CCRectUnion(backgroundSprite.getBoundingBox(), thumbSprite.getBoundingBox());
            this.setContentSize(maxRect.width, maxRect.height);

            // Add the slider background
            this._backgroundSprite.setAnchorPoint(0.5, 0.5);
            this._backgroundSprite.setPosition(maxRect.width / 2, maxRect.height / 2);
            this.addChild(this._backgroundSprite);

            // Add the progress bar
            this._progressSprite.setAnchorPoint(0.0, 0.5);
            this._progressSprite.setPosition(0, maxRect.height / 2);
            this.addChild(this._progressSprite);

            // Add the slider thumb
            this._thumbSprite.setPosition(0, maxRect.height / 2);
            this.addChild(this._thumbSprite);

            // Init default values
            this._minimumValue = 0.0;
            this._maximumValue = 1.0;
            this.setValue(this._minimumValue);
            return true;
        } else
            return false;
    }

    setEnabled(enabled) {
        super.setEnabled(enabled);
        if (this._thumbSprite) {
            this._thumbSprite.setOpacity(enabled ? 255 : 128);
        }
    }

    sliderBegan(location) {
        this.setSelected(true);
        this._thumbSprite.setColor(cc.color.GRAY);
        this.setValue(this.valueForLocation(location));
    }
    sliderMoved(location) {
        this.setValue(this.valueForLocation(location));
    }
    sliderEnded(location) {
        if (this.isSelected()) {
            this.setValue(this.valueForLocation(this._thumbSprite.getPosition()));
        }
        this._thumbSprite.setColor(cc.color.WHITE);
        this.setSelected(false);
    }

    getTouchLocationInControl(touch) {
        var touchLocation = touch.getLocation();                      // Get the touch position
        touchLocation = this.convertToNodeSpace(touchLocation);         // Convert to the node space of this class

        if (touchLocation.x < 0) {
            touchLocation.x = 0;
        } else if (touchLocation.x > this._backgroundSprite.getContentSize().width + cc.SLIDER_MARGIN_H) {
            touchLocation.x = this._backgroundSprite.getContentSize().width + cc.SLIDER_MARGIN_H;
        }
        return touchLocation;
    }

    onTouchBegan(touch, event) {
        if (!this.isTouchInside(touch)|| !this.isEnabled() || !this.isVisible())
            return false;

        var location = this.locationFromTouch(touch);
        this.sliderBegan(location);
        return true;
    }
    onTouchMoved(touch, event) {
        var location = this.locationFromTouch(touch);
        this.sliderMoved(location);
    }
    onTouchEnded(touch, event) {
        this.sliderEnded(new cc.Point(0,0));
    }
    needsLayout(){
        var percent = (this._value - this._minimumValue) / (this._maximumValue - this._minimumValue);
        this._thumbSprite.setPositionX(percent * this._backgroundSprite.getContentSize().width);

        // Stretches content proportional to newLevel
        var textureRect = this._progressSprite.getTextureRect();
        textureRect = cc.rect(textureRect.x, textureRect.y, this._thumbSprite.getPositionX(), textureRect.height);
        this._progressSprite.setTextureRect(textureRect, this._progressSprite.isTextureRectRotated());
        this._thumbSprite._renderCmd.transform(this._renderCmd);
    }
    /** Returns the value for the given location. */
    valueForLocation(location) {
        var percent = location.x / this._backgroundSprite.getContentSize().width;
        return Math.max(Math.min(this._minimumValue + percent * (this._maximumValue - this._minimumValue), this._maximumAllowedValue), this._minimumAllowedValue);
    }
};