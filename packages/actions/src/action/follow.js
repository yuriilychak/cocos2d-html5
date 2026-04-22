import Action from './action';

/**
 * cc.Follow is an action that "follows" a node.
 *
 * @example
 * //example
 * //Instead of using cc.Camera as a "follower", use this action instead.
 * layer.runAction(cc.follow(hero));
 *
 * @property {Number}  leftBoundary - world leftBoundary.
 * @property {Number}  rightBoundary - world rightBoundary.
 * @property {Number}  topBoundary - world topBoundary.
 * @property {Number}  bottomBoundary - world bottomBoundary.
 *
 * @param {cc.Node} followedNode
 * @param {cc.Rect} rect
 * @example
 * // creates the action with a set boundary
 * var sprite = new cc.Sprite("spriteFileName");
 * var followAction = new cc.Follow(sprite, cc.rect(0, 0, s.width * 2 - 100, s.height));
 * this.runAction(followAction);
 *
 * // creates the action with no boundary set
 * var sprite = new cc.Sprite("spriteFileName");
 * var followAction = new cc.Follow(sprite);
 * this.runAction(followAction);
 *
 */
export default class Follow extends Action {
  // node to follow
  _followedNode = null;
  // whether camera should be limited to certain area
  _boundarySet = false;
  // if screen size is bigger than the boundary - update not needed
  _boundaryFullyCovered = false;
  // fast access to the screen dimensions
  _halfScreenSize = null;
  _fullScreenSize = null;
  _worldRect = null;

  leftBoundary = 0.0;
  rightBoundary = 0.0;
  topBoundary = 0.0;
  bottomBoundary = 0.0;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
   * creates the action with a set boundary. <br/>
   * creates the action with no boundary set.
   * @param {cc.Node} followedNode
   * @param {cc.Rect} rect
   */
  constructor(followedNode, rect) {
    super();
    this._followedNode = null;
    this._boundarySet = false;

    this._boundaryFullyCovered = false;
    this._halfScreenSize = null;
    this._fullScreenSize = null;

    this.leftBoundary = 0.0;
    this.rightBoundary = 0.0;
    this.topBoundary = 0.0;
    this.bottomBoundary = 0.0;
    this._worldRect = new cc.Rect(0, 0, 0, 0);

    if (followedNode)
      rect
        ? this.initWithTarget(followedNode, rect)
        : this.initWithTarget(followedNode);
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {cc.Follow}
   */
  clone() {
    const action = new Follow();
    const locRect = this._worldRect;
    const rect = new cc.Rect(
      locRect.x,
      locRect.y,
      locRect.width,
      locRect.height
    );
    action.initWithTarget(this._followedNode, rect);
    return action;
  }

  /**
   * Get whether camera should be limited to certain area.
   *
   * @return {Boolean}
   */
  isBoundarySet() {
    return this._boundarySet;
  }

  /**
   * alter behavior - turn on/off boundary.
   *
   * @param {Boolean} value
   */
  setBoudarySet(value) {
    this._boundarySet = value;
  }

  /**
   * initializes the action with a set boundary.
   *
   * @param {cc.Node} followedNode
   * @param {cc.Rect} [rect]
   * @return {Boolean}
   */
  initWithTarget(followedNode, rect) {
    if (!followedNode)
      throw new Error(
        "cc.Follow.initWithAction(): followedNode must be non nil"
      );

    rect = rect || cc.rect(0, 0, 0, 0);
    this._followedNode = followedNode;
    this._worldRect = rect;

    this._boundarySet = !cc._rectEqualToZero(rect);

    this._boundaryFullyCovered = false;

    const winSize = cc.director.getWinSize();
    this._fullScreenSize = cc.p(winSize.width, winSize.height);
    this._halfScreenSize = cc.pMult(this._fullScreenSize, 0.5);

    if (this._boundarySet) {
      this.leftBoundary = -(rect.x + rect.width - this._fullScreenSize.x);
      this.rightBoundary = -rect.x;
      this.topBoundary = -rect.y;
      this.bottomBoundary = -(rect.y + rect.height - this._fullScreenSize.y);

      if (this.rightBoundary < this.leftBoundary) {
        // screen width is larger than world's boundary width
        //set both in the middle of the world
        this.rightBoundary = this.leftBoundary =
          (this.leftBoundary + this.rightBoundary) / 2;
      }
      if (this.topBoundary < this.bottomBoundary) {
        // screen width is larger than world's boundary width
        //set both in the middle of the world
        this.topBoundary = this.bottomBoundary =
          (this.topBoundary + this.bottomBoundary) / 2;
      }

      if (
        this.topBoundary === this.bottomBoundary &&
        this.leftBoundary === this.rightBoundary
      )
        this._boundaryFullyCovered = true;
    }
    return true;
  }

  /**
   * called every frame with it's delta time. <br />
   * DON'T override unless you know what you are doing.
   *
   * @param {Number} dt
   */
  step(dt) {
    const tempPosX = this._halfScreenSize.x - this._followedNode.x;
    const tempPosY = this._halfScreenSize.y - this._followedNode.y;

    //TODO Temporary treatment - The dirtyFlag symbol error
    this.target._renderCmd._dirtyFlag = 0;

    if (this._boundarySet) {
      // whole map fits inside a single screen, no need to modify the position - unless map boundaries are increased
      if (this._boundaryFullyCovered) return;

      this.target.setPosition(
        cc.clampf(tempPosX, this.leftBoundary, this.rightBoundary),
        cc.clampf(tempPosY, this.bottomBoundary, this.topBoundary)
      );
    } else {
      this.target.setPosition(tempPosX, tempPosY);
    }
  }

  /**
   * Return true if the action has finished.
   *
   * @return {Boolean}
   */
  isDone() {
    return !this._followedNode.running;
  }

  /**
   * Stop the action.
   */
  stop() {
    this.target = null;
    super.stop();
  }
};
