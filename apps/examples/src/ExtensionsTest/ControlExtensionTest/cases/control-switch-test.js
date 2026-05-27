import { Color, Node, Rect } from "@aspect/core";
import { Scale9Sprite, TextBMFont } from "@aspect/ccui";
import { CONTROL_EVENT_VALUE_CHANGED, ControlSwitch } from "@aspect/gui";
import { s_simpleFont_fnt } from "../../../resources";

export default class ControlSwitchTest extends Node {
  constructor() {
    super();

    let layer_width = 0;

    const background = new Scale9Sprite(
      "default_theme/rounded_shadow_4.png",
      new Rect(8, 8, 8, 8)
    );
    background.width = 80;
    background.height = 50;
    background.x = layer_width + background.width / 2.0;
    background.y = 0;
    background.color = new Color(64, 64, 64);
    this.addChild(background);

    layer_width += background.width;

    this._displayValueLabel = new TextBMFont("#color", s_simpleFont_fnt);
    this._displayValueLabel.color = Color.WHITE;
    this._displayValueLabel.x = background.x;
    this._displayValueLabel.y = background.y;
    this.addChild(this._displayValueLabel);

    const backgroundSprite = new Scale9Sprite(
      "default_theme/rounded_shadow_4.png",
      new Rect(8, 8, 8, 8)
    );
    backgroundSprite.width = 64;
    backgroundSprite.height = 32;
    backgroundSprite.color = new Color(32, 32, 32);

    const thumbSprite = new Scale9Sprite(
      "default_theme/rounded_shadow_2.png",
      new Rect(8, 8, 8, 8)
    );
    thumbSprite.width = 32;
    thumbSprite.height = 32;

    const onSprite = new Scale9Sprite(
      "default_theme/rounded_shadow_4.png",
      new Rect(8, 8, 8, 8)
    );
    onSprite.width = 64;
    onSprite.height = 32;
    onSprite.color = Color.GREEN;

    const offSprite = new Scale9Sprite(
      "default_theme/rounded_shadow_4.png",
      new Rect(8, 8, 8, 8)
    );
    offSprite.width = 64;
    offSprite.height = 32;
    offSprite.color = Color.RED;

    const switchControl = new ControlSwitch(
      64,
      32,
      backgroundSprite,
      onSprite,
      offSprite,
      thumbSprite
    );
    switchControl.x = layer_width + 24;
    switchControl.y = -16;
    this.addChild(switchControl);

    switchControl.addTargetWithActionForControlEvents(
      this,
      this.valueChanged,
      CONTROL_EVENT_VALUE_CHANGED
    );

    layer_width += 10 + switchControl.width;

    this.anchorX = 0.5;
    this.anchorY = 0.5;
    this.width = layer_width;
    this.height = 0;

    this.valueChanged(switchControl, CONTROL_EVENT_VALUE_CHANGED);
  }

  valueChanged(sender) {
    this._displayValueLabel.setString(sender.isOn ? "On" : "Off");
  }
}
