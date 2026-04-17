/**
 * Copyright (c) 2012 Scott Lembcke and Howling Moon Software
 * Copyright (c) 2008-2010 Ricardo Quesada
 * Copyright (c) 2011-2012 cocos2d-x.org
 * Copyright (c) 2013-2014 Chukong Technologies Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/** A CCSprite subclass that is bound to a physics body.
 It works with:
 - Chipmunk: Preprocessor macro CC_ENABLE_CHIPMUNK_INTEGRATION should be defined
 - Objective-Chipmunk: Preprocessor macro CC_ENABLE_CHIPMUNK_INTEGRATION should be defined
 - Box2d: Preprocessor macro CC_ENABLE_BOX2D_INTEGRATION should be defined

 Features and Limitations:
 - Scale and Skew properties are ignored.
 - Position and rotation are going to updated from the physics body
 - If you update the rotation or position manually, the physics body will be updated
 - You can't eble both Chipmunk support and Box2d support at the same time. Only one can be enabled at compile time
 */
(function () {
  /**
   * @class
   */
  cc.PhysicsSprite = class PhysicsSprite extends cc.Sprite {
    /**
     * Create a PhysicsSprite with filename and rect
     * Constructor of cc.PhysicsSprite for chipmunk
     * @param {String|cc.Texture2D|cc.SpriteFrame} fileName
     * @param {cc.Rect} rect
     * @example
     *
     * 1.Create a sprite with image path and rect
     * var physicsSprite1 = new cc.PhysicsSprite("res/HelloHTML5World.png");
     * var physicsSprite2 = new cc.PhysicsSprite("res/HelloHTML5World.png",cc.rect(0,0,480,320));
     *
     * 2.Create a sprite with a sprite frame name. Must add "#" before frame name.
     * var physicsSprite = new cc.PhysicsSprite('#grossini_dance_01.png');
     *
     * 3.Create a sprite with a sprite frame
     * var spriteFrame = cc.spriteFrameCache.getSpriteFrame("grossini_dance_01.png");
     * var physicsSprite = new cc.PhysicsSprite(spriteFrame);
     *
     * 4.Creates a sprite with an exsiting texture contained in a CCTexture2D object
     *      After creation, the rect will be the size of the texture, and the offset will be (0,0).
     * var texture = cc.textureCache.addImage("HelloHTML5World.png");
     * var physicsSprite1 = new cc.PhysicsSprite(texture);
     * var physicsSprite2 = new cc.PhysicsSprite(texture, cc.rect(0,0,480,320));
     *
     */
    constructor(fileName, rect) {
      super();
      this._ignoreBodyRotation = false;
      this._body = null;
      this._rotation = 1;

      if (fileName === undefined) {
        cc.PhysicsSprite.prototype.init.call(this);
      } else if (cc.isString(fileName)) {
        if (fileName[0] === "#") {
          //init with a sprite frame name
          var frameName = fileName.substr(1, fileName.length - 1);
          var spriteFrame = cc.spriteFrameCache.getSpriteFrame(frameName);
          this.initWithSpriteFrame(spriteFrame);
        } else {
          //init  with filename and rect
          this.init(fileName, rect);
        }
      } else if (cc.isObject(fileName)) {
        if (fileName instanceof cc.Texture2D) {
          //init  with texture and rect
          this.initWithTexture(fileName, rect);
        } else if (fileName instanceof cc.SpriteFrame) {
          //init with a sprite frame
          this.initWithSpriteFrame(fileName);
        }
      }

      cc.renderer.pushRenderCommand(this._renderCmd);
    }

    visit() {
      cc.renderer.pushRenderCommand(this._renderCmd);
      super.visit();
    }

    /**
     * set body
     * @param {cp.Body} body
     */
    setBody(body) {
      this._body = body;
    }

    /**
     * get body
     * @returns {cp.Body}
     */
    getBody() {
      return this._body;
    }

    /**
     * get position
     * @return {cc.Point}
     */
    getPosition() {
      var locBody = this._body;
      return { x: locBody.p.x, y: locBody.p.y };
    }

    /**
     * get position x
     * @return {Number}
     */
    getPositionX() {
      return this._body.p.x;
    }

    /**
     * get position y
     * @return {Number}
     */
    getPositionY() {
      return this._body.p.y;
    }

    /**
     * set position
     * @param {cc.Point|Number}newPosOrxValue
     * @param {Number}yValue
     */
    setPosition(newPosOrxValue, yValue) {
      if (yValue === undefined) {
        this._body.p.x = newPosOrxValue.x;
        this._body.p.y = newPosOrxValue.y;
      } else {
        this._body.p.x = newPosOrxValue;
        this._body.p.y = yValue;
      }
    }

    /**
     * set position x
     * @param {Number} xValue
     */
    setPositionX(xValue) {
      this._body.p.x = xValue;
    }

    /**
     * set position y
     * @param {Number} yValue
     */
    setPositionY(yValue) {
      this._body.p.y = yValue;
    }

    _syncPosition() {
      var locPosition = this._position,
        locBody = this._body;
      if (locPosition.x !== locBody.p.x || locPosition.y !== locBody.p.y) {
        cc.Sprite.prototype.setPosition.call(this, locBody.p.x, locBody.p.y);
      }
    }

    /**
     * get rotation
     * @return {Number}
     */
    getRotation() {
      return this._ignoreBodyRotation
        ? this._rotationX
        : -cc.radiansToDegrees(this._body.a);
    }

    /**
     * set rotation
     * @param {Number} r
     */
    setRotation(r) {
      if (this._ignoreBodyRotation) {
        cc.Sprite.prototype.setRotation.call(this, r);
      } else {
        this._body.a = -cc.degreesToRadians(r);
      }
    }

    _syncRotation() {
      var a = -cc.radiansToDegrees(this._body.a);
      if (this._rotationX !== a) {
        cc.Sprite.prototype.setRotation.call(this, a);
      }
    }

    /**
     * get the affine transform matrix of node to parent coordinate frame
     * @return {cc.AffineTransform}
     */
    getNodeToParentTransform() {
      return this._renderCmd.getNodeToParentTransform();
    }

    /**
     * whether dirty
     * @return {Boolean}
     */
    isDirty() {
      return !this._body.isSleeping();
    }

    setDirty() {}

    /**
     * set whether to ignore rotation of body
     * @param {Boolean} b
     */
    setIgnoreBodyRotation(b) {
      this._ignoreBodyRotation = b;
    }

    _createRenderCmd() {
      if (cc._renderType === cc.game.RENDER_TYPE_CANVAS)
        return new cc.PhysicsSprite.CanvasRenderCmd(this);
      else return new cc.PhysicsSprite.WebGLRenderCmd(this);
    }
  };
  cc.PhysicsSprite._className = "PhysicsSprite";
  var _p = cc.PhysicsSprite.prototype;
  // Extended properties
  /** @expose */
  _p.body;
  cc.defineGetterSetter(_p, "body", _p.getBody, _p.setBody);
  /** @expose */
  _p.dirty;
  cc.defineGetterSetter(_p, "dirty", _p.isDirty, _p.setDirty);
})();
