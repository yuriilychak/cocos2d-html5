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

import { ActionAnimate } from "./action-animate.js";
import { ActionBezierToCopy } from "./action-bezier-to-copy.js";
import { ActionBezier } from "./action-bezier.js";
import { ActionBlink } from "./action-blink.js";
import { ActionCallFunc1 } from "./action-call-func1.js";
import { ActionCallFunc2 } from "./action-call-func2.js";
import { ActionCallFunc3 } from "./action-call-func3.js";
import { ActionCardinalSpline } from "./action-cardinal-spline.js";
import { ActionCatmullRom } from "./action-catmull-rom.js";
import { ActionCustomTest } from "./action-custom-test.js";
import { ActionDelayTime } from "./action-delay-time.js";
import { ActionFade } from "./action-fade.js";
import { ActionFollow } from "./action-follow.js";
import { ActionIssue13605 } from "./action-issue13605.js";
import { ActionJump } from "./action-jump.js";
import { ActionManual } from "./action-manual.js";
import { ActionMove } from "./action-move.js";
import { ActionRepeatForever } from "./action-repeat-forever.js";
import { ActionRepeat } from "./action-repeat.js";
import { ActionReverseSequence } from "./action-reverse-sequence.js";
import { ActionReverseSequence2 } from "./action-reverse-sequence2.js";
import { ActionReverse } from "./action-reverse.js";
import { ActionRotateJerk } from "./action-rotate-jerk.js";
import { ActionRotateToRepeat } from "./action-rotate-to-repeat.js";
import { ActionRotateXY } from "./action-rotate-xy.js";
import { ActionRotate } from "./action-rotate.js";
import { ActionScale } from "./action-scale.js";
import { ActionSequence } from "./action-sequence.js";
import { ActionSequence2 } from "./action-sequence2.js";
import { ActionSkewRotateScale } from "./action-skew-rotate-scale.js";
import { ActionSkew } from "./action-skew.js";
import { ActionSpawn } from "./action-spawn.js";
import { ActionStackableBezier } from "./action-stackable-bezier.js";
import { ActionStackableCardinalSpline } from "./action-stackable-cardinal-spline.js";
import { ActionStackableCatmullRom } from "./action-stackable-catmull-rom.js";
import { ActionStackableJump } from "./action-stackable-jump.js";
import { ActionStackableMove } from "./action-stackable-move.js";
import { ActionTargetedCopy } from "./action-targeted-copy.js";
import { ActionTargeted } from "./action-targeted.js";
import { ActionTint } from "./action-tint.js";
import { actionsTestIdx , _setactionsTestIdx} from "./actions-test-constants.js";
import { Issue1008 } from "./issue1008.js";
import { Issue1288_2 } from "./issue1288-2.js";
import { Issue1288 } from "./issue1288.js";
import { Issue1305_2 } from "./issue1305-2.js";
import { Issue1305 } from "./issue1305.js";
import { Issue1327 } from "./issue1327.js";
import { Issue1438 } from "./issue1438.js";
import { Issue1446 } from "./issue1446.js";
import { PauseResumeActions } from "./pause-resume-actions.js";
import { SequenceRepeatTest } from "./sequence-repeat-test.js";

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

// special code, just for reduce code redundancy
export function createCustomAction(ActionObject) {
  class CustomAction extends ActionObject {
    update(dt) {
      super.update(dt);
      if (this.getTarget()) {
        // rand color
        this.getTarget().setColor(
          new cc.Color(cc.rand() % 255, cc.rand() % 255, cc.rand() % 255)
        );
      }
    }
  }

  return CustomAction;
}

;

;

;

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

;

export function previousActionsTest() {
  _setactionsTestIdx(actionsTestIdx - 1);
  if (actionsTestIdx < 0) _setactionsTestIdx(actionsTestIdx + (arrayOfActionsTest.length));

  if (window.sideIndexBar) {
    _setactionsTestIdx(window.sideIndexBar.changeTest(actionsTestIdx, 1));
  }

  return new arrayOfActionsTest[actionsTestIdx]();
}

;

export function restartActionsTest() {
  return new arrayOfActionsTest[actionsTestIdx]();
}

;
