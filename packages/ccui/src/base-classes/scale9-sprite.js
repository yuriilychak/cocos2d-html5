import {
    Node, EventHelper, SpriteFrame, RendererConfig,
    Rect, Size, Point, Color, Sprite, BlendFunc, TextureCache, SpriteFrameCache,
    rectPointsToPixels, contentScaleFactor, FIX_ARTIFACTS_BY_STRECHING_TEXEL,
    BLEND_SRC, BLEND_DST, ONE, SRC_ALPHA, log, error
} from '@aspect/core';

const dataPool = {
    _pool: {},
    _lengths: [],
    put: function (data) {
        var length = data.length;
        if (!this._pool[length]) {
            this._pool[length] = [data];
            this._lengths.push(length);
            this._lengths.sort();
        }
        else {
            this._pool[length].push(data);
        }
    },
    get: function (length) {
        var id;
        for (var i = 0; i < this._lengths.length; i++) {
            if (this._lengths[i] >= length) {
                id = this._lengths[i];
                break;
            }
        }
        if (id) {
            return this._pool[id].pop();
        }
        else {
            return undefined;
        }
    }
};

var cornerId = [], webgl;


var simpleQuadGenerator = {
    _rebuildQuads_base: function (sprite, spriteFrame, contentSize, isTrimmedContentSize) {
        var vertices = sprite._vertices,
            wt = sprite._renderCmd._worldTransform,
            l, b, r, t;
        if (isTrimmedContentSize) {
            l = 0;
            b = 0;
            r = contentSize.width;
            t = contentSize.height;
        } else {
            var originalSize = spriteFrame._originalSize;
            var rect = spriteFrame._rect;
            var offset = spriteFrame._offset;
            var scaleX = contentSize.width / originalSize.width;
            var scaleY = contentSize.height / originalSize.height;
            var trimmLeft = offset.x + (originalSize.width - rect.width) / 2;
            var trimmRight = offset.x - (originalSize.width - rect.width) / 2;
            var trimmedBottom = offset.y + (originalSize.height - rect.height) / 2;
            var trimmedTop = offset.y - (originalSize.height - rect.height) / 2;

            l = trimmLeft * scaleX;
            b = trimmedBottom * scaleY;
            r = contentSize.width + trimmRight * scaleX;
            t = contentSize.height + trimmedTop * scaleY;
        }

        if (vertices.length < 8) {
            dataPool.put(vertices);
            vertices = dataPool.get(8) || new Float32Array(8);
            sprite._vertices = vertices;
        }
        // bl, br, tl, tr
        if (webgl) {
            vertices[0] = l * wt.a + b * wt.c + wt.tx;
            vertices[1] = l * wt.b + b * wt.d + wt.ty;
            vertices[2] = r * wt.a + b * wt.c + wt.tx;
            vertices[3] = r * wt.b + b * wt.d + wt.ty;
            vertices[4] = l * wt.a + t * wt.c + wt.tx;
            vertices[5] = l * wt.b + t * wt.d + wt.ty;
            vertices[6] = r * wt.a + t * wt.c + wt.tx;
            vertices[7] = r * wt.b + t * wt.d + wt.ty;
        }
        else {
            vertices[0] = l;
            vertices[1] = b;
            vertices[2] = r;
            vertices[3] = b;
            vertices[4] = l;
            vertices[5] = t;
            vertices[6] = r;
            vertices[7] = t;
        }

        cornerId[0] = 0;
        cornerId[1] = 2;
        cornerId[2] = 4;
        cornerId[3] = 6;

        if (sprite._uvsDirty) {
            this._calculateUVs(sprite, spriteFrame);
        }

        sprite._vertCount = 4;
    },

    _calculateUVs: function (sprite, spriteFrame) {
        var uvs = sprite._uvs;
        var atlasWidth = spriteFrame._texture._pixelsWide;
        var atlasHeight = spriteFrame._texture._pixelsHigh;
        var textureRect = spriteFrame._rect;
        textureRect = rectPointsToPixels(textureRect);

        if (uvs.length < 8) {
            dataPool.put(uvs);
            uvs = dataPool.get(8) || new Float32Array(8);
            sprite._uvs = uvs;
        }

        var l, b, r, t;
        var texelCorrect = FIX_ARTIFACTS_BY_STRECHING_TEXEL ? 0.5 : 0;

        if (spriteFrame._rotated) {
            l = (textureRect.x + texelCorrect) / atlasWidth;
            b = (textureRect.y + textureRect.width - texelCorrect) / atlasHeight;
            r = (textureRect.x + textureRect.height - texelCorrect) / atlasWidth;
            t = (textureRect.y + texelCorrect) / atlasHeight;
            uvs[0] = l; uvs[1] = t;
            uvs[2] = l; uvs[3] = b;
            uvs[4] = r; uvs[5] = t;
            uvs[6] = r; uvs[7] = b;
        }
        else {
            l = (textureRect.x + texelCorrect) / atlasWidth;
            b = (textureRect.y + textureRect.height - texelCorrect) / atlasHeight;
            r = (textureRect.x + textureRect.width - texelCorrect) / atlasWidth;
            t = (textureRect.y + texelCorrect) / atlasHeight;
            uvs[0] = l; uvs[1] = b;
            uvs[2] = r; uvs[3] = b;
            uvs[4] = l; uvs[5] = t;
            uvs[6] = r; uvs[7] = t;
        }
    }
};

