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

import { NewClass } from '../class';
import Game from '../../boot/game';

/**
 * <p>cc.ContainerStrategy class is the root strategy class of container's scale strategy,
 * it controls the behavior of how to scale the cc.container and cc._canvas object</p>
 *
 * @class
 * @extends NewClass
 */
export class ContainerStrategy extends NewClass {
    /**
     * Manipulation before appling the strategy
     * @param {cc.view} view The target view
     */
    preApply(view) {
    }

    /**
     * Function to apply this strategy
     * @param {cc.view} view
     * @param {cc.Size} designedResolution
     */
    apply(view, designedResolution) {
    }

    /**
     * Manipulation after applying the strategy
     * @param {cc.view} view  The target view
     */
    postApply(view) {

    }

    _setupContainer(view, w, h) {
        var locCanvas = Game.getInstance().canvas, locContainer = Game.getInstance().container;
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            document.body.style.width = (view._isRotated ? h : w) + 'px';
            document.body.style.height = (view._isRotated ? w : h) + 'px';
        }

        // Setup style
        locContainer.style.width = locCanvas.style.width = w + 'px';
        locContainer.style.height = locCanvas.style.height = h + 'px';
        // Setup pixel ratio for retina display
        var devicePixelRatio = view._devicePixelRatio = 1;
        if (view.isRetinaEnabled())
            devicePixelRatio = view._devicePixelRatio = Math.min(2, window.devicePixelRatio || 1);
        // Setup canvas
        locCanvas.width = w * devicePixelRatio;
        locCanvas.height = h * devicePixelRatio;
        cc._renderContext.resetCache && cc._renderContext.resetCache();
    }

    _fixContainer() {
        // Add container to document body
        document.body.insertBefore(cc.container, document.body.firstChild);
        // Set body's width height to window's size, and forbid overflow, so that game will be centered
        var bs = document.body.style;
        bs.width = window.innerWidth + "px";
        bs.height = window.innerHeight + "px";
        bs.overflow = "hidden";
        // Body size solution doesn't work on all mobile browser so this is the aleternative: fixed container
        var contStyle = cc.container.style;
        contStyle.position = "fixed";
        contStyle.left = contStyle.top = "0px";
        // Reposition body
        document.body.scrollTop = 0;
    }
}

// Container scale strategies (subclasses)

/**
 * @class
 * @extends ContainerStrategy
 */
class EqualToFrame extends ContainerStrategy {
    apply(view) {
        var frameH = view._frameSize.height, containerStyle = cc.container.style;
        this._setupContainer(view, view._frameSize.width, view._frameSize.height);
        // Setup container's margin and padding
        if (view._isRotated) {
            containerStyle.margin = '0 0 0 ' + frameH + 'px';
        }
        else {
            containerStyle.margin = '0px';
        }
    }
}

/**
 * @class
 * @extends ContainerStrategy
 */
class ProportionalToFrame extends ContainerStrategy {
    apply(view, designedResolution) {
        var frameW = view._frameSize.width, frameH = view._frameSize.height, containerStyle = cc.container.style,
            designW = designedResolution.width, designH = designedResolution.height,
            scaleX = frameW / designW, scaleY = frameH / designH,
            containerW, containerH;

        scaleX < scaleY ? (containerW = frameW, containerH = designH * scaleX) : (containerW = designW * scaleY, containerH = frameH);

        // Adjust container size with integer value
        var offx = Math.round((frameW - containerW) / 2);
        var offy = Math.round((frameH - containerH) / 2);
        containerW = frameW - 2 * offx;
        containerH = frameH - 2 * offy;

        this._setupContainer(view, containerW, containerH);
        // Setup container's margin and padding
        if (view._isRotated) {
            containerStyle.margin = '0 0 0 ' + frameH + 'px';
        }
        else {
            containerStyle.margin = '0px';
        }
        containerStyle.paddingLeft = offx + "px";
        containerStyle.paddingRight = offx + "px";
        containerStyle.paddingTop = offy + "px";
        containerStyle.paddingBottom = offy + "px";
    }
}

/**
 * @class
 * @extends EqualToFrame
 */
class EqualToWindow extends EqualToFrame {
    preApply(view) {
        super.preApply(view);
        view._frame = document.documentElement;
    }

    apply(view) {
        super.apply(view);
        this._fixContainer();
    }
}

/**
 * @class
 * @extends ProportionalToFrame
 */
class ProportionalToWindow extends ProportionalToFrame {
    preApply(view) {
        super.preApply(view);
        view._frame = document.documentElement;
    }

    apply(view, designedResolution) {
        super.apply(view, designedResolution);
        this._fixContainer();
    }
}

/**
 * @class
 * @extends ContainerStrategy
 */
class OriginalContainer extends ContainerStrategy {
    apply(view) {
        this._setupContainer(view, cc._canvas.width, cc._canvas.height);
    }
}

// Alias: Strategy that makes the container's size equals to the frame's size
ContainerStrategy.EQUAL_TO_FRAME = new EqualToFrame();
// Alias: Strategy that scale proportionally the container's size to frame's size
ContainerStrategy.PROPORTION_TO_FRAME = new ProportionalToFrame();
// Alias: Strategy that keeps the original container's size
ContainerStrategy.ORIGINAL_CONTAINER = new OriginalContainer();
