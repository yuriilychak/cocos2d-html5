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
import { ContainerStrategy } from "./container-strategy";
import { ContentStrategy } from "./content-strategy";

/**
 * <p>ResolutionPolicy class is the root strategy class of scale strategy,
 * its main task is to maintain the compatibility with Cocos2d-x</p>
 *
 * @param {ContainerStrategy} containerStg The container strategy
 * @param {ContentStrategy} contentStg The content strategy
 */
export class ResolutionPolicy extends NewClass {
  /**
   * Constructor of ResolutionPolicy
   * @param {ContainerStrategy} containerStg
   * @param {ContentStrategy} contentStg
   */
  constructor(containerStg, contentStg) {
    super();
    this._containerStrategy = null;
    this._contentStrategy = null;

    this.setContainerStrategy(containerStg);
    this.setContentStrategy(contentStg);
  }

  /**
   * Manipulation before applying the resolution policy
   * @param {view} view The target view
   */
  preApply(view) {
    this._containerStrategy.preApply(view);
    this._contentStrategy.preApply(view);
  }

  /**
   * Function to apply this resolution policy
   * The return value is {scale: [scaleX, scaleY], viewport: {Rect}},
   * The target view can then apply these value to itself, it's preferred not to modify directly its private variables
   * @param {view} view The target view
   * @param {Size} designedResolution The user defined design resolution
   * @return {object} An object contains the scale X/Y values and the viewport rect
   */
  apply(view, designedResolution) {
    this._containerStrategy.apply(view, designedResolution);
    return this._contentStrategy.apply(view, designedResolution);
  }

  /**
   * Manipulation after appyling the strategy
   * @param {view} view The target view
   */
  postApply(view) {
    this._containerStrategy.postApply(view);
    this._contentStrategy.postApply(view);
  }

  /**
   * Setup the container's scale strategy
   * @param {ContainerStrategy} containerStg
   */
  setContainerStrategy(containerStg) {
    if (containerStg instanceof ContainerStrategy)
      this._containerStrategy = containerStg;
  }

  /**
   * Setup the content's scale strategy
   * @param {ContentStrategy} contentStg
   */
  setContentStrategy(contentStg) {
    if (contentStg instanceof ContentStrategy)
      this._contentStrategy = contentStg;
  }
}

/**
 * @memberOf ResolutionPolicy#
 * @name EXACT_FIT
 * @constant
 * @type Number
 * @static
 * The entire application is visible in the specified area without trying to preserve the original aspect ratio.
 * Distortion can occur, and the application may appear stretched or compressed.
 */
ResolutionPolicy.EXACT_FIT = 0;

/**
 * @memberOf ResolutionPolicy#
 * @name NO_BORDER
 * @constant
 * @type Number
 * @static
 * The entire application fills the specified area, without distortion but possibly with some cropping,
 * while maintaining the original aspect ratio of the application.
 */
ResolutionPolicy.NO_BORDER = 1;

/**
 * @memberOf ResolutionPolicy#
 * @name SHOW_ALL
 * @constant
 * @type Number
 * @static
 * The entire application is visible in the specified area without distortion while maintaining the original
 * aspect ratio of the application. Borders can appear on two sides of the application.
 */
ResolutionPolicy.SHOW_ALL = 2;

/**
 * @memberOf ResolutionPolicy#
 * @name FIXED_HEIGHT
 * @constant
 * @type Number
 * @static
 * The application takes the height of the design resolution size and modifies the width of the internal
 * canvas so that it fits the aspect ratio of the device
 * no distortion will occur however you must make sure your application works on different
 * aspect ratios
 */
ResolutionPolicy.FIXED_HEIGHT = 3;

/**
 * @memberOf ResolutionPolicy#
 * @name FIXED_WIDTH
 * @constant
 * @type Number
 * @static
 * The application takes the width of the design resolution size and modifies the height of the internal
 * canvas so that it fits the aspect ratio of the device
 * no distortion will occur however you must make sure your application works on different
 * aspect ratios
 */
ResolutionPolicy.FIXED_WIDTH = 4;

/**
 * @memberOf ResolutionPolicy#
 * @name UNKNOWN
 * @constant
 * @type Number
 * @static
 * Unknow policy
 */
ResolutionPolicy.UNKNOWN = 5;
