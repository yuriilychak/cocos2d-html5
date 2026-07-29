import { ServiceLocator } from "@aspect/core";
import { LayoutWebGLRenderCmd } from "../../layouts/layout-webgl-render-cmd";

export class ScrollViewWebGLRenderCmd extends LayoutWebGLRenderCmd {
  constructor(renderable) {
    super(renderable);
    this._needDraw = true;
    this._dirty = false;
  }

  rendering(ctx) {
    var renderer = ServiceLocator.sys.rendererConfig.renderer;
    var currentID = this._node.__instanceId,
      locCmds = renderer.getBufferCmd(currentID) || [],
      i,
      len,
      checkNode,
      cmd,
      context = ctx || ServiceLocator.sys.rendererConfig.renderContext;
    if (!locCmds) {
      return;
    }

    this._node.updateChildren();

    context.bindBuffer(context.ARRAY_BUFFER, null);

    for (i = 0, len = locCmds.length; i < len; i++) {
      cmd = locCmds[i];
      checkNode = cmd._node;
      if (
        checkNode &&
        checkNode.parent &&
        checkNode.parent._inViewRect === false
      )
        continue;

      if (cmd.uploadData) {
        renderer.uploadBufferData(cmd);
      } else {
        renderer.batchRendering();
        cmd.rendering(context);
      }
    }
    renderer.batchRendering();
  }
}
