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

import { classManager, Director, Sys } from "@aspect/core";

/**
 * <p>
 *  pool is a singleton object serves as an object cache pool.<br/>
 *  It can helps you to improve your game performance for objects which need frequent release and recreate operations<br/>
 *  Some common use case is :
 *      1. Bullets in game (die very soon, massive creation and recreation, no side effect on other objects)
 *      2. Blocks in candy crash (massive creation and recreation)
 *      etc...
 * </p>
 *
 * @example
 * var sp = new Sprite("a.png");
 * this.addChild(sp);
 * pool.putInPool(sp);
 *
 * pool.getFromPool(Sprite, "a.png");
 * @name pool
 */
export class Pool {
  static getInstance() {
    if (!Pool._instance) {
      Pool._instance = new Pool();
    }
    return Pool._instance;
  }

  _pool = {};

  // Used as a scheduler callback — called with obj as `this`
  _releaseCB() {
    this.release();
  }

  _autoRelease(obj) {
    const running = obj._running === undefined ? false : !obj._running;
    Director.getInstance()
      .getScheduler()
      .schedule(this._releaseCB, obj, 0, 0, 0, running);
  }

  /**
   * Put the obj in pool
   * @param obj
   */
  putInPool(obj) {
    let pid = obj.constructor.prototype["__pid"];
    if (!pid) {
      const desc = { writable: true, enumerable: false, configurable: true };
      desc.value = classManager.getNewID();
      Object.defineProperty(obj.constructor.prototype, "__pid", desc);
      pid = obj.constructor.prototype["__pid"];
    }
    if (!this._pool[pid]) {
      this._pool[pid] = [];
    }
    // JSB retain to avoid being auto released
    obj.retain && obj.retain();
    // User implementation for disable the object
    obj.unuse && obj.unuse();
    this._pool[pid].push(obj);
  }

  /**
   * Check if this kind of obj has already in pool
   * @param objClass
   * @returns {boolean} if this kind of obj is already in pool return true,else return false;
   */
  hasObject(objClass) {
    const pid = objClass.prototype["__pid"];
    const list = this._pool[pid];
    if (!list || list.length === 0) {
      return false;
    }
    return true;
  }

  /**
   * Remove the obj if you want to delete it;
   * @param obj
   */
  removeObject(obj) {
    const pid = obj.constructor.prototype["__pid"];
    if (pid) {
      const list = this._pool[pid];
      if (list) {
        for (let i = 0; i < list.length; i++) {
          if (obj === list[i]) {
            // JSB release to avoid memory leak
            obj.release && obj.release();
            list.splice(i, 1);
          }
        }
      }
    }
  }

  /**
   * Get the obj from pool
   * @param objClass
   * @param {...*} args arguments passed to reuse()
   * @returns {*} call the reuse function and return the obj
   */
  getFromPool(objClass, ...args) {
    if (this.hasObject(objClass)) {
      const pid = objClass.prototype["__pid"];
      const list = this._pool[pid];
      const obj = list.pop();
      // User implementation for re-enable the object
      obj.reuse && obj.reuse(...args);
      // JSB release to avoid memory leak
      Sys.getInstance().isNative && obj.release && this._autoRelease(obj);
      return obj;
    }
  }

  /**
   *  remove all objs in pool and reset the pool
   */
  drainAllPools() {
    for (const i in this._pool) {
      for (let j = 0; j < this._pool[i].length; j++) {
        const obj = this._pool[i][j];
        // JSB release to avoid memory leak
        obj.release && obj.release();
      }
    }
    this._pool = {};
  }
}
