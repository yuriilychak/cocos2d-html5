import { NodeWebGLRenderCmd, Matrix4, glBlendFunc } from "@aspect/core";

export class DrawNodeWebGLRenderCmd extends NodeWebGLRenderCmd {
  constructor(renderableObject) {
    super(renderableObject);
    this._needDraw = true;
    this._matrix = new Matrix4();
    this._matrix.identity();
  }

  rendering(ctx) {
    const node = this._node;
    if (node._vertexCount > 0) {
      const wt = this._worldTransform;
      this._matrix.mat[0] = wt.a;
      this._matrix.mat[4] = wt.c;
      this._matrix.mat[12] = wt.tx;
      this._matrix.mat[1] = wt.b;
      this._matrix.mat[5] = wt.d;
      this._matrix.mat[13] = wt.ty;

      glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
      this._glProgramState.apply(this._matrix);
      node._render();
    }
  }
}
