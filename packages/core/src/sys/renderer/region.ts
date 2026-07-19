import {
  Point,
  Size,
  type AffineTransformLike,
  type PointLike,
  type RectLike,
} from "../../geometry";

// Region labels a rect which is world axis aligned.
export default class Region {
  #min: Point = new Point();
  #max: Point = new Point();
  #size: Size = new Size();
  #area: number = 0;

  constructor(min: PointLike | null = null, max: PointLike | null = null) {
    this.setTo(min, max);
  }

  setTo(min: PointLike | null = null, max: PointLike | null = null): this {
    min === null ? this.#min.set(0, 0) : this.#min.set(min);
    max === null ? this.#max.set(0, 0) : this.#max.set(max);
    this.updateArea();
    return this;
  }

  // convert region to int values which is fast for clipping
  intValues(): void {
    Point.floorIn(this.#min);
    Point.ceilIn(this.#max);
    this.updateArea();
  }

  // update the area of region
  updateArea(): void {
    this.#size.set(this.#max.x - this.#min.x, this.#max.y - this.#min.y);
    this.#area = this.#size.width * this.#size.height;
  }

  // merge two regions into one
  union(target: Region): void {
    if (this.empty) {
      this.setTo(target.min, target.max);
      return;
    }

    Point.minIn(this.#min, target.#min);
    Point.maxIn(this.#max, target.#max);
    this.updateArea();
  }

  unionArea(target: Region): number {
    const min = Point.minIn(this.min, target.min);
    const max = Point.maxIn(this.max, target.max);
    Point.subIn(max, min);
    return max.x * max.y;
  }

  // check whether two regions intersect
  intersects(target: Region): boolean {
    return (
      !this.empty &&
      !target.empty &&
      Math.max(this.#min.x, target.min.x) <= Math.min(this.#max.x, target.max.x) &&
      Math.max(this.#min.y, target.min.y) <= Math.min(this.#max.y, target.max.y)
    );
  }

  // update region by a rotated bounds
  updateRegion(bounds: RectLike, matrix: AffineTransformLike): void {
    if (bounds.width === 0 || bounds.height === 0) {
      this.empty = true;
      return;
    }

    const { a, b, c, d, tx, ty } = matrix;
    const min = new Point();
    const max = Point.addIn(Point.fromSize(bounds), bounds) as Point;

    if (a === 1.0 && b === 0.0 && c === 0.0 && d === 1.0) {
      min.set(bounds.x + tx - 1, bounds.y + ty - 1);
      max.set(max.x + tx + 1, max.y + ty + 1);
    } else {
      const p0 = Point.transform(bounds, matrix);
      const p1 = Point.transform(new Point(max.x, bounds.y), matrix);
      const p2 = Point.transform(max, matrix);
      const p3 = Point.transform(new Point(bounds.x, max.y), matrix);

      if (p0.x > p1.x) {
        const t = p0.x;
        p0.x = p1.x;
        p1.x = t;
      }

      if (p2.x > p3.x) {
        const t = p2.x;
        p2.x = p3.x;
        p3.x = t;
      }

      if (p0.y > p1.y) {
        const t = p0.y;
        p0.y = p1.y;
        p1.y = t;
      }

      if (p2.y > p3.y) {
        const t = p2.y;
        p2.y = p3.y;
        p3.y = t;
      }

      min.set(Math.min(p0.x, p2.x) - 1, Math.min(p0.y, p2.y) - 1);
      max.set(Math.max(p1.x, p3.x) + 1, Math.max(p1.y, p3.y) + 1);
    }

    this.setTo(min, max);
  }

  get min(): Point {
    return this.#min.clone();
  }

  get max(): Point {
    return this.#max.clone();
  }

  get size(): Size {
    return this.#size.clone();
  }

  get area(): number {
    return this.#area;
  }

  // set region to empty
  set empty(value: boolean) {
    if (value) {
      this.#min.set(0, 0);
      this.#max.set(0, 0);
      this.#size.set(0, 0);
      this.#area = 0;
    }
  }

  get empty(): boolean {
    return this.#size.width <= 0 || this.#size.height <= 0;
  }
}
