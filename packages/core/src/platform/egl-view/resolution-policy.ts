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

import { BaseClass } from "../class";
import { ContainerStrategy } from "./container-strategy";
import { ContentStrategy } from "./content-strategy";

import type { SizeLike } from "../../geometry/types";
import type { ContentStrategyResult } from "./content-strategy/types";
import type { EGLViewLike } from "./types";

/**
 * <p>ResolutionPolicy class is the root strategy class of scale strategy,
 * its main task is to maintain the compatibility with Cocos2d-x</p>
 */
export class ResolutionPolicy extends BaseClass {
  #containerStrategy!: ContainerStrategy;
  #contentStrategy!: ContentStrategy;

  /**
   * Constructor of ResolutionPolicy
   */
  constructor(containerStg: ContainerStrategy, contentStg: ContentStrategy) {
    super();

    this.containerStrategy = containerStg;
    this.contentStrategy = contentStg;
  }

  /**
   * Manipulation before applying the resolution policy
   */
  preApply(view: EGLViewLike): void {
    this.containerStrategy.preApply(view);
    this.contentStrategy.preApply(view);
  }

  /**
   * Function to apply this resolution policy.
   * The target view can then apply these values without directly mutating its private variables.
   */
  apply(
    view: EGLViewLike,
    designedResolution: SizeLike
  ): ContentStrategyResult {
    this.containerStrategy.apply(view, designedResolution);
    return this.contentStrategy.apply(view, designedResolution);
  }

  /**
   * Manipulation after applying the strategy
   */
  postApply(view: EGLViewLike): void {
    this.containerStrategy.postApply(view);
    this.contentStrategy.postApply(view);
  }

  /**
   * Container scale strategy.
   */
  get containerStrategy(): ContainerStrategy {
    return this.#containerStrategy;
  }

  set containerStrategy(strategy: ContainerStrategy) {
    this.#containerStrategy = strategy;
  }

  /**
   * Content scale strategy.
   */
  get contentStrategy(): ContentStrategy {
    return this.#contentStrategy;
  }

  set contentStrategy(strategy: ContentStrategy) {
    this.#contentStrategy = strategy;
  }
}
