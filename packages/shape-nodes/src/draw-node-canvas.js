import {
  Point,
  Rect,
  BlendFunc,
  SRC_ALPHA,
  ONE_MINUS_SRC_ALPHA,
  Color
} from "@aspect/core";
import { cardinalSplineAt, getControlPointAt } from "@aspect/actions";
import { DrawNodeElement } from "./draw-node-element";

export class DrawNodeCanvas {
  _initDrawNode() {
    this._className = "DrawNodeCanvas";
    var locCmd = this._renderCmd;
    locCmd._buffer = this._buffer = [];
    locCmd._drawColor = this._drawColor = new Color(255, 255, 255, 255);
    locCmd._blendFunc = this._blendFunc = new BlendFunc(
      SRC_ALPHA,
      ONE_MINUS_SRC_ALPHA
    );

    this.init();
    this._localBB = new Rect();
  }

  setLocalBB(rectorX, y, width, height) {
    var localBB = this._localBB;
    if (y === undefined) {
      localBB.x = rectorX.x;
      localBB.y = rectorX.y;
      localBB.width = rectorX.width;
      localBB.height = rectorX.height;
    } else {
      localBB.x = rectorX;
      localBB.y = y;
      localBB.width = width;
      localBB.height = height;
    }
  }

  /**
   * draws a rectangle given the origin and destination point measured in points.
   * @param {Point} origin
   * @param {Point} destination
   * @param {Color} fillColor
   * @param {Number} lineWidth
   * @param {Color} lineColor
   */
  drawRect(origin, destination, fillColor, lineWidth, lineColor) {
    lineWidth = lineWidth == null ? this._lineWidth : lineWidth;
    lineColor = lineColor || this.getDrawColor();
    if (lineColor.a == null) lineColor.a = 255;

    var vertices = [
      origin,
      new Point(destination.x, origin.y),
      destination,
      new Point(origin.x, destination.y)
    ];
    var element = new DrawNodeElement(2);
    element.verts = vertices;
    element.lineWidth = lineWidth;
    element.lineColor = lineColor;
    element.isClosePolygon = true;
    element.isStroke = true;
    element.lineCap = "butt";
    element.fillColor = fillColor;
    if (fillColor) {
      if (fillColor.a == null) fillColor.a = 255;
      element.isFill = true;
    }
    this._buffer.push(element);
  }

  /**
   * draws a circle given the center, radius and number of segments.
   * @override
   * @param {Point} center center of circle
   * @param {Number} radius
   * @param {Number} angle angle in radians
   * @param {Number} segments
   * @param {Boolean} drawLineToCenter
   * @param {Number} lineWidth
   * @param {Color} color
   */
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
    color = color || this.getDrawColor();
    if (color.a == null) color.a = 255;

    var coef = (2.0 * Math.PI) / segments;
    var vertices = [];
    for (var i = 0; i <= segments; i++) {
      var rads = i * coef;
      var j = radius * Math.cos(rads + angle) + center.x;
      var k = radius * Math.sin(rads + angle) + center.y;
      vertices.push(new Point(j, k));
    }
    if (drawLineToCenter) {
      vertices.push(new Point(center.x, center.y));
    }

