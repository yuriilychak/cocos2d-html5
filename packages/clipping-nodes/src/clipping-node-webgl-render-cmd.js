import {
  NodeWebGLRenderCmd,
  CustomRenderCmd,
  RendererConfig,
  Node,
  ShaderCache,
  glUseProgram,
  setProgramForNode,
  SHADER_POSITION_TEXTURECOLORALPHATEST,
  UNIFORM_ALPHA_TEST_VALUE_S,
  UNIFORM_MVMATRIX_S,
  log,
} from "@aspect/core";
import { ClippingNode } from "./clipping-node";

function setProgram(node, program) {
  node.shaderProgram = program;
  const children = node.children;
  if (!children) return;
  for (let i = 0; i < children.length; i++)
    setProgram(children[i], program);
}

export class ClippingNodeWebGLRenderCmd extends NodeWebGLRenderCmd {
  constructor(renderable) {
    super(renderable);
    this._needDraw = false;

    this._beforeVisitCmd = new CustomRenderCmd(this, this._onBeforeVisit);
    this._afterDrawStencilCmd = new CustomRenderCmd(this, this._onAfterDrawStencil);
    this._afterVisitCmd = new CustomRenderCmd(this, this._onAfterVisit);

    this._currentStencilEnabled = null;
    this._mask_layer_le = null;
  }

  initStencilBits() {
    ClippingNodeWebGLRenderCmd._init_once = true;
    if (ClippingNodeWebGLRenderCmd._init_once) {
        const bits = RendererConfig.getInstance().renderContext.getParameter(RendererConfig.getInstance().renderContext.STENCIL_BITS);
      ClippingNode.stencilBits = bits;
      if (bits <= 0)
        log("Stencil buffer is not enabled.");
      ClippingNodeWebGLRenderCmd._init_once = false;
    }
  }

  transform(parentCmd, recursive) {
    const node = this._node;
    this.originTransform(parentCmd, recursive);
    if (node._stencil) {
      node._stencil._renderCmd.transform(this, true);
      node._stencil._dirtyFlag &= ~Node._dirtyFlags.transformDirty;
    }
  }

  clippingVisit(parentCmd) {
    const node = this._node;
    parentCmd = parentCmd || this.getParentRenderCmd();
    this.visit(parentCmd);

    if (ClippingNode.stencilBits < 1) {
      node._visitChildren();
      return;
    }

    if (!node._stencil || !node._stencil.visible) {
      if (node.inverted)
        node._visitChildren();
      return;
    }

    if (ClippingNodeWebGLRenderCmd._layer + 1 === ClippingNode.stencilBits) {
      ClippingNodeWebGLRenderCmd._visit_once = true;
      if (ClippingNodeWebGLRenderCmd._visit_once) {
        log("Nesting more than " + ClippingNode.stencilBits + "stencils is not supported. Everything will be drawn without stencil for this node and its children.");
        ClippingNodeWebGLRenderCmd._visit_once = false;
      }
      node._visitChildren();
      return;
    }

      RendererConfig.getInstance().renderer.pushRenderCommand(this._beforeVisitCmd);
      node._stencil.visit(node);
      RendererConfig.getInstance().renderer.pushRenderCommand(this._afterDrawStencilCmd);

    const locChildren = node._children;
    if (locChildren && locChildren.length > 0) {
      const childLen = locChildren.length;
      node.sortAllChildren();
      for (let i = 0; i < childLen; i++) {
        locChildren[i].visit(node);
      }
    }

      RendererConfig.getInstance().renderer.pushRenderCommand(this._afterVisitCmd);
    this._dirtyFlag = 0;
  }

  setStencil(stencil) {
    const node = this._node;
    if (node._stencil)
      node._stencil._parent = null;
    node._stencil = stencil;
    if (node._stencil)
      node._stencil._parent = node;
  }

  resetProgramByStencil() {
    const node = this._node;
    if (node._stencil) {
      const program = node._originStencilProgram;
      setProgram(node._stencil, program);
    }
  }

  _onBeforeVisit(ctx) {
      const gl = ctx || RendererConfig.getInstance().renderContext, node = this._node;
      ClippingNodeWebGLRenderCmd._layer++;

      const mask_layer = 0x1 << ClippingNodeWebGLRenderCmd._layer;
    const mask_layer_l = mask_layer - 1;
    this._mask_layer_le = mask_layer | mask_layer_l;
    this._currentStencilEnabled = gl.isEnabled(gl.STENCIL_TEST);

    gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.STENCIL_TEST);
    gl.depthMask(false);
    gl.stencilFunc(gl.NEVER, mask_layer, mask_layer);
    gl.stencilOp(gl.REPLACE, gl.KEEP, gl.KEEP);
    gl.stencilMask(mask_layer);
    gl.clear(gl.STENCIL_BUFFER_BIT);

    if (node.alphaThreshold < 1) {
      const program = ShaderCache.getInstance().programForKey(SHADER_POSITION_TEXTURECOLORALPHATEST);
      glUseProgram(program.getProgram());
      program.setUniformLocationWith1f(UNIFORM_ALPHA_TEST_VALUE_S, node.alphaThreshold);
        program.setUniformLocationWithMatrix4fv(UNIFORM_MVMATRIX_S, RendererConfig.getInstance().renderer.mat4Identity.mat);
      setProgramForNode(node._stencil, program);
    }
  }

  _onAfterDrawStencil(ctx) {
    const gl = ctx || RendererConfig.getInstance().renderContext;
    gl.depthMask(true);
    gl.stencilFunc(!this._node.inverted ? gl.EQUAL : gl.NOTEQUAL, this._mask_layer_le, this._mask_layer_le);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
  }

  _onAfterVisit(ctx) {
      const gl = ctx || RendererConfig.getInstance().renderContext;
      ClippingNodeWebGLRenderCmd._layer--;

      if (this._currentStencilEnabled) {
        const mask_layer = 0x1 << ClippingNodeWebGLRenderCmd._layer;
      const mask_layer_l = mask_layer - 1;
      const mask_layer_le = mask_layer | mask_layer_l;
      gl.stencilMask(mask_layer);
      gl.stencilFunc(gl.EQUAL, mask_layer_le, mask_layer_le);
    } else {
      gl.disable(gl.STENCIL_TEST);
    }
  }
}

ClippingNodeWebGLRenderCmd._init_once = null;
ClippingNodeWebGLRenderCmd._visit_once = null;
ClippingNodeWebGLRenderCmd._layer = -1;
