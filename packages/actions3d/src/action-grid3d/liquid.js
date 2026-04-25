import Grid3DAction from "../action-grid/grid3d-action";
import { Point } from "@aspect/core";

/**
 * Liquid action.
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {Size} gridSize
 * @param {Number} waves
 * @param {Number} amplitude
 */
export default class Liquid extends Grid3DAction {
  _waves = 0;
  _amplitude = 0;
  _amplitudeRate = 0;

  /**
   * Create a liquid action with amplitude, a grid and duration.
   * @param {Number} duration
   * @param {Size} gridSize
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
   * initializes the action with amplitude, a grid and duration
   * @param {Number} duration
   * @param {Size} gridSize
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
    const locSizeWidth = this._gridSize.width;
    const locSizeHeight = this._gridSize.height;
    const locPos = new Point(0, 0);
    const locWaves = this._waves;
    const locAmplitude = this._amplitude;
    const locAmplitudeRate = this._amplitudeRate;
    let v;
    for (let i = 1; i < locSizeWidth; ++i) {
      for (let j = 1; j < locSizeHeight; ++j) {
        locPos.x = i;
        locPos.y = j;
        v = this.getOriginalVertex(locPos);
        v.x =
          v.x +
          Math.sin(dt * Math.PI * locWaves * 2 + v.x * 0.01) *
            locAmplitude *
            locAmplitudeRate;
        v.y =
          v.y +
          Math.sin(dt * Math.PI * locWaves * 2 + v.y * 0.01) *
            locAmplitude *
            locAmplitudeRate;
        this.setVertex(locPos, v);
      }
    }
  }
}
