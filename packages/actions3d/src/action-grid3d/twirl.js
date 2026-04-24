import Grid3DAction from "../action-grid/grid3d-action";

/**
 * cc.Twirl action.
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {cc.Point} position
 * @param {Number} twirls
 * @param {Number} amplitude
 */
export default class Twirl extends Grid3DAction {
  _position = null;
  _twirls = 0;
  _amplitude = 0;
  _amplitudeRate = 0;

  /**
   * Create a grid 3d action with center position, number of twirls, amplitude, a grid size and duration.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {cc.Point} position
   * @param {Number} twirls
   * @param {Number} amplitude
   */
  constructor(duration, gridSize, position, twirls, amplitude) {
    super();
    this._position = new cc.Point(0, 0);
    amplitude !== undefined &&
      this.initWithDuration(duration, gridSize, position, twirls, amplitude);
  }

  getPosition() {
    return this._position;
  }
  setPosition(position) {
    this._position.x = position.x;
    this._position.y = position.y;
  }
  getAmplitude() {
    return this._amplitude;
  }
  setAmplitude(amplitude) {
    this._amplitude = amplitude;
  }
  getAmplitudeRate() {
    return this._amplitudeRate;
  }
  setAmplitudeRate(amplitudeRate) {
    this._amplitudeRate = amplitudeRate;
  }

  /** initializes the action with center position, number of twirls, amplitude, a grid size and duration */
  initWithDuration(duration, gridSize, position, twirls, amplitude) {
    if (super.initWithDuration(duration, gridSize)) {
      this.setPosition(position);
      this._twirls = twirls;
      this._amplitude = amplitude;
      this._amplitudeRate = 1.0;
      return true;
    }
    return false;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    const c = this._position;
    const locSizeWidth = this._gridSize.width;
    const locSizeHeight = this._gridSize.height;
    const locPos = new cc.Point(0, 0);
    const amp = 0.1 * this._amplitude * this._amplitudeRate;
    const locTwirls = this._twirls;
    let v, a, dX, dY;
    const avg = new cc.Point(0, 0);
    for (let i = 0; i < locSizeWidth + 1; ++i) {
      for (let j = 0; j < locSizeHeight + 1; ++j) {
        locPos.x = i;
        locPos.y = j;
        v = this.getOriginalVertex(locPos);

        avg.x = i - locSizeWidth / 2.0;
        avg.y = j - locSizeHeight / 2.0;

        a =
          cc.Point.length(avg) *
          Math.cos(Math.PI / 2.0 + dt * Math.PI * locTwirls * 2) *
          amp;

        dX = Math.sin(a) * (v.y - c.y) + Math.cos(a) * (v.x - c.x);
        dY = Math.cos(a) * (v.y - c.y) - Math.sin(a) * (v.x - c.x);

        v.x = c.x + dX;
        v.y = c.y + dY;

        this.setVertex(locPos, v);
      }
    }
  }
}
