import { Color, Node, Rect } from "@aspect/core";
import { BMButton, Scale9Sprite, TextBMFont, Widget } from "@aspect/ccui";
import { CONTROL_EVENT_VALUE_CHANGED, ControlStepper } from "@aspect/gui";
import { s_simpleFont_fnt } from "../../../resources";

function makeBtn(text) {
  const b = new BMButton(
    "default_theme/rounded_shadow_2.png",
    "default_theme/rounded_shadow_2.png",
    "default_theme/rounded_shadow_2.png",
    Widget.PLIST_TEXTURE
  );
  b.setScale9Enabled(true);
  b.setCapInsets(new Rect(12, 12, 12, 12));
  b.setContentSize(48, 48);
  b.setTitleFntFile(s_simpleFont_fnt);
  b.setTitleText(text);
  b.setTitleFontSize(28);
  b.setNormalBgColor(new Color(0x44, 0x55, 0x77));
  b.setPressedBgColor(new Color(0x22, 0x33, 0x55));
  b.setDisabledBgColor(new Color(0x55, 0x55, 0x55));
  b.pressedActionEnabled = true;
  return b;
}

export default class ControlStepperTest extends Node {
  constructor() {
    super();

    let layer_width = 0;

    const background = new Scale9Sprite(
      "default_theme/rounded_shadow_4.png",
      new Rect(8, 8, 8, 8)
    );
    background.color = new Color(32, 32, 32);
    background.width = 100;
    background.height = 50;
    background.x = layer_width + background.width / 2.0;
    background.y = 0;
    this.addChild(background);

    this._displayValueLabel = new TextBMFont("0", s_simpleFont_fnt);
    this._displayValueLabel.x = background.x;
    this._displayValueLabel.y = background.y;
    this.addChild(this._displayValueLabel);

    layer_width += background.width;

    const stepper = new ControlStepper(makeBtn("-"), makeBtn("+"));
    stepper.x = layer_width + 10 + stepper.width / 2;
    stepper.y = 0;
    stepper.addTargetWithActionForControlEvents(
      this,
      this.valueChanged,
      CONTROL_EVENT_VALUE_CHANGED
    );
    this.addChild(stepper);

    layer_width += 10 + stepper.width;

    this.anchorX = 0.5;
    this.anchorY = 0.5;
    this.width = layer_width;
    this.height = 0;

    this.valueChanged(stepper, CONTROL_EVENT_VALUE_CHANGED);
  }

  valueChanged(sender) {
    this._displayValueLabel.string = sender.value.toString();
  }
}
