/**
 * RapierWorld - a high-level wrapper around RAPIER.World that mirrors
 * the Chipmunk space API used by ChipmunkTest demos.
 *
 * All methods assume window.RAPIER is already initialised
 * (i.e. window.RapierReady has resolved).
 */
export class RapierWorld {
  constructor(gravity = { x: 0, y: -100 }) {
    const RAPIER = window.RAPIER;
    this._RAPIER = RAPIER;
    this._world = new RAPIER.World(gravity);
    this._eventQueue = new RAPIER.EventQueue(true);
    this._colliderTypes = new Map();
    this._collisionHandlers = new Map();
    this._defaultHandler = null;
    this._defaultHandlerActive = false;
  }

  // ── Gravity ──────────────────────────────────────────────────────────────

  get gravity() {
    return this._world.gravity;
  }

  set gravity(v) {
    this._world.gravity = v;
  }

  // ── Step ─────────────────────────────────────────────────────────────────

  step(dt) {
    if (dt <= 0) return;
    this._world.timestep = Math.min(dt, 1 / 20);
    this._world.step(this._eventQueue);
    this._drainEvents();
  }

  _drainEvents() {
    this._eventQueue.drainCollisionEvents((h1, h2, started) => {
      const type1 = this._colliderTypes.get(h1) || 0;
      const type2 = this._colliderTypes.get(h2) || 0;
      const lo = Math.min(type1, type2);
      const hi = Math.max(type1, type2);
      const key = `${lo}_${hi}`;
      const handler = this._collisionHandlers.get(key) || this._defaultHandler;
      if (handler) {
        if (started && handler.begin) handler.begin(h1, h2);
        if (!started && handler.separate) handler.separate(h1, h2);
      }
    });
  }

  // ── Body creation ─────────────────────────────────────────────────────────

  createDynamicBody(x, y, angle = 0) {
    const desc = this._RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(x, y)
      .setRotation(angle);
    return this._world.createRigidBody(desc);
  }

  createStaticBody(x = 0, y = 0) {
    const desc = this._RAPIER.RigidBodyDesc.fixed().setTranslation(x, y);
    return this._world.createRigidBody(desc);
  }

  createKinematicBody(x, y) {
    const desc = this._RAPIER.RigidBodyDesc.kinematicPositionBased()
      .setTranslation(x, y);
    return this._world.createRigidBody(desc);
  }

  // ── Shape helpers (attach collider to an existing body) ───────────────────

  _applyOpts(desc, opts = {}) {
    desc.setRestitution(opts.restitution ?? 0.5);
    desc.setFriction(opts.friction ?? 0.5);
    if (opts.density !== undefined) desc.setDensity(opts.density);
    if (opts.sensor) desc.setSensor(true);
    if (opts.translation) desc.setTranslation(opts.translation.x, opts.translation.y);
    if (opts.rotation !== undefined) desc.rotation = opts.rotation;
    return desc;
  }

  _registerCollider(collider, opts = {}) {
    if (opts.collisionType || this._defaultHandlerActive) {
      collider.setActiveEvents(this._RAPIER.ActiveEvents.COLLISION_EVENTS);
    }
    if (opts.collisionType) {
      this._colliderTypes.set(collider.handle, opts.collisionType);
    }
  }

  addBall(body, radius, opts = {}) {
    const desc = this._applyOpts(this._RAPIER.ColliderDesc.ball(radius), opts);
    const collider = this._world.createCollider(desc, body);
    this._registerCollider(collider, opts);
    return collider;
  }

  addBox(body, hw, hh, opts = {}) {
    const desc = this._applyOpts(this._RAPIER.ColliderDesc.cuboid(hw, hh), opts);
    const collider = this._world.createCollider(desc, body);
    this._registerCollider(collider, opts);
    return collider;
  }

  addCapsule(body, halfHeight, radius, opts = {}) {
    const desc = this._applyOpts(
      this._RAPIER.ColliderDesc.capsule(halfHeight, radius),
      opts
    );
    return this._world.createCollider(desc, body);
  }

