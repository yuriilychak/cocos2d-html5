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

//------------------------------------------------------------------
//
// SchedulerTest
//
//------------------------------------------------------------------
import { EaseSpriteDemo } from "./ease-sprite-demo";
import { winSize } from "../constants";
import { Point } from "@aspect/core";
import { JumpBy, RotateBy, Speed, sequence, spawn } from "@aspect/actions";

export class SchedulerTest extends EaseSpriteDemo {
  constructor() {
    super();
    this.testDuration = 0.1;
  }

  onEnter() {
    //----start13----onEnter
    super.onEnter();

    // rotate and jump
    var jump1 = new JumpBy(4, new Point(-winSize.width + 80, 0), 100, 4);
    var jump2 = jump1.reverse();
    var rot1 = new RotateBy(4, 360 * 2);
    var rot2 = rot1.reverse();

    var seq3_1 = sequence(jump2, jump1);
    var seq3_2 = sequence(rot1, rot2);
    var spawn = spawn(seq3_1, seq3_2);
    var action = spawn.repeatForever();

    var action2 = action.clone();
    var action3 = action.clone();

    //old api
    //this._grossini.runAction(new Speed(action, 0.5));
    //this._tamara.runAction(new Speed(action2, 1.5));
    //this._kathia.runAction(new Speed(action3, 1.0));

    this._grossini.runAction(action.speed(0.5));
    this._tamara.runAction(action2.speed(1.5));
    this._kathia.runAction(action3.speed(1.0));

    var emitter = new cc.ParticleFireworks();
    emitter.setTotalParticles(250);
    emitter.texture = cc.textureCache.addImage("Images/fire.png");
    this.addChild(emitter);
    //----end13----
  }
  title() {
    return "Scheduler scaleTime Test";
  }

  // automation
  getExpectedResult() {
    throw "Not Implemented";
  }
  getCurrentResult() {
    throw "Not Implemented";
  }
}
