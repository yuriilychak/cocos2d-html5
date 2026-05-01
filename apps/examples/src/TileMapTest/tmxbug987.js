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
// TMXBug987
//
//------------------------------------------------------------------
import { s_resprefix } from "../resources";
import { TileDemo } from "./tile-demo";
import { TAG_TILE_MAP } from "./tile-map-test-constants";

export class TMXBug987 extends TileDemo {
  constructor() {
    super();

    this.testDuration = 0.25;

    this.pixel1 = { 0: 162, 1: 152, 2: 98, 3: 255 };

    this.pixel2 = { 0: 255, 1: 208, 2: 148, 3: 255 };

    this.pixel3 = { 0: 182, 1: 182, 2: 146, 3: 255 };
    var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/orthogonal-test6.tmx");
    this.addChild(map, 0, TAG_TILE_MAP);

    this.log("ContentSize:" + map.width + "," + map.height);

    var childs = map.children;
    var node = null;
    for (var i = 0, len = childs.length; i < len; i++) {
      node = childs[i];
      if (!node) break;
      if ("opengl" in cc.sys.capabilities) node.texture.setAliasTexParameters();
    }

    map.anchorX = 0;
    map.anchorY = 0;
    var layer = map.getLayer("Tile Layer 1");
    layer.setTileGID(3, new cc.Point(2, 2));
  }
  title() {
    return "TMX Bug 987";
  }
  subtitle() {
    return "You should see an square";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = { pixel1: "yes", pixel2: "yes", pixel3: "yes" };
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret1 = this.readPixels(64, 224, 5, 5);
    var ret2 = this.readPixels(4, 165, 5, 5);
    var ret3 = this.readPixels(144, 140, 5, 5);
    var ret = {
      pixel1: this.containsPixel(ret1, this.pixel1, false) ? "yes" : "no",
      pixel2: this.containsPixel(ret2, this.pixel2, false) ? "yes" : "no",
      pixel3: this.containsPixel(ret3, this.pixel3, false) ? "yes" : "no"
    };
    return JSON.stringify(ret);
  }
}
