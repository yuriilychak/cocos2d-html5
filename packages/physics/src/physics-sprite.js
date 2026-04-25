import { Sprite, RendererConfig, Texture2D, radiansToDegrees, degreesToRadians } from "@aspect/core";

export class PhysicsSprite extends Sprite {
  constructor(fileName, rect) {
    super();
    this._ignoreBodyRotation = false;
    this._body = null;
    this._rotation = 1;

    if (fileName === undefined) {
      PhysicsSprite.prototype.init.call(this);
    } else if (cc.isString(fileName)) {
      if (fileName[0] === "#") {
        var frameName = fileName.substr(1, fileName.length - 1);
        var spriteFrame = cc.spriteFrameCache.getSpriteFrame(frameName);
        this.initWithSpriteFrame(spriteFrame);
      } else {
        this.init(fileName, rect);
      }
    } else if (cc.isObject(fileName)) {
      if (fileName instanceof Texture2D) {
        this.initWithTexture(fileName, rect);
      } else if (fileName instanceof cc.SpriteFrame) {
        this.initWithSpriteFrame(fileName);
      }
    }

    RendererConfig.getInstance().renderer.pushRenderCommand(this._renderCmd);
  }

  get body() { return this.getBody(); }
  set body(v) { this.setBody(v); }
  get dirty() { return this.isDirty(); }
  set dirty(v) { this.setDirty(v); }

  visit() {
    RendererConfig.getInstance().renderer.pushRenderCommand(this._renderCmd);
    super.visit();
  }

  setBody(body) {
    this._body = body;
  }

  getBody() {
    return this._body;
  }

  getPosition() {
    var locBody = this._body;
    return { x: locBody.p.x, y: locBody.p.y };
  }

  getPositionX() {
    return this._body.p.x;
  }

  getPositionY() {
    return this._body.p.y;
  }

  setPosition(newPosOrxValue, yValue) {
    if (yValue === undefined) {
      this._body.p.x = newPosOrxValue.x;
      this._body.p.y = newPosOrxValue.y;
    } else {
      this._body.p.x = newPosOrxValue;
      this._body.p.y = yValue;
    }
  }

  setPositionX(xValue) {
    this._body.p.x = xValue;
  }

  setPositionY(yValue) {
    this._body.p.y = yValue;
  }

  _syncPosition() {
    var locPosition = this._position,
      locBody = this._body;
    if (locPosition.x !== locBody.p.x || locPosition.y !== locBody.p.y) {
      Sprite.prototype.setPosition.call(this, locBody.p.x, locBody.p.y);
    }
  }

  getRotation() {
    return this._ignoreBodyRotation
      ? this._rotationX
      : -radiansToDegrees(this._body.a);
  }

  setRotation(r) {
    if (this._ignoreBodyRotation) {
      Sprite.prototype.setRotation.call(this, r);
    } else {
      this._body.a = -degreesToRadians(r);
    }
  }

  _syncRotation() {
    var a = -radiansToDegrees(this._body.a);
    if (this._rotationX !== a) {
      Sprite.prototype.setRotation.call(this, a);
    }
  }

  getNodeToParentTransform() {
    return this._renderCmd.getNodeToParentTransform();
  }

  isDirty() {
    return !this._body.isSleeping();
  }

  setDirty() {}

  setIgnoreBodyRotation(b) {
    this._ignoreBodyRotation = b;
  }

  _createRenderCmd() {
    if (RendererConfig.getInstance().isCanvas)
      return new PhysicsSprite.CanvasRenderCmd(this);
    else return new PhysicsSprite.WebGLRenderCmd(this);
  }
}

PhysicsSprite._className = "PhysicsSprite";
