import {
    NodeWebGLRenderCmd,
    Node,
    RendererConfig,
    glBlendFunc,
    glBindTexture2D,
    incrementGLDraws,
    VERTEX_ATTRIB_POSITION,
    VERTEX_ATTRIB_COLOR,
    VERTEX_ATTRIB_TEX_COORDS,
    V3F_C4B_T2F,
    ShaderCache,
    SHADER_SPRITE_POSITION_TEXTURECOLOR,
    FLT_MAX,
    Point
} from "@aspect/core";
import { TYPE_RADIAL, TYPE_BAR, TEXTURE_COORDS_COUNT, TEXTURE_COORDS } from "./constants";

const MAX_VERTEX_COUNT = 8;

/**
 * ProgressTimer's rendering objects of WebGL
 */
export class ProgressTimerWebGLRenderCmd extends NodeWebGLRenderCmd {
    constructor(renderableObject) {
        super(renderableObject);
        this._needDraw = true;
        this._progressDirty = true;

        this._bl = new Point();
        this._tr = new Point();
        this._transformUpdating = false;

        this.initCmd();
    }

    transform(parentCmd, recursive) {
        this.originTransform(parentCmd, recursive);
        const sp = this._node._sprite;
        sp._renderCmd.transform(this, recursive);

        const lx = sp._offsetPosition.x, rx = lx + sp._rect.width,
            by = sp._offsetPosition.y, ty = by + sp._rect.height,
            wt = this._worldTransform;
        this._bl.x = lx * wt.a + by * wt.c + wt.tx;
        this._bl.y = lx * wt.b + by * wt.d + wt.ty;
        this._tr.x = rx * wt.a + ty * wt.c + wt.tx;
        this._tr.y = rx * wt.b + ty * wt.d + wt.ty;

        this._transformUpdating = true;
        this._updateProgressData();
        this._transformUpdating = false;
    }

    rendering(ctx) {
        const node = this._node;
        const context = ctx || RendererConfig.getInstance().renderContext;
        if (this._vertexDataCount === 0 || !node._sprite)
            return;

        this._glProgramState.apply();
        this._shaderProgram._updateProjectionUniform();

        const blendFunc = node._sprite._blendFunc;
        glBlendFunc(blendFunc.src, blendFunc.dst);
        glBindTexture2D(node._sprite.texture);
        context.bindBuffer(context.ARRAY_BUFFER, this._vertexWebGLBuffer);

        context.enableVertexAttribArray(VERTEX_ATTRIB_POSITION);
        context.enableVertexAttribArray(VERTEX_ATTRIB_COLOR);
        context.enableVertexAttribArray(VERTEX_ATTRIB_TEX_COORDS);

        if (this._vertexDataDirty) {
            context.bufferSubData(context.ARRAY_BUFFER, 0, this._float32View);
            this._vertexDataDirty = false;
        }
        const locVertexDataLen = V3F_C4B_T2F.BYTES_PER_ELEMENT;
        context.vertexAttribPointer(VERTEX_ATTRIB_POSITION, 3, context.FLOAT, false, locVertexDataLen, 0);
        context.vertexAttribPointer(VERTEX_ATTRIB_COLOR, 4, context.UNSIGNED_BYTE, true, locVertexDataLen, 12);
        context.vertexAttribPointer(VERTEX_ATTRIB_TEX_COORDS, 2, context.FLOAT, false, locVertexDataLen, 16);

        if (node._type === TYPE_RADIAL)
            context.drawArrays(context.TRIANGLE_FAN, 0, this._vertexDataCount);
        else if (node._type === TYPE_BAR) {
            if (!node._reverseDirection)
                context.drawArrays(context.TRIANGLE_STRIP, 0, this._vertexDataCount);
            else {
                context.drawArrays(context.TRIANGLE_STRIP, 0, this._vertexDataCount / 2);
                context.drawArrays(context.TRIANGLE_STRIP, 4, this._vertexDataCount / 2);
                // 2 draw calls
                incrementGLDraws(1);
            }
        }
        incrementGLDraws(1);
    }

