export interface PointLike {
  x: number;
  y: number;
}

export interface SizeLike {
  width: number;
  height: number;
}

export interface RectLike extends PointLike, SizeLike {}

export interface AffineTransformLike {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}
