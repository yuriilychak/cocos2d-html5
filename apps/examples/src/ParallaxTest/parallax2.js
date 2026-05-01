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

import { TAG_NODE } from "./parallax-test-constants";
import { s_back, s_power, s_resprefix } from "../resources";
import { Point } from "@aspect/core";

export class Parallax2 extends ParallaxDemo {
  constructor() {
    super();

    this._root = null;

    this._target = null;

    this._streak = null;

    if ("touches" in cc.sys.capabilities) {
      cc.eventManager.addListener(
        {
          event: cc.EventListener.TOUCH_ALL_AT_ONCE,
          onTouchesMoved: function (touches, event) {
            var touch = touches[0];
            var node = event.getCurrentTarget().getChildByTag(TAG_NODE);
            node.x += touch.getDelta().x;
            node.y += touch.getDelta().y;
          }
        },
        this
      );
    } else if ("mouse" in cc.sys.capabilities) {
      cc.eventManager.addListener(
        {
          event: cc.EventListener.MOUSE,
          onMouseMove: function (event) {
            if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
              var node = event.getCurrentTarget().getChildByTag(TAG_NODE);
              node.x += event.getDeltaX();
              node.y += event.getDeltaY();
            }
          }
        },
        this
      );
    }

    // Top Layer, a simple image
    var cocosImage = new cc.Sprite(s_power);
    // scale the image (optional)
    cocosImage.scale = 1.5;
    // change the transform anchor point to 0,0 (optional)
    cocosImage.anchorX = 0;
    cocosImage.anchorY = 0;

    // Middle layer: a Tile map atlas
    //var tilemap = cc.TileMapAtlas.create(s_tilesPng, s_levelMapTga, 16, 16);
    var tilemap = new cc.TMXTiledMap(
      s_resprefix + "TileMaps/orthogonal-test2.tmx"
    );

    // change the transform anchor to 0,0 (optional)
    tilemap.anchorX = 0;
    tilemap.anchorY = 0;

    // Anti Aliased images
    //tilemap.texture.setAntiAliasTexParameters();

    // background layer: another image
    var background = new cc.Sprite(s_back);
    // scale the image (optional)
    //background.scale = 1.5;
    // change the transform anchor point (optional)
    background.anchorX = 0;
    background.anchorY = 0;

    // create a void node, a parent node
    var voidNode = new cc.ParallaxNode();
    // NOW add the 3 layers to the 'void' node

    // background image is moved at a ratio of 0.4x, 0.5y
    voidNode.addChild(
      background,
      -1,
      new Point(0.4, 0.5),
      new Point(0, 0)
    );

    // tiles are moved at a ratio of 1.0, 1.0y
    voidNode.addChild(tilemap, 1, new Point(1.0, 1.0), new Point(0, 0));

    // top image is moved at a ratio of 3.0x, 2.5y
    voidNode.addChild(
      cocosImage,
      2,
      new Point(3.0, 2.5),
      new Point(0, 0)
    );
    this.addChild(voidNode, 0, TAG_NODE);
  }

  title() {
    return "Parallax: drag screen";
  }
}
