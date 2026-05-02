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
  _PLANE_COUNT,
  _planeColor,
  _stencilBits,
  _set_stencilBits
} from "./clipping-node-test-helpers";
import { s_pathGrossini } from "../resources";
import { Color, CustomRenderCmd, Director, Game, Point, RendererConfig, Sprite, kmGLPopMatrix, kmGLPushMatrix, log } from "@aspect/core";
export class RawStencilBufferTest extends BaseClippingNodeTest {
  constructor() {
    super();
    this._sprite = null;
  }

  _initRendererCmd() {
    this._rendererCmd = new CustomRenderCmd(this, this.draw);
  }

  title() {
    return "Raw Stencil Tests";
  }

  subtitle() {
    return "1:Default";
  }

  setup() {
    _set_stencilBits(
      RendererConfig.getInstance().renderContext.getParameter(
        RendererConfig.getInstance().renderContext.STENCIL_BITS
      )
    );
    if (_stencilBits < 3)
      log("Stencil must be enabled for the current CCGLView.");

    this._sprite = new Sprite(s_pathGrossini);
    this._sprite.anchorX = 0.5;
    this._sprite.anchorY = 0;
    this._sprite.scale = 2.5;
    Director.getInstance().setAlphaBlending(true);
  }

  draw(ctx) {
    var gl = ctx || RendererConfig.getInstance().renderContext;
    var winPoint = Point.fromSize(Director.getInstance().getWinSize());
    var planeSize = Point.mult(winPoint, 1.0 / _PLANE_COUNT);

    gl.enable(gl.STENCIL_TEST);
    //checkGLErrorDebug();

    for (var i = 0; i < _PLANE_COUNT; i++) {
      var stencilPoint = Point.mult(planeSize, _PLANE_COUNT - i);
      stencilPoint.x = winPoint.x;

      var x = planeSize.x / 2 + planeSize.x * i,
        y = 0;
      this._sprite.x = x;
      this._sprite.y = y;

      this.setupStencilForClippingOnPlane(i);
      //checkGLErrorDebug();

      Game.getInstance().drawingUtils.drawSolidRect(
        new Point(0, 0),
        stencilPoint,
        new Color(255, 255, 255, 255)
      );

      kmGLPushMatrix();
      this.transform();
      this._sprite.visit();
      kmGLPopMatrix();

      this.setupStencilForDrawingOnPlane(i);
      //checkGLErrorDebug();

      Game.getInstance().drawingUtils.drawSolidRect(
        new Point(0, 0),
        winPoint,
        _planeColor[i]
      );

      kmGLPushMatrix();
      this.transform();
      this._sprite.visit();
      kmGLPopMatrix();
    }

    gl.disable(gl.STENCIL_TEST);
    //checkGLErrorDebug();
  }

  setupStencilForClippingOnPlane(plane) {
    var gl = RendererConfig.getInstance().renderContext;
    var planeMask = 0x1 << plane;
    gl.stencilMask(planeMask);
    gl.clearStencil(0x0);
    gl.clear(gl.STENCIL_BUFFER_BIT);
    gl.flush();
    gl.stencilFunc(gl.NEVER, planeMask, planeMask);
    gl.stencilOp(gl.REPLACE, gl.KEEP, gl.KEEP);
  }

  setupStencilForDrawingOnPlane(plane) {
    var gl = RendererConfig.getInstance().renderContext;
    var planeMask = 0x1 << plane;
    var equalOrLessPlanesMask = planeMask | (planeMask - 1);
    gl.stencilFunc(gl.EQUAL, equalOrLessPlanesMask, equalOrLessPlanesMask);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
  }
}