    _syncStatus(parentCmd) {
        const node = this._node;
        if (!node._sprite)
            return;
        const flags = Node._dirtyFlags;
        let locFlag = this._dirtyFlag;
        const parentNode = parentCmd ? parentCmd._node : null;

        if (parentNode && parentNode._cascadeColorEnabled && (parentCmd._dirtyFlag & flags.colorDirty))
            locFlag |= flags.colorDirty;
        if (parentNode && parentNode._cascadeOpacityEnabled && (parentCmd._dirtyFlag & flags.opacityDirty))
            locFlag |= flags.opacityDirty;
        if (parentCmd && (parentCmd._dirtyFlag & flags.transformDirty))
            locFlag |= flags.transformDirty;
        this._dirtyFlag = locFlag;

        const spriteCmd = node._sprite._renderCmd;
        const spriteFlag = spriteCmd._dirtyFlag;

        const colorDirty = (locFlag | spriteFlag) & flags.colorDirty,
            opacityDirty = (locFlag | spriteFlag) & flags.opacityDirty;

        if (colorDirty) {
            spriteCmd._syncDisplayColor();
            spriteCmd._dirtyFlag &= ~flags.colorDirty;
            this._dirtyFlag &= ~flags.colorDirty;
        }

        if (opacityDirty) {
            spriteCmd._syncDisplayOpacity();
            spriteCmd._dirtyFlag &= ~flags.opacityDirty;
            this._dirtyFlag &= ~flags.opacityDirty;
        }

        if (colorDirty || opacityDirty) {
            this._updateColor();
        }

        if (locFlag & flags.transformDirty) {
            this.transform(parentCmd);
        }

        if (locFlag & flags.textureDirty) {
            this._updateProgressData();
            this._dirtyFlag &= ~flags.textureDirty;
        }

        spriteCmd._dirtyFlag = 0;
    }

    updateStatus() {
        const node = this._node;
        if (!node._sprite)
            return;
        const flags = Node._dirtyFlags, locFlag = this._dirtyFlag;
        const spriteCmd = node._sprite._renderCmd;
        const spriteFlag = spriteCmd._dirtyFlag;

        const colorDirty = (locFlag | spriteFlag) & flags.colorDirty,
            opacityDirty = (locFlag | spriteFlag) & flags.opacityDirty;

        if (colorDirty) {
            spriteCmd._updateDisplayColor();
            spriteCmd._dirtyFlag = spriteCmd._dirtyFlag & flags.colorDirty ^ spriteCmd._dirtyFlag;
            this._dirtyFlag = this._dirtyFlag & flags.colorDirty ^ this._dirtyFlag;
        }

        if (opacityDirty) {
            spriteCmd._updateDisplayOpacity();
            spriteCmd._dirtyFlag = spriteCmd._dirtyFlag & flags.opacityDirty ^ spriteCmd._dirtyFlag;
            this._dirtyFlag = this._dirtyFlag & flags.opacityDirty ^ this._dirtyFlag;
        }

        if (colorDirty || opacityDirty) {
            this._updateColor();
        }

        if (locFlag & flags.transformDirty) {
            this.transform(this.getParentRenderCmd(), true);
        }

        if (locFlag & flags.orderDirty) {
            this._dirtyFlag = this._dirtyFlag & flags.orderDirty ^ this._dirtyFlag;
        }

        if (locFlag & flags.textureDirty) {
            this._updateProgressData();
            this._dirtyFlag = this._dirtyFlag & flags.textureDirty ^ this._dirtyFlag;
        }
    }

    releaseData() {
        if (this._vertexData) {
            const webglBuffer = this._vertexWebGLBuffer;
            setTimeout(function () {
                RendererConfig.getInstance().renderContext.deleteBuffer(webglBuffer);
            }, 0.1);
            this._vertexWebGLBuffer = null;
            this._vertexData = null;
            this._float32View = null;
            this._vertexArrayBuffer = null;
            this._vertexDataCount = 0;
        }
    }

    initCmd() {
        if (!this._vertexData) {
            const gl = RendererConfig.getInstance().renderContext;
            this._vertexWebGLBuffer = gl.createBuffer();

            const vertexDataLen = V3F_C4B_T2F.BYTES_PER_ELEMENT;
            this._vertexArrayBuffer = new ArrayBuffer(MAX_VERTEX_COUNT * vertexDataLen);
            this._float32View = new Float32Array(this._vertexArrayBuffer);
            this._vertexData = [];
            for (let i = 0; i < MAX_VERTEX_COUNT; i++) {
                this._vertexData[i] = new V3F_C4B_T2F(null, null, null, this._vertexArrayBuffer, i * vertexDataLen);
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexWebGLBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this._float32View, gl.DYNAMIC_DRAW);

            this._vertexDataCount = 0;
            this._vertexDataDirty = true;

            this._shaderProgram = ShaderCache.getInstance().programForKey(SHADER_SPRITE_POSITION_TEXTURECOLOR);
        }
    }

