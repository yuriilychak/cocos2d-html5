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

/**
 * @name ClassManager
 */
class ClassManager {
  #id = 0 | (Math.random() * 998);
  #instanceId = 0 | (Math.random() * 998);

  public getNewID(): number {
    return this.#id++;
  }

  public getNewInstanceId(): number {
    return this.#instanceId++;
  }
}

export const classManager = new ClassManager();

type BaseClassConstructor = typeof BaseClass & {
  _pid?: number;
};

/* Managed JavaScript Inheritance
 * Based on John Resig's Simple JavaScript Inheritance http://ejohn.org/blog/simple-javascript-inheritance/
 * MIT Licensed.
 */

/**
 * The base class implementation.
 * This implementation does nothing and is used for inheritance only.
 */
export class BaseClass {
  public __instanceId: number;

  public constructor() {
    this.__instanceId = classManager.getNewInstanceId();
  }

  public get instanceId(): number {
    return this.__instanceId;
  }

  public static get __pid(): number {
    const ctor = this as BaseClassConstructor;
    if (!Object.prototype.hasOwnProperty.call(ctor, "_pid")) {
      ctor._pid = classManager.getNewID();
    }

    return ctor._pid!;
  }
}
