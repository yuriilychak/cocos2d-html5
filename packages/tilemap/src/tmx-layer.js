import {
  Node,
  SpriteBatchNode,
  Sprite,
  Size,
  Point,
  log,
  pointPixelsToPoints,
  sizePixelsToPoints,
  rectPixelsToPoints,
  ServiceLocator,
  ShaderName,
  UniformName
} from "@aspect/core";
import {
  TMX_ORIENTATION_ORTHO,
  TMX_ORIENTATION_HEX,
  TMX_ORIENTATION_ISO,
  TMX_TILE_FLIPPED_MASK,
  TMX_TILE_FLIPPED_ALL,
  TMX_TILE_HORIZONTAL_FLAG,
  TMX_TILE_VERTICAL_FLAG,
  TMX_TILE_DIAGONAL_FLAG
} from "./constants";

export class TMXLayer extends SpriteBatchNode {
  constructor(tilesetInfo, layerInfo, mapInfo) {
    super();
    this.tiles = null;
    this.tileset = null;
    this.layerOrientation = null;
    this.properties = null;
    this.layerName = "";

    this._textures = null;
    this._texGrids = null;
    this._spriteTiles = null;

    this._layerSize = null;
    this._mapTileSize = null;
    this._opacity = 255;
    this._minGID = null;
    this._maxGID = null;
    this._vertexZvalue = null;
    this._useAutomaticVertexZ = null;
    this._reusedTile = null;
    this._atlasIndexArray = null;
    this._contentScaleFactor = null;

    this._className = "TMXLayer";

    this._descendants = [];

    this._layerSize = new Size(0, 0);
    this._mapTileSize = new Size(0, 0);
    this._spriteTiles = {};

    if (mapInfo !== undefined)
      this.initWithTilesetInfo(tilesetInfo, layerInfo, mapInfo);
  }

  get layerWidth() {
    return this._getLayerWidth();
  }
  set layerWidth(v) {
    this._setLayerWidth(v);
  }
  get layerHeight() {
    return this._getLayerHeight();
  }
  set layerHeight(v) {
    this._setLayerHeight(v);
  }
  get tileWidth() {
    return this._getTileWidth();
  }
  set tileWidth(v) {
    this._setTileWidth(v);
  }
  get tileHeight() {
    return this._getTileHeight();
  }
  set tileHeight(v) {
    this._setTileHeight(v);
  }

  _createRenderCmd() {
    if (ServiceLocator.rendererConfig.isCanvas)
      return new TMXLayer.CanvasRenderCmd(this);
    else return new TMXLayer.WebGLRenderCmd(this);
  }

  _fillTextureGrids(tileset, texId) {
    var tex = this._textures[texId];
    if (!tex.isLoaded()) {
      tex.addEventListener(
        "load",
        function () {
          this._fillTextureGrids(tileset, texId);
        },
        this
      );
      return;
    }
    if (!tileset.imageSize.width || !tileset.imageSize.height) {
      tileset.imageSize.width = tex.width;
      tileset.imageSize.height = tex.height;
    }
    var tw = tileset._tileSize.width,
      th = tileset._tileSize.height,
      imageW = tex._contentSize.width,
      imageH = tex._contentSize.height,
      spacing = tileset.spacing,
      margin = tileset.margin,
      cols = Math.floor((imageW - margin * 2 + spacing) / (tw + spacing)),
      rows = Math.floor((imageH - margin * 2 + spacing) / (th + spacing)),
      count = rows * cols,
      gid = tileset.firstGid,
      maxGid = tileset.firstGid + count,
      grids = this._texGrids,
      grid = null,
      override = grids[gid] ? true : false;

    for (; gid < maxGid; ++gid) {
      if (override && !grids[gid]) {
        override = false;
      }
      if (!override && grids[gid]) {
        break;
      }

      grid = {
        texId: texId,
        x: 0,
        y: 0,
        width: tw,
        height: th,
        t: 0,
        l: 0,
        r: 0,
        b: 0
      };
      tileset.rectForGID(gid, grid);
      grid.t = grid.y / imageH;
      grid.l = grid.x / imageW;
      grid.r = (grid.x + grid.width) / imageW;
      grid.b = (grid.y + grid.height) / imageH;
      grids[gid] = grid;
    }
  }

