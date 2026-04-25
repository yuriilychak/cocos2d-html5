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


// ─── Utils ────────────────────────────────────────────
cc.bezierAt = bezierAt;
cc._bounceTime = bounceTime;
cc.cardinalSplineAt = cardinalSplineAt;
cc.reverseControlPoints = reverseControlPoints;
cc.cloneControlPoints = cloneControlPoints;
cc.getControlPointAt = getControlPointAt;
cc.reverseControlPointsInline = reverseControlPointsInline;

// ─── Ease Singletons ─────────────────────────────────
cc._easeExponentialInObj = _easeExponentialInObj;
cc._easeExponentialOutObj = _easeExponentialOutObj;
cc._easeExponentialInOutObj = _easeExponentialInOutObj;
cc._easeSineInObj = _easeSineInObj;
cc._easeSineOutObj = _easeSineOutObj;
cc._easeSineInOutObj = _easeSineInOutObj;
cc._easeElasticInObj = _easeElasticInObj;
cc._easeElasticOutObj = _easeElasticOutObj;
cc._easeBounceInObj = _easeBounceInObj;
cc._easeBounceOutObj = _easeBounceOutObj;
cc._easeBounceInOutObj = _easeBounceInOutObj;
cc._easeBackInObj = _easeBackInObj;
cc._easeBackOutObj = _easeBackOutObj;
cc._easeBackInOutObj = _easeBackInOutObj;
cc._easeQuadraticActionIn = _easeQuadraticActionIn;
cc._easeQuadraticActionOut = _easeQuadraticActionOut;
cc._easeQuadraticActionInOut = _easeQuadraticActionInOut;
cc._easeQuarticActionIn = _easeQuarticActionIn;
cc._easeQuarticActionOut = _easeQuarticActionOut;
cc._easeQuarticActionInOut = _easeQuarticActionInOut;
cc._easeQuinticActionIn = _easeQuinticActionIn;
cc._easeQuinticActionOut = _easeQuinticActionOut;
cc._easeQuinticActionInOut = _easeQuinticActionInOut;
cc._easeCircleActionIn = _easeCircleActionIn;
cc._easeCircleActionOut = _easeCircleActionOut;
cc._easeCircleActionInOut = _easeCircleActionInOut;
cc._easeCubicActionIn = _easeCubicActionIn;
cc._easeCubicActionOut = _easeCubicActionOut;
cc._easeCubicActionInOut = _easeCubicActionInOut;

// ─── Ease Factories ──────────────────────────────────
cc.easeIn = easeIn;
cc.easeOut = easeOut;
cc.easeInOut = easeInOut;
cc.easeExponentialIn = easeExponentialIn;
cc.easeExponentialOut = easeExponentialOut;
cc.easeExponentialInOut = easeExponentialInOut;
cc.easeSineIn = easeSineIn;
cc.easeSineOut = easeSineOut;
cc.easeSineInOut = easeSineInOut;
cc.easeElasticIn = easeElasticIn;
cc.easeElasticOut = easeElasticOut;
cc.easeElasticInOut = easeElasticInOut;
cc.easeBounceIn = easeBounceIn;
cc.easeBounceOut = easeBounceOut;
cc.easeBounceInOut = easeBounceInOut;
cc.easeBackIn = easeBackIn;
cc.easeBackOut = easeBackOut;
cc.easeBackInOut = easeBackInOut;
cc.easeBezierAction = easeBezierAction;
cc.easeQuadraticActionIn = easeQuadraticActionIn;
cc.easeQuadraticActionOut = easeQuadraticActionOut;
cc.easeQuadraticActionInOut = easeQuadraticActionInOut;
cc.easeQuarticActionIn = easeQuarticActionIn;
cc.easeQuarticActionOut = easeQuarticActionOut;
cc.easeQuarticActionInOut = easeQuarticActionInOut;
cc.easeQuinticActionIn = easeQuinticActionIn;
cc.easeQuinticActionOut = easeQuinticActionOut;
cc.easeQuinticActionInOut = easeQuinticActionInOut;
cc.easeCircleActionIn = easeCircleActionIn;
cc.easeCircleActionOut = easeCircleActionOut;
cc.easeCircleActionInOut = easeCircleActionInOut;
cc.easeCubicActionIn = easeCubicActionIn;
cc.easeCubicActionOut = easeCubicActionOut;
cc.easeCubicActionInOut = easeCubicActionInOut;

