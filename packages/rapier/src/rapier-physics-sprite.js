import { Sprite } from "@aspect/core";

/**
 * RapierPhysicsSprite - a Sprite whose transform is driven by a Rapier RigidBody.
 *
 * Each frame (inside visit()) the body's translation and rotation are read and
 * applied to the sprite so it follows the physics simulation.
 */
export class RapierPhysicsSprite extends Sprite {
  constructor(filename, rect) {
    super(filename, rect);
    this._rapierBody = null;
  }

  setBody(body) {
    this._rapierBody = body;
  }

  getBody() {
    return this._rapierBody;
  }

  visit(parentCmd) {
    if (this._rapierBody) {
      const t = this._rapierBody.translation();
      const r = this._rapierBody.rotation();
      this.setPosition(t.x, t.y);
      this.rotation = -r * 180 / Math.PI;
    }
    super.visit(parentCmd);
  }
}

RapierPhysicsSprite._className = "RapierPhysicsSprite";
