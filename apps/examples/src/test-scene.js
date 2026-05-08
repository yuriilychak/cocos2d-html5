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
const NAV_BTN_SIZE = 32;
const NAV_BTN_GAP = 8;

export class TestScene extends Scene {
  constructor(title = "", backButtonText = "Main Menu") {
    super();

    this._suiteTitle = title;
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

    const testInfoLabel = new TextBMFont(title, s_simpleFont_fnt);
    testInfoLabel.setAnchorPoint(0, 0.5);
    testInfoLabel.x = PADDING;
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
    btn.setTitleText(backButtonText);
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

    const makeNavBtn = (text, x) => {
      const b = new BMButton(
        "default_theme/rounded_shadow_2.png",
        "default_theme/rounded_shadow_2.png",
        "default_theme/rounded_shadow_2.png",
        Widget.PLIST_TEXTURE
      );
      b.setScale9Enabled(true);
      b.setCapInsets(new Rect(12, 12, 12, 12));
      b.setContentSize(NAV_BTN_SIZE, NAV_BTN_SIZE);
      b.setTitleFntFile(s_simpleFont_fnt);
      b.setTitleText(text);
      b.setTitleFontSize(18);
      b.setNormalBgColor(new Color(0x44, 0x55, 0x77));
      b.setPressedBgColor(new Color(0x22, 0x33, 0x55));
      b.setDisabledBgColor(new Color(0x55, 0x55, 0x55));
      b.pressedActionEnabled = true;
      b.x = x;
      b.y = centerY;
      b.setVisible(false);
      this.addChild(b, 11);
      return b;
    };

    const navRightEdge = winW - BTN_WIDTH - PADDING - NAV_BTN_GAP;
    const navForwardX = navRightEdge - NAV_BTN_SIZE / 2;
    const navRestartX = navForwardX - NAV_BTN_SIZE - NAV_BTN_GAP;
    const navBackX = navRestartX - NAV_BTN_SIZE - NAV_BTN_GAP;

    this._navBack = makeNavBtn("⬅", navBackX);
    this._navRestart = makeNavBtn("⟳", navRestartX);
    this._navForward = makeNavBtn("➡", navForwardX);
  }

  setNavCallbacks(onBack, onRestart, onForward) {
    if (onBack) {
      this._navBack.addClickEventListener(onBack);
      this._navBack.setVisible(true);
    }
    if (onRestart) {
      this._navRestart.addClickEventListener(onRestart);
      this._navRestart.setVisible(true);
    }
    if (onForward) {
      this._navForward.addClickEventListener(onForward);
      this._navForward.setVisible(true);
    }
  }

  setTestInfo(subtitle, description) {
    let text = this._suiteTitle;
    if (subtitle) text += `: ${subtitle}`;
    if (description) text += ` - ${description}`;
    this._testInfoLabel.setString(text);
  }

  onMainMenuCallback() {
    if (director.isPaused()) {
      director.resume();
    }
    this._mainMenu.setEnabled(false);
    const scene = new TestScene("Examples", "Close");
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
