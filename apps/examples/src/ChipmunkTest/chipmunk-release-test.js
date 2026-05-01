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
// ChipmunkReleaseTest
//
//------------------------------------------------------------------
import { ChipmunkBaseLayer } from "./chipmunk-base-layer";

export class ChipmunkReleaseTest extends ChipmunkBaseLayer {
  constructor() {
    super();
    // cc.base(this);

    this._title = "Chipmunk Release Test";
    this._subtitle = "Space finalizer should be called";
  }

  collisionBegin(arbiter, space) {
    return true;
  }

  collisionPre(arbiter, space) {
    return true;
  }

  collisionPost(arbiter, space) {
    cc.log("collision post");
  }

  collisionSeparate(arbiter, space) {
    cc.log("collision separate");
  }

  onEnter() {
    super.onEnter();
    // cc.base(this, 'onEnter');

    cc.log("OnEnter");
    cc.sys.garbageCollect();

    this.space.addCollisionHandler(
      10,
      11,
      this.collisionBegin.bind(this),
      this.collisionPre.bind(this),
      this.collisionPost.bind(this),
      this.collisionSeparate.bind(this)
    );
  }

  onExit() {
    cc.log("OnExit");

    // not calling this on purpose
    this.space.removeCollisionHandler(10, 11);
    this.space = null;

    // cc.base(this, 'onExit');
    super.onExit();
  }
}
