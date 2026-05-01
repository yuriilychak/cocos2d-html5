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

import { SpriteLayer } from "./sprite-layer";
import { TestLayer } from "./test-layer";
import { director } from "../constants";
import { Color, Layer } from "@aspect/core";
import { RotateBy } from "@aspect/actions";

export class RotateWorldMainLayer extends Layer {
  constructor() {
    super();
    this.init();
  }

  onEnter() {
    super.onEnter();
    var x, y;

    var size = director.getWinSize();
    x = size.width;
    y = size.height;

    var blue = new cc.LayerColor(new Color(0, 0, 255, 255));
    var red = new cc.LayerColor(new Color(255, 0, 0, 255));
    var green = new cc.LayerColor(new Color(0, 255, 0, 255));
    var white = new cc.LayerColor(new Color(255, 255, 255, 255));

    blue.scale = 0.5;
    blue.x = -x / 4;
    blue.y = -y / 4;
    blue.addChild(new SpriteLayer());

    red.scale = 0.5;
    red.x = x / 4;
    red.y = -y / 4;

    green.scale = 0.5;
    green.x = -x / 4;
    green.y = y / 4;
    green.addChild(new TestLayer());

    white.scale = 0.5;
    white.x = x / 4;
    white.y = y / 4;

    this.addChild(blue, -1);
    this.addChild(white);
    this.addChild(green);
    this.addChild(red);

    var rot = new RotateBy(8, 720);

    blue.runAction(rot);
    red.runAction(rot.clone());
    green.runAction(rot.clone());
    white.runAction(rot.clone());
  }
}
