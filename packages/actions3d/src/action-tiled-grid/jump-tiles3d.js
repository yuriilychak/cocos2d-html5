import TiledGrid3DAction from "../action-grid/tiled-grid3d-action";
import { Point } from "@aspect/core";

/**
 * JumpTiles3D action. A sin function is executed to move the tiles across the Z axis.
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {Size} gridSize
 * @param {Number} numberOfJumps
 * @param {Number} amplitude
 */
export default class JumpTiles3D extends TiledGrid3DAction {
  _jumps = 0;
  _amplitude = 0;
  _amplitudeRate = 0;

  /**
   * creates the action with the number of jumps, the sin amplitude, the grid size and the duration.
   * @param {Number} duration
   * @param {Size} gridSize
   * @param {Number} numberOfJumps
   * @param {Number} amplitude
   */
  constructor(duration, gridSize, numberOfJumps, amplitude) {
    super();
    amplitude !== undefined &&
      this.initWithDuration(duration, gridSize, numberOfJumps, amplitude);
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

  initWithDuration(duration, gridSize, numberOfJumps, amplitude) {
    if (super.initWithDuration(duration, gridSize)) {
      this._jumps = numberOfJumps;
      this._amplitude = amplitude;
      this._amplitudeRate = 1.0;
      return true;
    }
    return false;
  }

  update(dt) {
    const sinz =
      Math.sin(Math.PI * dt * this._jumps * 2) *
      this._amplitude *
      this._amplitudeRate;
    const sinz2 =
      Math.sin(Math.PI * (dt * this._jumps * 2 + 1)) *
      this._amplitude *
      this._amplitudeRate;

    const locGridSize = this._gridSize;
    const locGrid = this.target.grid;
    let coords;
    const locPos = new Point(0, 0);
    for (let i = 0; i < locGridSize.width; i++) {
      for (let j = 0; j < locGridSize.height; j++) {
        locPos.x = i;
        locPos.y = j;
        coords = locGrid.getOriginalTile(locPos);

        if ((i + j) % 2 === 0) {
          coords.bl.z += sinz;
          coords.br.z += sinz;
          coords.tl.z += sinz;
          coords.tr.z += sinz;
        } else {
          coords.bl.z += sinz2;
          coords.br.z += sinz2;
          coords.tl.z += sinz2;
          coords.tr.z += sinz2;
        }
        locGrid.setTile(locPos, coords);
      }
    }
  }
}
