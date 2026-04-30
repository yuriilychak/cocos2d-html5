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


import { TweenType } from "../../animation/tween-function/constants.js";

/**
 * The movement data information of Cocos Armature.
 * @constructor
 */
export function MovementData() {
  this.name = "";
  this.duration = 0;
  this.scale = 1;
  /**
   * Change to this movement will last durationTo frames. Use this effect can avoid too suddenly changing.
   *
   * Example : current movement is "stand", we want to change to "run", then we fill durationTo frames before
   * change to "run" instead of changing to "run" directly.
   */
  this.durationTo = 0;
  /**
   * This is different from duration, durationTween contain tween effect.
   * duration is the raw time that the animation will last, it's the same with the time you edit in the Action Editor.
   * durationTween is the actual time you want this animation last.
   * Example : If we edit 10 frames in the flash, then duration is 10. When we set durationTween to 50, the movement will last 50 frames, the extra 40 frames will auto filled with tween effect
   */
  this.durationTween = 0;
  this.loop = true; //! whether the movement was looped
  /**
   * Which tween easing effect the movement use
   * TWEEN_EASING_MAX : use the value from MovementData get from flash design panel
   */
  this.tweenEasing = TweenType.LINEAR;
  this.movBoneDataDic = {};
};

/**
 * add a movement bone data to dictionary
 * @param {MovementBoneData} movBoneData
 */
MovementData.prototype.addMovementBoneData = function (movBoneData) {
  this.movBoneDataDic[movBoneData.name] = movBoneData;
};

/**
 * add a movement bone data from dictionary by name
 * @param boneName
 * @returns {MovementBoneData}
 */
MovementData.prototype.getMovementBoneData = function (boneName) {
  return this.movBoneDataDic[boneName];
};

/**
 * <p>
 * The animation data information of Cocos Armature. It include all movement information for the Armature.         <br/>
 * The struct is AnimationData -> MovementData -> MovementBoneData -> FrameData                                    <br/>
 *                                              -> MovementFrameData                                               <br/>
 * </p>
 */
export function AnimationData() {
  this.movementDataDic = {};
  this.movementNames = [];
  this.name = "";
};

/**
 * adds movement data to the movement data dictionary
 * @param {MovementData} moveData
 */
AnimationData.prototype.addMovement = function (moveData) {
  this.movementDataDic[moveData.name] = moveData;
  this.movementNames.push(moveData.name);
};

/**
 * gets movement data from movement data dictionary
 * @param {String} moveName
 * @returns {MovementData}
 */
AnimationData.prototype.getMovement = function (moveName) {
  return this.movementDataDic[moveName];
};

/**
 * gets the count of movement data dictionary
 * @returns {Number}
 */
AnimationData.prototype.getMovementCount = function () {
  return Object.keys(this.movementDataDic).length;
};

/**
 * contour vertex
 * @param {Number} x
 * @param {Number} y
 * @constructor
 */
export function ContourVertex2(x, y) {
  this.x = x || 0;
  this.y = y || 0;
};

/**
 * The Contour data information of Cocos Armature.
 * @constructor
 */
export function ContourData() {
  this.vertexList = [];
};

ContourData.prototype.init = function () {
  this.vertexList.length = 0;
  return true;
};

/**
 * add a vertex object to vertex list
 * @param {Point} p
 */
ContourData.prototype.addVertex = function (p) {
  //var v = new ContourVertex2(p.x, p.y);              //ContourVertex2 is same as Point, so we needn't create a ContourVertex2 object
  this.vertexList.push(p);
};

/**
 * The texture data information of Cocos Armature
 */
export function TextureData() {
  this.height = 0;
  this.width = 0;
  this.pivotX = 0.5;
  this.pivotY = 0.5;
  this.name = "";
  this.contourDataList = [];
};

TextureData.prototype.init = function () {
  this.contourDataList.length = 0;
};

/**
 * Adds a contourData to contourDataList
 * @param {ContourData} contourData
 */
TextureData.prototype.addContourData = function (contourData) {
  this.contourDataList.push(contourData);
};

/**
 * gets a contourData from contourDataList by index
 * @param {Number} index
 * @returns {ContourData}
 */
TextureData.prototype.getContourData = function (index) {
  return this.contourDataList[index];
};

ccs.MovementData = MovementData;
ccs.AnimationData = AnimationData;
ccs.ContourVertex2 = ContourVertex2;
ccs.ContourData = ContourData;
ccs.TextureData = TextureData;
