/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.

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

//9980397

/**
 * BoneNode
 * base class
 */

// Node imported from @aspect/core

import {
  AffineTransform,
  BlendFunc,
  Color,
  Node,
  Point,
  Rect,
  Size,
  arrayRemoveObject,
  assert,
  log,
  ServiceLocator
} from "@aspect/core";
import { DrawNode } from "@aspect/shape-nodes";
import { BoneNodeOrder } from "./bone-node-order.js";

let _SkeletonNode = null;
export function _setSkeletonNodeClass(SN) {
  _SkeletonNode = SN;
}
var _BlendFunc = BlendFunc;
var type = {
  p: new Point(),
  size: new Size(),
  rect: new Rect()
};
var debug = {
  log: log,
  assert: assert
};

class BoneNode extends Node {
  constructor(length) {
    super();
    this._customCommand = null;
    this._blendFunc = null;
    this._rackColor = null;
    this._rackLength = null;
    this._rackWidth = null;
    this._childBones = null;
    this._boneSkins = null;
    this._rootSkeleton = null;
    this._squareVertices = null;
    this._squareColors = null;
    this._noMVPVertices = null;
    // null
    // length
    // _isRackShow -> renderCmd._debug
    if (this._squareVertices === null)
      this._squareVertices = [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ];

    this._rackColor = Color.WHITE;
    this._blendFunc = _BlendFunc.ALPHA_NON_PREMULTIPLIED;

    this._childBones = [];
    this._boneSkins = [];

    this._rackLength = length === undefined ? 50 : length;
    this._rackWidth = 20;
    this._updateVertices();
    //this._updateColor();
  }

  visit(parent) {
    this._visit && this._visit(parent && parent.renderCmd);
  }

  addSkin(skin, display, hideOthers /*false*/) {
    // skin, display
    // skin, display, hideOthers
    var boneSkins = this._boneSkins;
    debug.assert(skin != null, "Argument must be non-nil");
    if (hideOthers) {
      for (var i = 0; i < boneSkins.length; i++) {
        boneSkins[i].visible = false;
      }
    }
    super.addChild(skin);
    this._boneSkins.push(skin);
    skin.visible = display;
  }

  getChildBones() {
    return this._childBones;
  }

  getSkins() {
    return this._boneSkins;
  }

  displaySkin(skin, hideOthers) {
    var boneSkins = this._boneSkins;
    var boneSkin, i;
    if (typeof skin === "string") {
      for (i = 0; i < boneSkins.length; i++) {
        boneSkin = boneSkins[i];
        if (skin == boneSkin.name) {
          boneSkin.visible = true;
        } else if (hideOthers) {
          boneSkin.visible = false;
        }
      }
    } else {
      for (i = 0; i < boneSkins.length; i++) {
        boneSkin = boneSkins[i];
        if (boneSkin == skin) {
          boneSkin.visible = true;
        } else if (hideOthers) {
          boneSkin.visible = false;
        }
      }
    }
  }

  getVisibleSkins() {
    var displayingSkins = [];
    var boneSkins = this._boneSkins;
    for (var boneSkin, i = 0; i < boneSkins.length; i++) {
      boneSkin = boneSkins[i];
      if (boneSkin.visible) {
        displayingSkins.push(boneSkin);
      }
    }
    return displayingSkins;
  }

  getRootSkeletonNode() {
    return this._rootSkeleton;
  }

  getAllSubBones() {
    var allBones = [];
    var boneStack = []; // for avoid recursive
    var childBones = this._childBones;
    for (var i = 0; i < childBones.length; i++) {
      boneStack.push(childBones[i]);
    }

    while (boneStack.length > 0) {
      var top = boneStack.pop();
      allBones.push(top);
      var topChildren = top.getChildBones();
      for (var j = 0; j < topChildren; j++) {
        boneStack.push(topChildren[j]);
      }
    }
    return allBones;
  }

