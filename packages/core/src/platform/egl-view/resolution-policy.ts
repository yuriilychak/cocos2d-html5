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
import {
  ContainerStrategy,
  EqualToFrame,
  EqualToWindow,
  OriginalContainer,
  ProportionalToFrame,
  ProportionalToWindow
} from "./container-strategy";
import {
  ContentStrategy,
  ExactFit,
  FixedHeight,
  FixedWidth,
  NoBorder,
  ShowAll
} from "./content-strategy";
import { ContainerStrategyKey, ContentStrategyKey } from "../../enums";

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
  constructor(
    containerStrategy: ContainerStrategyKey,
    contentStrategy: ContentStrategyKey
  ) {
    super();

    this.#containerStrategy = ResolutionPolicy.createContainerStrategy(
      containerStrategy
    );
    this.#contentStrategy =
      ResolutionPolicy.createContentStrategy(contentStrategy);
  }

  private static createContainerStrategy(
    strategy: ContainerStrategyKey
  ): ContainerStrategy {
    switch (strategy) {
      case ContainerStrategyKey.EQUAL_TO_FRAME:
        return new EqualToFrame();
      case ContainerStrategyKey.PROPORTION_TO_FRAME:
        return new ProportionalToFrame();
      case ContainerStrategyKey.EQUAL_TO_WINDOW:
        return new EqualToWindow();
      case ContainerStrategyKey.PROPORTION_TO_WINDOW:
        return new ProportionalToWindow();
      case ContainerStrategyKey.ORIGINAL_CONTAINER:
        return new OriginalContainer();
      default:
        throw new Error(`Unknown container strategy: ${strategy}`);
    }
  }

  private static createContentStrategy(
    strategy: ContentStrategyKey
  ): ContentStrategy {
    switch (strategy) {
      case ContentStrategyKey.EXACT_FIT:
        return new ExactFit();
      case ContentStrategyKey.SHOW_ALL:
        return new ShowAll();
      case ContentStrategyKey.NO_BORDER:
        return new NoBorder();
      case ContentStrategyKey.FIXED_HEIGHT:
        return new FixedHeight();
      case ContentStrategyKey.FIXED_WIDTH:
        return new FixedWidth();
      default:
        throw new Error(`Unknown content strategy: ${strategy}`);
    }
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

  /**
   * Content scale strategy.
   */
  get contentStrategy(): ContentStrategy {
    return this.#contentStrategy;
  }
}
