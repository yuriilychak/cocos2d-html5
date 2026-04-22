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
 */

/**
 * ControlSwitch: Switch control ui component
 */
cc.ControlSwitch = class ControlSwitch extends cc.Control {
    /** Sprite which represents the view. */
    _switchSprite = null;
    _initialTouchXPosition = 0;

    _moved = false;
    /** A Boolean value that determines the off/on state of the switch. */
    _on = false;
    _className = "ControlSwitch";
    constructor(maskSprite, onSprite, offSprite, thumbSprite, onLabel, offLabel) {
        super();

        offLabel && this.initWithMaskSprite(maskSprite, onSprite, offSprite, thumbSprite, onLabel, offLabel);
    }

    /** Creates a switch with a mask sprite, on/off sprites for on/off states, a thumb sprite and an on/off labels. */
    initWithMaskSprite(maskSprite, onSprite, offSprite, thumbSprite, onLabel, offLabel) {
        if(!maskSprite)
            throw new Error("cc.ControlSwitch.initWithMaskSprite(): maskSprite should be non-null.");
        if(!onSprite)
            throw new Error("cc.ControlSwitch.initWithMaskSprite(): onSprite should be non-null.");
        if(!offSprite)
            throw new Error("cc.ControlSwitch.initWithMaskSprite(): offSprite should be non-null.");
        if(!thumbSprite)
            throw new Error("cc.ControlSwitch.initWithMaskSprite(): thumbSprite should be non-null.");
        if (this.init()) {
            this._on = true;

            this._switchSprite = new cc.ControlSwitchSprite();
            this._switchSprite.initWithMaskSprite(maskSprite, onSprite, offSprite, thumbSprite, onLabel, offLabel);
            this._switchSprite.setPosition(this._switchSprite.getContentSize().width / 2, this._switchSprite.getContentSize().height / 2);
            this.addChild(this._switchSprite);

            this.ignoreAnchorPointForPosition(false);
            this.setAnchorPoint(0.5, 0.5);
            this.setContentSize(this._switchSprite.getContentSize());
            return true;
        }
        return false;
    }

    setOn(isOn, animated) {
        animated = animated || false;
        this._on = isOn;
        var xPosition = (this._on) ? this._switchSprite.getOnPosition() : this._switchSprite.getOffPosition();
        if(animated){
            this._switchSprite.runAction(new cc.ActionTween(0.2, "sliderXPosition", this._switchSprite.getSliderXPosition(),xPosition));
        }else{
            this._switchSprite.setSliderXPosition(xPosition);
        }
        this.sendActionsForControlEvents(cc.CONTROL_EVENT_VALUECHANGED);
    }

    isOn() {
        return this._on;
    }

    hasMoved() {
        return this._moved;
    }

    setEnabled(enabled) {
        this._enabled = enabled;

        this._switchSprite.setOpacity((enabled) ? 255 : 128);
    }

    locationFromTouch(touch) {
        var touchLocation = touch.getLocation();                      // Get the touch position
        touchLocation = this.convertToNodeSpace(touchLocation);                  // Convert to the node space of this class

        return touchLocation;
    }

    onTouchBegan(touch, event) {
        if (!this.isTouchInside(touch)  || !this.isEnabled()|| !this.isVisible()) {
            return false;
        }

        this._moved = false;

        var location = this.locationFromTouch(touch);

        this._initialTouchXPosition = location.x - this._switchSprite.getSliderXPosition();

        this._switchSprite.getThumbSprite().setColor(cc.color.GRAY);
        this._switchSprite.needsLayout();

        return true;
    }

    onTouchMoved(touch, event) {
        var location = this.locationFromTouch(touch);
        location = cc.p(location.x - this._initialTouchXPosition, 0);

        this._moved = true;

        this._switchSprite.setSliderXPosition(location.x);
    }

    onTouchEnded(touch, event) {
        var location = this.locationFromTouch(touch);

        this._switchSprite.getThumbSprite().setColor(cc.color.WHITE);

        if (this.hasMoved()) {
            this.setOn(!(location.x < this._switchSprite.getContentSize().width / 2), true);
        } else {
            this.setOn(!this._on, true);
        }
    }

    onTouchCancelled(touch, event) {
        var location = this.locationFromTouch(touch);

        this._switchSprite.getThumbSprite().setColor(cc.color.WHITE);

        if (this.hasMoved()) {
            this.setOn(!(location.x < this._switchSprite.getContentSize().width / 2), true);
        } else {
            this.setOn(!this._on, true);
        }
    }
};

