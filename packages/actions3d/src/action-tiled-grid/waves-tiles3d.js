import TiledGrid3DAction from "../action-grid/tiled-grid3d-action";
import { Point } from "@aspect/core";

/**
 * WavesTiles3D action.
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {Size} gridSize
 * @param {Number} waves
 * @param {Number} amplitude
 */
export default class WavesTiles3D extends TiledGrid3DAction {
  _waves = 0;
  _amplitude = 0;
  _amplitudeRate = 0;

  /**
   * creates the action with a number of waves, the waves amplitude, the grid size and the duration.
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

  initWithDuration(duration, gridSize, waves, amplitude) {
    if (super.initWithDuration(duration, gridSize)) {
      this._waves = waves;
      this._amplitude = amplitude;
      this._amplitudeRate = 1.0;
      return true;
    }
    return false;
  }

  update(dt) {
    const locGridSize = this._gridSize;
    const locWaves = this._waves;
    const locAmplitude = this._amplitude;
    const locAmplitudeRate = this._amplitudeRate;
    const locPos = new Point(0, 0);
    let coords;
    for (let i = 0; i < locGridSize.width; i++) {
      for (let j = 0; j < locGridSize.height; j++) {
        locPos.x = i;
        locPos.y = j;
        coords = this.getOriginalTile(locPos);
        coords.bl.z =
          Math.sin(
            dt * Math.PI * locWaves * 2 + (coords.bl.y + coords.bl.x) * 0.01
          ) *
          locAmplitude *
          locAmplitudeRate;
        coords.br.z = coords.bl.z;
        coords.tl.z = coords.bl.z;
        coords.tr.z = coords.bl.z;
        this.setTile(locPos, coords);
      }
    }
  }
}
