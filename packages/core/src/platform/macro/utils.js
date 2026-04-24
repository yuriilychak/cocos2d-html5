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

import { RAD, DEG } from "./constants";
import Game from "../../boot/game";
import { Point } from "../../cocoa/geometry/point";
import { Rect } from "../../cocoa/geometry/rect";
import { RendererConfig } from "../../renderer/renderer-config";
import { Size } from "../../cocoa/geometry/size";
import { log, _LogInfos } from "../../boot/debugger";

/**
 * <p>
 *     Linear interpolation between 2 numbers, the ratio sets how much it is biased to each end
 * </p>
 * @param {Number} a number A
 * @param {Number} b number B
 * @param {Number} r ratio between 0 and 1
 * @function
 * @example
 * lerp(2,10,0.5)//returns 6<br/>
 * lerp(2,10,0.2)//returns 3.6
 */
export function lerp(a, b, r) {
  return a + (b - a) * r;
}

/**
 * get a random number from 0 to 0xffffff
 * @function
 * @returns {number}
 */
export function rand() {
  return Math.random() * 0xffffff;
}

/**
 * returns a random float between -1 and 1
 * @return {Number}
 * @function
 */
export function randomMinus1To1() {
  return (Math.random() - 0.5) * 2;
}

/**
 * returns a random float between 0 and 1
 * @return {Number}
 * @function
 */
export var random0To1 = Math.random;

/**
 * converts degrees to radians
 * @param {Number} angle
 * @return {Number}
 * @function
 */
export function degreesToRadians(angle) {
  return angle * RAD;
}

/**
 * converts radians to degrees
 * @param {Number} angle
 * @return {Number}
 * @function
 */
export function radiansToDegrees(angle) {
  return angle * DEG;
}

/**
 * converts radians to degrees
 * @param {Number} angle
 * @return {Number}
 * @function
 */
export function radiansToDegress(angle) {
  log(_LogInfos.radiansToDegress);
  return angle * DEG;
}

/**
 * Helpful macro that setups the GL server state, the correct GL program and sets the Model View Projection matrix
 * @param {Node} node setup node
 * @function
 */
export function nodeDrawSetup(node) {
  //glEnable(node._glServerState);
  if (node._shaderProgram) {
    //_renderContext.useProgram(node._shaderProgram._programObj);
    node._glProgramState.apply();
    node._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4();
  }
}

/**
 * <p>
 *     GL states that are enabled:<br/>
 *       - GL_TEXTURE_2D<br/>
 *       - GL_VERTEX_ARRAY<br/>
 *       - GL_TEXTURE_COORD_ARRAY<br/>
 *       - GL_COLOR_ARRAY<br/>
 * </p>
 * @function
 */
export function enableDefaultGLStates() {
  //TODO OPENGL STUFF
  /*
     glEnableClientState(GL_VERTEX_ARRAY);
     glEnableClientState(GL_COLOR_ARRAY);
     glEnableClientState(GL_TEXTURE_COORD_ARRAY);
     glEnable(GL_TEXTURE_2D);*/
}

/**
 * <p>
 *   Disable default GL states:<br/>
 *     - GL_TEXTURE_2D<br/>
 *     - GL_TEXTURE_COORD_ARRAY<br/>
 *     - GL_COLOR_ARRAY<br/>
 * </p>
 * @function
 */
export function disableDefaultGLStates() {
  //TODO OPENGL
  /*
     glDisable(GL_TEXTURE_2D);
     glDisableClientState(GL_COLOR_ARRAY);
     glDisableClientState(GL_TEXTURE_COORD_ARRAY);
     glDisableClientState(GL_VERTEX_ARRAY);
     */
}

/**
 * <p>
 *  Increments the GL Draws counts by one.<br/>
 *  The number of calls per frame are displayed on the screen when the Director's stats are enabled.<br/>
 * </p>
 * @param {Number} addNumber
 * @function
 */
export function incrementGLDraws(addNumber) {
  RendererConfig.getInstance().incrementDrawCount(addNumber);
}

/**
 * <p>
 *     On Mac it returns 1;<br/>
 *     On iPhone it returns 2 if RetinaDisplay is On. Otherwise it returns 1
 * </p>
 * @return {Number}
 * @function
 */
export function contentScaleFactor() {
  return cc.director._contentScaleFactor;
}

/**
 * Converts a Point in points to pixels
 * @param {Point} points
 * @return {Point}
 * @function
 */
export function pointPointsToPixels(points) {
  var scale = contentScaleFactor();
  return new Point(points.x * scale, points.y * scale);
}