  initWithTilesetInfo(tilesetInfo, layerInfo, mapInfo) {
    var size = layerInfo._layerSize;

    this.layerName = layerInfo.name;
    this.tiles = layerInfo._tiles;
    this.properties = layerInfo.properties;
    this._layerSize = size;
    this._minGID = layerInfo._minGID;
    this._maxGID = layerInfo._maxGID;
    this._opacity = layerInfo._opacity;

    this.tileset = tilesetInfo;

    this.layerOrientation = mapInfo.orientation;
    this._mapTileSize = mapInfo.getTileSize();

    var tilesets = mapInfo._tilesets;
    if (tilesets) {
      this._textures = [];
      this._texGrids = [];
      var i,
        len = tilesets.length,
        tileset,
        tex;
      for (i = 0; i < len; ++i) {
        tileset = tilesets[i];
        tex = ServiceLocator.textureCache.addImage(tileset.sourceImage);
        this._textures.push(tex);
        this._fillTextureGrids(tileset, i);
        if (tileset === tilesetInfo) {
          this._texture = tex;
        }
      }
    }

    var offset = this._calculateLayerOffset(layerInfo.offset);
    this.setPosition(pointPixelsToPoints(offset));

    this._parseInternalProperties();

    this.setContentSize(
      sizePixelsToPoints(
        new Size(
          this._layerSize.width * this._mapTileSize.width,
          this._layerSize.height * this._mapTileSize.height
        )
      )
    );
    this._useAutomaticVertexZ = false;
    this._vertexZvalue = 0;
    return true;
  }

  getLayerSize() {
    return new Size(this._layerSize.width, this._layerSize.height);
  }

  setLayerSize(Var) {
    this._layerSize.width = Var.width;
    this._layerSize.height = Var.height;
  }

  _getLayerWidth() {
    return this._layerSize.width;
  }
  _setLayerWidth(width) {
    this._layerSize.width = width;
  }
  _getLayerHeight() {
    return this._layerSize.height;
  }
  _setLayerHeight(height) {
    this._layerSize.height = height;
  }

  getMapTileSize() {
    return new Size(this._mapTileSize.width, this._mapTileSize.height);
  }

  setMapTileSize(Var) {
    this._mapTileSize.width = Var.width;
    this._mapTileSize.height = Var.height;
  }

  _getTileWidth() {
    return this._mapTileSize.width;
  }
  _setTileWidth(width) {
    this._mapTileSize.width = width;
  }
  _getTileHeight() {
    return this._mapTileSize.height;
  }
  _setTileHeight(height) {
    this._mapTileSize.height = height;
  }

  getTiles() {
    return this.tiles;
  }

  setTiles(Var) {
    this.tiles = Var;
  }

  getTileset() {
    return this.tileset;
  }

  setTileset(Var) {
    this.tileset = Var;
  }

  getLayerOrientation() {
    return this.layerOrientation;
  }

  setLayerOrientation(Var) {
    this.layerOrientation = Var;
  }

  getProperties() {
    return this.properties;
  }

  setProperties(Var) {
    this.properties = Var;
  }

  getProperty(propertyName) {
    return this.properties[propertyName];
  }

  getLayerName() {
    return this.layerName;
  }

  setLayerName(layerName) {
    this.layerName = layerName;
  }

  releaseMap() {
    this._spriteTiles = {};
  }

