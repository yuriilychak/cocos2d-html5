import { NodeCanvasRenderCmd, CustomRenderCmd, RendererConfig, Node } from "@aspect/core";
import { DrawNode } from "@aspect/shape-nodes";

export class ClippingNodeCanvasRenderCmd extends NodeCanvasRenderCmd {
  constructor(renderable) {
    super(renderable);
    this._needDraw = false;

    this._godhelpme = false;
    this._clipElemType = false;

    this._rendererSaveCmd = new CustomRenderCmd(this, this._saveCmdCallback);
    this._rendererClipCmd = new CustomRenderCmd(this, this._clipCmdCallback);
    this._rendererRestoreCmd = new CustomRenderCmd(this, this._restoreCmdCallback);
  }

  resetProgramByStencil() {}

  initStencilBits() {}

  setStencil(stencil) {
    if (stencil == null) return;

    this._node._stencil = stencil;

    if (stencil instanceof DrawNode) {
      if (stencil._buffer) {
        for (let i = 0; i < stencil._buffer.length; i++) {
          stencil._buffer[i].isFill = false;
          stencil._buffer[i].isStroke = false;
        }
      }

      stencil._renderCmd.rendering = function (ctx, scaleX, scaleY) {
        return;
      };

      stencil._renderCmd._canUseDirtyRegion = true;
      this._rendererSaveCmd._canUseDirtyRegion = true;
      this._rendererClipCmd._canUseDirtyRegion = true;
      this._rendererRestoreCmd._canUseDirtyRegion = true;
    } else {
      stencil._parent = this._node;
    }
  }

  _saveCmdCallback(ctx, scaleX, scaleY) {
    const wrapper = ctx || RendererConfig.getInstance().renderContext, context = wrapper.getContext();

    if (this._clipElemType) {
      const locCache = ClippingNodeCanvasRenderCmd._getSharedCache();
      const canvas = context.canvas;
      locCache.width = canvas.width;
      locCache.height = canvas.height;
      const locCacheCtx = locCache.getContext("2d");
      locCacheCtx.drawImage(canvas, 0, 0);
    } else {
      wrapper.save();
      wrapper.setTransform(this._worldTransform, scaleX, scaleY);

      if (this._node.inverted) {
        context.beginPath();
        context.rect(0, 0, context.canvas.width, -context.canvas.height);
        context.clip();
      }
    }
  }

  _setStencilCompositionOperation(stencil) {
    if (!stencil) return;
    const node = this._node;
    if (stencil._renderCmd && stencil._renderCmd._blendFuncStr)
      stencil._renderCmd._blendFuncStr = (node.inverted ? "destination-out" : "destination-in");

    if (!stencil._children) return;
    const children = stencil._children;
    for (let i = 0, len = children.length; i < len; i++) {
      this._setStencilCompositionOperation(children[i]);
    }
  }

  _clipCmdCallback(ctx) {
    const node = this._node;
    const wrapper = ctx || RendererConfig.getInstance().renderContext, context = wrapper.getContext();

    if (this._clipElemType) {
      this._setStencilCompositionOperation(node._stencil);
    } else {
      const stencil = this._node._stencil;
      if (stencil instanceof DrawNode) {
        context.beginPath();
        const t = stencil._renderCmd._transform;
        context.transform(t.a, t.b, t.c, t.d, t.tx, -t.ty);
        for (let i = 0; i < stencil._buffer.length; i++) {
          const vertices = stencil._buffer[i].verts;
          const firstPoint = vertices[0];
          context.moveTo(firstPoint.x, -firstPoint.y);
          for (let j = vertices.length - 1; j > 0; j--)
            context.lineTo(vertices[j].x, -vertices[j].y);
        }
      }
      context.clip();
    }
  }

  _restoreCmdCallback(ctx) {
    const locCache = ClippingNodeCanvasRenderCmd._getSharedCache();
    const wrapper = ctx || RendererConfig.getInstance().renderContext, context = wrapper.getContext();
    if (this._clipElemType) {
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.globalCompositeOperation = "destination-over";
      context.drawImage(locCache, 0, 0);
      context.restore();
      this._dirtyFlag = 0;
    } else {
      wrapper.restore();
    }
  }

  transform(parentCmd, recursive) {
    this.originTransform(parentCmd, recursive);
    const node = this._node;
    if (node._stencil && node._stencil._renderCmd) {
      node._stencil._renderCmd.transform(this, true);
      node._stencil._dirtyFlag &= ~Node._dirtyFlags.transformDirty;
    }
  }

  _cangodhelpme(godhelpme) {
    if (godhelpme === true || godhelpme === false)
      ClippingNodeCanvasRenderCmd.prototype._godhelpme = godhelpme;
    return ClippingNodeCanvasRenderCmd.prototype._godhelpme;
  }

  clippingVisit(parentCmd) {
    const node = this._node;
    parentCmd = parentCmd || this.getParentRenderCmd();
    this.visit(parentCmd);

    this._clipElemType = !(!this._cangodhelpme() && node._stencil instanceof DrawNode);
    if (!node._stencil || !node._stencil.visible) {
      if (this.inverted)
        node._visitChildren();
      return;
    }

    RendererConfig.getInstance().renderer.pushRenderCommand(this._rendererSaveCmd);
    if (this._clipElemType) {
      node._visitChildren();
    } else {
      node._stencil.visit(node);
    }
    RendererConfig.getInstance().renderer.pushRenderCommand(this._rendererClipCmd);

    if (this._clipElemType) {
      node._stencil.visit(node);
    } else {
      this._cangodhelpme(true);
      const children = node._children;
      let i;
      const len = children.length;
      if (len > 0) {
        node.sortAllChildren();
        for (i = 0; i < len; i++)
          children[i].visit(node);
      }
      this._cangodhelpme(false);
    }

    RendererConfig.getInstance().renderer.pushRenderCommand(this._rendererRestoreCmd);
    this._dirtyFlag = 0;
  }
}

ClippingNodeCanvasRenderCmd._sharedCache = null;
ClippingNodeCanvasRenderCmd._getSharedCache = function () {
  return ClippingNodeCanvasRenderCmd._sharedCache || (ClippingNodeCanvasRenderCmd._sharedCache = document.createElement("canvas"));
};
