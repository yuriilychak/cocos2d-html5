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
// TMXOrthoTest4
//
//------------------------------------------------------------------
import { s_resprefix } from "../resources";
import { TileDemo } from "./tile-demo";
import { TAG_TILE_MAP } from "./tile-map-test-constants";
import { Point } from "@aspect/core";

export class TMXOrthoTest4 extends TileDemo {
  constructor() {
    super();

    this.testDuration = 3;

    this.testLayerSize = null;

    this.pixel = { 0: 0, 1: 0, 2: 0, 3: 255 };
    var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/orthogonal-test4.tmx");
    this.addChild(map, 0, TAG_TILE_MAP);

    map.anchorX = 0;
    map.anchorY = 0;

    var layer = map.getLayer("Layer 0");
    var s = layer.getLayerSize();

    this.tx = s.width - 10;
    this.ty = s.height - 1;

    var sprite;
    sprite = layer.getTileAt(new Point(0, 0));
    sprite.scale = 2;

    sprite = layer.getTileAt(new Point(s.width - 1, 0));
    sprite.scale = 2;

    sprite = layer.getTileAt(new Point(0, s.height - 1));
    sprite.scale = 2;

    sprite = layer.getTileAt(new Point(s.width - 1, s.height - 1));
    sprite.scale = 2;

    this.scheduleOnce(this.onRemoveSprite, 0.2);
  }
  onRemoveSprite(dt) {
    var map = this.getChildByTag(TAG_TILE_MAP);

    var layer = map.getLayer("Layer 0");
    var layerSize = layer.getLayerSize();

    var sprite = layer.getTileAt(new Point(layerSize.width - 1, 0));
    layer.removeChild(sprite, true);

    this.testLayerSize = layerSize;
  }
  title() {
    return "TMX width/height test";
  }

  //
  // Automation
  //
  getExpectedResult() {
    var ret = { width: 14, height: 8, pixel: "yes" };
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret1 = this.readPixels(433, 240, 10, 10);
    var ret = {
      width: this.testLayerSize.width,
      height: this.testLayerSize.height,
      pixel: this.containsPixel(ret1, this.pixel, false) ? "yes" : "no"
    };
    return JSON.stringify(ret);
  }
}
