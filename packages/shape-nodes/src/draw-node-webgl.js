import {
  Point,
  BlendFunc,
  SRC_ALPHA,
  ONE_MINUS_SRC_ALPHA,
  color,
  RendererConfig,
  GlobalVertexBuffer,
  DRAWNODE_TOTAL_VERTICES,
  ShaderCache,
  SHADER_POSITION_LENGTHTEXTURECOLOR,
  VERTEX_ATTRIB_POSITION,
  VERTEX_ATTRIB_COLOR,
  VERTEX_ATTRIB_TEX_COORDS,
  incrementGLDraws,
  warn,
  Node
} from "@aspect/core";
import { cardinalSplineAt, getControlPointAt } from "@aspect/actions";
// 9600 vertices by default configurable in ccConfig
// 5 floats per vertex: 2 position + 1 color (uint32) + 2 uv
var _sharedBuffer = null;
var FLOAT_PER_VERTEX = 2 + 1 + 2;
var VERTEX_BYTE = FLOAT_PER_VERTEX * 4;
var FLOAT_PER_TRIANGLE = 3 * FLOAT_PER_VERTEX;
var TRIANGLE_BYTES = FLOAT_PER_TRIANGLE * 4;
var MAX_INCREMENT = 200;

// Scratch variables — lazily initialized on first WebGL DrawNode creation
var _vertices = null,
  _from = null,
  _to = null,
  _color = null;
var _n = null,
  _t = null,
  _nw = null,
  _tw = null,
  _extrude = null;

function initScratch() {
  if (_vertices) return;
  _vertices = [];
  _from = new Point();
  _to = new Point();
  _color = new Uint32Array(1);
  _n = new Point();
  _t = new Point();
  _nw = new Point();
  _tw = new Point();
  _extrude = [];
}

function pMultOut(pin, floatVar, pout) {
  pout.x = pin.x * floatVar;
  pout.y = pin.y * floatVar;
}

export class DrawNodeWebGL {
  _initDrawNode(capacity, manualRelease) {
    initScratch();
    this._className = "DrawNodeWebGL";
    this._bufferCapacity = 0;
    this._vertexCount = 0;
    this._offset = 0;
    this._occupiedSize = 0;
    this._f32Buffer = null;
    this._ui32Buffer = null;
    this._dirty = false;
    this.manualRelease = false;

    if (!_sharedBuffer) {
      _sharedBuffer = new GlobalVertexBuffer(
        RendererConfig.getInstance().renderContext,
        DRAWNODE_TOTAL_VERTICES * VERTEX_BYTE
      );
    }

    this._renderCmd._shaderProgram = ShaderCache.getInstance().programForKey(
      SHADER_POSITION_LENGTHTEXTURECOLOR
    );
    this._blendFunc = new BlendFunc(SRC_ALPHA, ONE_MINUS_SRC_ALPHA);
    this._drawColor = color(255, 255, 255, 255);

    this._bufferCapacity = capacity || 64;
    this.manualRelease = manualRelease;

    this._dirty = true;
  }

  onEnter() {
    Node.prototype.onEnter.call(this);
    if (this._occupiedSize < this._bufferCapacity) {
      this._ensureCapacity(this._bufferCapacity);
    }
  }

  onExit() {
    if (!this.manualRelease) {
      this.release();
    }
    Node.prototype.onExit.call(this);
  }

  release() {
    if (this._occupiedSize > 0) {
      this._vertexCount = 0;
      _sharedBuffer.freeBuffer(this._offset, VERTEX_BYTE * this._occupiedSize);
      this._occupiedSize = 0;
    }
  }