  getAllSubSkins() {
    var allBones = this.getAllSubBones();
    var allSkins = [];
    for (var i = 0; i < allBones.length; i++) {
      var skins = allBones[i].getSkins();
      for (var j = 0; j < skins.length; j++) {
        allSkins.push(skins[i]);
      }
    }
    return allSkins;
  }

  addChild(child, localZOrder, tag) {
    //child, localZOrder, tag
    //child, localZOrder, name
    super.addChild(child, localZOrder, tag);
    this._addToChildrenListHelper(child);
  }

  removeChild(child, cleanup) {
    if (this.children.indexOf(child) !== -1) {
      super.removeChild(child, cleanup);
      this._removeFromChildrenListHelper(child);
    }
  }

  setBlendFunc(blendFunc) {
    var ob = this._blendFunc;
    if (blendFunc && ob.src !== blendFunc.src && ob.dst !== blendFunc.dst) {
      this._blendFunc = blendFunc;
      var boneSkins = this._boneSkins;
      for (var boneSkin, i = 0; i < boneSkins.length; i++) {
        boneSkin = boneSkins[i];
        boneSkin.setBlendFunc(blendFunc);
      }
    }
  }

  getBlendFunc() {
    return this._blendFunc;
  }

  setDebugDrawLength(length) {
    this._rackLength = length;
    this._updateVertices();
  }

  getDebugDrawLength() {
    return this._rackLength;
  }

  setDebugDrawWidth(width) {
    this._rackWidth = width;
    this._updateVertices();
  }

  getDebugDrawWidth() {
    return this._rackWidth;
  }

  setDebugDrawEnabled(isDebugDraw) {
    var renderCmd = this.renderCmd;
    if (renderCmd._debug === isDebugDraw) return;

    renderCmd._debug = isDebugDraw;
    ServiceLocator.sys.rendererConfig.renderer.childrenOrderDirty = true;

    if (this.visible && null != this._rootSkeleton) {
      this._rootSkeleton._subBonesDirty = true;
      this._rootSkeleton._subBonesOrderDirty = true;
    }
  }

  isDebugDrawEnabled() {
    return this.renderCmd._debug;
  }

  setDebugDrawColor(color) {
    this._rackColor = color;
  }

  getDebugDrawColor() {
    return this._rackColor;
  }

  getVisibleSkinsRect() {
    var minx,
      miny,
      maxx,
      maxy = 0;
    minx = miny = maxx = maxy;
    var first = true;

    var displayRect = type.rect(0, 0, 0, 0);
    if (
      this.renderCmd._debug &&
      this._rootSkeleton != null &&
      this._rootSkeleton.renderCmd._debug
    ) {
      maxx = this._rackWidth;
      maxy = this._rackLength;
      first = false;
    }

    var boneSkins = this._boneSkins;
    for (var skin, i = 0; i < boneSkins.length; i++) {
      skin = boneSkins[i];
      var r = skin.boundingBox;
      if (
        !skin.visible ||
        (r.x === 0 && r.y === 0 && r.width === 0 && r.height === 0)
      )
        continue;

      if (first) {
        minx = Rect.getMinX(r);
        miny = Rect.getMinY(r);
        maxx = Rect.getMaxX(r);
        maxy = Rect.getMaxY(r);

        first = false;
      } else {
        minx = Math.min(Rect.getMinX(r), minx);
        miny = Math.min(Rect.getMinY(r), miny);
        maxx = Math.max(Rect.getMaxX(r), maxx);
        maxy = Math.max(Rect.getMaxY(r), maxy);
      }
      displayRect.setRect(minx, miny, maxx - minx, maxy - miny);
    }
    return displayRect;
  }

  get boundingBox() {
    var boundingBox = this.getVisibleSkinsRect();
    return AffineTransform.applyToRect(
      boundingBox,
      this.nodeToParentTransform
    );
  }

  batchBoneDrawToSkeleton(bone) {}

