import {
  Node,
  glBlendFunc,
  glBindTexture2D,
  Matrix4,
  ServiceLocator,
  ShaderName,
  VertexAttribute
} from "@aspect/core";

export class MotionStreakWebGLRenderCmd extends Node.WebGLRenderCmd {
  constructor(renderableObject) {
    super(renderableObject);
    this._needDraw = true;
    this._matrix = new Matrix4();
    this._matrix.identity();
    this._shaderProgram = ServiceLocator.shaderCache.programForKey(
      ShaderName.POSITION_TEXTURECOLOR
    );
  }

  rendering(ctx) {
    const node = this._node;
    if (node._nuPoints <= 1) return;

    if (node.texture && node.texture.isLoaded()) {
      ctx = ctx || ServiceLocator.sys.rendererConfig.renderContext;

      const wt = this._worldTransform;
      this._matrix.mat[0] = wt.a;
      this._matrix.mat[4] = wt.c;
      this._matrix.mat[12] = wt.tx;
      this._matrix.mat[1] = wt.b;
      this._matrix.mat[5] = wt.d;
      this._matrix.mat[13] = wt.ty;

      this._glProgramState.apply(this._matrix);
      glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
      glBindTexture2D(node.texture);

      ctx.enableVertexAttribArray(VertexAttribute.POSITION);
      ctx.enableVertexAttribArray(VertexAttribute.COLOR);
      ctx.enableVertexAttribArray(VertexAttribute.TEX_COORDS);

      // position
      ctx.bindBuffer(ctx.ARRAY_BUFFER, node._verticesBuffer);
      ctx.bufferData(ctx.ARRAY_BUFFER, node._vertices, ctx.DYNAMIC_DRAW);
      ctx.vertexAttribPointer(
        VertexAttribute.POSITION,
        2,
        ctx.FLOAT,
        false,
        0,
        0
      );

      // texcoords
      ctx.bindBuffer(ctx.ARRAY_BUFFER, node._texCoordsBuffer);
      ctx.bufferData(ctx.ARRAY_BUFFER, node._texCoords, ctx.DYNAMIC_DRAW);
      ctx.vertexAttribPointer(
        VertexAttribute.TEX_COORDS,
        2,
        ctx.FLOAT,
        false,
        0,
        0
      );

      // colors
      ctx.bindBuffer(ctx.ARRAY_BUFFER, node._colorPointerBuffer);
      ctx.bufferData(ctx.ARRAY_BUFFER, node._colorPointer, ctx.DYNAMIC_DRAW);
      ctx.vertexAttribPointer(
        VertexAttribute.COLOR,
        4,
        ctx.UNSIGNED_BYTE,
        true,
        0,
        0
      );

      ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, node._nuPoints * 2);
      ServiceLocator.sys.rendererConfig.incrementDrawCount();
    }
  }
}
