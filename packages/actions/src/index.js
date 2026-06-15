import {
  bezierAt, bounceTime,
  reverseControlPoints, cloneControlPoints,
  reverseControlPointsInline,
  Action, FiniteTimeAction, Speed, Follow
} from './action';
import { cardinalSplineAt, getControlPointAt } from '@aspect/core';
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

// ─── Re-exports ─────────────────────────────────────
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
  _easeExponentialInObj, _easeExponentialOutObj, _easeExponentialInOutObj,
  _easeSineInObj, _easeSineOutObj, _easeSineInOutObj,
  _easeElasticInObj, _easeElasticOutObj,
  _easeBounceInObj, _easeBounceOutObj, _easeBounceInOutObj,
  _easeBackInObj, _easeBackOutObj, _easeBackInOutObj,
  _easeQuadraticActionIn, _easeQuadraticActionOut, _easeQuadraticActionInOut,
  _easeQuarticActionIn, _easeQuarticActionOut, _easeQuarticActionInOut,
  _easeQuinticActionIn, _easeQuinticActionOut, _easeQuinticActionInOut,
  _easeCircleActionIn, _easeCircleActionOut, _easeCircleActionInOut,
  _easeCubicActionIn, _easeCubicActionOut, _easeCubicActionInOut
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
