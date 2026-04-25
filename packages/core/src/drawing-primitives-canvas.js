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

import { RendererConfig } from "./renderer/renderer-config";
import { NewClass } from "./platform/class";
import { Point } from "./cocoa/geometry/point";
import { Color } from "./platform/types/color";

export const PI2 = Math.PI * 2;

/**
 * Canvas of DrawingPrimitive implement version use for canvasMode
 * @param {CanvasRenderingContext2D} renderContext
 */
export class DrawingPrimitiveCanvas extends NewClass {
  constructor(renderContext) {
    super();
    this._cacheArray = [];
    this._renderContext = null;
    this._renderContext = renderContext;
  }

  drawPoint(point, size) {
    if (!size) {
      size = 1;
    }
    var ctx = this._renderContext.getContext();
    ctx.beginPath();
    ctx.arc(point.x, -point.y, size, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  }

  drawPoints(points, numberOfPoints, size) {
    if (points == null) return;

    if (!size) {
      size = 1;
    }
    var locContext = this._renderContext.getContext();

    locContext.beginPath();
    for (var i = 0, len = points.length; i < len; i++)
      locContext.arc(points[i].x, -points[i].y, size, 0, Math.PI * 2, false);
    locContext.closePath();
    locContext.fill();
  }

  drawLine(origin, destination) {
    var locContext = this._renderContext.getContext();
    locContext.beginPath();
    locContext.moveTo(origin.x, -origin.y);
    locContext.lineTo(destination.x, -destination.y);
    locContext.closePath();
    locContext.stroke();
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

  drawPoly(vertices, numOfVertices, closePolygon, fill) {
    fill = fill || false;

    if (vertices == null) return;

    if (vertices.length < 3)
      throw new Error("Polygon's point must greater than 2");

    var firstPoint = vertices[0],
      locContext = this._renderContext.getContext();
    locContext.beginPath();
    locContext.moveTo(firstPoint.x, -firstPoint.y);
    for (var i = 1, len = vertices.length; i < len; i++)
      locContext.lineTo(vertices[i].x, -vertices[i].y);

    if (closePolygon) locContext.closePath();

    if (fill) locContext.fill();
    else locContext.stroke();
  }

  drawSolidPoly(polygons, numberOfPoints, color) {
    this.setDrawColor(color.r, color.g, color.b, color.a);
    this.drawPoly(polygons, numberOfPoints, true, true);
  }

  drawCircle(center, radius, angle, segments, drawLineToCenter) {
    drawLineToCenter = drawLineToCenter || false;
    var locContext = this._renderContext.getContext();
    locContext.beginPath();
    var endAngle = angle - Math.PI * 2;
    locContext.arc(
      0 | center.x,
      0 | -center.y,
      radius,
      -angle,
      -endAngle,
      false
    );
    if (drawLineToCenter) {
      locContext.lineTo(0 | center.x, 0 | -center.y);
    }
    locContext.stroke();
  }

  drawQuadBezier(origin, control, destination, segments) {
    var vertices = this._cacheArray;
    vertices.length = 0;

    var t = 0.0;
    for (var i = 0; i < segments; i++) {
      var x =
        Math.pow(1 - t, 2) * origin.x +
        2.0 * (1 - t) * t * control.x +
        t * t * destination.x;
      var y =
        Math.pow(1 - t, 2) * origin.y +
        2.0 * (1 - t) * t * control.y +
        t * t * destination.y;
      vertices.push(new Point(x, y));
      t += 1.0 / segments;
    }
    vertices.push(new Point(destination.x, destination.y));

    this.drawPoly(vertices, segments + 1, false, false);
  }

  drawCubicBezier(origin, control1, control2, destination, segments) {
    var vertices = this._cacheArray;
    vertices.length = 0;

    var t = 0;
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
      vertices.push(new Point(x, y));
      t += 1.0 / segments;
    }
    vertices.push(new Point(destination.x, destination.y));

    this.drawPoly(vertices, segments + 1, false, false);
  }

  drawCatmullRom(points, segments) {
    this.drawCardinalSpline(points, 0.5, segments);
  }

  drawCardinalSpline(config, tension, segments) {
    RendererConfig.getInstance().renderContext.setStrokeStyle(
      cc.Color.toRgba()
    );
    var points = this._cacheArray;
    points.length = 0;
    var p, lt;
    var deltaT = 1.0 / config.length;

    for (var i = 0; i < segments + 1; i++) {
      var dt = i / segments;

      if (dt === 1) {
        p = config.length - 1;
        lt = 1;
      } else {
        p = 0 | (dt / deltaT);
        lt = (dt - deltaT * p) / deltaT;
      }

      var newPos = cc.CardinalSplineAt(
        cc.getControlPointAt(config, p - 1),
        cc.getControlPointAt(config, p - 0),
        cc.getControlPointAt(config, p + 1),
        cc.getControlPointAt(config, p + 2),
        tension,
        lt
      );
      points.push(newPos);
    }
    this.drawPoly(points, segments + 1, false, false);
  }

  drawImage(image, sourcePoint, sourceSize, destPoint, destSize) {
    var len = arguments.length;
    var ctx = this._renderContext.getContext();
    switch (len) {
      case 2:
        var height = image.height;
        ctx.drawImage(image, sourcePoint.x, -(sourcePoint.y + height));
        break;
      case 3:
        ctx.drawImage(
          image,
          sourcePoint.x,
          -(sourcePoint.y + sourceSize.height),
          sourceSize.width,
          sourceSize.height
        );
        break;
      case 5:
        ctx.drawImage(
          image,
          sourcePoint.x,
          sourcePoint.y,
          sourceSize.width,
          sourceSize.height,
          destPoint.x,
          -(destPoint.y + destSize.height),
          destSize.width,
          destSize.height
        );
        break;
      default:
        throw new Error("Argument must be non-nil");
    }
  }

  drawStar(ctx, radius, color) {
    var wrapper = ctx || this._renderContext;
    var context = wrapper.getContext();
    wrapper.setFillStyle(
      cc.Color.toRgba(0 | color.r, 0 | color.g, 0 | color.b)
    );
    var subRadius = radius / 10;

    context.beginPath();
    context.moveTo(-radius, radius);
    context.lineTo(0, subRadius);
    context.lineTo(radius, radius);
    context.lineTo(subRadius, 0);
    context.lineTo(radius, -radius);
    context.lineTo(0, -subRadius);
    context.lineTo(-radius, -radius);
    context.lineTo(-subRadius, 0);
    context.lineTo(-radius, radius);
    context.closePath();
    context.fill();

    var rg = context.createRadialGradient(0, 0, subRadius, 0, 0, radius);
    rg.addColorStop(0, cc.Color.toRgba(0 | color.r, 0 | color.g, 0 | color.b));
    rg.addColorStop(
      0.3,
      cc.Color.toRgba(0 | color.r, 0 | color.g, 0 | color.b, 200)
    );
    rg.addColorStop(
      1.0,
      cc.Color.toRgba(0 | color.r, 0 | color.g, 0 | color.b, 0)
    );
    wrapper.setFillStyle(rg);
    context.beginPath();
    var startAngle_1 = 0;
    var endAngle_1 = PI2;
    context.arc(0, 0, radius - subRadius, startAngle_1, endAngle_1, false);
    context.closePath();
    context.fill();
  }

  drawColorBall(ctx, radius, color) {
    var wrapper = ctx || this._renderContext;
    var context = wrapper.getContext();
    var subRadius = radius / 10;

    var g1 = context.createRadialGradient(0, 0, subRadius, 0, 0, radius);
    g1.addColorStop(0, cc.Color.toRgba(0 | color.r, 0 | color.g, 0 | color.b));
    g1.addColorStop(
      0.3,
      cc.Color.toRgba(0 | color.r, 0 | color.g, 0 | color.b, 200)
    );
    g1.addColorStop(
      0.6,
      cc.Color.toRgba(0 | color.r, 0 | color.g, 0 | color.b, 100)
    );
    g1.addColorStop(1.0, cc.Color.toRgba(0 | color.r, 0 | color.g, 0 | color.b, 0));
    wrapper.setFillStyle(g1);
    context.beginPath();
    var startAngle_1 = 0;
    var endAngle_1 = PI2;
    context.arc(0, 0, radius, startAngle_1, endAngle_1, false);
    context.closePath();
    context.fill();
  }

  fillText(strText, x, y) {
    this._renderContext.getContext().fillText(strText, x, -y);
  }

  setDrawColor(r, g, b, a) {
    this._renderContext.setFillStyle(Color.toRgba(r, g, b, a));
    this._renderContext.setStrokeStyle(Color.toRgba(r, g, b, a));
  }

  setPointSize(pointSize) {}

  setLineWidth(width) {
    this._renderContext.getContext().lineWidth = width;
  }
}
