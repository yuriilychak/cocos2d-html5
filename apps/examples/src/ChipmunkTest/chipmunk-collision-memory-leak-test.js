/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
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

//------------------------------------------------------------------
//
// Chipmunk Collision Memory Leak Test
//
//------------------------------------------------------------------
import { ChipmunkBaseLayer } from "./chipmunk-base-layer";
import { log } from "@aspect/core";

export class ChipmunkCollisionMemoryLeakTest extends ChipmunkBaseLayer {
  constructor() {
    super();
    // base(this);

    this._title = "Chipmunk Memory Leak Test";
    this._subtitle =
      "Testing possible memory leak on the collision handler. No visual feedback";
  }

  collisionBegin(arbiter, space) {
    return true;
  }

  collisionPre(arbiter, space) {
    return true;
  }

  collisionPost(arbiter, space) {
    log("collision post");
  }

  collisionSeparate(arbiter, space) {
    log("collision separate");
  }

  onEnter() {
    super.onEnter();
    // base(this, 'onEnter');

    for (var i = 1; i < 100; i++)
      this.space.addCollisionHandler(
        i,
        i + 1,
        this.collisionBegin.bind(this),
        this.collisionPre.bind(this),
        this.collisionPost.bind(this),
        this.collisionSeparate.bind(this)
      );
  }

  onExit() {
    super.onExit();

    for (var i = 1; i < 100; i++) this.space.removeCollisionHandler(i, i + 1);
  }

  title() {
    return "Chipmunk Memory Leak Test";
  }
}