var scale9QuadGenerator = {
    x: new Array(4),
    y: new Array(4),
    _rebuildQuads_base: function (sprite, spriteFrame, contentSize, insetLeft, insetRight, insetTop, insetBottom) {
        var vertices = sprite._vertices;
        var wt = sprite._renderCmd._worldTransform;
        var leftWidth, centerWidth, rightWidth;
        var topHeight, centerHeight, bottomHeight;
        var rect = spriteFrame._rect;

        leftWidth = insetLeft;
        rightWidth = insetRight;
        centerWidth = rect.width - leftWidth - rightWidth;
        topHeight = insetTop;
        bottomHeight = insetBottom;
        centerHeight = rect.height - topHeight - bottomHeight;

        var preferSize = contentSize;
        var sizableWidth = preferSize.width - leftWidth - rightWidth;
        var sizableHeight = preferSize.height - topHeight - bottomHeight;
        var xScale = preferSize.width / (leftWidth + rightWidth);
        var yScale = preferSize.height / (topHeight + bottomHeight);
        xScale = xScale > 1 ? 1 : xScale;
        yScale = yScale > 1 ? 1 : yScale;
        sizableWidth = sizableWidth < 0 ? 0 : sizableWidth;
        sizableHeight = sizableHeight < 0 ? 0 : sizableHeight;
        var x = this.x;
        var y = this.y;
        x[0] = 0;
        x[1] = leftWidth * xScale;
        x[2] = x[1] + sizableWidth;
        x[3] = preferSize.width;
        y[0] = 0;
        y[1] = bottomHeight * yScale;
        y[2] = y[1] + sizableHeight;
        y[3] = preferSize.height;

        if (vertices.length < 32) {
            dataPool.put(vertices);
            vertices = dataPool.get(32) || new Float32Array(32);
            sprite._vertices = vertices;
        }
        var offset = 0, row, col;
        if (webgl) {
            for (row = 0; row < 4; row++) {
                for (col = 0; col < 4; col++) {
                    vertices[offset] = x[col] * wt.a + y[row] * wt.c + wt.tx;
                    vertices[offset+1] = x[col] * wt.b + y[row] * wt.d + wt.ty;
                    offset += 2;
                }
            }
        }
        else {
            for (row = 0; row < 4; row++) {
                for (col = 0; col < 4; col++) {
                    vertices[offset] = x[col];
                    vertices[offset+1] = y[row];
                    offset += 2;
                }
            }
        }

        cornerId[0] = 0;
        cornerId[1] = 6;
        cornerId[2] = 24;
        cornerId[3] = 30;

        if (sprite._uvsDirty) {
            this._calculateUVs(sprite, spriteFrame, insetLeft, insetRight, insetTop, insetBottom);
        }
    },

    _calculateUVs: function (sprite, spriteFrame, insetLeft, insetRight, insetTop, insetBottom) {
        var uvs = sprite._uvs;
        var rect = spriteFrame._rect;
        var atlasWidth = spriteFrame._texture._pixelsWide;
        var atlasHeight = spriteFrame._texture._pixelsHigh;

        var leftWidth, centerWidth, rightWidth;
        var topHeight, centerHeight, bottomHeight;
        var textureRect = spriteFrame._rect;
        textureRect = rectPointsToPixels(textureRect);
        rect = rectPointsToPixels(rect);
        var scale = contentScaleFactor();

        leftWidth = insetLeft * scale;
        rightWidth = insetRight * scale;
        centerWidth = rect.width - leftWidth - rightWidth;
        topHeight = insetTop * scale;
        bottomHeight = insetBottom * scale;
        centerHeight = rect.height - topHeight - bottomHeight;

        if (uvs.length < 32) {
            dataPool.put(uvs);
            uvs = dataPool.get(32) || new Float32Array(32);
            sprite._uvs = uvs;
        }

        var u = this.x;
        var v = this.y;
        var texelCorrect = FIX_ARTIFACTS_BY_STRECHING_TEXEL ? 0.5 : 0;
        var offset = 0, row, col;

        if (spriteFrame._rotated) {
            u[0] = (textureRect.x + texelCorrect) / atlasWidth;
            u[1] = (bottomHeight + textureRect.x) / atlasWidth;
            u[2] = (bottomHeight + centerHeight + textureRect.x) / atlasWidth;
            u[3] = (textureRect.x + textureRect.height - texelCorrect) / atlasWidth;

            v[3] = (textureRect.y + texelCorrect) / atlasHeight;
            v[2] = (leftWidth + textureRect.y) / atlasHeight;
            v[1] = (leftWidth + centerWidth + textureRect.y) / atlasHeight;
            v[0] = (textureRect.y + textureRect.width - texelCorrect) / atlasHeight;

            for (row = 0; row < 4; row++) {
                for (col = 0; col < 4; col++) {
                    uvs[offset] = u[row];
                    uvs[offset+1] = v[3-col];
                    offset += 2;
                }
            }
        }
        else {
            u[0] = (textureRect.x + texelCorrect) / atlasWidth;
            u[1] = (leftWidth + textureRect.x) / atlasWidth;
            u[2] = (leftWidth + centerWidth + textureRect.x) / atlasWidth;
            u[3] = (textureRect.x + textureRect.width - texelCorrect) / atlasWidth;

            v[3] = (textureRect.y + texelCorrect) / atlasHeight;
            v[2] = (topHeight + textureRect.y) / atlasHeight;
            v[1] = (topHeight + centerHeight + textureRect.y) / atlasHeight;
            v[0] = (textureRect.y + textureRect.height - texelCorrect) / atlasHeight;

            for (row = 0; row < 4; row++) {
                for (col = 0; col < 4; col++) {
                    uvs[offset] = u[col];
                    uvs[offset+1] = v[row];
                    offset += 2;
                }
            }
        }
    }
};

