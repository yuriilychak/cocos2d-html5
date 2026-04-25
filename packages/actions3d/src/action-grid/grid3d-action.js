import GridAction from "./grid-action";
import { Grid3D } from "@aspect/effects";

/**
 * Base class for Grid3D actions.
 * Grid3D actions can modify a non-tiled grid.
 */
export default class Grid3DAction extends GridAction {
  /**
   * returns the grid
   * @return {Grid3D}
   */
  getGrid() {
    return new Grid3D(
      this._gridSize,
      undefined,
      undefined,
      this._gridNodeTarget.getGridRect()
    );
  }

  /**
   * get rect of the grid
   * @return {Rect} rect
   */
  getGridRect() {
    return this._gridNodeTarget.getGridRect();
  }

  /**
   * returns the vertex than belongs to certain position in the grid
   * @param {Point} position
   * @return {Vertex3F}
   */
  getVertex(position) {
    return this.target.grid.getVertex(position);
  }

  /**
   * returns the non-transformed vertex that belongs to certain position in the grid
   * @param {Point} position
   * @return {Vertex3F}
   */
  getOriginalVertex(position) {
    return this.target.grid.getOriginalVertex(position);
  }

  /**
   * sets a new vertex to a certain position of the grid
   * @param {Point} position
   * @param {Vertex3F} vertex
   */
  setVertex(position, vertex) {
    this.target.grid.setVertex(position, vertex);
  }
}
