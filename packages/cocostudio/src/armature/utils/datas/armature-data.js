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

/**
 * <p>
 * ArmatureData saved the Armature name and BoneData needed for the Bones in this Armature      <br/>
 * When we create a Armature, we need to get each Bone's BoneData as it's init information.       <br/>
 * So we can get a BoneData from the Dictionary saved in the ArmatureData.                        <br/>
 * </p>
 *
 * @property {Object}                    boneDataDic                - the bone data dictionary
 * @property {String}                    name                       - the name of armature data
 * @property {Number}                    dataVersion                - the data version of armature data
 */
export class ArmatureData extends BaseClass {
  /**
   * Construction of ArmatureData
   */
  constructor() {
    super();
    this.boneDataDic = {};
    this.name = "";
    this.dataVersion = 0.1;
  }

  /**
   * Initializes a ArmatureData
   * @returns {boolean}
   */
  init() {
    return true;
  }

  /**
   * Adds bone data to dictionary
   * @param {BoneData} boneData
   */
  addBoneData(boneData) {
    this.boneDataDic[boneData.name] = boneData;
  }

  /**
   * Gets bone data dictionary
   * @returns {Object}
   */
  getBoneDataDic() {
    return this.boneDataDic;
  }
  /**
   * Gets bone data by bone name
   * @function
   * @param {String} boneName
   * @returns {BoneData}
   */
  getBoneData(boneName) {
    return this.boneDataDic[boneName];
  }
};

