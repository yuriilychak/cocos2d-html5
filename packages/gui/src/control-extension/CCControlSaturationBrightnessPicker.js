/**
 *
 * Copyright (c) 2008-2010 Ricardo Quesada
 * Copyright (c) 2011-2012 cocos2d-x.org
 * Copyright (c) 2013-2014 Chukong Technologies Inc.
 *
 * Copyright 2012 Stewart Hamilton-Arrandale.
 * http://creativewax.co.uk
 *
 * Modified by Yannick Loriot.
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
 * ControlSaturationBrightnessPicker: Saturation brightness picker ui component.
 *
 * @property {Number}       saturation  - <@readonly> Saturation value of the picker
 * @property {Number}       brightness  - <@readonly> Brightness value of the picker
 * @property {cc.Sprite}    background  - <@readonly> The background sprite
 * @property {cc.Sprite}    overlay     - <@readonly> The overlay sprite
 * @property {cc.Sprite}    shadow      - <@readonly> The shadow sprite
 * @property {cc.Sprite}    slider      - <@readonly> The slider sprite
 * @property {cc.Point}     startPos    - <@readonly> The start position of the picker
 */
cc.ControlSaturationBrightnessPicker = class ControlSaturationBrightnessPicker extends cc.Control {
    _saturation = 0;
    _brightness = 0;

    _background = null;
    _overlay = null;
    _shadow = null;
    _slider = null;
    _startPos = null;

    _boxPos = 0;
    _boxSize = 0;
    _className = "ControlSaturationBrightnessPicker";

    /**
     * The constructor of cc.ControlSaturationBrightnessPicker
     * @param {cc.Node} target
     * @param {cc.Point} pos position
     */
    get saturation() { return this.getSaturation(); }
    get brightness() { return this.getBrightness(); }
    get background() { return this.getBackground(); }
    get overlay() { return this.getOverlay(); }
    get shadow() { return this.getShadow(); }
    get slider() { return this.getSlider(); }
    get startPos() { return this.getStartPos(); }

    constructor(target, pos) {
        super();
        pos && this.initWithTargetAndPos(target, pos);
    }
    getSaturation() {
        return this._saturation;
    }
    getBrightness() {
        return this._brightness;
    }

    //not sure if these need to be there actually. I suppose someone might want to access the sprite?
    getBackground() {
        return this._background;
    }
    getOverlay() {
        return this._brightness;
    }
    getShadow() {
        return this._shadow;
    }
    getSlider() {
        return this._slider;
    }
    getStartPos() {
        return this._startPos;
    }

    initWithTargetAndPos(target, pos) {
        if (super.init()) {
            // Add background and slider sprites
            this._background = cc.ControlUtils.addSpriteToTargetWithPosAndAnchor("colourPickerBackground.png", target, pos, new cc.Point(0.0, 0.0));
            this._overlay = cc.ControlUtils.addSpriteToTargetWithPosAndAnchor("colourPickerOverlay.png", target, pos, new cc.Point(0.0, 0.0));
            this._shadow = cc.ControlUtils.addSpriteToTargetWithPosAndAnchor("colourPickerShadow.png", target, pos, new cc.Point(0.0, 0.0));
            this._slider = cc.ControlUtils.addSpriteToTargetWithPosAndAnchor("colourPicker.png", target, pos, new cc.Point(0.5, 0.5));

            this._startPos = pos; // starting position of the colour picker
            this._boxPos = 35;    // starting position of the virtual box area for picking a colour
            this._boxSize = this._background.getContentSize().width / 2;    // the size (width and height) of the virtual box for picking a colour from
            return true;
        } else
            return false;
    }

    setEnabled(enabled) {
        super.setEnabled(enabled);
        if (this._slider) {
            this._slider.setOpacity(enabled ? 255 : 128);
        }
    }

    updateWithHSV(hsv) {
        var hsvTemp = new cc.HSV();
        hsvTemp.s = 1;
        hsvTemp.h = hsv.h;
        hsvTemp.v = 1;

        var rgb = cc.ControlUtils.RGBfromHSV(hsvTemp);
        this._background.setColor(new cc.Color(0 | (rgb.r * 255), 0 | (rgb.g * 255), 0 | (rgb.b * 255)));
    }
    updateDraggerWithHSV(hsv) {
        // Set the position of the slider to the correct saturation and brightness
        var pos = new cc.Point(this._startPos.x + this._boxPos + (this._boxSize * (1 - hsv.s)),
            this._startPos.y + this._boxPos + (this._boxSize * hsv.v));

        // update
        this._updateSliderPosition(pos);
    }

    _updateSliderPosition(sliderPosition) {
        // Clamp the position of the icon within the circle

        // Get the center point of the bkgd image
        var centerX = this._startPos.x + this._background.getBoundingBox().width * 0.5;
        var centerY = this._startPos.y + this._background.getBoundingBox().height * 0.5;

        // Work out the distance difference between the location and center
        var dx = sliderPosition.x - centerX;
        var dy = sliderPosition.y - centerY;
        var dist = Math.sqrt(dx * dx + dy * dy);

        // Update angle by using the direction of the location
        var angle = Math.atan2(dy, dx);

        // Set the limit to the slider movement within the colour picker
        var limit = this._background.getBoundingBox().width * 0.5;

        // Check distance doesn't exceed the bounds of the circle
        if (dist > limit) {
            sliderPosition.x = centerX + limit * Math.cos(angle);
            sliderPosition.y = centerY + limit * Math.sin(angle);
        }

        // Set the position of the dragger
        this._slider.setPosition(sliderPosition);


        // Clamp the position within the virtual box for colour selection
        if (sliderPosition.x < this._startPos.x + this._boxPos)
            sliderPosition.x = this._startPos.x + this._boxPos;
        else if (sliderPosition.x > this._startPos.x + this._boxPos + this._boxSize - 1)
            sliderPosition.x = this._startPos.x + this._boxPos + this._boxSize - 1;
        if (sliderPosition.y < this._startPos.y + this._boxPos)
            sliderPosition.y = this._startPos.y + this._boxPos;
        else if (sliderPosition.y > this._startPos.y + this._boxPos + this._boxSize)
            sliderPosition.y = this._startPos.y + this._boxPos + this._boxSize;

        // Use the position / slider width to determin the percentage the dragger is at
        this._saturation = 1.0 - Math.abs((this._startPos.x + this._boxPos - sliderPosition.x) / this._boxSize);
        this._brightness = Math.abs((this._startPos.y + this._boxPos - sliderPosition.y) / this._boxSize);
    }

    _checkSliderPosition(location) {
        // Clamp the position of the icon within the circle
        // get the center point of the bkgd image
        var centerX = this._startPos.x + this._background.getBoundingBox().width * 0.5;
        var centerY = this._startPos.y + this._background.getBoundingBox().height * 0.5;

        // work out the distance difference between the location and center
        var dx = location.x - centerX;
        var dy = location.y - centerY;
        var dist = Math.sqrt(dx * dx + dy * dy);

        // check that the touch location is within the bounding rectangle before sending updates
        if (dist <= this._background.getBoundingBox().width * 0.5) {
            this._updateSliderPosition(location);
            this.sendActionsForControlEvents(cc.CONTROL_EVENT_VALUECHANGED);
            return true;
        }
        return false;
    }

    onTouchBegan(touch, event) {
        if (!this.isEnabled() || !this.isVisible())        {
            return false;
        }
        // Get the touch location
        var touchLocation = this.getTouchLocation(touch);

        // Check the touch position on the slider
        return this._checkSliderPosition(touchLocation);
    }

    onTouchMoved(touch, event) {
        // Get the touch location
        var touchLocation = this.getTouchLocation(touch);

        //small modification: this allows changing of the colour, even if the touch leaves the bounding area
        //this._updateSliderPosition(touchLocation);
        //this.sendActionsForControlEvents(cc.CONTROL_EVENT_VALUECHANGED);
        // Check the touch position on the slider
        this._checkSliderPosition(touchLocation);
    }
};
