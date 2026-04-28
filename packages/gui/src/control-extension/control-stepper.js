import { LabelTTF, Size, Color, REPEAT_FOREVER, TEXT_ALIGNMENT_CENTER, VERTICAL_TEXT_ALIGNMENT_CENTER } from "@aspect/core";
import { Control } from "./control";
import { ControlUtils } from "./control-utils";
import { CONTROL_EVENT_VALUE_CHANGED, STEPPER_PARTMINUS, STEPPER_PARTPLUS, STEPPER_PARTNONE } from "./constants";

const CONTROL_STEPPER_LABELCOLOR_ENABLED = new Color(55, 55, 55);
const CONTROL_STEPPER_LABELCOLOR_DISABLED = new Color(147, 147, 147);
const CONTROL_STEPPER_LABELFONT = "CourierNewPSMT";
const AUTOREPEAT_DELTATIME = 0.15;
const AUTOREPEAT_INCREASETIME_INCREMENT = 12;

export class ControlStepper extends Control {
    _minusSprite = null;
    _plusSprite = null;
    _minusLabel = null;
    _plusLabel = null;
    _value = 0;
    _continuous = false;
    _autorepeat = false;
    _wraps = false;
    _minimumValue = 0;
    _maximumValue = 0;
    _stepValue = 0;
    _touchInsideFlag = false;
    _touchedPart = STEPPER_PARTNONE;
    _autorepeatCount = 0;
    _className = "ControlStepper";

    get wraps() { return this.getWraps(); }
    set wraps(v) { this.setWraps(v); }
    get value() { return this.getValue(); }
    set value(v) { this.setValue(v); }
    get minValue() { return this.getMinimumValue(); }
    set minValue(v) { this.setMinimumValue(v); }
    get maxValue() { return this.getMaximumValue(); }
    set maxValue(v) { this.setMaximumValue(v); }
    get stepValue() { return this.getStepValue(); }
    set stepValue(v) { this.setStepValue(v); }
    get continuous() { return this.isContinuous(); }
    get minusSprite() { return this.getMinusSprite(); }
    set minusSprite(v) { this.setMinusSprite(v); }
    get plusSprite() { return this.getPlusSprite(); }
    set plusSprite(v) { this.setPlusSprite(v); }
    get minusLabel() { return this.getMinusLabel(); }
    set minusLabel(v) { this.setMinusLabel(v); }
    get plusLabel() { return this.getPlusLabel(); }
    set plusLabel(v) { this.setPlusLabel(v); }

    constructor(minusSprite, plusSprite) {
        super();
        this._touchedPart = STEPPER_PARTNONE;
        plusSprite && this.initWithMinusSpriteAndPlusSprite(minusSprite, plusSprite);
    }

    initWithMinusSpriteAndPlusSprite(minusSprite, plusSprite) {
        if (!minusSprite)
            throw new Error("ControlStepper.initWithMinusSpriteAndPlusSprite(): Minus sprite should be non-null.");
        if (!plusSprite)
            throw new Error("ControlStepper.initWithMinusSpriteAndPlusSprite(): Plus sprite should be non-null.");

        if (this.init()) {
            this._autorepeat = true;
            this._continuous = true;
            this._minimumValue = 0;
            this._maximumValue = 100;
            this._value = 0;
            this._stepValue = 1;
            this._wraps = false;
            this.ignoreAnchorPointForPosition(false);

            this.setMinusSprite(minusSprite);
            this._minusSprite.setPosition(minusSprite.getContentSize().width / 2, minusSprite.getContentSize().height / 2);
            this.addChild(this._minusSprite);

            this.setMinusLabel(new LabelTTF("-", CONTROL_STEPPER_LABELFONT, 40, new Size(40, 40), TEXT_ALIGNMENT_CENTER, VERTICAL_TEXT_ALIGNMENT_CENTER));
            this._minusLabel.setColor(CONTROL_STEPPER_LABELCOLOR_DISABLED);
            this._minusLabel.setPosition(this._minusSprite.getContentSize().width / 2, this._minusSprite.getContentSize().height / 2);
            this._minusSprite.addChild(this._minusLabel);

            this.setPlusSprite(plusSprite);
            this._plusSprite.setPosition(
                minusSprite.getContentSize().width + plusSprite.getContentSize().width / 2,
                minusSprite.getContentSize().height / 2
            );
            this.addChild(this._plusSprite);

            this.setPlusLabel(new LabelTTF("+", CONTROL_STEPPER_LABELFONT, 40, new Size(40, 40), TEXT_ALIGNMENT_CENTER, VERTICAL_TEXT_ALIGNMENT_CENTER));
            this._plusLabel.setColor(CONTROL_STEPPER_LABELCOLOR_ENABLED);
            this._plusLabel.setPosition(this._plusSprite.getContentSize().width / 2, this._plusSprite.getContentSize().height / 2);
            this._plusSprite.addChild(this._plusLabel);

            var maxRect = ControlUtils.CCRectUnion(this._minusSprite.getBoundingBox(), this._plusSprite.getBoundingBox());
            this.setContentSize(this._minusSprite.getContentSize().width + this._plusSprite.getContentSize().height, maxRect.height);
            return true;
        }
        return false;
    }

    setWraps(wraps) {
        this._wraps = wraps;
        if (this._wraps) {
            this._minusLabel.setColor(CONTROL_STEPPER_LABELCOLOR_ENABLED);
            this._plusLabel.setColor(CONTROL_STEPPER_LABELCOLOR_ENABLED);
        }
        this.setValue(this._value);
    }

