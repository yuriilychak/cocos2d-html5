import { Sprite, Rect, Color, Point } from "@aspect/core";
import { Control } from "./control";
import { ControlUtils } from "./control-utils";
import { CONTROL_EVENT_VALUE_CHANGED } from "./constants";

export class ControlSlider extends Control {
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
        if (thumbFile !== undefined) {
            var bgSprite = new Sprite(bgFile);
            var progressSprite = new Sprite(progressFile);
            var thumbSprite = new Sprite(thumbFile);
            this.initWithSprites(bgSprite, progressSprite, thumbSprite);
        }
    }

    getValue() { return this._value; }

    setValue(value) {
        value = Math.max(value, this._minimumValue);
        value = Math.min(value, this._maximumValue);
        this._value = value;
        this.needsLayout();
        this.sendActionsForControlEvents(CONTROL_EVENT_VALUE_CHANGED);
    }

    getMinimumValue() { return this._minimumValue; }

    setMinimumValue(minimumValue) {
        this._minimumValue = minimumValue;
        this._minimumAllowedValue = minimumValue;
        if (this._minimumValue >= this._maximumValue)
            this._maximumValue = this._minimumValue + 1.0;
        this.setValue(this._value);
    }

    getMaximumValue() { return this._maximumValue; }

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
        return Rect.containsPoint(rect, touchLocation);
    }

    locationFromTouch(touch) {
        var touchLocation = touch.getLocation();
        touchLocation = this.convertToNodeSpace(touchLocation);
        if (touchLocation.x < 0) {
            touchLocation.x = 0;
        } else if (touchLocation.x > this._backgroundSprite.getContentSize().width) {
            touchLocation.x = this._backgroundSprite.getContentSize().width;
        }
        return touchLocation;
    }

    getMinimumAllowedValue() { return this._minimumAllowedValue; }
    setMinimumAllowedValue(val) { this._minimumAllowedValue = val; }
    getMaximumAllowedValue() { return this._maximumAllowedValue; }
    setMaximumAllowedValue(val) { this._maximumAllowedValue = val; }
    getThumbSprite() { return this._thumbSprite; }
    getProgressSprite() { return this._progressSprite; }
    getBackgroundSprite() { return this._backgroundSprite; }

    initWithSprites(backgroundSprite, progressSprite, thumbSprite) {
        if (super.init()) {
            this.ignoreAnchorPointForPosition(false);
            this._backgroundSprite = backgroundSprite;
            this._progressSprite = progressSprite;
            this._thumbSprite = thumbSprite;
            var maxRect = ControlUtils.CCRectUnion(backgroundSprite.getBoundingBox(), thumbSprite.getBoundingBox());
            this.setContentSize(maxRect.width, maxRect.height);
            this._backgroundSprite.setAnchorPoint(0.5, 0.5);
            this._backgroundSprite.setPosition(maxRect.width / 2, maxRect.height / 2);
            this.addChild(this._backgroundSprite);
            this._progressSprite.setAnchorPoint(0.0, 0.5);
            this._progressSprite.setPosition(0, maxRect.height / 2);
            this.addChild(this._progressSprite);
            this._thumbSprite.setPosition(0, maxRect.height / 2);
            this.addChild(this._thumbSprite);
            this._minimumValue = 0.0;
            this._maximumValue = 1.0;
            this.setValue(this._minimumValue);
            return true;
        }
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
        this._thumbSprite.setColor(Color.GRAY);
        this.setValue(this.valueForLocation(location));
    }

    sliderMoved(location) {
        this.setValue(this.valueForLocation(location));
    }

    sliderEnded(location) {
        if (this.isSelected()) {
            this.setValue(this.valueForLocation(this._thumbSprite.getPosition()));
        }
        this._thumbSprite.setColor(Color.WHITE);
        this.setSelected(false);
    }

    onTouchBegan(touch, event) {
        if (!this.isTouchInside(touch) || !this.isEnabled() || !this.isVisible())
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
        this.sliderEnded(new Point(0, 0));
    }

    needsLayout() {
        var percent = (this._value - this._minimumValue) / (this._maximumValue - this._minimumValue);
        this._thumbSprite.setPositionX(percent * this._backgroundSprite.getContentSize().width);
        var textureRect = this._progressSprite.getTextureRect();
        textureRect = new Rect(textureRect.x, textureRect.y, this._thumbSprite.getPositionX(), textureRect.height);
        this._progressSprite.setTextureRect(textureRect, this._progressSprite.isTextureRectRotated());
        this._thumbSprite._renderCmd.transform(this._renderCmd);
    }

    valueForLocation(location) {
        var percent = location.x / this._backgroundSprite.getContentSize().width;
        return Math.max(Math.min(this._minimumValue + percent * (this._maximumValue - this._minimumValue), this._maximumAllowedValue), this._minimumAllowedValue);
    }
}
