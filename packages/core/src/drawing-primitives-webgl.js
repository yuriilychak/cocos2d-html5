/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import { NewClass } from "./platform/class";
import { Point } from "./cocoa/geometry/point";
import {
  SHADER_POSITION_UCOLOR,
  VERTEX_ATTRIB_POSITION
} from "./platform/macro/constants";
import { incrementGLDraws, contentScaleFactor } from "./platform/macro/utils";
import { GLProgramState } from "./shaders/CCGLProgramState";
import ShaderCache from "./shaders/CCShaderCache";
import { RendererConfig } from "./renderer/renderer-config";

/**
 * Canvas of DrawingPrimitive implement version use for WebGlMode
 */
export class DrawingPrimitiveWebGL extends NewClass {
  constructor(ctx) {
    super();

    this._renderContext = null;
    this._initialized = false;
    this._shader = null;
    this._colorLocation = "u_color";
    this._colorArray = null;
    this._pointSizeLocation = "u_pointSize";
    this._pointSize = -1;

    if (ctx == null) ctx = RendererConfig.getInstance().renderContext;

    if ((!ctx) instanceof WebGLRenderingContext)
      throw new Error(
        "Can't initialise DrawingPrimitiveWebGL. context need is WebGLRenderingContext"
      );

    this._renderContext = ctx;
    this._colorArray = new Float32Array([1.0, 1.0, 1.0, 1.0]);
  }

  lazy_init() {
    var _t = this;
    if (!_t._initialized) {
      _t._shader = ShaderCache.getInstance().programForKey(
        SHADER_POSITION_UCOLOR
      );
      _t._shader._addUniformLocation(this._colorLocation);
      _t._shader._addUniformLocation(this._pointSizeLocation);
      _t._glProgramState = GLProgramState.getOrCreateWithGLProgram(_t._shader);

      _t._initialized = true;
    }
  }

  drawInit() {
    this._initialized = false;
  }

  drawPoint(point) {
    this.lazy_init();

    var glContext = this._renderContext;
    this._glProgramState.apply();
    this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
    glContext.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);
    this._shader.setUniformLocationWith4fv(
      this._colorLocation,
      this._colorArray
    );
    this._shader.setUniformLocationWith1f(
      this._pointSizeLocation,
      this._pointSize
    );

    var pointBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
    glContext.bufferData(
      glContext.ARRAY_BUFFER,
      new Float32Array([point.x, point.y]),
      glContext.STATIC_DRAW
    );
    glContext.vertexAttribPointer(
      VERTEX_ATTRIB_POSITION,
      2,
      glContext.FLOAT,
      false,
      0,
      0
    );

    glContext.drawArrays(glContext.POINTS, 0, 1);
    glContext.deleteBuffer(pointBuffer);

