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

import { Scene } from './scene';
import { Point } from '../cocoa/geometry/point';
import { Color } from '../platform/types/color';
import EventManager from '../event-manager/event-manager';
import Loader from '../boot/loader';

/**
 * cc.LoaderScene is a scene that you can load it when you loading files
 * @class
 * @extends cc.Scene
 * @example
 * var lc = new cc.LoaderScene();
 */
export class LoaderScene extends Scene {
    constructor() {
        super();
        this._interval = null;
        this._label = null;
        this._logo = null;
        this._className = "LoaderScene";
        this.cb = null;
        this.target = null;
    }

    init() {
        var self = this;

        var logoWidth = 160;
        var logoHeight = 200;

        var bgLayer = self._bgLayer = new cc.LayerColor(new Color(32, 32, 32, 255));
        self.addChild(bgLayer, 0);

        var fontSize = 24, lblHeight = -logoHeight / 2 + 100;
        if (cc._loaderImage) {
            Loader.getInstance().loadImg(cc._loaderImage, { isCrossOrigin: false }, function (err, img) {
                logoWidth = img.width;
                logoHeight = img.height;
                self._initStage(img, cc.visibleRect.center);
            });
            fontSize = 14;
            lblHeight = -logoHeight / 2 - 10;
        }
        var label = self._label = new cc.LabelTTF("Loading... 0%", "Arial", fontSize);
        label.setPosition(cc.pAdd(cc.visibleRect.center, new Point(0, lblHeight)));
        label.setColor(new Color(180, 180, 180));
        bgLayer.addChild(this._label, 10);
        return true;
    }

    _initStage(img, centerPos) {
        var self = this;
        var texture2d = self._texture2d = new cc.Texture2D();
        texture2d.initWithElement(img);
        texture2d.handleLoadedTexture();
        var logo = self._logo = new cc.Sprite(texture2d);
        logo.setScale(cc.contentScaleFactor());
        logo.x = centerPos.x;
        logo.y = centerPos.y;
        self._bgLayer.addChild(logo, 10);
    }

    onEnter() {
        var self = this;
        cc.Node.prototype.onEnter.call(self);
        self.schedule(self._startLoading, 0.3);
    }

    onExit() {
        cc.Node.prototype.onExit.call(this);
        var tmpStr = "Loading... 0%";
        this._label.setString(tmpStr);
    }

    initWithResources(resources, cb, target) {
        if (cc.isString(resources))
            resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
        this.target = target;
    }

    _startLoading() {
        var self = this;
        self.unschedule(self._startLoading);
        var res = self.resources;
        Loader.getInstance().load(res,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
                self._label.setString("Loading... " + percent + "%");
            }, function () {
                if (self.cb)
                    self.cb.call(self.target);
            });
    }

    _updateTransform() {
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        this._bgLayer._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        this._label._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        this._logo && this._logo._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
    }
}

LoaderScene.preload = function (resources, cb, target) {
    var _cc = cc;
    if (!_cc.loaderScene) {
        _cc.loaderScene = new cc.LoaderScene();
        _cc.loaderScene.init();
        EventManager.getInstance().addCustomListener(cc.Director.EVENT_PROJECTION_CHANGED, function () {
            _cc.loaderScene._updateTransform();
        });
    }
    _cc.loaderScene.initWithResources(resources, cb, target);

    cc.director.runScene(_cc.loaderScene);
    return _cc.loaderScene;
};
