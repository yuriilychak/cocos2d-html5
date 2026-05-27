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

import { Color, Director, Node, Sprite, Rect } from "@aspect/core";
import { Scale9Sprite, TextBMFont } from "@aspect/ccui";
import { CONTROL_EVENT_VALUE_CHANGED, ControlSwitch } from "@aspect/gui";
import ControlScene from "./control-scene";
import { TestScene } from "../../../test-scene";
import { s_simpleFont_fnt } from "../../../resources";

export default class ControlSwitchTest extends ControlScene {
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
      background.width = 80;
      background.height = 50;
      background.x = layer_width + background.width / 2.0;
      background.y = 0;
      background.color = new Color(64, 64, 64);
      layer.addChild(background);

      layer_width += background.width;

      this._displayValueLabel = new TextBMFont("#color", s_simpleFont_fnt);
      this._displayValueLabel.color = Color.WHITE;

      this._displayValueLabel.x = background.x;
      this._displayValueLabel.y = background.y;
      layer.addChild(this._displayValueLabel);

      const backgroundSprite = new Scale9Sprite(
        "default_theme/rounded_shadow_4.png",
        new Rect(8, 8, 8, 8)
      );

      backgroundSprite.width = 48;
      backgroundSprite.height = 24;
      backgroundSprite.color = new Color(32, 32, 32);

      const thumbSprite = new Scale9Sprite(
        "default_theme/rounded_shadow_2.png",
        new Rect(8, 8, 8, 8)
      );
      thumbSprite.width = 24;
      thumbSprite.height = 24;

      const onSprite = new Scale9Sprite(
        "default_theme/rounded_shadow_4.png",
        new Rect(8, 8, 8, 8)
      );
      onSprite.width = 48;
      onSprite.height = 24;
      onSprite.color = Color.GREEN;

      const offSprite = new Scale9Sprite(
        "default_theme/rounded_shadow_4.png",
        new Rect(8, 8, 8, 8)
      );
      offSprite.width = 48;
      offSprite.height = 24;
      offSprite.color = Color.RED;

      const switchControl = new ControlSwitch(
        48,
        24,
        backgroundSprite,
        onSprite,
        offSprite,
        thumbSprite
      );
      switchControl.x = layer_width + 10 + switchControl.width / 2;
      switchControl.y = 0;
      layer.addChild(switchControl);

      switchControl.addTargetWithActionForControlEvents(
        this,
        this.valueChanged,
        CONTROL_EVENT_VALUE_CHANGED
      );

      // Set the layer size
      layer.width = layer_width;
      layer.height = 0;
      layer.anchorX = 0.5;
      layer.anchorY = 0.5;

      // Update the value label
      this.valueChanged(switchControl, CONTROL_EVENT_VALUE_CHANGED);
      return true;
    }
    return false;
  }
  valueChanged(sender, controlEvent) {
    if (sender.isOn) {
      this._displayValueLabel.setString("On");
    } else {
      this._displayValueLabel.setString("Off");
    }
  }

  static create() {
    const scene = new TestScene("GUI Component", "Back");
    const layer = new ControlSwitchTest();
    layer._title = "Switch Test";
    scene.addChild(layer);

    return scene;
  }
}
