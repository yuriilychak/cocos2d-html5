import { Sprite, Point, degreesToRadians, radiansToDegrees } from "@aspect/core";
import { Control } from "./control";
import { CONTROL_EVENT_VALUE_CHANGED } from "./constants";

export class ControlHuePicker extends Control {
    _hue = 0;
    _huePercentage = 0;
    _background = null;
    _slider = null;
    _startPos = null;
    _className = "ControlHuePicker";

    constructor(target, pos) {
        super();
        pos && this.initWithTargetAndPos(target, pos);
    }

    get hue() { 
        return this._hue; 
    }

    set hue(hueValue) {
        this._hue = hueValue;
        this.huePercentage = this._hue / 360.0;
    }

    get huePercentage() { return this._huePercentage; }

    set huePercentage(hueValueInPercent) {
        this._huePercentage = hueValueInPercent;
        this._hue = this._huePercentage * 360.0;
        var backgroundBox = this._background.getBoundingBox();
        var centerX = this._startPos.x + backgroundBox.width * 0.5;
        var centerY = this._startPos.y + backgroundBox.height * 0.5;
        var limit = backgroundBox.width * 0.5 - 15.0;
        var angleDeg = this._huePercentage * 360.0 - 180.0;
        var angle = degreesToRadians(angleDeg);
        var x = centerX + limit * Math.cos(angle);
        var y = centerY + limit * Math.sin(angle);
        this._slider.setPosition(x, y);
    }

    set enabled(enabled) {
        super.setEnabled(enabled);
        if (this._slider) {
            this._slider.setOpacity(enabled ? 255 : 128);
        }
    }

    get enabled() {
        return super.enabled;
    }

    get background() { return this._background; }
    get slider() { return this._slider; }
    get startPos() { return this._startPos; }

    initWithTargetAndPos(target, pos) {
        if (super.init()) {
            this._background = Control.addSpriteToTargetWithPosAndAnchor(new Sprite("#default_theme/color_picker/color.png"), target, pos, new Point(0.0, 0.0));
            this._slider = Control.addSpriteToTargetWithPosAndAnchor(new Sprite("#default_theme/color_picker/picker.png"), target, pos, new Point(0.5, 0.5));
            this._slider.setPosition(pos.x, pos.y + this._background.getBoundingBox().height * 0.5);
            this._startPos = pos;
            this._hue = 0.0;
            this._huePercentage = 0.0;
            return true;
        }
        return false;
    }

    _updateSliderPosition(location) {
        var backgroundBox = this._background.getBoundingBox();
        var centerX = this._startPos.x + backgroundBox.width * 0.5;
        var centerY = this._startPos.y + backgroundBox.height * 0.5;
        var dx = location.x - centerX;
        var dy = location.y - centerY;
        var angle = Math.atan2(dy, dx);
        var angleDeg = radiansToDegrees(angle) + 180.0;
        this.hue = angleDeg;
        this.sendActionsForControlEvents(CONTROL_EVENT_VALUE_CHANGED);
    }

    _checkSliderPosition(location) {
        var distance = Math.sqrt(Math.pow(location.x + 10, 2) + Math.pow(location.y, 2));
        if (80 > distance && distance > 59) {
            this._updateSliderPosition(location);
            return true;
        }
        return false;
    }

    onTouchBegan(touch, event) {
        if (!this.enabled || !this.isVisible())
            return false;
        var touchLocation = this.getTouchLocation(touch);
        return this._checkSliderPosition(touchLocation);
    }

    onTouchMoved(touch, event) {
        var touchLocation = this.getTouchLocation(touch);
        this._checkSliderPosition(touchLocation);
    }
}
