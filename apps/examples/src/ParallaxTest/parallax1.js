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

import { s_back, s_power, s_resprefix } from "../resources";
import { Point } from "@aspect/core";

export class Parallax1 extends ParallaxDemo {
  constructor() {
    super();

    this._parentNode = null;

    this._background = null;

    this._tilemap = null;

    this._cocosimage = null;

    this.testDuration = 5;

    // Top Layer, a simple image
    this._cocosimage = new cc.Sprite(s_power);
    // scale the image (optional)
    this._cocosimage.scale = 1.5;
    // change the transform anchor point to 0,0 (optional)
    this._cocosimage.anchorX = 0;
    this._cocosimage.anchorY = 0;

    // Middle layer: a Tile map atlas
    //var tilemap = cc.TileMapAtlas.create(s_tilesPng, s_levelMapTga, 16, 16);
    this._tilemap = new cc.TMXTiledMap(
      s_resprefix + "TileMaps/orthogonal-test2.tmx"
    );

    // change the transform anchor to 0,0 (optional)
    this._tilemap.anchorX = 0;
    this._tilemap.anchorY = 0;

    // Anti Aliased images
    //tilemap.texture.setAntiAliasTexParameters();

    // background layer: another image
    this._background = new cc.Sprite(s_back);
    // scale the image (optional)
    //background.scale = 1.5;
    // change the transform anchor point (optional)
    this._background.anchorX = 0;
    this._background.anchorY = 0;

    // create a void node, a parent node
    this._parentNode = new cc.ParallaxNode();

    // NOW add the 3 layers to the 'void' node

    // background image is moved at a ratio of 0.4x, 0.5y
    this._parentNode.addChild(
      this._background,
      -1,
      new Point(0.4, 0.5),
      new Point(0, 0)
    );

    // tiles are moved at a ratio of 2.2x, 1.0y
    this._parentNode.addChild(
      this._tilemap,
      1,
      new Point(2.2, 1.0),
      new Point(0, 0)
    );

    // top image is moved at a ratio of 3.0x, 2.5y
    this._parentNode.addChild(
      this._cocosimage,
      2,
      new Point(3.0, 2.5),
      new Point(0, 0)
    );

    // now create some actions that will move the '_parent' node
    // and the children of the '_parent' node will move at different
    // speed, thus, simulation the 3D environment
    var goUp = new cc.MoveBy(2, new Point(0, 100));
    var goRight = new cc.MoveBy(2, new Point(200, 0));
    var delay = new cc.DelayTime(2.0);
    var goDown = goUp.reverse();
    var goLeft = goRight.reverse();
    var seq = cc.sequence(goUp, goRight, delay, goDown, goLeft);
    this._parentNode.runAction(seq.repeatForever());

    this.addChild(this._parentNode);
  }

  title() {
    return "Parallax: parent and 3 children";
  }

  // default values for automation
  getExpectedResult() {
    var ret = {};
    ret.pos_parent = new Point(200, 100);
    ret.pos_child1 = new Point(-120, -50);
    ret.pos_child2 = new Point(240, 0);
    ret.pos_child3 = new Point(400, 150);

    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var ret = {};
    ret.pos_parent = new Point(
      Math.round(this._parentNode.x),
      Math.round(this._parentNode.y)
    );
    ret.pos_child1 = new Point(
      Math.round(this._background.x),
      Math.round(this._background.y)
    );
    ret.pos_child2 = new Point(
      Math.round(this._tilemap.x),
      Math.round(this._tilemap.y)
    );
    ret.pos_child3 = new Point(
      Math.round(this._cocosimage.x),
      Math.round(this._cocosimage.y)
    );

    return JSON.stringify(ret);
  }
}
