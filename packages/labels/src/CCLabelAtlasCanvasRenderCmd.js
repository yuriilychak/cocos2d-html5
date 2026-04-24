/****************************************************************************
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

(function(){
    cc.LabelAtlas.CanvasRenderCmd = class CanvasRenderCmd extends cc.AtlasNode.CanvasRenderCmd {
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
                const rect = new cc.Rect(row * locItemWidth, col * locItemHeight, locItemWidth, locItemHeight);
                const textureContent = texture._contentSize;
                if(rect.x < 0 || rect.y < 0 || rect.x + rect.width > textureContent.width || rect.y + rect.height > textureContent.height)
                    continue;

                cr++;
                const c = locString.charCodeAt(i);
                let fontChar = node.getChildByTag(i);
                if (!fontChar) {
                    fontChar = new cc.Sprite();
                    if (c === 32) {
                        fontChar.init();
                        fontChar.setTextureRect(new cc.Rect(0, 0, 10, 10), false, new cc.Size(0, 0));
                    } else
                        fontChar.initWithTexture(texture, rect);

                    cc.Node.prototype.addChild.call(node, fontChar, 0, i);
                } else {
                    if (c === 32) {
                        fontChar.init();
                        fontChar.setTextureRect(new cc.Rect(0, 0, 10, 10), false, new cc.Size(0, 0));
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
    };
})();