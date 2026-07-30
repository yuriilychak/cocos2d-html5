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
import { Color, Point, Sprite, ServiceLocator } from "@aspect/core";
import { MoveBy, RotateBy, TintTo, Sequence } from "@aspect/actions";

import { MotionStreak } from "@aspect/motion-streak";
export class MotionStreakTest1 extends MotionStreakTest {
  #pos = new Point();
  #root = null;
  #target = null;

  onEnter() {
    super.onEnter();

    var winSize = ServiceLocator.eglView.winSizeInPoints;
    // the root object just rotates around
    this.#root = new Sprite(s_pathR1);
    this.addChild(this.#root, 1);
    this.#root.x = winSize.width / 2;
    this.#root.y = winSize.height / 2;

    // the target object is offset from root, and the streak is moved to follow it
    this.#target = new Sprite(s_pathR1);
    this.#root.addChild(this.#target);
    this.#target.x = winSize.width / 4;
    this.#target.y = 0;

    // create the streak object and add it to the scene
    this.streak = new MotionStreak(2, 3, 32, Color.GREEN, s_streak);
    this.addChild(this.streak);
    // schedule an update on each frame so we can synchronize the streak with the target
    this.scheduler.schedule(this.onUpdate);

    var a1 = new RotateBy(2, 360);

    var action1 = a1.repeatForever();
    var motion = new MoveBy(2, new Point(100, 0));
    this.#root.runAction(
      new Sequence(motion, motion.reverse()).repeatForever()
    );
    this.#root.runAction(action1);

    var colorAction = new Sequence(
      new TintTo(0.2, 255, 0, 0),
      new TintTo(0.2, 0, 255, 0),
      new TintTo(0.2, 0, 0, 255),
      new TintTo(0.2, 0, 255, 255),
      new TintTo(0.2, 255, 255, 0),
      new TintTo(0.2, 255, 0, 255),
      new TintTo(0.2, 255, 255, 255)
    ).repeatForever();

    this.streak.runAction(colorAction);

    this.#pos.set(this.#target.width / 2, 0);
  }

  onUpdate(delta) {
    this.#pos.set(this.#target.width / 2, 0);
    this.streak.position = this.#target.convertToWorldSpace(this.#pos);
  }

  title() {
    return "MotionStreak test 1";
  }
}