/**
 * Converts a Point in pixels to points
 * @param {Rect} pixels
 * @return {Point}
 * @function
 */
export function pointPixelsToPoints(pixels) {
  var scale = contentScaleFactor();
  return new Point(pixels.x / scale, pixels.y / scale);
}

export function _pointPixelsToPointsOut(pixels, outPoint) {
  var scale = contentScaleFactor();
  outPoint.x = pixels.x / scale;
  outPoint.y = pixels.y / scale;
}

/**
 * Converts a Size in points to pixels
 * @param {Size} sizeInPoints
 * @return {Size}
 * @function
 */
export function sizePointsToPixels(sizeInPoints) {
  var scale = contentScaleFactor();
  return new Size(sizeInPoints.width * scale, sizeInPoints.height * scale);
}

/**
 * Converts a size in pixels to points
 * @param {Size} sizeInPixels
 * @return {Size}
 * @function
 */
export function sizePixelsToPoints(sizeInPixels) {
  var scale = contentScaleFactor();
  return new Size(sizeInPixels.width / scale, sizeInPixels.height / scale);
}

export function _sizePixelsToPointsOut(sizeInPixels, outSize) {
  var scale = contentScaleFactor();
  outSize.width = sizeInPixels.width / scale;
  outSize.height = sizeInPixels.height / scale;
}

/**
 * Converts a rect in pixels to points
 * @param {Rect} pixel
 * @return {Rect}
 * @function
 */
export function rectPixelsToPoints(pixel) {
  var scale = contentScaleFactor();
  return new Rect(
    pixel.x / scale,
    pixel.y / scale,
    pixel.width / scale,
    pixel.height / scale
  );
}

/**
 * Converts a rect in points to pixels
 * @param {Rect} point
 * @return {Rect}
 * @function
 */
export function rectPointsToPixels(point) {
  var scale = contentScaleFactor();
  return new Rect(
    point.x * scale,
    point.y * scale,
    point.width * scale,
    point.height * scale
  );
}

/**
 * Returns the next power of two value for the given integer
 * @param {Number} x
 * @return {Number}
 */
export function NextPOT(x) {
  x = x - 1;
  x = x | (x >> 1);
  x = x | (x >> 2);
  x = x | (x >> 4);
  x = x | (x >> 8);
  x = x | (x >> 16);
  return x + 1;
}

/**
 * Check webgl error.Error will be shown in console if exists.
 * @function
 */
export function checkGLErrorDebug() {
  if (cc.renderMode === Game.RENDER_TYPE_WEBGL) {
    var _error = RendererConfig.getInstance().renderContext.getError();
    if (_error) {
      log(_LogInfos.checkGLErrorDebug, _error);
    }
  }
}

// Array utils

/**
 * Verify Array's Type
 * @param {Array} arr
 * @param {function} type
 * @return {Boolean}
 * @function
 */
export function arrayVerifyType(arr, type) {
  if (arr && arr.length > 0) {
    for (var i = 0; i < arr.length; i++) {
      if (!(arr[i] instanceof type)) {
        log("element type is wrong!");
        return false;
      }
    }
  }
  return true;
}

/**
 * Searches for the first occurrence of object and removes it. If object is not found the function has no effect.
 * @function
 * @param {Array} arr Source Array
 * @param {*} delObj  remove object
 */
export function arrayRemoveObject(arr, delObj) {
  for (var i = 0, l = arr.length; i < l; i++) {
    if (arr[i] === delObj) {
      arr.splice(i, 1);
      break;
    }
  }
}

/**
 * Removes from arr all values in minusArr. For each Value in minusArr, the first matching instance in arr will be removed.
 * @function
 * @param {Array} arr Source Array
 * @param {Array} minusArr minus Array
 */
export function arrayRemoveArray(arr, minusArr) {
  for (var i = 0, l = minusArr.length; i < l; i++) {
    arrayRemoveObject(arr, minusArr[i]);
  }
}

/**
 * Inserts some objects at index
 * @function
 * @param {Array} arr
 * @param {Array} addObjs
 * @param {Number} index
 * @return {Array}
 */
export function arrayAppendObjectsToIndex(arr, addObjs, index) {
  arr.splice.apply(arr, [index, 0].concat(addObjs));
  return arr;
}

/**
 * Copy an array's item to a new array (its performance is better than Array.slice)
 * @param {Array} arr
 * @return {Array}
 */
export function copyArray(arr) {
  var i,
    len = arr.length,
    arr_clone = new Array(len);
  for (i = 0; i < len; i += 1) arr_clone[i] = arr[i];
  return arr_clone;
}
