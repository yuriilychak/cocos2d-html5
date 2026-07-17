export interface TriangleVertex {
  x: number;
  y: number;
  u: number;
  v: number;
}

export interface TriangleLike<TIndices extends ArrayLike<number> = ArrayLike<number>> {
  verts: TriangleVertex[];
  indices: TIndices;
}
