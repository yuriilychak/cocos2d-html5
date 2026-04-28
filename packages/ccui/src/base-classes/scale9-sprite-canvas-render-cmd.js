import { NodeCanvasRenderCmd, Node, RendererConfig, incrementGLDraws } from '@aspect/core';
import { Scale9Sprite } from './scale9-sprite';

export class Scale9SpriteCanvasRenderCmd extends NodeCanvasRenderCmd {
    constructor(renderable) {
        super(renderable);
        this._needDraw = true;
        this._state = this.constructor.state ? this.constructor.state.NORMAL : 0;
        this._originalTexture = this._textureToRender = null;
    }

    transform(parentCmd, recursive) {
        this.originTransform(parentCmd, recursive);
        this._node._rebuildQuads();
    }

    needDraw() {
        return this._needDraw && this._node.loaded();
    }

    _updateDisplayColor(parentColor) {
        Node.RenderCmd.prototype._updateDisplayColor.call(this, parentColor);
        this._originalTexture = this._textureToRender = null;
    }

    setState(state) {
        if(this._state === state) return;
        this._state = state;
        this._originalTexture = this._textureToRender = null;
    }

    _setColorDirty() {
        this.setDirtyFlag(Node._dirtyFlags.colorDirty | Node._dirtyFlags.opacityDirty);
    }

    rendering(ctx, scaleX, scaleY) {
        var node = this._node;
        var locDisplayOpacity = this._displayedOpacity;
        var alpha =  locDisplayOpacity/ 255;
        var locTexture = null;
        if (node._spriteFrame) locTexture = node._spriteFrame._texture;
        if (!node.loaded() || locDisplayOpacity === 0)
            return;
        if (this._textureToRender === null || this._originalTexture !== locTexture) {
            this._textureToRender = this._originalTexture = locTexture;
            if (Scale9Sprite.state.GRAY === this._state) {
                this._textureToRender = this._textureToRender._generateGrayTexture();
            }
            var color = node.getDisplayedColor();
            if (locTexture && (color.r !== 255 || color.g !==255 || color.b !== 255))
                this._textureToRender = this._textureToRender._generateColorTexture(color.r,color.g,color.b);
        }

        var wrapper = ctx || RendererConfig.getInstance().renderContext, context = wrapper.getContext();
        wrapper.setTransform(this._worldTransform, scaleX, scaleY);
        wrapper.setCompositeOperation(NodeCanvasRenderCmd._getCompositeOperationByBlendFunc(node._blendFunc));
        wrapper.setGlobalAlpha(alpha);

        if (this._textureToRender) {
            if (node._quadsDirty) {
                node._rebuildQuads();
            }
            var sx,sy,sw,sh;
            var x, y, w,h;
            var textureWidth = this._textureToRender._pixelsWide;
            var textureHeight = this._textureToRender._pixelsHigh;
            var image = this._textureToRender._htmlElementObj;
            var vertices = node._vertices;
            var uvs = node._uvs;
            var i = 0, off = 0;

            if (node._renderingType === Scale9Sprite.RenderingType.SLICED) {
                for (var r = 0; r < 3; ++r) {
                    for (var c = 0; c < 3; ++c) {
                        off = r*8 + c*2;
                        x = vertices[off];
                        y = vertices[off+1];
                        w = vertices[off+10] - x;
                        h = vertices[off+11] - y;
                        y = - y - h;

                        sx = uvs[off] * textureWidth;
                        sy = uvs[off+11] * textureHeight;
                        sw = (uvs[off+10] - uvs[off]) * textureWidth;
                        sh = (uvs[off+1] - uvs[off+11]) * textureHeight;

                        if (sw > 0 && sh > 0 && w > 0 && h > 0) {
                            context.drawImage(image,
                                              sx, sy, sw, sh,
                                              x, y, w, h);
                        }
                    }
                }
                incrementGLDraws(9);
            } else {
                var quadCount = Math.floor(node._vertCount / 4);
                for (i = 0, off = 0; i < quadCount; i++) {
                    x = vertices[off];
                    y = vertices[off+1];
                    w = vertices[off+6] - x;
                    h = vertices[off+7] - y;
                    y = - y - h;

                    sx = uvs[off] * textureWidth;
                    sy = uvs[off+7] * textureHeight;
                    sw = (uvs[off+6] - uvs[off]) * textureWidth;
                    sh = (uvs[off+1] - uvs[off+7]) * textureHeight;


                    if (this._textureToRender._pattern !== '') {
                        wrapper.setFillStyle(context.createPattern(image, this._textureToRender._pattern));
                        context.fillRect(x, y, w, h);
                    } else {
                        if (sw > 0 && sh > 0 && w > 0 && h > 0) {
                            context.drawImage(image,
                                              sx, sy, sw, sh,
                                              x, y, w, h);
                        }
                    }
                    off += 8;
                }
                incrementGLDraws(quadCount);
            }
        }
    }
}
