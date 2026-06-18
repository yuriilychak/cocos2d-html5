import { Sprite, Point, Color } from "@aspect/core";
import { ProgressTimer } from "@aspect/progress-timer";
import { Control } from "./control";
import { CONTROL_EVENT_VALUE_CHANGED } from "./constants";

export class ControlPotentiometer extends Control {
  _thumb = null;
  _progressTimer = null;
  _background = null;
  _previousLocation = null;
  _value = 0;
  _minimumValue = 0;
  _maximumValue = 1;
  _className = "PotentiometerComponent";

  constructor(backgroundFile, progressFile, thumbFile) {
    super();

    if (thumbFile !== undefined) {
      var backgroundSprite = new Sprite(backgroundFile);
      var thumbSprite = new Sprite(thumbFile);
      var progressTimer = new ProgressTimer(new Sprite(progressFile));
      this.initWithTrackSprite_ProgressTimer_ThumbSprite(
        backgroundSprite,
        progressTimer,
        thumbSprite
      );
    }
  }

  initWithTrackSprite_ProgressTimer_ThumbSprite(
    trackSprite,
    progressTimer,
    thumbSprite
  ) {
    if (this.init()) {
      this.progressTimer = progressTimer;
      this.thumb = thumbSprite;
      this.thumb.setPosition(progressTimer.getPosition());
      this.background = trackSprite;
      this.addChild(thumbSprite, 2);
      this.addChild(progressTimer, 1);
      this.addChild(trackSprite);
      this.setContentSize(trackSprite.getContentSize());
      this._minimumValue = 0.0;
      this._maximumValue = 1.0;
      this.value = this._minimumValue;
      return true;
    }
    return false;
  }

  isTouchInside(touch) {
    var touchLocation = this.getTouchLocation(touch);
    var distance = this.distanceBetweenPointAndPoint(
      this._progressTimer.getPosition(),
      touchLocation
    );
    return (
      distance <
      Math.min(
        this.getContentSize().width / 2,
        this.getContentSize().height / 2
      )
    );
  }

  onTouchBegan(touch, event) {
    if (!this.isTouchInside(touch) || !this.enabled || !this.visible)
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

  angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint(
    beginLineA,
    endLineA,
    beginLineB,
    endLineB
  ) {
    var a = endLineA.x - beginLineA.x;
    var b = endLineA.y - beginLineA.y;
    var c = endLineB.x - beginLineB.x;
    var d = endLineB.y - beginLineB.y;
    var atanA = Math.atan2(a, b);
    var atanB = Math.atan2(c, d);
    return ((atanA - atanB) * 180) / Math.PI;
  }

  potentiometerBegan(location) {
    this.selected = true;
    this.thumb.color = Color.GRAY;
  }

  potentiometerMoved(location) {
    var angle =
      this.angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint(
        this._progressTimer.getPosition(),
        location,
        this._progressTimer.getPosition(),
        this._previousLocation
      );
    if (angle > 180) angle -= 360;
    else if (angle < -180) angle += 360;
    this.value =
      this._value + (angle / 360.0) * (this._maximumValue - this._minimumValue);
    this._previousLocation = location;
  }

  potentiometerEnded(location) {
    this.thumb.color = Color.WHITE;
    this.selected = false;
  }

  set thumb(value) {
    this._thumb = value;
  }
  get thumb() {
    return this._thumb;
  }
  set progressTimer(value) {
    this._progressTimer = value;
  }
  get progressTimer() {
    return this._progressTimer;
  }
  set previousLocation(value) {
    this._previousLocation = value;
  }
  get previousLocation() {
    return this._previousLocation;
  }
  get background() {
    return this._background;
  }
  set background(value) {
    this._background = value;
  }

  set value(value) {
    if (value < this._minimumValue) value = this._minimumValue;
    if (value > this._maximumValue) value = this._maximumValue;
    this._value = value;
    var percent =
      (value - this._minimumValue) / (this._maximumValue - this._minimumValue);
    this._progressTimer.setPercentage(percent * 100.0);
    this._thumb.rotation = percent * 360;
    this.sendActionsForControlEvents(CONTROL_EVENT_VALUE_CHANGED);
  }

  get value() {
    return this._value;
  }

  set minimumValue(minimumValue) {
    this._minimumValue = minimumValue;
    if (this._minimumValue >= this._maximumValue) {
      this._maximumValue = this._minimumValue + 1.0;
    }
    this.value = this._maximumValue;
  }

  get minimumValue() {
    return this._minimumValue;
  }

  set maximumValue(maximumValue) {
    this._maximumValue = maximumValue;
    if (this._maximumValue <= this._minimumValue) {
      this._minimumValue = this._maximumValue - 1.0;
    }
    this.value = this._minimumValue;
  }

  get maximumValue() {
    return this._maximumValue;
  }

  set enabled(enabled) {
    super.enabled = enabled;
    if (this._thumb !== null) {
      this._thumb.enabled = enabled;
    }

    if(this._progressTimer !== null) {
      this._progressTimer.enabled = enabled;
    }
  }

  get enabled() {
    return super.enabled;
  }
}
