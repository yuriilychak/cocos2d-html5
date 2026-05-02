/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2012 Pierre-David Bélanger
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

import { BaseClippingNodeTest } from "./base-clipping-node-test";
import {
  TAG_CLIPPERNODE,
  TAG_STENCILNODE
} from "./clipping-node-test-constants";
import { s_pathGrossini } from "../resources";
import { Color, Director, Point, Sprite } from "@aspect/core";
import { RotateBy, ScaleBy, sequence } from "@aspect/actions";
import { DrawNode } from "@aspect/shape-nodes";

import { ClippingNode } from "@aspect/clipping-nodes";
export class BasicTest extends BaseClippingNodeTest {
  title() {
    return "Basic Test";
  }

  subtitle() {
    return "";
  }

  setup() {
    var winSize = Director.getInstance().getWinSize();

    var stencil = this.stencil();
    stencil.tag = TAG_STENCILNODE;
    stencil.x = 50;
    stencil.y = 50;

    var clipper = this.clipper();
    clipper.tag = TAG_CLIPPERNODE;
    clipper.anchorX = 0.5;
    clipper.anchorY = 0.5;
    clipper.x = winSize.width / 2 - 50;
    clipper.y = winSize.height / 2 - 50;
    clipper.stencil = stencil;
    this.addChild(clipper);

    var content = this.content();
    content.x = 50;
    content.y = 50;
    clipper.addChild(content);
    //content.x = 400;
    //content.y = 225;
    //this.addChild(content);
  }

  actionRotate() {
    return new RotateBy(1.0, 90.0).repeatForever();
  }

  actionScale() {
    var scale = new ScaleBy(1.33, 1.5);
    return sequence(scale, scale.reverse()).repeatForever();
  }

  shape() {
    var shape = new DrawNode();
    var triangle = [
      new Point(-100, -100),
      new Point(100, -100),
      new Point(0, 100)
    ];

    var green = new Color(0, 255, 0, 255);
    shape.drawPoly(triangle, green, 3, green);
    return shape;
  }

  grossini() {
    var grossini = new Sprite(s_pathGrossini);
    grossini.scale = 1.5;
    return grossini;
  }

  stencil() {
    return null;
  }

  clipper() {
    return new ClippingNode();
  }

  content() {
    return null;
  }
}
