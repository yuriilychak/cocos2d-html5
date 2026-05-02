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

import { DenshionTests } from "./cocos-denshion-test-constants";
import { director, winSize } from "../constants";
import { LINE_SPACE } from "../tests-main-helpers";
import { Color, EventListener, EventManager, EventMouse, LabelTTF, LayerGradient, Point, Sys } from "@aspect/core";
import { Menu, MenuItemLabel } from "@aspect/menus";

export class CocosDenshionTest extends LayerGradient {
  constructor() {
    super(new Color(0, 0, 0, 255), new Color(148, 80, 120, 255));

    this._itemMenu = null;

    this._beginPos = new Point(0, 0);

    this._testCount = 0;

    this._itemMenu = new Menu();
    var winSize = director.getWinSize();
    for (var i = 0; i < DenshionTests.length; i++) {
      var label = new LabelTTF(DenshionTests[i].title, "Arial", 24);
      var menuItem = new MenuItemLabel(label, this.onMenuCallback, this);
      this._itemMenu.addChild(menuItem, i + 10000);
      menuItem.x = winSize.width / 2;
      menuItem.y = winSize.height - (i + 1) * LINE_SPACE;
    }
    this._testCount = i;
    this._itemMenu.width = winSize.width;
    this._itemMenu.height = (this._testCount + 1) * LINE_SPACE;
    this._itemMenu.x = 0;
    this._itemMenu.y = 0;
    this.addChild(this._itemMenu);

    if ("touches" in Sys.getInstance().capabilities) {
      EventManager.getInstance().addListener(
        {
          event: EventListener.TOUCH_ALL_AT_ONCE,
          onTouchesMoved: function (touches, event) {
            event.getCurrentTarget().moveMenu(touches[0].getDelta());
          }
        },
        this
      );
    } else if ("mouse" in Sys.getInstance().capabilities)
      EventManager.getInstance().addListener(
        {
          event: EventListener.MOUSE,
          onMouseMove: function (event) {
            if (event.getButton() == EventMouse.BUTTON_LEFT)
              event.getCurrentTarget().moveMenu(event.getDelta());
          }
        },
        this
      );

    // set default volume
    audioEngine.setEffectsVolume(0.5);
    audioEngine.setMusicVolume(0.5);
  }
  onExit() {
    super.onExit();
    audioEngine.stopMusic();
    audioEngine.stopAllEffects();
  }

  onMenuCallback(sender) {
    var idx = sender.zIndex - 10000;
    // create the test scene and run it
    var scene = DenshionTests[idx].playFunc();
  }

  moveMenu(delta) {
    var newY = this._itemMenu.y + delta.y;

    if (newY < 0) newY = 0;

    if (newY > (DenshionTests.length + 1) * LINE_SPACE - winSize.height)
      newY = (DenshionTests.length + 1) * LINE_SPACE - winSize.height;

    this._itemMenu.y = newY;
  }
}
