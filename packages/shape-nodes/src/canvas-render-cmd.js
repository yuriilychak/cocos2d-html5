import {
  NodeCanvasRenderCmd,
  RendererConfig,
  SRC_ALPHA,
  ONE,
  Color
} from "@aspect/core";
import { DrawNode } from "./draw-node";

export class DrawNodeCanvasRenderCmd extends NodeCanvasRenderCmd {
  constructor(renderableObject) {
    super(renderableObject);
    this._needDraw = true;
    this._buffer = null;
    this._drawColor = null;
    this._blendFunc = null;
  }

  getLocalBB() {
    const node = this._node;
    return node._localBB;
  }

  rendering(ctx, scaleX, scaleY) {
    const wrapper = ctx || RendererConfig.getInstance().renderContext,
      context = wrapper.getContext(),
      node = this._node;
    const alpha = this._displayedOpacity / 255;
    if (alpha === 0) return;

    wrapper.setTransform(this._worldTransform, scaleX, scaleY);

    wrapper.setGlobalAlpha(alpha);
    if (
      this._blendFunc &&
      this._blendFunc.src === SRC_ALPHA &&
      this._blendFunc.dst === ONE
    )
      wrapper.setCompositeOperation("lighter");
    const locBuffer = this._buffer;
    for (let i = 0, len = locBuffer.length; i < len; i++) {
      const element = locBuffer[i];
      switch (element.type) {
        case DrawNode.TYPE_DOT:
          this._drawDot(wrapper, element, scaleX, scaleY);
          break;
        case DrawNode.TYPE_SEGMENT:
          this._drawSegment(wrapper, element, scaleX, scaleY);
          break;
        case DrawNode.TYPE_POLY:
          this._drawPoly(wrapper, element, scaleX, scaleY);
          break;
      }
    }
  }

  _drawDot(wrapper, element) {
    const locColor = element.fillColor,
      locPos = element.verts[0],
      locRadius = element.lineWidth;

    const ctx = wrapper.getContext();
    wrapper.setFillStyle(Color.toRgba(locColor));

    ctx.beginPath();
    ctx.arc(locPos.x, -locPos.y, locRadius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  }

  _drawSegment(wrapper, element, scaleX) {
    const locColor = element.lineColor;
    const locFrom = element.verts[0],
      locTo = element.verts[1];
    const locLineWidth = element.lineWidth,
      locLineCap = element.lineCap;

    const ctx = wrapper.getContext();
    wrapper.setStrokeStyle(Color.toRgba(locColor));

    ctx.lineWidth = locLineWidth * scaleX;
    ctx.beginPath();
    ctx.lineCap = locLineCap;
    ctx.moveTo(locFrom.x, -locFrom.y);
    ctx.lineTo(locTo.x, -locTo.y);
    ctx.stroke();
  }

  _drawPoly(wrapper, element, scaleX) {
    const locVertices = element.verts,
      locLineCap = element.lineCap;
    if (locVertices == null) return;

    const locFillColor = element.fillColor,
      locLineWidth = element.lineWidth;
    const locLineColor = element.lineColor,
      locIsClosePolygon = element.isClosePolygon;
    const locIsFill = element.isFill,
      locIsStroke = element.isStroke;

    const ctx = wrapper.getContext();
    const firstPoint = locVertices[0];
    ctx.lineCap = locLineCap;
    if (locFillColor) wrapper.setFillStyle(Color.toRgba(locFillColor));
    if (locLineWidth) ctx.lineWidth = locLineWidth * scaleX;
    if (locLineColor) wrapper.setStrokeStyle(Color.toRgba(locLineColor));

    ctx.beginPath();
    ctx.moveTo(firstPoint.x, -firstPoint.y);
    for (let i = 1, len = locVertices.length; i < len; i++)
      ctx.lineTo(locVertices[i].x, -locVertices[i].y);

    if (locIsClosePolygon) ctx.closePath();
    if (locIsFill) ctx.fill();
    if (locIsStroke) ctx.stroke();
  }
}
