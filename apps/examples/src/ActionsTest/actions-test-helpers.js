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
          new Color(rand() % 255, rand() % 255, rand() % 255)
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
var arrayOfActionsTest = [
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
  actionsTestIdx++;
  actionsTestIdx = actionsTestIdx % arrayOfActionsTest.length;

  if (window.sideIndexBar) {
    actionsTestIdx = window.sideIndexBar.changeTest(actionsTestIdx, 1);
  }

  return new arrayOfActionsTest[actionsTestIdx]();
}

;

export function previousActionsTest() {
  actionsTestIdx--;
  if (actionsTestIdx < 0) actionsTestIdx += arrayOfActionsTest.length;

  if (window.sideIndexBar) {
    actionsTestIdx = window.sideIndexBar.changeTest(actionsTestIdx, 1);
  }

  return new arrayOfActionsTest[actionsTestIdx]();
}

;

export function restartActionsTest() {
  return new arrayOfActionsTest[actionsTestIdx]();
}

;
