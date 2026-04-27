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
var TAG_SPRITE_MANAGER = 1;
var PTM_RATIO = 32;

var Box2DTestLayer = class Box2DTestLayer extends cc.LayerColor {
  constructor() {
    if (window.sideIndexBar) {
      window.sideIndexBar.changeTest(0, 2);
    }
    //----start0----ctor
    super(new cc.Color(0, 0, 0, 255));

    this.world = null;
    // External map from body pointer -> cc.Sprite (box2d-wasm doesn't support userData)
    this._bodyToSprite = {};

    cc.eventManager.addListener(
      cc.EventListener.create({
        event: cc.EventListener.TOUCH_ALL_AT_ONCE,
        onTouchesEnded: function (touches, event) {
          var touch = touches[0];
          var location = touch.getLocation();
          event.getCurrentTarget().addNewSpriteWithCoords(location);
        }
      }),
      this
    );

    var label = new cc.LabelTTF("Tap screen", "Marker Felt", 32);
    this.addChild(label, 0);
    label.color = new cc.Color(0, 0, 255);
    label.x = cc.director.getWinSize().width / 2;
    label.y = cc.director.getWinSize().height - 50;

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

    var screenSize = cc.director.getWinSize();

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

    // Set up sprite batch
    var mgr = new cc.SpriteBatchNode(s_pathBlock, 150);
    this.addChild(mgr, 0, TAG_SPRITE_MANAGER);

    this.addNewSpriteWithCoords(
      new cc.Point(screenSize.width / 2, screenSize.height / 2)
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

    var batch = this.getChildByTag(TAG_SPRITE_MANAGER);
    if (!batch) return;

    var idx = Math.random() > 0.5 ? 0 : 1;
    var idy = Math.random() > 0.5 ? 0 : 1;
    var sprite = new cc.Sprite(
      batch.texture,
      new cc.Rect(32 * idx, 32 * idy, 32, 32)
    );
    batch.addChild(sprite);
    sprite.x = p.x;
    sprite.y = p.y;

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

    // Associate the sprite with the body via its pointer (box2d-wasm has no userData)
    this._bodyToSprite[getPointer(body)] = sprite;
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
      var sprite = this._bodyToSprite[getPointer(b)];
      if (sprite) {
        sprite.x = b.GetPosition().x * PTM_RATIO;
        sprite.y = b.GetPosition().y * PTM_RATIO;
        sprite.rotation = -1 * cc.radiansToDegrees(b.GetAngle());
      }
    }
    //----end0----
  }
};

var Box2DTestScene = class Box2DTestScene extends TestScene {
  runThisTest() {
    var layer = new Box2DTestLayer();
    this.addChild(layer);
    cc.director.runScene(this);
  }
};

var arrayOfBox2DTest = [Box2DTestLayer];
