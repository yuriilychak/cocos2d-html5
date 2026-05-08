/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 Copyright (c) 2008-2009 Jason Booth

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

import {
  backMotionAction,
  nextMotionAction,
  restartMotionAction
} from "./motion-streak-test-helpers";
import { MotionStreakTestScene } from "./motion-streak-test-scene";
import { s_simpleFont_fnt } from "../resources";
import { Color, Director, Layer, Rect } from "@aspect/core";
import { BMButton, Widget } from "@aspect/ccui";

export class MotionStreakTest extends Layer {
  constructor() {
    super();
    this._streak = null;
  }

  title() {
    return "No title";
  }
  subtitle() {
    return "";
  }

  onEnter() {
    super.onEnter();
    var winSize = Director.getInstance().getWinSize();

    let scene = this.getParent();
    while (scene && !scene.setTestInfo) {
      scene = scene.getParent();
    }
    if (scene) {
      scene.setTestInfo(this.title(), this.subtitle());
      scene.setNavCallbacks(
        () => this.backCallback(),
        () => this.restartCallback(),
        () => this.nextCallback()
      );
    }

    let isFastMode = false;
    const modeBtn = new BMButton(
      "default_theme/rounded_shadow_2.png",
      "default_theme/rounded_shadow_2.png",
      "default_theme/rounded_shadow_2.png",
      Widget.PLIST_TEXTURE
    );
    modeBtn.setScale9Enabled(true);
    modeBtn.setCapInsets(new Rect(12, 12, 12, 12));
    modeBtn.setContentSize(196, 32);
    modeBtn.setTitleFntFile(s_simpleFont_fnt);
    modeBtn.setTitleText("Use High Quality Mode");
    modeBtn.setTitleFontSize(12);
    modeBtn.setNormalBgColor(new Color(0x00, 0x99, 0x00));
    modeBtn.setPressedBgColor(new Color(0x00, 0x66, 0x00));
    modeBtn.setDisabledBgColor(new Color(0x55, 0x55, 0x55));
    modeBtn.pressedActionEnabled = true;
    modeBtn.x = winSize.width / 2;
    modeBtn.y = winSize.height / 4;
    modeBtn.addClickEventListener(() => {
      isFastMode = !isFastMode;
      modeBtn.setTitleText(isFastMode ? "Use Fast Mode" : "Use High Quality Mode");
      if (this._streak) {
        this._streak.fastMode = isFastMode;
      }
    });
    this.addChild(modeBtn, 1);
  }

  restartCallback(sender) {
    var scene = new MotionStreakTestScene();
    scene.addChild(restartMotionAction());
    Director.getInstance().runScene(scene);
  }

  nextCallback(sender) {
    var scene = new MotionStreakTestScene();
    scene.addChild(nextMotionAction());
    Director.getInstance().runScene(scene);
  }

  backCallback(sender) {
    var scene = new MotionStreakTestScene();
    scene.addChild(backMotionAction());
    Director.getInstance().runScene(scene);
  }

  modeCallback(sender) {
    var fastMode = this._streak.fastMode;
    this._streak.fastMode = !fastMode;
  }
}
