import {
  RendererConfig,
  EGLView,
  Director,
  ShaderCache,
  SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST
} from "@aspect/core";
import {
  TMX_ORIENTATION_ORTHO,
  TMX_ORIENTATION_ISO,
  TMX_ORIENTATION_HEX,
  TMX_TILE_FLIPPED_MASK,
  TMX_TILE_DIAGONAL_FLAG,
  TMX_TILE_HORIZONTAL_FLAG,
  TMX_TILE_VERTICAL_FLAG
} from "./constants";

export class TMXLayerWebGLRenderCmd extends Node.WebGLRenderCmd {
  constructor(renderableObject) {
    super(renderableObject);
    this._needDraw = true;
    this._vertices = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 }
    ];
    this._color = new Uint32Array(1);
    this._shaderProgram = ShaderCache.getInstance().programForKey(
      SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST
    );

    let radian = (Math.PI * 90) / 180;
    this._sin90 = Math.sin(radian);
    this._cos90 = Math.cos(radian);
    radian = radian * 3;
    this._sin270 = Math.sin(radian);
    this._cos270 = Math.cos(radian);
  }

  uploadData(f32buffer, ui32buffer, vertexDataOffset) {
    const node = this._node,
      hasRotation = node._rotationX || node._rotationY,
      layerOrientation = node.layerOrientation,
      tiles = node.tiles;

    if (!tiles) {
      return 0;
    }

    const view = EGLView.getInstance();
    const director = Director.getInstance();
    const winSize = director.getWinSize();
    const rendererConfig = RendererConfig.getInstance();

    const scalex = view._scaleX,
      scaley = view._scaleY,
      maptw = node._mapTileSize.width,
      mapth = node._mapTileSize.height,
      tilew = node.tileset._tileSize.width / director._contentScaleFactor,
      tileh = node.tileset._tileSize.height / director._contentScaleFactor,
      extw = tilew - maptw,
      exth = tileh - mapth,
      winw = winSize.width,
      winh = winSize.height,
      rows = node._layerSize.height,
      cols = node._layerSize.width,
      grids = node._texGrids,
      spTiles = node._spriteTiles,
      wt = this._worldTransform,
      a = wt.a,
      b = wt.b,
      c = wt.c,
      d = wt.d,
      tx = wt.tx,
      ty = wt.ty,
      ox = -node._contentSize.width * node._anchorPoint.x,
      oy = -node._contentSize.height * node._anchorPoint.y,
      mapx = ox * a + oy * c + tx,
      mapy = ox * b + oy * d + ty;

    let opacity = node._opacity,
      cr = this._displayedColor.r,
      cg = this._displayedColor.g,
      cb = this._displayedColor.b;
    if (node._opacityModifyRGB) {
      const ca = opacity / 255;
      cr *= ca;
      cg *= ca;
      cb *= ca;
    }
    this._color[0] = (opacity << 24) | (cb << 16) | (cg << 8) | cr;

    let startCol = 0,
      startRow = 0,
      maxCol = cols,
      maxRow = rows;
    if (!hasRotation && layerOrientation === TMX_ORIENTATION_ORTHO) {
      startCol = Math.floor(-(mapx - extw * a) / (maptw * a));
      startRow = Math.floor(
        (mapy - exth * d + mapth * rows * d - winh) / (mapth * d)
      );
      maxCol = Math.ceil((winw - mapx + extw * a) / (maptw * a));
      maxRow = rows - Math.floor(-(mapy + exth * d) / (mapth * d));
      if (startCol < 0) startCol = 0;
      if (startRow < 0) startRow = 0;
      if (maxCol > cols) maxCol = cols;
      if (maxRow > rows) maxRow = rows;
    }

    let row,
      col,
      offset = vertexDataOffset,
      colOffset = startRow * cols,
      z,
      gid,
      grid;
    const mask = TMX_TILE_FLIPPED_MASK;
    let i,
      top,
      left,
      bottom,
      right,
      w = tilew * a,
      h = tileh * d,
      gt,
      gl,
      gb,
      gr,
      wa = a,
      wb = b,
      wc = c,
      wd = d,
      wtx = tx,
      wty = ty,
      flagged = false,
      flippedX = false,
      flippedY = false;
    const vertices = this._vertices;
    for (row = startRow; row < maxRow; ++row) {
      for (col = startCol; col < maxCol; ++col) {
        if (offset + 24 > f32buffer.length) {
          rendererConfig.renderer._increaseBatchingSize(
            (offset - vertexDataOffset) / 6
          );
          rendererConfig.renderer._batchRendering();
          vertexDataOffset = 0;
          offset = 0;
        }

        z = colOffset + col;
        if (spTiles[z]) {
          continue;
        }

        gid = node.tiles[z];
        grid = grids[(gid & mask) >>> 0];
        if (!grid) {
          continue;
        }

        switch (layerOrientation) {
          case TMX_ORIENTATION_ORTHO:
            left = col * maptw;
            bottom = (rows - row - 1) * mapth;
            z =
              node._vertexZ +
              (rendererConfig.renderer.assignedZStep * z) / tiles.length;
            break;
          case TMX_ORIENTATION_ISO:
            left = (maptw / 2) * (cols + col - row - 1);
            bottom = (mapth / 2) * (rows * 2 - col - row - 2);
            z =
              node._vertexZ +
              (rendererConfig.renderer.assignedZStep *
                (node.height - bottom)) /
                node.height;
            break;
          case TMX_ORIENTATION_HEX:
            left = (col * maptw * 3) / 4;
            bottom =
              (rows - row - 1) * mapth + (col % 2 === 1 ? -mapth / 2 : 0);
            z =
              node._vertexZ +
              (rendererConfig.renderer.assignedZStep *
                (node.height - bottom)) /
                node.height;
            break;
        }
        right = left + tilew;
        top = bottom + tileh;
        if (!hasRotation && layerOrientation === TMX_ORIENTATION_ISO) {
          gb = mapy + bottom * d;
          if (gb > winh + h) {
            col += Math.floor(((gb - winh) * 2) / h) - 1;
            continue;
          }
          gr = mapx + right * a;
          if (gr < -w) {
            col += Math.floor((-gr * 2) / w) - 1;
            continue;
          }
          gl = mapx + left * a;
          gt = mapy + top * d;
          if (gl > winw || gt < 0) {
            col = maxCol;
            continue;
          }
        }
        if (gid > TMX_TILE_DIAGONAL_FLAG) {
          flagged = true;
          flippedX = (gid & TMX_TILE_HORIZONTAL_FLAG) >>> 0;
          flippedY = (gid & TMX_TILE_VERTICAL_FLAG) >>> 0;
        }

        vertices[0].x = left * wa + top * wc + wtx;
        vertices[0].y = left * wb + top * wd + wty;
        vertices[1].x = left * wa + bottom * wc + wtx;
        vertices[1].y = left * wb + bottom * wd + wty;
        vertices[2].x = right * wa + top * wc + wtx;
        vertices[2].y = right * wb + top * wd + wty;
        vertices[3].x = right * wa + bottom * wc + wtx;
        vertices[3].y = right * wb + bottom * wd + wty;

        for (i = 0; i < 4; ++i) {
          f32buffer[offset] = vertices[i].x;
          f32buffer[offset + 1] = vertices[i].y;
          f32buffer[offset + 2] = z;
          ui32buffer[offset + 3] = this._color[0];
          switch (i) {
            case 0:
              f32buffer[offset + 4] = flippedX ? grid.r : grid.l;
              f32buffer[offset + 5] = flippedY ? grid.b : grid.t;
              break;
            case 1:
              f32buffer[offset + 4] = flippedX ? grid.r : grid.l;
              f32buffer[offset + 5] = flippedY ? grid.t : grid.b;
              break;
            case 2:
              f32buffer[offset + 4] = flippedX ? grid.l : grid.r;
              f32buffer[offset + 5] = flippedY ? grid.b : grid.t;
              break;
            case 3:
              f32buffer[offset + 4] = flippedX ? grid.l : grid.r;
              f32buffer[offset + 5] = flippedY ? grid.t : grid.b;
              break;
          }

          offset += 6;
        }
        if (flagged) {
          wa = a;
          wb = b;
          wc = c;
          wd = d;
          wtx = tx;
          wty = ty;
          flippedX = false;
          flippedY = false;
          flagged = false;
        }
      }
      colOffset += cols;
    }
    return (offset - vertexDataOffset) / 6;
  }
}