// ─── Classes ─────────────────────────────────────────
cc.Action = Action;
cc.FiniteTimeAction = FiniteTimeAction;
cc.Speed = Speed;
cc.Follow = Follow;
cc.ActionInterval = ActionInterval;
cc.Sequence = Sequence;
cc.Repeat = Repeat;
cc.RepeatForever = RepeatForever;
cc.Spawn = Spawn;
cc.RotateTo = RotateTo;
cc.RotateBy = RotateBy;
cc.MoveBy = MoveBy;
cc.MoveTo = MoveTo;
cc.SkewTo = SkewTo;
cc.SkewBy = SkewBy;
cc.JumpBy = JumpBy;
cc.JumpTo = JumpTo;
cc.BezierBy = BezierBy;
cc.BezierTo = BezierTo;
cc.ScaleTo = ScaleTo;
cc.ScaleBy = ScaleBy;
cc.Blink = Blink;
cc.FadeTo = FadeTo;
cc.FadeIn = FadeIn;
cc.FadeOut = FadeOut;
cc.TintTo = TintTo;
cc.TintBy = TintBy;
cc.DelayTime = DelayTime;
cc.ReverseTime = ReverseTime;
cc.Animate = Animate;
cc.TargetedAction = TargetedAction;
cc.ActionInstant = ActionInstant;
cc.Show = Show;
cc.Hide = Hide;
cc.ToggleVisibility = ToggleVisibility;
cc.RemoveSelf = RemoveSelf;
cc.FlipX = FlipX;
cc.FlipY = FlipY;
cc.Place = Place;
cc.CallFunc = CallFunc;
cc.ActionEase = ActionEase;
cc.EaseRateAction = EaseRateAction;
cc.EaseIn = EaseIn;
cc.EaseOut = EaseOut;
cc.EaseInOut = EaseInOut;
cc.EaseExponentialIn = EaseExponentialIn;
cc.EaseExponentialOut = EaseExponentialOut;
cc.EaseExponentialInOut = EaseExponentialInOut;
cc.EaseSineIn = EaseSineIn;
cc.EaseSineOut = EaseSineOut;
cc.EaseSineInOut = EaseSineInOut;
cc.EaseElastic = EaseElastic;
cc.EaseElasticIn = EaseElasticIn;
cc.EaseElasticOut = EaseElasticOut;
cc.EaseElasticInOut = EaseElasticInOut;
cc.EaseBounce = EaseBounce;
cc.EaseBounceIn = EaseBounceIn;
cc.EaseBounceOut = EaseBounceOut;
cc.EaseBounceInOut = EaseBounceInOut;
cc.EaseBackIn = EaseBackIn;
cc.EaseBackOut = EaseBackOut;
cc.EaseBackInOut = EaseBackInOut;
cc.EaseBezierAction = EaseBezierAction;
cc.EaseQuadraticActionIn = EaseQuadraticActionIn;
cc.EaseQuadraticActionOut = EaseQuadraticActionOut;
cc.EaseQuadraticActionInOut = EaseQuadraticActionInOut;
cc.EaseQuarticActionIn = EaseQuarticActionIn;
cc.EaseQuarticActionOut = EaseQuarticActionOut;
cc.EaseQuarticActionInOut = EaseQuarticActionInOut;
cc.EaseQuinticActionIn = EaseQuinticActionIn;
cc.EaseQuinticActionOut = EaseQuinticActionOut;
cc.EaseQuinticActionInOut = EaseQuinticActionInOut;
cc.EaseCircleActionIn = EaseCircleActionIn;
cc.EaseCircleActionOut = EaseCircleActionOut;
cc.EaseCircleActionInOut = EaseCircleActionInOut;
cc.EaseCubicActionIn = EaseCubicActionIn;
cc.EaseCubicActionOut = EaseCubicActionOut;
cc.EaseCubicActionInOut = EaseCubicActionInOut;
cc.CardinalSplineTo = CardinalSplineTo;
cc.CardinalSplineBy = CardinalSplineBy;
cc.CatmullRomTo = CatmullRomTo;
cc.CatmullRomBy = CatmullRomBy;
cc.ActionTweenDelegate = ActionTweenDelegate;
cc.ActionTween = ActionTween;

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

cc.sequence = sequence;

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

cc.spawn = spawn;

// ─── Re-exports ─────────────────────────────────────
export { sequence, spawn };
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
