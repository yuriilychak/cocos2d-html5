import { Node } from '@aspect/core';
import { editBoxImpl } from './edit-box-impl';

export class EditBoxCanvasRenderCmd extends Node.CanvasRenderCmd {
    constructor(node) {
        super(node);
        this.initializeRenderCmd(node);
    }

    transform(parentCmd, recursive) {
        this.originTransform(parentCmd, recursive);
        this.updateMatrix();
    }
}

Object.assign(EditBoxCanvasRenderCmd.prototype, editBoxImpl);
