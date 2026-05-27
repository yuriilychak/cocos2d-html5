import { REPEAT_FOREVER, Rect } from "@aspect/core";
import { Widget } from "@aspect/ccui";
import { Control } from "./control";
import { CONTROL_EVENT_VALUE_CHANGED, STEPPER_PARTMINUS, STEPPER_PARTPLUS, STEPPER_PARTNONE } from "./constants";

export class ControlStepper extends Control {
  static AUTOREPEAT_DELTATIME = 0.15;
  static AUTOREPEAT_INCREASETIME_INCREMENT = 12;

  _minusButton = null;
  _plusButton = null;
  _value = 0;
  _continuous = false;
  _autorepeat = false;
  _wraps = false;
  _minimumValue = 0;
  _maximumValue = 0;
  _stepValue = 0;
  _touchedPart = STEPPER_PARTNONE;
  _autorepeatCount = 0;
  _className = "Stepper";

  constructor(minusButton, plusButton) {
    super();
    plusButton &&
      this.initWithMinusSpriteAndPlusSprite(minusButton, plusButton);
  }

  initWithMinusSpriteAndPlusSprite(minusButton, plusButton) {
    if (!minusButton)
      throw new Error(
        "ControlStepper.initWithMinusSpriteAndPlusSprite(): Minus button should be non-null."
      );
    if (!plusButton)
      throw new Error(
        "ControlStepper.initWithMinusSpriteAndPlusSprite(): Plus button should be non-null."
      );

    if (this.init()) {
      this._autorepeat = true;
      this._continuous = true;
      this._minimumValue = 0;
      this._maximumValue = 100;
      this._value = 0;
      this._stepValue = 1;
      this._wraps = false;
      this.ignoreAnchorPointForPosition(false);

      this._minusButton = minusButton;
      this._minusButton.setPosition(
        minusButton.getContentSize().width / 2,
        minusButton.getContentSize().height / 2
      );
      this.addChild(this._minusButton);

      this._plusButton = plusButton;
      this._plusButton.setPosition(
        minusButton.getContentSize().width +
          plusButton.getContentSize().width / 2,
        minusButton.getContentSize().height / 2
      );
      this.addChild(this._plusButton);

      this._minusButton.addTouchEventListener((btn, eventType) => {
        switch (eventType) {
          case Widget.TOUCH_BEGAN:
            this._touchedPart = STEPPER_PARTMINUS;
            if (this._autorepeat) this.startAutorepeat();
            break;
          case Widget.TOUCH_ENDED:
            if (this._autorepeat) this.stopAutorepeat();
            this.setValueWithSendingEvent(this._value - this._stepValue, true);
            break;
          case Widget.TOUCH_CANCELED:
            if (this._autorepeat) this.stopAutorepeat();
            this._touchedPart = STEPPER_PARTNONE;
            break;
        }
      });

      this._plusButton.addTouchEventListener((btn, eventType) => {
        switch (eventType) {
          case Widget.TOUCH_BEGAN:
            this._touchedPart = STEPPER_PARTPLUS;
            if (this._autorepeat) this.startAutorepeat();
            break;
          case Widget.TOUCH_ENDED:
            if (this._autorepeat) this.stopAutorepeat();
            this.setValueWithSendingEvent(this._value + this._stepValue, true);
            break;
          case Widget.TOUCH_CANCELED:
            if (this._autorepeat) this.stopAutorepeat();
            this._touchedPart = STEPPER_PARTNONE;
            break;
        }
      });

      var maxRect = Rect.union(
        this._minusButton.getBoundingBox(),
        this._plusButton.getBoundingBox()
      );
      this.setContentSize(
        this._minusButton.getContentSize().width +
          this._plusButton.getContentSize().height,
        maxRect.height
      );
      return true;
    }
    return false;
  }

  setValueWithSendingEvent(value, send) {
    if (value < this._minimumValue) {
      value = this._wraps ? this._maximumValue : this._minimumValue;
    } else if (value > this._maximumValue) {
      value = this._wraps ? this._minimumValue : this._maximumValue;
    }
    this._value = value;
    if (send) {
      this.sendActionsForControlEvents(CONTROL_EVENT_VALUE_CHANGED);
    }
  }

  startAutorepeat() {
    this._autorepeatCount = -1;
    this.schedule(
      this.update,
      ControlStepper.AUTOREPEAT_DELTATIME,
      REPEAT_FOREVER,
      ControlStepper.AUTOREPEAT_DELTATIME * 3
    );
  }

  stopAutorepeat() {
    this.unschedule(this.update);
  }

  update(dt) {
    this._autorepeatCount++;
    if (
      this._autorepeatCount < ControlStepper.AUTOREPEAT_INCREASETIME_INCREMENT &&
      this._autorepeatCount % 3 !== 0
    )
      return;
    if (this._touchedPart === STEPPER_PARTMINUS) {
      this.setValueWithSendingEvent(
        this._value - this._stepValue,
        this._continuous
      );
    } else if (this._touchedPart === STEPPER_PARTPLUS) {
      this.setValueWithSendingEvent(
        this._value + this._stepValue,
        this._continuous
      );
    }
  }

  set minusButton(sprite) {
    this._minusButton = sprite;
  }
  get minusButton() {
    return this._minusButton;
  }
  set plusButton(sprite) {
    this._plusButton = sprite;
  }
  get plusButton() {
    return this._plusButton;
  }
  set wraps(wraps) {
    this._wraps = wraps;
    this.value = this._value;
  }

  get wraps() {
    return this._wraps;
  }

  set minimumValue(minimumValue) {
    if (minimumValue >= this._maximumValue)
      throw new Error(
        "ControlStepper.minimumValue: minimumValue should be numerically less than maximumValue."
      );
    this._minimumValue = minimumValue;
    this.value = this._value;
  }

  get minimumValue() {
    return this._minimumValue;
  }

  set maximumValue(maximumValue) {
    if (maximumValue <= this._minimumValue)
      throw new Error(
        "ControlStepper.maximumValue: maximumValue should be numerically greater than minimumValue."
      );
    this._maximumValue = maximumValue;
    this.value = this._value;
  }

  get maximumValue() {
    return this._maximumValue;
  }

  set value(value) {
    this.setValueWithSendingEvent(value, true);
  }

  get value() {
    return this._value;
  }

  set stepValue(stepValue) {
    if (stepValue <= 0)
      throw new Error(
        "ControlStepper.stepValue: stepValue should be numerically greater than 0."
      );
    this._stepValue = stepValue;
  }

  get stepValue() {
    return this._stepValue;
  }

  get isContinuous() {
    return this._continuous;
  }

  set enabled(enabled) {
    super.setEnabled(enabled);
    if (this._minusButton !== null) {
      this._minusButton.enabled = enabled;
    }
    if (this._plusButton !== null) {
      this._plusButton.enabled = enabled;
    }
  }

  get enabled() {
    return super.enabled;
  }
}
