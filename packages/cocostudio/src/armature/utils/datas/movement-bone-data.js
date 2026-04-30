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

import { NewClass } from "@aspect/core";

/**
 * MovementBoneData saved the name, delay, frame list of Bone's movement.
 *
 * @property {Number}                    delay             - the delay of bone's movement.
 * @property {Number}                    scale             - the scale of bone's movement.
 * @property {Number}                    duration          - the duration of bone's movement.
 * @property {Array}                     frameList         - the frame list of bone's movement.
 * @property {String}                    name              - the name of bone's movement.
 */
export class MovementBoneData extends NewClass {
  /**
   * Construction of MovementBoneData.
   */
  constructor() {
    super();
    this.delay = 0;
    this.scale = 1;
    this.duration = 0;
    this.frameList = [];
    this.name = "";
  }

  /**
   * Initializes a MovementBoneData.
   * @returns {boolean}
   */
  init() {
    return true;
  }
  /**
   * Adds frame data to frame list.
   * @param {FrameData} frameData
   */
  addFrameData(frameData) {
    this.frameList.push(frameData);
  }
  /**
   * Gets frame data by Index.
   * @function
   * @param {Number} index
   * @returns {FrameData}
   */
  getFrameData(index) {
    return this.frameList[index];
  }
};

ccs.MovementBoneData = MovementBoneData;
