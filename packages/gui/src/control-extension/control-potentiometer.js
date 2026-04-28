import { Sprite, Point, Color } from "@aspect/core";
import { ProgressTimer } from "@aspect/progress-timer";
import { Control } from "./control";
import { CONTROL_EVENT_VALUE_CHANGED } from "./constants";

export class ControlPotentiometer extends Control {
    _thumbSprite = null;
    _progressTimer = null;
    _previousLocation = null;
    _value = 0;
    _minimumValue = 0;
    _maximumValue = 1;
    _className = "ControlPotentiometer";

    get value() { return this.getValue(); }
    set value(v) { this.setValue(v); }
    get minValue() { return this.getMinimumValue(); }
    set minValue(v) { this.setMinimumValue(v); }
    get maxValue() { return this.getMaximumValue(); }
    set maxValue(v) { this.setMaximumValue(v); }
    get progressTimer() { return this.getProgressTimer(); }
    set progressTimer(v) { this.setProgressTimer(v); }
    get thumbSprite() { return this.getThumbSprite(); }
    set thumbSprite(v) { this.setThumbSprite(v); }
    get prevLocation() { return this.getPreviousLocation(); }
    set prevLocation(v) { this.setPreviousLocation(v); }

    constructor(backgroundFile, progressFile, thumbFile) {
        super();
        if (thumbFile !== undefined) {
            var backgroundSprite = new Sprite(backgroundFile);
            var thumbSprite = new Sprite(thumbFile);
            var progressTimer = new ProgressTimer(new Sprite(progressFile));
            this.initWithTrackSprite_ProgressTimer_ThumbSprite(backgroundSprite, progressTimer, thumbSprite);
        }
    }

    initWithTrackSprite_ProgressTimer_ThumbSprite(trackSprite, progressTimer, thumbSprite) {
        if (this.init()) {
            this.setProgressTimer(progressTimer);
            this.setThumbSprite(thumbSprite);
            this._thumbSprite.setPosition(progressTimer.getPosition());
            this.addChild(thumbSprite, 2);
            this.addChild(progressTimer, 1);
            this.addChild(trackSprite);
            this.setContentSize(trackSprite.getContentSize());
            this._minimumValue = 0.0;
            this._maximumValue = 1.0;
            this.setValue(this._minimumValue);
            return true;
        }
        return false;
    }

    setEnabled(enabled) {
        super.setEnabled(enabled);
        if (this._thumbSprite !== null) {
            this._thumbSprite.setOpacity(enabled ? 255 : 128);
        }
    }

    setValue(value) {
        if (value < this._minimumValue) value = this._minimumValue;
        if (value > this._maximumValue) value = this._maximumValue;
        this._value = value;
        var percent = (value - this._minimumValue) / (this._maximumValue - this._minimumValue);
        this._progressTimer.setPercentage(percent * 100.0);
        this._thumbSprite.setRotation(percent * 360.0);
        this.sendActionsForControlEvents(CONTROL_EVENT_VALUE_CHANGED);
    }

    getValue() { return this._value; }

    setMinimumValue(minimumValue) {
        this._minimumValue = minimumValue;
        if (this._minimumValue >= this._maximumValue) {
            this._maximumValue = this._minimumValue + 1.0;
        }
        this.setValue(this._maximumValue);
    }

    getMinimumValue() { return this._minimumValue; }

    setMaximumValue(maximumValue) {
        this._maximumValue = maximumValue;
        if (this._maximumValue <= this._minimumValue) {
            this._minimumValue = this._maximumValue - 1.0;
        }
        this.setValue(this._minimumValue);
    }

    getMaximumValue() { return this._maximumValue; }

    isTouchInside(touch) {
        var touchLocation = this.getTouchLocation(touch);
        var distance = this.distanceBetweenPointAndPoint(this._progressTimer.getPosition(), touchLocation);
        return distance < Math.min(this.getContentSize().width / 2, this.getContentSize().height / 2);
    }

    onTouchBegan(touch, event) {
        if (!this.isTouchInside(touch) || !this.isEnabled() || !this.isVisible())
            return false;
        this._previousLocation = this.getTouchLocation(touch);
        this.potentiometerBegan(this._previousLocation);
        return true;
    }

    onTouchMoved(touch, event) {
        var location = this.getTouchLocation(touch);
        this.potentiometerMoved(location);
    }

    onTouchEnded(touch, event) {
        this.potentiometerEnded(new Point(0, 0));
    }

    distanceBetweenPointAndPoint(point1, point2) {
        var dx = point1.x - point2.x;
        var dy = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint(beginLineA, endLineA, beginLineB, endLineB) {
        var a = endLineA.x - beginLineA.x;
        var b = endLineA.y - beginLineA.y;
        var c = endLineB.x - beginLineB.x;
        var d = endLineB.y - beginLineB.y;
        var atanA = Math.atan2(a, b);
        var atanB = Math.atan2(c, d);
        return (atanA - atanB) * 180 / Math.PI;
    }

    potentiometerBegan(location) {
        this.setSelected(true);
        this.getThumbSprite().setColor(Color.GRAY);
    }

    potentiometerMoved(location) {
        var angle = this.angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint(
            this._progressTimer.getPosition(), location,
            this._progressTimer.getPosition(), this._previousLocation
        );
        if (angle > 180) angle -= 360;
        else if (angle < -180) angle += 360;
        this.setValue(this._value + angle / 360.0 * (this._maximumValue - this._minimumValue));
        this._previousLocation = location;
    }

    potentiometerEnded(location) {
        this.getThumbSprite().setColor(Color.WHITE);
        this.setSelected(false);
    }

    setThumbSprite(sprite) { this._thumbSprite = sprite; }
    getThumbSprite() { return this._thumbSprite; }
    setProgressTimer(sprite) { this._progressTimer = sprite; }
    getProgressTimer() { return this._progressTimer; }
    setPreviousLocation(point) { this._previousLocation = point; }
    getPreviousLocation() { return this._previousLocation; }
}
