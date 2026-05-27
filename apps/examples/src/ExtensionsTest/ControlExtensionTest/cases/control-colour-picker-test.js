import { Color, Node, Rect } from "@aspect/core";
import { Scale9Sprite, TextBMFont } from "@aspect/ccui";
import { CONTROL_EVENT_VALUE_CHANGED, ControlColourPicker } from "@aspect/gui";
import { s_simpleFont_fnt } from "../../../resources";

export default class ControlColourPickerTest extends Node {
  constructor() {
    super();

    const colourPicker = new ControlColourPicker();
    colourPicker.color = new Color(37, 46, 252);
    colourPicker.anchorX = 0.5;
    colourPicker.anchorY = 0.5;
    colourPicker.x = 0;
    colourPicker.y = 30;
    this.addChild(colourPicker);

    const background = new Scale9Sprite(
      "default_theme/rounded_shadow_4.png",
      new Rect(8, 8, 8, 8)
    );
    background.color = new Color(32, 32, 32);
    background.width = 150;
    background.height = 50;
    background.x = colourPicker.width + 10;
    background.y = 25;
    this.addChild(background);

    this._colorLabel = new TextBMFont("#color", s_simpleFont_fnt);
    this._colorLabel.color = Color.WHITE;
    this._colorLabel.x = background.x;
    this._colorLabel.y = background.y;
    this.addChild(this._colorLabel);

    colourPicker.addTargetWithActionForControlEvents(
      this,
      this.colourValueChanged,
      CONTROL_EVENT_VALUE_CHANGED
    );

    this.colourValueChanged(colourPicker, CONTROL_EVENT_VALUE_CHANGED);
  }

  colourValueChanged(sender) {
    this._colorLabel.setString(Color.toHex(sender.color).toUpperCase());
  }
}
