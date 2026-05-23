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

import ControlScene from "./control-scene";
import {
  s_extensions_button,
  s_extensions_buttonBackground,
  s_extensions_buttonHighlighted,
  s_simpleFont_fnt
} from "../../../resources";
import { Color, Director, Node, Size } from "@aspect/core";
import { TestScene } from "../../../test-scene";
import { Scale9Sprite, TextBMFont } from "@aspect/ccui";

import { CONTROL_STATE_HIGHLIGHTED, ControlButton } from "@aspect/gui";
export default class ControlButtonTest_Styling extends ControlScene {
  init() {
    if (super.init()) {
      var screenSize = Director.getInstance().getWinSize();

      var layer = new Node();
      this.addChild(layer, 1);

      var space = 10; // px

      var max_w = 0,
        max_h = 0;
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          // Add the buttons
          var button = this.standardButtonWithTitle(
            (0 | (Math.random() * 30)) + ""
          );
          button.setAdjustBackgroundImage(false); // Tells the button that the background image must not be adjust
          // It'll use the prefered size of the background image
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
      layer.x = screenSize.width / 2.0;
      layer.y = screenSize.height / 2.0;

      // Add the black background
      var backgroundButton = new Scale9Sprite(s_extensions_buttonBackground);
      backgroundButton.width = max_w + 14;
      backgroundButton.height = max_h + 14;
      backgroundButton.x = screenSize.width / 2.0;
      backgroundButton.y = screenSize.height / 2.0;
      this.addChild(backgroundButton);
      return true;
    }
    return false;
  }
  standardButtonWithTitle(title) {
    /** Creates and return a button with a default background and title color. */
    var backgroundButton = new Scale9Sprite(s_extensions_button);
    backgroundButton.setPreferredSize(new Size(45, 45)); // Set the prefered size
    var backgroundHighlightedButton = new Scale9Sprite(
      s_extensions_buttonHighlighted
    );
    backgroundHighlightedButton.setPreferredSize(new Size(45, 45)); // Set the prefered size

    var titleButton = new TextBMFont(title, s_simpleFont_fnt);

    titleButton.color = Color.WHITE;

    var button = new ControlButton(
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

  static create() {
    const scene = new TestScene("GUI Component", "Back");
    const layer = new ControlButtonTest_Styling();
    layer._title = "Button Styling";
    scene.addChild(layer);
    return scene;
  }
}
