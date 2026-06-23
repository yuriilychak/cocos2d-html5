import { BaseClass, Point, Size, Rect } from "@aspect/core";
import { TMX_TILE_FLIPPED_MASK } from "./constants";

/**
 * TMXLayerInfo contains information about TMX layers.
 */
export class TMXLayerInfo extends BaseClass {
  constructor() {
    super();
    this.properties = null;

    this.name = "";
    this._layerSize = null;
    this._tiles = null;
    this.visible = null;
    this._opacity = null;
    this.ownTiles = true;
    this._minGID = 100000;
    this._maxGID = 0;
    this.offset = null;

    this.properties = [];
    this.name = "";
    this._layerSize = null;
    this._tiles = null;
    this.visible = true;
    this._opacity = 0;
    this.ownTiles = true;
    this._minGID = 100000;
    this._maxGID = 0;
    this.offset = new Point();
  }

  getProperties() {
    return this.properties;
  }

  setProperties(value) {
    this.properties = value;
  }
}

TMXLayerInfo.ATTRIB_NONE = 1 << 0;
TMXLayerInfo.ATTRIB_BASE64 = 1 << 1;
TMXLayerInfo.ATTRIB_GZIP = 1 << 2;
TMXLayerInfo.ATTRIB_ZLIB = 1 << 3;

/**
 * TMXTilesetInfo contains the information about tilesets.
 */
export class TMXTilesetInfo extends BaseClass {
  constructor() {
    super();
    this.name = "";
    this.firstGid = 0;
    this._tileSize = null;
    this.spacing = 0;
    this.margin = 0;
    this.sourceImage = "";
    this.imageSize = null;

    this._tileSize = new Size();
    this.imageSize = new Size();
  }

  rectForGID(gid, result) {
    var rect = result || new Rect();
    rect.width = this._tileSize.width;
    rect.height = this._tileSize.height;
    gid &= TMX_TILE_FLIPPED_MASK;
    gid = gid - parseInt(this.firstGid, 10);
    var max_x = parseInt(
      (this.imageSize.width - this.margin * 2 + this.spacing) /
        (this._tileSize.width + this.spacing),
      10
    );
    rect.x = parseInt(
      (gid % max_x) * (this._tileSize.width + this.spacing) + this.margin,
      10
    );
    rect.y = parseInt(
      parseInt(gid / max_x, 10) * (this._tileSize.height + this.spacing) +
        this.margin,
      10
    );
    return rect;
  }
}
