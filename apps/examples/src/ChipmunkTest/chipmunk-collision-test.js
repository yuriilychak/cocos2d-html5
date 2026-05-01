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
// Chipmunk Collision Test
// Using Object Oriented API.
// Base your samples on the "Object Oriented" API.
//
//------------------------------------------------------------------
import { ChipmunkBaseLayer } from "./chipmunk-base-layer";
import {
  s_bitmapFontTest5_fnt,
  s_pathGrossini,
  s_pathSister1
} from "../resources";
import { winSize } from "../constants";

export class ChipmunkCollisionTest extends ChipmunkBaseLayer {
  constructor() {
    super();
    // cc.base(this);

    this._title = "Chipmunk Collision test";
    this._subtitle = "Using Object Oriented API. ** Use this API **";
  }

  // init physics
  initPhysics() {
    var staticBody = this.space.staticBody;

    // Walls
    var walls = [
      new cp.SegmentShape(staticBody, cp.v(0, 0), cp.v(winSize.width, 0), 0), // bottom
      new cp.SegmentShape(
        staticBody,
        cp.v(0, winSize.height),
        cp.v(winSize.width, winSize.height),
        0
      ), // top
      new cp.SegmentShape(staticBody, cp.v(0, 0), cp.v(0, winSize.height), 0), // left
      new cp.SegmentShape(
        staticBody,
        cp.v(winSize.width, 0),
        cp.v(winSize.width, winSize.height),
        0
      ) // right
    ];
    for (var i = 0; i < walls.length; i++) {
      var wall = walls[i];
      wall.setElasticity(1);
      wall.setFriction(1);
      this.space.addStaticShape(wall);
    }

    // Gravity:
    // testing properties
    this.space.gravity = cp.v(0, -100);
    this.space.iterations = 15;
  }

  createPhysicsSprite(pos, file, collision_type) {
    var body = new cp.Body(1, cp.momentForBox(1, 48, 108));
    body.setPos(pos);
    this.space.addBody(body);
    var shape = new cp.BoxShape(body, 48, 108);
    shape.setElasticity(0.5);
    shape.setFriction(0.5);
    shape.setCollisionType(collision_type);
    this.space.addShape(shape);

    var sprite = new cc.PhysicsSprite(file);
    sprite.setBody(body);
    return sprite;
  }

  onEnter() {
    super.onEnter();
    // cc.base(this, 'onEnter');

    this.initPhysics();
    this.scheduleUpdate();

    var sprite1 = this.createPhysicsSprite(
      new cc.Point(winSize.width / 2, winSize.height - 20),
      s_pathGrossini,
      1
    );
    var sprite2 = this.createPhysicsSprite(
      new cc.Point(winSize.width / 2, 50),
      s_pathSister1,
      2
    );

    this.addChild(sprite1);
    this.addChild(sprite2);

    this.space.addCollisionHandler(
      1,
      2,
      this.collisionBegin.bind(this),
      this.collisionPre.bind(this),
      this.collisionPost.bind(this),
      this.collisionSeparate.bind(this)
    );
  }

  onExit() {
    this.space.removeCollisionHandler(1, 2);
    super.onExit();
  }

  update(delta) {
    this.space.step(delta);
  }

  collisionBegin(arbiter, space) {
    if (!this.messageDisplayed) {
      var label = new cc.LabelBMFont(
        "Collision Detected",
        s_bitmapFontTest5_fnt
      );
      this.addChild(label);
      label.x = winSize.width / 2;
      label.y = winSize.height / 2;
      this.messageDisplayed = true;
    }
    cc.log("collision begin");
    var shapes = arbiter.getShapes();
    var collTypeA = shapes[0].collision_type;
    var collTypeB = shapes[1].collision_type;
    cc.log("Collision Type A:" + collTypeA);
    cc.log("Collision Type B:" + collTypeB);

    //test addPostStepCallback
    space.addPostStepCallback(function () {
      cc.log("post step callback 1");
    });
    space.addPostStepCallback(function () {
      cc.log("post step callback 2");
    });
    return true;
  }

  collisionPre(arbiter, space) {
    cc.log("collision pre");
    cc.log("arbiter e : " + arbiter.e);
    cc.log("arbiter u : " + arbiter.u);
    cc.log(
      "arbiter surface_vr : " +
        arbiter.surface_vr.x +
        "," +
        arbiter.surface_vr.y
    );
    return true;
  }

  collisionPost(arbiter, space) {
    cc.log("collision post");
  }

  collisionSeparate(arbiter, space) {
    cc.log("collision separate");
  }

  title() {
    return "Chipmunk Collision test";
  }
}
