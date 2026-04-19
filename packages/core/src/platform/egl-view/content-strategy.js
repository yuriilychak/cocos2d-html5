/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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

import { NewClass } from "../class";
import { Rect } from "../../cocoa/geometry/rect";
import Game from "../../boot/game";

/**
 * <p>cc.ContentStrategy class is the root strategy class of content's scale strategy,
 * it controls the behavior of how to scale the scene and setup the viewport for the game</p>
 *
 * @class
 * @extends NewClass
 */
export class ContentStrategy extends NewClass {
  constructor() {
    super();
    this._result = {
      scale: [1, 1],
      viewport: null
    };
  }

  _buildResult(containerW, containerH, contentW, contentH, scaleX, scaleY) {
    // Makes content fit better the canvas
    Math.abs(containerW - contentW) < 2 && (contentW = containerW);
    Math.abs(containerH - contentH) < 2 && (contentH = containerH);

    var viewport = new Rect(
      Math.round((containerW - contentW) / 2),
      Math.round((containerH - contentH) / 2),
      contentW,
      contentH
    );

    // Translate the content
    if (cc._renderType === Game.RENDER_TYPE_CANVAS) {
      //TODO: modify something for setTransform
      //cc._renderContext.translate(viewport.x, viewport.y + contentH);
    }

    this._result.scale = [scaleX, scaleY];
    this._result.viewport = viewport;
    return this._result;
  }

  /**
   * Manipulation before applying the strategy
   * @param {view} view The target view
   */
  preApply(view) {}

  /**
   * Function to apply this strategy
   * The return value is {scale: [scaleX, scaleY], viewport: {Rect}},
   * The target view can then apply these value to itself, it's preferred not to modify directly its private variables
   * @param {view} view
   * @param {Size} designedResolution
   * @return {object} scaleAndViewportRect
   */
  apply(view, designedResolution) {
    return { scale: [1, 1] };
  }

  /**
   * Manipulation after applying the strategy
   * @param {view} view The target view
   */
  postApply(view) {}
}

// Content scale strategies (subclasses)

class ExactFit extends ContentStrategy {
  apply(view, designedResolution) {
    var containerW = cc._canvas.width,
      containerH = cc._canvas.height,
      scaleX = containerW / designedResolution.width,
      scaleY = containerH / designedResolution.height;

    return this._buildResult(
      containerW,
      containerH,
      containerW,
      containerH,
      scaleX,
      scaleY
    );
  }
}

class ShowAll extends ContentStrategy {
  apply(view, designedResolution) {
    var containerW = cc._canvas.width,
      containerH = cc._canvas.height,
      designW = designedResolution.width,
      designH = designedResolution.height,
      scaleX = containerW / designW,
      scaleY = containerH / designH,
      scale = 0,
      contentW,
      contentH;

    scaleX < scaleY
      ? ((scale = scaleX),
        (contentW = containerW),
        (contentH = designH * scale))
      : ((scale = scaleY),
        (contentW = designW * scale),
        (contentH = containerH));

    return this._buildResult(
      containerW,
      containerH,
      contentW,
      contentH,
      scale,
      scale
    );
  }
}

class NoBorder extends ContentStrategy {
  apply(view, designedResolution) {
    var containerW = cc._canvas.width,
      containerH = cc._canvas.height,
      designW = designedResolution.width,
      designH = designedResolution.height,
      scaleX = containerW / designW,
      scaleY = containerH / designH,
      scale,
      contentW,
      contentH;

    scaleX < scaleY
      ? ((scale = scaleY),
        (contentW = designW * scale),
        (contentH = containerH))
      : ((scale = scaleX),
        (contentW = containerW),
        (contentH = designH * scale));

    return this._buildResult(
      containerW,
      containerH,
      contentW,
      contentH,
      scale,
      scale
    );
  }
}

class FixedHeight extends ContentStrategy {
  apply(view, designedResolution) {
    var containerW = cc._canvas.width,
      containerH = cc._canvas.height,
      designH = designedResolution.height,
      scale = containerH / designH,
      contentW = containerW,
      contentH = containerH;

    return this._buildResult(
      containerW,
      containerH,
      contentW,
      contentH,
      scale,
      scale
    );
  }

  postApply(view) {
    cc.director._winSizeInPoints = view.getVisibleSize();
  }
}

class FixedWidth extends ContentStrategy {
  apply(view, designedResolution) {
    var containerW = cc._canvas.width,
      containerH = cc._canvas.height,
      designW = designedResolution.width,
      scale = containerW / designW,
      contentW = containerW,
      contentH = containerH;

    return this._buildResult(
      containerW,
      containerH,
      contentW,
      contentH,
      scale,
      scale
    );
  }

  postApply(view) {
    cc.director._winSizeInPoints = view.getVisibleSize();
  }
}

// Alias: Strategy to scale the content's size to container's size, non proportional
ContentStrategy.EXACT_FIT = new ExactFit();
// Alias: Strategy to scale the content's size proportionally to maximum size and keeps the whole content area to be visible
ContentStrategy.SHOW_ALL = new ShowAll();
// Alias: Strategy to scale the content's size proportionally to fill the whole container area
ContentStrategy.NO_BORDER = new NoBorder();
// Alias: Strategy to scale the content's height to container's height and proportionally scale its width
ContentStrategy.FIXED_HEIGHT = new FixedHeight();
// Alias: Strategy to scale the content's width to container's width and proportionally scale its height
ContentStrategy.FIXED_WIDTH = new FixedWidth();
