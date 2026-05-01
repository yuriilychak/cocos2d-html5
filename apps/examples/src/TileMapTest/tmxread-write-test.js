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
// TMXReadWriteTest
//
//------------------------------------------------------------------
import { s_resprefix } from "../resources";
import { TileDemo } from "./tile-demo";
import { TAG_TILE_MAP } from "./tile-map-test-constants";

export class TMXReadWriteTest extends TileDemo {
  constructor() {
    super();

    this.gid = 0;

    this.testDuration = 2.2;

    this.pixel1 = { 0: 0, 1: 144, 2: 0, 3: 255 };

    this.pixel2 = { 0: 192, 1: 144, 2: 16, 3: 255 };

    var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/orthogonal-test2.tmx");
    this.addChild(map, 0, TAG_TILE_MAP);

    var layer = map.getLayer("Layer 0");
    if ("opengl" in cc.sys.capabilities)
      layer.texture.setAntiAliasTexParameters();

    map.scale = 1;

    var tile0 = layer.getTileAt(new cc.Point(1, 63));
    var tile1 = layer.getTileAt(new cc.Point(2, 63));
    var tile2 = layer.getTileAt(new cc.Point(3, 62)); //new cc.Point(1,62));
    var tile3 = layer.getTileAt(new cc.Point(2, 62));

    tile0.anchorX = 0.5;
    tile0.anchorY = 0.5;
    tile1.anchorX = 0.5;
    tile1.anchorY = 0.5;
    tile2.anchorX = 0.5;
    tile2.anchorY = 0.5;
    tile3.anchorX = 0.5;
    tile3.anchorY = 0.5;

    var move = new cc.MoveBy(0.5, new cc.Point(0, 160));
    var rotate = new cc.RotateBy(2, 360);
    var scale = new cc.ScaleBy(2, 5);
    var opacity = new cc.FadeOut(2);
    var fadein = new cc.FadeIn(2);
    var scaleback = new cc.ScaleTo(1, 1);
    var finish = new cc.CallFunc(this.onRemoveSprite); // 'this' is optional. Since it is not used, it is not passed.

    var seq0 = cc.sequence(
      move,
      rotate,
      scale,
      opacity,
      fadein,
      scaleback,
      finish
    );

    tile0.runAction(seq0);
    tile1.runAction(seq0.clone());
    tile2.runAction(seq0.clone());
    tile3.runAction(seq0.clone());

    this.gid = layer.getTileGIDAt(new cc.Point(0, 63));

    this.schedule(this.updateCol, 2.0);
    this.schedule(this.repaintWithGID, 2.0);
    this.schedule(this.removeTiles, 1.0);

    this.gid2 = 0;
  }
  onRemoveSprite(sender) {
    var p = sender.parent;
    if (p) {
      p.removeChild(sender, true);
    }
  }
  updateCol(dt) {
    var map = this.getChildByTag(TAG_TILE_MAP);
    var layer = map.getChildByTag(0);

    var s = layer.getLayerSize();

    for (var y = 0; y < s.height; y++) {
      layer.setTileGID(this.gid2, new cc.Point(3, y));
    }

    this.gid2 = (this.gid2 + 1) % 80;
  }
  repaintWithGID(dt) {
    var map = this.getChildByTag(TAG_TILE_MAP);
    var layer = map.getChildByTag(0);

    var s = layer.getLayerSize();
    for (var x = 0; x < s.width; x++) {
      var y = s.height - 1;
      var tmpgid = layer.getTileGIDAt(new cc.Point(x, y));
      layer.setTileGID(tmpgid + 1, new cc.Point(x, y));
    }
  }
  removeTiles(dt) {
    this.unschedule(this.removeTiles);

    var map = this.getChildByTag(TAG_TILE_MAP);

    var layer = map.getChildByTag(0);
    var s = layer.getLayerSize();

    for (var y = 0; y < s.height; y++) {
      layer.removeTileAt(new cc.Point(5.0, y));
    }
  }
  title() {
    return "TMX Read/Write test";
  }

  //
  // Automation
  //
  getExpectedResult() {
    var ret = { pixel1: "yes", pixel2: "yes" };
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret1 = this.readPixels(168, 203, 5, 5);
    var ret2 = this.readPixels(239, 239, 5, 5);
    var ret = {
      pixel1: !this.containsPixel(ret1, this.pixel1, false) ? "yes" : "no",
      pixel2: this.containsPixel(ret2, this.pixel2, false) ? "yes" : "no"
    };
    return JSON.stringify(ret);
  }
}
