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
import { OperatingSystem } from "../../../enums";
import { ServiceLocator } from "../../../service-locator";
import type { SizeLike } from "../../../geometry/types";
import type { EGLViewLike } from "../types";

/**
 * <p>ContainerStrategy class is the root strategy class of container's scale strategy,
 * it controls the behavior of how to scale the container and _canvas object</p>
 */
export default abstract class ContainerStrategy extends BaseClass {
  /**
   * Manipulation before appling the strategy
   */
  abstract preApply(view: EGLViewLike): void;

  /**
   * Function to apply this strategy
   */
  abstract apply(view: EGLViewLike, designedResolution?: SizeLike): void;

  /**
   * Manipulation after applying the strategy
   */
  abstract postApply(view: EGLViewLike): void;

  protected setupContainer(view: EGLViewLike, w: number, h: number): void {
    const locCanvas = ServiceLocator.game.canvas as HTMLCanvasElement;
    const locContainer = ServiceLocator.game.container as HTMLElement;

    if (ServiceLocator.sys.specification.os === OperatingSystem.ANDROID) {
      document.body.style.width = `${view.rotated ? h : w}px`;
      document.body.style.height = `${view.rotated ? w : h}px`;
    }

    // Setup style
    locContainer.style.width = locCanvas.style.width = `${w}px`;
    locContainer.style.height = locCanvas.style.height = `${h}px`;

    // Setup pixel ratio for retina display
    let devicePixelRatio = (view.devicePixelRatio = 1);
    if (view.retinaEnabled) {
      devicePixelRatio = view.devicePixelRatio = Math.min(
        2,
        window.devicePixelRatio || 1
      );
    }

    // Setup canvas
    locCanvas.width = w * devicePixelRatio;
    locCanvas.height = h * devicePixelRatio;
    ServiceLocator.sys.rendererConfig.renderContext?.resetCache?.();
  }

  protected fixContainer(): void {
    // Add container to document body
    document.body.insertBefore(ServiceLocator.game.container, document.body.firstChild);

    // Set body's width height to window's size, and forbid overflow, so that game will be centered
    const bs = document.body.style;
    bs.width = `${window.innerWidth}px`;
    bs.height = `${window.innerHeight}px`;
    bs.overflow = "hidden";

    // Body size solution doesn't work on all mobile browser so this is the aleternative: fixed container
    const contStyle = ServiceLocator.game.container.style;
    contStyle.position = "fixed";
    contStyle.left = contStyle.top = "0px";

    // Reposition body
    document.body.scrollTop = 0;
  }
}
