import { CardinalSplineTo } from './cardinal-spline-to.js';
import { reverseControlPoints, cloneControlPoints } from '../action/utils.js';

/**
 * Cardinal Spline path. {@link http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Cardinal_spline}
 * Relative coordinates.
 *
 * @class
 * @extends cc.CardinalSplineTo
 * @param {Number} duration
 * @param {Array} points
 * @param {Number} tension
 *
 * @example
 * //create a cc.CardinalSplineBy
 * var action1 = cc.cardinalSplineBy(3, array, 0);
 */
export class CardinalSplineBy extends CardinalSplineTo {
  /** @lends cc.CardinalSplineBy# */
  _startPosition = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * creates an action with a Cardinal Spline array of points and tension.
   * @param {Number} duration
   * @param {Array} points
   * @param {Number} tension
   */
  constructor(duration, points, tension) {
    super();
    this._startPosition = cc.p(0, 0);

    tension !== undefined && this.initWithDuration(duration, points, tension);
  }

  /**
   * called before the action start. It will also set the target.
   *
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._startPosition.x = target.getPositionX();
    this._startPosition.y = target.getPositionY();
  }

  /**
   * reverse a new cc.CardinalSplineBy
   *
   * @return {cc.CardinalSplineBy}
   */
  reverse() {
    const copyConfig = this._points.slice();
    let current;
    //
    // convert "absolutes" to "diffs"
    //
    let p = copyConfig[0];
    for (let i = 1; i < copyConfig.length; ++i) {
      current = copyConfig[i];
      copyConfig[i] = cc.pSub(current, p);
      p = current;
    }

    // convert to "diffs" to "reverse absolute"
    const reverseArray = reverseControlPoints(copyConfig);

    // 1st element (which should be 0,0) should be here too
    p = reverseArray[reverseArray.length - 1];
    reverseArray.pop();

    p.x = -p.x;
    p.y = -p.y;

    reverseArray.unshift(p);
    for (let i = 1; i < reverseArray.length; ++i) {
      current = reverseArray[i];
      current.x = -current.x;
      current.y = -current.y;
      current.x += p.x;
      current.y += p.y;
      reverseArray[i] = current;
      p = current;
    }
    return cc.cardinalSplineBy(this._duration, reverseArray, this._tension);
  }

  /**
   * update position of target
   *
   * @param {cc.Point} newPos
   */
  updatePosition(newPos) {
    const pos = this._startPosition;
    const posX = newPos.x + pos.x;
    const posY = newPos.y + pos.y;
    this._previousPosition.x = posX;
    this._previousPosition.y = posY;
    this.target.setPosition(posX, posY);
  }

  /**
   * returns a new clone of the action
   *
   * @returns {cc.CardinalSplineBy}
   */
  clone() {
    const a = new CardinalSplineBy();
    a.initWithDuration(
      this._duration,
      cloneControlPoints(this._points),
      this._tension
    );
    return a;
  }
};