    resetVertexData() {
        this._vertexDataCount = 0;
    }

    _updateProgressData() {
        const node = this._node;
        const locType = node._type;
        if (locType === TYPE_RADIAL)
            this._updateRadial();
        else if (locType === TYPE_BAR)
            this._updateBar();
        this._vertexDataDirty = true;
    }

    _updateProgress() {
        this.setDirtyFlag(Node._dirtyFlags.textureDirty);
    }

    /**
     * <p>
     *    Update does the work of mapping the texture onto the triangles for the bar                            <br/>
     *    It now doesn't occur the cost of free/alloc data every update cycle.                                  <br/>
     *    It also only changes the percentage point but no other points if they have not been modified.         <br/>
     *                                                                                                          <br/>
     *    It now deals with flipped texture. If you run into this problem, just use the                         <br/>
     *    sprite property and enable the methods flipX, flipY.                                                  <br/>
     * </p>
     * @private
     */
    _updateBar() {
        const node = this._node;
        if (!node._sprite)
            return;

        let i;
        const alpha = node._percentage / 100.0;
        const locBarChangeRate = node._barChangeRate;
        const alphaOffset = Point.mult(new Point((1.0 - locBarChangeRate.x) + alpha * locBarChangeRate.x,
            (1.0 - locBarChangeRate.y) + alpha * locBarChangeRate.y), 0.5);
        const min = Point.sub(node._midPoint, alphaOffset), max = Point.add(node._midPoint, alphaOffset);

        if (min.x < 0) {
            max.x += -min.x;
            min.x = 0;
        }

        if (max.x > 1) {
            min.x -= max.x - 1;
            max.x = 1;
        }

        if (min.y < 0) {
            max.y += -min.y;
            min.y = 0;
        }

        if (max.y > 1) {
            min.y -= max.y - 1;
            max.y = 1;
        }

        let locVertexData;
        if (!node._reverseDirection) {
            if (!this._vertexDataCount) {
                this._vertexDataCount = 4;
            }
            locVertexData = this._vertexData;
            //    TOPLEFT
            this._textureCoordFromAlphaPoint(locVertexData[0].texCoords, min.x, max.y);
            this._vertexFromAlphaPoint(locVertexData[0].vertices, min.x, max.y);

            //    BOTLEFT
            this._textureCoordFromAlphaPoint(locVertexData[1].texCoords, min.x, min.y);
            this._vertexFromAlphaPoint(locVertexData[1].vertices, min.x, min.y);

            //    TOPRIGHT
            this._textureCoordFromAlphaPoint(locVertexData[2].texCoords, max.x, max.y);
            this._vertexFromAlphaPoint(locVertexData[2].vertices, max.x, max.y);

            //    BOTRIGHT
            this._textureCoordFromAlphaPoint(locVertexData[3].texCoords, max.x, min.y);
            this._vertexFromAlphaPoint(locVertexData[3].vertices, max.x, min.y);
        } else {
            locVertexData = this._vertexData;
            if (!this._vertexDataCount) {
                this._vertexDataCount = 8;
                //    TOPLEFT 1
                this._textureCoordFromAlphaPoint(locVertexData[0].texCoords, 0, 1);
                this._vertexFromAlphaPoint(locVertexData[0].vertices, 0, 1);

                //    BOTLEFT 1
                this._textureCoordFromAlphaPoint(locVertexData[1].texCoords, 0, 0);
                this._vertexFromAlphaPoint(locVertexData[1].vertices, 0, 0);

                //    TOPRIGHT 2
                this._textureCoordFromAlphaPoint(locVertexData[6].texCoords, 1, 1);
                this._vertexFromAlphaPoint(locVertexData[6].vertices, 1, 1);

                //    BOTRIGHT 2
                this._textureCoordFromAlphaPoint(locVertexData[7].texCoords, 1, 0);
                this._vertexFromAlphaPoint(locVertexData[7].vertices, 1, 0);
            }

            //    TOPRIGHT 1
            this._textureCoordFromAlphaPoint(locVertexData[2].texCoords, min.x, max.y);
            this._vertexFromAlphaPoint(locVertexData[2].vertices, min.x, max.y);

            //    BOTRIGHT 1
            this._textureCoordFromAlphaPoint(locVertexData[3].texCoords, min.x, min.y);
            this._vertexFromAlphaPoint(locVertexData[3].vertices, min.x, min.y);

            //    TOPLEFT 2
            this._textureCoordFromAlphaPoint(locVertexData[4].texCoords, max.x, max.y);
            this._vertexFromAlphaPoint(locVertexData[4].vertices, max.x, max.y);

            //    BOTLEFT 2
            this._textureCoordFromAlphaPoint(locVertexData[5].texCoords, max.x, min.y);
            this._vertexFromAlphaPoint(locVertexData[5].vertices, max.x, min.y);
        }
        this._updateColor();
    }

