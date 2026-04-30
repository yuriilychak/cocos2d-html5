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

import { BaseData } from "./base-data.js";

/**
 * <p>
 *      BoneData used to init a Bone.                                                               <br/>
 *      BoneData keeps a DisplayData list, a Bone can have many display to change.                  <br/>
 *      The display information saved in the DisplayData                                            <br/>
 * </p>
 *
 * @property {Array}                    displayDataList                - the display data list
 * @property {String}                   name                           - the name of Bone
 * @property {String}                   parentName                     - the parent name of bone
 * @property {AffineTransform}       boneDataTransform              - the bone transform data
 */
export class BoneData extends BaseData {
  /**
   * Construction of BoneData
   */
  constructor() {
    super();
    this.displayDataList = [];
    this.name = "";
    this.parentName = "";
    this.boneDataTransform = null;
  }

  /**
   * Initializes a BoneData
   * @returns {boolean}
   */
  init() {
    this.displayDataList.length = 0;
    return true;
  }
  /**
   * Adds display data to list
   * @function
   * @param {DisplayData} displayData
   */
  addDisplayData(displayData) {
    this.displayDataList.push(displayData);
  }

  /**
   * Returns display data with index.
   * @function
   * @param {Number} index
   * @returns {DisplayData}
   */
  getDisplayData(index) {
    return this.displayDataList[index];
  }
};

ccs.BoneData = BoneData;
