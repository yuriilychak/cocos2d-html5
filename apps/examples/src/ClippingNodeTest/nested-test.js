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
import { s_pathGrossini } from "../resources";
import { DelayTime, RotateBy, Show, sequence } from "@aspect/actions";
import { Sprite } from "@aspect/core";

import { ClippingNode } from "@aspect/clipping-nodes";
export class NestedTest extends BaseClippingNodeTest {
  title() {
    return "Nested Test";
  }

  subtitle() {
    return "Nest 9 Clipping Nodes, max is usually 8";
  }

  setup() {
    var depth = 9;

    var parent = this;

    for (var i = 0; i < depth; i++) {
      var size = 225 - i * (225 / (depth * 2));

      var clipper = new ClippingNode();
      clipper.attr({
        width: size,
        height: size,
        anchorX: 0.5,
        anchorY: 0.5,
        x: parent.width / 2,
        y: parent.height / 2
      });
      clipper.alphaThreshold = 0.05;
      clipper.runAction(
        new RotateBy(i % 3 ? 1.33 : 1.66, i % 2 ? 90 : -90).repeatForever()
      );
      parent.addChild(clipper);

      var stencil = new Sprite(s_pathGrossini);
      stencil.attr({
        scale: 2.5 - i * (2.5 / depth),
        anchorX: 0.5,
        anchorY: 0.5,
        x: clipper.width / 2,
        y: clipper.height / 2,
        visible: false
      });
      stencil.runAction(sequence(new DelayTime(i), new Show()));
      clipper.stencil = stencil;

      clipper.addChild(stencil);
      parent = clipper;
    }
  }
}
