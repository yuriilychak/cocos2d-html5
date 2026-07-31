import {
  Sprite,
  Texture2D,
  radiansToDegrees,
  degreesToRadians,
  isString,
  isObject,
  SpriteFrame,
  ServiceLocator
} from "@aspect/core";

export class PhysicsSprite extends Sprite {
  constructor(fileName, rect) {
    super();
    this._ignoreBodyRotation = false;
    this._body = null;
    this._rotation = 1;

    if (fileName === undefined) {
      PhysicsSprite.prototype.init.call(this);
    } else if (isString(fileName)) {
      if (fileName[0] === "#") {
        var frameName = fileName.substr(1, fileName.length - 1);
        var spriteFrame = ServiceLocator.spriteFrameCache.get(frameName);
        this.initWithSpriteFrame(spriteFrame);
      } else {
        this.init(fileName, rect);
      }
    } else if (isObject(fileName)) {
      if (fileName instanceof Texture2D) {
        this.initWithTexture(fileName, rect);
      } else if (fileName instanceof SpriteFrame) {
        this.initWithSpriteFrame(fileName);
      }
    }

    ServiceLocator.sys.rendererConfig.renderer.pushRenderCommand(
      this.renderCmd
    );
  }

  get body() {
    return this.getBody();
  }
  set body(v) {
    this.setBody(v);
  }
  get dirty() {
    return this.isDirty();
  }
  set dirty(v) {
    this.setDirty(v);
  }

  visit() {
    ServiceLocator.sys.rendererConfig.renderer.pushRenderCommand(
      this.renderCmd
    );
    super.visit();
  }

  setBody(body) {
    this._body = body;
  }

  getBody() {
    return this._body;
  }

  get position() {
    var locBody = this._body;
    return { x: locBody.p.x, y: locBody.p.y };
  }

  get x() {
    return this._body.p.x;
  }

  get y() {
    return this._body.p.y;
  }

  set position(position) {
    this._body.p.x = position.x;
    this._body.p.y = position.y;
  }

  set x(xValue) {
    this._body.p.x = xValue;
  }

  set y(yValue) {
    this._body.p.y = yValue;
  }

  _syncPosition() {
    if (super.x !== this.x || super.y !== this.y) {
      super.position = this._body.p;
    }
  }

  get rotation() {
    return this._ignoreBodyRotation
      ? this.rotationX
      : -radiansToDegrees(this._body.a);
  }

  set rotation(r) {
    if (this._ignoreBodyRotation) {
      Sprite.prototype.setRotation.call(this, r);
    } else {
      this._body.a = -degreesToRadians(r);
    }
  }

  _syncRotation() {
    var a = -radiansToDegrees(this._body.a);
    if (this.rotationX !== a) {
      Sprite.prototype.setRotation.call(this, a);
    }
  }

  isDirty() {
    return !this._body.isSleeping();
  }

  setDirty() {}

  setIgnoreBodyRotation(b) {
    this._ignoreBodyRotation = b;
  }

  createRenderCmd() {
    if (ServiceLocator.sys.rendererConfig.isCanvas)
      return new PhysicsSprite.CanvasRenderCmd(this);
    else return new PhysicsSprite.WebGLRenderCmd(this);
  }
}
