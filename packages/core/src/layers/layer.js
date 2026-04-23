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

import { Node } from "../base-nodes/node";
import Game from "../boot/game";
import { RendererConfig } from "../renderer/renderer-config";
import { LayerCanvasRenderer, LayerWebGLRenderer } from "./renderer";

/**
 * Layer is a subclass of Node that implements the TouchEventsDelegate protocol.
 * All features from Node are valid, plus the bake feature.
 */
export class Layer extends Node {
  constructor() {
    super();
    this._className = "Layer";

    this._ignoreAnchorPointForPosition = true;
    this.setAnchorPoint(0.5, 0.5);
    this.setContentSize(cc.winSize);
    this._cascadeColorEnabled = false;
    this._cascadeOpacityEnabled = false;
  }

  bake() {
    this._renderCmd.bake();
  }

  unbake() {
    this._renderCmd.unbake();
  }

  isBaked() {
    return this._renderCmd._isBaked;
  }

  visit(parent) {
    var cmd = this._renderCmd,
      parentCmd = parent ? parent._renderCmd : null;

    if (!this._visible) {
      cmd._propagateFlagsDown(parentCmd);
      return;
    }

    var renderer = RendererConfig.getInstance().renderer;
    cmd.visit(parentCmd);

    if (cmd._isBaked) {
      renderer.pushRenderCommand(cmd);
      cmd._bakeSprite.visit(this);
    } else {
      var i,
        children = this._children,
        len = children.length,
        child;
      if (len > 0) {
        if (this._reorderChildDirty) {
          this.sortAllChildren();
        }
        for (i = 0; i < len; i++) {
          child = children[i];
          if (child._localZOrder < 0) {
            child.visit(this);
          } else {
            break;
          }
        }

        renderer.pushRenderCommand(cmd);
        for (; i < len; i++) {
          children[i].visit(this);
        }
      } else {
        renderer.pushRenderCommand(cmd);
      }
    }
    cmd._dirtyFlag = 0;
  }

  addChild(child, localZOrder, tag) {
    super.addChild(child, localZOrder, tag);
    this._renderCmd._bakeForAddChild(child);
  }

  _createRenderCmd() {
    if (RendererConfig.getInstance().isCanvas)
      return new LayerCanvasRenderer(this);
    else return new LayerWebGLRenderer(this);
  }
}
