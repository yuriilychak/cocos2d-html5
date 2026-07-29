import { ServiceLocator } from "@aspect/core";
import { ProtectedNodeCanvasRenderCmd } from "./protected-node-canvas-render-cmd.js";
import { ProtectedNodeWebGLRenderCmd } from "./protected-node-webgl-render-cmd.js";

export class WidgetCanvasRenderCmd extends ProtectedNodeCanvasRenderCmd {
  constructor(renderable) {
    super(renderable);
    this._needDraw = false;
  }

  visit(parentCmd) {
    var node = this._node,
      renderer = ServiceLocator.sys.rendererConfig.renderer;

    parentCmd = parentCmd || this.getParentRenderCmd();
    if (parentCmd) this._curLevel = parentCmd._curLevel + 1;

    if (!node.hasCustomVertexZ) {
      node.assignedVertexZ = renderer.assignedZ;
      renderer.assignedZ += renderer.assignedZStep;
    }

    node._adaptRenderers();
    this._syncStatus(parentCmd);
  }

  transform(parentCmd, recursive) {
    if (!this._transform) {
      this._transform = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
      this._worldTransform = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
    }

    var node = this._node;
    if (node.visible && node.running) {
      node._adaptRenderers();
      if (!this._usingLayoutComponent) {
        var widgetParent = node.widgetParent;
        if (widgetParent) {
          var parentSize = widgetParent.contentSize;
          if (parentSize.width !== 0 && parentSize.height !== 0) {
            node.x = parentSize.width * node._positionPercent.x;
            node.y = parentSize.height * node._positionPercent.y;
          }
        }
      }
      super.transform(parentCmd, recursive);
    }
  }
}

WidgetCanvasRenderCmd.prototype.widgetTransform =
  WidgetCanvasRenderCmd.prototype.transform;

export class WidgetWebGLRenderCmd extends ProtectedNodeWebGLRenderCmd {
  constructor(renderable) {
    super(renderable);
    this._needDraw = false;
  }

  visit(parentCmd) {
    var node = this._node,
      renderer = ServiceLocator.sys.rendererConfig.renderer;

    parentCmd = parentCmd || this.getParentRenderCmd();
    if (parentCmd) this._curLevel = parentCmd._curLevel + 1;

    if (!node.hasCustomVertexZ) {
      node.assignedVertexZ = renderer.assignedZ;
      renderer.assignedZ += renderer.assignedZStep;
    }

    node._adaptRenderers();
    this._syncStatus(parentCmd);
  }

  transform(parentCmd, recursive) {
    if (!this._transform) {
      this._transform = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
      this._worldTransform = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
    }

    var node = this._node;
    if (node.visible && node.running) {
      node._adaptRenderers();

      if (!this._usingLayoutComponent) {
        var widgetParent = node.widgetParent;
        if (widgetParent) {
          if (widgetParent.width !== 0 && widgetParent.height !== 0) {
            node.x = widgetParent.width * node._positionPercent.x;
            node.y = widgetParent.height * node._positionPercent.y;
          }
        }
      }
      super.transform(parentCmd, recursive);
    }
  }
}

WidgetWebGLRenderCmd.prototype.widgetTransform =
  WidgetWebGLRenderCmd.prototype.transform;
