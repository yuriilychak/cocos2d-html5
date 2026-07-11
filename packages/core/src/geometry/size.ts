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

import { isNumber } from "../boot/utils";
import type { PointLike, SizeLike } from "./types";

export default class Size implements SizeLike {
  #data: number[];

  constructor();
  constructor(size: SizeLike);
  constructor(width: number, height: number);
  constructor(widthOrSize: number | SizeLike = 0, height = 0) {
    this.#data = [0, 0];
    if (Size.isLike(widthOrSize)) {
      this.#initFromSize(widthOrSize);
    } else {
      this.#initFromNumber(widthOrSize, height);
    }
  }

  get width(): number {
    return this.#data[0];
  }

  set width(value: number) {
    this.#data[0] = value;
  }

  get height(): number {
    return this.#data[1];
  }

  set height(value: number) {
    this.#data[1] = value;
  }

  clone(): Size {
    return new Size(this);
  }

  toString(): string {
    return `width = ${this.#data[0]} height = ${this.#data[1]}`;
  }

  set(size: SizeLike): void;
  set(width: number, height: number): void;
  set(widthOrSize: number | SizeLike, height = 0): void {
    if (Size.isLike(widthOrSize)) {
      this.#initFromSize(widthOrSize);
    } else {
      this.#initFromNumber(widthOrSize, height);
    }
  }

  #initFromNumber(width: number, height: number): void {
    this.#data[0] = width;
    this.#data[1] = height;
  }

  #initFromSize(size: SizeLike): void {
    this.#initFromNumber(size.width, size.height);
  }

  public static copy(size1: SizeLike, size2: SizeLike): SizeLike {
    size1.width = size2.width;
    size1.height = size2.height;

    return size1;
  }

  public static equalTo(size1: SizeLike, size2: SizeLike): boolean {
    return (
      Size.isLike(size1) &&
       Size.isLike(size2) &&
      size1.width === size2.width &&
      size1.height === size2.height
    );
  }

  public static mult(size: SizeLike, scale: number): Size {
    return new Size(size.width * scale, size.height * scale);
  }

  public static compMult(size: SizeLike, point: PointLike): Size {
    return new Size(size.width * point.x, size.height * point.y);
  }

  public static compDiv(size: SizeLike, point: PointLike): Size {
    return new Size(size.width / point.x, size.height / point.y);
  }

  public static compMultIn(size: SizeLike, point: PointLike): SizeLike {
    size.width *= point.x;
    size.height *= point.y;

    return size;
  }

  public static compDivIn(size: SizeLike, point: PointLike): SizeLike {
    size.width /= point.x;
    size.height /= point.y;

    return size;
  }

  public static multIn(size: SizeLike, scale: number): SizeLike {
    size.width *= scale;
    size.height *= scale;

    return size
  }

  public static isLike(value: unknown): value is SizeLike {
    if (
      value === null ||
      (typeof value !== "object" && typeof value !== "function")
    ) {
      return false;
    }

    const size = value as unknown as SizeLike;

    return (
      isNumber(size.width) &&
      isNumber(size.height)
    );
  }
}