  getTileAt(pos, y) {
    if (pos === undefined) {
      throw new Error("TMXLayer.getTileAt(): pos should be non-null");
    }
    var x = pos;
    if (y === undefined) {
      x = pos.x;
      y = pos.y;
    }
    if (
      x >= this._layerSize.width ||
      y >= this._layerSize.height ||
      x < 0 ||
      y < 0
    ) {
      throw new Error("TMXLayer.getTileAt(): invalid position");
    }
    if (!this.tiles) {
      log("TMXLayer.getTileAt(): TMXLayer: the tiles map has been released");
      return null;
    }

    var tile = null,
      gid = this.getTileGIDAt(x, y);

    if (gid === 0) {
      return tile;
    }

    var z = 0 | (x + y * this._layerSize.width);
    tile = this._spriteTiles[z];
    if (!tile) {
      var rect = this._texGrids[gid];
      var tex = this._textures[rect.texId];
      rect = rectPixelsToPoints(rect);

      tile = new Sprite(tex, rect);
      tile.setPosition(this.getPositionAt(x, y));
      var vertexZ = this._vertexZForPos(x, y);
      tile.setVertexZ(vertexZ);
      tile.setAnchorPoint(0, 0);
      tile.opacity = this._opacity;

      this.addChild(tile, vertexZ, z);
    }
    return tile;
  }

  getTileGIDAt(pos, y) {
    if (pos === undefined) {
      throw new Error("TMXLayer.getTileGIDAt(): pos should be non-null");
    }
    var x = pos;
    if (y === undefined) {
      x = pos.x;
      y = pos.y;
    }
    if (
      x >= this._layerSize.width ||
      y >= this._layerSize.height ||
      x < 0 ||
      y < 0
    ) {
      throw new Error("TMXLayer.getTileGIDAt(): invalid position");
    }
    if (!this.tiles) {
      log("TMXLayer.getTileGIDAt(): TMXLayer: the tiles map has been released");
      return null;
    }

    var idx = 0 | (x + y * this._layerSize.width);
    var tile = this.tiles[idx];

    return (tile & TMX_TILE_FLIPPED_MASK) >>> 0;
  }

  setTileGID(gid, posOrX, flagsOrY, flags) {
    if (posOrX === undefined) {
      throw new Error("TMXLayer.setTileGID(): pos should be non-null");
    }
    var pos;
    if (flags !== undefined) {
      pos = new Point(posOrX, flagsOrY);
    } else {
      pos = posOrX;
      flags = flagsOrY;
    }
    if (
      pos.x >= this._layerSize.width ||
      pos.y >= this._layerSize.height ||
      pos.x < 0 ||
      pos.y < 0
    ) {
      throw new Error("TMXLayer.setTileGID(): invalid position");
    }
    if (!this.tiles) {
      log("TMXLayer.setTileGID(): TMXLayer: the tiles map has been released");
      return;
    }
    if (gid !== 0 && gid < this.tileset.firstGid) {
      log("TMXLayer.setTileGID(): invalid gid:" + gid);
      return;
    }

    flags = flags || 0;
    var currentFlags = this.getTileFlagsAt(pos);
    var currentGID = this.getTileGIDAt(pos);

    if (currentGID !== gid || currentFlags !== flags) {
      var gidAndFlags = (gid | flags) >>> 0;
      if (gid === 0) this.removeTileAt(pos);
      else if (currentGID === 0)
        this._updateTileForGID(gidAndFlags, pos);
      else {
        var z = pos.x + pos.y * this._layerSize.width;
        var sprite = this.getChildByTag(z);
        if (sprite) {
          var rect = this._texGrids[gid];
          var tex = this._textures[rect.texId];
          rect = rectPixelsToPoints(rect);
          sprite.setTexture(tex);
          sprite.setTextureRect(rect, false);
          if (flags != null) this._setupTileSprite(sprite, pos, gidAndFlags);

          this.tiles[z] = gidAndFlags;
        } else {
          this._updateTileForGID(gidAndFlags, pos);
        }
      }
    }
  }

