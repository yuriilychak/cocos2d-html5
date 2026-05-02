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

import { MotionStreakTest } from "./motion-streak-test";
import { s_streak } from "../resources";
import { Color, Director, EventListener, EventManager } from "@aspect/core";

import { MotionStreak } from "@aspect/motion-streak";
export class MotionStreakTest2 extends MotionStreakTest {
  constructor() {
    super();
    this._root = null;
    this._target = null;
  }

  onEnter() {
    super.onEnter();

    EventManager.getInstance().addListener(
      {
        event: EventListener.TOUCH_ALL_AT_ONCE,
        onTouchesMoved: function (touches, event) {
          if (touches.length == 0) return;

          var touch = touches[0];
          var touchLocation = touch.getLocation();
          var streak = event.getCurrentTarget()._streak;
          streak.x = touchLocation.x;
          streak.y = touchLocation.y;
        }
      },
      this
    );
    var winSize = Director.getInstance().getWinSize();
    // create the streak object and add it to the scene
    this._streak = new MotionStreak(3, 3, 64, Color.WHITE, s_streak);
    this.addChild(this._streak);
    this._streak.x = winSize.width / 2;
    this._streak.y = winSize.height / 2;
  }

  title() {
    return "MotionStreak test";
  }
}
