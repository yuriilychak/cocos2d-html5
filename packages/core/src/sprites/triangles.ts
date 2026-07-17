import type { TriangleLike, TriangleVertex } from "./types";

export type { TriangleVertex } from "./types";

export class Triangles implements TriangleLike<Uint16Array> {
  #verts: TriangleVertex[] = [];
  #indices = new Uint16Array();

  constructor(verts: TriangleVertex[] = [], indices: ArrayLike<number> = []) {
    this.set({ verts, indices });
  }

  set(triangles: TriangleLike): void {
    this.#verts = triangles.verts.slice();
    this.#indices = new Uint16Array(triangles.indices);
  }

  get verts(): TriangleVertex[] {
    return this.#verts.slice();
  }

  get indices(): Uint16Array {
    return this.#indices.slice();
  }

  get vertCount(): number {
    return this.#verts.length;
  }

  get indexCount(): number {
    return this.#indices.length;
  }
}
