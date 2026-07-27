import {
  Node,
  Matrix4,
  ServiceLocator,
  ShaderName,
  VertexAttribute
} from "@aspect/core";

export class MotionStreakWebGLRenderCmd extends Node.WebGLRenderCmd {
  #matrix = new Matrix4();

  constructor(renderableObject) {
    super(renderableObject);
    this._needDraw = true;
    this.#matrix.identity();
    this._shaderProgram = ServiceLocator.shaderCache.get(
      ShaderName.POSITION_TEXTURECOLOR
    );
  }

  rendering(ctx) {
    const pointCount = this._node.pointCount;
    if (pointCount <= 1) return;

    if (this._node.texture && this._node.texture.loaded) {
      ctx = ctx || ServiceLocator.sys.rendererConfig.renderContext;

      const wt = this._worldTransform;
      this.#matrix.mat[0] = wt.a;
      this.#matrix.mat[4] = wt.c;
      this.#matrix.mat[12] = wt.tx;
      this.#matrix.mat[1] = wt.b;
      this.#matrix.mat[5] = wt.d;
      this.#matrix.mat[13] = wt.ty;

      this._glProgramState.apply(this.#matrix);
      const renderData = this._node.renderData;
      ServiceLocator.glStateCache.blendFunc(this._node.src, this._node.dst);
      ServiceLocator.glStateCache.bindTexture2D(this._node.texture);

      ctx.enableVertexAttribArray(VertexAttribute.POSITION);
      ctx.enableVertexAttribArray(VertexAttribute.COLOR);
      ctx.enableVertexAttribArray(VertexAttribute.TEX_COORDS);

      // position
      ctx.bindBuffer(ctx.ARRAY_BUFFER, renderData.verticesBuffer);
      ctx.bufferData(ctx.ARRAY_BUFFER, renderData.vertices, ctx.DYNAMIC_DRAW);
      ctx.vertexAttribPointer(
        VertexAttribute.POSITION,
        2,
        ctx.FLOAT,
        false,
        0,
        0
      );

      // texcoords
      ctx.bindBuffer(ctx.ARRAY_BUFFER, renderData.texCoordsBuffer);
      ctx.bufferData(ctx.ARRAY_BUFFER, renderData.texCoords, ctx.DYNAMIC_DRAW);
      ctx.vertexAttribPointer(
        VertexAttribute.TEX_COORDS,
        2,
        ctx.FLOAT,
        false,
        0,
        0
      );

      // colors
      ctx.bindBuffer(ctx.ARRAY_BUFFER, renderData.colorPointerBuffer);
      ctx.bufferData(ctx.ARRAY_BUFFER, renderData.colorPointer, ctx.DYNAMIC_DRAW);
      ctx.vertexAttribPointer(
        VertexAttribute.COLOR,
        4,
        ctx.UNSIGNED_BYTE,
        true,
        0,
        0
      );

      ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, pointCount * 2);
      ServiceLocator.sys.rendererConfig.incrementDrawCount();
    }
  }
}
