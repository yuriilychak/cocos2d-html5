import { Node, KMGLMatrixMode, Matrix4, ServiceLocator } from "@aspect/core";

export class GLNode extends Node {
    constructor() {
        super();
        this.init();
    }
    init() {
        this.renderCmd._needDraw = true;
        this.renderCmd._matrix = new Matrix4();
        this.renderCmd._matrix.identity();
        this.renderCmd.rendering =  function(ctx){
            var wt = this._worldTransform;
            this._matrix.mat[0] = wt.a;
            this._matrix.mat[4] = wt.c;
            this._matrix.mat[12] = wt.tx;
            this._matrix.mat[1] = wt.b;
            this._matrix.mat[5] = wt.d;
            this._matrix.mat[13] = wt.ty;

            ServiceLocator.kmglMatrix.matrixMode(KMGLMatrixMode.MODELVIEW);
            ServiceLocator.kmglMatrix.pushMatrix();
            ServiceLocator.kmglMatrix.loadMatrix(this._matrix);

            this._node.draw(ctx);

            ServiceLocator.kmglMatrix.popMatrix();
        };
    }
    draw(ctx) {
        super.draw(ctx);
    }
}
