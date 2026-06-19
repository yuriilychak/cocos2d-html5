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

import type { SizeLike } from "./types";

export class Size implements SizeLike {
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

  public static equalTo(
    size1: SizeLike | null | undefined,
    size2: SizeLike | null | undefined
  ): boolean {
    return (
      size1 != null &&
      size2 != null &&
      size1.width === size2.width &&
      size1.height === size2.height
    );
  }

  public static isLike(value: unknown): value is SizeLike {
    return (
      value != null &&
      typeof (value as SizeLike).width === "number" &&
      typeof (value as SizeLike).height === "number"
    );
  }
}
