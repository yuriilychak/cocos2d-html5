/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import { Director, Color, Rect, SpriteFrameCache } from "@aspect/core";
import { Scale9Sprite, TextBMFont } from "@aspect/ccui";
import { CONTROL_EVENT_VALUE_CHANGED, ControlSlider } from "@aspect/gui";
import ControlScene from "./control-scene";
import { TestScene } from "../../../test-scene";
import { s_simpleFont_fnt, s_simpleTheme_plist } from "../../../resources";

export default class ControlSliderTest extends ControlScene {
  init() {
    if (super.init()) {
      const screenSize = Director.getInstance().getWinSize();

      SpriteFrameCache.getInstance().addSpriteFrames(s_simpleTheme_plist);

      // Add a label in which the slider value will be displayed
      this._displayValueLabel = new TextBMFont(
        "Move the slider thumb!\nThe lower slider is restricted.",
        s_simpleFont_fnt
      );
      this._displayValueLabel.lineHeight = 18;
      this._displayValueLabel.color = Color.WHITE;
      this._displayValueLabel.anchorX = 0.5;
      this._displayValueLabel.anchorY = 0.5;
      this._displayValueLabel.x = screenSize.width >> 1;
      this._displayValueLabel.y = (screenSize.height >> 1) + 70;
      this._displayValueLabel.align = TextBMFont.ALIGN_CENTER;
      this.addChild(this._displayValueLabel);

      const sliderWidth = 256;

      const slider = this._createSlider(sliderWidth);
      slider.x = (screenSize.width - sliderWidth) >> 1;
      slider.y = (screenSize.height >> 1) + 16;
      slider.tag = 1;
      slider.addTargetWithActionForControlEvents(
        this,
        this.upperValueChanged,
        CONTROL_EVENT_VALUE_CHANGED
      );

      const restrictSlider = this._createSlider(sliderWidth);
      restrictSlider.maximumAllowedValue = 4.0;
      restrictSlider.minimumAllowedValue = 1.5;
      restrictSlider.value = 3.0;
      restrictSlider.x = (screenSize.width - sliderWidth) >> 1;
      restrictSlider.y = (screenSize.height >> 1) - 24;
      restrictSlider.tag = 2;
      restrictSlider.addTargetWithActionForControlEvents(
        this,
        this.lowerValueChanged,
        CONTROL_EVENT_VALUE_CHANGED
      );

      this.addChild(slider);
      this.addChild(restrictSlider);

      return true;
    }

    return false;
  }
  _createSlider(width = 256, height = 16) {
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

  upperValueChanged(sender, controlEvent) {
    // Change value of label.
    this._displayValueLabel.setString(
      `Upper slider value = ${sender.value.toFixed(2)}`
    );
  }

  lowerValueChanged(sender, controlEvent) {
    // Change value of label.
    this._displayValueLabel.setString(
      `Lower slider value = ${sender.value.toFixed(2)}`
    );
  }

  static create() {
    const scene = new TestScene("GUI Component", "Back");
    const layer = new ControlSliderTest();
    layer._title = "Slider Test";
    scene.addChild(layer);
    
    return scene;
  }
}