    incrementGLDraws(1);
  }

  drawPoints(points, numberOfPoints) {
    if (!points || points.length === 0) return;

    this.lazy_init();

    var glContext = this._renderContext;
    this._glProgramState.apply();
    this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
    glContext.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);
    this._shader.setUniformLocationWith4fv(
      this._colorLocation,
      this._colorArray
    );
    this._shader.setUniformLocationWith1f(
      this._pointSizeLocation,
      this._pointSize
    );

    var pointBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
    glContext.bufferData(
      glContext.ARRAY_BUFFER,
      this._pointsToTypeArray(points),
      glContext.STATIC_DRAW
    );
    glContext.vertexAttribPointer(
      VERTEX_ATTRIB_POSITION,
      2,
      glContext.FLOAT,
      false,
      0,
      0
    );

    glContext.drawArrays(glContext.POINTS, 0, points.length);
    glContext.deleteBuffer(pointBuffer);

    incrementGLDraws(1);
  }

  _pointsToTypeArray(points) {
    var typeArr = new Float32Array(points.length * 2);
    for (var i = 0; i < points.length; i++) {
      typeArr[i * 2] = points[i].x;
      typeArr[i * 2 + 1] = points[i].y;
    }
    return typeArr;
  }

  drawLine(origin, destination) {
    this.lazy_init();

    var glContext = this._renderContext;
    this._glProgramState.apply();
    this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
    glContext.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);
    this._shader.setUniformLocationWith4fv(
      this._colorLocation,
      this._colorArray
    );

    var pointBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
    glContext.bufferData(
      glContext.ARRAY_BUFFER,
      this._pointsToTypeArray([origin, destination]),
      glContext.STATIC_DRAW
    );
    glContext.vertexAttribPointer(
      VERTEX_ATTRIB_POSITION,
      2,
      glContext.FLOAT,
      false,
      0,
      0
    );

    glContext.drawArrays(glContext.LINES, 0, 2);
    glContext.deleteBuffer(pointBuffer);

    incrementGLDraws(1);
  }

  drawRect(origin, destination) {
    this.drawLine(
      new Point(origin.x, origin.y),
      new Point(destination.x, origin.y)
    );
    this.drawLine(
      new Point(destination.x, origin.y),
      new Point(destination.x, destination.y)
    );
    this.drawLine(
      new Point(destination.x, destination.y),
      new Point(origin.x, destination.y)
    );
    this.drawLine(
      new Point(origin.x, destination.y),
      new Point(origin.x, origin.y)
    );
  }

  drawSolidRect(origin, destination, color) {
    var vertices = [
      origin,
      new Point(destination.x, origin.y),
      destination,
      new Point(origin.x, destination.y)
    ];

    this.drawSolidPoly(vertices, 4, color);
  }

  drawPoly(vertices, numOfVertices, closePolygon) {
    this.lazy_init();

    var glContext = this._renderContext;
    this._glProgramState.apply();
    this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
    glContext.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);
    this._shader.setUniformLocationWith4fv(
      this._colorLocation,
      this._colorArray
    );

    var pointBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
    glContext.bufferData(
      glContext.ARRAY_BUFFER,
      this._pointsToTypeArray(vertices),
      glContext.STATIC_DRAW
    );
    glContext.vertexAttribPointer(
      VERTEX_ATTRIB_POSITION,
      2,
      glContext.FLOAT,
      false,
      0,
      0
    );

    if (closePolygon)
      glContext.drawArrays(glContext.LINE_LOOP, 0, vertices.length);
    else glContext.drawArrays(glContext.LINE_STRIP, 0, vertices.length);
    glContext.deleteBuffer(pointBuffer);

    incrementGLDraws(1);
  }

  drawSolidPoly(poli, numberOfPoints, color) {
    this.lazy_init();
    if (color) this.setDrawColor(color.r, color.g, color.b, color.a);

    var glContext = this._renderContext;
    this._glProgramState.apply();
    this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
    glContext.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);
    this._shader.setUniformLocationWith4fv(
      this._colorLocation,
      this._colorArray
    );

    var pointBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
    glContext.bufferData(
      glContext.ARRAY_BUFFER,
      this._pointsToTypeArray(poli),
      glContext.STATIC_DRAW
    );
    glContext.vertexAttribPointer(
      VERTEX_ATTRIB_POSITION,
      2,
      glContext.FLOAT,
      false,
      0,
      0
    );
    glContext.drawArrays(glContext.TRIANGLE_FAN, 0, poli.length);
    glContext.deleteBuffer(pointBuffer);

    incrementGLDraws(1);
  }

  drawCircle(center, radius, angle, segments, drawLineToCenter) {
    this.lazy_init();

    var additionalSegment = 1;
    if (drawLineToCenter) additionalSegment++;

    var coef = (2.0 * Math.PI) / segments;

    var vertices = new Float32Array((segments + 2) * 2);
    if (!vertices) return;

    for (var i = 0; i <= segments; i++) {
      var rads = i * coef;
      var j = radius * Math.cos(rads + angle) + center.x;
      var k = radius * Math.sin(rads + angle) + center.y;

      vertices[i * 2] = j;
      vertices[i * 2 + 1] = k;
    }
    vertices[(segments + 1) * 2] = center.x;
    vertices[(segments + 1) * 2 + 1] = center.y;

    var glContext = this._renderContext;
    this._glProgramState.apply();
    this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
    glContext.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);
    this._shader.setUniformLocationWith4fv(
      this._colorLocation,
      this._colorArray
    );

    var pointBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
    glContext.bufferData(
      glContext.ARRAY_BUFFER,
      vertices,
      glContext.STATIC_DRAW
    );
    glContext.vertexAttribPointer(
      VERTEX_ATTRIB_POSITION,
      2,
      glContext.FLOAT,
      false,
      0,
      0
    );

    glContext.drawArrays(glContext.LINE_STRIP, 0, segments + additionalSegment);
    glContext.deleteBuffer(pointBuffer);

    incrementGLDraws(1);
  }

  drawQuadBezier(origin, control, destination, segments) {
    this.lazy_init();

    var vertices = new Float32Array((segments + 1) * 2);

    var t = 0.0;
    for (var i = 0; i < segments; i++) {
      vertices[i * 2] =
        Math.pow(1 - t, 2) * origin.x +
        2.0 * (1 - t) * t * control.x +
        t * t * destination.x;
      vertices[i * 2 + 1] =
        Math.pow(1 - t, 2) * origin.y +
        2.0 * (1 - t) * t * control.y +
        t * t * destination.y;
      t += 1.0 / segments;
    }
    vertices[segments * 2] = destination.x;
    vertices[segments * 2 + 1] = destination.y;

    var glContext = this._renderContext;
    this._glProgramState.apply();
    this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
    glContext.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);
    this._shader.setUniformLocationWith4fv(
      this._colorLocation,
      this._colorArray
    );

    var pointBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
    glContext.bufferData(
      glContext.ARRAY_BUFFER,
      vertices,
      glContext.STATIC_DRAW
    );
    glContext.vertexAttribPointer(
      VERTEX_ATTRIB_POSITION,
      2,
      glContext.FLOAT,
      false,
      0,
      0
    );

    glContext.drawArrays(glContext.LINE_STRIP, 0, segments + 1);
    glContext.deleteBuffer(pointBuffer);

    incrementGLDraws(1);
  }

  drawCubicBezier(origin, control1, control2, destination, segments) {
    this.lazy_init();

    var vertices = new Float32Array((segments + 1) * 2);

    var t = 0;
    for (var i = 0; i < segments; i++) {
      vertices[i * 2] =
        Math.pow(1 - t, 3) * origin.x +
        3.0 * Math.pow(1 - t, 2) * t * control1.x +
        3.0 * (1 - t) * t * t * control2.x +
        t * t * t * destination.x;
      vertices[i * 2 + 1] =
        Math.pow(1 - t, 3) * origin.y +
        3.0 * Math.pow(1 - t, 2) * t * control1.y +
        3.0 * (1 - t) * t * t * control2.y +
        t * t * t * destination.y;
      t += 1.0 / segments;
    }
    vertices[segments * 2] = destination.x;
    vertices[segments * 2 + 1] = destination.y;

    var glContext = this._renderContext;
    this._glProgramState.apply();
    this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
    glContext.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);
    this._shader.setUniformLocationWith4fv(
      this._colorLocation,
      this._colorArray
    );

    var pointBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
    glContext.bufferData(
      glContext.ARRAY_BUFFER,
      vertices,
      glContext.STATIC_DRAW
    );
    glContext.vertexAttribPointer(
      VERTEX_ATTRIB_POSITION,
      2,
      glContext.FLOAT,
      false,
      0,
      0
    );
    glContext.drawArrays(glContext.LINE_STRIP, 0, segments + 1);
    glContext.deleteBuffer(pointBuffer);

    incrementGLDraws(1);
  }

  drawCatmullRom(points, segments) {
    this.drawCardinalSpline(points, 0.5, segments);
  }

  drawCardinalSpline(config, tension, segments) {
    this.lazy_init();

    var vertices = new Float32Array((segments + 1) * 2);
    var p,
      lt,
      deltaT = 1.0 / config.length;
    for (var i = 0; i < segments + 1; i++) {
      var dt = i / segments;

      if (dt === 1) {
        p = config.length - 1;
        lt = 1;
      } else {
        p = 0 | (dt / deltaT);
        lt = (dt - deltaT * p) / deltaT;
      }

      var newPos = cc.cardinalSplineAt(
        cc.getControlPointAt(config, p - 1),
        cc.getControlPointAt(config, p),
        cc.getControlPointAt(config, p + 1),
        cc.getControlPointAt(config, p + 2),
        tension,
        lt
      );

      vertices[i * 2] = newPos.x;
      vertices[i * 2 + 1] = newPos.y;
    }

    var glContext = this._renderContext;
    this._glProgramState.apply();
    this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
    glContext.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);
    this._shader.setUniformLocationWith4fv(
      this._colorLocation,
      this._colorArray
    );

    var pointBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
    glContext.bufferData(
      glContext.ARRAY_BUFFER,
      vertices,
      glContext.STATIC_DRAW
    );
    glContext.vertexAttribPointer(
      VERTEX_ATTRIB_POSITION,
      2,
      glContext.FLOAT,
      false,
      0,
      0
    );
    glContext.drawArrays(glContext.LINE_STRIP, 0, segments + 1);
    glContext.deleteBuffer(pointBuffer);

    incrementGLDraws(1);
  }

  setDrawColor(r, g, b, a) {
    this._colorArray[0] = r / 255.0;
    this._colorArray[1] = g / 255.0;
    this._colorArray[2] = b / 255.0;
    this._colorArray[3] = a / 255.0;
  }

  setPointSize(pointSize) {
    this._pointSize = pointSize * contentScaleFactor();
  }

  setLineWidth(width) {
    if (this._renderContext.lineWidth) this._renderContext.lineWidth(width);
  }
}