  _ensureCapacity(count) {
    var _t = this;
    var prev = _t._occupiedSize;
    var prevOffset = _t._offset;
    if (count > prev || _t._bufferCapacity > prev) {
      var request = Math.max(
        Math.min(prev + prev, MAX_INCREMENT),
        count,
        _t._bufferCapacity
      );
      // free previous buffer
      if (prev !== 0) {
        _sharedBuffer.freeBuffer(prevOffset, VERTEX_BYTE * prev);
        _t._occupiedSize = 0;
      }
      var offset = (_t._offset = _sharedBuffer.requestBuffer(
        VERTEX_BYTE * request
      ));
      if (offset >= 0) {
        _t._occupiedSize = _t._bufferCapacity = request;
        // 5 floats per vertex
        _t._f32Buffer = new Float32Array(
          _sharedBuffer.data,
          offset,
          FLOAT_PER_VERTEX * _t._occupiedSize
        );
        _t._ui32Buffer = new Uint32Array(
          _sharedBuffer.data,
          offset,
          FLOAT_PER_VERTEX * _t._occupiedSize
        );

        // Copy old data
        if (prev !== 0 && prevOffset !== offset) {
          // offset is in byte, we need to transform to float32 index
          var last = prevOffset / 4 + prev * FLOAT_PER_VERTEX;
          for (var i = offset / 4, j = prevOffset / 4; j < last; i++, j++) {
            _sharedBuffer.dataArray[i] = _sharedBuffer.dataArray[j];
          }
        }

        return true;
      } else {
        warn(
          "Failed to allocate buffer for DrawNode: buffer for " +
            request +
            " vertices requested"
        );
        return false;
      }
    } else {
      return true;
    }
  }

  drawRect(origin, destination, fillColor, lineWidth, lineColor) {
    lineWidth = lineWidth == null ? this._lineWidth : lineWidth;
    lineColor = lineColor || this._drawColor;
    _vertices.length = 0;
    _vertices.push(
      origin.x,
      origin.y,
      destination.x,
      origin.y,
      destination.x,
      destination.y,
      origin.x,
      destination.y
    );
    if (fillColor == null)
      this._drawSegments(_vertices, lineWidth, lineColor, true);
    else this.drawPoly(_vertices, fillColor, lineWidth, lineColor);
    _vertices.length = 0;
  }

  drawCircle(
    center,
    radius,
    angle,
    segments,
    drawLineToCenter,
    lineWidth,
    color
  ) {
    lineWidth = lineWidth || this._lineWidth;
    color = color || this._drawColor;
    var coef = (2.0 * Math.PI) / segments,
      i,
      len;
    _vertices.length = 0;
    for (i = 0; i <= segments; i++) {
      var rads = i * coef;
      var j = radius * Math.cos(rads + angle) + center.x;
      var k = radius * Math.sin(rads + angle) + center.y;
      _vertices.push(j, k);
    }
    if (drawLineToCenter) _vertices.push(center.x, center.y);

    lineWidth *= 0.5;
    for (i = 0, len = _vertices.length - 2; i < len; i += 2) {
      _from.x = _vertices[i];
      _from.y = _vertices[i + 1];
      _to.x = _vertices[i + 2];
      _to.y = _vertices[i + 3];
      this.drawSegment(_from, _to, lineWidth, color);
    }
    _vertices.length = 0;
  }

  drawQuadBezier(origin, control, destination, segments, lineWidth, color) {
    lineWidth = lineWidth || this._lineWidth;
    color = color || this._drawColor;
    var t = 0.0;
    _vertices.length = 0;
    for (var i = 0; i < segments; i++) {
      var x =
        Math.pow(1 - t, 2) * origin.x +
        2.0 * (1 - t) * t * control.x +
        t * t * destination.x;
      var y =
        Math.pow(1 - t, 2) * origin.y +
        2.0 * (1 - t) * t * control.y +
        t * t * destination.y;
      _vertices.push(x, y);
      t += 1.0 / segments;
    }
    _vertices.push(destination.x, destination.y);
    this._drawSegments(_vertices, lineWidth, color, false);
    _vertices.length = 0;
  }

  drawCubicBezier(
    origin,
    control1,
    control2,
    destination,
    segments,
    lineWidth,
    color
  ) {
    lineWidth = lineWidth || this._lineWidth;
    color = color || this._drawColor;
    var t = 0;
    _vertices.length = 0;
    for (var i = 0; i < segments; i++) {
      var x =
        Math.pow(1 - t, 3) * origin.x +
        3.0 * Math.pow(1 - t, 2) * t * control1.x +
        3.0 * (1 - t) * t * t * control2.x +
        t * t * t * destination.x;
      var y =
        Math.pow(1 - t, 3) * origin.y +
        3.0 * Math.pow(1 - t, 2) * t * control1.y +
        3.0 * (1 - t) * t * t * control2.y +
        t * t * t * destination.y;
      _vertices.push(x, y);
      t += 1.0 / segments;
    }
    _vertices.push(destination.x, destination.y);
    this._drawSegments(_vertices, lineWidth, color, false);
    _vertices.length = 0;
  }

