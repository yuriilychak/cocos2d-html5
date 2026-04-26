/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
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
 * @constant
 * @type Number
 */
cc.TMX_PROPERTY_NONE = 0;

/**
 * @constant
 * @type Number
 */
cc.TMX_PROPERTY_MAP = 1;

/**
 * @constant
 * @type Number
 */
cc.TMX_PROPERTY_LAYER = 2;

/**
 * @constant
 * @type Number
 */
cc.TMX_PROPERTY_OBJECTGROUP = 3;

/**
 * @constant
 * @type Number
 */
cc.TMX_PROPERTY_OBJECT = 4;

/**
 * @constant
 * @type Number
 */
cc.TMX_PROPERTY_TILE = 5;

/**
 * @constant
 * @type Number
 */
cc.TMX_TILE_HORIZONTAL_FLAG = 0x80000000;

/**
 * @constant
 * @type Number
 */
cc.TMX_TILE_VERTICAL_FLAG = 0x40000000;

/**
 * @constant
 * @type Number
 */
cc.TMX_TILE_DIAGONAL_FLAG = 0x20000000;

/**
 * @constant
 * @type Number
 */
cc.TMX_TILE_FLIPPED_ALL =
  (cc.TMX_TILE_HORIZONTAL_FLAG |
    cc.TMX_TILE_VERTICAL_FLAG |
    cc.TMX_TILE_DIAGONAL_FLAG) >>>
  0;

/**
 * @constant
 * @type Number
 */
cc.TMX_TILE_FLIPPED_MASK = ~cc.TMX_TILE_FLIPPED_ALL >>> 0;

// Bits on the far end of the 32-bit global tile ID (GID's) are used for tile flags

/**
 * <p>cc.TMXLayerInfo contains the information about the layers like: <br />
 * - Layer name<br />
 * - Layer size <br />
 * - Layer opacity at creation time (it can be modified at runtime)  <br />
 * - Whether the layer is visible (if it's not visible, then the CocosNode won't be created) <br />
 *  <br />
 * This information is obtained from the TMX file.</p>
 *
 * @property {Array}    properties  - Properties of the layer info.
 */
cc.TMXLayerInfo = class TMXLayerInfo extends cc.NewClass {
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
    this.offset = new cc.Point(0, 0);
  }

  /**
   * Gets the Properties.
   * @return {Array}
   */
  getProperties() {
    return this.properties;
  }

  /**
   * Set the Properties.
   * @param {object} value
   */
  setProperties(value) {
    this.properties = value;
  }
};

/**
 * <p>cc.TMXTilesetInfo contains the information about the tilesets like: <br />
 * - Tileset name<br />
 * - Tileset spacing<br />
 * - Tileset margin<br />
 * - size of the tiles<br />
 * - Image used for the tiles<br />
 * - Image size<br />
 *
 * This information is obtained from the TMX file. </p>
 *
 * @property {string} name - Tileset name
 * @property {number} firstGid - First grid
 * @property {number} spacing - Spacing
 * @property {number} margin - Margin
 * @property {string} sourceImage - Filename containing the tiles (should be sprite sheet / texture atlas)
 * @property {cc.Size|null} imageSize - Size in pixels of the image
 */
