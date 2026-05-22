import { Rect, Size, Color, Point } from "@aspect/core";
import { Scale9Sprite } from "@aspect/ccui";
import { Control } from "./control";
import { CONTROL_EVENT_VALUE_CHANGED } from "./constants";

export class ControlSlider extends Control {
  _values = null;
  _thumbSprite = null;
  _progressSprite = null;
  _backgroundSprite = null;
  _className = "ControlSlider";
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
    this._backgroundSprite = backgroundSprite;
    this._thumbSprite = thumbSprite;
    this._progressSprite = progressSprite;

    if (this._backgroundSprite) {
      this.addChild(this._backgroundSprite);
      this._backgroundSprite.setAnchorPoint(0, 0);
    }

    if (this._progressSprite) {
      this.addChild(this._progressSprite);
      this._progressSprite.setAnchorPoint(0, 0);
    }

    if (this._thumbSprite) {
      this.addChild(this._thumbSprite);
      this._thumbSprite.setAnchorPoint(0.5, 0.5);
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
    } else if (touchLocation.x > this._progressSize.width) {
      touchLocation.x = this._progressSize.width;
    }

    return touchLocation;
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
    this.value = this.valueForLocation(location);
  }

  sliderMoved(location) {
    this.value = this.valueForLocation(location);
  }

  sliderEnded(location) {
    if (this.isSelected()) {
      this.value = this.valueForLocation(this._thumbSprite.getPosition());
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

  doLayout() {
    const percent = this.percentage;

    if (this._thumbSprite !== null) {
      this._thumbSprite.x =
        percent * this._progressSize.width + this._thumbOffset.x;
      this._thumbSprite.y = this._thumbOffset.y + this._progressSize.height / 2.0;
    }

    if (this._progressSprite !== null) {
      if (this._progressSprite instanceof Scale9Sprite) {
        this._progressSprite.setPreferredSize(
          new Size(
            percent * this._progressSize.width,
            this._progressSize.height
          )
        );
      } else {
        var textureRect = this._progressSprite.getTextureRect();
        textureRect = new Rect(
          textureRect.x,
          textureRect.y,
          percent * this._progressSize.width,
          textureRect.height
        );
        this._progressSprite.setTextureRect(
          textureRect,
          this._progressSprite.isTextureRectRotated()
        );
      }
    }

    if (this._backgroundSprite !== null) {
      this._backgroundSprite.setPreferredSize(
        new Size(
          this._progressSize.width + this._backgroundPadding.width,
          this._progressSize.height + this._backgroundPadding.height
        )
      );
      this._backgroundSprite.setPosition(
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

  get minimumAllowedValue() {
    return this._minimumAllowedValue;
  }

  set minimumAllowedValue(val) {
    this._minimumAllowedValue = val;
  }

  get maximumAllowedValue() {
    return this._maximumAllowedValue;
  }

  set maximumAllowedValue(val) {
    this._maximumAllowedValue = val;
  }
  get thumbSprite() {
    return this._thumbSprite;
  }

  set thumbSprite(value) {
    this._thumbSprite = value;
  }

  get progressSprite() {
    return this._progressSprite;
  }

  set progressSprite(value) {
    this._progressSprite = value;
  }

  get backgroundSprite() {
    return this._backgroundSprite;
  }

  set backgroundSprite(value) {
    this._backgroundSprite = value;
  }

  get percentage() {
    return (
      (this.value - this.minimumValue) / (this.maximumValue - this.minimumValue)
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
    if (this.minimumAllowedValue > this.minimumValue) {
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

    if (this.maximumAllowedValue < this.maximumValue) {
      this.maximumValue = this.maximumAllowedValue;
    } else {
      this.refresh();
    }
  }

  get thumbOffset() {
    return this._thumbOffset;
  }
}