export class Scale9Sprite extends EventHelper(Node) {
    constructor(file, rectOrCapInsets, capInsets) {
        super();

        this._spriteFrame = null;
        this._scale9Image = null;

        this._insetLeft = 0;
        this._insetRight = 0;
        this._insetTop = 0;
        this._insetBottom = 0;
        this._blendFunc = null;
        this._renderingType = 1;
        this._brightState = 0;
        this._opacityModifyRGB = false;
        this._rawVerts = null;
        this._rawUvs = null;
        this._vertices = null;
        this._uvs = null;
        this._vertCount = 0;
        this._quadsDirty = true;
        this._uvsDirty = true;
        this._isTriangle = false;
        this._isTrimmedContentSize = false;
        this._textureLoaded = false;

        this._flippedX = false;
        this._flippedY = false;
        this._className = "Scale9Sprite";

        this._loader = new Sprite.LoadManager();

        this._renderCmd.setState(this._brightState);
        this._blendFunc = BlendFunc.ALPHA_PREMULTIPLIED;
        this.setAnchorPoint(new Point(0.5, 0.5));
        this._rawVerts = null;
        this._rawUvs = null;
        this._vertices = dataPool.get(8) || new Float32Array(8);
        this._uvs = dataPool.get(8) || new Float32Array(8);

        if (file !== undefined) {
            if (file instanceof SpriteFrame)
                this.initWithSpriteFrame(file, rectOrCapInsets);
            else {
                var frame = SpriteFrameCache.getInstance().getSpriteFrame(file);
                if (frame)
                    this.initWithSpriteFrame(frame, rectOrCapInsets);
                else
                    this.initWithFile(file, rectOrCapInsets, capInsets);
            }
        }

        if (webgl === undefined) {
            webgl = RendererConfig.getInstance().isWebGL;
        }
    }

