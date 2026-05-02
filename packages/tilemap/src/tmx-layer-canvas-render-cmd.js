import {
  RendererConfig,
  Director,
  incrementGLDraws
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

export class TMXLayerCanvasRenderCmd extends Node.CanvasRenderCmd {
  constructor(renderable) {
    super(renderable);
    this._needDraw = true;
  }

  visit(parentCmd) {
    const node = this._node,
      renderer = RendererConfig.getInstance().renderer;

    parentCmd = parentCmd || this.getParentRenderCmd();
    if (parentCmd) {
      this._curLevel = parentCmd._curLevel + 1;
    }

    if (!node._visible) return;

    if (isNaN(node._customZ)) {
      node._vertexZ = renderer.assignedZ;
      renderer.assignedZ += renderer.assignedZStep;
    }

    this._syncStatus(parentCmd);

    const children = node._children,
      spTiles = node._spriteTiles,
      len = children.length;
    let child, i;
    if (len > 0) {
      node.sortAllChildren();
      for (i = 0; i < len; i++) {
        child = children[i];
        if (child._localZOrder < 0) {
          child._renderCmd.visit(this);
        } else {
          break;
        }
      }

      renderer.pushRenderCommand(this);
      for (; i < len; i++) {
        child = children[i];
        if (child._localZOrder === 0 && spTiles[child.tag]) {
          if (isNaN(child._customZ)) {
            child._vertexZ = renderer.assignedZ;
            renderer.assignedZ += renderer.assignedZStep;
          }
          child._renderCmd.updateStatus();
          continue;
        }
        child._renderCmd.visit(this);
      }
    } else {
      renderer.pushRenderCommand(this);
    }
    this._dirtyFlag = 0;
  }

  rendering(ctx, scaleX, scaleY) {
    const node = this._node,
      hasRotation = node._rotationX || node._rotationY,
      layerOrientation = node.layerOrientation,
      tiles = node.tiles,
      alpha = node._opacity / 255;

    if (!tiles || alpha <= 0) {
      return;
    }

    const director = Director.getInstance();
    const winSize = director.getWinSize();
    const rendererConfig = RendererConfig.getInstance();

    const maptw = node._mapTileSize.width,
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
      ox = -node._contentSize.width * node._anchorPoint.x,
      oy = -node._contentSize.height * node._anchorPoint.y,
      a = wt.a,
      b = wt.b,
      c = wt.c,
      d = wt.d,
      mapx = ox * a + oy * c + wt.tx,
      mapy = ox * b + oy * d + wt.ty;

    const wrapper = ctx || rendererConfig.renderContext,
      context = wrapper.getContext();

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

    let i,
      row,
      col,
      colOffset = startRow * cols,
      z,
      gid,
      grid,
      tex,
      cmd;
    const mask = TMX_TILE_FLIPPED_MASK;
    let top, left, bottom, right;
    const dw = tilew,
      dh = tileh,
      w = tilew * a,
      h = tileh * d;
    let gt,
      gl,
      gb,
      gr,
      flippedX = false,
      flippedY = false;

    z = colOffset + startCol;
    for (i in spTiles) {
      if (i < z && spTiles[i]) {
        cmd = spTiles[i]._renderCmd;
        if (spTiles[i]._localZOrder === 0 && !!cmd.rendering) {
          cmd.rendering(ctx, scaleX, scaleY);
        }
      } else if (i >= z) {
        break;
      }
    }

    wrapper.setTransform(wt, scaleX, scaleY);
    wrapper.setGlobalAlpha(alpha);

    for (row = startRow; row < maxRow; ++row) {
      for (col = startCol; col < maxCol; ++col) {
        z = colOffset + col;
        if (spTiles[z]) {
          cmd = spTiles[z]._renderCmd;
          if (spTiles[z]._localZOrder === 0 && !!cmd.rendering) {
            cmd.rendering(ctx, scaleX, scaleY);
            wrapper.setTransform(wt, scaleX, scaleY);
            wrapper.setGlobalAlpha(alpha);
          }
          continue;
        }

        gid = node.tiles[z];
        grid = grids[(gid & mask) >>> 0];
        if (!grid) {
          continue;
        }
        tex = node._textures[grid.texId];
        if (!tex || !tex._htmlElementObj) {
          continue;
        }

        switch (layerOrientation) {
          case TMX_ORIENTATION_ORTHO:
            left = col * maptw;
            bottom = -(rows - row - 1) * mapth;
            break;
          case TMX_ORIENTATION_ISO:
            left = (maptw / 2) * (cols + col - row - 1);
            bottom = (-mapth / 2) * (rows * 2 - col - row - 2);
            break;
          case TMX_ORIENTATION_HEX:
            left = (col * maptw * 3) / 4;
            bottom =
              -(rows - row - 1) * mapth + (col % 2 === 1 ? -mapth / 2 : 0);
            break;
        }
        right = left + tilew;
        top = bottom - tileh;
        if (!hasRotation && layerOrientation === TMX_ORIENTATION_ISO) {
          gb = -mapy + bottom * d;
          if (gb < -winh - h) {
            col += Math.floor(((-winh - gb) * 2) / h) - 1;
            continue;
          }
          gr = mapx + right * a;
          if (gr < -w) {
            col += Math.floor((-gr * 2) / w) - 1;
            continue;
          }
          gl = mapx + left * a;
          gt = -mapy + top * d;
          if (gl > winw || gt > 0) {
            col = maxCol;
            continue;
          }
        }

        if (gid > TMX_TILE_DIAGONAL_FLAG) {
          flippedX = (gid & TMX_TILE_HORIZONTAL_FLAG) >>> 0;
          flippedY = (gid & TMX_TILE_VERTICAL_FLAG) >>> 0;
        }

        if (flippedX) {
          left = -right;
          context.scale(-1, 1);
        }
        if (flippedY) {
          top = -bottom;
          context.scale(1, -1);
        }

        context.drawImage(
          tex._htmlElementObj,
          grid.x,
          grid.y,
          grid.width,
          grid.height,
          left,
          top,
          dw,
          dh
        );
        if (flippedX) {
          context.scale(-1, 1);
        }
        if (flippedY) {
          context.scale(1, -1);
        }
        incrementGLDraws(1);
      }
      colOffset += cols;
    }

    for (i in spTiles) {
      if (i > z && spTiles[i]) {
        cmd = spTiles[i]._renderCmd;
        if (spTiles[i]._localZOrder === 0 && !!cmd.rendering) {
          cmd.rendering(ctx, scaleX, scaleY);
        }
      }
    }
  }
}
