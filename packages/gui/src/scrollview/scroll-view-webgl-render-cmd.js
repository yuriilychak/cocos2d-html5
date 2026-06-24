import { Layer, CustomRenderCmd, Rect, ServiceLocator } from "@aspect/core";

export class GuiScrollViewWebGLRenderCmd extends Layer.WebGLRenderCmd {
  constructor(renderable) {
    super(renderable);
    this._needDraw = false;

    this.startCmd = new CustomRenderCmd(this, this._startCmd);
    this.endCmd = new CustomRenderCmd(this, this._endCmd);
  }

  _startCmd() {
    var node = this._node;
    var eglView = ServiceLocator.eglView;
    var frame = node._getViewRect();
    if (eglView.isScissorEnabled()) {
      node._scissorRestored = true;
      node._parentScissorRect = eglView.getScissorRect();
      if (Rect.intersection(frame, node._parentScissorRect)) {
        var locPSRect = node._parentScissorRect;
        var x = Math.max(frame.x, locPSRect.x);
        var y = Math.max(frame.y, locPSRect.y);
        var xx = Math.min(frame.x + frame.width, locPSRect.x + locPSRect.width);
        var yy = Math.min(
          frame.y + frame.height,
          locPSRect.y + locPSRect.height
        );
        eglView.setScissorInPoints(x, y, xx - x, yy - y);
      }
    } else {
      var ctx = ServiceLocator.sys.rendererConfig.renderContext;
      ctx.enable(ctx.SCISSOR_TEST);
      eglView.setScissorInPoints(frame.x, frame.y, frame.width, frame.height);
    }
  }

  _endCmd() {
    var node = this._node;
    if (node._scissorRestored) {
      var rect = node._parentScissorRect;
      ServiceLocator.eglView.setScissorInPoints(
        rect.x,
        rect.y,
        rect.width,
        rect.height
      );
    } else {
      var ctx = ServiceLocator.sys.rendererConfig.renderContext;
      ctx.disable(ctx.SCISSOR_TEST);
    }
  }
}
