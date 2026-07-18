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

import Event from "./event";
import { EventType, MouseButton, MouseEvent } from "../../enums";
import { ServiceLocator } from "../../service-locator";
import { Point, type PointLike } from "../../geometry";

/**
 * The mouse event
 */
export default class EventMouse extends Event implements PointLike {
  #curr: Point = new Point();
  #prev: Point = new Point();
  #scroll: Point = new Point();
  #eventType: MouseEvent = MouseEvent.NONE;
  #button: MouseButton = MouseButton.LEFT;

  constructor(
    eventType: MouseEvent,
    location: PointLike | null = null,
    prevLocation: PointLike | null = null
  ) {
    super(EventType.MOUSE);
    this.#eventType = eventType;
    if (location) {
      this.#curr.set(location);
    }
    
    if (prevLocation) {
      this.#prev.set(prevLocation);
    }
  }

  set scrollData(point: PointLike) {
    this.#scroll.set(point);
  }

  get scrollData(): Point {
    return this.#scroll.clone();
  }

  /**
   * Returns the x axis scroll value
   */
  get scrollX(): number {
    return this.#scroll.x;
  }

  /**
   * Returns the y axis scroll value
   */
  get scrollY(): number {
    return this.#scroll.y;
  }

  /**
   * Sets cursor location
   * @param {PointLike} point
   */
  set(point: PointLike): void {
    this.#curr.set(point);
  }

  /**
   * Returns cursor location
   */
  clone(): EventMouse {
    const result = new EventMouse(this.#eventType, this.#curr, this.#prev);

    result.button = this.#button;
    result.scrollData = this.#scroll;

    return result;
  }

  /**
   * Returns the current cursor location in screen coordinates
   */
  get locationInView(): Point {
    return new Point(
      this.#curr.x,
      ServiceLocator.eglView.designResolutionSize.height - this.#curr.y
    );
  }

  set prevCursor(point: PointLike) {
    this.#prev.set(point);
  }

  get prevCursor(): Point {
    return this.#prev.clone();
  }

  /**
   * Returns the delta distance from the previous location to current location
   */
  get delta(): Point {
    return Point.sub(this.#curr, this.#prev);
  }

  /**
   * Returns the X axis delta distance from the previous location to current location
   */
  get deltaX(): number {
    return this.#curr.x - this.#prev.x;
  }

  /**
   * Returns the Y axis delta distance from the previous location to current location
   */
  get deltaY(): number {
    return this.#curr.y - this.#prev.y;
  }

  /**
   * Sets mouse button
   */
  set button(button: MouseButton) {
    this.#button = button;
  }

  /**
   * Returns mouse button
   */
  get button(): MouseButton {
    return this.#button;
  }

  get x(): number {
    return this.#curr.x;
  }

  set x(value: number) {
    this.#curr.x = value;
  }

  get y(): number {
    return this.#curr.y;
  }

  set y(value: number) {
    this.#curr.y = value;
  }

  get eventType(): number {
    return this.#eventType;
  }
}
