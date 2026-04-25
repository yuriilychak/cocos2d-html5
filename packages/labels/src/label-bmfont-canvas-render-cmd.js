import { Node, Size, Rect } from "@aspect/core";

export class LabelBMFontCanvasRenderCmd extends Node.CanvasRenderCmd {
    constructor(renderableObject) {
        super(renderableObject);
    }

    _updateCharTexture(fontChar, rect, key) {
        if (key === 32) {
            fontChar.setTextureRect(rect, false, new Size(0, 0));
        } else {
            // updating previous sprite
            fontChar.setTextureRect(rect, false);
            // restore to default in case they were modified
            fontChar.visible = true;
        }
    }

    _updateCharColorAndOpacity(fontChar) {
        // Color MUST be set before opacity, since opacity might change color if OpacityModifyRGB is on
        fontChar._displayedColor = this._displayedColor;
        fontChar._renderCmd.setDirtyFlag(Node._dirtyFlags.colorDirty);
        fontChar._displayedOpacity = this._displayedOpacity;
        fontChar._renderCmd.setDirtyFlag(Node._dirtyFlags.opacityDirty);
    }

    setTexture(texture) {
        const node = this._node;
        const locChildren = node._children;
        const locDisplayedColor = this._displayedColor;
        for (let i = 0; i < locChildren.length; i++) {
            const selChild = locChildren[i];
            const cm = selChild._renderCmd;
            const childDColor = cm._displayedColor;
            if (node._texture !== cm._texture && (childDColor.r !== locDisplayedColor.r ||
                childDColor.g !== locDisplayedColor.g || childDColor.b !== locDisplayedColor.b))
                continue;
            selChild.texture = texture;
        }
        node._texture = texture;
    }

    _changeTextureColor() {
        const node = this._node;
        const texture = node._texture,
            contentSize = texture.getContentSize();

        const oTexture = node._texture,
            oElement = oTexture.getHtmlElementObj();
        const disColor = this._displayedColor;
        const textureRect = new Rect(0, 0, oElement.width, oElement.height);
        if (texture && contentSize.width > 0) {
            if (!oElement)
                return;
            const textureToRender = oTexture._generateColorTexture(disColor.r, disColor.g, disColor.b, textureRect);
            node.setTexture(textureToRender);
        }
    }

    _updateChildrenDisplayedOpacity(locChild) {
        Node.prototype.updateDisplayedOpacity.call(locChild, this._displayedOpacity);
    }

    _updateChildrenDisplayedColor(locChild) {
        Node.prototype.updateDisplayedColor.call(locChild, this._displayedColor);
    }
}