  drawCatmullRom(points, segments, lineWidth, color) {
    this.drawCardinalSpline(points, 0.5, segments, lineWidth, color);
  }

  drawCardinalSpline(config, tension, segments, lineWidth, color) {
    lineWidth = lineWidth || this._lineWidth;
    color = color || this._drawColor;
    var p,
      lt,
      deltaT = 1.0 / config.length;
    _vertices.length = 0;

    for (var i = 0; i < segments + 1; i++) {
      var dt = i / segments;

      // border
      if (dt === 1) {
        p = config.length - 1;
        lt = 1;
      } else {
        p = 0 | (dt / deltaT);
        lt = (dt - deltaT * p) / deltaT;
      }

      // Interpolate
      cardinalSplineAt(
        getControlPointAt(config, p - 1),
        getControlPointAt(config, p - 0),
        getControlPointAt(config, p + 1),
        getControlPointAt(config, p + 2),
        tension,
        lt,
        _from
      );
      _vertices.push(_from.x, _from.y);
    }

    lineWidth *= 0.5;
    for (var j = 0, len = _vertices.length - 2; j < len; j += 2) {
      _from.x = _vertices[j];
      _from.y = _vertices[j + 1];
      _to.x = _vertices[j + 2];
      _to.y = _vertices[j + 3];
      this.drawSegment(_from, _to, lineWidth, color);
    }
    _vertices.length = 0;
  }

  drawDots(points, radius, color) {
    if (!points || points.length === 0) return;
    color = color || this._drawColor;
    for (var i = 0, len = points.length; i < len; i++) {
      this.drawDot(points[i], radius, color);
    }
  }

  _render() {
    var gl = RendererConfig.getInstance().renderContext;
    if (this._offset < 0 || this._vertexCount <= 0) return;

    if (this._dirty) {
      // bindBuffer is done in updateSubData
      _sharedBuffer.updateSubData(this._offset, this._f32Buffer);
      this._dirty = false;
    } else {
      gl.bindBuffer(gl.ARRAY_BUFFER, _sharedBuffer.vertexBuffer);
    }

    gl.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);
    gl.enableVertexAttribArray(VERTEX_ATTRIB_COLOR);
    gl.enableVertexAttribArray(VERTEX_ATTRIB_TEX_COORDS);

    // vertex
    gl.vertexAttribPointer(
      VERTEX_ATTRIB_POSITION,
      2,
      gl.FLOAT,
      false,
      VERTEX_BYTE,
      0
    );
    // color
    gl.vertexAttribPointer(
      VERTEX_ATTRIB_COLOR,
      4,
      gl.UNSIGNED_BYTE,
      true,
      VERTEX_BYTE,
      8
    );
    // texcoord
    gl.vertexAttribPointer(
      VERTEX_ATTRIB_TEX_COORDS,
      2,
      gl.FLOAT,
      false,
      VERTEX_BYTE,
      12
    );

