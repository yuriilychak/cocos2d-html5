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

import {
  easeActionsTestIdx,
  _seteaseActionsTestIdx
} from "./ease-actions-test-constants";
import { SchedulerTest } from "./scheduler-test";
import { SpeedTest } from "./speed-test";
import { SpriteEaseBackInOut } from "./sprite-ease-back-in-out";
import { SpriteEaseBack } from "./sprite-ease-back";
import { SpriteEaseBezierTest } from "./sprite-ease-bezier-test";
import { SpriteEaseBounceInOut } from "./sprite-ease-bounce-in-out";
import { SpriteEaseBounce } from "./sprite-ease-bounce";
import { SpriteEaseCircleInOutTest } from "./sprite-ease-circle-in-out-test";
import { SpriteEaseCircleTest } from "./sprite-ease-circle-test";
import { SpriteEaseCubicInOutTest } from "./sprite-ease-cubic-in-out-test";
import { SpriteEaseCubicTest } from "./sprite-ease-cubic-test";
import { SpriteEaseElasticInOut } from "./sprite-ease-elastic-in-out";
import { SpriteEaseElastic } from "./sprite-ease-elastic";
import { SpriteEaseExponentialInOut } from "./sprite-ease-exponential-in-out";
import { SpriteEaseExponential } from "./sprite-ease-exponential";
import { SpriteEaseInOut } from "./sprite-ease-in-out";
import { SpriteEaseQuadraticInOutTest } from "./sprite-ease-quadratic-in-out-test";
import { SpriteEaseQuadraticTest } from "./sprite-ease-quadratic-test";
import { SpriteEaseQuarticInOutTest } from "./sprite-ease-quartic-in-out-test";
import { SpriteEaseQuarticTest } from "./sprite-ease-quartic-test";
import { SpriteEaseQuinticInOutTest } from "./sprite-ease-quintic-in-out-test";
import { SpriteEaseQuinticTest } from "./sprite-ease-quintic-test";
import { SpriteEaseSineInOut } from "./sprite-ease-sine-in-out";
import { SpriteEaseSine } from "./sprite-ease-sine";
import { SpriteEase } from "./sprite-ease";

//
// Flow control
//
export var arrayOfEaseActionsTest = [
  SpriteEase,
  SpriteEaseInOut,
  SpriteEaseExponential,
  SpriteEaseExponentialInOut,
  SpriteEaseSine,
  SpriteEaseSineInOut,
  SpriteEaseElastic,
  SpriteEaseElasticInOut,
  SpriteEaseBounce,
  SpriteEaseBounceInOut,
  SpriteEaseBack,
  SpriteEaseBackInOut,
  SpeedTest,
  SchedulerTest,
  SpriteEaseBezierTest,
  SpriteEaseQuadraticTest,
  SpriteEaseQuadraticInOutTest,
  SpriteEaseQuarticTest,
  SpriteEaseQuarticInOutTest,
  SpriteEaseQuinticTest,
  SpriteEaseQuinticInOutTest,
  SpriteEaseCircleTest,
  SpriteEaseCircleInOutTest,
  SpriteEaseCubicTest,
  SpriteEaseCubicInOutTest
];

export function nextEaseActionsTest() {
  _seteaseActionsTestIdx(easeActionsTestIdx + 1);
  _seteaseActionsTestIdx(easeActionsTestIdx % arrayOfEaseActionsTest.length);

  if (window.sideIndexBar) {
    _seteaseActionsTestIdx(
      window.sideIndexBar.changeTest(easeActionsTestIdx, 10)
    );
  }

  return new arrayOfEaseActionsTest[easeActionsTestIdx]();
}

export function previousEaseActionsTest() {
  _seteaseActionsTestIdx(easeActionsTestIdx - 1);
  if (easeActionsTestIdx < 0)
    _seteaseActionsTestIdx(easeActionsTestIdx + arrayOfEaseActionsTest.length);

  if (window.sideIndexBar) {
    _seteaseActionsTestIdx(
      window.sideIndexBar.changeTest(easeActionsTestIdx, 10)
    );
  }

  return new arrayOfEaseActionsTest[easeActionsTestIdx]();
}

export function restartEaseActionsTest() {
  return new arrayOfEaseActionsTest[easeActionsTestIdx]();
}
