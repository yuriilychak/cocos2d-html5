import Grid3DAction from "../action-grid/grid3d-action";
import { Point } from "@aspect/core";
import { Grid3D } from "@aspect/effects";

/**
 * This action simulates a page turn from the bottom right hand corner of the screen.
 * It's not much use by itself but is used by the PageTurnTransition.
 *
 * Based on an original paper by L Hong et al.
 * http://www.parc.com/publication/1638/turning-pages-of-3d-electronic-books.html
 */
export default class PageTurn3D extends Grid3DAction {
  getGrid() {
    const result = new Grid3D(
      this._gridSize,
      undefined,
      undefined,
      this._gridNodeTarget.getGridRect()
    );
    result.setNeedDepthTestForBlit(true);
    return result;
  }

  clone() {
    const ret = new PageTurn3D();
    ret.initWithDuration(this._duration, this._gridSize);
    return ret;
  }

  /**
   * Update each tick.
   * Time is the percentage of the way through the duration.
   * @param {Number} time
   */
  update(time) {
    const tt = Math.max(0, time - 0.25);
    const deltaAy = tt * tt * 500;
    const ay = -100 - deltaAy;

    const deltaTheta = Math.sqrt(time);
    const theta =
      deltaTheta > 0.5
        ? (Math.PI / 2) * deltaTheta
        : (Math.PI / 2) * (1 - deltaTheta);
    const rotateByYAxis = (2 - time) * Math.PI;

    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    const locGridSize = this._gridSize;
    const locVer = new Point(0, 0);
    for (let i = 0; i <= locGridSize.width; ++i) {
      for (let j = 0; j <= locGridSize.height; ++j) {
        locVer.x = i;
        locVer.y = j;
        // Get original vertex
        const p = this.getOriginalVertex(locVer);

        p.x -= this.getGridRect().x;
        const R = Math.sqrt(p.x * p.x + (p.y - ay) * (p.y - ay));
        const r = R * sinTheta;
        const alpha = Math.asin(p.x / R);
        const beta = alpha / sinTheta;
        const cosBeta = Math.cos(beta);

        // If beta > PI then we've wrapped around the cone
        // Reduce the radius to stop these points interfering with others
        if (beta <= Math.PI) p.x = r * Math.sin(beta);
        else p.x = 0; // Force X = 0 to stop wrapped points

        p.y = R + ay - r * (1 - cosBeta) * sinTheta;

        // We scale z here to avoid the animation being
        // too much bigger than the screen due to perspective transform
        p.z = r * (1 - cosBeta) * cosTheta;
        p.x = p.z * Math.sin(rotateByYAxis) + p.x * Math.cos(rotateByYAxis);
        p.z = p.z * Math.cos(rotateByYAxis) - p.x * Math.cos(rotateByYAxis);
        p.z /= 7;
        // Stop z coord from dropping beneath underlying page in a transition
        // issue #751
        if (p.z < 0.5) p.z = 0.5;

        // Set new coords
        p.x += this.getGridRect().x;
        this.setVertex(locVer, p);
      }
    }
  }
}
