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

import { BaseClass } from "../../class";
import { Rect } from "../../../geometry";
import { ServiceLocator } from "../../../service-locator";

import type { SizeLike } from "../../../geometry/types";
import type { ContentStrategyResult } from "./types";
import type { EGLViewLike } from "../types";

/**
 * <p>ContentStrategy class is the root strategy class of content's scale strategy,
 * it controls the behavior of how to scale the scene and setup the viewport for the game</p>
 */
export default abstract class ContentStrategy extends BaseClass {
  protected buildResult(
    containerW: number,
    containerH: number,
    contentW: number,
    contentH: number,
    scaleX: number,
    scaleY: number
  ): ContentStrategyResult {
    // Makes content fit better the canvas
    if (Math.abs(containerW - contentW) < 2) {
      contentW = containerW;
    }
    if (Math.abs(containerH - contentH) < 2) {
      contentH = containerH;
    }

    const viewport = new Rect(
      Math.round((containerW - contentW) / 2),
      Math.round((containerH - contentH) / 2),
      contentW,
      contentH
    );

    // Translate the content
    if (ServiceLocator.sys.rendererConfig.isCanvas) {
      // TODO: modify something for setTransform
      // _renderContext.translate(viewport.x, viewport.y + contentH);
    }

    return {
      scale: [scaleX, scaleY],
      viewport
    };
  }

  /**
   * Manipulation before applying the strategy
   */
  abstract preApply(view: EGLViewLike): void;

  /**
   * Function to apply this strategy.
   * The target view can then apply these values without directly mutating its private variables.
   */
  abstract apply(
    view: EGLViewLike,
    designedResolution: SizeLike
  ): ContentStrategyResult;

  /**
   * Manipulation after applying the strategy
   */
  abstract postApply(view: EGLViewLike): void;
}
