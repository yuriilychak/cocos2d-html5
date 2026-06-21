/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
// All At Once Touches
//
//------------------------------------------------------------------
import { EventTest } from "./event-test";
import { s_pathR2 } from "../resources";
import { Color, EventListener, Sprite, log, ServiceLocator } from "@aspect/core";

export class TouchAllAtOnce extends EventTest {
  init() {
    super.init();

    this.ids = {};
    this.unused_sprites = [];

    if ("touches" in ServiceLocator.sys.capabilities) {
      // this is the default behavior. No need to set it explicitly.
      ServiceLocator.eventManager.addListener(
        {
          event: EventListener.TOUCH_ALL_AT_ONCE,
          onTouchesBegan: this.onTouchesBegan,
          onTouchesMoved: this.onTouchesMoved,
          onTouchesEnded: this.onTouchesEnded,
          onTouchesCancelled: this.onTouchesCancelled
        },
        this
      );
    } else {
      log("TOUCHES not supported");
    }

    for (var i = 0; i < 5; i++) {
      var sprite = (this.sprite = new Sprite(s_pathR2));
      this.addChild(sprite, i + 10);
      sprite.x = 0;
      sprite.y = 0;
      sprite.scale = 1;
      sprite.color = new Color(
        Math.random() * 200 + 55,
        Math.random() * 200 + 55,
        Math.random() * 200 + 55
      );
      this.unused_sprites.push(sprite);
    }
  }
  subtitle() {
    return "Touches All At Once. Touch and see console";
  }

  new_id(id, pos) {
    var s = this.unused_sprites.pop();
    this.ids[id] = s;
    s.x = pos.x;
    s.y = pos.y;
  }
  update_id(id, pos) {
    var s = this.ids[id];
    s.x = pos.x;
    s.y = pos.y;
  }
  release_id(id, pos) {
    var s = this.ids[id];
    this.ids[id] = null;
    this.unused_sprites.push(s);
    s.x = 0;
    s.y = 0;
  }

  onTouchesBegan(touches, event) {
    var target = event.getCurrentTarget();
    for (var i = 0; i < touches.length; i++) {
      var touch = touches[i];
      var id = touch.id;
      log(
        "Touch #" +
          i +
          ". onTouchesBegan at: " +
          touch.x +
          " " +
          touch.y +
          " Id:" +
          id
      );
      target.new_id(id, touch);
    }
  }
  onTouchesMoved(touches, event) {
    var target = event.getCurrentTarget();
    for (var i = 0; i < touches.length; i++) {
      var touch = touches[i];
      var id = touch.id;
      var force = 0,
        maxForce = 0;
      if (touch.getCurrentForce) {
        force = touch.getCurrentForce();
        maxForce = touch.getMaxForce();
      }
      log(
        "Touch #" +
          i +
          ". onTouchesMoved at: " +
          touch.x +
          " " +
          touch.y +
          " Id:" +
          id +
          " current force:" +
          force +
          " maximum postible force:" +
          maxForce
      );
      target.update_id(id, touch);
    }
  }
  onTouchesEnded(touches, event) {
    var target = event.getCurrentTarget();
    for (var i = 0; i < touches.length; i++) {
      var touch = touches[i];
      var id = touch.id;
      log(
        "Touch #" +
          i +
          ". onTouchesEnded at: " +
          touch.x +
          " " +
          touch.y +
          " Id:" +
          id
      );
      target.release_id(id);
    }
  }
  onTouchesCancelled(touches, event) {
    var target = event.getCurrentTarget();
    for (var i = 0; i < touches.length; i++) {
      var touch = touches[i];
      var id = touch.id;
      log(
        "Touch #" +
          i +
          ". onTouchesCancelled at: " +
          touch.x +
          " " +
          touch.y +
          " Id:" +
          id
      );
      target.release_id(id);
    }
  }
}