    get preferredSize() { return this.getPreferredSize(); }
    set preferredSize(v) { this.setPreferredSize(v); }

    get capInsets() { return this.getCapInsets(); }
    set capInsets(v) { this.setCapInsets(v); }

    get insetLeft() { return this.getInsetLeft(); }
    set insetLeft(v) { this.setInsetLeft(v); }

    get insetTop() { return this.getInsetTop(); }
    set insetTop(v) { this.setInsetTop(v); }

    get insetRight() { return this.getInsetRight(); }
    set insetRight(v) { this.setInsetRight(v); }

    get insetBottom() { return this.getInsetBottom(); }
    set insetBottom(v) { this.setInsetBottom(v); }


    textureLoaded() {
        return this._textureLoaded;
    }

    getCapInsets() {
        return new Rect(this._capInsetsInternal);
    }

    _asyncSetCapInsets() {
        this.removeEventListener('load', this._asyncSetCapInsets, this);
        this.setCapInsets(this._cacheCapInsets);
        this._cacheCapInsets = null;
    }

    setCapInsets(capInsets) {
        if (!this.loaded()) {
            this._cacheCapInsets = capInsets;
            this.removeEventListener('load', this._asyncSetCapInsets, this);
            this.addEventListener('load', this._asyncSetCapInsets, this);
            return false;
        }

        this._capInsetsInternal = capInsets;
        this._updateCapInsets(this._spriteFrame._rect, this._capInsetsInternal);
    }

    _updateCapInsets(rect, capInsets) {
        if(!capInsets || !rect || Rect.equalToZero(capInsets)) {
            rect = rect || {x:0, y:0, width: this._contentSize.width, height: this._contentSize.height};
            this._capInsetsInternal = new Rect(rect.width /3,
                                              rect.height /3,
                                              rect.width /3,
                                              rect.height /3);
        } else {
            this._capInsetsInternal = capInsets;
        }

        if(!Rect.equalToZero(rect)) {
            this._insetLeft = this._capInsetsInternal.x;
            this._insetTop = this._capInsetsInternal.y;
            this._insetRight = rect.width - this._insetLeft - this._capInsetsInternal.width;
            this._insetBottom = rect.height - this._insetTop - this._capInsetsInternal.height;
        }
    }


    initWithFile(file, rect, capInsets) {
        if (file instanceof Rect) {
            file = arguments[1];
            capInsets = arguments[0];
            rect = new Rect(0, 0, 0, 0);
        } else {
            rect = rect || new Rect(0, 0, 0, 0);
            capInsets = capInsets || new Rect(0, 0, 0, 0);
        }

        if(!file)
            throw new Error("ccui.Scale9Sprite.initWithFile(): file should be non-null");

        var texture = TextureCache.getInstance().getTextureForKey(file);
        if (!texture) {
            texture = TextureCache.getInstance().addImage(file);
        }

        var locLoaded = texture.isLoaded();
        this._textureLoaded = locLoaded;
        this._loader.clear();
        if (!locLoaded) {
            this._loader.once(texture, function () {
                this.initWithFile(file, rect, capInsets);
                this.dispatchEvent("load");
            }, this);
            return false;
        }

        if( Rect.equalToZero(rect)) {
            var textureSize = texture.getContentSize();
            rect = new Rect(0, 0, textureSize.width, textureSize.height);
        }
        this.setTexture(texture, rect);
        this._updateCapInsets(rect, capInsets);

        return true;
    }

    updateWithBatchNode(batchNode, originalRect, rotated, capInsets) {
        if (!batchNode) {
            return false;
        }

        var texture = batchNode.getTexture();
        this._loader.clear();
        if (!texture.isLoaded()) {
            this._loader.once(texture, function () {
                this.updateWithBatchNode(batchNode, originalRect, rotated, capInsets);
                this.dispatchEvent("load");
            }, this);
            return false;
        }

        this.setTexture(texture, originalRect);
        this._updateCapInsets(originalRect, capInsets);

        return true;
    }