  set name(name) {
    var rootSkeleton = this._rootSkeleton;
    var oldName = this.name;
    super.name = name;
    if (rootSkeleton != null) {
      var oIter = rootSkeleton._subBonesMap[oldName];
      var nIter = rootSkeleton._subBonesMap[name];
      if (oIter && !nIter) {
        delete rootSkeleton._subBonesMap[oIter];
        rootSkeleton._subBonesMap[name] = oIter;
      }
    }
  }

  get contentSize() {
    return super.contentSize;
  }

  set contentSize(contentSize) {
    super.contentSize = contentSize;
    this._updateVertices();
  }

  get anchorX() {
    return super.anchorX;
  }

  set anchorX(value) {
    if (value === super.anchorX) {
      return;
    }

    super.anchorX = value;
    this._updateVertices();
  }

  get anchorY() {
    return super.anchorY;
  }

  set anchorY(value) {
    if (value === super.anchorY) {
      return;
    }

    super.anchorY = value;
    this._updateVertices();
  }

  get anchor() {
    return super.anchor;
  }

  set anchor(value) {
    if(Point.equalTo(value, super.anchor)) {
      return;
    }
    
    super.anchor = value;
    this._updateVertices();
  }

  get visible() {
    return super.visible;
  }

  set visible(visible) {
    if (this.visible == visible) return;
    super.visible = visible;
    if (this._rootSkeleton != null) {
      this._rootSkeleton._subBonesDirty = true;
      this._rootSkeleton._subBonesOrderDirty = true;
    }
  }

  _addToChildrenListHelper(child) {
    if (child instanceof BoneNode) {
      this._addToBoneList(child);
    } else {
      //if (child instanceof SkinNode) {
      this._addToSkinList(child);
      //}
    }
  }

  _removeFromChildrenListHelper(child) {
    if (child instanceof BoneNode) {
      this._removeFromBoneList(child);
    } else {
      if (child instanceof SkinNode) this._removeFromSkinList(skin);
    }
  }

  _removeFromBoneList(bone) {
    if (
      this._rootSkeleton != null &&
      bone instanceof _SkeletonNode &&
      bone._rootSkeleton === this._rootSkeleton
    ) {
      bone._rootSkeleton = null;
      var subBones = bone.getAllSubBones();
      subBones.push(bone);
      for (var subBone, i = 0; i < subBones.length; i++) {
        subBone = subBones[i];
        subBone._rootSkeleton = null;
        delete this._rootSkeleton._subBonesMap[subBone.name];
        this._rootSkeleton._subBonesDirty = true;
        this._rootSkeleton._subBonesOrderDirty = true;
      }
    } else {
      this._rootSkeleton._subBonesDirty = true;
      this._rootSkeleton._subBonesOrderDirty = true;
    }
    arrayRemoveObject(this._childBones, bone);
  }

  _setRootSkeleton(rootSkeleton) {
    this._rootSkeleton = rootSkeleton;
    var subBones = this.getAllSubBones();
    for (var i = 0; i < subBones.length; i++) {
      this._addToBoneList(subBones[i]);
    }
  }

  _addToBoneList(bone) {
    if (this._childBones.indexOf(bone) === -1) this._childBones.push(bone);
    if (this._rootSkeleton != null) {
      var skeletonNode = bone;
      if (!(skeletonNode instanceof SkinNode) && !bone._rootSkeleton) {
        // not nest skeleton
        var subBones = bone.getAllSubBones();
        subBones.push(bone);
        for (var subBone, i = 0; i < subBones.length; i++) {
          subBone = subBones[i];
          subBone._setRootSkeleton(this._rootSkeleton);
          var bonename = subBone.name;
          if (!this._rootSkeleton._subBonesMap[bonename]) {
            this._rootSkeleton._subBonesMap[subBone.name] = subBone;
            this._rootSkeleton._subBonesDirty = true;
            this._rootSkeleton._subBonesOrderDirty = true;
          } else {
            log(
              "already has a bone named %s in skeleton %s",
              bonename,
              this._rootSkeleton.name
            );
            this._rootSkeleton._subBonesDirty = true;
            this._rootSkeleton._subBonesOrderDirty = true;
          }
        }
      }
    }
  }

