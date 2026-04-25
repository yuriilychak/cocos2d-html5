import GridAction from "./grid-action";
import { TiledGrid3D } from "@aspect/effects";

/**
 * Base class for TiledGrid3D actions.
 */
export default class TiledGrid3DAction extends GridAction {
  /**
   * returns the tile that belongs to a certain position of the grid
   * @param {Point} position
   * @return {Quad3}
   */
  getTile(position) {
    return this.target.grid.getTile(position);
  }

  /**
   * returns the non-transformed tile that belongs to a certain position of the grid
   * @param {Point} position
   * @return {Quad3}
   */
  getOriginalTile(position) {
    return this.target.grid.getOriginalTile(position);
  }

  /**
   * sets a new tile to a certain position of the grid
   * @param {Point} position
   * @param {Quad3} coords
   */
  setTile(position, coords) {
    this.target.grid.setTile(position, coords);
  }

  /**
   * returns the grid
   * @return {TiledGrid3D}
   */
  getGrid() {
    return new TiledGrid3D(
      this._gridSize,
      undefined,
      undefined,
      this._gridNodeTarget.getGridRect()
    );
  }
}
