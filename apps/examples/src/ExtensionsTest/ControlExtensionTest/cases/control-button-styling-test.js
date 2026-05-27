import { Color, Node, Rect, Size } from "@aspect/core";
import { Scale9Sprite, TextBMFont } from "@aspect/ccui";
import { CONTROL_STATE_HIGHLIGHTED, ControlButton } from "@aspect/gui";
import { s_simpleFont_fnt } from "../../../resources";

function standardButtonWithTitle(title) {
  const backgroundButton = new Scale9Sprite(
    "default_theme/rounded_shadow_4.png",
    new Rect(8, 8, 8, 8)
  );
  backgroundButton.color = new Color(96, 96, 96);
  backgroundButton.setPreferredSize(new Size(45, 45));

  const backgroundHighlightedButton = new Scale9Sprite(
    "default_theme/rounded_shadow_4.png",
    new Rect(8, 8, 8, 8)
  );
  backgroundHighlightedButton.color = new Color(128, 128, 128);
  backgroundHighlightedButton.setPreferredSize(new Size(45, 45));

  const titleButton = new TextBMFont(title, s_simpleFont_fnt);
  titleButton.color = Color.WHITE;

  const button = new ControlButton(
    titleButton,
    backgroundButton,
    null,
    null,
    false
  );
  button.setBackgroundSpriteForState(
    backgroundHighlightedButton,
    CONTROL_STATE_HIGHLIGHTED
  );
  button.setTitleColorForState(Color.WHITE, CONTROL_STATE_HIGHLIGHTED);

  return button;
}

export default class ControlButtonStylingTest extends Node {
  constructor() {
    super();

    const layer = new Node();
    this.addChild(layer, 1);

    const space = 10;

    let max_w = 0;
    let max_h = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const button = standardButtonWithTitle(
          ((Math.random() * 30 + 10) << 0).toString()
        );
        button.setAdjustBackgroundImage(false);
        button.x = button.width / 2 + (button.width + space) * i;
        button.y = button.height / 2 + (button.height + space) * j;
        layer.addChild(button);

        max_w = Math.max(button.width * (i + 1) + space * i, max_w);
        max_h = Math.max(button.height * (j + 1) + space * j, max_h);
      }
    }

    layer.anchorX = 0.5;
    layer.anchorY = 0.5;
    layer.width = max_w;
    layer.height = max_h;
    layer.x = 0;
    layer.y = 0;

    const backgroundButton = new Scale9Sprite(
      "default_theme/rounded_shadow_4.png",
      new Rect(8, 8, 8, 8)
    );
    backgroundButton.color = new Color(32, 32, 32);
    backgroundButton.width = max_w + 14;
    backgroundButton.height = max_h + 14;
    backgroundButton.x = 0;
    backgroundButton.y = 0;
    this.addChild(backgroundButton);
  }
}
