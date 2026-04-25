export class DrawNodeElement {
  constructor(
    type,
    verts = null,
    fillColor = null,
    lineWidth = 0,
    lineColor = null,
    lineCap = "butt",
    isClosePolygon = false,
    isFill = false,
    isStroke = false
  ) {
    this.type = type;
    this.verts = verts;
    this.fillColor = fillColor;
    this.lineWidth = lineWidth;
    this.lineColor = lineColor;
    this.lineCap = lineCap;
    this.isClosePolygon = isClosePolygon;
    this.isFill = isFill;
    this.isStroke = isStroke;
  }
}
