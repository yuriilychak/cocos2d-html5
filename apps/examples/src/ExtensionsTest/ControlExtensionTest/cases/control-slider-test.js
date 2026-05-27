import { Color, Node, Rect, SpriteFrameCache } from "@aspect/core";
import { Scale9Sprite, TextBMFont } from "@aspect/ccui";
import { CONTROL_EVENT_VALUE_CHANGED, ControlSlider } from "@aspect/gui";
import { s_simpleFont_fnt, s_simpleTheme_plist } from "../../../resources";

function createSlider(width = 256, height = 16) {
  const backgroundSprite = new Scale9Sprite(
    "default_theme/rounded_shadow_4.png",
    new Rect(8, 8, 8, 8)
  );
  backgroundSprite.color = new Color(64, 64, 64);

  const progressSprite = new Scale9Sprite(
    "default_theme/rounded_shadow_0.png",
    new Rect(4, 4, 4, 4)
  );
  progressSprite.color = new Color(50, 50, 255);

  const thumbSprite = new Scale9Sprite(
    "default_theme/rounded_shadow_2.png",
    new Rect(8, 8, 8, 8)
  );
  thumbSprite.width = 24;
  thumbSprite.height = 24;

  const slider = new ControlSlider(
    width,
    height,
    0.0,
    5.0,
    new Rect(4, 4, 8, 8)
  );
  slider.initWithSprites(backgroundSprite, thumbSprite, progressSprite);
  slider.anchorX = 0.5;
  slider.anchorY = 0.5;
  return slider;
}

export default class ControlSliderTest extends Node {
  constructor() {
    super();

    SpriteFrameCache.getInstance().addSpriteFrames(s_simpleTheme_plist);

    this._displayValueLabel = new TextBMFont(
      "Move the slider thumb!\nThe lower slider is restricted.",
      s_simpleFont_fnt
    );
    this._displayValueLabel.lineHeight = 18;
    this._displayValueLabel.color = Color.WHITE;
    this._displayValueLabel.anchorX = 0.5;
    this._displayValueLabel.anchorY = 0.5;
    this._displayValueLabel.x = 128;
    this._displayValueLabel.y = 70;
    this._displayValueLabel.align = TextBMFont.ALIGN_CENTER;
    this.addChild(this._displayValueLabel);

    const sliderWidth = 256;

    const slider = createSlider(sliderWidth);
    slider.x = 0;
    slider.y = 16;
    slider.tag = 1;
    slider.addTargetWithActionForControlEvents(
      this,
      this.upperValueChanged,
      CONTROL_EVENT_VALUE_CHANGED
    );

    const restrictSlider = createSlider(sliderWidth);
    restrictSlider.maximumAllowedValue = 4.0;
    restrictSlider.minimumAllowedValue = 1.5;
    restrictSlider.value = 3.0;
    restrictSlider.x = 0;
    restrictSlider.y = -24;
    restrictSlider.tag = 2;
    restrictSlider.addTargetWithActionForControlEvents(
      this,
      this.lowerValueChanged,
      CONTROL_EVENT_VALUE_CHANGED
    );

    this.addChild(slider);
    this.addChild(restrictSlider);
  }

  upperValueChanged(sender) {
    this._displayValueLabel.setString(
      `Upper slider value = ${sender.value.toFixed(2)}`
    );
  }

  lowerValueChanged(sender) {
    this._displayValueLabel.setString(
      `Lower slider value = ${sender.value.toFixed(2)}`
    );
  }
}
