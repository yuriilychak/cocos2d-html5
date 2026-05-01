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

//------------------------------------------------------------------
//
// TMXOrthoFlipRunTimeTest
//
//------------------------------------------------------------------
import { s_resprefix } from "../resources";
import { TileDemo } from "./tile-demo";
import { TAG_TILE_MAP } from "./tile-map-test-constants";
import { Point } from "@aspect/core";

export class TMXOrthoFlipRunTimeTest extends TileDemo {
  constructor() {
    super();

    this.testDuration = 3.2;

    this.pixel = { 0: 41, 1: 42, 2: 54, 3: 255 };

    this.pixel1 = null;
    var map = new cc.TMXTiledMap(
      s_resprefix + "TileMaps/ortho-rotation-test.tmx"
    );
    this.addChild(map, 0, TAG_TILE_MAP);

    this.log("ContentSize:" + map.width + "," + map.height);

    var action = new cc.ScaleBy(2, 0.5);
    map.runAction(action);

    this.schedule(this.onFlipIt, 1);
  }
  title() {
    return "TMX tile flip run time test";
  }
  subtitle() {
    return "in 2 sec bottom left tiles will flip";
  }
  onFlipIt() {
    var map = this.getChildByTag(TAG_TILE_MAP);
    var layer = map.getLayer("Layer 0");

    //blue diamond
    var tileCoord = new Point(1, 10);
    var flags = layer.getTileFlagsAt(tileCoord);
    var GID = layer.getTileGIDAt(tileCoord);
    // Vertical
    if ((flags & cc.TMX_TILE_VERTICAL_FLAG) >>> 0) {
      flags = (flags & (~cc.TMX_TILE_VERTICAL_FLAG >>> 0)) >>> 0;
    } else {
      flags = (flags | cc.TMX_TILE_VERTICAL_FLAG) >>> 0;
    }
    layer.setTileGID(GID, tileCoord, flags);

    tileCoord = new Point(1, 8);
    flags = layer.getTileFlagsAt(tileCoord);
    GID = layer.getTileGIDAt(tileCoord);
    // Vertical
    if ((flags & cc.TMX_TILE_VERTICAL_FLAG) >>> 0)
      flags = (flags & (~cc.TMX_TILE_VERTICAL_FLAG >>> 0)) >>> 0;
    else flags = (flags | cc.TMX_TILE_VERTICAL_FLAG) >>> 0;
    layer.setTileGID(GID, tileCoord, flags);

    tileCoord = new Point(2, 8);
    flags = layer.getTileFlagsAt(tileCoord);
    GID = layer.getTileGIDAt(tileCoord);
    // Horizontal
    if ((flags & cc.TMX_TILE_HORIZONTAL_FLAG) >>> 0)
      flags = (flags & (~cc.TMX_TILE_HORIZONTAL_FLAG >>> 0)) >>> 0;
    else flags = (flags | cc.TMX_TILE_HORIZONTAL_FLAG) >>> 0;
    layer.setTileGID(GID, tileCoord, flags);
  }
  //
  // Automation
  //
  setupAutomation() {
    var fun = function () {
      this.pixel1 = this.readPixels(104, 154, 5, 5);
    };
    this.scheduleOnce(fun, 2.2);
  }
  getExpectedResult() {
    var ret = { pixel1: "yes", pixel2: "yes" };
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    this.pixel2 = this.readPixels(145, 154, 5, 5);
    var ret = {
      pixel1: this.containsPixel(this.pixel1, this.pixel, false) ? "yes" : "no",
      pixel2: this.containsPixel(this.pixel2, this.pixel, false) ? "yes" : "no"
    };
    return JSON.stringify(ret);
  }
}