  addChild(child, localZOrder, tag) {
    Node.prototype.addChild.call(this, child, localZOrder, tag);
    if (tag !== undefined) {
      this._spriteTiles[tag] = child;
      child._vertexZ =
        this._vertexZ +
        (ServiceLocator.rendererConfig.renderer.assignedZStep * tag) /
          this.tiles.length;
    }
  }

  removeChild(child, cleanup) {
    if (this._spriteTiles[child.tag]) {
      this._spriteTiles[child.tag] = null;
    }
    Node.prototype.removeChild.call(this, child, cleanup);
  }

  getTileFlagsAt(pos, y) {
    if (!pos)
      throw new Error("TMXLayer.getTileFlagsAt(): pos should be non-null");
    if (y !== undefined) pos = new Point(pos, y);
    if (
      pos.x >= this._layerSize.width ||
      pos.y >= this._layerSize.height ||
      pos.x < 0 ||
      pos.y < 0
    )
      throw new Error("TMXLayer.getTileFlagsAt(): invalid position");
    if (!this.tiles) {
      log(
        "TMXLayer.getTileFlagsAt(): TMXLayer: the tiles map has been released"
      );
      return null;
    }

    var idx = 0 | (pos.x + pos.y * this._layerSize.width);
    var tile = this.tiles[idx];

    return (tile & TMX_TILE_FLIPPED_ALL) >>> 0;
  }

  removeTileAt(pos, y) {
    if (!pos) {
      throw new Error("TMXLayer.removeTileAt(): pos should be non-null");
    }
    if (y !== undefined) {
      pos = new Point(pos, y);
    }
    if (
      pos.x >= this._layerSize.width ||
      pos.y >= this._layerSize.height ||
      pos.x < 0 ||
      pos.y < 0
    ) {
      throw new Error("TMXLayer.removeTileAt(): invalid position");
    }
    if (!this.tiles) {
      log("TMXLayer.removeTileAt(): TMXLayer: the tiles map has been released");
      return;
    }

    var gid = this.getTileGIDAt(pos);
    if (gid !== 0) {
      var z = 0 | (pos.x + pos.y * this._layerSize.width);
      this.tiles[z] = 0;

      var sprite = this._spriteTiles[z];
      if (sprite) {
        this.removeChild(sprite, true);
      }
    }
  }

  getPositionAt(pos, y) {
    if (y !== undefined) pos = new Point(pos, y);
    var ret = new Point(0, 0);
    switch (this.layerOrientation) {
      case TMX_ORIENTATION_ORTHO:
        ret = this._positionForOrthoAt(pos);
        break;
      case TMX_ORIENTATION_ISO:
        ret = this._positionForIsoAt(pos);
        break;
      case TMX_ORIENTATION_HEX:
        ret = this._positionForHexAt(pos);
        break;
    }
    return pointPixelsToPoints(ret);
  }

  _positionForIsoAt(pos) {
    return new Point(
      (this._mapTileSize.width / 2) *
        (this._layerSize.width + pos.x - pos.y - 1),
      (this._mapTileSize.height / 2) *
        (this._layerSize.height * 2 - pos.x - pos.y - 2)
    );
  }

  _positionForOrthoAt(pos) {
    return new Point(
      pos.x * this._mapTileSize.width,
      (this._layerSize.height - pos.y - 1) * this._mapTileSize.height
    );
  }

  _positionForHexAt(pos) {
    var diffY = pos.x % 2 === 1 ? -this._mapTileSize.height / 2 : 0;
    return new Point(
      (pos.x * this._mapTileSize.width * 3) / 4,
      (this._layerSize.height - pos.y - 1) * this._mapTileSize.height + diffY
    );
  }

  _calculateLayerOffset(pos) {
    var ret = new Point(0, 0);
    switch (this.layerOrientation) {
      case TMX_ORIENTATION_ORTHO:
        ret = new Point(
          pos.x * this._mapTileSize.width,
          -pos.y * this._mapTileSize.height
        );
        break;
      case TMX_ORIENTATION_ISO:
        ret = new Point(
          (this._mapTileSize.width / 2) * (pos.x - pos.y),
          (this._mapTileSize.height / 2) * (-pos.x - pos.y)
        );
        break;
      case TMX_ORIENTATION_HEX:
        if (pos.x !== 0 || pos.y !== 0)
          log("offset for hexagonal map not implemented yet");
        break;
    }
    return ret;
  }

