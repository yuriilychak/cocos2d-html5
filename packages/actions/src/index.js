import {
  bezierAt, bounceTime,
  cardinalSplineAt, reverseControlPoints, cloneControlPoints,
  getControlPointAt, reverseControlPointsInline,
  Action, FiniteTimeAction, Speed, Follow
} from './action';
import {
  ActionInterval, Sequence, Repeat, RepeatForever, Spawn,
  RotateTo, RotateBy, MoveBy, MoveTo, SkewTo, SkewBy,
  JumpBy, JumpTo, BezierBy, BezierTo, ScaleTo, ScaleBy,
  Blink, FadeTo, FadeIn, FadeOut, TintTo, TintBy,
  DelayTime, ReverseTime, Animate, TargetedAction
} from './action-interval';
import {
  ActionInstant, Show, Hide, ToggleVisibility, RemoveSelf,
  FlipX, FlipY, Place, CallFunc
} from './action-instant';
import {
  ActionEase, EaseRateAction, EaseIn, EaseOut, EaseInOut,
  EaseExponentialIn, EaseExponentialOut, EaseExponentialInOut,
  EaseSineIn, EaseSineOut, EaseSineInOut,
  EaseElastic, EaseElasticIn, EaseElasticOut, EaseElasticInOut,
  EaseBounce, EaseBounceIn, EaseBounceOut, EaseBounceInOut,
  EaseBackIn, EaseBackOut, EaseBackInOut,
  EaseBezierAction,
  EaseQuadraticActionIn, EaseQuadraticActionOut, EaseQuadraticActionInOut,
  EaseQuarticActionIn, EaseQuarticActionOut, EaseQuarticActionInOut,
  EaseQuinticActionIn, EaseQuinticActionOut, EaseQuinticActionInOut,
  EaseCircleActionIn, EaseCircleActionOut, EaseCircleActionInOut,
  EaseCubicActionIn, EaseCubicActionOut, EaseCubicActionInOut,
  _easeExponentialInObj, _easeExponentialOutObj, _easeExponentialInOutObj,
  _easeSineInObj, _easeSineOutObj, _easeSineInOutObj,
  _easeElasticInObj, _easeElasticOutObj,
  _easeBounceInObj, _easeBounceOutObj, _easeBounceInOutObj,
  _easeBackInObj, _easeBackOutObj, _easeBackInOutObj,
  _easeQuadraticActionIn, _easeQuadraticActionOut, _easeQuadraticActionInOut,
  _easeQuarticActionIn, _easeQuarticActionOut, _easeQuarticActionInOut,
  _easeQuinticActionIn, _easeQuinticActionOut, _easeQuinticActionInOut,
  _easeCircleActionIn, _easeCircleActionOut, _easeCircleActionInOut,
  _easeCubicActionIn, _easeCubicActionOut, _easeCubicActionInOut,
  easeIn, easeOut, easeInOut,
  easeExponentialIn, easeExponentialOut, easeExponentialInOut,
  easeSineIn, easeSineOut, easeSineInOut,
  easeElasticIn, easeElasticOut, easeElasticInOut,
  easeBounceIn, easeBounceOut, easeBounceInOut,
  easeBackIn, easeBackOut, easeBackInOut,
  easeBezierAction,
  easeQuadraticActionIn, easeQuadraticActionOut, easeQuadraticActionInOut,
  easeQuarticActionIn, easeQuarticActionOut, easeQuarticActionInOut,
  easeQuinticActionIn, easeQuinticActionOut, easeQuinticActionInOut,
  easeCircleActionIn, easeCircleActionOut, easeCircleActionInOut,
  easeCubicActionIn, easeCubicActionOut, easeCubicActionInOut
} from './action-ease';
import { CardinalSplineTo, CardinalSplineBy, CatmullRomTo, CatmullRomBy } from './action-catmull-rom';
import { ActionTweenDelegate, ActionTween } from './action-tween';

EaseBackIn.ReversedAction = EaseBackOut;
EaseBackOut.ReversedAction = EaseBackIn;
EaseBounceIn.ReversedAction = EaseBounceOut;
EaseBounceOut.ReversedAction = EaseBounceIn;
EaseElasticIn.ReversedAction = EaseElasticOut;
EaseElasticOut.ReversedAction = EaseElasticIn;
EaseExponentialIn.ReversedAction = EaseExponentialOut;
EaseExponentialOut.ReversedAction = EaseExponentialIn;
EaseSineIn.ReversedAction = EaseSineOut;
EaseSineOut.ReversedAction = EaseSineIn;


// These two are used by @aspect/core drawing primitives via cc.* globals
// (core cannot import @aspect/actions directly — circular dependency)
cc.cardinalSplineAt = cardinalSplineAt;
cc.getControlPointAt = getControlPointAt;

