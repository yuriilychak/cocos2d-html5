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

import { EventManager, RendererConfig, Node, EGLView, log, Sys, Game } from '@aspect/core';
import { Widget } from '../base-classes/widget';

/**
 * @brief A View that displays web pages.
 *
 * @note WebView displays web pages based on DOM element
 * WebView will be rendered above all other graphical elements.
 *
 * @property {String}   path - The url to be shown in the web view
 */
export class WebView extends Widget {

    constructor(path) {
        super();
        this._EventList = {};
        if (path)
            this.loadURL(path);
    }

    visit() {
        var cmd = this._renderCmd,
            div = cmd._div,
            container = Game.getInstance().container,
            eventManager = EventManager.getInstance();
        if (this._visible) {
            container.appendChild(div);
            if (this._listener === null)
                this._listener = eventManager.addCustomListener(Game.EVENT_RESIZE, function () {
                    cmd.resize();
                });
        } else {
            var hasChild = false;
            if ('contains' in container) {
                hasChild = container.contains(div);
            } else {
                hasChild = container.compareDocumentPosition(div) % 16;
            }
            if (hasChild)
                container.removeChild(div);
            var list = eventManager._listenersMap[Game.EVENT_RESIZE].getFixedPriorityListeners();
            eventManager._removeListenerInVector(list, cmd._listener);
            cmd._listener = null;
        }
        cmd.updateStatus();
        cmd.resize(EGLView.getInstance());
    }

    setJavascriptInterfaceScheme(scheme) {
    }
    loadData(data, MIMEType, encoding, baseURL) {
    }
    loadHTMLString(string, baseURL) {
    }


    /**
     * Load an URL
     * @param {String} url
     */
    loadURL(url) {
        this._renderCmd.updateURL(url);
        this._dispatchEvent(WebView.EventType.LOADING);
    }

    /**
     * Stop loading
     */
    stopLoading() {
        log("Web does not support loading");
    }

    /**
     * Reload the WebView
     */
    reload() {
        var iframe = this._renderCmd._iframe;
        if (iframe) {
            var win = iframe.contentWindow;
            if (win && win.location)
                win.location.reload();
        }
    }

    /**
     * Determine whether to go back
     */
    canGoBack() {
        log("Web does not support query history");
        return true;
    }

    /**
     * Determine whether to go forward
     */
    canGoForward() {
        log("Web does not support query history");
        return true;
    }

    /**
     * go back
     */
    goBack() {
        try {
            if (WebView._polyfill.closeHistory)
                return log("The current browser does not support the GoBack");
            var iframe = this._renderCmd._iframe;
            if (iframe) {
                var win = iframe.contentWindow;
                if (win && win.location)
                    try {
                        win.history.back.call(win);
                    } catch (error) {
                        win.history.back();
                    }
            }
        } catch (err) {
            log(err);
        }
    }

    /**
     * go forward
     */
    goForward() {
        try {
            if (WebView._polyfill.closeHistory)
                return log("The current browser does not support the GoForward");
            var iframe = this._renderCmd._iframe;
            if (iframe) {
                var win = iframe.contentWindow;
                if (win && win.location)
                    try {
                        win.history.forward.call(win);
                    } catch (error) {
                        win.history.forward();
                    }
            }
        } catch (err) {
            log(err);
        }
    }

    /**
     * In the webview execution within a period of js string
     * @param {String} str
     */
    evaluateJS(str) {
        var iframe = this._renderCmd._iframe;
        if (iframe) {
            var win = iframe.contentWindow;
            try {
                win.eval(str);
                this._dispatchEvent(WebView.EventType.JS_EVALUATED);
            } catch (err) {
                console.error(err);
            }
        }
    }

    /**
     * Limited scale
     */
    setScalesPageToFit() {
        log("Web does not support zoom");
    }

    /**
     * The binding event
     * @param {ccui.WebView.EventType} event
     * @param {Function} callback
     */
    setEventListener(event, callback) {
        this._EventList[event] = callback;
    }

    /**
     * Delete events
     * @param {ccui.WebView.EventType} event
     */
    removeEventListener(event) {
        this._EventList[event] = null;
    }

    _dispatchEvent(event) {
        var callback = this._EventList[event];
        if (callback)
            callback.call(this, this, this._renderCmd._iframe.src);
    }

    _createRenderCmd() {
        return new WebView.RenderCmd(this);
    }

    /**
     * Set the contentSize
     * @param {Number} w
     * @param {Number} h
     */
    setContentSize(w, h) {
        super.setContentSize(w, h);
        if (h === undefined) {
            h = w.height;
            w = w.width;
        }
        this._renderCmd.changeSize(w, h);
    }

    /**
     * remove node
     */
    cleanup() {
        this._renderCmd.removeDom();
        this.stopAllActions();
        this.unscheduleAllCallbacks();
    }
}

/**
 * The WebView support list of events
 * @type {{LOADING: string, LOADED: string, ERROR: string}}
 */
WebView.EventType = {
    LOADING: "loading",
    LOADED: "load",
    ERROR: "error",
    JS_EVALUATED: "js"
};

const _polyfill = WebView._polyfill = {
    devicePixelRatio: false,
    enableDiv: false
};

