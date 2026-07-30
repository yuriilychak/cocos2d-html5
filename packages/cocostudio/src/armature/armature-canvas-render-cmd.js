/****************************************************************************
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

import {
  AffineTransform,
  BlendFunc,
  CustomRenderCmd,
  Node,
  Point,
  ServiceLocator
} from "@aspect/core";

import {
  DISPLAY_TYPE_ARMATURE,
  DISPLAY_TYPE_SPRITE
} from "./utils/datas/constants.js";
export class ArmatureCanvasRenderCmd extends Node.CanvasRenderCmd {
  constructor(renderableObject) {
    super(renderableObject);
    this._needDraw = true;

    this._realAnchorPointInPoints = new Point();
    this._canUseDirtyRegion = true;
    this._startRenderCmd = new CustomRenderCmd(this, this._startCmdCallback);
    this._RestoreRenderCmd = new CustomRenderCmd(
      this,
      this._RestoreCmdCallback
    );
    this._startRenderCmd._canUseDirtyRegion = true;
    this._RestoreRenderCmd._canUseDirtyRegion = true;

    this._transform = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
    this._worldTransform = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
  }

  _updateAnchorPointInPoint() {
    const size = this._node.contentSize.toPoint();
    const anchor = this._node.anchor;
    const offset = this._node._offsetPoint;

    this._anchorPointInPoints.set(Point.subIn(Point.compMult(size, anchor), offset));
    this._realAnchorPointInPoints.set(Point.compMult(size, anchor));
    this.setDirtyFlag(Node._dirtyFlags.transformDirty);
  }

  get anchorPointInPoints() {
    return this._realAnchorPointInPoints.clone();
  }

  _startCmdCallback(ctx, scaleX, scaleY) {
    var node = this._node,
      parent = node.parent;
    this.transform(parent ? parent.renderCmd : null);

    var wrapper = ctx || ServiceLocator.sys.rendererConfig.renderContext;
    wrapper.save();
    wrapper.switchToArmatureMode(true, this._worldTransform, { x: scaleX, y: scaleY });
  }

  transform(parentCmd, recursive) {
    this.originTransform(parentCmd, recursive);

    var locChildren = this._node.children;
    for (var i = 0, len = locChildren.length; i < len; i++) {
      var selBone = locChildren[i];
      var boneCmd = selBone.renderCmd;
      if (selBone && selBone.getDisplayRenderNode) {
        var boneType = selBone.getDisplayRenderNodeType();
        var selNode = selBone.getDisplayRenderNode();
        if (selNode && selNode.renderCmd) {
          var cmd = selNode.renderCmd;
          cmd.transform(null);
          if (
            boneType !== DISPLAY_TYPE_ARMATURE &&
            boneType !== DISPLAY_TYPE_SPRITE
          ) {
            AffineTransform.concatIn(
              cmd._worldTransform,
              selBone._worldTransform
            );
          }

          var flags = Node._dirtyFlags,
            locFlag = cmd._dirtyFlag,
            boneFlag = boneCmd._dirtyFlag;
          var colorDirty = boneFlag & flags.colorDirty,
            opacityDirty = boneFlag & flags.opacityDirty;
          if (colorDirty) boneCmd._updateDisplayColor(this._displayedColor);
          if (opacityDirty)
            boneCmd._updateDisplayOpacity(this._displayedOpacity);
          if (colorDirty || opacityDirty) boneCmd._updateColor();

          var parentColor = selBone.renderCmd._displayedColor,
            parentOpacity = selBone.renderCmd._displayedOpacity;
          colorDirty = locFlag & flags.colorDirty;
          opacityDirty = locFlag & flags.opacityDirty;
          if (colorDirty) cmd._updateDisplayColor(parentColor);
          if (opacityDirty) cmd._updateDisplayOpacity(parentOpacity);
          if (colorDirty || opacityDirty) {
            cmd._updateColor();
          }
        }
      }
    }
  }

  _RestoreCmdCallback(wrapper) {
    this._cacheDirty = false;
    wrapper.switchToArmatureMode(false);
    wrapper.restore();
  }

  initShaderCache() {}

  setShaderProgram() {}

  updateChildPosition(dis, bone) {
    dis.visit();
  }

  rendering(ctx, scaleX, scaleY) {
    var node = this._node;
    var locChildren = node.children;
    var alphaPremultiplied = BlendFunc.ALPHA_PREMULTIPLIED,
      alphaNonPremultipled = BlendFunc.ALPHA_NON_PREMULTIPLIED;
    for (var i = 0, len = locChildren.length; i < len; i++) {
      var selBone = locChildren[i];
      if (selBone && selBone.getDisplayRenderNode) {
        var selNode = selBone.getDisplayRenderNode();
        if (null === selNode) continue;

        selBone.renderCmd._syncStatus(this);
        switch (selBone.getDisplayRenderNodeType()) {
          case DISPLAY_TYPE_SPRITE:
            selNode.visit(selBone);
            break;
          case DISPLAY_TYPE_ARMATURE:
            selNode.renderCmd.rendering(ctx, scaleX, scaleY);
            break;
          default:
            selNode.visit(selBone);
            break;
        }
      } else if (selBone instanceof Node) {
        this._visitNormalChild(selBone);
      }
    }
  }

  _visitNormalChild(childNode) {
    if (!childNode) return;

    var cmd = childNode.renderCmd;
    if (!childNode.visible) return;
    cmd._curLevel = this._curLevel + 1;

    var i,
      children = childNode.children,
      child;
    cmd._syncStatus(this);
    cmd.transform(null);

    var len = children.length;
    if (len > 0) {
      childNode.order.sortAllChildren();
      for (i = 0; i < len; i++) {
        child = children[i];
        if (child.order.localZOrder < 0) child.visit(childNode);
        else break;
      }
      ServiceLocator.sys.rendererConfig.renderer.pushRenderCommand(cmd);
      for (; i < len; i++) children[i].visit(childNode);
    } else {
      ServiceLocator.sys.rendererConfig.renderer.pushRenderCommand(cmd);
    }
    this._dirtyFlag = 0;
  }

  visit(parentCmd) {
    var node = this._node;
    if (!node.visible) return;

    this._syncStatus(parentCmd);
    node.order.sortAllChildren();

    ServiceLocator.sys.rendererConfig.renderer.pushRenderCommand(
      this._startRenderCmd
    );
    this.rendering();
    ServiceLocator.sys.rendererConfig.renderer.pushRenderCommand(
      this._RestoreRenderCmd
    );

    this._cacheDirty = false;
  }
}