    /**
     * <p>
     *    Update does the work of mapping the texture onto the triangles            <br/>
     *    It now doesn't occur the cost of free/alloc data every update cycle.      <br/>
     *    It also only changes the percentage point but no other points if they have not been modified.       <br/>
     *                                                                              <br/>
     *    It now deals with flipped texture. If you run into this problem, just use the                       <br/>
     *    sprite property and enable the methods flipX, flipY.                      <br/>
     * </p>
     * @private
     */
    _updateRadial() {
        const node = this._node;
        if (!node._sprite)
            return;

        let i;
        const locMidPoint = node._midPoint;
        const alpha = node._percentage / 100;
        const angle = 2 * Math.PI * (node._reverseDirection ? alpha : 1.0 - alpha);

        //    We find the vector to do a hit detection based on the percentage
        //    We know the first vector is the one @ 12 o'clock (top,mid) so we rotate
        //    from that by the progress angle around the m_tMidpoint pivot
        const topMid = new Point(locMidPoint.x, 1);
        const percentagePt = Point.rotateByAngle(topMid, locMidPoint, angle);

        let index = 0;
        let hit;

        if (alpha === 0) {
            //    More efficient since we don't always need to check intersection
            //    If the alpha is zero then the hit point is top mid and the index is 0.
            hit = topMid;
            index = 0;
        } else if (alpha === 1) {
            //    More efficient since we don't always need to check intersection
            //    If the alpha is one then the hit point is top mid and the index is 4.
            hit = topMid;
            index = 4;
        } else {
            //    We run a for loop checking the edges of the texture to find the
            //    intersection point
            //    We loop through five points since the top is split in half

            let min_t = FLT_MAX;
            const locProTextCoordsCount = TEXTURE_COORDS_COUNT;
            for (i = 0; i <= locProTextCoordsCount; ++i) {
                const pIndex = (i + (locProTextCoordsCount - 1)) % locProTextCoordsCount;

                let edgePtA = this._boundaryTexCoord(i % locProTextCoordsCount);
                let edgePtB = this._boundaryTexCoord(pIndex);

                //    Remember that the top edge is split in half for the 12 o'clock position
                //    Let's deal with that here by finding the correct endpoints
                if (i === 0)
                    edgePtB = Point.lerp(edgePtA, edgePtB, 1 - locMidPoint.x);
                else if (i === 4)
                    edgePtA = Point.lerp(edgePtA, edgePtB, 1 - locMidPoint.x);

                // retPoint are returned by ccpLineIntersect
                const retPoint = new Point(0, 0);
                if (Point.lineIntersect(edgePtA, edgePtB, locMidPoint, percentagePt, retPoint)) {
                    //    Since our hit test is on rays we have to deal with the top edge
                    //    being in split in half so we have to test as a segment
                    if ((i === 0 || i === 4)) {
                        //    s represents the point between edgePtA--edgePtB
                        if (!(0 <= retPoint.x && retPoint.x <= 1))
                            continue;
                    }
                    //    As long as our t isn't negative we are at least finding a
                    //    correct hitpoint from m_tMidpoint to percentagePt.
                    if (retPoint.y >= 0) {
                        //    Because the percentage line and all the texture edges are
                        //    rays we should only account for the shortest intersection
                        if (retPoint.y < min_t) {
                            min_t = retPoint.y;
                            index = i;
                        }
                    }
                }
            }

            //    Now that we have the minimum magnitude we can use that to find our intersection
            hit = Point.add(locMidPoint, Point.mult(Point.sub(percentagePt, locMidPoint), min_t));
        }

        //    The size of the vertex data is the index from the hitpoint
        //    the 3 is for the m_tMidpoint, 12 o'clock point and hitpoint position.
        let sameIndexCount = true;
        if (this._vertexDataCount !== index + 3) {
            sameIndexCount = false;
            this._vertexDataCount = index + 3;
        }

        this._updateColor();

        const locVertexData = this._vertexData;
        if (this._transformUpdating || !sameIndexCount) {
            //    First we populate the array with the m_tMidpoint, then all
            //    vertices/texcoords/colors of the 12 'o clock start and edges and the hitpoint
            this._textureCoordFromAlphaPoint(locVertexData[0].texCoords, locMidPoint.x, locMidPoint.y);
            this._vertexFromAlphaPoint(locVertexData[0].vertices, locMidPoint.x, locMidPoint.y);

            this._textureCoordFromAlphaPoint(locVertexData[1].texCoords, topMid.x, topMid.y);
            this._vertexFromAlphaPoint(locVertexData[1].vertices, topMid.x, topMid.y);

            for (i = 0; i < index; i++) {
                const alphaPoint = this._boundaryTexCoord(i);
                this._textureCoordFromAlphaPoint(locVertexData[i + 2].texCoords, alphaPoint.x, alphaPoint.y);
                this._vertexFromAlphaPoint(locVertexData[i + 2].vertices, alphaPoint.x, alphaPoint.y);
            }
        }

        //    hitpoint will go last
        this._textureCoordFromAlphaPoint(locVertexData[this._vertexDataCount - 1].texCoords, hit.x, hit.y);
        this._vertexFromAlphaPoint(locVertexData[this._vertexDataCount - 1].vertices, hit.x, hit.y);
    }

