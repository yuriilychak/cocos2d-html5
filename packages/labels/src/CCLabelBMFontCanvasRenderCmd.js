/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
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

 Use any of these editors to generate BMFonts:
 http://glyphdesigner.71squared.com/ (Commercial, Mac OS X)
 http://www.n4te.com/hiero/hiero.jnlp (Free, Java)
 http://slick.cokeandcode.com/demos/hiero.jnlp (Free, Java)
 http://www.angelcode.com/products/bmfont/ (Free, Windows only)
 ****************************************************************************/

(function () {
    cc.LabelBMFont.CanvasRenderCmd = class CanvasRenderCmd extends cc.Node.CanvasRenderCmd {
        constructor(renderableObject) {
            super(renderableObject);
        }

        _updateCharTexture(fontChar, rect, key) {
            if (key === 32) {
                fontChar.setTextureRect(rect, false, new cc.Size(0, 0));
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
            fontChar._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.colorDirty);
            fontChar._displayedOpacity = this._displayedOpacity;
            fontChar._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.opacityDirty);
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
            const textureRect = new cc.Rect(0, 0, oElement.width, oElement.height);
            if (texture && contentSize.width > 0) {
                if (!oElement)
                    return;
                const textureToRender = oTexture._generateColorTexture(disColor.r, disColor.g, disColor.b, textureRect);
                node.setTexture(textureToRender);
            }
        }

        _updateChildrenDisplayedOpacity(locChild) {
            cc.Node.prototype.updateDisplayedOpacity.call(locChild, this._displayedOpacity);
        }

        _updateChildrenDisplayedColor(locChild) {
            cc.Node.prototype.updateDisplayedColor.call(locChild, this._displayedColor);
        }
    };
})();
