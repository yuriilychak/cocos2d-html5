import Grid3DAction from "../action-grid/grid3d-action";

/**
 * cc.Lens3D action.
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {cc.Point} position
 * @param {Number} radius
 */
export default class Lens3D extends Grid3DAction {
  // lens center position
  _position = null;
  _radius = 0;
  // lens effect. Defaults to 0.7 - 0 means no effect, 1 is very strong effect
  _lensEffect = 0;
  // lens is concave. (true = concave, false = convex) default is convex i.e. false
  _concave = false;
  _dirty = false;

  /**
   * creates a lens 3d action with center position, radius.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {cc.Point} position
   * @param {Number} radius
   */
  constructor(duration, gridSize, position, radius) {
    super();
    this._position = new cc.Point(0, 0);
    radius !== undefined &&
      this.initWithDuration(duration, gridSize, position, radius);
  }

  getLensEffect() {
    return this._lensEffect;
  }
  setLensEffect(lensEffect) {
    this._lensEffect = lensEffect;
  }
  setConcave(concave) {
    this._concave = concave;
  }
  getPosition() {
    return this._position;
  }

  setPosition(position) {
    if (!cc.pointEqualToPoint(position, this._position)) {
      this._position.x = position.x;
      this._position.y = position.y;
      this._dirty = true;
    }
  }

  /**
   * initializes the action with center position, radius, a grid size and duration
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {cc.Point} position
   * @param {Number} radius
   * @return {Boolean}
   */
  initWithDuration(duration, gridSize, position, radius) {
    if (super.initWithDuration(duration, gridSize)) {
      this.setPosition(position);
      this._radius = radius;
      this._lensEffect = 0.7;
      this._dirty = true;
      return true;
    }
    return false;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    if (this._dirty) {
      const locGridSizeWidth = this._gridSize.width;
      const locGridSizeHeight = this._gridSize.height;
      const locRadius = this._radius;
      const locLensEffect = this._lensEffect;
      const locPos = new cc.Point(0, 0);
      const vect = new cc.Point(0, 0);
      let v, r, l, new_r, pre_log;
      for (let i = 0; i < locGridSizeWidth + 1; ++i) {
        for (let j = 0; j < locGridSizeHeight + 1; ++j) {
          locPos.x = i;
          locPos.y = j;
          v = this.getOriginalVertex(locPos);
          vect.x = this._position.x - v.x;
          vect.y = this._position.y - v.y;
          r = cc.Point.length(vect);

          if (r < locRadius) {
            r = locRadius - r;
            pre_log = r / locRadius;
            if (pre_log === 0) pre_log = 0.001;

            l = Math.log(pre_log) * locLensEffect;
            new_r = Math.exp(l) * locRadius;

            r = cc.Point.length(vect);
            if (r > 0) {
              vect.x = vect.x / r;
              vect.y = vect.y / r;

              vect.x = vect.x * new_r;
              vect.y = vect.y * new_r;
              v.z += cc.Point.length(vect) * locLensEffect;
            }
          }
          this.setVertex(locPos, v);
        }
      }
      this._dirty = false;
    }
  }
}
