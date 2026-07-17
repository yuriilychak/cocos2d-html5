import { Rect } from "../geometry";
import type { RectLike } from "../geometry";
import { Triangles } from "./triangles";
import type { TriangleLike, TriangleVertex } from "./types";

export class PolygonInfo {
  #rect: Rect = new Rect();
  #filename: string = "";
  #isVertsZeroed: boolean = false;
  #triangles: Triangles = new Triangles();

  constructor(filename = "") {
    this.#filename = filename;
  }

  static fromFlatArrays(
    vertices: number[],
    verticesUV: number[] | null | undefined,
    indices: ArrayLike<number> = [],
    rect: RectLike | null = null
  ): PolygonInfo {
    const info = new PolygonInfo();
    const verts: TriangleVertex[] = [];

    for (let i = 0; i < vertices.length; i += 2) {
      verts.push({
        x: vertices[i],
        y: vertices[i + 1],
        u: verticesUV ? verticesUV[i] : 0,
        v: verticesUV ? verticesUV[i + 1] : 0
      });
    }

    info.triangles = { verts, indices };

    if (rect) {
      info.rect = rect;
    }
    return info;
  }

  get triangles(): Triangles {
    return this.#triangles;
  }

  set triangles(triangles: TriangleLike) {
    this.#triangles.set(triangles);
  }

  get rect(): Rect {
    return this.#rect.clone();
  }

  set rect(rect: RectLike) {
    this.#rect.set(rect);
  }

  get filename(): string {
    return this.#filename;
  }

  set filename(filename: string) {
    this.#filename = filename;
  }

  get isVertsZeroed(): boolean {
    return this.#isVertsZeroed;
  }

  set isVertsZeroed(value: boolean) {
    this.#isVertsZeroed = value;
  }
}
