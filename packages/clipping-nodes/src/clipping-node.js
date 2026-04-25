import { Node, RendererConfig } from "@aspect/core";

export class ClippingNode extends Node {
  static stencilBits = -1;

  inverted = false;
  _alphaThreshold = 0;

  _stencil = null;
  _className = "ClippingNode";

  _originStencilProgram = null;

  constructor(stencil) {
    stencil = stencil || null;
    super();
    this._stencil = stencil;
    if (stencil) {
      this._originStencilProgram = stencil.getShaderProgram();
    }
    this.alphaThreshold = 1;
    this.inverted = false;
    this._renderCmd.initStencilBits();
  }

  get stencil() { return this.getStencil(); }
  set stencil(v) { this.setStencil(v); }
  get alphaThreshold() { return this.getAlphaThreshold(); }
  set alphaThreshold(v) { this.setAlphaThreshold(v); }

  onEnter() {
    super.onEnter();
    if (this._stencil)
      this._stencil._performRecursive(Node._stateCallbackType.onEnter);
  }

  onEnterTransitionDidFinish() {
    super.onEnterTransitionDidFinish();
    if (this._stencil)
      this._stencil._performRecursive(
        Node._stateCallbackType.onEnterTransitionDidFinish
      );
  }

  onExitTransitionDidStart() {
    this._stencil._performRecursive(
      Node._stateCallbackType.onExitTransitionDidStart
    );
    super.onExitTransitionDidStart();
  }

  onExit() {
    this._stencil._performRecursive(Node._stateCallbackType.onExit);
    super.onExit();
  }

  visit(parent) {
    this._renderCmd.clippingVisit(parent && parent._renderCmd);
  }

  _visitChildren() {
    const renderer = RendererConfig.getInstance().renderer;
    if (this._reorderChildDirty) {
      this.sortAllChildren();
    }
    const children = this._children;
    for (let i = 0, len = children.length; i < len; i++) {
      const child = children[i];
      if (child && child._visible) {
        child.visit(this);
      }
    }
    this._renderCmd._dirtyFlag = 0;
  }

  getAlphaThreshold() {
    return this._alphaThreshold;
  }

  setAlphaThreshold(alphaThreshold) {
    if (alphaThreshold === 1 && alphaThreshold !== this._alphaThreshold) {
      this._renderCmd.resetProgramByStencil();
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
    if (stencil) this._originStencilProgram = stencil.getShaderProgram();
    this._renderCmd.setStencil(stencil);
  }

  _createRenderCmd() {
    if (RendererConfig.getInstance().isCanvas)
      return new this.constructor.CanvasRenderCmd(this);
    else return new this.constructor.WebGLRenderCmd(this);
  }
}
