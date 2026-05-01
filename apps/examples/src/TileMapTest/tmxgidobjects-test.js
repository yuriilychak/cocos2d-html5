/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

import { s_resprefix } from "../resources";
import { TileDemo } from "./tile-demo";
import { TAG_TILE_MAP } from "./tile-map-test-constants";

export class TMXGIDObjectsTest extends TileDemo {
  constructor() {
    super();

    this.testObjects = [];

    var drawNode = new cc.DrawNode();
    drawNode.setLineWidth(3);
    drawNode.setDrawColor(new cc.Color(255, 255, 255, 255));
    this.addChild(drawNode);

    var map = new cc.TMXTiledMap(
      s_resprefix + "TileMaps/test-object-layer.tmx"
    );
    this.addChild(map, 0, TAG_TILE_MAP);

    this.log("ContentSize:" + map.width + "," + map.height);
    this.log("---. Iterating over all the group objects");

    var group = map.getObjectGroup("Object Layer 1");
    var array = group.getObjects();
    var dict;
    for (var i = 0, len = array.length; i < len; i++) {
      dict = array[i];
      if (!dict) break;
      for (var k in dict) {
        this.log(k + " = " + dict[k]);
      }

      var x = dict["x"],
        y = dict["y"];
      var width = dict["width"],
        height = dict["height"];

      if (width != 0 && height != 0) {
        drawNode.drawSegment(new cc.Point(x, y), new cc.Point(x + width, y));
        drawNode.drawSegment(
          new cc.Point(x + width, y),
          new cc.Point(x + width, y + height)
        );
        drawNode.drawSegment(
          new cc.Point(x + width, y + height),
          new cc.Point(x, y + height)
        );
        drawNode.drawSegment(new cc.Point(x, y + height), new cc.Point(x, y));
      }
    }
    this.testObjects = array;
  }
  title() {
    return "TMX GID objects";
  }
  subtitle() {
    return "Tiles are created from an object group";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = [];
    ret.push({ name: "sandro", type: "", x: 97, y: 6, width: 0, height: 0 });
    ret.push({ name: "", type: "", x: 119, y: 19, width: 0, height: 0 });
    ret.push({ name: "", type: "", x: 140, y: 38, width: 0, height: 0 });
    ret.push({ name: "", type: "", x: 160, y: 57, width: 0, height: 0 });
    ret.push({ name: "", type: "", x: 180, y: 71, width: 0, height: 0 });
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret = [];
    var obj = null;
    for (var i = 0; i < this.testObjects.length; i++) {
      obj = this.testObjects[i];
      ret.push({
        name: obj["name"] || "",
        type: obj["type"] || "",
        x: parseFloat(obj["x"]),
        y: parseFloat(obj["y"]),
        width: parseFloat(obj["width"] || 0),
        height: parseFloat(obj["height"] || 0)
      });
    }
    return JSON.stringify(ret);
  }
}