    _boundaryTexCoord(index) {
        if (index < TEXTURE_COORDS_COUNT) {
            const locProTextCoords = TEXTURE_COORDS;
            if (this._node._reverseDirection)
                return new Point((locProTextCoords >> (7 - (index << 1))) & 1, (locProTextCoords >> (7 - ((index << 1) + 1))) & 1);
            else
                return new Point((locProTextCoords >> ((index << 1) + 1)) & 1, (locProTextCoords >> (index << 1)) & 1);
        }
        return new Point(0, 0);
    }

    _textureCoordFromAlphaPoint(coords, ax, ay) {
        const locSprite = this._node._sprite;
        if (!locSprite) {
            coords.u = 0;
            coords.v = 0;
            return;
        }
        const uvs = locSprite._renderCmd._vertices,
            bl = uvs[1],
            tr = uvs[2];
        const min = new Point(bl.u, bl.v);
        const max = new Point(tr.u, tr.v);

        //  Fix bug #1303 so that progress timer handles sprite frame texture rotation
        if (locSprite.textureRectRotated) {
            let temp = ax;
            ax = ay;
            ay = temp;
        }
        coords.u = min.x * (1 - ax) + max.x * ax;
        coords.v = min.y * (1 - ay) + max.y * ay;
    }

    _vertexFromAlphaPoint(vertex, ax, ay) {
        vertex.x = this._bl.x * (1 - ax) + this._tr.x * ax;
        vertex.y = this._bl.y * (1 - ay) + this._tr.y * ay;
        vertex.z = this._node._vertexZ;
    }

    _updateColor() {
        const sp = this._node._sprite;
        if (!this._vertexDataCount || !sp)
            return;

        const color = this._displayedColor;
        const spColor = sp._renderCmd._displayedColor;
        let r = spColor.r;
        let g = spColor.g;
        let b = spColor.b;
        const a = sp._renderCmd._displayedOpacity / 255;
        if (sp._opacityModifyRGB) {
            r *= a;
            g *= a;
            b *= a;
        }
        color.r = r;
        color.g = g;
        color.b = b;
        color.a = sp._renderCmd._displayedOpacity;
        const locVertexData = this._vertexData;
        for (let i = 0, len = this._vertexDataCount; i < len; ++i) {
            locVertexData[i].colors = color;
        }
        this._vertexDataDirty = true;
    }
}