/**
 * ControlSwitchSprite: Sprite switch control ui component
 *
 * @property {Number}           sliderX         - Slider's x position
 * @property {cc.Point}         onPos           - The position of slider when switch is on
 * @property {cc.Point}         offPos          - The position of slider when switch is off
 * @property {cc.Texture2D}     maskTexture     - The texture of the mask
 * @property {cc.Point}         texturePos      - The position of the texture
 * @property {cc.Point}         maskPos         - The position of the mask
 * @property {cc.Sprite}        onSprite        - The sprite of switch on
 * @property {cc.Sprite}        offSprite       - The sprite of switch off
 * @property {cc.Sprite}        thumbSprite     - The thumb sprite of the switch control
 * @property {cc.LabelTTF}      onLabel         - The sprite of switch on
 * @property {cc.LabelTTF}      offLabel        - The sprite of switch off
 * @property {Number}           onSideWidth     - <@readonly> The width of the on side of the switch control
 * @property {Number}           offSideWidth    - <@readonly> The width of the off side of the switch control
 */
cc.ControlSwitchSprite = class ControlSwitchSprite extends cc.Sprite {
    _sliderXPosition = 0;
    _onPosition = 0;
    _offPosition = 0;

    _textureLocation = 0;
    _maskLocation = 0;
    _maskSize = null;

    _onSprite = null;
    _offSprite = null;
    _thumbSprite = null;
    _onLabel = null;
    _offLabel = null;
    _clipper = null;
    _stencil = null;
    _backRT = null;

    get sliderX() { return this.getSliderXPosition(); }
    set sliderX(v) { this.setSliderXPosition(v); }
    get onPos() { return this.getOnPosition(); }
    set onPos(v) { this.setOnPosition(v); }
    get offPos() { return this.getOffPosition(); }
    set offPos(v) { this.setOffPosition(v); }
    get maskTexture() { return this.getMaskTexture(); }
    set maskTexture(v) { this.setMaskTexture(v); }
    get maskPos() { return this.getMaskLocation(); }
    set maskPos(v) { this.setMaskLocation(v); }
    get onSprite() { return this.getOnSprite(); }
    set onSprite(v) { this.setOnSprite(v); }
    get offSprite() { return this.getOffSprite(); }
    set offSprite(v) { this.setOffSprite(v); }
    get thumbSprite() { return this.getThumbSprite(); }
    set thumbSprite(v) { this.setThumbSprite(v); }
    get onLabel() { return this.getOnLabel(); }
    set onLabel(v) { this.setOnLabel(v); }
    get offLabel() { return this.getOffLabel(); }
    set offLabel(v) { this.setOffLabel(v); }
    get onSideWidth() { return this._getOnSideWidth(); }
    get offSideWidth() { return this._getOffSideWidth(); }

    constructor() {
        super();
        this._sliderXPosition = 0;
        this._onPosition = 0;
        this._offPosition = 0;
        this._maskLocation = 0;
        this._maskSize = cc.size(0, 0);
        this._onSprite = null;
        this._offSprite = null;
        this._thumbSprite = null;
        this._onLabel = null;
        this._offLabel = null;
    }

    initWithMaskSprite(maskSprite, onSprite, offSprite, thumbSprite, onLabel, offLabel) {
        if (super.init()) {
            this.setSpriteFrame(maskSprite.displayFrame());
            // Sets the default values
            this._onPosition = 0;
            this._offPosition = -onSprite.getContentSize().width + thumbSprite.getContentSize().width / 2;
            this._sliderXPosition = this._onPosition;

            this.setOnSprite(onSprite);
            this.setOffSprite(offSprite);
            this.setThumbSprite(thumbSprite);
            this.setOnLabel(onLabel);
            this.setOffLabel(offLabel);

            // Set up the mask with the Mask shader
            this._stencil = maskSprite;
            var maskSize = this._maskSize = this._stencil.getContentSize();
            this._stencil.setPosition(0, 0);

            // Init clipper for mask
            this._clipper = new cc.ClippingNode();
            this._clipper.setAnchorPoint(0.5, 0.5);
            this._clipper.setPosition(maskSize.width / 2, maskSize.height / 2);
            this._clipper.setStencil(this._stencil);
            this.addChild(this._clipper);

            this._clipper.addChild(onSprite);
            this._clipper.addChild(offSprite);
            this._clipper.addChild(onLabel);
            this._clipper.addChild(offLabel);

            this.addChild(this._thumbSprite);

            this.needsLayout();
            return true;
        }
        return false;
    }

    needsLayout() {
        var maskSize = this._maskSize;
        this._onSprite.setPosition(
            this._onSprite.getContentSize().width / 2 + this._sliderXPosition - maskSize.width / 2,
            this._onSprite.getContentSize().height / 2 - maskSize.height / 2
        );
        this._offSprite.setPosition(
            this._onSprite.getContentSize().width + this._offSprite.getContentSize().width / 2 + this._sliderXPosition - maskSize.width / 2,
            this._offSprite.getContentSize().height / 2 - maskSize.height / 2
        );

        if (this._onLabel) {
            this._onLabel.setPosition(
                this._onSprite.getPositionX() - this._thumbSprite.getContentSize().width / 6,
                this._onSprite.getContentSize().height / 2 - maskSize.height / 2
            );
        }
        if (this._offLabel) {
            this._offLabel.setPosition(
                this._offSprite.getPositionX() + this._thumbSprite.getContentSize().width / 6,
                this._offSprite.getContentSize().height / 2 - maskSize.height / 2
            );
        }
        this._thumbSprite.setPosition(
            this._onSprite.getContentSize().width + this._sliderXPosition,
            this._maskSize.height / 2
        );
    }

    setSliderXPosition(sliderXPosition) {
        if (sliderXPosition <= this._offPosition) {
            // Off
            sliderXPosition = this._offPosition;
        } else if (sliderXPosition >= this._onPosition) {
            // On
            sliderXPosition = this._onPosition;
        }

        this._sliderXPosition = sliderXPosition;

        this.needsLayout();
    }
    getSliderXPosition() {
        return this._sliderXPosition;
    }

    _getOnSideWidth() {
        return this._onSprite.getContentSize().width;
    }

    _getOffSideWidth() {
        return this._offSprite.getContentSize().height;
    }

    updateTweenAction(value, key) {
        if (key === "sliderXPosition")
            this.setSliderXPosition(value);
    }

    setOnPosition(onPosition) {
        this._onPosition = onPosition;
    }
    getOnPosition() {
        return this._onPosition;
    }

    setOffPosition(offPosition) {
        this._offPosition = offPosition;
    }
    getOffPosition() {
        return this._offPosition;
    }

    setMaskTexture(maskTexture) {
        this._stencil.setTexture(maskTexture);
    }
    getMaskTexture() {
        return this._stencil.getTexture();
    }

    setTextureLocation(textureLocation) {
        this._textureLocation = textureLocation;
    }
    getTextureLocation() {
        return this._textureLocation;
    }

    setMaskLocation(maskLocation) {
        this._maskLocation = maskLocation;
    }
    getMaskLocation() {
        return this._maskLocation;
    }

    setOnSprite(onSprite) {
        this._onSprite = onSprite;
    }
    getOnSprite() {
        return this._onSprite;
    }

    setOffSprite(offSprite) {
        this._offSprite = offSprite;
    }
    getOffSprite() {
        return this._offSprite;
    }

    setThumbSprite(thumbSprite) {
        this._thumbSprite = thumbSprite;
    }
    getThumbSprite() {
        return this._thumbSprite;
    }

    setOnLabel(onLabel) {
        this._onLabel = onLabel;
    }
    getOnLabel() {
        return this._onLabel;
    }

    setOffLabel(offLabel) {
        this._offLabel = offLabel;
    }
    getOffLabel() {
        return this._offLabel;
    }
};
