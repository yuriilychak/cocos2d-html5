import Grid3DAction from "../action-grid/grid3d-action";

/**
 * cc.Ripple3D action.
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {cc.Point} position
 * @param {Number} radius
 * @param {Number} waves
 * @param {Number} amplitude
 */
export default class Ripple3D extends Grid3DAction {
  _position = null;
  _radius = 0;
  _waves = 0;
  _amplitude = 0;
  _amplitudeRate = 0;

  /**
   * creates a ripple 3d action with radius, number of waves, amplitude.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {cc.Point} position
   * @param {Number} radius
   * @param {Number} waves
   * @param {Number} amplitude
   */
  constructor(duration, gridSize, position, radius, waves, amplitude) {
    super();
    this._position = new cc.Point(0, 0);
    amplitude !== undefined &&
      this.initWithDuration(
        duration,
        gridSize,
        position,
        radius,
        waves,
        amplitude
      );
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

  /**
   * initializes the action with radius, number of waves, amplitude, a grid size and duration
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {cc.Point} position
   * @param {Number} radius
   * @param {Number} waves
   * @param {Number} amplitude
   * @return {Boolean}
   */
  initWithDuration(duration, gridSize, position, radius, waves, amplitude) {
    if (super.initWithDuration(duration, gridSize)) {
      this.setPosition(position);
      this._radius = radius;
      this._waves = waves;
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
    const locGridSizeWidth = this._gridSize.width;
    const locGridSizeHeight = this._gridSize.height;
    const locPos = new cc.Point(0, 0);
    const locRadius = this._radius;
    const locWaves = this._waves;
    const locAmplitude = this._amplitude;
    const locAmplitudeRate = this._amplitudeRate;
    let v, r;
    const tempPos = new cc.Point(0, 0);
    for (let i = 0; i < locGridSizeWidth + 1; ++i) {
      for (let j = 0; j < locGridSizeHeight + 1; ++j) {
        locPos.x = i;
        locPos.y = j;
        v = this.getOriginalVertex(locPos);

        tempPos.x = this._position.x - v.x;
        tempPos.y = this._position.y - v.y;
        r = cc.Point.length(tempPos);

        if (r < locRadius) {
          r = locRadius - r;
          const rate = Math.pow(r / locRadius, 2);
          v.z +=
            Math.sin(dt * Math.PI * locWaves * 2 + r * 0.1) *
            locAmplitude *
            locAmplitudeRate *
            rate;
        }
        this.setVertex(locPos, v);
      }
    }
  }
}
