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
  TAG_CONTENTNODE
} from "./clipping-node-test-constants";
import { s_back2 } from "../resources";
import { Point, Color, Rect } from "@aspect/core";

export class ScrollViewDemo extends BaseClippingNodeTest {
  constructor() {
    super();
    this._scrolling = false;
    this._lastPoint = null;
  }

  title() {
    return "Scroll View Demo";
  }

  subtitle() {
    return "Move/drag to scroll the content";
  }

  setup() {
    var clipper = new cc.ClippingNode();
    clipper.tag = TAG_CLIPPERNODE;
    clipper.width = 200;
    clipper.height = 200;
    clipper.anchorX = 0.5;
    clipper.anchorY = 0.5;
    clipper.x = this.width / 2;
    clipper.y = this.height / 2;
    clipper.runAction(new cc.RotateBy(1, 45).repeatForever());
    this.addChild(clipper);

    var stencil = new cc.DrawNode();
    var rectangle = [
      new Point(0, 0),
      new Point(clipper.width, 0),
      new Point(clipper.width, clipper.height),
      new Point(0, clipper.height)
    ];

    var white = new Color(255, 255, 255, 255);
    stencil.drawPoly(rectangle, white, 1, white);
    clipper.stencil = stencil;

    var content = new cc.Sprite(s_back2);
    content.tag = TAG_CONTENTNODE;
    content.anchorX = 0.5;
    content.anchorY = 0.5;
    content.x = clipper.width / 2;
    content.y = clipper.height / 2;
    clipper.addChild(content);

    this._scrolling = false;
    cc.eventManager.addListener(
      cc.EventListener.create({
        event: cc.EventListener.TOUCH_ALL_AT_ONCE,
        onTouchesBegan: function (touches, event) {
          if (!touches || touches.length == 0) return;
          var target = event.getCurrentTarget();

          var touch = touches[0];
          var clipper = target.getChildByTag(TAG_CLIPPERNODE);
          var point = clipper.convertToNodeSpace(touch.getLocation());
          var rect = new Rect(0, 0, clipper.width, clipper.height);
          target._scrolling = Rect.containsPoint(rect, point);
          target._lastPoint = point;
        },

        onTouchesMoved: function (touches, event) {
          var target = event.getCurrentTarget();
          if (!target._scrolling) return;

          if (!touches || touches.length == 0) return;
          var touch = touches[0];
          var clipper = target.getChildByTag(TAG_CLIPPERNODE);
          var point = clipper.convertToNodeSpace(touch.getLocation());
          var diff = Point.sub(point, target._lastPoint);
          var content = clipper.getChildByTag(TAG_CONTENTNODE);
          content.setPosition(Point.add(content.getPosition(), diff));
          target._lastPoint = point;
        },

        onTouchesEnded: function (touches, event) {
          var target = event.getCurrentTarget();
          if (!target._scrolling) return;
          target._scrolling = false;
        }
      }),
      this
    );
  }
}
