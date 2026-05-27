import { Color, Node, Rect } from "@aspect/core";
import { Scale9Sprite, TextBMFont } from "@aspect/ccui";
import { CONTROL_STATE_HIGHLIGHTED, ControlButton } from "@aspect/gui";
import { s_simpleFont_fnt } from "../../../resources";

function standardButtonWithTitle(title) {
  const backgroundButton = new Scale9Sprite(
    "default_theme/rounded_shadow_4.png",
    new Rect(8, 8, 8, 8)
  );
  backgroundButton.color = new Color(96, 96, 96);

  const backgroundHighlightedButton = new Scale9Sprite(
    "default_theme/rounded_shadow_4.png",
    new Rect(8, 8, 8, 8)
  );
  backgroundHighlightedButton.color = new Color(128, 128, 128);

  const titleButton = new TextBMFont(title, s_simpleFont_fnt);
  titleButton.color = Color.WHITE;

  const button = new ControlButton(titleButton, backgroundButton);
  button.setBackgroundSpriteForState(
    backgroundHighlightedButton,
    CONTROL_STATE_HIGHLIGHTED
  );
  button.setTitleColorForState(Color.WHITE, CONTROL_STATE_HIGHLIGHTED);

  return button;
}

export default class ControlButtonHelloVariableSizeTest extends Node {
  constructor() {
    super();

    const stringArray = ["Hello", "Variable", "Size", "!"];

    const layer = new Node();
    this.addChild(layer, 1);

    let total_width = 0;
    let height = 0;

    for (let i = 0; i < stringArray.length; i++) {
      const button = standardButtonWithTitle(stringArray[i]);

      if (i === 0) button.opacity = 50;
      else if (i === 1) button.opacity = 200;
      else if (i === 2) button.opacity = 100;

      button.x = total_width + button.width / 2;
      button.y = button.height / 2;
      layer.addChild(button);

      height = button.height;
      total_width += button.width;
    }

    layer.anchorX = 0.5;
    layer.anchorY = 0.5;
    layer.width = total_width;
    layer.height = height;
    layer.x = 0;
    layer.y = 0;

    const background = new Scale9Sprite(
      "default_theme/rounded_shadow_4.png",
      new Rect(8, 8, 8, 8)
    );
    background.color = new Color(32, 32, 32);
    background.width = total_width + 14;
    background.height = height + 14;
    background.x = 0;
    background.y = 0;
    this.addChild(background);
  }
}