    gl.drawArrays(gl.TRIANGLES, this._offset / VERTEX_BYTE, this._vertexCount);
    incrementGLDraws(1);
  }

  appendVertexData(x, y, color, u, v) {
    var f32Buffer = this._f32Buffer;
    var offset = this._vertexCount * FLOAT_PER_VERTEX;
    f32Buffer[offset] = x;
    f32Buffer[offset + 1] = y;
    _color[0] = (color.a << 24) | (color.b << 16) | (color.g << 8) | color.r;
    this._ui32Buffer[offset + 2] = _color[0];
    f32Buffer[offset + 3] = u;
    f32Buffer[offset + 4] = v;
    this._vertexCount++;
  }

  drawDot(pos, radius, color) {
    color = color || this._drawColor;
    if (color.a == null) color.a = 255;
    var l = pos.x - radius,
      b = pos.y - radius,
      r = pos.x + radius,
      t = pos.y + radius;

    var succeed = this._ensureCapacity(this._vertexCount + 6);
    if (!succeed) return;

    // lb, lt, rt, lb, rt, rb
    this.appendVertexData(l, b, color, -1, -1);
    this.appendVertexData(l, t, color, -1, 1);
    this.appendVertexData(r, t, color, 1, 1);
    this.appendVertexData(l, b, color, -1, -1);
    this.appendVertexData(r, t, color, 1, 1);
    this.appendVertexData(r, b, color, 1, -1);

    this._dirty = true;
  }

  drawSegment(from, to, radius, color) {
    color = color || this.getDrawColor();
    if (color.a == null) color.a = 255;
    radius = radius || this._lineWidth * 0.5;
    var succeed = this._ensureCapacity(this._vertexCount + 18);
    if (!succeed) return;

    var a = from,
      b = to;
    // var n = normalize(perp(sub(b, a)))
    _n.x = a.y - b.y;
    _n.y = b.x - a.x;
    Point.normalizeIn(_n);
    // var t = perp(n);
    _t.x = -_n.y;
    _t.y = _n.x;
    // var nw = mult(n, radius), tw = mult(t, radius);
    pMultOut(_n, radius, _nw);
    pMultOut(_t, radius, _tw);

    // var v0 = sub(b, add(nw, tw)); uv0 = neg(add(n, t))
    var v0x = b.x - _nw.x - _tw.x,
      v0y = b.y - _nw.y - _tw.y,
      u0 = -(_n.x + _t.x),
      v0 = -(_n.y + _t.y);
    // var v1 = add(b, sub(nw, tw)); uv1 = sub(n, t)
    var v1x = b.x + _nw.x - _tw.x,
      v1y = b.y + _nw.y - _tw.y,
      u1 = _n.x - _t.x,
      v1 = _n.y - _t.y;
    // var v2 = sub(b, nw); uv2 = neg(n)
    var v2x = b.x - _nw.x,
      v2y = b.y - _nw.y,
      u2 = -_n.x,
      v2 = -_n.y;
    // var v3 = add(b, nw); uv3 = n
    var v3x = b.x + _nw.x,
      v3y = b.y + _nw.y,
      u3 = _n.x,
      v3 = _n.y;
    // var v4 = sub(a, nw); uv4 = neg(n)
    var v4x = a.x - _nw.x,
      v4y = a.y - _nw.y,
      u4 = u2,
      v4 = v2;
    // var v5 = add(a, nw); uv5 = n
    var v5x = a.x + _nw.x,
      v5y = a.y + _nw.y,
      u5 = _n.x,
      v5 = _n.y;
    // var v6 = sub(a, sub(nw, tw)); uv6 = sub(t, n)
    var v6x = a.x - _nw.x + _tw.x,
      v6y = a.y - _nw.y + _tw.y,
      u6 = _t.x - _n.x,
      v6 = _t.y - _n.y;
    // var v7 = add(a, add(nw, tw)); uv7 = add(n, t)
    var v7x = a.x + _nw.x + _tw.x,
      v7y = a.y + _nw.y + _tw.y,
      u7 = _n.x + _t.x,
      v7 = _n.y + _t.y;

    this.appendVertexData(v0x, v0y, color, u0, v0);
    this.appendVertexData(v1x, v1y, color, u1, v1);
    this.appendVertexData(v2x, v2y, color, u2, v2);

    this.appendVertexData(v3x, v3y, color, u3, v3);
    this.appendVertexData(v1x, v1y, color, u1, v1);
    this.appendVertexData(v2x, v2y, color, u2, v2);

    this.appendVertexData(v3x, v3y, color, u3, v3);
    this.appendVertexData(v4x, v4y, color, u4, v4);
    this.appendVertexData(v2x, v2y, color, u2, v2);

    this.appendVertexData(v3x, v3y, color, u3, v3);
    this.appendVertexData(v4x, v4y, color, u4, v4);
    this.appendVertexData(v5x, v5y, color, u5, v5);

    this.appendVertexData(v6x, v6y, color, u6, v6);
    this.appendVertexData(v4x, v4y, color, u4, v4);
    this.appendVertexData(v5x, v5y, color, u5, v5);

    this.appendVertexData(v6x, v6y, color, u6, v6);
    this.appendVertexData(v7x, v7y, color, u7, v7);
    this.appendVertexData(v5x, v5y, color, u5, v5);
    this._dirty = true;
  }

  drawPoly(verts, fillColor, borderWidth, borderColor) {
    // Backward compatibility
    if (typeof verts[0] === "object") {
      _vertices.length = 0;
      for (var i = 0; i < verts.length; i++) {
        _vertices.push(verts[i].x, verts[i].y);
      }
      verts = _vertices;
    }

    if (fillColor == null) {
      this._drawSegments(verts, borderWidth, borderColor, true);
      return;
    }
    if (fillColor.a == null) fillColor.a = 255;
    if (borderColor.a == null) borderColor.a = 255;
    borderWidth = borderWidth == null ? this._lineWidth : borderWidth;
    borderWidth *= 0.5;
    var v0x,
      v0y,
      v1x,
      v1y,
      v2x,
      v2y,
      factor,
      offx,
      offy,
      i,
      count = verts.length;
    _extrude.length = 0;
    for (i = 0; i < count; i += 2) {
      v0x = verts[(i - 2 + count) % count];
      v0y = verts[(i - 1 + count) % count];
      v1x = verts[i];
      v1y = verts[i + 1];
      v2x = verts[(i + 2) % count];
      v2y = verts[(i + 3) % count];
      _n.x = v0y - v1y;
      _n.y = v1x - v0x;
      _nw.x = v1y - v2y;
      _nw.y = v2x - v1x;
      Point.normalizeIn(_n);
      Point.normalizeIn(_nw);
      factor = _n.x * _nw.x + _n.y * _nw.y + 1;
      offx = (_n.x + _nw.x) / factor;
      offy = (_n.y + _nw.y) / factor;
      _extrude.push(offx, offy, _nw.x, _nw.y);
    }
    count = count / 2;
    var outline = borderWidth > 0.0,
      triangleCount = 3 * count - 2,
      vertexCount = 3 * triangleCount;
    var succeed = this._ensureCapacity(this._vertexCount + vertexCount);
    if (!succeed) return;

    var inset = outline == false ? 0.5 : 0.0;
    for (i = 0; i < count - 2; i++) {
      v0x = verts[0] - _extrude[0] * inset;
      v0y = verts[1] - _extrude[1] * inset;
      v1x = verts[i * 2 + 2] - _extrude[(i + 1) * 4] * inset;
      v1y = verts[i * 2 + 3] - _extrude[(i + 1) * 4 + 1] * inset;
      v2x = verts[i * 2 + 4] - _extrude[(i + 2) * 4] * inset;
      v2y = verts[i * 2 + 5] - _extrude[(i + 2) * 4 + 1] * inset;

      this.appendVertexData(v0x, v0y, fillColor, 0, 0);
      this.appendVertexData(v1x, v1y, fillColor, 0, 0);
      this.appendVertexData(v2x, v2y, fillColor, 0, 0);
    }

    var off0x,
      off0y,
      off1x,
      off1y,
      bw = outline ? borderWidth : 0.5,
      color = outline ? borderColor : fillColor,
      in0x,
      in0y,
      in1x,
      in1y,
      out0x,
      out0y,
      out1x,
      out1y;
    for (i = 0; i < count; i++) {
      var j = (i + 1) % count;
      v0x = verts[i * 2];
      v0y = verts[i * 2 + 1];
      v1x = verts[j * 2];
      v1y = verts[j * 2 + 1];

      _n.x = _extrude[i * 4 + 2];
      _n.y = _extrude[i * 4 + 3];
      _nw.x = outline ? -_n.x : 0;
      _nw.y = outline ? -_n.y : 0;
      off0x = _extrude[i * 4];
      off0y = _extrude[i * 4 + 1];
      off1x = _extrude[j * 4];
      off1y = _extrude[j * 4 + 1];

      in0x = v0x - off0x * bw;
      in0y = v0y - off0y * bw;
      in1x = v1x - off1x * bw;
      in1y = v1y - off1y * bw;
      out0x = v0x + off0x * bw;
      out0y = v0y + off0y * bw;
      out1x = v1x + off1x * bw;
      out1y = v1y + off1y * bw;

      this.appendVertexData(in0x, in0y, color, _nw.x, _nw.y);
      this.appendVertexData(in1x, in1y, color, _nw.x, _nw.y);
      this.appendVertexData(out1x, out1y, color, _n.x, _n.y);

      this.appendVertexData(in0x, in0y, color, _nw.x, _nw.y);
      this.appendVertexData(out0x, out0y, color, _n.x, _n.y);
      this.appendVertexData(out1x, out1y, color, _n.x, _n.y);
    }
    _extrude.length = 0;
    _vertices.length = 0;
    this._dirty = true;
  }

  _drawSegments(verts, borderWidth, borderColor, closePoly) {
    borderWidth = borderWidth == null ? this._lineWidth : borderWidth;
    if (borderWidth <= 0) return;

    borderColor = borderColor || this._drawColor;
    if (borderColor.a == null) borderColor.a = 255;
    borderWidth *= 0.5;

    var v0x,
      v0y,
      v1x,
      v1y,
      v2x,
      v2y,
      factor,
      offx,
      offy,
      i,
      count = verts.length;
    _extrude.length = 0;
    for (i = 0; i < count; i += 2) {
      v0x = verts[(i - 2 + count) % count];
      v0y = verts[(i - 1 + count) % count];
      v1x = verts[i];
      v1y = verts[i + 1];
      v2x = verts[(i + 2) % count];
      v2y = verts[(i + 3) % count];
      _n.x = v0y - v1y;
      _n.y = v1x - v0x;
      _nw.x = v1y - v2y;
      _nw.y = v2x - v1x;
      Point.normalizeIn(_n);
      Point.normalizeIn(_nw);
      factor = _n.x * _nw.x + _n.y * _nw.y + 1;
      offx = (_n.x + _nw.x) / factor;
      offy = (_n.y + _nw.y) / factor;
      _extrude.push(offx, offy, _nw.x, _nw.y);
    }

    count = count / 2;
    var triangleCount = 3 * count - 2,
      vertexCount = 3 * triangleCount;
    var succeed = this._ensureCapacity(this._vertexCount + vertexCount);
    if (!succeed) return;

    var len = closePoly ? count : count - 1,
      off0x,
      off0y,
      off1x,
      off1y,
      in0x,
      in0y,
      in1x,
      in1y,
      out0x,
      out0y,
      out1x,
      out1y;
    for (i = 0; i < len; i++) {
      var j = (i + 1) % count;
      v0x = verts[i * 2];
      v0y = verts[i * 2 + 1];
      v1x = verts[j * 2];
      v1y = verts[j * 2 + 1];

      _n.x = _extrude[i * 4 + 2];
      _n.y = _extrude[i * 4 + 3];
      off0x = _extrude[i * 4];
      off0y = _extrude[i * 4 + 1];
      off1x = _extrude[j * 4];
      off1y = _extrude[j * 4 + 1];
      in0x = v0x - off0x * borderWidth;
      in0y = v0y - off0y * borderWidth;
      in1x = v1x - off1x * borderWidth;
      in1y = v1y - off1y * borderWidth;
      out0x = v0x + off0x * borderWidth;
      out0y = v0y + off0y * borderWidth;
      out1x = v1x + off1x * borderWidth;
      out1y = v1y + off1y * borderWidth;

      this.appendVertexData(in0x, in0y, borderColor, -_n.x, -_n.y);
      this.appendVertexData(in1x, in1y, borderColor, -_n.x, -_n.y);
      this.appendVertexData(out1x, out1y, borderColor, _n.x, _n.y);

      this.appendVertexData(in0x, in0y, borderColor, -_n.x, -_n.y);
      this.appendVertexData(out0x, out0y, borderColor, _n.x, _n.y);
      this.appendVertexData(out1x, out1y, borderColor, _n.x, _n.y);
    }
    _extrude.length = 0;
    this._dirty = true;
  }

  clear() {
    this.release();
    this._dirty = true;
  }

  _createRenderCmd() {
    return new this.constructor.WebGLRenderCmd(this);
  }
}