  _visitSkins() {
    var cmd = this.renderCmd;
    // quick return if not visible
    if (!this.visible) return;

    var parentCmd = cmd.getParentRenderCmd();
    if (parentCmd) cmd._curLevel = parentCmd._curLevel + 1;

    //visit for canvas
    var i,
      children = this._boneSkins,
      child;
    //var i, children = this.children, child;
    cmd._syncStatus(parentCmd);
    var len = children.length;
    if (len > 0) {
      this.order.sortAllChildren();
      // draw children zOrder < 0
      for (i = 0; i < len; i++) {
        child = children[i];
        if (child.order.localZOrder < 0) child.visit(this);
        else break;
      }
      for (; i < len; i++) children[i].visit(this);
    }
    cmd._dirtyFlag = 0;
  }

  _addToSkinList(skin) {
    this._boneSkins.push(skin);
    if (skin.getBlendFunc) {
      var blendFunc = skin.getBlendFunc();
      if (
        this._blendFunc.src !== blendFunc.src &&
        this._blendFunc.dst !== blendFunc.dst
      )
        skin.setBlendFunc(this._blendFunc);
    }
  }

  _removeFromSkinList(skin) {
    arrayRemoveObject(this._boneSkins, skin);
  }

  _updateVertices() {
    var squareVertices = this._squareVertices,
      anchorPointInPoints = this.renderCmd._anchorPointInPoints;
    if (
      this._rackLength != squareVertices[2].x - anchorPointInPoints.x ||
      squareVertices[3].y != this._rackWidth / 2 - anchorPointInPoints.y
    ) {
      squareVertices[1].x = squareVertices[1].y = squareVertices[3].y = 0;
      squareVertices[0].x = squareVertices[2].x = this._rackLength * 0.1;
      squareVertices[2].y = this._rackWidth * 0.5;
      squareVertices[0].y = -squareVertices[2].y;
      squareVertices[3].x = this._rackLength;

      for (var i = 0; i < squareVertices.length; i++) {
        squareVertices[i].x += anchorPointInPoints.x;
        squareVertices[i].y += anchorPointInPoints.y;
      }

      this.renderCmd.updateDebugPoint(squareVertices);
    }
  }

  createRenderCmd() {
    if (ServiceLocator.sys.rendererConfig.isCanvas)
      return new BoneNodeCanvasCmd(this);
    else return new BoneNodeWebGLCmd(this);
  }

  createOrder() {
    return new BoneNodeOrder();
  }
}

class BoneNodeCanvasCmd extends Node.CanvasRenderCmd {
  constructor(node) {
    super(node);
    this._debug = false;
    this._color = Color.WHITE;
    this._drawNode = new DrawNode();
  }

  updateDebugPoint(points) {
    this._drawNode.clear();
    this._drawNode.drawPoly(points, this._color, 0, this._color);
  }

  transform(parentCmd, recursive) {
    var rootSkeleton = this._node._rootSkeleton;
    this.originTransform(parentCmd, recursive);
    if (rootSkeleton && rootSkeleton.renderCmd._debug) {
      this._drawNode.renderCmd.transform(this);
    }
  }
}

class BoneNodeWebGLCmd extends Node.WebGLRenderCmd {
  constructor(node) {
    super(node);
    this._debug = false;
    this._color = Color.WHITE;
    this._drawNode = new DrawNode();
  }

  updateDebugPoint(points) {
    this._drawNode.clear();
    this._drawNode.drawPoly(points, this._color, 0, this._color);
  }

  transform(parentCmd, recursive) {
    var rootSkeleton = this._node._rootSkeleton;
    this.originTransform(parentCmd, recursive);
    if (rootSkeleton && rootSkeleton.renderCmd._debug) {
      this._drawNode.renderCmd.transform(this);
    }
  }
}
export { BoneNode };
