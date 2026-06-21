/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

import { PTM_RATIO } from "./box2d-test-constants";
import { Color, EventListener, EventListenerType, LayerColor, Point, Rect, radiansToDegrees, ServiceLocator } from "@aspect/core";
import { BMButton, TextBMFont, Widget } from "@aspect/ccui";
import { s_simpleFont_fnt } from "../resources";

const BOX_SIZE = PTM_RATIO;
const BOX_CAP = 6;
const BOX_CASES = [
  { label: "A", tint: new Color(0x00, 0xFF, 0xFF) },
  { label: "B", tint: new Color(0xFF, 0x00, 0x00) },
  { label: "C", tint: new Color(0x00, 0xFF, 0x00) },
  { label: "D", tint: new Color(0x00, 0x00, 0xFF) }
];

export class Box2DTestLayer extends LayerColor {
  constructor() {
    if (window.sideIndexBar) {
      window.sideIndexBar.changeTest(0, 2);
    }
    //----start0----ctor
    super(new Color(0, 0, 0, 255));

    this.world = null;
    // External map from body pointer -> node (box2d-wasm doesn't support userData)
    this._bodyToSprite = {};

    ServiceLocator.eventManager.addListener(
      EventListener.create({
        event: EventListenerType.TOUCH_ALL_AT_ONCE,
        onTouchesEnded: function (touches, event) {
          event.getCurrentTarget().addNewSpriteWithCoords(touches[0]);
        }
      }),
      this
    );

    var winSize = ServiceLocator.director.getWinSize();
    var label = new TextBMFont("Tap screen", s_simpleFont_fnt);
    label.color = new Color(0, 0, 255);
    label.x = winSize.width / 2;
    label.y = winSize.height - 80;
    this.addChild(label, 0);

    // Defer physics setup until box2d-wasm WASM has finished loading
    window.Box2DReady.then(
      function (box2D) {
        this._initPhysics(box2D);
      }.bind(this)
    );

    this.scheduleUpdate();
    //----end0----
  }

  _initPhysics(box2D) {
    var b2Vec2 = box2D.b2Vec2;
    var b2BodyDef = box2D.b2BodyDef;
    var b2_staticBody = box2D.b2_staticBody;
    var b2FixtureDef = box2D.b2FixtureDef;
    var b2World = box2D.b2World;
    var b2PolygonShape = box2D.b2PolygonShape;
    this._box2D = box2D;

    var screenSize = ServiceLocator.director.getWinSize();

    // Construct a world object
    var gravity = new b2Vec2(0, -10);
    this.world = new b2World(gravity);

    var fixDef = new b2FixtureDef();
    fixDef.set_density(1.0);
    fixDef.set_friction(0.5);
    fixDef.set_restitution(0.2);

    var bodyDef = new b2BodyDef();
    bodyDef.set_type(b2_staticBody);

    // create ground walls
    var groundShape = new b2PolygonShape();
    groundShape.SetAsBox(20, 2);
    fixDef.set_shape(groundShape);
    // upper
    bodyDef.set_position(new b2Vec2(10, screenSize.height / PTM_RATIO + 1.8));
    this.world.CreateBody(bodyDef).CreateFixture(fixDef);
    // bottom
    bodyDef.set_position(new b2Vec2(10, -1.8));
    this.world.CreateBody(bodyDef).CreateFixture(fixDef);

    var wallShape = new b2PolygonShape();
    wallShape.SetAsBox(2, 14);
    fixDef.set_shape(wallShape);
    // left
    bodyDef.set_position(new b2Vec2(-1.8, 13));
    this.world.CreateBody(bodyDef).CreateFixture(fixDef);
    // right
    bodyDef.set_position(new b2Vec2(26.8, 13));
    this.world.CreateBody(bodyDef).CreateFixture(fixDef);

    this.addNewSpriteWithCoords(
      new Point(screenSize.width / 2, screenSize.height / 2)
    );
  }

  addNewSpriteWithCoords(p) {
    //----start0----addNewSpriteWithCoords
    if (!this.world || !this._box2D) return;

    var box2D = this._box2D;
    var b2Vec2 = box2D.b2Vec2;
    var b2BodyDef = box2D.b2BodyDef;
    var b2_dynamicBody = box2D.b2_dynamicBody;
    var b2FixtureDef = box2D.b2FixtureDef;
    var b2PolygonShape = box2D.b2PolygonShape;
    var getPointer = box2D.getPointer;

    const caseIdx = Math.floor(Math.random() * BOX_CASES.length);
    const { label, tint } = BOX_CASES[caseIdx];

    const btn = new BMButton(
      "default_theme/rounded_shadow_0.png",
      "default_theme/rounded_shadow_0.png",
      "default_theme/rounded_shadow_0.png",
      Widget.PLIST_TEXTURE
    );
    btn.setScale9Enabled(true);
    btn.setCapInsets(new Rect(BOX_CAP, BOX_CAP, BOX_CAP, BOX_CAP));
    btn.setContentSize(BOX_SIZE, BOX_SIZE);
    btn.setTitleFntFile(s_simpleFont_fnt);
    btn.setTitleText(label);
    btn.setTitleFontSize(18);
    btn.setTitleColor(new Color(0, 0, 0));
    btn.setNormalBgColor(tint);
    btn.setPressedBgColor(tint);
    btn.setDisabledBgColor(tint);
    btn.x = p.x;
    btn.y = p.y;
    this.addChild(btn);

    var bodyDef = new b2BodyDef();
    bodyDef.set_type(b2_dynamicBody);
    bodyDef.set_position(new b2Vec2(p.x / PTM_RATIO, p.y / PTM_RATIO));
    var body = this.world.CreateBody(bodyDef);

    var dynamicBox = new b2PolygonShape();
    dynamicBox.SetAsBox(0.5, 0.5);

    var fixtureDef = new b2FixtureDef();
    fixtureDef.set_shape(dynamicBox);
    fixtureDef.set_density(1.0);
    fixtureDef.set_friction(0.3);
    body.CreateFixture(fixtureDef);

    // Associate the node with the body via its pointer (box2d-wasm has no userData)
    this._bodyToSprite[getPointer(body)] = btn;
    //----end0----
  }

  update(dt) {
    //----start0----update
    if (!this.world || !this._box2D) return;

    var velocityIterations = 8;
    var positionIterations = 1;
    this.world.Step(dt, velocityIterations, positionIterations);

    var getPointer = this._box2D.getPointer;
    var NULL = this._box2D.NULL;
    var nullPtr = getPointer(NULL);

    for (
      var b = this.world.GetBodyList();
      getPointer(b) !== nullPtr;
      b = b.GetNext()
    ) {
      var node = this._bodyToSprite[getPointer(b)];
      if (node) {
        node.x = b.GetPosition().x * PTM_RATIO;
        node.y = b.GetPosition().y * PTM_RATIO;
        node.rotation = -1 * radiansToDegrees(b.GetAngle());
      }
    }
    //----end0----
  }
}
