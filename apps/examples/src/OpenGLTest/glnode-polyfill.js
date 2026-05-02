import { Node, kmGLPopMatrix, kmGLPushMatrix } from "@aspect/core";
// GLNode polyfill — required by ShaderNode and tests that instantiate
// `new GLNode()`. Imported for side effects from any file that needs it.
cc.GLNode = cc.GLNode || class GLNode extends Node {
    constructor() {
        super();
        this.init();
    }
    init() {
        this._renderCmd._needDraw = true;
        this._renderCmd._matrix = new cc.math.Matrix4();
        this._renderCmd._matrix.identity();
        this._renderCmd.rendering =  function(ctx){
            var wt = this._worldTransform;
            this._matrix.mat[0] = wt.a;
            this._matrix.mat[4] = wt.c;
            this._matrix.mat[12] = wt.tx;
            this._matrix.mat[1] = wt.b;
            this._matrix.mat[5] = wt.d;
            this._matrix.mat[13] = wt.ty;

            cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
            kmGLPushMatrix();
            cc.kmGLLoadMatrix(this._matrix);

            this._node.draw(ctx);

            kmGLPopMatrix();
        };
    }
    draw(ctx) {
        super.draw(ctx);
    }
};
