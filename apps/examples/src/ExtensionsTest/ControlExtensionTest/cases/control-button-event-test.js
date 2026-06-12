import { Color, Node, Rect } from "@aspect/core";
import { Scale9Sprite, TextBMFont } from "@aspect/ccui";
import {
  CONTROL_EVENT_TOUCH_CANCEL,
  CONTROL_EVENT_TOUCH_DOWN,
  CONTROL_EVENT_TOUCH_DRAG_ENTER,
  CONTROL_EVENT_TOUCH_DRAG_EXIT,
  CONTROL_EVENT_TOUCH_DRAG_INSIDE,
  CONTROL_EVENT_TOUCH_DRAG_OUTSIDE,
  CONTROL_EVENT_TOUCH_UP_INSIDE,
  CONTROL_EVENT_TOUCH_UP_OUTSIDE,
  CONTROL_STATE_HIGHLIGHTED,
  ControlButton
} from "@aspect/gui";
import { s_simpleFont_fnt } from "../../../resources";

export default class ControlButtonEventTest extends Node {
  constructor() {
    super();

    const background = new Scale9Sprite(
      "default_theme/rounded_shadow_4.png",
      new Rect(8, 8, 8, 8)
    );
    background.color = new Color(32, 32, 32);
    background.width = 220;
    background.height = 140;
    background.x = 0;
    background.y = 0;
    this.addChild(background);

    this._displayValueLabel = new TextBMFont("No Event", s_simpleFont_fnt);
    this._displayValueLabel.color = Color.WHITE;
    this._displayValueLabel.anchorX = 0.5;
    this._displayValueLabel.anchorY = -1;
    this._displayValueLabel.x = 0;
    this._displayValueLabel.y = 0;
    this.addChild(this._displayValueLabel, 10);

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

    const titleButton = new TextBMFont("Touch Me!", s_simpleFont_fnt);
    titleButton.color = Color.WHITE;

    const controlButton = new ControlButton(titleButton, backgroundButton);
    controlButton.setBackgroundSpriteForState(
      backgroundHighlightedButton,
      CONTROL_STATE_HIGHLIGHTED
    );
    controlButton.setTitleColorForState(Color.WHITE, CONTROL_STATE_HIGHLIGHTED);

    controlButton.anchorX = 0.5;
    controlButton.anchorY = 1;
    controlButton.x = 0;
    controlButton.y = 0;
    this.addChild(controlButton, 1);

    const events = [
      [CONTROL_EVENT_TOUCH_DOWN, "Touch Down"],
      [CONTROL_EVENT_TOUCH_DRAG_INSIDE, "Drag Inside"],
      [CONTROL_EVENT_TOUCH_DRAG_OUTSIDE, "Drag Outside"],
      [CONTROL_EVENT_TOUCH_DRAG_ENTER, "Drag Enter"],
      [CONTROL_EVENT_TOUCH_DRAG_EXIT, "Drag Exit"],
      [CONTROL_EVENT_TOUCH_UP_INSIDE, "Touch Up Inside."],
      [CONTROL_EVENT_TOUCH_UP_OUTSIDE, "Touch Up Outside."],
      [CONTROL_EVENT_TOUCH_CANCEL, "Touch Cancel"]
    ];
    for (const [event, label] of events) {
      controlButton.addTargetWithActionForControlEvents(
        this,
        () => this._displayValueLabel.string = label,
        event
      );
    }
  }
}
