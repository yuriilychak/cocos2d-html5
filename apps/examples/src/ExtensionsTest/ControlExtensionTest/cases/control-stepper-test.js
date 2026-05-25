/**************************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

 */

import ControlScene from "./control-scene";
import { Color, Director, Node, Rect } from "@aspect/core";
import { TestScene } from "../../../test-scene";
import { BMButton, Scale9Sprite, TextBMFont, Widget } from "@aspect/ccui";
import { s_simpleFont_fnt } from "../../../resources";

import { CONTROL_EVENT_VALUE_CHANGED, ControlStepper } from "@aspect/gui";
export default class ControlStepperTest extends ControlScene {
  init() {
    if (super.init()) {
      const screenSize = Director.getInstance().getWinSize();

      const layer = new Node();
      layer.x = screenSize.width / 2;
      layer.y = screenSize.height / 2;
      this.addChild(layer, 1);
      let layer_width = 0;

      // Add the black background for the text
      const background = new Scale9Sprite(
        "default_theme/rounded_shadow_4.png",
        new Rect(8, 8, 8, 8)
      );
      background.color = new Color(32, 32, 32);
      background.width = 100;
      background.height = 50;
      background.x = layer_width + background.width / 2.0;
      background.y = 0;
      layer.addChild(background);

      this._displayValueLabel = new TextBMFont("0", s_simpleFont_fnt);

      this._displayValueLabel.x = background.x;
      this._displayValueLabel.y = background.y;
      layer.addChild(this._displayValueLabel);

      layer_width += background.width;

      const stepper = this.makeControlStepper();
      stepper.x = layer_width + 10 + stepper.width / 2;
      stepper.y = 0;
      stepper.addTargetWithActionForControlEvents(
        this,
        this.valueChanged,
        CONTROL_EVENT_VALUE_CHANGED
      );
      layer.addChild(stepper);

      layer_width += stepper.width;

      // Set the layer size
      layer.width = layer_width;
      layer.height = 0;
      layer.anchorX = 0.5;
      layer.anchorY = 0.5;

      // Update the value label
      this.valueChanged(stepper, CONTROL_EVENT_VALUE_CHANGED);
      return true;
    }
    return false;
  }
  makeControlStepper() {
    const makeBtn = (text) => {
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
    };

    return new ControlStepper(makeBtn("-"), makeBtn("+"));
  }

  valueChanged(sender, controlEvent) {
    // Change value of label.
    this._displayValueLabel.setString(sender.value.toString());
  }

  static create() {
    const scene = new TestScene("GUI Component", "Back");
    const layer = new ControlStepperTest();
    layer._title = "Stepper Test";
    scene.addChild(layer);
    return scene;
  }
}
