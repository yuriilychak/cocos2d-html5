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
// TMXTilesetTest
//
//------------------------------------------------------------------
import { s_resprefix } from "../resources";
import { TileDemo } from "./tile-demo";
import { TAG_TILE_MAP } from "./tile-map-test-constants";
import { ServiceLocator } from "@aspect/core";
import { TMXTiledMap } from "@aspect/tilemap";

export class TMXTilesetTest extends TileDemo {
  constructor() {
    super();

    this.testDuration = 1;

    this.pixel1 = { 0: 255, 1: 0, 2: 0, 3: 255 };

    this.pixel2 = { 0: 213, 1: 202, 2: 190, 3: 255 };

    this.pixel3 = { 0: 61, 1: 118, 2: 71, 3: 255 };
    var map = new TMXTiledMap(s_resprefix + "TileMaps/orthogonal-test5.tmx");
    this.addChild(map, 0, TAG_TILE_MAP);

    if (ServiceLocator.sys.capabilities.opengl) {
      var layer;
      layer = map.getLayer("Layer 0");
      layer.texture.setAntiAliasTexParameters();

      layer = map.getLayer("Layer 1");
      layer.texture.setAntiAliasTexParameters();

      layer = map.getLayer("Layer 2");
      layer.texture.setAntiAliasTexParameters();
    }
  }
  title() {
    return "TMX Tileset test";
  }
  // Automation
  getExpectedResult() {
    var ret = { pixel1: "yes", pixel2: "yes", pixel3: "yes" };
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret1 = this.readPixels(53, 80, 5, 5);
    var ret2 = this.readPixels(38, 151, 5, 5);
    var ret3 = this.readPixels(345, 202, 5, 5);
    var ret = {
      pixel1: this.containsPixel(ret1, this.pixel1, false) ? "yes" : "no",
      pixel2: this.containsPixel(ret2, this.pixel2, false) ? "yes" : "no",
      pixel3: this.containsPixel(ret3, this.pixel3, false) ? "yes" : "no"
    };
    return JSON.stringify(ret);
  }
}