    initWithSpriteFrame(spriteFrame, capInsets) {
        this.setSpriteFrame(spriteFrame);

        capInsets = capInsets || new Rect(0, 0, 0, 0);

        this._updateCapInsets(spriteFrame._rect, capInsets);
    }

    initWithSpriteFrameName(spriteFrameName, capInsets) {
        if(!spriteFrameName)
            throw new Error("ccui.Scale9Sprite.initWithSpriteFrameName(): spriteFrameName should be non-null");
        capInsets = capInsets || new Rect(0, 0, 0, 0);

        var frame = SpriteFrameCache.getInstance().getSpriteFrame(spriteFrameName);
        if (frame == null) {
            log("ccui.Scale9Sprite.initWithSpriteFrameName(): can't find the sprite frame by spriteFrameName");
            return false;
        }
        this.setSpriteFrame(frame);

        capInsets = capInsets || new Rect(0, 0, 0, 0);

        this._updateCapInsets(frame._rect, capInsets);
    }

    loaded() {
        if (this._spriteFrame === null) {
            return false;
        } else {
            return this._spriteFrame.textureLoaded();
        }
    }

    setTexture(texture, rect) {
        var spriteFrame = new SpriteFrame(texture, rect);
        this.setSpriteFrame(spriteFrame);
    }

    _updateBlendFunc() {
        var blendFunc = this._blendFunc;
        if (!this._spriteFrame || !this._spriteFrame._texture.hasPremultipliedAlpha()) {
            if (blendFunc.src === ONE && blendFunc.dst === BLEND_DST) {
                blendFunc.src = SRC_ALPHA;
            }
            this._opacityModifyRGB = false;
        } else {
            if (blendFunc.src === SRC_ALPHA && blendFunc.dst === BLEND_DST) {
                blendFunc.src = ONE;
            }
            this._opacityModifyRGB = true;
        }
    }

    setOpacityModifyRGB(value) {
        if (this._opacityModifyRGB !== value) {
            this._opacityModifyRGB = value;
            this._renderCmd._setColorDirty();
        }
    }

    isOpacityModifyRGB() {
        return this._opacityModifyRGB;
    }

    setSpriteFrame(spriteFrame) {
        if (spriteFrame) {
            this._spriteFrame = spriteFrame;
            this._quadsDirty = true;
            this._uvsDirty = true;
            var self = this;
            var onResourceDataLoaded = function () {
                if (Size.equalTo(self._contentSize, new Size(0, 0))) {
                    self.setContentSize(self._spriteFrame._rect);
                }
                self._textureLoaded = true;
                self._renderCmd.setDirtyFlag(Node._dirtyFlags.contentDirty);
                RendererConfig.getInstance().renderer.childrenOrderDirty = true;
            };
            self._textureLoaded = spriteFrame.textureLoaded();
            if (self._textureLoaded) {
                onResourceDataLoaded();
            } else {
                this._loader.clear();
                this._loader.once(spriteFrame, function () {
                    onResourceDataLoaded();
                    this.dispatchEvent("load");
                }, this);
            }
        }
    }

    setBlendFunc(blendFunc, dst) {
        if (dst === undefined) {
            this._blendFunc.src = blendFunc.src || BLEND_SRC;
            this._blendFunc.dst = blendFunc.dst || BLEND_DST;
        }
        else {
            this._blendFunc.src = blendFunc || BLEND_SRC;
            this._blendFunc.dst = dst || BLEND_DST;
        }
        this._renderCmd.setDirtyFlag(Node._dirtyFlags.contentDirty);
    }

    getBlendFunc() {
        return new BlendFunc(this._blendFunc.src, this._blendFunc.dst);
    }

    setPreferredSize(preferredSize) {
        if (!preferredSize || Size.equalTo(this._contentSize, preferredSize)) return;
        this.setContentSize(preferredSize);
    }

    getPreferredSize() {
        return this.getContentSize();
    }

    setContentSize(width, height) {
        if (height === undefined) {
            height = width.height;
            width = width.width;
        }
        if (width === this._contentSize.width && height === this._contentSize.height) {
            return;
        }

        super.setContentSize(width, height);
        this._quadsDirty = true;
    }

