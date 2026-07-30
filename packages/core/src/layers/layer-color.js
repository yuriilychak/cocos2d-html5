/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
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

import { Layer } from "./layer";
import { Node } from "../base-nodes/node";
import { Color } from "../platform/types/color";
import { LayerColorCanvasRenderer, LayerColorWebGLRenderer } from "./renderer";
import { BlendFunc } from "../platform/types/blend-func";
import { ServiceLocator } from "../service-locator";
import { BYTE } from "../constants";

/**
 * LayerColor is a subclass of Layer that implements the RGBAProtocol protocol.
 */
export class LayerColor extends Layer {
  getBlendFunc() {
    return this._blendFunc;
  }

  constructor(color, width, height) {
    super();
    this._blendFunc = null;

    this._blendFunc = BlendFunc.ALPHA_NON_PREMULTIPLIED;
    LayerColor.prototype.init.call(this, color, width, height);
  }

  init(color, width, height) {
    var winSize = ServiceLocator.eglView.winSizeInPoints;
    color = color || new Color(0, 0, 0, BYTE);
    width = width === undefined ? winSize.width : width;
    height = height === undefined ? winSize.height : height;

    this.color.color = color;
    this.color.opacity = color.a;
    this.renderCmd.setDirtyFlag(
      Node._dirtyFlags.colorDirty | Node._dirtyFlags.opacityDirty
    );

    this.width = width;
    this.height = height;
    return true;
  }

  visit(parent, renderer = ServiceLocator.sys.rendererConfig.renderer) {
    var cmd = this.renderCmd,
      parentCmd = parent ? parent.renderCmd : null;

    if (!this.visible) {
      cmd._propagateFlagsDown(parentCmd);
      return;
    }

    cmd.visit(parentCmd, renderer);

    if (cmd._isBaked) {
      renderer.pushRenderCommand(cmd._bakeRenderCmd);
      cmd._bakeSprite.renderCmd.setDirtyFlag(Node._dirtyFlags.transformDirty);
      cmd._bakeSprite.visit(this, renderer);
    } else {
      var i,
        child,
        children = this.children,
        len = children.length;
      if (len > 0) {
        if (this.order.reorderChildDirty) {
          this.order.sortAllChildren();
        }
        for (i = 0; i < len; i++) {
          child = children[i];
          if (child.order.localZOrder < 0) {
            child.visit(this, renderer);
          } else {
            break;
          }
        }

        renderer.pushRenderCommand(cmd);
        for (; i < len; i++) {
          children[i].visit(this, renderer);
        }
      } else {
        renderer.pushRenderCommand(cmd);
      }
    }

    cmd._dirtyFlag = 0;
  }

  setBlendFunc(src, dst) {
    var locBlendFunc = this._blendFunc;
    if (dst === undefined) {
      locBlendFunc.src = src.src;
      locBlendFunc.dst = src.dst;
    } else {
      locBlendFunc.src = src;
      locBlendFunc.dst = dst;
    }
    this.renderCmd.updateBlendFunc(locBlendFunc);
  }

  createRenderCmd() {
    if (ServiceLocator.sys.rendererConfig.isCanvas)
      return new LayerColorCanvasRenderer(this);
    else return new LayerColorWebGLRenderer(this);
  }
}
