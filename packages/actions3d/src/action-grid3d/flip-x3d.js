import Grid3DAction from "../action-grid/grid3d-action";
import { Size, Vertex3F, Point, log } from "@aspect/core";

/**
 * FlipX3D action.
 * Flip around.
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 */
export default class FlipX3D extends Grid3DAction {
  /**
   * Create a Flip X 3D action with duration.
   * @param {Number} duration
   */
  constructor(duration) {
    if (duration !== undefined) super(duration, new Size(1, 1));
    else super();
  }

  /**
   * initializes the action with duration
   * @param {Number} duration
   * @return {Boolean}
   */
  initWithDuration(duration) {
    return super.initWithDuration(duration, new Size(1, 1));
  }

  /**
   * initializes the action with gridSize and duration
   * @param {Size} gridSize
   * @param {Number} duration
   * @return {Boolean}
   */
  initWithSize(gridSize, duration) {
    if (gridSize.width !== 1 || gridSize.height !== 1) {
      log("Grid size must be (1,1)");
      return false;
    }
    return super.initWithDuration(duration, gridSize);
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    let angle = Math.PI * dt; // 180 degrees
    const mz = Math.sin(angle);
    angle = angle / 2.0; // x calculates degrees from 0 to 90
    const mx = Math.cos(angle);

    const diff = new Vertex3F();
    const tempVer = new Point(0, 0);
    tempVer.x = tempVer.y = 1;
    const v0 = this.getOriginalVertex(tempVer);
    tempVer.x = tempVer.y = 0;
    const v1 = this.getOriginalVertex(tempVer);

    const x0 = v0.x;
    const x1 = v1.x;
    let x, a, b, c, d;

    if (x0 > x1) {
      // Normal Grid
      a = new Point(0, 0);
      b = new Point(0, 1);
      c = new Point(1, 0);
      d = new Point(1, 1);
      x = x0;
    } else {
      // Reversed Grid
      c = new Point(0, 0);
      d = new Point(0, 1);
      a = new Point(1, 0);
      b = new Point(1, 1);
      x = x1;
    }

    diff.x = x - x * mx;
    diff.z = Math.abs(parseFloat((x * mz) / 4.0));

    // bottom-left
    let v = this.getOriginalVertex(a);
    v.x = diff.x;
    v.z += diff.z;
    this.setVertex(a, v);

    // upper-left
    v = this.getOriginalVertex(b);
    v.x = diff.x;
    v.z += diff.z;
    this.setVertex(b, v);

    // bottom-right
    v = this.getOriginalVertex(c);
    v.x -= diff.x;
    v.z -= diff.z;
    this.setVertex(c, v);

    // upper-right
    v = this.getOriginalVertex(d);
    v.x -= diff.x;
    v.z -= diff.z;
    this.setVertex(d, v);
  }
}
