import cp from "chipmunk";

// Fix npm chipmunk v6.1.2 bug: BBTree.prototype.reindexQuery calls
//   this.collideStatic(this, staticIndex, func)   ← 3 args
// but the definition is collideStatic(staticIndex, func) ← 2 params.
// The extra first arg shifts staticIndex→func, making func a non-function.
// Patch: when called with 3 args, drop the redundant first arg.
const _proto = cp.SpatialIndex.prototype;
const _orig = _proto.collideStatic;
_proto.collideStatic = function (a, b, c) {
  return c !== undefined ? _orig.call(this, b, c) : _orig.call(this, a, b);
};

// v7.0 compatibility constants missing from npm chipmunk v6.1.2
cp.ALL_CATEGORIES = ~0;
cp.SHAPE_FILTER_ALL = {
  group: cp.NO_GROUP,
  categories: cp.ALL_CATEGORIES,
  mask: cp.ALL_CATEGORIES
};

// v7.0 compatibility: Body method aliases
cp.Body.prototype.getPosition = cp.Body.prototype.getPos;
cp.Body.prototype.getVelocity = cp.Body.prototype.getVel;
cp.Body.prototype.getAngularVelocity = cp.Body.prototype.getAngVel;
cp.Body.prototype.getCenterOfGravity = function () {
  return this.p;
};
cp.Body.prototype.localToWorld = cp.Body.prototype.local2World;
cp.Body.prototype.worldToLocal = cp.Body.prototype.world2Local;

// v7.0 compatibility: StaticBody factory
cp.StaticBody = function () {
  var body = new cp.Body(Infinity, Infinity);
  body.nodeIdleTime = Infinity;
  return body;
};

// v7.0 compatibility: PolyShape.getCount alias
cp.PolyShape.prototype.getCount = cp.PolyShape.prototype.getNumVerts;

// v7.0 compatibility: pointQueryNearest(point, maxDistance, filter) shim
// The npm package only has nearestPointQueryNearest(point, maxDistance, layers, group).
cp.Space.prototype.pointQueryNearest = function (point, maxDistance, filter) {
  var out = this.nearestPointQueryNearest(
    point,
    maxDistance,
    filter.mask,
    filter.group
  );
  if (out !== undefined) {
    out.distance = out.d;
    out.point = out.p;
  }
  return out;
};

// v7.0 compatibility: segmentQueryFirst result shim.
// The npm package returns a raw info object without normal/alpha/point props.
const _segmentQueryFirst = cp.Space.prototype.segmentQueryFirst;
cp.Space.prototype.segmentQueryFirst = function (start, end, layers, group) {
  var out = _segmentQueryFirst.call(this, start, end, layers, group);
  if (out) {
    out.normal = out.n;
    out.alpha = out.t;
    out.p = out.point = cp.v.lerp(start, end, out.t);
  }
  return out;
};

if (typeof window !== "undefined") {
  window.cp = cp;
}
