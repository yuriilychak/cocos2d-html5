import { Node, Size, log } from "@aspect/core";
import { TMXMapInfo } from "./tmx-map-info";
import { TMXLayer } from "./tmx-layer";
import { TMX_TILE_FLIPPED_MASK } from "./constants";

export class TMXTiledMap extends Node {
  constructor(tmxFile, resourcePath) {
    super();
    this.properties = null;
    this.mapOrientation = null;
    this.objectGroups = null;

    this._mapSize = null;
    this._tileSize = null;
    this._tileProperties = null;
    this._className = "TMXTiledMap";

    this._mapSize = new Size(0, 0);
    this._tileSize = new Size(0, 0);

    if (resourcePath !== undefined) {
      this.initWithXML(tmxFile, resourcePath);
    } else if (tmxFile !== undefined) {
      this.initWithTMXFile(tmxFile);
    }
  }

  get mapWidth() {
    return this._getMapWidth();
  }
  set mapWidth(v) {
    this._setMapWidth(v);
  }
  get mapHeight() {
    return this._getMapHeight();
  }
  set mapHeight(v) {
    this._setMapHeight(v);
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

  getMapSize() {
    return new Size(this._mapSize.width, this._mapSize.height);
  }

  setMapSize(Var) {
    this._mapSize.width = Var.width;
    this._mapSize.height = Var.height;
  }

  _getMapWidth() {
    return this._mapSize.width;
  }
  _setMapWidth(width) {
    this._mapSize.width = width;
  }
  _getMapHeight() {
    return this._mapSize.height;
  }
  _setMapHeight(height) {
    this._mapSize.height = height;
  }

  getTileSize() {
    return new Size(this._tileSize.width, this._tileSize.height);
  }

  setTileSize(Var) {
    this._tileSize.width = Var.width;
    this._tileSize.height = Var.height;
  }

  _getTileWidth() {
    return this._tileSize.width;
  }
  _setTileWidth(width) {
    this._tileSize.width = width;
  }
  _getTileHeight() {
    return this._tileSize.height;
  }
  _setTileHeight(height) {
    this._tileSize.height = height;
  }

  getMapOrientation() {
    return this.mapOrientation;
  }

  setMapOrientation(Var) {
    this.mapOrientation = Var;
  }

  getObjectGroups() {
    return this.objectGroups;
  }

  setObjectGroups(Var) {
    this.objectGroups = Var;
  }

  getProperties() {
    return this.properties;
  }

  setProperties(Var) {
    this.properties = Var;
  }

  initWithTMXFile(tmxFile) {
    if (!tmxFile || tmxFile.length === 0)
      throw new Error(
        "TMXTiledMap.initWithTMXFile(): tmxFile should be non-null or non-empty string."
      );
    this.width = 0;
    this.height = 0;
    var mapInfo = new TMXMapInfo(tmxFile);
    if (!mapInfo) return false;

    var locTilesets = mapInfo.getTilesets();
    if (!locTilesets || locTilesets.length === 0)
      log(
        "TMXTiledMap.initWithTMXFile(): Map not found. Please check the filename."
      );
    this._buildWithMapInfo(mapInfo);
    return true;
  }

  initWithXML(tmxString, resourcePath) {
    this.width = 0;
    this.height = 0;

    var mapInfo = new TMXMapInfo(tmxString, resourcePath);
    var locTilesets = mapInfo.getTilesets();
    if (!locTilesets || locTilesets.length === 0)
      log(
        "TMXTiledMap.initWithXML(): Map not found. Please check the filename."
      );
    this._buildWithMapInfo(mapInfo);
    return true;
  }

  _buildWithMapInfo(mapInfo) {
    this._mapSize = mapInfo.getMapSize();
    this._tileSize = mapInfo.getTileSize();
    this.mapOrientation = mapInfo.orientation;
    this.objectGroups = mapInfo.getObjectGroups();
    this.properties = mapInfo.properties;
    this._tileProperties = mapInfo.getTileProperties();

    var idx = 0;
    var layers = mapInfo.getLayers();
    if (layers) {
      var layerInfo = null;
      for (var i = 0, len = layers.length; i < len; i++) {
        layerInfo = layers[i];
        if (layerInfo && layerInfo.visible) {
          var child = this._parseLayer(layerInfo, mapInfo);
          this.addChild(child, idx, idx);
          this.width = Math.max(this.width, child.width);
          this.height = Math.max(this.height, child.height);
          idx++;
        }
      }
    }
  }

  allLayers() {
    var retArr = [],
      locChildren = this._children;
    for (var i = 0, len = locChildren.length; i < len; i++) {
      var layer = locChildren[i];
      if (layer && layer instanceof TMXLayer) retArr.push(layer);
    }
    return retArr;
  }

  getLayer(layerName) {
    if (!layerName || layerName.length === 0)
      throw new Error(
        "TMXTiledMap.getLayer(): layerName should be non-null or non-empty string."
      );
    var locChildren = this._children;
    for (var i = 0; i < locChildren.length; i++) {
      var layer = locChildren[i];
      if (layer && layer.layerName === layerName) return layer;
    }
    return null;
  }

  getObjectGroup(groupName) {
    if (!groupName || groupName.length === 0)
      throw new Error(
        "TMXTiledMap.getObjectGroup(): groupName should be non-null or non-empty string."
      );
    if (this.objectGroups) {
      for (var i = 0; i < this.objectGroups.length; i++) {
        var objectGroup = this.objectGroups[i];
        if (objectGroup && objectGroup.groupName === groupName) {
          return objectGroup;
        }
      }
    }
    return null;
  }

  getProperty(propertyName) {
    return this.properties[propertyName.toString()];
  }

  getPropertiesForGID(GID) {
    return this._tileProperties[GID];
  }

  _parseLayer(layerInfo, mapInfo) {
    var tileset = this._tilesetForLayer(layerInfo, mapInfo);
    var layer = new TMXLayer(tileset, layerInfo, mapInfo);
    layerInfo.ownTiles = false;
    return layer;
  }

  _tilesetForLayer(layerInfo, mapInfo) {
    var size = layerInfo._layerSize;
    var tilesets = mapInfo.getTilesets();
    if (tilesets) {
      for (var i = tilesets.length - 1; i >= 0; i--) {
        var tileset = tilesets[i];
        if (tileset) {
          for (var y = 0; y < size.height; y++) {
            for (var x = 0; x < size.width; x++) {
              var pos = x + size.width * y;
              var gid = layerInfo._tiles[pos];
              if (gid !== 0) {
                if (
                  (gid & TMX_TILE_FLIPPED_MASK) >>> 0 >=
                  tileset.firstGid
                ) {
                  return tileset;
                }
              }
            }
          }
        }
      }
    }

    log("cocos2d: Warning: TMX Layer " + layerInfo.name + " has no tiles");
    return null;
  }
}