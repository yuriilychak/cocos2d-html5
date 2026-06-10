import { SAXParser, Size, Point, Path, log, _txtLoader, ServiceLocator } from "@aspect/core";
import {
  unzipBase64AsArray,
  inflate,
  uint8ArrayToUint32Array,
  Codec
} from "@aspect/compression";
import {
  TMX_ORIENTATION_ORTHO,
  TMX_ORIENTATION_HEX,
  TMX_ORIENTATION_ISO,
  TMX_PROPERTY_NONE
} from "./constants";
import { TMXLayerInfo, TMXTilesetInfo } from "./tmx-layer-info";
import { TMXObjectGroup } from "./tmx-object-group";

export class TMXMapInfo extends SAXParser {
  constructor(tmxFile, resourcePath) {
    super();
    this.properties = null;
    this.orientation = null;
    this.parentElement = null;
    this.parentGID = null;
    this.layerAttrs = 0;
    this.storingCharacters = false;
    this.tmxFileName = null;
    this.currentString = null;

    this._objectGroups = null;
    this._mapSize = null;
    this._tileSize = null;
    this._layers = null;
    this._tilesets = null;
    this._tileProperties = null;
    this._resources = "";
    this._currentFirstGID = 0;

    this._mapSize = new Size(0, 0);
    this._tileSize = new Size(0, 0);
    this._layers = [];
    this._tilesets = [];
    this._objectGroups = [];
    this.properties = [];
    this._tileProperties = {};

    this._currentFirstGID = 0;

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

  getOrientation() {
    return this.orientation;
  }

  setOrientation(value) {
    this.orientation = value;
  }

  getMapSize() {
    return new Size(this._mapSize.width, this._mapSize.height);
  }

  setMapSize(value) {
    this._mapSize.width = value.width;
    this._mapSize.height = value.height;
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

  setTileSize(value) {
    this._tileSize.width = value.width;
    this._tileSize.height = value.height;
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

  getLayers() {
    return this._layers;
  }

  setLayers(value) {
    this._layers.push(value);
  }

  getTilesets() {
    return this._tilesets;
  }

  setTilesets(value) {
    this._tilesets.push(value);
  }

  getObjectGroups() {
    return this._objectGroups;
  }

  setObjectGroups(value) {
    this._objectGroups.push(value);
  }

  getParentElement() {
    return this.parentElement;
  }

  setParentElement(value) {
    this.parentElement = value;
  }

  getParentGID() {
    return this.parentGID;
  }

  setParentGID(value) {
    this.parentGID = value;
  }

  getLayerAttribs() {
    return this.layerAttrs;
  }

  setLayerAttribs(value) {
    this.layerAttrs = value;
  }

  getStoringCharacters() {
    return this.storingCharacters;
  }

  setStoringCharacters(value) {
    this.storingCharacters = value;
  }

  getProperties() {
    return this.properties;
  }

  setProperties(value) {
    this.properties = value;
  }

  initWithTMXFile(tmxFile) {
    this._internalInit(tmxFile, null);
    return this.parseXMLFile(tmxFile);
  }

  initWithXML(tmxString, resourcePath) {
    this._internalInit(null, resourcePath);
    return this.parseXMLString(tmxString);
  }

  parseXMLFile(tmxFile, isXmlString) {
    isXmlString = isXmlString || false;
    var xmlStr = isXmlString ? tmxFile : ServiceLocator.loader.getRes(tmxFile);
    if (!xmlStr) throw new Error("Please load the resource first : " + tmxFile);

    var mapXML = this._parseXML(xmlStr);
    var i, j;

    var map = mapXML.documentElement;

    var version = map.getAttribute("version");
    var orientationStr = map.getAttribute("orientation");

    if (map.nodeName === "map") {
      if (version !== "1.0" && version !== null)
        log("cocos2d: TMXFormat: Unsupported TMX version:" + version);

      if (orientationStr === "orthogonal")
        this.orientation = TMX_ORIENTATION_ORTHO;
      else if (orientationStr === "isometric")
        this.orientation = TMX_ORIENTATION_ISO;
      else if (orientationStr === "hexagonal")
        this.orientation = TMX_ORIENTATION_HEX;
      else if (orientationStr !== null)
        log("cocos2d: TMXFomat: Unsupported orientation:" + orientationStr);

      var mapSize = new Size(0, 0);
      mapSize.width = parseFloat(map.getAttribute("width"));
      mapSize.height = parseFloat(map.getAttribute("height"));
      this.setMapSize(mapSize);

      mapSize = new Size(0, 0);
      mapSize.width = parseFloat(map.getAttribute("tilewidth"));
      mapSize.height = parseFloat(map.getAttribute("tileheight"));
      this.setTileSize(mapSize);

      var propertyArr = map.querySelectorAll("map > properties >  property");
      if (propertyArr) {
        var aPropertyDict = {};
        for (i = 0; i < propertyArr.length; i++) {
          aPropertyDict[propertyArr[i].getAttribute("name")] =
            propertyArr[i].getAttribute("value");
        }
        this.properties = aPropertyDict;
      }
    }

    var tilesets = map.getElementsByTagName("tileset");
    if (map.nodeName !== "map") {
      tilesets = [];
      tilesets.push(map);
    }

    for (i = 0; i < tilesets.length; i++) {
      var selTileset = tilesets[i];
      var tsxName = selTileset.getAttribute("source");
      if (tsxName) {
        var tsxPath = isXmlString
          ? Path.join(this._resources, tsxName)
          : Path.changeBasename(tmxFile, tsxName);
        this.parseXMLFile(tsxPath);
      } else {
        var tileset = new TMXTilesetInfo();
        tileset.name = selTileset.getAttribute("name") || "";
        tileset.firstGid = parseInt(selTileset.getAttribute("firstgid")) || 0;

        tileset.spacing = parseInt(selTileset.getAttribute("spacing")) || 0;
        tileset.margin = parseInt(selTileset.getAttribute("margin")) || 0;

        var tilesetSize = new Size(0, 0);
        tilesetSize.width = parseFloat(selTileset.getAttribute("tilewidth"));
        tilesetSize.height = parseFloat(selTileset.getAttribute("tileheight"));
        tileset._tileSize = tilesetSize;

        var image = selTileset.getElementsByTagName("image")[0];
        var imagename = image.getAttribute("source");
        var num = -1;
        if (this.tmxFileName) num = this.tmxFileName.lastIndexOf("/");
        if (num !== -1) {
          var dir = this.tmxFileName.substr(0, num + 1);
          tileset.sourceImage = dir + imagename;
        } else {
          tileset.sourceImage =
            this._resources + (this._resources ? "/" : "") + imagename;
        }
        this.setTilesets(tileset);

        var tiles = selTileset.getElementsByTagName("tile");
        if (tiles) {
          for (var tIdx = 0; tIdx < tiles.length; tIdx++) {
            var t = tiles[tIdx];
            this.parentGID =
              parseInt(tileset.firstGid) + parseInt(t.getAttribute("id") || 0);
            var tp = t.querySelectorAll("properties > property");
            if (tp) {
              var dict = {};
              for (j = 0; j < tp.length; j++) {
                var name = tp[j].getAttribute("name");
                dict[name] = tp[j].getAttribute("value");
              }
              this._tileProperties[this.parentGID] = dict;
            }
          }
        }
      }
    }

    var layers = map.getElementsByTagName("layer");
    if (layers) {
      for (i = 0; i < layers.length; i++) {
        var selLayer = layers[i];
        var data = selLayer.getElementsByTagName("data")[0];

        var layer = new TMXLayerInfo();
        layer.name = selLayer.getAttribute("name");

        var layerSize = new Size(0, 0);
        layerSize.width = parseFloat(selLayer.getAttribute("width"));
        layerSize.height = parseFloat(selLayer.getAttribute("height"));
        layer._layerSize = layerSize;

        var visible = selLayer.getAttribute("visible");
        layer.visible = !(visible == "0");

        var opacity = selLayer.getAttribute("opacity") || 1;

        if (opacity) layer._opacity = parseInt(255 * parseFloat(opacity));
        else layer._opacity = 255;
        layer.offset = new Point(
          parseFloat(selLayer.getAttribute("x")) || 0,
          parseFloat(selLayer.getAttribute("y")) || 0
        );

        var nodeValue = "";
        for (j = 0; j < data.childNodes.length; j++) {
          nodeValue += data.childNodes[j].nodeValue;
        }
        nodeValue = nodeValue.trim();

        var compression = data.getAttribute("compression");
        var encoding = data.getAttribute("encoding");
        if (compression && compression !== "gzip" && compression !== "zlib") {
          log(
            "TMXMapInfo.parseXMLFile(): unsupported compression method"
          );
          return null;
        }
        var tiles;
        switch (compression) {
          case "gzip":
            tiles = unzipBase64AsArray(nodeValue, 4);
            break;
          case "zlib":
            tiles = uint8ArrayToUint32Array(
              inflate(
                new Uint8Array(Codec.Base64.decodeAsArray(nodeValue, 1))
              )
            );
            break;
          case null:
          case "":
            if (encoding === "base64")
              tiles = Codec.Base64.decodeAsArray(nodeValue, 4);
            else if (encoding === "csv") {
              tiles = [];
              var csvTiles = nodeValue.split(",");
              for (var csvIdx = 0; csvIdx < csvTiles.length; csvIdx++)
                tiles.push(parseInt(csvTiles[csvIdx]));
            } else {
              var selDataTiles = data.getElementsByTagName("tile");
              tiles = [];
              for (var xmlIdx = 0; xmlIdx < selDataTiles.length; xmlIdx++)
                tiles.push(parseInt(selDataTiles[xmlIdx].getAttribute("gid")));
            }
            break;
          default:
            if (this.layerAttrs === TMXLayerInfo.ATTRIB_NONE)
              log(
                "TMXMapInfo.parseXMLFile(): Only base64 and/or gzip/zlib maps are supported"
              );
            break;
        }
        if (tiles) {
          layer._tiles = new Uint32Array(tiles);
        }

        var layerProps = selLayer.querySelectorAll("properties > property");
        if (layerProps) {
          var layerProp = {};
          for (j = 0; j < layerProps.length; j++) {
            layerProp[layerProps[j].getAttribute("name")] =
              layerProps[j].getAttribute("value");
          }
          layer.properties = layerProp;
        }
        this.setLayers(layer);
      }
    }

    var objectGroups = map.getElementsByTagName("objectgroup");
    if (objectGroups) {
      for (i = 0; i < objectGroups.length; i++) {
        var selGroup = objectGroups[i];
        var objectGroup = new TMXObjectGroup();
        objectGroup.groupName = selGroup.getAttribute("name");
        objectGroup.setPositionOffset(
          new Point(
            parseFloat(selGroup.getAttribute("x")) * this.getTileSize().width ||
              0,
            parseFloat(selGroup.getAttribute("y")) *
              this.getTileSize().height || 0
          )
        );

        var groupProps = selGroup.querySelectorAll(
          "objectgroup > properties > property"
        );
        if (groupProps) {
          for (j = 0; j < groupProps.length; j++) {
            var groupProp = {};
            groupProp[groupProps[j].getAttribute("name")] =
              groupProps[j].getAttribute("value");
            objectGroup.properties = groupProp;
          }
        }

        var objects = selGroup.querySelectorAll("object");
        var getContentScaleFactor = ServiceLocator.director.getContentScaleFactor();
        if (objects) {
          for (j = 0; j < objects.length; j++) {
            var selObj = objects[j];
            var objectProp = {};

            objectProp["name"] = selObj.getAttribute("name") || "";
            objectProp["type"] = selObj.getAttribute("type") || "";

            objectProp["width"] = parseInt(selObj.getAttribute("width")) || 0;
            objectProp["height"] = parseInt(selObj.getAttribute("height")) || 0;

            objectProp["x"] =
              (((selObj.getAttribute("x") || 0) | 0) +
                objectGroup.getPositionOffset().x) /
              getContentScaleFactor;
            var y =
              ((selObj.getAttribute("y") || 0) | 0) +
              objectGroup.getPositionOffset().y / getContentScaleFactor;
            // Correct y position. (Tiled uses Flipped, cocos2d uses Standard)
            objectProp["y"] =
              (parseInt(this.getMapSize().height * this.getTileSize().height) -
                y -
                objectProp["height"]) /
              ServiceLocator.director.getContentScaleFactor();

            objectProp["rotation"] =
              parseInt(selObj.getAttribute("rotation")) || 0;

            var docObjProps = selObj.querySelectorAll("properties > property");
            if (docObjProps) {
              for (var k = 0; k < docObjProps.length; k++)
                objectProp[docObjProps[k].getAttribute("name")] =
                  docObjProps[k].getAttribute("value");
            }

            var polygonProps = selObj.querySelectorAll("polygon");
            if (polygonProps && polygonProps.length > 0) {
              var selPgPointStr = polygonProps[0].getAttribute("points");
              if (selPgPointStr)
                objectProp["points"] = this._parsePointsString(selPgPointStr);
            }

            var polylineProps = selObj.querySelectorAll("polyline");
            if (polylineProps && polylineProps.length > 0) {
              var selPlPointStr = polylineProps[0].getAttribute("points");
              if (selPlPointStr)
                objectProp["polylinePoints"] =
                  this._parsePointsString(selPlPointStr);
            }

            objectGroup.setObjects(objectProp);
          }
        }

        this.setObjectGroups(objectGroup);
      }
    }
    return map;
  }

  _parsePointsString(pointsString) {
    if (!pointsString) return null;

    var points = [];
    var pointsStr = pointsString.split(" ");
    for (var i = 0; i < pointsStr.length; i++) {
      var selPointStr = pointsStr[i].split(",");
      points.push({ x: selPointStr[0], y: selPointStr[1] });
    }
    return points;
  }

  parseXMLString(xmlString) {
    return this.parseXMLFile(xmlString, true);
  }

  getTileProperties() {
    return this._tileProperties;
  }

  setTileProperties(tileProperties) {
    this._tileProperties.push(tileProperties);
  }

  getCurrentString() {
    return this.currentString;
  }

  setCurrentString(currentString) {
    this.currentString = currentString;
  }

  getTMXFileName() {
    return this.tmxFileName;
  }

  setTMXFileName(fileName) {
    this.tmxFileName = fileName;
  }

  _internalInit(tmxFileName, resourcePath) {
    this._tilesets.length = 0;
    this._layers.length = 0;

    this.tmxFileName = tmxFileName;
    if (resourcePath) this._resources = resourcePath;

    this._objectGroups.length = 0;
    this.properties.length = 0;
    this._tileProperties.length = 0;

    this.currentString = "";
    this.storingCharacters = false;
    this.layerAttrs = TMXLayerInfo.ATTRIB_NONE;
    this.parentElement = TMX_PROPERTY_NONE;
    this._currentFirstGID = 0;
  }
}

ServiceLocator.loader.register(["tmx", "tsx"], _txtLoader);
