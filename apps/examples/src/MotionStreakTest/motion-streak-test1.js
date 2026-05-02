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
import { s_pathR1, s_streak } from "../resources";
import { Color, Director, Point, Sprite } from "@aspect/core";
import { MoveBy, RotateBy, TintTo, Sequence } from "@aspect/actions";

import { MotionStreak } from "@aspect/motion-streak";
export class MotionStreakTest1 extends MotionStreakTest {
  constructor() {
    super();
    this._root = null;
    this._target = null;
  }

  onEnter() {
    super.onEnter();

    var winSize = Director.getInstance().getWinSize();
    // the root object just rotates around
    this._root = new Sprite(s_pathR1);
    this.addChild(this._root, 1);
    this._root.x = winSize.width / 2;
    this._root.y = winSize.height / 2;

    // the target object is offset from root, and the streak is moved to follow it
    this._target = new Sprite(s_pathR1);
    this._root.addChild(this._target);
    this._target.x = winSize.width / 4;
    this._target.y = 0;

    // create the streak object and add it to the scene
    this._streak = new MotionStreak(2, 3, 32, Color.GREEN, s_streak);
    this.addChild(this._streak);
    // schedule an update on each frame so we can synchronize the streak with the target
    this.schedule(this.onUpdate);

    var a1 = new RotateBy(2, 360);

    var action1 = a1.repeatForever();
    var motion = new MoveBy(2, new Point(100, 0));
    this._root.runAction(new Sequence(motion, motion.reverse()).repeatForever());
    this._root.runAction(action1);

    var colorAction = new Sequence(
        new TintTo(0.2, 255, 0, 0),
        new TintTo(0.2, 0, 255, 0),
        new TintTo(0.2, 0, 0, 255),
        new TintTo(0.2, 0, 255, 255),
        new TintTo(0.2, 255, 255, 0),
        new TintTo(0.2, 255, 0, 255),
        new TintTo(0.2, 255, 255, 255)
      )
      .repeatForever();

    this._streak.runAction(colorAction);
  }

  onUpdate(delta) {
    var pos = this._target.convertToWorldSpace(
      new Point(this._target.width / 2, 0)
    );
    this._streak.x = pos.x;
    this._streak.y = pos.y;
  }

  title() {
    return "MotionStreak test 1";
  }
}
