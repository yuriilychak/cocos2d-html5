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

import { EventDispatcherTestDemo } from "./event-dispatcher-test-demo";
import { TouchableSprite } from "./touchable-sprite";
import {
  s_extensions_button,
  s_extensions_buttonBackground,
  s_extensions_buttonHighlighted
} from "../resources";
import { Color, Director, EventManager, LabelTTF, LayerColor, visibleRect } from "@aspect/core";
import { Scale9Sprite } from "@aspect/ccui";
import { Menu, MenuItemFont } from "@aspect/menus";

import { CONTROL_STATE_HIGHLIGHTED, ControlButton } from "@aspect/gui";
export class PauseResumeTargetTest extends EventDispatcherTestDemo {
  constructor() {
    //----start11----ctor
    super();

    var origin = Director.getInstance().getVisibleOrigin();
    var size = Director.getInstance().getVisibleSize();

    var sprite1 = TouchableSprite.create();
    sprite1.setTexture("Images/CyanSquare.png");
    sprite1.x = origin.x + size.width / 2 - 180;
    sprite1.y = origin.y + size.height / 2 + 40;
    this.addChild(sprite1, 10);

    var sprite2 = TouchableSprite.create();
    sprite2.setTexture("Images/MagentaSquare.png");
    sprite2.x = origin.x + size.width / 2 - 100;
    sprite2.y = origin.y + size.height / 2;
    this.addChild(sprite2, 1);

    var sprite3 = TouchableSprite.create(100); // Sprite3 uses fixed priority listener
    sprite3.setTexture("Images/YellowSquare.png");
    sprite3.x = 0;
    sprite3.y = 0;
    sprite2.addChild(sprite3, -1);

    var _this = this;
    var popup = new MenuItemFont("Popup", function (sender) {
      sprite3.getListener().setEnabled(false);
      EventManager.getInstance().pauseTarget(_this, true);
      var colorLayer = new LayerColor(new Color(0, 0, 255, 100));
      _this.addChild(colorLayer, 999); //set colorLayer to top

      // Add the button
      var backgroundButton = new Scale9Sprite(s_extensions_button);
      var backgroundHighlightedButton = new Scale9Sprite(
        s_extensions_buttonHighlighted
      );

      var titleButton = new LabelTTF("Close Dialog", "Marker Felt", 26);
      titleButton.color = new Color(159, 168, 176);

      var controlButton = new ControlButton(titleButton, backgroundButton);
      controlButton.setBackgroundSpriteForState(
        backgroundHighlightedButton,
        CONTROL_STATE_HIGHLIGHTED
      );
      controlButton.setTitleColorForState(
        Color.WHITE,
        CONTROL_STATE_HIGHLIGHTED
      );

      controlButton.anchorX = 0.5;
      controlButton.anchorY = 1;
      controlButton.x = size.width / 2 + 50;
      controlButton.y = size.height / 2;
      colorLayer.addChild(controlButton, 1);
      controlButton.addTargetWithActionForControlEvents(
        this,
        function () {
          colorLayer.removeFromParent();
          EventManager.getInstance().resumeTarget(_this, true);
          sprite3.getListener().setEnabled(true);
        },
        cc.CONTROL_EVENT_TOUCH_UP_INSIDE
      );

      // Add the black background
      var background = new Scale9Sprite(s_extensions_buttonBackground);
      background.width = 300;
      background.height = 170;
      background.x = size.width / 2.0 + 50;
      background.y = size.height / 2.0;
      colorLayer.addChild(background);
    });

    popup.setAnchorPoint(1, 0.5);
    popup.setPosition(visibleRect.right);

    var menu = new Menu(popup);
    menu.setAnchorPoint(0, 0);
    menu.setPosition(0, 0);

    this.addChild(menu);
    //----end11----
  }

  title() {
    return "PauseResumeTargetTest";
  }

  subtitle() {
    return "Yellow block uses fixed priority";
  }
}
