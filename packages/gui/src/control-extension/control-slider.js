import { Rect, Size, Point } from "@aspect/core";
import { Scale9Sprite } from "@aspect/ccui";
import { Control } from "./control";
import { CONTROL_EVENT_VALUE_CHANGED } from "./constants";

export class ControlSlider extends Control {
  _values = null;
  _thumb = null;
  _progress = null;
  _background = null;
  _className = "SliderComponent";
  _thumbOffset = null;
  _progressSize = null;
  _backgroundPadding = null;

  constructor(
    progessWidth,
    progressHeight,
    minimumValue,
    maximumValue,
    backgroundPadding = new Rect(0, 0, 0, 0),
    thumbOffset = new Point(0, 0)
  ) {
    super();
    this._thumbOffset = thumbOffset;
    this._progressSize = new Size(progessWidth, progressHeight);
    this._backgroundPadding = backgroundPadding;
    this._values = new Float32Array([
      minimumValue,
      minimumValue,
      maximumValue,
      minimumValue,
      maximumValue
    ]);

    this.setContentSize(progessWidth, progressHeight);

    super.init();
  }

  initWithSprites(backgroundSprite, thumbSprite = null, progressSprite = null) {
    this._background = backgroundSprite;
    this._thumb = thumbSprite;
    this._progress = progressSprite;

    if (this._background) {
      this.addChild(this._background);
      this._background.setAnchorPoint(0, 0);
    }

    if (this._progress) {
      this.addChild(this._progress);
      this._progress.setAnchorPoint(0, 0);
    }

    if (this._thumb) {
      this.addChild(this._thumb);
      this._thumb.setAnchorPoint(0.5, 0.5);
    }

    this.refresh();
  }

  refresh() {
    this._values[0] = Math.min(
      Math.max(this._values[0], this.minimumAllowedValue),
      this.maximumAllowedValue
    );
    this.doLayout();
    this.sendActionsForControlEvents(CONTROL_EVENT_VALUE_CHANGED);
  }

  isTouchInside(touch) {
    const touchLocation = this.getParent().convertToNodeSpace(touch.getLocation());
    const rect = this.getBoundingBox();
    const thumbSize = this._thumb !== null ? this._thumb.getContentSize() : Size.ZERO;
    rect.width += thumbSize.width;
    rect.x -= thumbSize.width / 2;

    return Rect.containsPoint(rect, touchLocation);
  }

  locationFromTouch(touch) {
    const touchLocation = this.convertToNodeSpace(touch.getLocation());

    touchLocation.x = Math.min(
      this._progressSize.width,
      Math.max(0, touchLocation.x)
    );

    return touchLocation;
  }

  onTouchBegan(touch, event) {
    if (!this.isTouchInside(touch) || !this.enabled || !this.isVisible()) {
      return false;
    }

    const location = this.locationFromTouch(touch);
    this.setSelected(true);
    this.value = this.valueForLocation(location);

    return true;
  }

  onTouchMoved(touch, event) {
    var location = this.locationFromTouch(touch);
    this.value = this.valueForLocation(location);
  }

  onTouchEnded(touch, event) {
    if (this.isSelected() && this._thumb !== null) {
      this.value = this.valueForLocation(this._thumb.getPosition());
    }

    this.setSelected(false);
  }

  doLayout() {
    const percent = this.percentage;

    if (this._thumb !== null) {
      this._thumb.x =
        percent * this._progressSize.width + this._thumbOffset.x;
      this._thumb.y =
        this._thumbOffset.y + this._progressSize.height / 2.0;
    }

    if (this._progress !== null) {
      if (this._progress instanceof Scale9Sprite) {
        this._progress.setPreferredSize(
            percent * this._progressSize.width,
            this._progressSize.height
        );
      } else {
        var textureRect = this._progress.getTextureRect();
        textureRect = new Rect(
          textureRect.x,
          textureRect.y,
          percent * this._progressSize.width,
          textureRect.height
        );
        this._progress.setTextureRect(
          textureRect,
          this._progress.isTextureRectRotated()
        );
      }
    }

    if (this._background !== null) {
      this._background.setPreferredSize(
        new Size(
          this._progressSize.width + this._backgroundPadding.width,
          this._progressSize.height + this._backgroundPadding.height
        )
      );
      this._background.setPosition(
        -this._backgroundPadding.x,
        -this._backgroundPadding.y
      );
    }
  }

  valueForLocation(location) {
    const percent = location.x / this._progressSize.width;
    const currentValue =
      this.minimumValue + percent * (this.maximumValue - this.minimumValue);

    return Math.max(
      Math.min(currentValue, this.maximumAllowedValue),
      this.minimumAllowedValue
    );
  }

  get thumbSprite() {
    return this._thumb;
  }

  set thumbSprite(value) {
    this._thumb = value;
  }

  get progressSprite() {
    return this._progress;
  }

  set progressSprite(value) {
    this._progress = value;
  }

  get backgroundSprite() {
    return this._background;
  }

  set backgroundSprite(value) {
    this._background = value;
  }

  get percentage() {
    const acceptedValue = Math.min(
      Math.max(this.value, this.minimumAllowedValue),
      this.maximumAllowedValue
    );

    return (
      (acceptedValue - this.minimumValue) /
      (this.maximumValue - this.minimumValue)
    );
  }

  get progressWidth() {
    return this._progressSize.width;
  }

  set progressWidth(value) {
    this._progressSize.width = value;
  }

  get progressHeight() {
    return this._progressSize.height;
  }

  set progressHeight(value) {
    this._progressSize.height = value;
  }

  get backgroundX() {
    return this._backgroundPadding.x;
  }

  set backgroundX(value) {
    this._backgroundPadding.x = value;
  }

  get backgroundY() {
    return this._backgroundPadding.y;
  }

  set backgroundY(value) {
    this._backgroundPadding.y = value;
  }

  get backgroundWidth() {
    return this._backgroundPadding.width;
  }

  set backgroundWidth(value) {
    this._backgroundPadding.width = value;
  }

  get value() {
    return this._values[0];
  }

  set value(value) {
    this._values[0] = value;
    this.refresh();
  }

  get minimumValue() {
    return this._values[1];
  }

  set minimumValue(value) {
    this._values[1] = value;
    this._values[3] = value;

    if (this.minimumValue >= this.maximumValue) {
      this.maximumValue = this.minimumValue + 1.0;
    } else {
      this.refresh();
    }
  }

  get maximumValue() {
    return this._values[2];
  }

  set maximumValue(value) {
    this._values[2] = value;
    this._values[4] = value;

    if (this.maximumValue <= this.minimumValue) {
      this.minimumValue = this.maximumValue - 1.0;
    } else {
      this.refresh();
    }
  }

  get minimumAllowedValue() {
    return this._values[3];
  }

  set minimumAllowedValue(value) {
    this._values[3] = value;
    if (this.minimumAllowedValue < this.minimumValue) {
      this.minimumValue = this.minimumAllowedValue;
    } else {
      this.refresh();
    }
  }

  get maximumAllowedValue() {
    return this._values[4];
  }

  set maximumAllowedValue(value) {
    this._values[4] = value;

    if (this.maximumAllowedValue > this.maximumValue) {
      this.maximumValue = this.maximumAllowedValue;
    } else {
      this.refresh();
    }
  }

  get thumbOffset() {
    return this._thumbOffset;
  }

  get enabled() {
    return super.isEnabled();
  }

  set enabled(value) {
    super.setEnabled(value);
    if (this._thumb !== null) {
      this._thumb.disabled = !value;
    }
  }
}
