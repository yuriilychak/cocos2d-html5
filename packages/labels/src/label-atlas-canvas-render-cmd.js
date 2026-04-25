import { AtlasNode, Rect, Size, Sprite, Node } from "@aspect/core";

export class LabelAtlasCanvasRenderCmd extends AtlasNode.CanvasRenderCmd {
    constructor(renderableObject) {
        super(renderableObject);
        this._needDraw = false;
    }

    setCascade() {
        const node = this._node;
        node._cascadeOpacityEnabled = true;
        node._cascadeColorEnabled = false;
    }

    updateAtlasValues() {
        const node = this._node;
        const locString = node._string || "";
        const n = locString.length;
        const texture = this._textureToRender;
        const locItemWidth = node._itemWidth, locItemHeight = node._itemHeight;     //needn't multiply cc.contentScaleFactor(), because sprite's draw will do this

        let i, cr = -1;
        for (i = 0; i < n; i++) {
            const a = locString.charCodeAt(i) - node._mapStartChar.charCodeAt(0);
            const row = parseInt(a % node._itemsPerRow, 10);
            const col = parseInt(a / node._itemsPerRow, 10);
            if(row < 0 || col < 0)
                continue;
            const rect = new Rect(row * locItemWidth, col * locItemHeight, locItemWidth, locItemHeight);
            const textureContent = texture._contentSize;
            if(rect.x < 0 || rect.y < 0 || rect.x + rect.width > textureContent.width || rect.y + rect.height > textureContent.height)
                continue;

            cr++;
            const c = locString.charCodeAt(i);
            let fontChar = node.getChildByTag(i);
            if (!fontChar) {
                fontChar = new Sprite();
                if (c === 32) {
                    fontChar.init();
                    fontChar.setTextureRect(new Rect(0, 0, 10, 10), false, new Size(0, 0));
                } else
                    fontChar.initWithTexture(texture, rect);

                Node.prototype.addChild.call(node, fontChar, 0, i);
            } else {
                if (c === 32) {
                    fontChar.init();
                    fontChar.setTextureRect(new Rect(0, 0, 10, 10), false, new Size(0, 0));
                } else {
                    // reusing fonts
                    fontChar.initWithTexture(texture, rect);
                    // restore to default in case they were modified
                    fontChar.visible = true;
                }
            }
            fontChar.setPosition(cr * locItemWidth + locItemWidth / 2, locItemHeight / 2);
        }
        this.updateContentSize(i, cr+1);
    }

    updateContentSize(i, cr) {
        const node = this._node,
            contentSize = node._contentSize;
        if(i !== cr && i*node._itemWidth === contentSize.width && node._itemHeight === contentSize.height){
            node.setContentSize(cr * node._itemWidth, node._itemHeight);
        }
    }

    setString(label) {
        const node = this._node;
        if (node._children) {
            const locChildren = node._children;
            const len = locChildren.length;
            for (let i = 0; i < len; i++) {
                const child = locChildren[i];
                if (child && !child._lateChild)
                    child.visible = false;
            }
        }
    }

    _addChild() {
        child._lateChild = true;
    }
}
