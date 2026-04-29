import {
  AtlasNode,
  Point,
  contentScaleFactor,
  FIX_ARTIFACTS_BY_STRECHING_TEXEL,
  LABELATLAS_DEBUG_DRAW,
  log
} from "@aspect/core";

export class LabelAtlasWebGLRenderCmd extends AtlasNode.WebGLRenderCmd {
  constructor(renderable) {
    super(renderable);
    this._needDraw = true;
  }

  _updateColor() {
    if (this._colorF32Array) {
      const locDisplayedColor = this._displayedColor;
      const a = this._displayedOpacity / 255;
      if (this._node._opacityModifyRGB) {
        this._colorF32Array[0] = (locDisplayedColor.r * a) / 255;
        this._colorF32Array[1] = (locDisplayedColor.g * a) / 255;
        this._colorF32Array[2] = (locDisplayedColor.b * a) / 255;
        this._colorF32Array[3] = a;
      } else {
        this._colorF32Array[0] = locDisplayedColor.r / 255;
        this._colorF32Array[1] = locDisplayedColor.g / 255;
        this._colorF32Array[2] = locDisplayedColor.b / 255;
        this._colorF32Array[3] = a;
      }
    }
  }

  setCascade() {
    const node = this._node;
    node._cascadeOpacityEnabled = true;
    node._cascadeColorEnabled = true;
  }

  rendering(ctx) {
    AtlasNode.WebGLRenderCmd.prototype.rendering.call(this, ctx);
    if (LABELATLAS_DEBUG_DRAW) {
      const node = this._node;
      const s = node.getContentSize();
      const locRect = node.getBoundingBoxToWorld();
      const posX = locRect.x,
        posY = locRect.y;
      s.width = locRect.width;
      s.height = locRect.height;
      const vertices = [
        new Point(posX, posY),
        new Point(posX + s.width, posY),
        new Point(s.width + posX, s.height + posY),
        new Point(posX, posY + s.height)
      ];
      cc.game.drawingUtil.drawPoly(vertices, 4, true);
    }
  }

  updateAtlasValues() {
    const node = this._node;
    const locString = node._string;
    const n = locString.length;
    const locTextureAtlas = this._textureAtlas;

    const texture = locTextureAtlas.texture;
    const textureWide = texture.pixelsWidth;
    const textureHigh = texture.pixelsHeight;
    let itemWidthInPixels = node._itemWidth;
    let itemHeightInPixels = node._itemHeight;
    if (!node._ignoreContentScaleFactor) {
      itemWidthInPixels = node._itemWidth * contentScaleFactor();
      itemHeightInPixels = node._itemHeight * contentScaleFactor();
    }
    if (n > locTextureAtlas.getCapacity())
      log("cc.LabelAtlas._updateAtlasValues(): Invalid String length");
    const quads = locTextureAtlas.quads;
    const locItemWidth = node._itemWidth;
    const locItemHeight = node._itemHeight;
    let i,
      cr = -1;
    for (i = 0; i < n; i++) {
      const a = locString.charCodeAt(i) - node._mapStartChar.charCodeAt(0);
      const row = a % node._itemsPerRow;
      const col = 0 | (a / node._itemsPerRow);
      if (row < 0 || col < 0) continue;
      if (
        row * locItemWidth + locItemWidth > textureWide ||
        col * locItemHeight + locItemHeight > textureHigh
      )
        continue;

      cr++;
      let left, right, top, bottom;
      if (FIX_ARTIFACTS_BY_STRECHING_TEXEL) {
        // Issue #938. Don't use texStepX & texStepY
        left = (2 * row * itemWidthInPixels + 1) / (2 * textureWide);
        right = left + (itemWidthInPixels * 2 - 2) / (2 * textureWide);
        top = (2 * col * itemHeightInPixels + 1) / (2 * textureHigh);
        bottom = top + (itemHeightInPixels * 2 - 2) / (2 * textureHigh);
      } else {
        left = (row * itemWidthInPixels) / textureWide;
        right = left + itemWidthInPixels / textureWide;
        top = (col * itemHeightInPixels) / textureHigh;
        bottom = top + itemHeightInPixels / textureHigh;
      }
      const quad = quads[i];
      const locQuadTL = quad.tl,
        locQuadTR = quad.tr,
        locQuadBL = quad.bl,
        locQuadBR = quad.br;
      locQuadTL.texCoords.u = left;
      locQuadTL.texCoords.v = top;
      locQuadTR.texCoords.u = right;
      locQuadTR.texCoords.v = top;
      locQuadBL.texCoords.u = left;
      locQuadBL.texCoords.v = bottom;
      locQuadBR.texCoords.u = right;
      locQuadBR.texCoords.v = bottom;

      locQuadBL.vertices.x = cr * locItemWidth;
      locQuadBL.vertices.y = 0;
      locQuadBL.vertices.z = 0.0;
      locQuadBR.vertices.x = cr * locItemWidth + locItemWidth;
      locQuadBR.vertices.y = 0;
      locQuadBR.vertices.z = 0.0;
      locQuadTL.vertices.x = cr * locItemWidth;
      locQuadTL.vertices.y = node._itemHeight;
      locQuadTL.vertices.z = 0.0;
      locQuadTR.vertices.x = cr * locItemWidth + locItemWidth;
      locQuadTR.vertices.y = node._itemHeight;
      locQuadTR.vertices.z = 0.0;
    }

    this._updateColor();

    this.updateContentSize(i, cr + 1);
    if (n > 0) {
      locTextureAtlas.dirty = true;
      const totalQuads = locTextureAtlas.totalQuads;
      if (n > totalQuads)
        locTextureAtlas.increaseTotalQuadsWith(n - totalQuads);
    }
  }

  updateContentSize(i, cr) {
    const node = this._node,
      contentSize = node._contentSize;
    if (
      i !== cr &&
      i * node._itemWidth === contentSize.width &&
      node._itemHeight === contentSize.height
    ) {
      node.setContentSize(cr * node._itemWidth, node._itemHeight);
    }
  }

  setString(label) {
    const len = label.length;
    if (len > this._textureAtlas.totalQuads)
      this._textureAtlas.resizeCapacity(len);
  }

  _addChild() {}
}
