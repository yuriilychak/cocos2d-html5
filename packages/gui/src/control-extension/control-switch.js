import { Point, Size } from "@aspect/core";
import { ActionTween } from "@aspect/actions";
import { Control } from "./control";
import { CONTROL_EVENT_VALUE_CHANGED } from "./constants";

export class ControlSwitch extends Control {
  _initialTouchXPosition = 0;
  _moved = false;
  _on = false;
  _minX = 0;
  _maxX = 0;
  _sliderXPosition = 0;
  _onProgress = null;
  _offProgress = null;
  _thumb = null;
  _background = null;
  _className = "SwitchComponent";

  constructor(width, height, maskSprite, onSprite, offSprite, thumbSprite) {
    super();
    this.initWithSprite(
      width,
      height,
      maskSprite,
      onSprite,
      offSprite,
      thumbSprite
    );
  }

  initWithSprite(width, height, background, onProgress, offProgress, thumb) {
    if (this.init()) {
      this._on = true;
      this.setContentSize(new Size(width, height));

      this._onProgress = onProgress;
      this._offProgress = offProgress;
      this._thumb = thumb;
      this._background = background;
      this._minX = thumb.getContentSize().width / 2;
      this._maxX = width - thumb.getContentSize().width / 2;

      this.addChild(this._background);
      this.addChild(this._onProgress);
      this.addChild(this._offProgress);
      this.addChild(this._thumb);
      this.needsLayout();

      return true;
    }

    return false;
  }

  setOn(isOn, animated) {
    animated = animated || false;
    this._on = isOn;
    var xPosition = this._on ? this._maxX : this._minX;
    if (animated) {
      this.runAction(new ActionTween(0.2, "sliderX", this.sliderX, xPosition));
    } else {
      this.sliderX = xPosition;
    }
    this.sendActionsForControlEvents(CONTROL_EVENT_VALUE_CHANGED);
  }

  get isOn() {
    return this._on;
  }
  get hasMoved() {
    return this._moved;
  }

  set enabled(enabled) {
    super.enabled = enabled;

    if (this._thumb !== null) {
      this._thumb.enabled = enabled;
    }

    if (this._onProgress !== null) {
      this._onProgress.enabled = enabled;
    }

    if (this._offProgress !== null) {
      this._offProgress.enabled = enabled;
    }
  }

  get enabled() {
    return super.enabled;
  }

  locationFromTouch(touch) {
    return this.convertToNodeSpace(touch);
  }

  onTouchBegan(touch, event) {
    if (!this.isTouchInside(touch) || !this.enabled || !this.visible)
      return false;
    this._moved = false;
    var location = this.locationFromTouch(touch);
    this._initialTouchXPosition = location.x - this.sliderX;
    this.needsLayout();
    return true;
  }

  onTouchMoved(touch, event) {
    var location = this.locationFromTouch(touch);
    location = new Point(location.x - this._initialTouchXPosition, 0);
    this._moved = true;
    this.sliderX = location.x;
  }

  onTouchEnded(touch, event) {
    var location = this.locationFromTouch(touch);

    if (this.hasMoved) {
      this.setOn(!(location.x < this.getContentSize().width / 2), true);
    } else {
      this.setOn(!this._on, true);
    }
  }

  onTouchCancelled(touch, event) {
    var location = this.locationFromTouch(touch);

    if (this.hasMoved()) {
      this.setOn(!(location.x < this.getContentSize().width / 2), true);
    } else {
      this.setOn(!this._on, true);
    }
  }

  needsLayout() {
    const size = this.getContentSize();

    if (this._background !== null) {
      this._background.width = size.width;
      this._background.height = size.height;
      this._background.setAnchorPoint(new Point(0, 0));
      this._background.x = 0;
      this._background.y = 0;
    }

    if (this._onProgress !== null) {
      this._onProgress.width = this._sliderXPosition;
      this._onProgress.height = size.height;
      this._onProgress.setAnchorPoint(new Point(0, 0));
      this._onProgress.x = 0;
      this._onProgress.y = 0;
    }

    if (this._offProgress !== null) {
      this._offProgress.width = size.width - this._sliderXPosition;
      this._offProgress.x = this._sliderXPosition;
      this._offProgress.height = size.height;
      this._offProgress.setAnchorPoint(new Point(0, 0));
      this._offProgress.y = 0;
    }

    if (this._thumb !== null) {
      this._thumb.x = this._sliderXPosition;
      this._thumb.setAnchorPoint(new Point(0.5, 0.5));
      this._thumb.y = size.height / 2;
    }
  }

  updateTweenAction(value, key) {
    if (key === "sliderX") {
      this.sliderX = value;
    }
  }

  set sliderX(sliderXPosition) {
    this._sliderXPosition = Math.min(
      Math.max(sliderXPosition, this._minX),
      this._maxX
    );
    this.needsLayout();
  }

  get sliderX() {
    return this._sliderXPosition;
  }

  get minX() {
    return this._minX;
  }

  get maxX() {
    return this._maxX;
  }

  set onProgress(onProgress) {
    this._onProgress = onProgress;
  }
  get onProgress() {
    return this._onProgress;
  }
  set offProgress(offProgress) {
    this._offProgress = offProgress;
  }
  get offProgress() {
    return this._offProgress;
  }
  set thumb(value) {
    this._thumb = value;
  }
  get thumb() {
    return this._thumb;
  }
  get background() {
    return this._background;
  }
  set background(value) {
    this._background = value;
  }
}
