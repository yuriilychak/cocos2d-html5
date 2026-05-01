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
// Using "C" API.
// XXX  DO NOT USE THE "C" API.
// XXX  IT WAS ADDED FOR TESTING PURPOSES ONLY
//
//------------------------------------------------------------------
import { ChipmunkBaseLayer } from "./chipmunk-base-layer";
import {
  s_bitmapFontTest5_fnt,
  s_pathGrossini,
  s_pathSister1
} from "../resources";
import { winSize } from "../constants";
import { Point } from "@aspect/core";
import { LabelBMFont } from "@aspect/labels";

export class ChipmunkCollisionTestB extends ChipmunkBaseLayer {
  constructor() {
    super();
    // cc.base(this);

    this.messageDisplayed = false;

    this._title = "Chipmunk Collision Test";
    this._subtitle = 'using "C"-like API. ** DO NOT USE THIS API **';
  }

  // init physics
  initPhysics() {
    this.space = cp.spaceNew();

    // update Physics Debug Node with new space
    this._debugNode.setSpace(this.space);

    var staticBody = cp.spaceGetStaticBody(this.space);

    // Walls using "C" API. DO NO USE THIS API
    var walls = [
      cp.segmentShapeNew(staticBody, cp.v(0, 0), cp.v(winSize.width, 0), 0), // bottom
      cp.segmentShapeNew(
        staticBody,
        cp.v(0, winSize.height),
        cp.v(winSize.width, winSize.height),
        0
      ), // top
      cp.segmentShapeNew(staticBody, cp.v(0, 0), cp.v(0, winSize.height), 0), // left
      cp.segmentShapeNew(
        staticBody,
        cp.v(winSize.width, 0),
        cp.v(winSize.width, winSize.height),
        0
      ) // right
    ];

    for (var i = 0; i < walls.length; i++) {
      // 'properties' using "C" API. DO NO USE THIS API
      var wall = walls[i];
      cp.shapeSetElasticity(wall, 1);
      cp.shapeSetFriction(wall, 1);
      cp.spaceAddShape(this.space, wall);
    }

    // Gravity
    cp.spaceSetGravity(this.space, cp.v(0, -30));
  }

  createPhysicsSprite(pos, file, collision_type) {
    // using "C" API. DO NO USE THIS API
    var body = cp.bodyNew(1, cp.momentForBox(1, 48, 108));
    cp.bodySetPosition(body, pos);
    cp.spaceAddBody(this.space, body);
    // chipmunk v7.0 uses an extra argument
    var shape = cp.boxShapeNew(body, 48, 108, 0);
    cp.shapeSetElasticity(shape, 0.5);
    cp.shapeSetFriction(shape, 0.5);
    cp.shapeSetCollisionType(shape, collision_type);
    cp.spaceAddShape(this.space, shape);

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
      new Point(winSize.width / 2, winSize.height - 20),
      s_pathGrossini,
      1
    );
    var sprite2 = this.createPhysicsSprite(
      new Point(winSize.width / 2, 50),
      s_pathSister1,
      2
    );

    this.addChild(sprite1);
    this.addChild(sprite2);

    cp.spaceAddCollisionHandler(
      this.space,
      1,
      2,
      this.collisionBegin.bind(this),
      this.collisionPre.bind(this),
      this.collisionPost.bind(this),
      this.collisionSeparate.bind(this)
    );
  }

  onExit() {
    cp.spaceRemoveCollisionHandler(this.space, 1, 2);
    cp.spaceFree(this.space);
    super.onExit();
  }

  update(delta) {
    cp.spaceStep(this.space, delta);
  }

  collisionBegin(arbiter, space) {
    if (!this.messageDisplayed) {
      var label = new LabelBMFont(
        "Collision Detected",
        s_bitmapFontTest5_fnt
      );
      this.addChild(label);
      label.x = winSize.width / 2;
      label.y = winSize.height / 2;
      this.messageDisplayed = true;
    }
    cc.log("collision begin");
    var bodies = cp.arbiterGetBodies(arbiter);
    var shapes = cp.arbiterGetShapes(arbiter);
    var collTypeA = cp.shapeGetCollisionType(shapes[0]);
    var collTypeB = cp.shapeGetCollisionType(shapes[1]);
    cc.log("Collision Type A:" + collTypeA);
    cc.log("Collision Type B:" + collTypeB);
    return true;
  }

  collisionPre(arbiter, space) {
    cc.log("collision pre");
    return true;
  }

  collisionPost(arbiter, space) {
    cc.log("collision post");
  }

  collisionSeparate(arbiter, space) {
    cc.log("collision separate");
  }
}
