import GridAction from "./grid-action";

/**
 * Base class for cc.Grid3D actions.
 * Grid3D actions can modify a non-tiled grid.
 */
export default class Grid3DAction extends GridAction {
  /**
   * returns the grid
   * @return {cc.Grid3D}
   */
  getGrid() {
    return new cc.Grid3D(
      this._gridSize,
      undefined,
      undefined,
      this._gridNodeTarget.getGridRect()
    );
  }

  /**
   * get rect of the grid
   * @return {cc.Rect} rect
   */
  getGridRect() {
    return this._gridNodeTarget.getGridRect();
  }

  /**
   * returns the vertex than belongs to certain position in the grid
   * @param {cc.Point} position
   * @return {cc.Vertex3F}
   */
  getVertex(position) {
    return this.target.grid.getVertex(position);
  }

  /**
   * returns the non-transformed vertex that belongs to certain position in the grid
   * @param {cc.Point} position
   * @return {cc.Vertex3F}
   */
  getOriginalVertex(position) {
    return this.target.grid.getOriginalVertex(position);
  }

  /**
   * sets a new vertex to a certain position of the grid
   * @param {cc.Point} position
   * @param {cc.Vertex3F} vertex
   */
  setVertex(position, vertex) {
    this.target.grid.setVertex(position, vertex);
  }
}
