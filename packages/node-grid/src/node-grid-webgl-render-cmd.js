import { Node, RendererConfig, CustomRenderCmd } from "@aspect/core";

export class NodeGridWebGLRenderCmd extends Node.WebGLRenderCmd {
  constructor(renderable) {
    super(renderable);
    this._needDraw = false;
    this._gridBeginCommand = new CustomRenderCmd(this, this.onGridBeginDraw);
    this._gridEndCommand = new CustomRenderCmd(this, this.onGridEndDraw);
  }

  visit(parentCmd) {
    const node = this._node;
    if (!node._visible)
      return;

    parentCmd = parentCmd || this.getParentRenderCmd();
    if (parentCmd)
      this._curLevel = parentCmd._curLevel + 1;

    const currentStack = cc.current_stack;
    currentStack.stack.push(currentStack.top);
    this._syncStatus(parentCmd);
    currentStack.top = this._stackMatrix;

    RendererConfig.getInstance().renderer.pushRenderCommand(this._gridBeginCommand);

    if (node._target)
      node._target.visit();

    const locChildren = node._children;
    if (locChildren && locChildren.length > 0) {
      const childLen = locChildren.length;
      node.sortAllChildren();
      for (let i = 0; i < childLen; i++) {
        const child = locChildren[i];
        child && child.visit();
      }
    }

    RendererConfig.getInstance().renderer.pushRenderCommand(this._gridEndCommand);

    this._dirtyFlag = 0;
    currentStack.top = currentStack.stack.pop();
  }

  onGridBeginDraw() {
    const locGrid = this._node.grid;
    if (locGrid && locGrid._active)
      locGrid.beforeDraw();
  }

  onGridEndDraw() {
    const locGrid = this._node.grid;
    if (locGrid && locGrid._active)
      locGrid.afterDraw(this._node);
  }
}
