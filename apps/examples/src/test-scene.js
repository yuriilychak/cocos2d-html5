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

import { TestController } from "./test-controller";
import { s_simpleFont_fnt } from "./resources";
import { director } from "./constants";
import { Color, Director, Game, Rect, Scene, Sys } from "@aspect/core";
import { TransitionFade } from "@aspect/transitions";
import { BMButton, ImageView, TextBMFont, Widget } from "@aspect/ccui";

export const HEADER_HEIGHT = 56;

const PADDING = 16;
const BTN_WIDTH = 128;
const BTN_HEIGHT = 32;
const SUITE_TITLE_AREA = 220; // reserved width for suite title

export class TestScene extends Scene {
  constructor(title = "", subtitle = null, bPortrait) {
    super();

    this._mainMenu = null;
    this._testInfoLabel = null;
    this.init();

    const winSizeLocal = Director.getInstance().getWinSize();
    const winH = winSizeLocal.height;
    const winW = winSizeLocal.width;
    const centerY = winH - HEADER_HEIGHT / 2;

    const header = new ImageView();
    header.setScale9Enabled(true);
    header.ignoreContentAdaptWithSize(false);
    header.loadTexture(
      "default_theme/squere_shadow_4.png",
      Widget.PLIST_TEXTURE
    );
    header.setCapInsets(new Rect(12, 12, 12, 12));
    header.setColor(new Color(0x35, 0x39, 0x41));
    header.setContentSize(winW, HEADER_HEIGHT);
    header.x = winW / 2;
    header.y = winH - HEADER_HEIGHT / 2;
    this.addChild(header, 10);

    const titleLabel = new TextBMFont(title, s_simpleFont_fnt);
    titleLabel.setAnchorPoint(0, 0.5);
    titleLabel.x = PADDING;
    titleLabel.y = centerY;
    titleLabel.fontSize = 20;
    this.addChild(titleLabel, 11);

    const testInfoLabel = new TextBMFont("", s_simpleFont_fnt);
    testInfoLabel.setAnchorPoint(0, 0.5);
    testInfoLabel.x = PADDING + SUITE_TITLE_AREA + PADDING;
    testInfoLabel.y = centerY;
    testInfoLabel.fontSize = 14;
    this.addChild(testInfoLabel, 11);
    this._testInfoLabel = testInfoLabel;

    const btn = new BMButton(
      "default_theme/rounded_shadow_2.png",
      "default_theme/rounded_shadow_2.png",
      "default_theme/rounded_shadow_2.png",
      Widget.PLIST_TEXTURE
    );
    btn.setScale9Enabled(true);
    btn.setCapInsets(new Rect(12, 12, 12, 12));
    btn.setContentSize(BTN_WIDTH, BTN_HEIGHT);
    btn.setTitleFntFile(s_simpleFont_fnt);
    btn.setTitleText("Main Menu");
    btn.setTitleFontSize(18);
    btn.setNormalBgColor(new Color(0x44, 0x55, 0x77));
    btn.setPressedBgColor(new Color(0x22, 0x33, 0x55));
    btn.setDisabledBgColor(new Color(0x55, 0x55, 0x55));
    btn.pressedActionEnabled = true;
    btn.addClickEventListener(() => this.onMainMenuCallback());
    btn.x = winW - BTN_WIDTH / 2 - PADDING;
    btn.y = centerY;
    this.addChild(btn, 11);

    this._mainMenu = btn;

    if (window.sideIndexBar) {
      btn.setVisible(false);
    }
  }

  setTestInfo(title, subtitle) {
    const text = subtitle ? `${title} - ${subtitle}` : title || "";
    this._testInfoLabel.setString(text);
  }

  onMainMenuCallback() {
    if (director.isPaused()) {
      director.resume();
    }
    this._mainMenu.setEnabled(false);
    const scene = new TestScene("Examples");
    scene.onMainMenuCallback = () => {
      if (Sys.getInstance().isNative) {
        Game.getInstance().end();
      } else {
        window.history && window.history.go(-1);
      }
    };
    const layer = new TestController();
    scene.addChild(layer);
    const transition = new TransitionFade(0.5, scene, new Color(0, 0, 0, 255));
    director.runScene(transition);
  }

  runThisTest() {
    // override me
  }
}
