import { Node, color, RendererConfig } from "@aspect/core";
import { DrawNodeCanvas } from "./draw-node-canvas";
import { DrawNodeWebGL } from "./draw-node-webgl";

/**
 * <p>DrawNode                                                <br/>
 * Node that draws dots, segments and polygons.                        <br/>
 * Faster than the "drawing primitives" since it draws everything in one single batch.</p>
 */
export class DrawNode extends Node {
  static TYPE_DOT = 0;
  static TYPE_SEGMENT = 1;
  static TYPE_POLY = 2;

  _buffer = null;
  _blendFunc = null;
  _lineWidth = 1;
  _drawColor = null;

  constructor() {
    super();
    this._drawColor = color(255, 255, 255, 255);
    this._initDrawNode.apply(this, arguments);
  }

  _initDrawNode() {
    const Renderer = RendererConfig.getInstance().isCanvas
      ? DrawNodeCanvas
      : DrawNodeWebGL;
    const proto = Renderer.prototype;
    Object.getOwnPropertyNames(proto).forEach((name) => {
      if (name !== "constructor") DrawNode.prototype[name] = proto[name];
    });
    // The Node constructor already called _createRenderCmd() before this mixin
    // was installed, so the first instance got a wrong render cmd. Recreate it
    // now that _createRenderCmd is properly set from the mixin.
    this._renderCmd = this._createRenderCmd();
    // DrawNode.prototype._initDrawNode is now the renderer's version;
    // call it explicitly so this first instance is also fully initialized.
    Renderer.prototype._initDrawNode.apply(this, arguments);
  }

  /**
   * Gets the blend func
   * @returns {Object}
   */
  getBlendFunc() {
    return this._blendFunc;
  }

  /**
   * Set the blend func
   * @param blendFunc
   * @param dst
   */
  setBlendFunc(blendFunc, dst) {
    if (dst === undefined) {
      this._blendFunc.src = blendFunc.src;
      this._blendFunc.dst = blendFunc.dst;
    } else {
      this._blendFunc.src = blendFunc;
      this._blendFunc.dst = dst;
    }
  }

  /**
   * line width setter
   * @param {Number} width
   */
  setLineWidth(width) {
    this._lineWidth = width;
  }

  /**
   * line width getter
   * @returns {Number}
   */
  getLineWidth() {
    return this._lineWidth;
  }

  /**
   * draw color setter
   * @param {Color} color
   */
  setDrawColor(color) {
    var locDrawColor = this._drawColor;
    locDrawColor.r = color.r;
    locDrawColor.g = color.g;
    locDrawColor.b = color.b;
    locDrawColor.a = color.a == null ? 255 : color.a;
  }

  /**
   * draw color getter
   * @returns {Color}
   */
  getDrawColor() {
    return color(
      this._drawColor.r,
      this._drawColor.g,
      this._drawColor.b,
      this._drawColor.a
    );
  }
}
