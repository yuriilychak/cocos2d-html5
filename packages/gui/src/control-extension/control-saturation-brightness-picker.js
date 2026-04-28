import { Sprite, Point, Color, degreesToRadians, radiansToDegrees } from "@aspect/core";
import { Control } from "./control";
import { ControlUtils, HSV } from "./control-utils";
import { CONTROL_EVENT_VALUE_CHANGED } from "./constants";

export class ControlSaturationBrightnessPicker extends Control {
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

    getSaturation() { return this._saturation; }
    getBrightness() { return this._brightness; }
    getBackground() { return this._background; }
    getOverlay() { return this._brightness; }
    getShadow() { return this._shadow; }
    getSlider() { return this._slider; }
    getStartPos() { return this._startPos; }

    initWithTargetAndPos(target, pos) {
        if (super.init()) {
            this._background = ControlUtils.addSpriteToTargetWithPosAndAnchor(new Sprite("colourPickerBackground.png"), target, pos, new Point(0.0, 0.0));
            this._overlay = ControlUtils.addSpriteToTargetWithPosAndAnchor(new Sprite("colourPickerOverlay.png"), target, pos, new Point(0.0, 0.0));
            this._shadow = ControlUtils.addSpriteToTargetWithPosAndAnchor(new Sprite("colourPickerShadow.png"), target, pos, new Point(0.0, 0.0));
            this._slider = ControlUtils.addSpriteToTargetWithPosAndAnchor(new Sprite("colourPicker.png"), target, pos, new Point(0.5, 0.5));
            this._startPos = pos;
            this._boxPos = 35;
            this._boxSize = this._background.getContentSize().width / 2;
            return true;
        }
        return false;
    }

    setEnabled(enabled) {
        super.setEnabled(enabled);
        if (this._slider) {
            this._slider.setOpacity(enabled ? 255 : 128);
        }
    }

    updateWithHSV(hsv) {
        var hsvTemp = new HSV();
        hsvTemp.s = 1;
        hsvTemp.h = hsv.h;
        hsvTemp.v = 1;
        var rgb = ControlUtils.RGBfromHSV(hsvTemp);
        this._background.setColor(new Color(0 | (rgb.r * 255), 0 | (rgb.g * 255), 0 | (rgb.b * 255)));
    }

    updateDraggerWithHSV(hsv) {
        var pos = new Point(
            this._startPos.x + this._boxPos + (this._boxSize * (1 - hsv.s)),
            this._startPos.y + this._boxPos + (this._boxSize * hsv.v)
        );
        this._updateSliderPosition(pos);
    }

    _updateSliderPosition(sliderPosition) {
        var centerX = this._startPos.x + this._background.getBoundingBox().width * 0.5;
        var centerY = this._startPos.y + this._background.getBoundingBox().height * 0.5;
        var dx = sliderPosition.x - centerX;
        var dy = sliderPosition.y - centerY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var angle = Math.atan2(dy, dx);
        var limit = this._background.getBoundingBox().width * 0.5;
        if (dist > limit) {
            sliderPosition.x = centerX + limit * Math.cos(angle);
            sliderPosition.y = centerY + limit * Math.sin(angle);
        }
        this._slider.setPosition(sliderPosition);
        if (sliderPosition.x < this._startPos.x + this._boxPos)
            sliderPosition.x = this._startPos.x + this._boxPos;
        else if (sliderPosition.x > this._startPos.x + this._boxPos + this._boxSize - 1)
            sliderPosition.x = this._startPos.x + this._boxPos + this._boxSize - 1;
        if (sliderPosition.y < this._startPos.y + this._boxPos)
            sliderPosition.y = this._startPos.y + this._boxPos;
        else if (sliderPosition.y > this._startPos.y + this._boxPos + this._boxSize)
            sliderPosition.y = this._startPos.y + this._boxPos + this._boxSize;
        this._saturation = 1.0 - Math.abs((this._startPos.x + this._boxPos - sliderPosition.x) / this._boxSize);
        this._brightness = Math.abs((this._startPos.y + this._boxPos - sliderPosition.y) / this._boxSize);
    }

    _checkSliderPosition(location) {
        var centerX = this._startPos.x + this._background.getBoundingBox().width * 0.5;
        var centerY = this._startPos.y + this._background.getBoundingBox().height * 0.5;
        var dx = location.x - centerX;
        var dy = location.y - centerY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= this._background.getBoundingBox().width * 0.5) {
            this._updateSliderPosition(location);
            this.sendActionsForControlEvents(CONTROL_EVENT_VALUE_CHANGED);
            return true;
        }
        return false;
    }

    onTouchBegan(touch, event) {
        if (!this.isEnabled() || !this.isVisible())
            return false;
        var touchLocation = this.getTouchLocation(touch);
        return this._checkSliderPosition(touchLocation);
    }

    onTouchMoved(touch, event) {
        var touchLocation = this.getTouchLocation(touch);
        this._checkSliderPosition(touchLocation);
    }
}
