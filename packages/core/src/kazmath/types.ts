export interface NumericArrayLike {
  readonly length: number;
  [index: number]: number;
}

export interface Vec2Like {
  x: number;
  y: number;
  readonly length?: number;
  readonly lengthSq?: number;
}

export interface Vec3Like extends Vec2Like {
  z: number;
}

export interface Vec4Like extends Vec3Like {
  w: number;
}

export interface QuaternionLike extends Vec4Like {}

export type QuaterionLike = QuaternionLike;

export interface Mat3Like {
  mat: NumericArrayLike;
}

export interface Mat4Like {
  mat: NumericArrayLike;
}

export interface PlaneLike {
  a: number;
  b: number;
  c: number;
  d: number;
}

export interface Ray2Like {
  readonly start: Vec2Like;
  readonly dir: Vec2Like;
}

export interface AABBLike {
  min: Vec3Like;
  max: Vec3Like;
}

export interface Matrix4StackLike {
  top: Mat4Like | null;
  stack: Mat4Like[];
  lastUpdated: number;
}