    getContentSize() {
        if(this._renderingType === Scale9Sprite.RenderingType.SIMPLE) {
            if(this._spriteFrame) {
                return this._spriteFrame._originalSize;
            }
            return new Size(this._contentSize);
        } else {
            return new Size(this._contentSize);
        }
    }

    _setWidth(value) {
        super._setWidth(value);
        this._quadsDirty = true;
    }

    _setHeight(value) {
        super._setHeight(value);
        this._quadsDirty = true;
    }

    setState(state) {
        this._brightState = state;
        this._renderCmd.setState(state);
        this._renderCmd.setDirtyFlag(Node._dirtyFlags.contentDirty);
    }

    getState() {
        return this._brightState;
    }

    setRenderingType(type) {
        if (this._renderingType === type) return;

        this._renderingType = type;
        this._quadsDirty = true;
        this._uvsDirty = true;
        this._renderCmd.setDirtyFlag(Node._dirtyFlags.contentDirty);
    }

    getRenderingType() {
        return this._renderingType;
    }

    setInsetLeft(insetLeft) {
        this._insetLeft = insetLeft;
        this._quadsDirty = true;
        this._uvsDirty = true;
        this._renderCmd.setDirtyFlag(Node._dirtyFlags.contentDirty);
    }

    getInsetLeft() {
        return this._insetLeft;
    }

    setInsetTop(insetTop) {
        this._insetTop = insetTop;
        this._quadsDirty = true;
        this._uvsDirty = true;
        this._renderCmd.setDirtyFlag(Node._dirtyFlags.contentDirty);
    }

    getInsetTop() {
        return this._insetTop;
    }

    setInsetRight(insetRight) {
        this._insetRight = insetRight;
        this._quadsDirty = true;
        this._uvsDirty = true;
        this._renderCmd.setDirtyFlag(Node._dirtyFlags.contentDirty);
    }

    getInsetRight() {
        return this._insetRight;
    }

    setInsetBottom(insetBottom) {
        this._insetBottom = insetBottom;
        this._quadsDirty = true;
        this._uvsDirty = true;
        this._renderCmd.setDirtyFlag(Node._dirtyFlags.contentDirty);
    }

    getInsetBottom() {
        return this._insetBottom;
    }

    _rebuildQuads() {
        if (!this._spriteFrame || !this._spriteFrame._textureLoaded) {
            return;
        }

        this._updateBlendFunc();

        this._isTriangle = false;
        switch (this._renderingType) {
          case RenderingType.SIMPLE:
              simpleQuadGenerator._rebuildQuads_base(this, this._spriteFrame, this._contentSize, this._isTrimmedContentSize);
              break;
          case RenderingType.SLICED:
              scale9QuadGenerator._rebuildQuads_base(this, this._spriteFrame, this._contentSize, this._insetLeft, this._insetRight, this._insetTop, this._insetBottom);
              break;
          default:
              this._quadsDirty = false;
              this._uvsDirty = false;
              error('Can not generate quad');
              return;
        }

        this._quadsDirty = false;
        this._uvsDirty = false;
    }

    _createRenderCmd() {
        if (RendererConfig.getInstance().isCanvas)
            return new this.constructor.CanvasRenderCmd(this);
        else
            return new this.constructor.WebGLRenderCmd(this);
    }
}

Scale9Sprite.createWithSpriteFrame = function (spriteFrame, capInsets) {
    return new Scale9Sprite(spriteFrame, capInsets);
};

Scale9Sprite.createWithSpriteFrameName = function (spriteFrameName, capInsets) {
    return new Scale9Sprite(spriteFrameName, capInsets);
};

Scale9Sprite.POSITIONS_CENTRE = 0;
Scale9Sprite.POSITIONS_TOP = 1;
Scale9Sprite.POSITIONS_LEFT = 2;
Scale9Sprite.POSITIONS_RIGHT = 3;
Scale9Sprite.POSITIONS_BOTTOM = 4;
Scale9Sprite.POSITIONS_TOPRIGHT = 5;
Scale9Sprite.POSITIONS_TOPLEFT = 6;
Scale9Sprite.POSITIONS_BOTTOMRIGHT = 7;

Scale9Sprite.state = {NORMAL: 0, GRAY: 1};

var RenderingType = Scale9Sprite.RenderingType = {
    SIMPLE: 0,
    SLICED: 1
};
