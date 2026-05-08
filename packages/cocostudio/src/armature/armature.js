
/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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

/**
 * The main class of Armature, it plays armature animation, manages and updates bones' state.
 *
 * @property {Bone}                 parentBone      - The parent bone of the armature node
 * @property {ArmatureAnimation}    animation       - The animation
 * @property {ArmatureData}         armatureData    - The armature data
 * @property {String}                   name            - The name of the armature
 * @property {SpriteBatchNode}       batchNode       - The batch node of the armature
 * @property {Number}                   version         - The version
 * @property {Object}                   body            - The body of the armature
 * @property {ColliderFilter}       colliderFilter  - <@writeonly> The collider filter of the armature
 */
import { AffineTransform, BLEND_DST, BLEND_SRC, BlendFunc, Game, Node, Point, Rect, RendererConfig, arrayRemoveObject, assert, log } from "@aspect/core";
import { Widget } from "@aspect/ccui";

import { ArmatureAnimation } from "./animation/armature-animation/armature-animation.js";
import { Bone } from "./bone.js";
import { armatureDataManager } from "./utils/armature-data-manager.js";
import { ArmatureData } from "./utils/datas/armature-data.js";
import { AnimationData } from "./utils/datas/utils.js";
export class Armature extends Node {
  /**
   * Create a armature node.
   * Constructor of Armature
   * @param {String} name
   * @param {Bone} parentBone
   * @example
   * var armature = new Armature();
   */
  constructor(name, parentBone) {
    super();
    this._name = "";
    this._topBoneList = [];
    this._armatureIndexDic = {};
    this._offsetPoint = new Point(0, 0);
    this._armatureTransformDirty = true;
    this._blendFunc = { src: BLEND_SRC, dst: BLEND_DST };
    name && this.init(name, parentBone);
    // Hack way to avoid RendererWebGL from skipping Armature
    this._texture = {};
  }

  get parentBone() {
    return this.getParentBone();
  }
  set parentBone(v) {
    this.setParentBone(v);
  }

  get body() {
    return this.getBody();
  }
  set body(v) {
    this.setBody(v);
  }

  set colliderFilter(v) {
    this.setColliderFilter(v);
  }

  /**
   * Initializes a Armature with the specified name and Bone
   * @param {String} [name]
   * @param {Bone} [parentBone]
   * @return {Boolean}
   */
  init(name, parentBone) {
    if (parentBone) this._parentBone = parentBone;
    this.removeAllChildren();
    this.animation = new ArmatureAnimation();
    this.animation.init(this);

    this._boneDic = {};
    this._topBoneList.length = 0;

    //this._name = name || "";
    var animationData;
    if (name !== "") {
      //animationData
      animationData = armatureDataManager.getAnimationData(name);
      assert(animationData, "AnimationData not exist!");

      this.animation.setAnimationData(animationData);

      //armatureData
      var armatureData = armatureDataManager.getArmatureData(name);
      assert(armatureData, "ArmatureData not exist!");

      this.armatureData = armatureData;

      //boneDataDic
      var boneDataDic = armatureData.getBoneDataDic();
      for (var key in boneDataDic) {
        var bone = this.createBone(String(key));

        //! init bone's  Tween to 1st movement's 1st frame
        do {
          var movData = animationData.getMovement(
            animationData.movementNames[0]
          );
          if (!movData) break;

          var _movBoneData = movData.getMovementBoneData(bone.getName());
          if (!_movBoneData || _movBoneData.frameList.length <= 0) break;

          var frameData = _movBoneData.getFrameData(0);
          if (!frameData) break;

          bone.getTweenData().copy(frameData);
          bone.changeDisplayWithIndex(frameData.displayIndex, false);
        } while (0);
      }

      this.update(0);
      this.updateOffsetPoint();
    } else {
      name = "new_armature";
      this.armatureData = new ArmatureData();
      this.armatureData.name = name;

      animationData = new AnimationData();
      animationData.name = name;

      armatureDataManager.addArmatureData(name, this.armatureData);
      armatureDataManager.addAnimationData(name, animationData);

      this.animation.setAnimationData(animationData);
    }

    this._renderCmd.initShaderCache();

    this.setCascadeOpacityEnabled(true);
    this.setCascadeColorEnabled(true);
    return true;
  }

  visit(parent) {
    var cmd = this._renderCmd,
      parentCmd = parent ? parent._renderCmd : null;

    // quick return if not visible
    if (!this._visible) {
      cmd._propagateFlagsDown(parentCmd);
      return;
    }

    cmd.visit(parentCmd);
    cmd._dirtyFlag = 0;
  }

  addChild(child, localZOrder, tag) {
    if (child instanceof Widget) {
      log(
        "Armature doesn't support to add Widget as its child, it will be fix soon."
      );
      return;
    }
    super.addChild(child, localZOrder, tag);
  }

