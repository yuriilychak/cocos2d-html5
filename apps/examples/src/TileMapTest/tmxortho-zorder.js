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
// TMXOrthoZorder
//
//------------------------------------------------------------------
import { s_pathSister1, s_resprefix } from "../resources";
import { TileDemo } from "./tile-demo";
import { TAG_TILE_MAP } from "./tile-map-test-constants";
import { Point, Sprite } from "@aspect/core";
import { MoveBy, sequence } from "@aspect/actions";
import { TMXTiledMap } from "@aspect/tilemap";

export class TMXOrthoZorder extends TileDemo {
  constructor() {
    super();

    this.tamara = null;

    this.testDuration = 2;

    this.pixel1 = { 0: 117, 1: 185, 2: 63, 3: 255 };

    this.pixel2 = { 0: 91, 1: 55, 2: 20, 3: 255 };
    var map = new TMXTiledMap(
      s_resprefix + "TileMaps/orthogonal-test-zorder.tmx"
    );
    this.addChild(map, 0, TAG_TILE_MAP);

    this.tamara = new Sprite(s_pathSister1);
    map.addChild(this.tamara, map.children.length, TAG_TILE_MAP);
    this.tamara.anchorX = 0.5;
    this.tamara.anchorY = 0;

    var move = new MoveBy(5, Point.mult(new Point(400, 450), 0.58));
    var back = move.reverse();
    var seq = sequence(move, back);
    this.tamara.runAction(seq.repeatForever());

    this.schedule(this.repositionSprite);
  }
  title() {
    return "TMX Ortho Zorder";
  }
  subtitle() {
    return "Sprite should hide behind the trees";
  }
  repositionSprite(dt) {
    var map = this.getChildByTag(TAG_TILE_MAP);

    // there are only 4 layers. (grass and 3 trees layers)
    // if tamara < 81, z=4
    // if tamara < 162, z=3
    // if tamara < 243,z=2

    // -10: customization for this particular sample
    var newZ = 4 - (this.tamara.y - 10) / 81;
    newZ = Math.max(newZ, 0);

    map.reorderChild(this.tamara, newZ);
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = { pixel1: "yes", pixel2: "yes" };
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret1 = this.readPixels(86, 131, 5, 5);
    var ret2 = this.readPixels(84, 200, 5, 5);
    var ret = {
      pixel1: this.containsPixel(ret1, this.pixel1, false) ? "yes" : "no",
      pixel2: this.containsPixel(ret2, this.pixel2, true, 5) ? "yes" : "no"
    };
    return JSON.stringify(ret);
  }
}
