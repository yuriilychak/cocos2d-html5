import GridAction from "./grid-action";

/**
 * Base class for cc.TiledGrid3D actions.
 */
export default class TiledGrid3DAction extends GridAction {
  /**
   * returns the tile that belongs to a certain position of the grid
   * @param {cc.Point} position
   * @return {cc.Quad3}
   */
  getTile(position) {
    return this.target.grid.getTile(position);
  }

  /**
   * returns the non-transformed tile that belongs to a certain position of the grid
   * @param {cc.Point} position
   * @return {cc.Quad3}
   */
  getOriginalTile(position) {
    return this.target.grid.getOriginalTile(position);
  }

  /**
   * sets a new tile to a certain position of the grid
   * @param {cc.Point} position
   * @param {cc.Quad3} coords
   */
  setTile(position, coords) {
    this.target.grid.setTile(position, coords);
  }

  /**
   * returns the grid
   * @return {cc.TiledGrid3D}
   */
  getGrid() {
    return new cc.TiledGrid3D(
      this._gridSize,
      undefined,
      undefined,
      this._gridNodeTarget.getGridRect()
    );
  }
}
