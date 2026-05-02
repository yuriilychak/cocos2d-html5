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

import { s_levelMapTga, s_tilesPng } from "../resources";
import { TileDemo } from "./tile-demo";
import { TAG_TILE_MAP } from "./tile-map-test-constants";
import { Point } from "@aspect/core";
import { Tile } from "@aspect/actions3d";

export class TileMapEditTest extends TileDemo {
  constructor() {
    super();
    var map = new cc.TileMapAtlas(s_tilesPng, s_levelMapTga, 16, 16);
    // Create an Aliased Atlas
    map.texture.setAliasTexParameters();
    this.log("ContentSize: " + map.width + " " + map.height);

    // If you are not going to use the Map, you can free it now
    // [tilemap releaseMap);
    // And if you are going to use, it you can access the data with:

    this.schedule(this.updateMap, 0.2); //:@selector(updateMap:) interval:0.2f);

    this.addChild(map, 0, TAG_TILE_MAP);

    map.anchorX = 0;
    map.anchorY = 0;
    map.x = -20;
    map.y = -200;
  }
  title() {
    return "Editable TileMapAtlas";
  }
  updateMap(dt) {
    // IMPORTANT
    //   The only limitation is that you cannot change an empty, or assign an empty tile to a tile
    //   The value 0 not rendered so don't assign or change a tile with value 0

    var tilemap = this.getChildByTag(TAG_TILE_MAP);

    // NEW since v0.7
    var c = tilemap.getTileAt(new Point(13, 21));
    c.r++;
    c.r %= 50;
    if (c.r == 0) c.r = 1;

    // NEW since v0.7
    tilemap.setTile(c, new Point(13, 21));
  }
}
