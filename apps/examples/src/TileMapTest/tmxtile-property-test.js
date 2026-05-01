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
// TMXTilePropertyTest
//
//------------------------------------------------------------------
import { s_resprefix } from "../resources";
import { TileDemo } from "./tile-demo";
import { TAG_TILE_MAP } from "./tile-map-test-constants";

export class TMXTilePropertyTest extends TileDemo {
  constructor() {
    super();

    this.testDuration = 0.25;

    this.propertiesList = [];
    var map = new cc.TMXTiledMap(
      s_resprefix + "TileMaps/ortho-tile-property.tmx"
    );
    this.addChild(map, 0, TAG_TILE_MAP);

    for (var i = 1; i <= 6; i++) {
      var properties = map.getPropertiesForGID(i);
      this.log("GID:" + i + ", Properties:" + JSON.stringify(properties));
      this.propertiesList.push(properties);
    }
  }
  title() {
    return "TMX Tile Property Test";
  }
  subtitle() {
    return "In the console you should see tile properties";
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = [];
    ret.push({ test: "sss", type: "object" });
    ret.push({ type: "object" });
    ret.push({ type: "object" });
    ret.push({ type: "platform" });
    ret.push({ type: "platform" });
    ret.push({ type: "platform" });
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    return JSON.stringify(this.propertiesList);
  }
}
