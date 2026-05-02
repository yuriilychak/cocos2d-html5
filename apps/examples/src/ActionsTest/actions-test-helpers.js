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

import { ActionAnimate } from "./action-animate";
import { ActionBezierToCopy } from "./action-bezier-to-copy";
import { ActionBezier } from "./action-bezier";
import { ActionBlink } from "./action-blink";
import { ActionCallFunc1 } from "./action-call-func1";
import { ActionCallFunc2 } from "./action-call-func2";
import { ActionCallFunc3 } from "./action-call-func3";
import { ActionCardinalSpline } from "./action-cardinal-spline";
import { ActionCatmullRom } from "./action-catmull-rom";
import { ActionCustomTest } from "./action-custom-test";
import { ActionDelayTime } from "./action-delay-time";
import { ActionFade } from "./action-fade";
import { ActionFollow } from "./action-follow";
import { ActionIssue13605 } from "./action-issue13605";
import { ActionJump } from "./action-jump";
import { ActionManual } from "./action-manual";
import { ActionMove } from "./action-move";
import { ActionRepeatForever } from "./action-repeat-forever";
import { ActionRepeat } from "./action-repeat";
import { ActionReverseSequence } from "./action-reverse-sequence";
import { ActionReverseSequence2 } from "./action-reverse-sequence2";
import { ActionReverse } from "./action-reverse";
import { ActionRotateJerk } from "./action-rotate-jerk";
import { ActionRotateToRepeat } from "./action-rotate-to-repeat";
import { ActionRotateXY } from "./action-rotate-xy";
import { ActionRotate } from "./action-rotate";
import { ActionScale } from "./action-scale";
import { ActionSequence } from "./action-sequence";
import { ActionSequence2 } from "./action-sequence2";
import { ActionSkewRotateScale } from "./action-skew-rotate-scale";
import { ActionSkew } from "./action-skew";
import { ActionSpawn } from "./action-spawn";
import { ActionStackableBezier } from "./action-stackable-bezier";
import { ActionStackableCardinalSpline } from "./action-stackable-cardinal-spline";
import { ActionStackableCatmullRom } from "./action-stackable-catmull-rom";
import { ActionStackableJump } from "./action-stackable-jump";
import { ActionStackableMove } from "./action-stackable-move";
import { ActionTargetedCopy } from "./action-targeted-copy";
import { ActionTargeted } from "./action-targeted";
import { ActionTint } from "./action-tint";
import { actionsTestIdx, _setactionsTestIdx } from "./actions-test-constants";
import { Issue1008 } from "./issue1008";
import { Issue1288_2 } from "./issue1288-2";
import { Issue1288 } from "./issue1288";
import { Issue1305_2 } from "./issue1305-2";
import { Issue1305 } from "./issue1305";
import { Issue1327 } from "./issue1327";
import { Issue1438 } from "./issue1438";
import { Issue1446 } from "./issue1446";
import { PauseResumeActions } from "./pause-resume-actions";
import { SequenceRepeatTest } from "./sequence-repeat-test";
import { Color, rand } from "@aspect/core";

// special code, just for reduce code redundancy
export function createCustomAction(ActionObject) {
  class CustomAction extends ActionObject {
    update(dt) {
      super.update(dt);
      if (this.getTarget()) {
        // rand color
        this.getTarget().setColor(
          new Color(rand() % 255, rand() % 255, rand() % 255)
        );
      }
    }
  }

  return CustomAction;
}

//-
//
// Flow control
//
export var arrayOfActionsTest = [
  ActionManual,
  ActionMove,
  ActionScale,
  ActionRotate,
  ActionRotateXY,
  ActionSkew,
  ActionSkewRotateScale,
  ActionJump,
  ActionBezier,
  ActionBezierToCopy,
  Issue1008,
  ActionCardinalSpline,
  ActionCatmullRom,
  ActionBlink,
  ActionFade,
  ActionTint,
  ActionSequence,
  ActionSequence2,
  ActionSpawn,
  ActionReverse,
  ActionDelayTime,
  ActionRepeat,
  ActionRepeatForever,
  ActionRotateToRepeat,
  ActionRotateJerk,
  ActionCallFunc1,
  ActionCallFunc2,
  ActionCallFunc3,
  ActionReverseSequence,
  ActionReverseSequence2,

  ActionFollow,
  ActionTargeted,
  ActionTargetedCopy,

  ActionStackableMove,
  ActionStackableJump,
  ActionStackableBezier,
  ActionStackableCatmullRom,
  ActionStackableCardinalSpline,

  PauseResumeActions,
  Issue1305,
  Issue1305_2,
  Issue1288,
  Issue1288_2,
  Issue1327,
  ActionAnimate,
  Issue1438,
  Issue1446,
  SequenceRepeatTest,
  ActionCustomTest,
  ActionIssue13605
];

export function nextActionsTest() {
  _setactionsTestIdx(actionsTestIdx + 1);
  _setactionsTestIdx(actionsTestIdx % arrayOfActionsTest.length);

  if (window.sideIndexBar) {
    _setactionsTestIdx(window.sideIndexBar.changeTest(actionsTestIdx, 1));
  }

  return new arrayOfActionsTest[actionsTestIdx]();
}

export function previousActionsTest() {
  _setactionsTestIdx(actionsTestIdx - 1);
  if (actionsTestIdx < 0)
    _setactionsTestIdx(actionsTestIdx + arrayOfActionsTest.length);

  if (window.sideIndexBar) {
    _setactionsTestIdx(window.sideIndexBar.changeTest(actionsTestIdx, 1));
  }

  return new arrayOfActionsTest[actionsTestIdx]();
}

export function restartActionsTest() {
  return new arrayOfActionsTest[actionsTestIdx]();
}
