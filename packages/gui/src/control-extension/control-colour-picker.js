import { SpriteBatchNode, Sprite, Point, Color } from "@aspect/core";
import { SpriteFrameCache } from "@aspect/core";
import { Control } from "./control";
import { ControlUtils, RGBA, HSV } from "./control-utils";
import { ControlHuePicker } from "./control-hue-picker";
import { ControlSaturationBrightnessPicker } from "./control-saturation-brightness-picker";
import { CONTROL_EVENT_VALUE_CHANGED } from "./constants";

export const CCControlColourPickerSpriteSheet_plist =
    "res/extensions/CCControlColourPickerSpriteSheet.plist";
export const CCControlColourPickerSpriteSheet_png =
    "res/extensions/CCControlColourPickerSpriteSheet.png";

export class ControlColourPicker extends Control {
    _hsv = null;
    _colourPicker = null;
    _huePicker = null;
    _background = null;
    _className = "ControlColourPicker";

    get background() { return this.getBackground(); }

    constructor() {
        super();
        this.init();
    }

    hueSliderValueChanged(sender, controlEvent) {
        this._hsv.h = sender.getHue();
        var rgb = ControlUtils.RGBfromHSV(this._hsv);
        super.setColor(new Color(0 | (rgb.r * 255), 0 | (rgb.g * 255), 0 | (rgb.b * 255)));
        this.sendActionsForControlEvents(CONTROL_EVENT_VALUE_CHANGED);
        this._updateControlPicker();
    }

    colourSliderValueChanged(sender, controlEvent) {
        this._hsv.s = sender.getSaturation();
        this._hsv.v = sender.getBrightness();
        var rgb = ControlUtils.RGBfromHSV(this._hsv);
        super.setColor(new Color(0 | (rgb.r * 255), 0 | (rgb.g * 255), 0 | (rgb.b * 255)));
        this.sendActionsForControlEvents(CONTROL_EVENT_VALUE_CHANGED);
    }

    setColor(color) {
        super.setColor(color);
        var rgba = new RGBA();
        rgba.r = color.r / 255.0;
        rgba.g = color.g / 255.0;
        rgba.b = color.b / 255.0;
        rgba.a = 1.0;
        this._hsv = ControlUtils.HSVfromRGB(rgba);
        this._updateHueAndControlPicker();
    }

    getBackground() {
        return this._background;
    }

    init() {
        if (super.init()) {
            var locRes = (typeof res !== "undefined" && res) || {};
            var plist = locRes.CCControlColourPickerSpriteSheet_plist || CCControlColourPickerSpriteSheet_plist;
            var png = locRes.CCControlColourPickerSpriteSheet_png || CCControlColourPickerSpriteSheet_png;

            SpriteFrameCache.getInstance().addSpriteFrames(plist);
            var spriteSheet = new SpriteBatchNode(png);
            this.addChild(spriteSheet);

            this._hsv = new HSV();
            this._hsv.h = 0; this._hsv.s = 0; this._hsv.v = 0;

            this._background = ControlUtils.addSpriteToTargetWithPosAndAnchor(
                new Sprite("menuColourPanelBackground.png"),
                spriteSheet, new Point(0, 0), new Point(0.5, 0.5)
            );

            var backgroundPointZero = Point.sub(this._background.getPosition(),
                new Point(this._background.getContentSize().width / 2, this._background.getContentSize().height / 2));

            var hueShift = 8;
            var colourShift = 28;

            this._huePicker = new ControlHuePicker(spriteSheet, new Point(backgroundPointZero.x + hueShift, backgroundPointZero.y + hueShift));
            this._colourPicker = new ControlSaturationBrightnessPicker(spriteSheet, new Point(backgroundPointZero.x + colourShift, backgroundPointZero.y + colourShift));

            this._huePicker.addTargetWithActionForControlEvents(this, this.hueSliderValueChanged, CONTROL_EVENT_VALUE_CHANGED);
            this._colourPicker.addTargetWithActionForControlEvents(this, this.colourSliderValueChanged, CONTROL_EVENT_VALUE_CHANGED);

            this._updateHueAndControlPicker();
            this.addChild(this._huePicker);
            this.addChild(this._colourPicker);

            this.setContentSize(this._background.getContentSize());
            return true;
        }
        return false;
    }

    _updateControlPicker() {
        this._huePicker.setHue(this._hsv.h);
        this._colourPicker.updateWithHSV(this._hsv);
    }

    _updateHueAndControlPicker() {
        this._huePicker.setHue(this._hsv.h);
        this._colourPicker.updateWithHSV(this._hsv);
        this._colourPicker.updateDraggerWithHSV(this._hsv);
    }

    setEnabled(enabled) {
        super.setEnabled(enabled);
        if (this._huePicker !== null) {
            this._huePicker.setEnabled(enabled);
        }
        if (this._colourPicker) {
            this._colourPicker.setEnabled(enabled);
        }
    }

    onTouchBegan() {
        return false;
    }
}