  _updateTileForGID(gid, pos) {
    if (!this._texGrids[gid]) {
      return;
    }

    var idx = 0 | (pos.x + pos.y * this._layerSize.width);
    if (idx < this.tiles.length) {
      this.tiles[idx] = gid;
    }
  }

  _parseInternalProperties() {
    var vertexz = this.getProperty("cc_vertexz");
    if (vertexz) {
      if (vertexz === "automatic") {
        this._useAutomaticVertexZ = true;
        var alphaFuncVal = this.getProperty("cc_alpha_func");
        var alphaFuncValue = 0;
        if (alphaFuncVal) alphaFuncValue = parseFloat(alphaFuncVal);

        if (ServiceLocator.rendererConfig.isWebGL) {
          this.shaderProgram = ServiceLocator.shaderCache.programForKey(
            ShaderName.SPRITE_POSITION_TEXTURECOLORALPHATEST
          );
          this.shaderProgram.use();
          this.shaderProgram.setUniformLocationWith1f(
            UniformName.ALPHA_TEST_VALUE,
            alphaFuncValue
          );
        }
      } else this._vertexZvalue = parseInt(vertexz, 10);
    }
  }

  _setupTileSprite(sprite, pos, gid) {
    var posInPixel = this.getPositionAt(pos);
    sprite.setPosition(posInPixel);
    sprite.setVertexZ(this._vertexZForPos(pos));
    sprite.setAnchorPoint(0, 0);
    sprite.opacity = this._opacity;
    sprite.setFlippedX(false);
    sprite.setFlippedY(false);
    sprite.rotation = 0;

    if ((gid & TMX_TILE_DIAGONAL_FLAG) >>> 0) {
      sprite.setAnchorPoint(0.5, 0.5);
      sprite.setPosition(
        posInPixel.x + sprite.width / 2,
        posInPixel.y + sprite.height / 2
      );

      var flag =
        (gid &
          ((TMX_TILE_HORIZONTAL_FLAG | TMX_TILE_VERTICAL_FLAG) >>> 0)) >>>
        0;
      if (flag === TMX_TILE_HORIZONTAL_FLAG) sprite.rotation = 90;
      else if (flag === TMX_TILE_VERTICAL_FLAG) sprite.rotation = 270;
      else if (
        flag ===
        (TMX_TILE_VERTICAL_FLAG | TMX_TILE_HORIZONTAL_FLAG) >>> 0
      ) {
        sprite.rotation = 90;
        sprite.setFlippedX(true);
      } else {
        sprite.rotation = 270;
        sprite.setFlippedX(true);
      }
    } else {
      if ((gid & TMX_TILE_HORIZONTAL_FLAG) >>> 0) {
        sprite.setFlippedX(true);
      }
      if ((gid & TMX_TILE_VERTICAL_FLAG) >>> 0) {
        sprite.setFlippedY(true);
      }
    }
  }

  _vertexZForPos(x, y) {
    if (y === undefined) {
      y = x.y;
      x = x.x;
    }
    var ret = 0;
    var maxVal = 0;
    if (this._useAutomaticVertexZ) {
      switch (this.layerOrientation) {
        case TMX_ORIENTATION_ISO:
          maxVal = this._layerSize.width + this._layerSize.height;
          ret = -(maxVal - (x + y));
          break;
        case TMX_ORIENTATION_ORTHO:
          ret = -(this._layerSize.height - y);
          break;
        case TMX_ORIENTATION_HEX:
          log("TMX Hexa zOrder not supported");
          break;
        default:
          log("TMX invalid value");
          break;
      }
    } else {
      ret = this._vertexZvalue;
    }
    return ret;
  }
}