    getWraps() { return this._wraps; }

    setMinimumValue(minimumValue) {
        if (minimumValue >= this._maximumValue)
            throw new Error("ControlStepper.setMinimumValue(): minimumValue should be numerically less than maximumValue.");
        this._minimumValue = minimumValue;
        this.setValue(this._value);
    }

    getMinimumValue() { return this._minimumValue; }

    setMaximumValue(maximumValue) {
        if (maximumValue <= this._minimumValue)
            throw new Error("ControlStepper.setMaximumValue(): maximumValue should be numerically less than maximumValue.");
        this._maximumValue = maximumValue;
        this.setValue(this._value);
    }

    getMaximumValue() { return this._maximumValue; }

    setValue(value) {
        this.setValueWithSendingEvent(value, true);
    }

    getValue() { return this._value; }

    setStepValue(stepValue) {
        if (stepValue <= 0)
            throw new Error("ControlStepper.setMaximumValue(): stepValue should be numerically greater than 0.");
        this._stepValue = stepValue;
    }

    getStepValue() { return this._stepValue; }

    isContinuous() { return this._continuous; }

    setValueWithSendingEvent(value, send) {
        if (value < this._minimumValue) {
            value = this._wraps ? this._maximumValue : this._minimumValue;
        } else if (value > this._maximumValue) {
            value = this._wraps ? this._minimumValue : this._maximumValue;
        }
        this._value = value;
        if (!this._wraps) {
            this._minusLabel.setColor((value === this._minimumValue) ? CONTROL_STEPPER_LABELCOLOR_DISABLED : CONTROL_STEPPER_LABELCOLOR_ENABLED);
            this._plusLabel.setColor((value === this._maximumValue) ? CONTROL_STEPPER_LABELCOLOR_DISABLED : CONTROL_STEPPER_LABELCOLOR_ENABLED);
        }
        if (send) {
            this.sendActionsForControlEvents(CONTROL_EVENT_VALUE_CHANGED);
        }
    }

    startAutorepeat() {
        this._autorepeatCount = -1;
        this.schedule(this.update, AUTOREPEAT_DELTATIME, REPEAT_FOREVER, AUTOREPEAT_DELTATIME * 3);
    }

    stopAutorepeat() {
        this.unschedule(this.update);
    }

    update(dt) {
        this._autorepeatCount++;
        if ((this._autorepeatCount < AUTOREPEAT_INCREASETIME_INCREMENT) && (this._autorepeatCount % 3) !== 0)
            return;
        if (this._touchedPart === STEPPER_PARTMINUS) {
            this.setValueWithSendingEvent(this._value - this._stepValue, this._continuous);
        } else if (this._touchedPart === STEPPER_PARTPLUS) {
            this.setValueWithSendingEvent(this._value + this._stepValue, this._continuous);
        }
    }

    updateLayoutUsingTouchLocation(location) {
        if (location.x < this._minusSprite.getContentSize().width && this._value > this._minimumValue) {
            this._touchedPart = STEPPER_PARTMINUS;
            this._minusSprite.setColor(Color.GRAY);
            this._plusSprite.setColor(Color.WHITE);
        } else if (location.x >= this._minusSprite.getContentSize().width && this._value < this._maximumValue) {
            this._touchedPart = STEPPER_PARTPLUS;
            this._minusSprite.setColor(Color.WHITE);
            this._plusSprite.setColor(Color.GRAY);
        } else {
            this._touchedPart = STEPPER_PARTNONE;
            this._minusSprite.setColor(Color.WHITE);
            this._plusSprite.setColor(Color.WHITE);
        }
    }

    onTouchBegan(touch, event) {
        if (!this.isTouchInside(touch) || !this.isEnabled() || !this.isVisible())
            return false;
        var location = this.getTouchLocation(touch);
        this.updateLayoutUsingTouchLocation(location);
        this._touchInsideFlag = true;
        if (this._autorepeat) {
            this.startAutorepeat();
        }
        return true;
    }

    onTouchMoved(touch, event) {
        if (this.isTouchInside(touch)) {
            var location = this.getTouchLocation(touch);
            this.updateLayoutUsingTouchLocation(location);
            if (!this._touchInsideFlag) {
                this._touchInsideFlag = true;
                if (this._autorepeat) {
                    this.startAutorepeat();
                }
            }
        } else {
            this._touchInsideFlag = false;
            this._touchedPart = STEPPER_PARTNONE;
            this._minusSprite.setColor(Color.WHITE);
            this._plusSprite.setColor(Color.WHITE);
            if (this._autorepeat) {
                this.stopAutorepeat();
            }
        }
    }

    onTouchEnded(touch, event) {
        this._minusSprite.setColor(Color.WHITE);
        this._plusSprite.setColor(Color.WHITE);
        if (this._autorepeat) {
            this.stopAutorepeat();
        }
        if (this.isTouchInside(touch)) {
            var location = this.getTouchLocation(touch);
            this.setValue(this._value + ((location.x < this._minusSprite.getContentSize().width) ? (0.0 - this._stepValue) : this._stepValue));
        }
    }

    setMinusSprite(sprite) { this._minusSprite = sprite; }
    getMinusSprite() { return this._minusSprite; }
    setPlusSprite(sprite) { this._plusSprite = sprite; }
    getPlusSprite() { return this._plusSprite; }
    setMinusLabel(sprite) { this._minusLabel = sprite; }
    getMinusLabel() { return this._minusLabel; }
    setPlusLabel(sprite) { this._plusLabel = sprite; }
    getPlusLabel() { return this._plusLabel; }
}
