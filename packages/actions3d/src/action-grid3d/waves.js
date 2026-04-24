import Grid3DAction from "../action-grid/grid3d-action";

/**
 * cc.Waves action.
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} waves
 * @param {Number} amplitude
 * @param {Boolean} horizontal
 * @param {Boolean} vertical
 */
export default class Waves extends Grid3DAction {
  _waves = 0;
  _amplitude = 0;
  _amplitudeRate = 0;
  _vertical = false;
  _horizontal = false;

  /**
   * Create a wave action with amplitude, horizontal sin, vertical sin, a grid and duration.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} waves
   * @param {Number} amplitude
   * @param {Boolean} horizontal
   * @param {Boolean} vertical
   */
  constructor(duration, gridSize, waves, amplitude, horizontal, vertical) {
    super();
    vertical !== undefined &&
      this.initWithDuration(
        duration,
        gridSize,
        waves,
        amplitude,
        horizontal,
        vertical
      );
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
   * initializes the action with amplitude, horizontal sin, vertical sin, a grid and duration
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} waves
   * @param {Number} amplitude
   * @param {Boolean} horizontal
   * @param {Boolean} vertical
   * @return {Boolean}
   */
  initWithDuration(duration, gridSize, waves, amplitude, horizontal, vertical) {
    if (super.initWithDuration(duration, gridSize)) {
      this._waves = waves;
      this._amplitude = amplitude;
      this._amplitudeRate = 1.0;
      this._horizontal = horizontal;
      this._vertical = vertical;
      return true;
    }
    return false;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    const locSizeWidth = this._gridSize.width;
    const locSizeHeight = this._gridSize.height;
    const locPos = new cc.Point(0, 0);
    const locVertical = this._vertical;
    const locHorizontal = this._horizontal;
    const locWaves = this._waves;
    const locAmplitude = this._amplitude;
    const locAmplitudeRate = this._amplitudeRate;
    let v;
    for (let i = 0; i < locSizeWidth + 1; ++i) {
      for (let j = 0; j < locSizeHeight + 1; ++j) {
        locPos.x = i;
        locPos.y = j;
        v = this.getOriginalVertex(locPos);
        if (locVertical)
          v.x =
            v.x +
            Math.sin(dt * Math.PI * locWaves * 2 + v.y * 0.01) *
              locAmplitude *
              locAmplitudeRate;
        if (locHorizontal)
          v.y =
            v.y +
            Math.sin(dt * Math.PI * locWaves * 2 + v.x * 0.01) *
              locAmplitude *
              locAmplitudeRate;
        this.setVertex(locPos, v);
      }
    }
  }
}
