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

import { LayerColor } from './layer-color';
import { Point } from '../cocoa/geometry/point';
import { Color } from '../platform/types/color';
import Game from '../boot/game';

/**
 * LayerGradient is a subclass of LayerColor that draws gradients across the background.
 */
export class LayerGradient extends LayerColor {
    constructor(start, end, v, stops) {
        super();
        this._endColor = null;
        this._startOpacity = 255;
        this._endOpacity = 255;
        this._alongVector = null;
        this._compressedInterpolation = false;
        this._className = "LayerGradient";
        this._colorStops = [];

        this._endColor = new Color(0, 0, 0, 255);
        this._alongVector = new Point(0, -1);
        this._startOpacity = 255;
        this._endOpacity = 255;

        if (stops && stops instanceof Array) {
            this._colorStops = stops;
            stops.splice(0, 0, {p: 0, color: start || cc.color.BLACK});
            stops.push({p: 1, color: end || cc.color.BLACK});
        } else
            this._colorStops = [{p: 0, color: start || cc.color.BLACK}, {p: 1, color: end || cc.color.BLACK}];

        LayerGradient.prototype.init.call(this, start, end, v, stops);
    }

    init(start, end, v, stops) {
        start = start || new Color(0, 0, 0, 255);
        end = end || new Color(0, 0, 0, 255);
        v = v || new Point(0, -1);
        var _t = this;

        var locEndColor = _t._endColor;
        _t._startOpacity = start.a;

        locEndColor.r = end.r;
        locEndColor.g = end.g;
        locEndColor.b = end.b;
        _t._endOpacity = end.a;

        _t._alongVector = v;
        _t._compressedInterpolation = true;

        super.init(new Color(start.r, start.g, start.b, 255));
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.colorDirty | cc.Node._dirtyFlags.opacityDirty | cc.Node._dirtyFlags.gradientDirty);
        return true;
    }

    setContentSize(size, height) {
        super.setContentSize(size, height);
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.gradientDirty);
    }

    _setWidth(width) {
        super._setWidth(width);
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.gradientDirty);
    }

    _setHeight(height) {
        super._setHeight(height);
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.gradientDirty);
    }

    getStartColor() {
        return new Color(this._realColor);
    }

    setStartColor(color) {
        this.color = color;
        var stops = this._colorStops;
        if (stops && stops.length > 0) {
            var selColor = stops[0].color;
            selColor.r = color.r;
            selColor.g = color.g;
            selColor.b = color.b;
        }
    }

    setEndColor(color) {
        var locColor = this._endColor;
        locColor.r = color.r;
        locColor.g = color.g;
        locColor.b = color.b;
        var stops = this._colorStops;
        if (stops && stops.length > 0) {
            var selColor = stops[stops.length - 1].color;
            selColor.r = color.r;
            selColor.g = color.g;
            selColor.b = color.b;
        }
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.colorDirty);
    }

    getEndColor() {
        return new Color(this._endColor);
    }

    setStartOpacity(o) {
        this._startOpacity = o;
        var stops = this._colorStops;
        if (stops && stops.length > 0)
            stops[0].color.a = o;
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.opacityDirty);
    }

    getStartOpacity() {
        return this._startOpacity;
    }

    setEndOpacity(o) {
        this._endOpacity = o;
        var stops = this._colorStops;
        if (stops && stops.length > 0)
            stops[stops.length - 1].color.a = o;
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.opacityDirty);
    }

    getEndOpacity() {
        return this._endOpacity;
    }

    setVector(Var) {
        this._alongVector.x = Var.x;
        this._alongVector.y = Var.y;
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.gradientDirty);
    }

    getVector() {
        return new Point(this._alongVector.x, this._alongVector.y);
    }

    isCompressedInterpolation() {
        return this._compressedInterpolation;
    }

    setCompressedInterpolation(compress) {
        this._compressedInterpolation = compress;
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.gradientDirty);
    }

    getColorStops() {
        return this._colorStops;
    }

    setColorStops(colorStops) {
        this._colorStops = colorStops;
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.colorDirty | cc.Node._dirtyFlags.opacityDirty | cc.Node._dirtyFlags.gradientDirty);
    }

    get startColor() {
        return this.getStartColor();
    }

    set startColor(value) {
        this.setStartColor(value);
    }

    get endColor() {
        return this.getEndColor();
    }

    set endColor(value) {
        this.setEndColor(value);
    }

    get startOpacity() {
        return this.getStartOpacity();
    }

    set startOpacity(value) {
        this.setStartOpacity(value);
    }

    get endOpacity() {
        return this.getEndOpacity();
    }

    set endOpacity(value) {
        this.setEndOpacity(value);
    }

    get vector() {
        return this.getVector();
    }

    set vector(value) {
        this.setVector(value);
    }

    get colorStops() {
        return this.getColorStops();
    }

    set colorStops(value) {
        this.setColorStops(value);
    }

    _createRenderCmd() {
        if (cc._renderType === Game.RENDER_TYPE_CANVAS)
            return new cc.LayerGradient.CanvasRenderCmd(this);
        else
            return new cc.LayerGradient.WebGLRenderCmd(this);
    }
}
