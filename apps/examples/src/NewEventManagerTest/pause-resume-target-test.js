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
import { s_simpleFont_fnt } from "../resources";
import { Color, Rect, ServiceLocator } from "@aspect/core";
import { BMButton, ImageView, Widget } from "@aspect/ccui";
import { ButtonLayout } from "../button-layout";

export class PauseResumeTargetTest extends EventDispatcherTestDemo {
  constructor() {
    //----start11----ctor
    super();

    var origin = ServiceLocator.director.getVisibleOrigin();
    var size = ServiceLocator.director.getVisibleSize();

    var sprite1 = TouchableSprite.create();
    sprite1.color = new Color(0, 255, 255);
    sprite1.x = origin.x + size.width / 2 - 180;
    sprite1.y = origin.y + size.height / 2 + 40;
    this.addChild(sprite1, 10);

    var sprite2 = TouchableSprite.create();
    sprite2.color = new Color(255, 0, 255);
    sprite2.x = origin.x + size.width / 2 - 100;
    sprite2.y = origin.y + size.height / 2;
    this.addChild(sprite2, 1);

    var sprite3 = TouchableSprite.create(100); // Sprite3 uses fixed priority listener
    sprite3.color = new Color(255, 255, 0);
    sprite3.x = 0;
    sprite3.y = 0;
    sprite2.addChild(sprite3, -1);

    var _this = this;

    const layout = new ButtonLayout(
      [{ label: "Popup", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) }],
      196,
      "Actions",
      () => {
        sprite3.getListener().enabled = false;
        ServiceLocator.eventManager.pauseTarget(_this, true);

        var overlay = new ImageView();
        overlay.setScale9Enabled(true);
        overlay.ignoreContentAdaptWithSize(false);
        overlay.loadTexture("default_theme/squere_shadow_0.png", Widget.PLIST_TEXTURE);
        overlay.setContentSize(size.width, size.height);
        overlay.color = new Color(0, 0, 0);
        overlay.opacity = 128;
        overlay.x = origin.x + size.width / 2;
        overlay.y = origin.y + size.height / 2;
        _this.addChild(overlay, 999);

        var background = new ImageView();
        background.setScale9Enabled(true);
        background.ignoreContentAdaptWithSize(false);
        background.loadTexture("default_theme/rounded_shadow_0.png", Widget.PLIST_TEXTURE);
        background.setCapInsets(new Rect(12, 12, 12, 12));
        background.setContentSize(300, 170);
        background.x = size.width / 2 + 50;
        background.y = size.height / 2;
        overlay.addChild(background);

        var closeBtn = new BMButton(
          "default_theme/rounded_shadow_4.png",
          "default_theme/rounded_shadow_4.png",
          "default_theme/rounded_shadow_4.png",
          Widget.PLIST_TEXTURE
        );
        closeBtn.setScale9Enabled(true);
        closeBtn.setCapInsets(new Rect(12, 12, 12, 12));
        closeBtn.setContentSize(160, 40);
        closeBtn.setTitleFntFile(s_simpleFont_fnt);
        closeBtn.setTitleText("Close Dialog");
        closeBtn.setTitleFontSize(16);
        closeBtn.setNormalBgColor(new Color(0x44, 0x55, 0x77));
        closeBtn.setPressedBgColor(new Color(0x22, 0x33, 0x55));
        closeBtn.pressedActionEnabled = true;
        closeBtn.x = size.width / 2 + 50;
        closeBtn.y = size.height / 2;
        overlay.addChild(closeBtn, 1);
        closeBtn.addClickEventListener(() => {
          overlay.removeFromParent();
          ServiceLocator.eventManager.resumeTarget(_this, true);
          sprite3.getListener().enabled = true;
        });
      }
    );

    this.addChild(layout);
    //----end11----
  }

  title() {
    return "PauseResumeTargetTest";
  }

  subtitle() {
    return "Yellow block uses fixed priority";
  }
}
