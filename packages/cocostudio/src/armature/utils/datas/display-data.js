/****************************************************************************
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

import { BaseClass } from "@aspect/core";

import { DISPLAY_TYPE_MAX } from "./constants.js";
/**
 * The class use for save display data.
 *
 * @property {Number}         displayType                - the display type
 * @property {String}         displayName                - the display name
 */
export class DisplayData extends BaseClass {
  /**
   * Construction of DisplayData
   */
  constructor() {
    super();
    this.displayType = DISPLAY_TYPE_MAX;
  }
  /**
   * Changes display name to texture type
   * @function
   * @param {String} displayName
   * @returns {String}
   */
  changeDisplayToTexture(displayName) {
    // remove .xxx
    var textureName = displayName;
    var startPos = textureName.lastIndexOf(".");

    if (startPos !== -1) textureName = textureName.substring(0, startPos);
    return textureName;
  }

  /**
   * copy data
   * @function
   * @param {DisplayData} displayData
   */
  copy(displayData) {
    this.displayName = displayData.displayName;
    this.displayType = displayData.displayType;
  }
};

