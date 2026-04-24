import FlipX3D from "./flip-x3d";

/**
 * cc.FlipY3D action.
 * Upside down.
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 */
export default class FlipY3D extends FlipX3D {
  /**
   * Create a flip Y 3d action with duration.
   * @param {Number} duration
   */
  constructor(duration) {
    super(duration);
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number} dt
   */
  update(dt) {
    let angle = Math.PI * dt; // 180 degrees
    const mz = Math.sin(angle);
    angle = angle / 2.0; // x calculates degrees from 0 to 90
    const my = Math.cos(angle);

    const diff = new cc.Vertex3F();

    const tempP = new cc.Point(0, 0);
    tempP.x = tempP.y = 1;
    const v0 = this.getOriginalVertex(tempP);
    tempP.x = tempP.y = 0;
    const v1 = this.getOriginalVertex(tempP);

    const y0 = v0.y;
    const y1 = v1.y;
    let y, a, b, c, d;

    if (y0 > y1) {
      // Normal Grid
      a = new cc.Point(0, 0);
      b = new cc.Point(0, 1);
      c = new cc.Point(1, 0);
      d = new cc.Point(1, 1);
      y = y0;
    } else {
      // Reversed Grid
      b = new cc.Point(0, 0);
      a = new cc.Point(0, 1);
      d = new cc.Point(1, 0);
      c = new cc.Point(1, 1);
      y = y1;
    }

    diff.y = y - y * my;
    diff.z = Math.abs(parseFloat(y * mz) / 4.0);

    // bottom-left
    let v = this.getOriginalVertex(a);
    v.y = diff.y;
    v.z += diff.z;
    this.setVertex(a, v);

    // upper-left
    v = this.getOriginalVertex(b);
    v.y -= diff.y;
    v.z -= diff.z;
    this.setVertex(b, v);

    // bottom-right
    v = this.getOriginalVertex(c);
    v.y = diff.y;
    v.z += diff.z;
    this.setVertex(c, v);

    // upper-right
    v = this.getOriginalVertex(d);
    v.y -= diff.y;
    v.z -= diff.z;
    this.setVertex(d, v);
  }
}
