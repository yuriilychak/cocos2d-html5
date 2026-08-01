import { Point, Rect, Size, AffineTransform } from "../../../geometry";
import { log, _LogInfos } from "../../../boot/debugger";
import { Component } from "../../../components";
import { dirtyFlags } from "../node-canvas-render-cmd";
import { NodeComponentName } from "../../../enums";
import { ServiceLocator } from "../../../service-locator";

export default class NodeTransform extends Component {
  #rotation = new Point();
  #position = new Point();
  #normalizedPosition = new Point();
  #normalizedPositionDirty = false;
  #usingNormalizedPosition = false;
  #ignoreAnchorPointForPosition = false;
  #contentSize = new Size();
  #scale = new Point(1, 1);
  #anchor = new Point();
  #skew = new Point();
  #additionalTransform = AffineTransform.makeIdentity();
  #additionalTransformDirty = false;

  constructor() {
    super(NodeComponentName.Transform);
  }

  get #renderCmd() {
    return this.owner.renderCmd;
  }

  #setTransformDirty() {
    this.#renderCmd.setDirtyFlag(dirtyFlags.transformDirty);
  }

  get width() { return this.#contentSize.width; }
  set width(value) {
    if (this.#contentSize.width === value) return;
    this.#contentSize.width = value;
    this.#renderCmd._updateAnchorPointInPoint();
  }

  get height() { return this.#contentSize.height; }
  set height(value) {
    if (this.#contentSize.height === value) return;
    this.#contentSize.height = value;
    this.#renderCmd._updateAnchorPointInPoint();
  }

  get anchor() { return this.#anchor.clone(); }
  set anchor(value) {
    if (Point.equalTo(this.#anchor, value)) return;
    this.#anchor.set(value);
    this.#renderCmd._updateAnchorPointInPoint();
  }

  get anchorX() { return this.#anchor.x; }
  set anchorX(value) {
    if (this.#anchor.x === value) return;
    this.#anchor.x = value;
    this.#renderCmd._updateAnchorPointInPoint();
  }

  get anchorY() { return this.#anchor.y; }
  set anchorY(value) {
    if (this.#anchor.y === value) return;
    this.#anchor.y = value;
    this.#renderCmd._updateAnchorPointInPoint();
  }

  get rotationX() { return this.#rotation.x; }
  set rotationX(value) {
    if (this.#rotation.x === value) return;
    this.#rotation.x = value;
    this.#setTransformDirty();
  }

  get rotationY() { return this.#rotation.y; }
  set rotationY(value) {
    if (this.#rotation.y === value) return;
    this.#rotation.y = value;
    this.#setTransformDirty();
  }

  get rotation() {
    if (this.#rotation.x !== this.#rotation.y) log(_LogInfos.Node_getRotation);
    return this.#rotation.x;
  }
  set rotation(value) {
    if (this.#rotation.x === value && this.#rotation.y === value) return;
    this.#rotation.set(value, value);
    this.#setTransformDirty();
  }

  get scale() {
    if (this.#scale.x !== this.#scale.y) log(_LogInfos.Node_getScale);
    return this.#scale.x;
  }
  set scale(value) {
    if (this.#scale.x === value && this.#scale.y === value) return;
    this.#scale.set(value, value);
    this.#setTransformDirty();
  }

  get scaleX() { return this.#scale.x; }
  set scaleX(value) {
    if (this.#scale.x === value) return;
    this.#scale.x = value;
    this.#setTransformDirty();
  }

  get scaleY() { return this.#scale.y; }
  set scaleY(value) {
    if (this.#scale.y === value) return;
    this.#scale.y = value;
    this.#setTransformDirty();
  }

  get skew() { return this.#skew.clone(); }
  set skew(value) {
    if (Point.equalTo(this.#skew, value)) return;
    this.#skew.set(value);
    this.#setTransformDirty();
  }

  get skewX() { return this.#skew.x; }
  set skewX(value) {
    if (this.#skew.x === value) return;
    this.#skew.x = value;
    this.#setTransformDirty();
  }

  get skewY() { return this.#skew.y; }
  set skewY(value) {
    if (this.#skew.y === value) return;
    this.#skew.y = value;
    this.#setTransformDirty();
  }

  get normalizedPosition() { return this.#normalizedPosition.clone(); }
  set normalizedPosition(value) {
    if (this.#usingNormalizedPosition && Point.equalTo(this.#normalizedPosition, value)) return;
    this.#normalizedPosition.set(value);
    this.#normalizedPositionDirty = this.#usingNormalizedPosition = true;
    this.#setTransformDirty();
  }

  get normalizedPositionDirty() { return this.#normalizedPositionDirty; }
  set normalizedPositionDirty(value) {
    if (this.#normalizedPositionDirty === value) return;
    this.#normalizedPositionDirty = value;
  }

  get usingNormalizedPosition() { return this.#usingNormalizedPosition; }

  get position() { return this.#position.clone(); }
  set position(value) {
    if (Point.equalTo(this.#position, value)) return;
    this.#position.set(value);
    this.#usingNormalizedPosition = false;
    this.#setTransformDirty();
  }

  get x() { return this.#position.x; }
  set x(value) {
    if (this.#position.x === value) return;
    this.#position.x = value;
    this.#setTransformDirty();
  }

  get y() { return this.#position.y; }
  set y(value) {
    if (this.#position.y === value) return;
    this.#position.y = value;
    this.#setTransformDirty();
  }

  get contentSize() { return this.#contentSize.clone(); }
  set contentSize(value) {
    if (Size.equalTo(value, this.#contentSize)) return;
    this.#contentSize.set(value);
    this.#renderCmd._updateAnchorPointInPoint();
  }

  get nodeToParentTransform() {
    return this.#renderCmd.nodeToParentTransform;
  }

  /**
   * Returns the matrix that transform parent's space coordinates to the node's (local) space coordinates.<br/>
   * The matrix is in Pixels.
   * @return {AffineTransform}
   */
  get parentToNodeTransform() {
    return this.#renderCmd.parentToNodeTransform;
  }

  /**
   * Returns the world affine transform matrix. The matrix is in Pixels.
   * @return {AffineTransform}
   */
  get nodeToWorldTransform() {
    let transform = this.nodeToParentTransform;
    for (let parent = this.owner.parent; parent !== null; parent = parent.parent) {
      transform = AffineTransform.concat(transform, parent.nodeToParentTransform);
    }
    return transform;
  }

  /**
   * Returns the inverse world affine transform matrix. The matrix is in Pixels.
   * @return {AffineTransform}
   */
  get worldToNodeTransform() {
    return AffineTransform.invert(this.nodeToWorldTransform);
  }

  /**
   * Converts a Point to node (local) space coordinates. The result is in Points.
   * @param {Point} worldPoint
   * @return {Point}
   */
  convertToNodeSpace(worldPoint) {
    return AffineTransform.applyToPoint(worldPoint, this.worldToNodeTransform);
  }

  /**
   * Converts a Point to world space coordinates. The result is in Points.
   * @param {Point} nodePoint
   * @return {Point}
   */
  convertToWorldSpace(nodePoint = new Point()) {
    return AffineTransform.applyToPoint(nodePoint, this.nodeToWorldTransform);
  }

  /**
   * Converts a Point to node (local) space coordinates. The result is in Points.<br/>
   * treating the returned/received node point as anchor relative.
   * @param {Point} worldPoint
   * @return {Point}
   */
  convertToNodeSpaceAR(worldPoint) {
    return Point.sub(
      this.convertToNodeSpace(worldPoint),
      this.#renderCmd.anchorPointInPoints
    );
  }

  /**
   * Converts a local Point to world space coordinates.The result is in Points.<br/>
   * treating the returned/received node point as anchor relative.
   * @param {Point} nodePoint
   * @return {Point}
   */
  convertToWorldSpaceAR(nodePoint) {
    const point = Point.add(
      nodePoint || new Point(),
      this.#renderCmd.anchorPointInPoints
    );
    return this.convertToWorldSpace(point);
  }

  /**
   * converts a Touch (world coordinates) into a local coordinate. This method is AR (Anchor Relative).
   * @param {Touch} touch The touch object
   * @return {Point}
   */
  convertTouchToNodeSpaceAR(touch) {
    return this.convertToNodeSpaceAR(ServiceLocator.eglView.convertToGL(touch));
  }

  get boundingBox() {
    const rect = new Rect(0, 0, this.#contentSize.width, this.#contentSize.height);
    
    return AffineTransform._applyToRectIn(
      rect,
      this.#renderCmd.nodeToParentTransform
    );
  }

  get boundingBoxToWorld() {
    const owner = this.owner;
    let rect = new Rect(0, 0, owner.width, owner.height);
    const transform = this.nodeToWorldTransform;
    rect = AffineTransform.applyToRect(rect, transform);

    for (const child of owner.children) {
      if (child && child.visible) {
        const childRect = child.getBoundingBoxToCurrentNode(transform);
        if (childRect) rect = Rect.union(rect, childRect);
      }
    }
    return rect;
  }

  getBoundingBoxToCurrentNode(parentTransform) {
    const owner = this.owner;
    let rect = new Rect(0, 0, owner.width, owner.height);
    const transform = parentTransform === undefined
      ? this.nodeToParentTransform
      : AffineTransform.concat(this.nodeToParentTransform, parentTransform);
    rect = AffineTransform.applyToRect(rect, transform);

    for (const child of owner.children) {
      if (child && child.visible) {
        const childRect = child.getBoundingBoxToCurrentNode(transform);
        if (childRect) rect = Rect.union(rect, childRect);
      }
    }
    return rect;
  }

  get ignoreAnchorPointForPosition() { return this.#ignoreAnchorPointForPosition; }
  set ignoreAnchorPointForPosition(value) {
    if (value === this.#ignoreAnchorPointForPosition) {
      return;
    }

    this.#ignoreAnchorPointForPosition = value;
    this.#setTransformDirty();
  }

  get additionalTransform() { return this.#additionalTransform; }
  get additionalTransformDirty() { return this.#additionalTransformDirty; }
  /**
   *<p>Sets the additional transform.<br/>
   *  The additional transform will be concatenated at the end of getNodeToParentTransform.<br/>
   *  It could be used to simulate `parent-child` relationship between two nodes (e.g. one is in BatchNode, another isn't).<br/>
   *  </p>
   *  @param {AffineTransform} additionalTransform  The additional transform
   *  @example
   * // create a batchNode
   * var batch = new SpriteBatchNode("Icon-114.png");
   * this.addChild(batch);
   *
   * // create two sprites, spriteA will be added to batchNode, they are using different textures.
   * var spriteA = new Sprite(batch->getTexture());
   * var spriteB = new Sprite("Icon-72.png");
   *
   * batch.addChild(spriteA);
   *
   * // We can't make spriteB as spriteA's child since they use different textures. So just add it to layer.
   * // But we want to simulate `parent-child` relationship for these two node.
   * this.addChild(spriteB);
   *
   * //position
   * spriteA.position = new Point(200, 200);
   *
   * // Gets the spriteA's transform.
   * var t = spriteA.nodeToParentTransform;
   *
   * // Sets the additional transform to spriteB, spriteB's position will based on its pseudo parent i.e. spriteA.
   * spriteB.transformComponent.additionalTransform = t;
   *
   * //scale
   * spriteA.scale = 2;
   *
   * // Gets the spriteA's transform.
   * t = spriteA.nodeToParentTransform;
   *
   * // Sets the additional transform to spriteB, spriteB's scale will based on its pseudo parent i.e. spriteA.
   * spriteB.transformComponent.additionalTransform = t;
   *
   * //rotation
   * spriteA.rotation = 20;
   *
   * // Gets the spriteA's transform.
   * t = spriteA.nodeToParentTransform;
   *
   * // Sets the additional transform to spriteB, spriteB's rotation will based on its pseudo parent i.e. spriteA.
   * spriteB.transformComponent.additionalTransform = t;
   */
  set additionalTransform(value) {
    if (value === undefined) {
      if (!this.#additionalTransformDirty) {
        return;
      }

      this.#additionalTransformDirty = false;
      return;
    }

    if (value === this.#additionalTransform && this.#additionalTransformDirty) {
      return;
    }

    this.#additionalTransform = value;
    this.#additionalTransformDirty = true;
    this.#setTransformDirty();
  }
}
