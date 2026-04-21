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

import { Layer } from './layer';
import { Color } from '../platform/types/color';
import Game from '../boot/game';
import { LayerColorCanvasRenderer, LayerColorWebGLRenderer } from './renderer';

/**
 * CCLayerColor is a subclass of CCLayer that implements the CCRGBAProtocol protocol.
 * @class
 * @extends Layer
 */
export class LayerColor extends Layer {
    getBlendFunc() {
        return this._blendFunc;
    }

    setOpacityModifyRGB(value) {
    }

    isOpacityModifyRGB() {
        return false;
    }

    constructor(color, width, height) {
        super();
        this._blendFunc = null;
        this._className = "LayerColor";

        this._blendFunc = cc.BlendFunc.ALPHA_NON_PREMULTIPLIED;
        LayerColor.prototype.init.call(this, color, width, height);
    }

    init(color, width, height) {
        var winSize = cc.director.getWinSize();
        color = color || new Color(0, 0, 0, 255);
        width = width === undefined ? winSize.width : width;
        height = height === undefined ? winSize.height : height;

        var locRealColor = this._realColor;
        locRealColor.r = color.r;
        locRealColor.g = color.g;
        locRealColor.b = color.b;
        this._realOpacity = color.a;
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.colorDirty | cc.Node._dirtyFlags.opacityDirty);

        LayerColor.prototype.setContentSize.call(this, width, height);
        return true;
    }

    visit(parent) {
        var cmd = this._renderCmd, parentCmd = parent ? parent._renderCmd : null;

        if (!this._visible) {
            cmd._propagateFlagsDown(parentCmd);
            return;
        }

        var renderer = cc.renderer;
        cmd.visit(parentCmd);

        if (cmd._isBaked) {
            renderer.pushRenderCommand(cmd._bakeRenderCmd);
            cmd._bakeSprite._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
            cmd._bakeSprite.visit(this);
        }
        else {
            var i, child, children = this._children, len = children.length;
            if (len > 0) {
                if (this._reorderChildDirty) {
                    this.sortAllChildren();
                }
                for (i = 0; i < len; i++) {
                    child = children[i];
                    if (child._localZOrder < 0) {
                        child.visit(this);
                    }
                    else {
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

    setBlendFunc(src, dst) {
        var locBlendFunc = this._blendFunc;
        if (dst === undefined) {
            locBlendFunc.src = src.src;
            locBlendFunc.dst = src.dst;
        } else {
            locBlendFunc.src = src;
            locBlendFunc.dst = dst;
        }
        this._renderCmd.updateBlendFunc(locBlendFunc);
    }

    get width() {
        return this._getWidth();
    }

    set width(value) {
        this._setWidth(value);
    }

    get height() {
        return this._getHeight();
    }

    set height(value) {
        this._setHeight(value);
    }

    _createRenderCmd() {
        if (cc._renderType === Game.RENDER_TYPE_CANVAS)
            return new LayerColorCanvasRenderer(this);
        else
            return new LayerColorWebGLRenderer(this);
    }
}
