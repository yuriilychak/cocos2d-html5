import { ACTION_TAG_INVALID } from './constants.js';
import {
  bezierAt, bounceTime,
  cardinalSplineAt, reverseControlPoints, cloneControlPoints,
  getControlPointAt, reverseControlPointsInline
} from './utils.js';
import {
  _easeExponentialInObj,
  _easeExponentialOutObj,
  _easeExponentialInOutObj,
  _easeSineInObj,
  _easeSineOutObj,
  _easeSineInOutObj,
  _easeElasticInObj,
  _easeElasticOutObj,
  _easeBounceInObj,
  _easeBounceOutObj,
  _easeBounceInOutObj,
  _easeBackInObj,
  _easeBackOutObj,
  _easeBackInOutObj,
  _easeQuadraticActionIn,
  _easeQuadraticActionOut,
  _easeQuadraticActionInOut,
  _easeQuarticActionIn,
  _easeQuarticActionOut,
  _easeQuarticActionInOut,
  _easeQuinticActionIn,
  _easeQuinticActionOut,
  _easeQuinticActionInOut,
  _easeCircleActionIn,
  _easeCircleActionOut,
  _easeCircleActionInOut,
  _easeCubicActionIn,
  _easeCubicActionOut,
  _easeCubicActionInOut,
  easeIn,
  easeOut,
  easeInOut,
  easeExponentialIn,
  easeExponentialOut,
  easeExponentialInOut,
  easeSineIn,
  easeSineOut,
  easeSineInOut,
  easeElasticIn,
  easeElasticOut,
  easeElasticInOut,
  easeBounceIn,
  easeBounceOut,
  easeBounceInOut,
  easeBackIn,
  easeBackOut,
  easeBackInOut,
  easeBezierAction,
  easeQuadraticActionIn,
  easeQuadraticActionOut,
  easeQuadraticActionInOut,
  easeQuarticActionIn,
  easeQuarticActionOut,
  easeQuarticActionInOut,
  easeQuinticActionIn,
  easeQuinticActionOut,
  easeQuinticActionInOut,
  easeCircleActionIn,
  easeCircleActionOut,
  easeCircleActionInOut,
  easeCubicActionIn,
  easeCubicActionOut,
  easeCubicActionInOut
} from './easing.js';
import { Action } from './Action.js';
import { FiniteTimeAction } from './FiniteTimeAction.js';
import { Speed } from './Speed.js';
import { Follow } from './Follow.js';
import { ActionInterval } from './ActionInterval.js';
import { Sequence } from './Sequence.js';
import { Repeat } from './Repeat.js';
import { RepeatForever } from './RepeatForever.js';
import { Spawn } from './Spawn.js';
import { RotateTo } from './RotateTo.js';
import { RotateBy } from './RotateBy.js';
import { MoveBy } from './MoveBy.js';
import { MoveTo } from './MoveTo.js';
import { SkewTo } from './SkewTo.js';
import { SkewBy } from './SkewBy.js';
import { JumpBy } from './JumpBy.js';
import { JumpTo } from './JumpTo.js';
import { BezierBy } from './BezierBy.js';
import { BezierTo } from './BezierTo.js';
import { ScaleTo } from './ScaleTo.js';
import { ScaleBy } from './ScaleBy.js';
import { Blink } from './Blink.js';
import { FadeTo } from './FadeTo.js';
import { FadeIn } from './FadeIn.js';
import { FadeOut } from './FadeOut.js';
import { TintTo } from './TintTo.js';
import { TintBy } from './TintBy.js';
import { DelayTime } from './DelayTime.js';
import { ReverseTime } from './ReverseTime.js';
import { Animate } from './Animate.js';
import { TargetedAction } from './TargetedAction.js';
import { ActionInstant } from './ActionInstant.js';
import { Show } from './Show.js';
import { Hide } from './Hide.js';
import { ToggleVisibility } from './ToggleVisibility.js';
import { RemoveSelf } from './RemoveSelf.js';
import { FlipX } from './FlipX.js';
import { FlipY } from './FlipY.js';
import { Place } from './Place.js';
import { CallFunc } from './CallFunc.js';
import { ActionEase } from './ActionEase.js';
import { EaseRateAction } from './EaseRateAction.js';
import { EaseIn } from './EaseIn.js';
import { EaseOut } from './EaseOut.js';
import { EaseInOut } from './EaseInOut.js';
import { EaseExponentialIn } from './EaseExponentialIn.js';
import { EaseExponentialOut } from './EaseExponentialOut.js';
import { EaseExponentialInOut } from './EaseExponentialInOut.js';
import { EaseSineIn } from './EaseSineIn.js';
import { EaseSineOut } from './EaseSineOut.js';
import { EaseSineInOut } from './EaseSineInOut.js';
import { EaseElastic } from './EaseElastic.js';
import { EaseElasticIn } from './EaseElasticIn.js';
import { EaseElasticOut } from './EaseElasticOut.js';
import { EaseElasticInOut } from './EaseElasticInOut.js';
import { EaseBounce } from './EaseBounce.js';
import { EaseBounceIn } from './EaseBounceIn.js';
import { EaseBounceOut } from './EaseBounceOut.js';
import { EaseBounceInOut } from './EaseBounceInOut.js';
import { EaseBackIn } from './EaseBackIn.js';
import { EaseBackOut } from './EaseBackOut.js';
import { EaseBackInOut } from './EaseBackInOut.js';
import { EaseBezierAction } from './EaseBezierAction.js';
import { EaseQuadraticActionIn } from './EaseQuadraticActionIn.js';
import { EaseQuadraticActionOut } from './EaseQuadraticActionOut.js';
import { EaseQuadraticActionInOut } from './EaseQuadraticActionInOut.js';
import { EaseQuarticActionIn } from './EaseQuarticActionIn.js';
import { EaseQuarticActionOut } from './EaseQuarticActionOut.js';
import { EaseQuarticActionInOut } from './EaseQuarticActionInOut.js';
import { EaseQuinticActionIn } from './EaseQuinticActionIn.js';
import { EaseQuinticActionOut } from './EaseQuinticActionOut.js';
import { EaseQuinticActionInOut } from './EaseQuinticActionInOut.js';
import { EaseCircleActionIn } from './EaseCircleActionIn.js';
import { EaseCircleActionOut } from './EaseCircleActionOut.js';
import { EaseCircleActionInOut } from './EaseCircleActionInOut.js';
import { EaseCubicActionIn } from './EaseCubicActionIn.js';
import { EaseCubicActionOut } from './EaseCubicActionOut.js';
import { EaseCubicActionInOut } from './EaseCubicActionInOut.js';
import { CardinalSplineTo } from './CardinalSplineTo.js';
import { CardinalSplineBy } from './CardinalSplineBy.js';
import { CatmullRomTo } from './CatmullRomTo.js';
import { CatmullRomBy } from './CatmullRomBy.js';
import { ActionTweenDelegate } from './ActionTweenDelegate.js';
import { ActionTween } from './ActionTween.js';

