import { Node, RendererConfig } from "@aspect/core";

export class NodeGrid extends Node {
  grid = null;
  _target = null;
  _gridRect = null;

  constructor(rect) {
    super();
    if (rect === undefined) rect = new cc.Rect();
    this._gridRect = rect;
  }

  set target(v) { this.setTarget(v); }

  getGrid() {
    return this.grid;
  }

  setGrid(grid) {
    this.grid = grid;
  }

  setGridRect(rect) {
    this._gridRect = rect;
  }

  getGridRect() {
    return this._gridRect;
  }

  setTarget(target) {
    this._target = target;
  }

  visit(parent) {
    var cmd = this._renderCmd;
    var parentCmd = parent ? parent._renderCmd : null;
    if (!this._visible) {
      cmd._propagateFlagsDown(parentCmd);
      return;
    }
    cmd.visit(parentCmd);
    cmd._dirtyFlag = 0;
  }

  _createRenderCmd() {
    if (RendererConfig.getInstance().isWebGL)
      return new this.constructor.WebGLRenderCmd(this);
    else
      return new Node.CanvasRenderCmd(this);
  }
}
