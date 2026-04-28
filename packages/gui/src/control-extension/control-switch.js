import { Sprite, Point, Size, Color } from "@aspect/core";
import { ClippingNode } from "@aspect/clipping-nodes";
import { ActionTween } from "@aspect/actions";
import { Control } from "./control";
import { CONTROL_EVENT_VALUE_CHANGED } from "./constants";

export class ControlSwitch extends Control {
    _switchSprite = null;
    _initialTouchXPosition = 0;
    _moved = false;
    _on = false;
    _className = "ControlSwitch";

    constructor(maskSprite, onSprite, offSprite, thumbSprite, onLabel, offLabel) {
        super();
        offLabel && this.initWithMaskSprite(maskSprite, onSprite, offSprite, thumbSprite, onLabel, offLabel);
    }

    initWithMaskSprite(maskSprite, onSprite, offSprite, thumbSprite, onLabel, offLabel) {
        if (!maskSprite) throw new Error("ControlSwitch.initWithMaskSprite(): maskSprite should be non-null.");
        if (!onSprite) throw new Error("ControlSwitch.initWithMaskSprite(): onSprite should be non-null.");
        if (!offSprite) throw new Error("ControlSwitch.initWithMaskSprite(): offSprite should be non-null.");
        if (!thumbSprite) throw new Error("ControlSwitch.initWithMaskSprite(): thumbSprite should be non-null.");
        if (this.init()) {
            this._on = true;
            this._switchSprite = new ControlSwitchSprite();
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
        if (animated) {
            this._switchSprite.runAction(new ActionTween(0.2, "sliderXPosition", this._switchSprite.getSliderXPosition(), xPosition));
        } else {
            this._switchSprite.setSliderXPosition(xPosition);
        }
        this.sendActionsForControlEvents(CONTROL_EVENT_VALUE_CHANGED);
    }

    isOn() { return this._on; }
    hasMoved() { return this._moved; }

    setEnabled(enabled) {
        this._enabled = enabled;
        this._switchSprite.setOpacity(enabled ? 255 : 128);
    }

    locationFromTouch(touch) {
        var touchLocation = touch.getLocation();
        touchLocation = this.convertToNodeSpace(touchLocation);
        return touchLocation;
    }

    onTouchBegan(touch, event) {
        if (!this.isTouchInside(touch) || !this.isEnabled() || !this.isVisible())
            return false;
        this._moved = false;
        var location = this.locationFromTouch(touch);
        this._initialTouchXPosition = location.x - this._switchSprite.getSliderXPosition();
        this._switchSprite.getThumbSprite().setColor(Color.GRAY);
        this._switchSprite.needsLayout();
        return true;
    }

    onTouchMoved(touch, event) {
        var location = this.locationFromTouch(touch);
        location = new Point(location.x - this._initialTouchXPosition, 0);
        this._moved = true;
        this._switchSprite.setSliderXPosition(location.x);
    }

    onTouchEnded(touch, event) {
        var location = this.locationFromTouch(touch);
        this._switchSprite.getThumbSprite().setColor(Color.WHITE);
        if (this.hasMoved()) {
            this.setOn(!(location.x < this._switchSprite.getContentSize().width / 2), true);
        } else {
            this.setOn(!this._on, true);
        }
    }

    onTouchCancelled(touch, event) {
        var location = this.locationFromTouch(touch);
        this._switchSprite.getThumbSprite().setColor(Color.WHITE);
        if (this.hasMoved()) {
            this.setOn(!(location.x < this._switchSprite.getContentSize().width / 2), true);
        } else {
            this.setOn(!this._on, true);
        }
    }
}

export class ControlSwitchSprite extends Sprite {
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
        this._maskSize = new Size(0, 0);
    }

    initWithMaskSprite(maskSprite, onSprite, offSprite, thumbSprite, onLabel, offLabel) {
        if (super.init()) {
            this.setSpriteFrame(maskSprite.displayFrame());
            this._onPosition = 0;
            this._offPosition = -onSprite.getContentSize().width + thumbSprite.getContentSize().width / 2;
            this._sliderXPosition = this._onPosition;
            this.setOnSprite(onSprite);
            this.setOffSprite(offSprite);
            this.setThumbSprite(thumbSprite);
            this.setOnLabel(onLabel);
            this.setOffLabel(offLabel);
            this._stencil = maskSprite;
            var maskSize = this._maskSize = this._stencil.getContentSize();
            this._stencil.setPosition(0, 0);
            this._clipper = new ClippingNode();
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
            sliderXPosition = this._offPosition;
        } else if (sliderXPosition >= this._onPosition) {
            sliderXPosition = this._onPosition;
        }
        this._sliderXPosition = sliderXPosition;
        this.needsLayout();
    }

    getSliderXPosition() { return this._sliderXPosition; }

    _getOnSideWidth() { return this._onSprite.getContentSize().width; }
    _getOffSideWidth() { return this._offSprite.getContentSize().height; }

    updateTweenAction(value, key) {
        if (key === "sliderXPosition")
            this.setSliderXPosition(value);
    }

    setOnPosition(onPosition) { this._onPosition = onPosition; }
    getOnPosition() { return this._onPosition; }
    setOffPosition(offPosition) { this._offPosition = offPosition; }
    getOffPosition() { return this._offPosition; }
    setMaskTexture(maskTexture) { this._stencil.setTexture(maskTexture); }
    getMaskTexture() { return this._stencil.getTexture(); }
    setTextureLocation(textureLocation) { this._textureLocation = textureLocation; }
    getTextureLocation() { return this._textureLocation; }
    setMaskLocation(maskLocation) { this._maskLocation = maskLocation; }
    getMaskLocation() { return this._maskLocation; }
    setOnSprite(onSprite) { this._onSprite = onSprite; }
    getOnSprite() { return this._onSprite; }
    setOffSprite(offSprite) { this._offSprite = offSprite; }
    getOffSprite() { return this._offSprite; }
    setThumbSprite(thumbSprite) { this._thumbSprite = thumbSprite; }
    getThumbSprite() { return this._thumbSprite; }
    setOnLabel(onLabel) { this._onLabel = onLabel; }
    getOnLabel() { return this._onLabel; }
    setOffLabel(offLabel) { this._offLabel = offLabel; }
    getOffLabel() { return this._offLabel; }
}
