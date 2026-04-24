import Grid3DAction from "../action-grid/grid3d-action";

/**
 * cc.Waves3D action.
 * Reference the test cases (Effects Advanced Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} waves
 * @param {Number} amplitude
 */
export default class Waves3D extends Grid3DAction {
  _waves = 0;
  _amplitude = 0;
  _amplitudeRate = 0;

  /**
   * Create a wave 3d action with duration, grid size, waves and amplitude.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} waves
   * @param {Number} amplitude
   */
  constructor(duration, gridSize, waves, amplitude) {
    super();
    amplitude !== undefined &&
      this.initWithDuration(duration, gridSize, waves, amplitude);
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
   * initializes an action with duration, grid size, waves and amplitude
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} waves
   * @param {Number} amplitude
   * @return {Boolean}
   */
  initWithDuration(duration, gridSize, waves, amplitude) {
    if (super.initWithDuration(duration, gridSize)) {
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
    const locGridSize = this._gridSize;
    const locAmplitude = this._amplitude;
    const locPos = new cc.Point(0, 0);
    const locAmplitudeRate = this._amplitudeRate;
    const locWaves = this._waves;
    for (let i = 0; i < locGridSize.width + 1; ++i) {
      for (let j = 0; j < locGridSize.height + 1; ++j) {
        locPos.x = i;
        locPos.y = j;
        const v = this.getOriginalVertex(locPos);
        v.z +=
          Math.sin(Math.PI * dt * locWaves * 2 + (v.y + v.x) * 0.01) *
          locAmplitude *
          locAmplitudeRate;
        this.setVertex(locPos, v);
      }
    }
  }
}
