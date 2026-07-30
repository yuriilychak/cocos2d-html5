import { Node, Point, ServiceLocator } from "@aspect/core";
import { TYPE_RADIAL } from "./constants";
import ProgressTimerColor from "./progress-timer-color";

/**
 * ProgressTimer is a subclass of Node.
 * It renders the inner sprite according to the percentage.
 * The progress can be Radial, Horizontal or vertical.
 *
 * @property {Point}     midPoint        <p>- Midpoint is used to modify the progress start position.<br/>
 *                                          If you're using radials type then the midpoint changes the center point<br/>
 *                                          If you're using bar type the the midpoint changes the bar growth<br/>
 *                                              it expands from the center but clamps to the sprites edge so:<br/>
 *                                              you want a left to right then set the midpoint all the way to new Point(0,y)<br/>
 *                                              you want a right to left then set the midpoint all the way to new Point(1,y)<br/>
 *                                              you want a bottom to top then set the midpoint all the way to new Point(x,0)<br/>
 *                                              you want a top to bottom then set the midpoint all the way to new Point(x,1)</p>
 * @property {Point}     barChangeRate   - This allows the bar type to move the component at a specific rate.
 * @property {enum}      type            - Type of the progress timer: TYPE_RADIAL|TYPE_BAR.
 * @property {Number}    percentage      - Percentage to change progress, from 0 to 100.
 * @property {Sprite}    sprite          - The sprite to show the progress percentage.
 * @property {Boolean}   reverseDir      - Indicate whether the direction is reversed.
 */
export class ProgressTimer extends Node {
  _type = null;
  _percentage = 0.0;
  _sprite = null;

  _midPoint = null;
  _barChangeRate = null;
  _reverseDirection = false;

  /**
   * Constructor of ProgressTimer
   * @param {Sprite} sprite
   */
  constructor(sprite) {
    super();

    this._type = TYPE_RADIAL;
    this._percentage = 0.0;
    this._midPoint = new Point();
    this._barChangeRate = new Point();
    this._reverseDirection = false;
    this._sprite = null;

    sprite && this.initWithSprite(sprite);
  }

  get midPoint() {
    return this.getMidpoint();
  }
  set midPoint(v) {
    this.setMidpoint(v);
  }
  get barChangeRate() {
    return this.getBarChangeRate();
  }
  set barChangeRate(v) {
    this.setBarChangeRate(v);
  }
  get type() {
    return this.getType();
  }
  set type(v) {
    this.setType(v);
  }
  get percentage() {
    return this.getPercentage();
  }
  set percentage(v) {
    this.setPercentage(v);
  }
  get sprite() {
    return this.getSprite();
  }
  set sprite(v) {
    this.setSprite(v);
  }
  get reverseDir() {
    return this.isReverseDirection();
  }
  set reverseDir(v) {
    this.setReverseDirection(v);
  }

  onEnter() {
    super.onEnter();
    if (ServiceLocator.sys.rendererConfig.isWebGL) {
      this.renderCmd.initCmd();
      this.renderCmd._updateProgress();
    }
  }

  cleanup() {
    if (ServiceLocator.sys.rendererConfig.isWebGL) {
      this.renderCmd.releaseData();
    }
    super.cleanup();
  }

  /**
   *    Midpoint is used to modify the progress start position.
   *    If you're using radials type then the midpoint changes the center point
   *    If you're using bar type the the midpoint changes the bar growth
   *        it expands from the center but clamps to the sprites edge so:
   *        you want a left to right then set the midpoint all the way to new Point(0,y)
   *        you want a right to left then set the midpoint all the way to new Point(1,y)
   *        you want a bottom to top then set the midpoint all the way to new Point(x,0)
   *        you want a top to bottom then set the midpoint all the way to new Point(x,1)
   *  @return {Point}
   */
  getMidpoint() {
    return new Point(this._midPoint.x, this._midPoint.y);
  }

  /**
   * Midpoint setter
   * @param {Point} mpoint
   */
  setMidpoint(mpoint) {
    this._midPoint = Point.clamp(mpoint, new Point(0, 0), new Point(1, 1));
  }

  /**
   *    This allows the bar type to move the component at a specific rate
   *    Set the component to 0 to make sure it stays at 100%.
   *    For example you want a left to right bar but not have the height stay 100%
   *    Set the rate to be new Point(0,1); and set the midpoint to = new Point(0,.5f);
   *  @return {Point}
   */
  getBarChangeRate() {
    return new Point(this._barChangeRate.x, this._barChangeRate.y);
  }

  /**
   * @param {Point} barChangeRate
   */
  setBarChangeRate(barChangeRate) {
    this._barChangeRate = Point.clamp(
      barChangeRate,
      new Point(0, 0),
      new Point(1, 1)
    );
  }

  /**
   *  Change the percentage to change progress
   * @return {TYPE_RADIAL|TYPE_BAR}
   */
  getType() {
    return this._type;
  }

  /**
   * Percentages are from 0 to 100
   * @return {Number}
   */
  getPercentage() {
    return this._percentage;
  }

  /**
   * The image to show the progress percentage, retain
   * @return {Sprite}
   */
  getSprite() {
    return this._sprite;
  }

  /**
   * from 0-100
   * @param {Number} percentage
   */
  setPercentage(percentage) {
    if (this._percentage !== percentage) {
      this._percentage = Point.clampf(percentage, 0, 100);
      this.renderCmd._updateProgress();
    }
  }

  /**
   * return if reverse direction
   * @returns {boolean}
   */
  isReverseDirection() {
    return this._reverseDirection;
  }

  /**
   * set reverse ProgressTimer
   * @param {Boolean} reverse
   */
  setReverseProgress(reverse) {
    if (this._reverseDirection !== reverse) {
      this._reverseDirection = reverse;
      this.renderCmd.resetVertexData();
    }
  }

  /**
   * set sprite for ProgressTimer
   * @param {Sprite} sprite
   */
  setSprite(sprite) {
    if (this._sprite !== sprite) {
      this._sprite = sprite;
      if (sprite) {
        this.width = sprite.width;
        this.height = sprite.height;
        sprite.ignoreAnchorPointForPosition = true;
      } else {
        this.width = 0;
        this.height = 0;
      }
      this.renderCmd.resetVertexData();
    }
  }

  /**
   * set Progress type of ProgressTimer
   * @param {TYPE_RADIAL|TYPE_BAR} type
   */
  setType(type) {
    if (type !== this._type) {
      this._type = type;
      this.renderCmd.resetVertexData();
    }
  }

  /**
   * Reverse Progress setter
   * @param {Boolean} reverse
   */
  setReverseDirection(reverse) {
    if (this._reverseDirection !== reverse) {
      this._reverseDirection = reverse;
      this.renderCmd.resetVertexData();
    }
  }

  /**
   * Initializes a progress timer with the sprite as the shape the timer goes through
   * @param {Sprite} sprite
   * @return {Boolean}
   */
  initWithSprite(sprite) {
    this.percentage = 0;
    this.anchorX = 0.5;
    this.anchorY = 0.5;

    this._type = TYPE_RADIAL;
    this._reverseDirection = false;
    this.midPoint = new Point(0.5, 0.5);
    this.barChangeRate = new Point(1, 1);
    this.sprite = sprite;
    this.renderCmd.resetVertexData();
    return true;
  }

  createRenderCmd() {
    if (ServiceLocator.sys.rendererConfig.isCanvas)
      return new this.constructor.CanvasRenderCmd(this);
    else return new this.constructor.WebGLRenderCmd(this);
  }

  createColor() {
    return new ProgressTimerColor();
  }
}
