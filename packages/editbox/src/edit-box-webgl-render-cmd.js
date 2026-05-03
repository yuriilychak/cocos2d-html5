import { Node } from '@aspect/core';
import { editBoxImpl } from './edit-box-impl';

export class EditBoxWebGLRenderCmd extends Node.WebGLRenderCmd {
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
