export interface PointLike {
  x: number;
  y: number;
}

export interface SizeLike {
  width: number;
  height: number;
}

export interface RectLike extends PointLike, SizeLike {}