// ─── Constants ─────────────────────────────────────────
cc.ACTION_TAG_INVALID = ACTION_TAG_INVALID;

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

// ─── Factory Functions ───────────────────────────────
cc.action = () => new Action();
cc.speed = (action, speed) => new Speed(action, speed);
cc.follow = (followedNode, rect) => new Follow(followedNode, rect);
cc.actionInterval = (d) => new ActionInterval(d);
cc.repeat = (action, times) => new Repeat(action, times);
cc.repeatForever = (action) => new RepeatForever(action);
cc.rotateTo = (duration, deltaAngleX, deltaAngleY) => new RotateTo(duration, deltaAngleX, deltaAngleY);
cc.rotateBy = (duration, deltaAngleX, deltaAngleY) => new RotateBy(duration, deltaAngleX, deltaAngleY);
cc.moveBy = (duration, deltaPos, deltaY) => new MoveBy(duration, deltaPos, deltaY);
cc.moveTo = (duration, position, y) => new MoveTo(duration, position, y);
cc.skewTo = (t, sx, sy) => new SkewTo(t, sx, sy);
cc.skewBy = (t, sx, sy) => new SkewBy(t, sx, sy);
cc.jumpBy = (duration, position, y, height, jumps) => new JumpBy(duration, position, y, height, jumps);
cc.jumpTo = (duration, position, y, height, jumps) => new JumpTo(duration, position, y, height, jumps);
cc.bezierBy = (t, c) => new BezierBy(t, c);
cc.bezierTo = (t, c) => new BezierTo(t, c);
cc.scaleTo = (duration, sx, sy) => new ScaleTo(duration, sx, sy);
cc.scaleBy = (duration, sx, sy) => new ScaleBy(duration, sx, sy);
cc.blink = (duration, blinks) => new Blink(duration, blinks);
cc.fadeTo = (duration, opacity) => new FadeTo(duration, opacity);
cc.fadeIn = (duration) => new FadeIn(duration);
cc.fadeOut = (d) => new FadeOut(d);
cc.tintTo = (duration, red, green, blue) => new TintTo(duration, red, green, blue);
cc.tintBy = (duration, deltaRed, deltaGreen, deltaBlue) => new TintBy(duration, deltaRed, deltaGreen, deltaBlue);
cc.delayTime = (d) => new DelayTime(d);
cc.reverseTime = (action) => new ReverseTime(action);
cc.animate = (animation) => new Animate(animation);
cc.targetedAction = (target, action) => new TargetedAction(target, action);
cc.show = () => new Show();
cc.hide = () => new Hide();
cc.toggleVisibility = () => new ToggleVisibility();
cc.removeSelf = (isNeedCleanUp) => new RemoveSelf(isNeedCleanUp);
cc.flipX = (flip) => new FlipX(flip);
cc.flipY = (flip) => new FlipY(flip);
cc.place = (pos, y) => new Place(pos, y);
cc.callFunc = (selector, selectorTarget, data) => new CallFunc(selector, selectorTarget, data);
cc.cardinalSplineTo = (duration, points, tension) => new CardinalSplineTo(duration, points, tension);
cc.cardinalSplineBy = (duration, points, tension) => new CardinalSplineBy(duration, points, tension);
cc.catmullRomTo = (dt, points) => new CatmullRomTo(dt, points);
cc.catmullRomBy = (dt, points) => new CatmullRomBy(dt, points);
cc.actionTween = (duration, key, from, to) => new ActionTween(duration, key, from, to);

cc.sequence = function (tempArray) {
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
};

Sequence._actionOneTwo = function (actionOne, actionTwo) {
  var sequence = new Sequence();
  sequence.initWithTwoActions(actionOne, actionTwo);
  return sequence;
};

cc.spawn = function (tempArray) {
  var paramArray = tempArray instanceof Array ? tempArray : arguments;
  if (paramArray.length > 0 && paramArray[paramArray.length - 1] == null)
    cc.log("parameters should not be ending with null in Javascript");

  var prev = paramArray[0];
  for (var i = 1; i < paramArray.length; i++) {
    if (paramArray[i] != null)
      prev = Spawn._actionOneTwo(prev, paramArray[i]);
  }
  return prev;
};

Spawn._actionOneTwo = function (action1, action2) {
  var pSpawn = new Spawn();
  pSpawn.initWithTwoActions(action1, action2);
  return pSpawn;
};

// ─── Re-exports ─────────────────────────────────────
export { ACTION_TAG_INVALID };
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
