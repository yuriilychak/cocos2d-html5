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
  BlendFunc,
  GLProgramState,
  Node,
  Point,
  ServiceLocator,
  ShaderName
} from "@aspect/core";

import { Skin } from "./display/skin.js";
import { DISPLAY_TYPE_ARMATURE, DISPLAY_TYPE_SPRITE } from "./utils/datas/constants.js";
    export class ArmatureWebGLRenderCmd extends Node.WebGLRenderCmd {
        constructor(renderableObject) {
            super(renderableObject);
            this._needDraw = true;

            this._parentCmd = null;
            this._realAnchorPointInPoints = new Point(0, 0);

            this._transform = {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0};
            this._worldTransform = {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0};
        }

        _updateAnchorPointInPoint() {
            var node = this._node;
            var contentSize = node._contentSize, anchorPoint = node._anchorPoint, offsetPoint = node._offsetPoint;
            this._anchorPointInPoints.x = contentSize.width * anchorPoint.x - offsetPoint.x;
            this._anchorPointInPoints.y = contentSize.height * anchorPoint.y - offsetPoint.y;

            this._realAnchorPointInPoints.x = contentSize.width * anchorPoint.x;
            this._realAnchorPointInPoints.y = contentSize.height * anchorPoint.y;
            this.setDirtyFlag(Node._dirtyFlags.transformDirty);
        }

        getAnchorPointInPoints() {
            return new Point(this._realAnchorPointInPoints);
        }

        uploadData(f32buffer, ui32buffer, vertexDataOffset) {
            var node = this._node, cmd;
            var parentCmd = this._parentCmd || this;

            var locChildren = node._children;
            var alphaPremultiplied = BlendFunc.ALPHA_PREMULTIPLIED, alphaNonPremultipled = BlendFunc.ALPHA_NON_PREMULTIPLIED;
            for (var i = 0, len = locChildren.length; i < len; i++) {
                var selBone = locChildren[i];
                var boneCmd = selBone._renderCmd;
                if (selBone && selBone.getDisplayRenderNode) {
                    var selNode = selBone.getDisplayRenderNode();
                    if (null === selNode)
                        continue;
                    cmd = selNode._renderCmd;
                    switch (selBone.getDisplayRenderNodeType()) {
                        case DISPLAY_TYPE_SPRITE:
                            if (selNode instanceof Skin) {
                                selNode.setShaderProgram(this._shaderProgram);
                                this._updateColorAndOpacity(cmd, selBone);
                                cmd.transform(parentCmd);

                                var func = selBone.getBlendFunc();
                                if (func.src !== alphaPremultiplied.src || func.dst !== alphaPremultiplied.dst)
                                    selNode.setBlendFunc(selBone.getBlendFunc());
                                else {
                                    var tex = selNode.getTexture();
                                    if (node._blendFunc.src === alphaPremultiplied.src &&
                                        node._blendFunc.dst === alphaPremultiplied.dst &&
                                        tex && !tex.hasPremultipliedAlpha()) {
                                        selNode.setBlendFunc(alphaNonPremultipled);
                                    }
                                    else {
                                        selNode.setBlendFunc(node._blendFunc);
                                    }
                                }
                                ServiceLocator.rendererConfig.renderer._uploadBufferData(cmd);
                            }
                            break;
                        case DISPLAY_TYPE_ARMATURE:
                            selNode.setShaderProgram(this._shaderProgram);
                            this._updateColorAndOpacity(cmd, selBone);
                            cmd._parentCmd = this;
                        // Continue rendering in default
                        default:
                            boneCmd._syncStatus(parentCmd);
                            cmd._syncStatus(boneCmd);
                            if (cmd.uploadData) {
                                ServiceLocator.rendererConfig.renderer._uploadBufferData(cmd);
                            }
                            else if (cmd.rendering) {
                                ServiceLocator.rendererConfig.renderer._batchRendering();
                                cmd.rendering(ServiceLocator.rendererConfig.renderContext);
                            }
                            break;
                    }
                } else if (selBone instanceof Node) {
                    selBone.setShaderProgram(this._shaderProgram);
                    boneCmd._syncStatus(parentCmd);
                    if (boneCmd.uploadData) {
                        ServiceLocator.rendererConfig.renderer._uploadBufferData(boneCmd);
                    }
                    else if (boneCmd.rendering) {
                        ServiceLocator.rendererConfig.renderer._batchRendering();
                        boneCmd.rendering(ServiceLocator.rendererConfig.renderContext);
                    }
                }
            }
            this._parentCmd = null;
            return 0;
        }

        initShaderCache() {
            this._shaderProgram = ServiceLocator.shaderCache.programForKey(ShaderName.SPRITE_POSITION_TEXTURECOLOR);
        }

        setShaderProgram(shaderProgram) {
            this._glProgramState = GLProgramState.getOrCreateWithGLProgram(shaderProgram);
        }

        _updateColorAndOpacity(skinRenderCmd, bone) {
            var parentColor = bone._renderCmd._displayedColor, parentOpacity = bone._renderCmd._displayedOpacity;

            var flags = Node._dirtyFlags, locFlag = skinRenderCmd._dirtyFlag;
            var colorDirty = locFlag & flags.colorDirty,
                opacityDirty = locFlag & flags.opacityDirty;
            if (colorDirty)
                skinRenderCmd._updateDisplayColor(parentColor);
            if (opacityDirty)
                skinRenderCmd._updateDisplayOpacity(parentOpacity);
            if (colorDirty || opacityDirty)
                skinRenderCmd._updateColor();
        }

        visit(parentCmd) {
            var node = this._node;
            if (!node._visible)
                return;

            parentCmd = parentCmd || this.getParentRenderCmd();
            if (parentCmd)
                this._curLevel = parentCmd._curLevel + 1;

            this._syncStatus(parentCmd);

            node.sortAllChildren();
            var renderer = ServiceLocator.rendererConfig.renderer,
                children = node._children, child,
                i, len = children.length;

            if (isNaN(node._customZ)) {
                node._vertexZ = renderer.assignedZ;
                renderer.assignedZ += renderer.assignedZStep;
            }

            for (i = 0; i < len; i++) {
                child = children[i];
                if (child._localZOrder < 0) {
                    if (isNaN(child._customZ)) {
                        child._vertexZ = renderer.assignedZ;
                        renderer.assignedZ += renderer.assignedZStep;
                    }
                }
                else {
                    break;
                }
            }

            renderer.pushRenderCommand(this);
            for (; i < len; i++) {
                child = children[i];
                if (isNaN(child._customZ)) {
                    child._vertexZ = renderer.assignedZ;
                    renderer.assignedZ += renderer.assignedZStep;
                }
            }

            this._dirtyFlag = 0;
        }
    };