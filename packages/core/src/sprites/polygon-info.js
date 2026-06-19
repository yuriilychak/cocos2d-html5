/****************************************************************************
 Polygonal sprite support — JS port of cocos2d-x's PolygonInfo / Triangles.

 A PolygonInfo describes a mesh used to render a Sprite as a triangle
 list instead of a single textured quad. This is useful for trimming
 transparent pixels around irregular sprites and reducing overdraw on
 WebGL devices (see http://www.codeandweb.com/texturepacker for the
 corresponding tooling that produces this data).

 Layout matches cocos2d-x 3.x:
   - verts:   array of vertices ({ x, y, u, v }), in *pixel* coordinates
              relative to the sprite frame's untrimmed origin (top-left).
   - indices: triangle index list (Uint16Array or plain Array).
   - rect:    bounding box of the verts (pixels) — used as the sprite's
              texture rect.
   - filename: source file the polygon belongs to (optional metadata).
 ****************************************************************************/

import { Rect } from "../geometry";

export class Triangles {
  constructor(verts, indices) {
    this.verts = verts || [];
    this.indices = indices || [];
  }

  get vertCount() {
    return this.verts.length;
  }

  get indexCount() {
    return this.indices.length;
  }
}

export class PolygonInfo {
  constructor() {
    this.rect = new Rect(0, 0, 0, 0);
    this.filename = "";
    this.triangles = new Triangles([], []);
    this.isVertsZeroed = false;
  }

  /**
   * Replace the polygon's triangle mesh.
   * @param {Triangles|{verts:Array,indices:Array|Uint16Array}} triangles
   */
  setTriangles(triangles) {
    if (triangles instanceof Triangles) {
      this.triangles = triangles;
    } else {
      this.triangles = new Triangles(
        triangles.verts || [],
        triangles.indices || []
      );
    }
  }

  /**
   * Build a PolygonInfo from raw flat arrays (matches cocos2d-x .plist
   * "polygon" / "triangles" fields).
   *
   * @param {Number[]} vertices    Flat array [x0,y0,x1,y1,...] in pixels.
   * @param {Number[]} verticesUV  Flat array [u0,v0,...] in pixels (atlas coords).
   * @param {Number[]|Uint16Array} indices Triangle indices.
   * @param {Rect} [rect]          Optional bounding rect of the polygon.
   * @returns {PolygonInfo}
   */
  static fromFlatArrays(vertices, verticesUV, indices, rect) {
    var info = new PolygonInfo();
    var verts = [];
    var len = (vertices && vertices.length) || 0;
    for (var i = 0; i < len; i += 2) {
      verts.push({
        x: vertices[i],
        y: vertices[i + 1],
        u: verticesUV ? verticesUV[i] : 0,
        v: verticesUV ? verticesUV[i + 1] : 0
      });
    }
    info.triangles = new Triangles(verts, indices || []);
    if (rect) {
      info.rect = new Rect(rect.x, rect.y, rect.width, rect.height);
    }
    return info;
  }
}
