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

/**
 * ParticleSystem's canvas render command
 */
(function () {
    cc.ParticleSystem.CanvasRenderCmd = class CanvasRenderCmd extends cc.Node.CanvasRenderCmd {
        constructor(renderable) {
            super(renderable);
            this._needDraw = true;

            this._drawMode = cc.ParticleSystem.TEXTURE_MODE;
            this._shapeType = cc.ParticleSystem.BALL_SHAPE;

            this._pointRect = new cc.Rect(0, 0, 0, 0);
            this._tintCache = null;
        }

        getDrawMode() {
            return this._drawMode;
        }

        setDrawMode(drawMode) {
            this._drawMode = drawMode;
        }

        getShapeType() {
            return this._shapeType;
        }

        setShapeType(shapeType) {
            this._shapeType = shapeType;
        }

        setBatchNode(batchNode) {
            if (this._batchNode !== batchNode) {
                this._node._batchNode = batchNode;
            }
        }

        updateQuadWithParticle(particle, newPosition) {
            //do nothing
        }

        updateParticlePosition(particle, position) {
            cc.Point.copyIn(particle.drawPos, position);
        }

        rendering(ctx, scaleX, scaleY) {
            //TODO: need refactor rendering for performance
            const wrapper = ctx || cc.rendererConfig.renderContext, context = wrapper.getContext(),
                node = this._node, pointRect = this._pointRect;

            wrapper.setTransform(this._worldTransform, scaleX, scaleY);
            wrapper.save();
            if (node.isBlendAdditive())
                context.globalCompositeOperation = 'lighter';
            else
                context.globalCompositeOperation = 'source-over';

            let i, particle, lpx, alpha;
            const particleCount = this._node.particleCount, particles = this._node._particles;
            if (node.drawMode !== cc.ParticleSystem.SHAPE_MODE && node._texture) {
                // Delay drawing until the texture is fully loaded by the browser
                if (!node._texture._textureLoaded) {
                    wrapper.restore();
                    return;
                }
                const element = node._texture.getHtmlElementObj();
                if (!element.width || !element.height) {
                    wrapper.restore();
                    return;
                }

                let drawElement = element;
                for (i = 0; i < particleCount; i++) {
                    particle = particles[i];
                    lpx = (0 | (particle.size * 0.5));

                    alpha = particle.color.a / 255;
                    if (alpha === 0) continue;
                    context.globalAlpha = alpha;

                    context.save();
                    context.translate((0 | particle.drawPos.x), -(0 | particle.drawPos.y));

                    const size = Math.floor(particle.size / 4) * 4;
                    const w = pointRect.width;
                    const h = pointRect.height;

                    context.scale(Math.max((1 / w) * size, 0.000001), Math.max((1 / h) * size, 0.000001));
                    if (particle.rotation)
                        context.rotate(cc.degreesToRadians(particle.rotation));

                    drawElement = particle.isChangeColor ? this._changeTextureColor(node._texture, particle.color, this._pointRect) : element;
                    context.drawImage(drawElement, -(0 | (w / 2)), -(0 | (h / 2)));
                    context.restore();
                }
            } else {
                const drawTool = cc._drawingUtil;
                for (i = 0; i < particleCount; i++) {
                    particle = particles[i];
                    lpx = (0 | (particle.size * 0.5));
                    alpha = particle.color.a / 255;
                    if (alpha === 0) continue;
                    context.globalAlpha = alpha;

                    context.save();
                    context.translate(0 | particle.drawPos.x, -(0 | particle.drawPos.y));
                    if (node.shapeType === cc.ParticleSystem.STAR_SHAPE) {
                        if (particle.rotation)
                            context.rotate(cc.degreesToRadians(particle.rotation));
                        drawTool.drawStar(wrapper, lpx, particle.color);
                    } else
                        drawTool.drawColorBall(wrapper, lpx, particle.color);
                    context.restore();
                }
            }
            wrapper.restore();
            cc.g_NumberOfDraws++;
        }

        _changeTextureColor(texture, color, rect) {
            if (!this._tintCache) {
                this._tintCache = document.createElement("canvas");
            }
            const tintCache = this._tintCache;
            const textureContentSize = texture.getContentSize();
            tintCache.width = textureContentSize.width;
            tintCache.height = textureContentSize.height;
            return texture._generateColorTexture(color.r, color.g, color.b, rect, tintCache);
        }

        initTexCoordsWithRect(pointRect) {
            this._pointRect = pointRect;
        }

        setTotalParticles(tp) {
            //cc.assert(tp <= this._allocatedParticles, "Particle: resizing particle array only supported for quads");
            this._node._totalParticles = (tp < 200) ? tp : 200;
        }

        addParticle() {
            const node = this._node,
                particles = node._particles;
            let particle;
            if (node.particleCount < particles.length) {
                particle = particles[node.particleCount];
            } else {
                particle = new cc.Particle();
                particles.push(particle);
            }
            return particle;
        }

        _setupVBO() {
        }

        _allocMemory() {
            return true;
        }

        postStep() {
        }

        _setBlendAdditive() {
            const locBlendFunc = this._node._blendFunc;
            locBlendFunc.src = cc.BLEND_SRC;
            locBlendFunc.dst = cc.BLEND_DST;
        }

        _initWithTotalParticles(totalParticles) {
        }

        _updateDeltaColor(selParticle, dt) {
            if (!this._node._dontTint) {
                const deltaColor = selParticle.deltaColor;
                selParticle.color.r += deltaColor.r * dt;
                selParticle.color.g += deltaColor.g * dt;
                selParticle.color.b += deltaColor.b * dt;
                selParticle.color.a += deltaColor.a * dt;
                selParticle.isChangeColor = deltaColor.r !== 0 || deltaColor.g !== 0 || deltaColor.b !== 0;
            }
        }
    };
})();
