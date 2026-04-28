import { NodeWebGLRenderCmd } from '@aspect/core';
import { editBoxImpl } from './edit-box-impl';

export class EditBoxWebGLRenderCmd extends NodeWebGLRenderCmd {
    constructor(node) {
        super(node);
        this.initializeRenderCmd(node);
    }

    transform(parentCmd, recursive) {
        this.originTransform(parentCmd, recursive);
        this.updateMatrix();
    }
}

Object.assign(EditBoxWebGLRenderCmd.prototype, editBoxImpl);