  /**
   * create a bone with name
   * @param {String} boneName
   * @return {Bone}
   */
  createBone(boneName) {
    var existedBone = this.getBone(boneName);
    if (existedBone) return existedBone;

    var boneData = this.armatureData.getBoneData(boneName);
    var parentName = boneData.parentName;

    var bone = null;
    if (parentName) {
      this.createBone(parentName);
      bone = new Bone(boneName);
      this.addBone(bone, parentName);
    } else {
      bone = new Bone(boneName);
      this.addBone(bone, "");
    }

    bone.setBoneData(boneData);
    bone.getDisplayManager().changeDisplayWithIndex(-1, false);
    return bone;
  }

  /**
   * Add a Bone to this Armature
   * @param {Bone} bone  The Bone you want to add to Armature
   * @param {String} parentName The parent Bone's name you want to add to. If it's  null, then set Armature to its parent
   */
  addBone(bone, parentName) {
    assert(bone, "Argument must be non-nil");
    var locBoneDic = this._boneDic;
    if (bone.getName())
      assert(
        !locBoneDic[bone.getName()],
        "bone already added. It can't be added again"
      );

    if (parentName) {
      var boneParent = locBoneDic[parentName];
      if (boneParent) boneParent.addChildBone(bone);
      else this._topBoneList.push(bone);
    } else this._topBoneList.push(bone);
    bone.setArmature(this);

    locBoneDic[bone.getName()] = bone;
    this.addChild(bone);
  }

  /**
   * Remove a bone with the specified name. If recursion it will also remove child Bone recursively.
   * @param {Bone} bone The bone you want to remove
   * @param {Boolean} recursion Determine whether remove the bone's child  recursion.
   */
  removeBone(bone, recursion) {
    assert(bone, "bone must be added to the bone dictionary!");

    bone.setArmature(null);
    bone.removeFromParent(recursion);
    arrayRemoveObject(this._topBoneList, bone);

    delete this._boneDic[bone.getName()];
    this.removeChild(bone, true);
  }

  /**
   * Gets a bone with the specified name
   * @param {String} name The bone's name you want to get
   * @return {Bone}
   */
  getBone(name) {
    return this._boneDic[name];
  }

  /**
   * Change a bone's parent with the specified parent name.
   * @param {Bone} bone The bone you want to change parent
   * @param {String} parentName The new parent's name
   */
  changeBoneParent(bone, parentName) {
    assert(bone, "bone must be added to the bone dictionary!");

    var parentBone = bone.getParentBone();
    if (parentBone) {
      arrayRemoveObject(parentBone.getChildren(), bone);
      bone.setParentBone(null);
    }

    if (parentName) {
      var boneParent = this._boneDic[parentName];
      if (boneParent) {
        boneParent.addChildBone(bone);
        arrayRemoveObject(this._topBoneList, bone);
      } else this._topBoneList.push(bone);
    }
  }

  /**
   * Get Armature's bone dictionary
   * @return {Object} Armature's bone dictionary
   */
  getBoneDic() {
    return this._boneDic;
  }

  /**
   * Set contentSize and Calculate anchor point.
   */
  updateOffsetPoint() {
    // Set contentsize and Calculate anchor point.
    var rect = this.getBoundingBox();
    this.setContentSize(rect);
    var locOffsetPoint = this._offsetPoint;
    locOffsetPoint.x = -rect.x;
    locOffsetPoint.y = -rect.y;
    if (rect.width !== 0 && rect.height !== 0)
      this.setAnchorPoint(
        locOffsetPoint.x / rect.width,
        locOffsetPoint.y / rect.height
      );
  }

  getOffsetPoints() {
    return { x: this._offsetPoint.x, y: this._offsetPoint.y };
  }

  /**
   * Sets animation to this Armature
   * @param {ArmatureAnimation} animation
   */
  setAnimation(animation) {
    this.animation = animation;
  }

  /**
   * Gets the animation of this Armature.
   * @return {ArmatureAnimation}
   */
  getAnimation() {
    return this.animation;
  }

  /**
   * armatureTransformDirty getter
   * @returns {Boolean}
   */
  getArmatureTransformDirty() {
    return this._armatureTransformDirty;
  }

  /**
   * The update callback of Armature, it updates animation's state and updates bone's state.
   * @override
   * @param {Number} dt
   */
  update(dt) {
    this.animation.update(dt);
    var locTopBoneList = this._topBoneList;
    for (var i = 0; i < locTopBoneList.length; i++)
      locTopBoneList[i].update(dt);
    this._armatureTransformDirty = false;
  }

  /**
   * The callback when Armature enter stage.
   * @override
   */
  onEnter() {
    super.onEnter();
    this.scheduleUpdate();
  }

  /**
   * The callback when Armature exit stage.
   * @override
   */
  onExit() {
    super.onExit();
    this.unscheduleUpdate();
  }

