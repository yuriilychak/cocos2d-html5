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
  s_hole_effect_png,
  s_hole_stencil_png,
  s_pathBlock
} from "../resources";
import { AffineTransform, Color, EventListener, Node, Point, Rect, Size, Sprite, ServiceLocator } from "@aspect/core";
import { RotateBy, ScaleBy, ScaleTo, Sequence } from "@aspect/actions";
import { DrawNode } from "@aspect/shape-nodes";

import { ClippingNode } from "@aspect/clipping-nodes";
export class HoleDemo extends BaseClippingNodeTest {
  constructor() {
    super();
  }

  setup() {
    var target = new Sprite(s_pathBlock);
    target.anchorX = 0;
    target.anchorY = 0;
    target.scale = 3;

    var scale = target.scale;
    var stencil = new DrawNode();

    var rectangle = [
      new Point(0, 0),
      new Point(target.width * scale, 0),
      new Point(target.width * scale, target.height * scale),
      new Point(0, target.height * scale)
    ];
    stencil.drawPoly(
      rectangle,
      new Color(255, 0, 0, 255),
      0,
      new Color(255, 255, 255, 0)
    );

    this._outerClipper = new ClippingNode();
    var transform = AffineTransform.makeIdentity();
    transform = AffineTransform.scale(transform, target.scale, target.scale);

    var ocsize = AffineTransform.applyToSize(
      new Size(target.width, target.height),
      transform
    );
    this._outerClipper.width = ocsize.width;
    this._outerClipper.height = ocsize.height;
    this._outerClipper.anchorX = 0.5;
    this._outerClipper.anchorY = 0.5;
    this._outerClipper.x = this.width * 0.5;
    this._outerClipper.y = this.height * 0.5;
    this._outerClipper.runAction(new RotateBy(1, 45).repeatForever());

    this._outerClipper.stencil = stencil;

    var holesClipper = new ClippingNode();
    holesClipper.inverted = true;
    holesClipper.alphaThreshold = 0.05;

    holesClipper.addChild(target);

    this._holes = new Node();

    holesClipper.addChild(this._holes);

    this._holesStencil = new Node();

    holesClipper.stencil = this._holesStencil;
    this._outerClipper.addChild(holesClipper);
    this.addChild(this._outerClipper);

    ServiceLocator.eventManager.addListener(
      EventListener.create({
        event: EventListener.TOUCH_ALL_AT_ONCE,
        onTouchesBegan: function (touches, event) {
          var target = event.getCurrentTarget();
          var touch = touches[0];
          var point = target._outerClipper.convertToNodeSpace(
            touch.getLocation()
          );
          var rect = new Rect(
            0,
            0,
            target._outerClipper.width,
            target._outerClipper.height
          );
          if (!Rect.containsPoint(rect, point)) return;
          target.pokeHoleAtPoint(point);
        }
      }),
      this
    );
  }

  title() {
    return "Hole Demo";
  }

  subtitle() {
    return "Touch/click to poke holes";
  }

  pokeHoleAtPoint(point) {
    var scale = Math.random() * 0.2 + 0.9;
    var rotation = Math.random() * 360;

    var hole = new Sprite(s_hole_effect_png);
    hole.attr({
      x: point.x,
      y: point.y,
      rotation: rotation,
      scale: scale
    });

    this._holes.addChild(hole);

    var holeStencil = new Sprite(s_hole_stencil_png);
    holeStencil.attr({
      x: point.x,
      y: point.y,
      rotation: rotation,
      scale: scale
    });

    this._holesStencil.addChild(holeStencil);
    this._outerClipper.runAction(
      new Sequence(new ScaleBy(0.05, 0.95), new ScaleTo(0.125, 1))
    );
  }
}
