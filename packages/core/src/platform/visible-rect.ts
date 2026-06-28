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

import { Point } from "../geometry";
import type { RectLike } from "../geometry/types";

/**
 * VisibleRect defines the actual visible rect of a view.
 * It should represent the same rect as view.getViewportRect()
 *
 * @property {Point}     topLeft         - Top left coordinate of the screen related to the game scene
 * @property {Point}     topRight        - Top right coordinate of the screen related to the game scene
 * @property {Point}     top             - Top center coordinate of the screen related to the game scene
 * @property {Point}     bottomLeft      - Bottom left coordinate of the screen related to the game scene
 * @property {Point}     bottomRight     - Bottom right coordinate of the screen related to the game scene
 * @property {Point}     bottom          - Bottom center coordinate of the screen related to the game scene
 * @property {Point}     center          - Center coordinate of the screen related to the game scene
 * @property {Point}     left            - Left center coordinate of the screen related to the game scene
 * @property {Point}     right           - Right center coordinate of the screen related to the game scene
 * @property {Number}       width           - Width of the screen
 * @property {Number}       height          - Height of the screen
 *
 * @name VisibleRect
 */
export class VisibleRect {
  topLeft: Point;
  topRight: Point;
  top: Point;
  bottomLeft: Point;
  bottomRight: Point;
  bottom: Point;
  center: Point;
  left: Point;
  right: Point;
  width: number;
  height: number;

  constructor() {
    this.topLeft = new Point();
    this.topRight = new Point();
    this.top = new Point();
    this.bottomLeft = new Point();
    this.bottomRight = new Point();
    this.bottom = new Point();
    this.center = new Point();
    this.left = new Point();
    this.right = new Point();
    this.width = 0;
    this.height = 0;
  }

  /**
   * initialize
   */
  init(visibleRect: RectLike): void {
    const w = (this.width = visibleRect.width);
    const h = (this.height = visibleRect.height);
    const l = visibleRect.x,
      b = visibleRect.y,
      t = b + h,
      r = l + w;

    this.topLeft.set(l, t);
    this.topRight.set(r, t);
    this.top.set(l + w / 2, t);

    this.bottomLeft.set(l, b);
    this.bottomRight.set(r, b);
    this.bottom.set(l + w / 2, b);

    this.center.set(l + w / 2, b + h / 2);
    this.left.set(l, b + h / 2);
    this.right.set(r, b + h / 2);
  }
}