  /**
   * This boundingBox will calculate all bones' boundingBox every time
   * @returns {Rect}
   */
  getBoundingBox() {
    var minX,
      minY,
      maxX,
      maxY = 0;
    var first = true;

    var boundingBox = new Rect(0, 0, 0, 0),
      locChildren = this._children;

    var len = locChildren.length;
    for (var i = 0; i < len; i++) {
      var bone = locChildren[i];
      if (bone) {
        var r = bone.getDisplayManager().getBoundingBox();
        if (r.x === 0 && r.y === 0 && r.width === 0 && r.height === 0) continue;

        if (first) {
          minX = r.x;
          minY = r.y;
          maxX = r.x + r.width;
          maxY = r.y + r.height;
          first = false;
        } else {
          minX = r.x < boundingBox.x ? r.x : boundingBox.x;
          minY = r.y < boundingBox.y ? r.y : boundingBox.y;
          maxX =
            r.x + r.width > boundingBox.x + boundingBox.width
              ? r.x + r.width
              : boundingBox.x + boundingBox.width;
          maxY =
            r.y + r.height > boundingBox.y + boundingBox.height
              ? r.y + r.height
              : boundingBox.y + boundingBox.height;
        }

        boundingBox.x = minX;
        boundingBox.y = minY;
        boundingBox.width = maxX - minX;
        boundingBox.height = maxY - minY;
      }
    }
    return AffineTransform.applyToRect(
      boundingBox,
      this.getNodeToParentTransform()
    );
  }

  /**
   * when bone  contain the point ,then return it.
   * @param {Number} x
   * @param {Number} y
   * @returns {Bone}
   */
  getBoneAtPoint(x, y) {
    var locChildren = this._children;
    for (var i = locChildren.length - 1; i >= 0; i--) {
      var child = locChildren[i];
      if (
        child instanceof Bone &&
        child.getDisplayManager().containPoint(x, y)
      )
        return child;
    }
    return null;
  }

  /**
   * Sets parent bone of this Armature
   * @param {Bone} parentBone
   */
  setParentBone(parentBone) {
    this._parentBone = parentBone;
    var locBoneDic = this._boneDic;
    for (var key in locBoneDic) {
      locBoneDic[key].setArmature(this);
    }
  }

  /**
   * Return parent bone of Armature.
   * @returns {Bone}
   */
  getParentBone() {
    return this._parentBone;
  }

  /**
   * draw contour
   */
  drawContour() {
    Game.getInstance().drawingUtil.setDrawColor(255, 255, 255, 255);
    Game.getInstance().drawingUtil.setLineWidth(1);
    var locBoneDic = this._boneDic;
    for (var key in locBoneDic) {
      var bone = locBoneDic[key];
      var detector = bone.getColliderDetector();
      if (!detector) continue;
      var bodyList = detector.getColliderBodyList();
      for (var i = 0; i < bodyList.length; i++) {
        var body = bodyList[i];
        var vertexList = body.getCalculatedVertexList();
        Game.getInstance().drawingUtil.drawPoly(vertexList, vertexList.length, true);
      }
    }
  }

  setBody(body) {
    if (this._body === body) return;

    this._body = body;
    this._body.data = this;
    var child,
      displayObject,
      locChildren = this._children;
    for (var i = 0; i < locChildren.length; i++) {
      child = locChildren[i];
      if (child instanceof Bone) {
        var displayList = child.getDisplayManager().getDecorativeDisplayList();
        for (var j = 0; j < displayList.length; j++) {
          displayObject = displayList[j];
          var detector = displayObject.getColliderDetector();
          if (detector) detector.setBody(this._body);
        }
      }
    }
  }

  getShapeList() {
    if (this._body) return this._body.shapeList;
    return null;
  }

  getBody() {
    return this._body;
  }

  /**
   * Sets the blendFunc to Armature
   * @param {BlendFunc|Number} blendFunc
   * @param {Number} [dst]
   */
  setBlendFunc(blendFunc, dst) {
    if (dst === undefined) {
      this._blendFunc.src = blendFunc.src;
      this._blendFunc.dst = blendFunc.dst;
    } else {
      this._blendFunc.src = blendFunc;
      this._blendFunc.dst = dst;
    }
  }

  /**
   * Returns the blendFunc of Armature
   * @returns {BlendFunc}
   */
  getBlendFunc() {
    return new BlendFunc(this._blendFunc.src, this._blendFunc.dst);
  }

  /**
   * set collider filter
   * @param {ColliderFilter} filter
   */
  setColliderFilter(filter) {
    var locBoneDic = this._boneDic;
    for (var key in locBoneDic) locBoneDic[key].setColliderFilter(filter);
  }

  /**
   * Returns the armatureData of Armature
   * @return {ArmatureData}
   */
  getArmatureData() {
    return this.armatureData;
  }

  /**
   * Sets armatureData to this Armature
   * @param {ArmatureData} armatureData
   */
  setArmatureData(armatureData) {
    this.armatureData = armatureData;
  }

  getBatchNode() {
    return this.batchNode;
  }

  setBatchNode(batchNode) {
    this.batchNode = batchNode;
  }

  /**
   * version getter
   * @returns {Number}
   */
  getVersion() {
    return this.version;
  }

  /**
   * version setter
   * @param {Number} version
   */
  setVersion(version) {
    this.version = version;
  }

  _createRenderCmd() {
    if (RendererConfig.getInstance().isCanvas)
      return new this.constructor.CanvasRenderCmd(this);
    else return new this.constructor.WebGLRenderCmd(this);
  }
};