    var element = new DrawNodeElement(2);
    element.verts = vertices;
    element.lineWidth = lineWidth;
    element.lineColor = color;
    element.isClosePolygon = true;
    element.isStroke = true;
    this._buffer.push(element);
  }

  /**
   * draws a quad bezier path
   * @override
   * @param {Point} origin
   * @param {Point} control
   * @param {Point} destination
   * @param {Number} segments
   * @param {Number} lineWidth
   * @param {Color} color
   */
  drawQuadBezier(origin, control, destination, segments, lineWidth, color) {
    lineWidth = lineWidth || this._lineWidth;
    color = color || this.getDrawColor();
    if (color.a == null) color.a = 255;

    var vertices = [],
      t = 0.0;
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

    var element = new DrawNodeElement(2);
    element.verts = vertices;
    element.lineWidth = lineWidth;
    element.lineColor = color;
    element.isStroke = true;
    element.lineCap = "round";
    this._buffer.push(element);
  }

  /**
   * draws a cubic bezier path
   * @override
   * @param {Point} origin
   * @param {Point} control1
   * @param {Point} control2
   * @param {Point} destination
   * @param {Number} segments
   * @param {Number} lineWidth
   * @param {Color} color
   */
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
    color = color || this.getDrawColor();
    if (color.a == null) color.a = 255;

    var vertices = [],
      t = 0;
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

    var element = new DrawNodeElement(2);
    element.verts = vertices;
    element.lineWidth = lineWidth;
    element.lineColor = color;
    element.isStroke = true;
    element.lineCap = "round";
    this._buffer.push(element);
  }

  /**
   * draw a CatmullRom curve
   * @override
   * @param {Array} points
   * @param {Number} segments
   * @param {Number} [lineWidth]
   * @param {Color} [color]
   */
  drawCatmullRom(points, segments, lineWidth, color) {
    this.drawCardinalSpline(points, 0.5, segments, lineWidth, color);
  }

  /**
   * draw a cardinal spline path
   * @override
   * @param {Array} config
   * @param {Number} tension
   * @param {Number} segments
   * @param {Number} [lineWidth]
   * @param {Color} [color]
   */
  drawCardinalSpline(config, tension, segments, lineWidth, color) {
    lineWidth = lineWidth || this._lineWidth;
    color = color || this.getDrawColor();
    if (color.a == null) color.a = 255;

    var vertices = [],
      p,
      lt,
      deltaT = 1.0 / config.length;
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
      var newPos = cardinalSplineAt(
        getControlPointAt(config, p - 1),
        getControlPointAt(config, p - 0),
        getControlPointAt(config, p + 1),
        getControlPointAt(config, p + 2),
        tension,
        lt
      );
      vertices.push(newPos);
    }

    var element = new DrawNodeElement(2);
    element.verts = vertices;
    element.lineWidth = lineWidth;
    element.lineColor = color;
    element.isStroke = true;
    element.lineCap = "round";
    this._buffer.push(element);
  }

  /**
   * draw a dot at a position, with a given radius and color
   * @param {Point} pos
   * @param {Number} radius
   * @param {Color} [color]
   */
  drawDot(pos, radius, color) {
    color = color || this.getDrawColor();
    if (color.a == null) color.a = 255;
    var element = new DrawNodeElement(0);
    element.verts = [pos];
    element.lineWidth = radius;
    element.fillColor = color;
    this._buffer.push(element);
  }

  /**
   * draws an array of points.
   * @override
   * @param {Array} points point of array
   * @param {Number} radius
   * @param {Color} [color]
   */
  drawDots(points, radius, color) {
    if (!points || points.length == 0) return;
    color = color || this.getDrawColor();
    if (color.a == null) color.a = 255;
    for (var i = 0, len = points.length; i < len; i++)
      this.drawDot(points[i], radius, color);
  }

  /**
   * draw a segment with a radius and color
   * @param {Point} from
   * @param {Point} to
   * @param {Number} [lineWidth]
   * @param {Color} [color]
   */
  drawSegment(from, to, lineWidth, color) {
    lineWidth = lineWidth || this._lineWidth;
    color = color || this.getDrawColor();
    if (color.a == null) color.a = 255;
    var element = new DrawNodeElement(2);
    element.verts = [from, to];
    element.lineWidth = lineWidth * 2;
    element.lineColor = color;
    element.isStroke = true;
    element.lineCap = "round";
    this._buffer.push(element);
  }

  /**
   * draw a polygon with a fill color and line color without copying the vertex list
   * @param {Array} verts
   * @param {Color|null} fillColor Fill color or `null` for a hollow polygon.
   * @param {Number} [lineWidth]
   * @param {Color} [color]
   */
  drawPoly_(verts, fillColor, lineWidth, color) {
    lineWidth = lineWidth == null ? this._lineWidth : lineWidth;
    color = color || this.getDrawColor();
    if (color.a == null) color.a = 255;
    var element = new DrawNodeElement(2);

    element.verts = verts;
    element.fillColor = fillColor;
    element.lineWidth = lineWidth;
    element.lineColor = color;
    element.isClosePolygon = true;
    element.isStroke = true;
    element.lineCap = "round";
    if (fillColor) element.isFill = true;
    this._buffer.push(element);
  }

  /**
   * draw a polygon with a fill color and line color, copying the vertex list
   * @param {Array} verts
   * @param {Color|null} fillColor Fill color or `null` for a hollow polygon.
   * @param {Number} [lineWidth]
   * @param {Color} [lineColor]
   */
  drawPoly(verts, fillColor, lineWidth, lineColor) {
    var vertsCopy = [];
    for (var i = 0; i < verts.length; i++) {
      vertsCopy.push(new Point(verts[i].x, verts[i].y));
    }
    return this.drawPoly_(vertsCopy, fillColor, lineWidth, lineColor);
  }

  /**
   * Clear the geometry in the node's buffer.
   */
  clear() {
    this._buffer.length = 0;
  }

  _createRenderCmd() {
    return new this.constructor.CanvasRenderCmd(this);
  }
}