  addConvexHull(body, vertices, opts = {}) {
    const base = this._RAPIER.ColliderDesc.convexHull(vertices);
    if (!base) return null;
    const desc = this._applyOpts(base, opts);
    const collider = this._world.createCollider(desc, body);
    this._registerCollider(collider, opts);
    return collider;
  }

  /** Create a fixed rigid body + segment collider (for static walls/floors). */
  addStaticSegment(x1, y1, x2, y2, opts = {}) {
    const RAPIER = this._RAPIER;
    const body = this._world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
    const desc = RAPIER.ColliderDesc.segment(
      new RAPIER.Vector2(x1, y1),
      new RAPIER.Vector2(x2, y2)
    )
      .setRestitution(opts.restitution ?? 1.0)
      .setFriction(opts.friction ?? 1.0);
    const collider = this._world.createCollider(desc, body);
    return { body, collider };
  }

  // ── Collision handlers ───────────────────────────────────────────────────

  addCollisionHandler(type1, type2, callbacks) {
    const lo = Math.min(type1, type2);
    const hi = Math.max(type1, type2);
    this._collisionHandlers.set(`${lo}_${hi}`, callbacks);
  }

  removeCollisionHandler(type1, type2) {
    const lo = Math.min(type1, type2);
    const hi = Math.max(type1, type2);
    this._collisionHandlers.delete(`${lo}_${hi}`);
  }

  setDefaultCollisionHandler(callbacks) {
    this._defaultHandler = callbacks;
    this._defaultHandlerActive = true;
    this._world.forEachCollider(col => {
      col.setActiveEvents(this._RAPIER.ActiveEvents.COLLISION_EVENTS);
    });
  }

  clearDefaultCollisionHandler() {
    this._defaultHandler = null;
    this._defaultHandlerActive = false;
  }

  // ── Queries ──────────────────────────────────────────────────────────────

  castRay(startX, startY, endX, endY) {
    const RAPIER = this._RAPIER;
    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 0.001) return null;
    const ray = new RAPIER.Ray(
      { x: startX, y: startY },
      { x: dx / len, y: dy / len }
    );
    const hit = this._world.castRayAndGetNormal(ray, len, true);
    if (!hit) return null;
    const toi = hit.toi;
    return {
      alpha: toi / len,
      point: { x: startX + toi * dx / len, y: startY + toi * dy / len },
      normal: hit.normal
    };
  }

  projectPoint(x, y) {
    const result = this._world.projectPoint({ x, y }, true);
    if (!result) return null;
    const dx = result.point.x - x;
    const dy = result.point.y - y;
    return {
      p: result.point,
      d: result.isInside ? 0 : Math.sqrt(dx * dx + dy * dy)
    };
  }

  // ── Iteration ────────────────────────────────────────────────────────────

  forEachCollider(fn) {
    this._world.forEachCollider(fn);
  }

  forEachRigidBody(fn) {
    this._world.forEachRigidBody(fn);
  }

  // ── Joints ───────────────────────────────────────────────────────────────

  /**
   * @param {object} anchorA  {x,y} in bodyA local space
   * @param {object} anchorB  {x,y} in bodyB local space
   */
  createRevoluteJoint(bodyA, bodyB, anchorA, anchorB) {
    const params = this._RAPIER.JointData.revolute(anchorA, anchorB);
    return this._world.createImpulseJoint(params, bodyA, bodyB, true);
  }

  /**
   * @param {object} axis  {x,y} unit vector for the prismatic axis
   */
  createPrismaticJoint(bodyA, bodyB, anchorA, anchorB, axis) {
    const params = this._RAPIER.JointData.prismatic(anchorA, anchorB, axis);
    return this._world.createImpulseJoint(params, bodyA, bodyB, true);
  }

  /**
   * @param {number} frameA  rotation of bodyA frame (radians)
   * @param {number} frameB  rotation of bodyB frame (radians)
   */
  createFixedJoint(bodyA, bodyB, anchorA, anchorB, frameA = 0, frameB = 0) {
    const params = this._RAPIER.JointData.fixed(anchorA, frameA, anchorB, frameB);
    return this._world.createImpulseJoint(params, bodyA, bodyB, true);
  }

  // ── Cleanup ──────────────────────────────────────────────────────────────

  free() {
    this._world.free();
    this._eventQueue.free();
  }
}
