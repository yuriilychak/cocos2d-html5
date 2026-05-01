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

import { director } from "../constants";
import { Color } from "@aspect/core";

export function JumpZoomTransition(t, s) {
  return new cc.TransitionJumpZoom(t, s);
}

export function FadeTransition(t, s) {
  return new cc.TransitionFade(t, s);
}

export function FadeWhiteTransition(t, s) {
  return new cc.TransitionFade(t, s, new Color(255, 255, 255));
}

export function FlipXLeftOver(t, s) {
  return new cc.TransitionFlipX(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
}

export function FlipXRightOver(t, s) {
  return new cc.TransitionFlipX(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
}

export function FlipYUpOver(t, s) {
  return new cc.TransitionFlipY(t, s, cc.TRANSITION_ORIENTATION_UP_OVER);
}

export function FlipYDownOver(t, s) {
  return new cc.TransitionFlipY(t, s, cc.TRANSITION_ORIENTATION_DOWN_OVER);
}

export function FlipAngularLeftOver(t, s) {
  return new cc.TransitionFlipAngular(
    t,
    s,
    cc.TRANSITION_ORIENTATION_LEFT_OVER
  );
}

export function FlipAngularRightOver(t, s) {
  return new cc.TransitionFlipAngular(
    t,
    s,
    cc.TRANSITION_ORIENTATION_RIGHT_OVER
  );
}

export function ZoomFlipXLeftOver(t, s) {
  return new cc.TransitionZoomFlipX(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
}

export function ZoomFlipXRightOver(t, s) {
  return new cc.TransitionZoomFlipX(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
}

export function ZoomFlipYUpOver(t, s) {
  return new cc.TransitionZoomFlipY(t, s, cc.TRANSITION_ORIENTATION_UP_OVER);
}

export function ZoomFlipYDownOver(t, s) {
  return new cc.TransitionZoomFlipY(t, s, cc.TRANSITION_ORIENTATION_DOWN_OVER);
}

export function ZoomFlipAngularLeftOver(t, s) {
  return new cc.TransitionZoomFlipAngular(
    t,
    s,
    cc.TRANSITION_ORIENTATION_LEFT_OVER
  );
}

export function ZoomFlipAngularRightOver(t, s) {
  return new cc.TransitionZoomFlipAngular(
    t,
    s,
    cc.TRANSITION_ORIENTATION_RIGHT_OVER
  );
}

export function ShrinkGrowTransition(t, s) {
  return new cc.TransitionShrinkGrow(t, s);
}

export function RotoZoomTransition(t, s) {
  return new cc.TransitionRotoZoom(t, s);
}

export function MoveInLTransition(t, s) {
  return new cc.TransitionMoveInL(t, s);
}

export function MoveInRTransition(t, s) {
  return new cc.TransitionMoveInR(t, s);
}

export function MoveInTTransition(t, s) {
  return new cc.TransitionMoveInT(t, s);
}

export function MoveInBTransition(t, s) {
  return new cc.TransitionMoveInB(t, s);
}

export function SlideInLTransition(t, s) {
  return new cc.TransitionSlideInL(t, s);
}

export function SlideInRTransition(t, s) {
  return new cc.TransitionSlideInR(t, s);
}

export function SlideInTTransition(t, s) {
  return new cc.TransitionSlideInT(t, s);
}

export function SlideInBTransition(t, s) {
  return new cc.TransitionSlideInB(t, s);
}

export function CCTransitionCrossFade(t, s) {
  return new cc.TransitionCrossFade(t, s);
}

export function CCTransitionRadialCCW(t, s) {
  return new cc.TransitionProgressRadialCCW(t, s);
}

export function CCTransitionRadialCW(t, s) {
  return new cc.TransitionProgressRadialCW(t, s);
}

export function PageTransitionForward(t, s) {
  director.setDepthTest(true);
  return new cc.TransitionPageTurn(t, s, false);
}

export function PageTransitionBackward(t, s) {
  director.setDepthTest(true);
  return new cc.TransitionPageTurn(t, s, true);
}

export function FadeTRTransition(t, s) {
  return new cc.TransitionFadeTR(t, s);
}

export function FadeBLTransition(t, s) {
  return new cc.TransitionFadeBL(t, s);
}

export function FadeUpTransition(t, s) {
  return new cc.TransitionFadeUp(t, s);
}

export function FadeDownTransition(t, s) {
  return new cc.TransitionFadeDown(t, s);
}

export function TurnOffTilesTransition(t, s) {
  return new cc.TransitionTurnOffTiles(t, s);
}

export function SplitRowsTransition(t, s) {
  return new cc.TransitionSplitRows(t, s);
}

export function SplitColsTransition(t, s) {
  return new cc.TransitionSplitCols(t, s);
}
