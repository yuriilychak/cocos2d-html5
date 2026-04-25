import { Node } from "@aspect/core";

export class LabelBMFontWebGLRenderCmd extends Node.WebGLRenderCmd {
    constructor(renderableObject) {
        super(renderableObject);
    }

    setTexture(texture) {
        this._node.setOpacityModifyRGB(this._node._texture.hasPremultipliedAlpha());
    }

    _updateCharTexture(fontChar, rect, key, isRotated) {
        // updating previous sprite
        fontChar.setTextureRect(rect, isRotated);
        // restore to default in case they were modified
        fontChar.visible = true;
    }

    _changeTextureColor() {
    }

    _updateCharColorAndOpacity() {
    }
}