// ─── Sequence & Spawn ────────────────────────────────
function sequence(tempArray) {
  var paramArray = tempArray instanceof Array ? tempArray : arguments;
  if (paramArray.length > 0 && paramArray[paramArray.length - 1] == null)
    cc.log("parameters should not be ending with null in Javascript");

  var result, current, i, repeat;
  while (paramArray && paramArray.length > 0) {
    current = Array.prototype.shift.call(paramArray);
    repeat = current._timesForRepeat || 1;
    current._repeatMethod = false;
    current._timesForRepeat = 1;

    i = 0;
    if (!result) {
      result = current;
      i = 1;
    }

    for (i; i < repeat; i++) {
      result = Sequence._actionOneTwo(result, current);
    }
  }

  return result;
}

Sequence._actionOneTwo = function (actionOne, actionTwo) {
  var sequence = new Sequence();
  sequence.initWithTwoActions(actionOne, actionTwo);
  return sequence;
};


function spawn(tempArray) {
  var paramArray = tempArray instanceof Array ? tempArray : arguments;
  if (paramArray.length > 0 && paramArray[paramArray.length - 1] == null)
    cc.log("parameters should not be ending with null in Javascript");

  var prev = paramArray[0];
  for (var i = 1; i < paramArray.length; i++) {
    if (paramArray[i] != null)
      prev = Spawn._actionOneTwo(prev, paramArray[i]);
  }
  return prev;
}

Spawn._actionOneTwo = function (action1, action2) {
  var pSpawn = new Spawn();
  pSpawn.initWithTwoActions(action1, action2);
  return pSpawn;
};

// ─── Re-exports ─────────────────────────────────────
export { sequence, spawn };
export {
  easeIn, easeOut, easeInOut,
  easeExponentialIn, easeExponentialOut, easeExponentialInOut,
  easeSineIn, easeSineOut, easeSineInOut,
  easeElasticIn, easeElasticOut, easeElasticInOut,
  easeBounceIn, easeBounceOut, easeBounceInOut,
  easeBackIn, easeBackOut, easeBackInOut,
  easeBezierAction,
  easeQuadraticActionIn, easeQuadraticActionOut, easeQuadraticActionInOut,
  easeQuarticActionIn, easeQuarticActionOut, easeQuarticActionInOut,
  easeQuinticActionIn, easeQuinticActionOut, easeQuinticActionInOut,
  easeCircleActionIn, easeCircleActionOut, easeCircleActionInOut,
  easeCubicActionIn, easeCubicActionOut, easeCubicActionInOut
};
export {
  bezierAt, bounceTime,
  cardinalSplineAt, reverseControlPoints, cloneControlPoints,
  getControlPointAt, reverseControlPointsInline
};
export {
  Action,
  FiniteTimeAction,
  Speed,
  Follow,
  ActionInterval,
  Sequence,
  Repeat,
  RepeatForever,
  Spawn,
  RotateTo,
  RotateBy,
  MoveBy,
  MoveTo,
  SkewTo,
  SkewBy,
  JumpBy,
  JumpTo,
  BezierBy,
  BezierTo,
  ScaleTo,
  ScaleBy,
  Blink,
  FadeTo,
  FadeIn,
  FadeOut,
  TintTo,
  TintBy,
  DelayTime,
  ReverseTime,
  Animate,
  TargetedAction,
  ActionInstant,
  Show,
  Hide,
  ToggleVisibility,
  RemoveSelf,
  FlipX,
  FlipY,
  Place,
  CallFunc,
  ActionEase,
  EaseRateAction,
  EaseIn,
  EaseOut,
  EaseInOut,
  EaseExponentialIn,
  EaseExponentialOut,
  EaseExponentialInOut,
  EaseSineIn,
  EaseSineOut,
  EaseSineInOut,
  EaseElastic,
  EaseElasticIn,
  EaseElasticOut,
  EaseElasticInOut,
  EaseBounce,
  EaseBounceIn,
  EaseBounceOut,
  EaseBounceInOut,
  EaseBackIn,
  EaseBackOut,
  EaseBackInOut,
  EaseBezierAction,
  EaseQuadraticActionIn,
  EaseQuadraticActionOut,
  EaseQuadraticActionInOut,
  EaseQuarticActionIn,
  EaseQuarticActionOut,
  EaseQuarticActionInOut,
  EaseQuinticActionIn,
  EaseQuinticActionOut,
  EaseQuinticActionInOut,
  EaseCircleActionIn,
  EaseCircleActionOut,
  EaseCircleActionInOut,
  EaseCubicActionIn,
  EaseCubicActionOut,
  EaseCubicActionInOut,
  CardinalSplineTo,
  CardinalSplineBy,
  CatmullRomTo,
  CatmullRomBy,
  ActionTweenDelegate,
  ActionTween
};
