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

import { TAG_LABEL } from "./motion-streak-test-constants";
import {
  backMotionAction,
  nextMotionAction,
  restartMotionAction
} from "./motion-streak-test-helpers";
import { MotionStreakTestScene } from "./motion-streak-test-scene";
import {
  s_pathB1,
  s_pathB2,
  s_pathF1,
  s_pathF2,
  s_pathR1,
  s_pathR2
} from "../resources";
import { LabelTTF, Layer } from "@aspect/core";

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

    var winSize = cc.director.getWinSize();

    var label = new LabelTTF(this.title(), "Arial", 32);
    this.addChild(label, 0, TAG_LABEL);
    label.x = winSize.width / 2;
    label.y = winSize.height - 50;

    var subTitle = this.subtitle();
    if (subTitle.length > 0) {
      var l = new LabelTTF(subTitle, "Arial", 16);
      this.addChild(l, 1);
      l.x = winSize.width / 2;
      l.y = winSize.height - 80;
    }

    var item1 = new cc.MenuItemImage(
      s_pathB1,
      s_pathB2,
      this.backCallback,
      this
    );
    var item2 = new cc.MenuItemImage(
      s_pathR1,
      s_pathR2,
      this.restartCallback,
      this
    );
    var item3 = new cc.MenuItemImage(
      s_pathF1,
      s_pathF2,
      this.nextCallback,
      this
    );

    var menu = new cc.Menu(item1, item2, item3);

    menu.x = 0;
    menu.y = 0;
    item1.x = cc.visibleRect.center.x - item2.width * 2;
    item1.y = cc.visibleRect.bottom.y + item2.height / 2;
    item2.x = cc.visibleRect.center.x;
    item2.y = cc.visibleRect.bottom.y + item2.height / 2;
    item3.x = cc.visibleRect.center.x + item2.width * 2;
    item3.y = cc.visibleRect.bottom.y + item2.height / 2;

    this.addChild(menu, 1);

    var itemMode = new cc.MenuItemToggle(
      new cc.MenuItemFont("Use High Quality Mode"),
      new cc.MenuItemFont("Use Fast Mode"),
      this.modeCallback,
      this
    );

    var menuMode = new cc.Menu(itemMode);
    this.addChild(menuMode);

    menuMode.x = winSize.width / 2;
    menuMode.y = winSize.height / 4;
  }

  restartCallback(sender) {
    var scene = new MotionStreakTestScene();
    scene.addChild(restartMotionAction());
    cc.director.runScene(scene);
  }

  nextCallback(sender) {
    var scene = new MotionStreakTestScene();
    scene.addChild(nextMotionAction());
    cc.director.runScene(scene);
  }

  backCallback(sender) {
    var scene = new MotionStreakTestScene();
    scene.addChild(backMotionAction());
    cc.director.runScene(scene);
  }

  modeCallback(sender) {
    var fastMode = this._streak.fastMode;
    this._streak.fastMode = !fastMode;
  }
}