cc.TMXTilesetInfo = class TMXTilesetInfo extends cc.NewClass {
  constructor() {
    super();
    //Tileset name
    this.name = "";

    //First grid
    this.firstGid = 0;
    this._tileSize = null;

    //Spacing
    this.spacing = 0;

    //Margin
    this.margin = 0;

    //Filename containing the tiles (should be sprite sheet / texture atlas)
    this.sourceImage = "";

    //Size in pixels of the image
    this.imageSize = null;

    this._tileSize = new cc.Size(0, 0);
    this.imageSize = new cc.Size(0, 0);
  }

  /**
   * Return rect
   * @param {Number} gid
   * @return {cc.Rect}
   */
  rectForGID(gid, result) {
    var rect = result || new cc.Rect(0, 0, 0, 0);
    rect.width = this._tileSize.width;
    rect.height = this._tileSize.height;
    gid &= cc.TMX_TILE_FLIPPED_MASK;
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
};

/**
 * <p>cc.TMXMapInfo contains the information about the map like: <br/>
 *- Map orientation (hexagonal, isometric or orthogonal)<br/>
 *- Tile size<br/>
 *- Map size</p>
 *
 * <p>And it also contains: <br/>
 * - Layers (an array of TMXLayerInfo objects)<br/>
 * - Tilesets (an array of TMXTilesetInfo objects) <br/>
 * - ObjectGroups (an array of TMXObjectGroupInfo objects) </p>
 *
 * <p>This information is obtained from the TMX file. </p>
 *
 * @property {Array}    properties          - Properties of the map info.
 * @property {Number}   orientation         - Map orientation.
 * @property {Object}   parentElement       - Parent element.
 * @property {Number}   parentGID           - Parent GID.
 * @property {Object}   layerAttrs        - Layer attributes.
 * @property {Boolean}  storingCharacters   - Is reading storing characters stream.
 * @property {String}   tmxFileName         - TMX file name.
 * @property {String}   currentString       - Current string stored from characters stream.
 * @property {Number}   mapWidth            - Width of the map
 * @property {Number}   mapHeight           - Height of the map
 * @property {Number}   tileWidth           - Width of a tile
 * @property {Number}   tileHeight          - Height of a tile
 *
 * @param {String} tmxFile fileName or content string
 * @param {String} resourcePath  If tmxFile is a file name ,it is not required.If tmxFile is content string ,it is must required.
 * @example
 * 1.
 * //create a TMXMapInfo with file name
 * var tmxMapInfo = new cc.TMXMapInfo("res/orthogonal-test1.tmx");
 * 2.
 * //create a TMXMapInfo with content string and resource path
 * var resources = "res/TileMaps";
 * var filePath = "res/TileMaps/orthogonal-test1.tmx";
 * var xmlStr = cc.loader.getRes(filePath);
 * var tmxMapInfo = new cc.TMXMapInfo(xmlStr, resources);
 */
/**
 * <p>cc.TMXMapInfo contains the information about the map like: <br/>
 *- Map orientation (hexagonal, isometric or orthogonal)<br/>
 *- Tile size<br/>
 *- Map size</p>
 *
 * <p>And it also contains: <br/>
 * - Layers (an array of TMXLayerInfo objects)<br/>
 * - Tilesets (an array of TMXTilesetInfo objects) <br/>
 * - ObjectGroups (an array of TMXObjectGroupInfo objects) </p>
 *
 * <p>This information is obtained from the TMX file. </p>
 *
 * @property {Array}    properties          - Properties of the map info.
 * @property {Number}   orientation         - Map orientation.
 * @property {Object}   parentElement       - Parent element.
 * @property {Number}   parentGID           - Parent GID.
 * @property {Object}   layerAttrs        - Layer attributes.
 * @property {Boolean}  storingCharacters   - Is reading storing characters stream.
 * @property {String}   tmxFileName         - TMX file name.
 * @property {String}   currentString       - Current string stored from characters stream.
 * @property {Number}   mapWidth            - Width of the map
 * @property {Number}   mapHeight           - Height of the map
 * @property {Number}   tileWidth           - Width of a tile
 * @property {Number}   tileHeight          - Height of a tile
 *
 * @param {String} tmxFile fileName or content string
 * @param {String} resourcePath  If tmxFile is a file name ,it is not required.If tmxFile is content string ,it is must required.
 * @example
 * 1.
 * //create a TMXMapInfo with file name
 * var tmxMapInfo = new cc.TMXMapInfo("res/orthogonal-test1.tmx");
 * 2.
 * //create a TMXMapInfo with content string and resource path
 * var resources = "res/TileMaps";
 * var filePath = "res/TileMaps/orthogonal-test1.tmx";
 * var xmlStr = cc.loader.getRes(filePath);
 * var tmxMapInfo = new cc.TMXMapInfo(xmlStr, resources);
 */
cc.TMXMapInfo = class TMXMapInfo extends cc.SAXParser {
  /**
   * Creates a TMX Format with a tmx file or content string                           <br/>
   * Constructor of cc.TMXMapInfo
   * @param {String} tmxFile fileName or content string
   * @param {String} resourcePath  If tmxFile is a file name ,it is not required.If tmxFile is content string ,it is must required.
   */
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
    // tile properties
    this._tileProperties = null;
    this._resources = "";
    this._currentFirstGID = 0;

    this._mapSize = new cc.Size(0, 0);
    this._tileSize = new cc.Size(0, 0);
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

  /**
   * Gets Map orientation.
   * @return {Number}
   */

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

  /**
   * Set the Map orientation.
   * @param {Number} value
   */
  setOrientation(value) {
    this.orientation = value;
  }

  /**
   * Map width & height
   * @return {cc.Size}
   */
  getMapSize() {
    return new cc.Size(this._mapSize.width, this._mapSize.height);
  }

  /**
   * Map width & height
   * @param {cc.Size} value
   */
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

  /**
   * Tiles width & height
   * @return {cc.Size}
   */
  getTileSize() {
    return new cc.Size(this._tileSize.width, this._tileSize.height);
  }

  /**
   * Tiles width & height
   * @param {cc.Size} value
   */
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

  /**
   * Layers
   * @return {Array}
   */
  getLayers() {
    return this._layers;
  }

  /**
   * Layers
   * @param {cc.TMXLayerInfo} value
   */
  setLayers(value) {
    this._layers.push(value);
  }

  /**
   * tilesets
   * @return {Array}
   */
  getTilesets() {
    return this._tilesets;
  }

  /**
   * tilesets
   * @param {cc.TMXTilesetInfo} value
   */
  setTilesets(value) {
    this._tilesets.push(value);
  }

  /**
   * ObjectGroups
   * @return {Array}
   */
  getObjectGroups() {
    return this._objectGroups;
  }

  /**
   * ObjectGroups
   * @param {cc.TMXObjectGroup} value
   */
  setObjectGroups(value) {
    this._objectGroups.push(value);
  }

  /**
   * parent element
   * @return {Object}
   */
  getParentElement() {
    return this.parentElement;
  }

  /**
   * parent element
   * @param {Object} value
   */
  setParentElement(value) {
    this.parentElement = value;
  }

  /**
   * parent GID
   * @return {Number}
   */
  getParentGID() {
    return this.parentGID;
  }

  /**
   * parent GID
   * @param {Number} value
   */
  setParentGID(value) {
    this.parentGID = value;
  }

  /**
   * Layer attribute
   * @return {Object}
   */
  getLayerAttribs() {
    return this.layerAttrs;
  }

  /**
   * Layer attribute
   * @param {Object} value
   */
  setLayerAttribs(value) {
    this.layerAttrs = value;
  }

  /**
   * Is reading storing characters stream
   * @return {Boolean}
   */
  getStoringCharacters() {
    return this.storingCharacters;
  }

  /**
   * Is reading storing characters stream
   * @param {Boolean} value
   */
  setStoringCharacters(value) {
    this.storingCharacters = value;
  }

  /**
   * Properties
   * @return {Array}
   */
  getProperties() {
    return this.properties;
  }

  /**
   * Properties
   * @param {object} value
   */
  setProperties(value) {
    this.properties = value;
  }

  /**
   * Initializes a TMX format with a  tmx file
   * @param {String} tmxFile
   * @return {Element}
   */
  initWithTMXFile(tmxFile) {
    this._internalInit(tmxFile, null);
    return this.parseXMLFile(tmxFile);
  }

  /**
   * initializes a TMX format with an XML string and a TMX resource path
   * @param {String} tmxString
   * @param {String} resourcePath
   * @return {Boolean}
   */
  initWithXML(tmxString, resourcePath) {
    this._internalInit(null, resourcePath);
    return this.parseXMLString(tmxString);
  }

  /** Initalises parsing of an XML file, either a tmx (Map) file or tsx (Tileset) file
   * @param {String} tmxFile
   * @param {boolean} [isXmlString=false]
   * @return {Element}
   */
  parseXMLFile(tmxFile, isXmlString) {
    isXmlString = isXmlString || false;
    var xmlStr = isXmlString ? tmxFile : cc.loader.getRes(tmxFile);
    if (!xmlStr) throw new Error("Please load the resource first : " + tmxFile);

    var mapXML = this._parseXML(xmlStr);
    var i, j;

    // PARSE <map>
    var map = mapXML.documentElement;

    var version = map.getAttribute("version");
    var orientationStr = map.getAttribute("orientation");

    if (map.nodeName === "map") {
      if (version !== "1.0" && version !== null)
        cc.log("cocos2d: TMXFormat: Unsupported TMX version:" + version);

      if (orientationStr === "orthogonal")
        this.orientation = cc.TMX_ORIENTATION_ORTHO;
      else if (orientationStr === "isometric")
        this.orientation = cc.TMX_ORIENTATION_ISO;
      else if (orientationStr === "hexagonal")
        this.orientation = cc.TMX_ORIENTATION_HEX;
      else if (orientationStr !== null)
        cc.log("cocos2d: TMXFomat: Unsupported orientation:" + orientationStr);

      var mapSize = new cc.Size(0, 0);
      mapSize.width = parseFloat(map.getAttribute("width"));
      mapSize.height = parseFloat(map.getAttribute("height"));
      this.setMapSize(mapSize);

      mapSize = new cc.Size(0, 0);
      mapSize.width = parseFloat(map.getAttribute("tilewidth"));
      mapSize.height = parseFloat(map.getAttribute("tileheight"));
      this.setTileSize(mapSize);

      // The parent element is the map
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

    // PARSE <tileset>
    var tilesets = map.getElementsByTagName("tileset");
    if (map.nodeName !== "map") {
      tilesets = [];
      tilesets.push(map);
    }

    for (i = 0; i < tilesets.length; i++) {
      var selTileset = tilesets[i];
      // If this is an external tileset then start parsing that
      var tsxName = selTileset.getAttribute("source");
      if (tsxName) {
        //this._currentFirstGID = parseInt(selTileset.getAttribute('firstgid'));
        var tsxPath = isXmlString
          ? cc.path.join(this._resources, tsxName)
          : cc.path.changeBasename(tmxFile, tsxName);
        this.parseXMLFile(tsxPath);
      } else {
        var tileset = new cc.TMXTilesetInfo();
        tileset.name = selTileset.getAttribute("name") || "";
        //TODO need fix
        //if(this._currentFirstGID === 0){
        tileset.firstGid = parseInt(selTileset.getAttribute("firstgid")) || 0;
        //}else{
        //    tileset.firstGid = this._currentFirstGID;
        //    this._currentFirstGID = 0;
        //}

        tileset.spacing = parseInt(selTileset.getAttribute("spacing")) || 0;
        tileset.margin = parseInt(selTileset.getAttribute("margin")) || 0;

        var tilesetSize = new cc.Size(0, 0);
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

        // PARSE  <tile>
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

    // PARSE  <layer>
    var layers = map.getElementsByTagName("layer");
    if (layers) {
      for (i = 0; i < layers.length; i++) {
        var selLayer = layers[i];
        var data = selLayer.getElementsByTagName("data")[0];

        var layer = new cc.TMXLayerInfo();
        layer.name = selLayer.getAttribute("name");

        var layerSize = new cc.Size(0, 0);
        layerSize.width = parseFloat(selLayer.getAttribute("width"));
        layerSize.height = parseFloat(selLayer.getAttribute("height"));
        layer._layerSize = layerSize;

        var visible = selLayer.getAttribute("visible");
        layer.visible = !(visible == "0");

        var opacity = selLayer.getAttribute("opacity") || 1;

        if (opacity) layer._opacity = parseInt(255 * parseFloat(opacity));
        else layer._opacity = 255;
        layer.offset = new cc.Point(
          parseFloat(selLayer.getAttribute("x")) || 0,
          parseFloat(selLayer.getAttribute("y")) || 0
        );

        var nodeValue = "";
        for (j = 0; j < data.childNodes.length; j++) {
          nodeValue += data.childNodes[j].nodeValue;
        }
        nodeValue = nodeValue.trim();

        // Unpack the tilemap data
        var compression = data.getAttribute("compression");
        var encoding = data.getAttribute("encoding");
        if (compression && compression !== "gzip" && compression !== "zlib") {
          cc.log(
            "cc.TMXMapInfo.parseXMLFile(): unsupported compression method"
          );
          return null;
        }
        var tiles;
        switch (compression) {
          case "gzip":
            tiles = cc.unzipBase64AsArray(nodeValue, 4);
            break;
          case "zlib":
            tiles = cc.uint8ArrayToUint32Array(
              cc.inflate(
                new Uint8Array(cc.Codec.Base64.decodeAsArray(nodeValue, 1))
              )
            );
            break;
          case null:
          case "":
            // Uncompressed
            if (encoding === "base64")
              tiles = cc.Codec.Base64.decodeAsArray(nodeValue, 4);
            else if (encoding === "csv") {
              tiles = [];
              var csvTiles = nodeValue.split(",");
              for (var csvIdx = 0; csvIdx < csvTiles.length; csvIdx++)
                tiles.push(parseInt(csvTiles[csvIdx]));
            } else {
              //XML format
              var selDataTiles = data.getElementsByTagName("tile");
              tiles = [];
              for (var xmlIdx = 0; xmlIdx < selDataTiles.length; xmlIdx++)
                tiles.push(parseInt(selDataTiles[xmlIdx].getAttribute("gid")));
            }
            break;
          default:
            if (this.layerAttrs === cc.TMXLayerInfo.ATTRIB_NONE)
              cc.log(
                "cc.TMXMapInfo.parseXMLFile(): Only base64 and/or gzip/zlib maps are supported"
              );
            break;
        }
        if (tiles) {
          layer._tiles = new Uint32Array(tiles);
        }

        // The parent element is the last layer
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

    // PARSE <objectgroup>
    var objectGroups = map.getElementsByTagName("objectgroup");
    if (objectGroups) {
      for (i = 0; i < objectGroups.length; i++) {
        var selGroup = objectGroups[i];
        var objectGroup = new cc.TMXObjectGroup();
        objectGroup.groupName = selGroup.getAttribute("name");
        objectGroup.setPositionOffset(
          new cc.Point(
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
            // Add the property to the layer
            objectGroup.properties = groupProp;
          }
        }

        var objects = selGroup.querySelectorAll("object");
        var getContentScaleFactor = cc.director.getContentScaleFactor();
        if (objects) {
          for (j = 0; j < objects.length; j++) {
            var selObj = objects[j];
            // The value for "type" was blank or not a valid class name
            // Create an instance of TMXObjectInfo to store the object and its properties
            var objectProp = {};

            // Set the name of the object to the value for "name"
            objectProp["name"] = selObj.getAttribute("name") || "";

            // Assign all the attributes as key/name pairs in the properties dictionary
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
              cc.director.getContentScaleFactor();

            objectProp["rotation"] =
              parseInt(selObj.getAttribute("rotation")) || 0;

            var docObjProps = selObj.querySelectorAll("properties > property");
            if (docObjProps) {
              for (var k = 0; k < docObjProps.length; k++)
                objectProp[docObjProps[k].getAttribute("name")] =
                  docObjProps[k].getAttribute("value");
            }

            //polygon
            var polygonProps = selObj.querySelectorAll("polygon");
            if (polygonProps && polygonProps.length > 0) {
              var selPgPointStr = polygonProps[0].getAttribute("points");
              if (selPgPointStr)
                objectProp["points"] = this._parsePointsString(selPgPointStr);
            }

            //polyline
            var polylineProps = selObj.querySelectorAll("polyline");
            if (polylineProps && polylineProps.length > 0) {
              var selPlPointStr = polylineProps[0].getAttribute("points");
              if (selPlPointStr)
                objectProp["polylinePoints"] =
                  this._parsePointsString(selPlPointStr);
            }

            // Add the object to the objectGroup
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

  /**
   * initializes parsing of an XML string, either a tmx (Map) string or tsx (Tileset) string
   * @param {String} xmlString
   * @return {Boolean}
   */
  parseXMLString(xmlString) {
    return this.parseXMLFile(xmlString, true);
  }

  /**
   * Gets the tile properties.
   * @return {object}
   */
  getTileProperties() {
    return this._tileProperties;
  }

  /**
   * Set the tile properties.
   * @param {object} tileProperties
   */
  setTileProperties(tileProperties) {
    this._tileProperties.push(tileProperties);
  }

  /**
   * Gets the currentString
   * @return {String}
   */
  getCurrentString() {
    return this.currentString;
  }

  /**
   * Set the currentString
   * @param {String} currentString
   */
  setCurrentString(currentString) {
    this.currentString = currentString;
  }

  /**
   * Gets the tmxFileName
   * @return {String}
   */
  getTMXFileName() {
    return this.tmxFileName;
  }

  /**
   * Set the tmxFileName
   * @param {String} fileName
   */
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

    // tmp vars
    this.currentString = "";
    this.storingCharacters = false;
    this.layerAttrs = cc.TMXLayerInfo.ATTRIB_NONE;
    this.parentElement = cc.TMX_PROPERTY_NONE;
    this._currentFirstGID = 0;
  }
};

cc.loader.register(["tmx", "tsx"], cc._txtLoader);

/**
 * @constant
 * @type Number
 */
cc.TMXLayerInfo.ATTRIB_NONE = 1 << 0;
/**
 * @constant
 * @type Number
 */
cc.TMXLayerInfo.ATTRIB_BASE64 = 1 << 1;
/**
 * @constant
 * @type Number
 */
cc.TMXLayerInfo.ATTRIB_GZIP = 1 << 2;
/**
 * @constant
 * @type Number
 */
cc.TMXLayerInfo.ATTRIB_ZLIB = 1 << 3;
