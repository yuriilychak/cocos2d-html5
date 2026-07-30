import { Node, NodeStateCallbackType, ServiceLocator } from "@aspect/core";

export class ClippingNode extends Node {
  static stencilBits = -1;

  inverted = false;
  _alphaThreshold = 0;

  _stencil = null;

  _originStencilProgram = null;

  constructor(stencil) {
    stencil = stencil || null;
    super();
    this._stencil = stencil;
    if (stencil) {
      this._originStencilProgram = stencil.shaderProgram;
    }
    this.alphaThreshold = 1;
    this.inverted = false;
    this.renderCmd.initStencilBits();
  }

  get stencil() {
    return this.getStencil();
  }
  set stencil(v) {
    this.setStencil(v);
  }
  get alphaThreshold() {
    return this.getAlphaThreshold();
  }
  set alphaThreshold(v) {
    this.setAlphaThreshold(v);
  }

  onEnter() {
    super.onEnter();
    if (this._stencil)
      this._stencil._performRecursive(NodeStateCallbackType.onEnter);
  }

  onEnterTransitionDidFinish() {
    super.onEnterTransitionDidFinish();
    if (this._stencil)
      this._stencil._performRecursive(
        NodeStateCallbackType.onEnterTransitionDidFinish
      );
  }

  onExitTransitionDidStart() {
    this._stencil._performRecursive(
      NodeStateCallbackType.onExitTransitionDidStart
    );
    super.onExitTransitionDidStart();
  }

  onExit() {
    this._stencil._performRecursive(NodeStateCallbackType.onExit);
    super.onExit();
  }

  visit(parent) {
    this.renderCmd.clippingVisit(parent && parent.renderCmd);
  }

  _visitChildren() {
    const renderer = ServiceLocator.sys.rendererConfig.renderer;
    if (this.order.reorderChildDirty) {
      this.order.sortAllChildren();
    }
    const children = this.children;
    for (let i = 0, len = children.length; i < len; i++) {
      const child = children[i];
      if (child && child.visible) {
        child.visit(this);
      }
    }
    this.renderCmd._dirtyFlag = 0;
  }

  getAlphaThreshold() {
    return this._alphaThreshold;
  }

  setAlphaThreshold(alphaThreshold) {
    if (alphaThreshold === 1 && alphaThreshold !== this._alphaThreshold) {
      this.renderCmd.resetProgramByStencil();
    }
    this._alphaThreshold = alphaThreshold;
  }

  isInverted() {
    return this.inverted;
  }

  setInverted(inverted) {
    this.inverted = inverted;
  }

  getStencil() {
    return this._stencil;
  }

  setStencil(stencil) {
    if (this._stencil === stencil) return;
    if (stencil) this._originStencilProgram = stencil.shaderProgram;
    this.renderCmd.setStencil(stencil);
  }

  createRenderCmd() {
    if (ServiceLocator.sys.rendererConfig.isCanvas)
      return new this.constructor.CanvasRenderCmd(this);
    else return new this.constructor.WebGLRenderCmd(this);
  }
}