if (Sys.os === Sys.OS_IOS)
    _polyfill.enableDiv = true;

if (Sys.isMobile) {
    if (Sys.browserType === Sys.BROWSER_TYPE_FIREFOX) {
        _polyfill.enableBG = true;
    }
} else {
    if (Sys.browserType === Sys.BROWSER_TYPE_IE) {
        _polyfill.closeHistory = true;
    }
}

{
    const polyfill = WebView._polyfill;
    const RenderCmd = RendererConfig.getInstance().isWebGL ? Node.WebGLRenderCmd : Node.CanvasRenderCmd;
    WebView.RenderCmd = class extends RenderCmd {
        constructor(node) {
            super(node);

            this._div = null;
            this._iframe = null;

            if (polyfill.enableDiv) {
                this._div = document.createElement("div");
                this._div.style["-webkit-overflow"] = "auto";
                this._div.style["-webkit-overflow-scrolling"] = "touch";
                this._iframe = document.createElement("iframe");
                this._iframe.style["width"] = "100%";
                this._iframe.style["height"] = "100%";
                this._div.appendChild(this._iframe);
            } else {
                this._div = this._iframe = document.createElement("iframe");
            }

            if (polyfill.enableBG)
                this._div.style["background"] = "#FFF";

            this._iframe.addEventListener("load", () => {
                node._dispatchEvent(WebView.EventType.LOADED);
            });
            this._iframe.addEventListener("error", () => {
                node._dispatchEvent(WebView.EventType.ERROR);
            });
            this._div.style["background"] = "#FFF";
            this._div.style.height = "200px";
            this._div.style.width = "300px";
            this._div.style.overflow = "scroll";
            this._div.style["border"] = "none";
            this._listener = null;
            this.initStyle();
        }

        transform(parentCmd, recursive) {
            this.originTransform(parentCmd, recursive);
            this.updateMatrix(this._worldTransform, EGLView.getInstance()._scaleX, EGLView.getInstance()._scaleY);
        }

        updateStatus() {
            polyfill.devicePixelRatio = EGLView.getInstance().isRetinaEnabled();
            var flags = Node._dirtyFlags, locFlag = this._dirtyFlag;
            if (locFlag & flags.transformDirty) {
                this.transform(this.getParentRenderCmd(), true);
                this.updateMatrix(this._worldTransform, EGLView.getInstance()._scaleX, EGLView.getInstance()._scaleY);
                this._dirtyFlag = this._dirtyFlag & Node._dirtyFlags.transformDirty ^ this._dirtyFlag;
            }

            if (locFlag & flags.orderDirty) {
                this._dirtyFlag = this._dirtyFlag & flags.orderDirty ^ this._dirtyFlag;
            }
        }

        resize(view) {
            view = view || EGLView.getInstance();
            var node = this._node,
                eventManager = EventManager.getInstance();
            if (node._parent && node._visible)
                this.updateMatrix(this._worldTransform, view._scaleX, view._scaleY);
            else {
                var list = eventManager._listenersMap[Game.EVENT_RESIZE].getFixedPriorityListeners();
                eventManager._removeListenerInVector(list, this._listener);
                this._listener = null;
            }
        }

        updateMatrix(t, scaleX, scaleY) {
            var node = this._node;
            if (polyfill.devicePixelRatio) {
                var dpr = EGLView.getInstance().getDevicePixelRatio();
                scaleX = scaleX / dpr;
                scaleY = scaleY / dpr;
            }
            if (this._loaded === false) return;
            var containerStyle = Game.getInstance().container.style,
                offsetX = parseInt(containerStyle.paddingLeft),
                offsetY = parseInt(containerStyle.paddingBottom),
                cw = node._contentSize.width,
                ch = node._contentSize.height;
            var a = t.a * scaleX,
                b = t.b,
                c = t.c,
                d = t.d * scaleY,
                tx = offsetX + t.tx * scaleX - cw / 2 + cw * node._scaleX / 2 * scaleX,
                ty = offsetY + t.ty * scaleY - ch / 2 + ch * node._scaleY / 2 * scaleY;
            var matrix = "matrix(" + a + "," + b + "," + c + "," + d + "," + tx + "," + -ty + ")";
            this._div.style["transform"] = matrix;
            this._div.style["-webkit-transform"] = matrix;
        }

        initStyle() {
            if (!this._div)  return;
            var div = this._div;
            div.style.position = "absolute";
            div.style.bottom = "0px";
            div.style.left = "0px";
        }

        updateURL(url) {
            var iframe = this._iframe;
            iframe.src = url;
            var cb = () => {
                this._loaded = true;
                iframe.removeEventListener("load", cb);
            };
            iframe.addEventListener("load", cb);
        }

        changeSize(w, h) {
            var div = this._div;
            if (div) {
                div.style["width"] = w + "px";
                div.style["height"] = h + "px";
            }
        }

        removeDom() {
            var div = this._div;
            if (div) {
                var hasChild = false;
                if ('contains' in Game.getInstance().container) {
                    hasChild = Game.getInstance().container.contains(div);
                } else {
                    hasChild = Game.getInstance().container.compareDocumentPosition(div) % 16;
                }
                if (hasChild)
                    Game.getInstance().container.removeChild(div);
            }
        }
    };
}
