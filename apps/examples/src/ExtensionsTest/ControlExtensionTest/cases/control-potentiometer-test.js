import { Color, Node, Rect } from "@aspect/core";
import { Scale9Sprite, TextBMFont } from "@aspect/ccui";
import { CONTROL_EVENT_VALUE_CHANGED, ControlPotentiometer } from "@aspect/gui";
import { s_simpleFont_fnt } from "../../../resources";

export default class ControlPotentiometerTest extends Node {
  constructor() {
    super();

    let layer_width = 0;

    const background = new Scale9Sprite(
      "default_theme/rounded_shadow_4.png",
      new Rect(8, 8, 8, 8)
    );
    background.color = new Color(32, 32, 32);
    background.width = 80;
    background.height = 50;
    background.x = layer_width + background.width / 2.0;
    background.y = 0;
    this.addChild(background);

    layer_width += background.width;

    this._displayValueLabel = new TextBMFont("", s_simpleFont_fnt);
    this._displayValueLabel.x = background.x;
    this._displayValueLabel.y = background.y;
    this.addChild(this._displayValueLabel);

    const potentiometer = new ControlPotentiometer(
      "#default_theme/potentiometr/track.png",
      "#default_theme/potentiometr/progress.png",
      "#default_theme/potentiometr/button.png"
    );
    potentiometer.background.color = new Color(32, 32, 32);
    potentiometer.progressTimer.color = Color.GREEN;
    potentiometer.x = layer_width + 10 + potentiometer.width / 2;
    potentiometer.y = 0;

    potentiometer.addTargetWithActionForControlEvents(
      this,
      this.valueChanged,
      CONTROL_EVENT_VALUE_CHANGED
    );

    this.addChild(potentiometer);

    layer_width += 10 + potentiometer.width;

    this.anchorX = 0.5;
    this.anchorY = 0.5;
    this.width = layer_width;
    this.height = 0;

    this.valueChanged(potentiometer, CONTROL_EVENT_VALUE_CHANGED);
  }

  valueChanged(sender) {
    this._displayValueLabel.setString(sender.value.toFixed(2));
  }
}
