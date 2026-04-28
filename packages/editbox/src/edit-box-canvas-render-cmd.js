import { NodeCanvasRenderCmd } from '@aspect/core';
import { editBoxImpl } from './edit-box-impl';

export class EditBoxCanvasRenderCmd extends NodeCanvasRenderCmd {
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
