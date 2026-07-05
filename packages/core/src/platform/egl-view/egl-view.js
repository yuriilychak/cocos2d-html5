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

import { BaseClass } from "../class";
import { Point, Rect, Size } from "../../geometry";
import { contentScaleFactor } from "../macro/utils";
import { VisibleRect } from "../visible-rect";
import { ContainerStrategyType, ContentStrategyType } from "./enums";
import { ResolutionPolicy } from "./resolution-policy";
import { BrowserGetter } from "./browser-getter";
import { log, _LogInfos } from "../../boot/debugger";
import {
  DensityDPI,
  ResolutionPolicyType,
  DeviceOrientation
} from "../../enums";

/**
 * view is the singleton object which represents the game window.<br/>
 * It's main task include: <br/>
 *  - Apply the design resolution policy<br/>
 *  - Provide interaction with the window, like resize event on web, retina display support, etc...<br/>
 *  - Manage the game view port which can be different with the window<br/>
 *  - Manage the content scale and translation<br/>
 * <br/>
 * Since the view is a singleton, you don't need to call any constructor or create functions,<br/>
 * the standard way to use it is by calling:<br/>
 *  - view.methodName(); <br/>
 */
export class EGLView extends BaseClass {
  // The visible rect in content's coordinate in point
  #visibleRect = new VisibleRect();
  #scale = new Point(1, 1);
  #originalScale = new Point(1, 1);
  #retinaEnabled = false;
  #autoFullScreen = false;
  #rotated = false;
  // Size of parent node that contains container and _canvas
  #frameSize = new Size();
  // resolution size, it is the size appropriate for the app resources.
  #designResolutionSize = new Size();
  #originalDesignResolutionSize = new Size();
  // Viewport is the container's rect related to content's coordinates in pixel
  #viewPortRect = new Rect();
  #innerVisibleRect = new Rect();
  // The device's pixel ratio (for retina displays)
  #devicePixelRatio = 1;
  // the view name
  #viewName = "";

  #resolutionPolicy = null;

  #targetDensityDPI = DensityDPI.HIGH;

  #orientation = DeviceOrientation.AUTO;

  #frameZoomFactor = 1;

  #orientationChanging = true;

  #resizing = false;

  // Parent node that contains container and _canvas
  #frame = null;

  #resizeWithBrowserSize = false;

  #scissorRect = new Rect();

  #adjustViewPort = true;

  #browserGetter;

  #contentTranslateLeftTop = new Point();

  #resizeCallback = null;

  #director = null;
  #eventManager = null;
  #game = null;
  #rendererConfig = null;
  #screen = null;
  #sys = null;

  constructor() {
    super();

    this.#browserGetter = new BrowserGetter(this);

    // Setup system default resolution policies
    this._rpExactFit = new ResolutionPolicy(
      ContainerStrategyType.EQUAL_TO_FRAME,
      ContentStrategyType.EXACT_FIT
    );
    this._rpShowAll = new ResolutionPolicy(
      ContainerStrategyType.PROPORTION_TO_FRAME,
      ContentStrategyType.SHOW_ALL
    );
    this._rpNoBorder = new ResolutionPolicy(
      ContainerStrategyType.EQUAL_TO_FRAME,
      ContentStrategyType.NO_BORDER
    );
    this._rpFixedHeight = new ResolutionPolicy(
      ContainerStrategyType.EQUAL_TO_FRAME,
      ContentStrategyType.FIXED_HEIGHT
    );
    this._rpFixedWidth = new ResolutionPolicy(
      ContainerStrategyType.EQUAL_TO_FRAME,
      ContentStrategyType.FIXED_WIDTH
    );
  }

  injectServices({
    director,
    eventManager,
    game,
    rendererConfig,
    screen,
    sys
  }) {
    this.#director = director;
    this.#eventManager = eventManager;
    this.#game = game;
    this.#rendererConfig = rendererConfig;
    this.#screen = screen;
    this.#sys = sys;
  }

  // Resize helper functions
  #resizeEvent = () => {
    if (this.#orientationChanging) {
      return;
    }

    // Check frame size changed or not
    var prevFrameW = this.#frameSize.width,
      prevFrameH = this.#frameSize.height,
      prevRotated = this.#rotated;
    if (this.#sys.specification.isMobile) {
      const containerStyle = this.#game.container.style,
        margin = containerStyle.margin;
      containerStyle.margin = "0";
      containerStyle.display = "none";
      this.#initFrameSize();
      containerStyle.margin = margin;
      containerStyle.display = "block";
    } else {
      this.#initFrameSize();
    }
    if (
      this.#rotated === prevRotated &&
      this.#frameSize.width === prevFrameW &&
      this.#frameSize.height === prevFrameH
    )
      return;

    // Frame size changed, do resize works
    this.#resizing = true;
    if (this.#originalDesignResolutionSize.width > 0) {
      this.setDesignResolutionSize(
        this.#originalDesignResolutionSize,
        this.#resolutionPolicy
      );
    }
    this.#resizing = false;

    this.#eventManager.dispatchCustomEvent("canvas-resize");
    if (this.#resizeCallback) {
      this.#resizeCallback.call();
    }
  };

  #orientationChange() {
    this.#orientationChanging = true;
    if (this.#sys.specification.isMobile) {
      this.#game.container.style.display = "none";
    }
    setTimeout(() => {
      this.#orientationChanging = false;
      this.#resizeEvent();
    }, 300);
  }

  #resetDesignResolution(isOriginal) {
    const size = isOriginal
      ? this.#originalDesignResolutionSize
      : this.#designResolutionSize;

    this.setDesignResolutionSize(size, this.#resolutionPolicy);
  }

  initResizeHandler() {
    if (this.resizeWithBrowserSize) {
      return;
    }

    const resize = () => {
      this.#resetDesignResolution(false);
      window.removeEventListener("resize", resize, false);
    };

    window.addEventListener("resize", resize, false);
  }

  setDocumentPixelWidth(width) {
    // Set viewport's width
    this.#setViewportMeta({ width }, true);

    // Set body width to the exact pixel resolution
    document.documentElement.style.width = width + "px";
    document.body.style.width = "100%";

    // Reset the resolution size and policy
    this.#resetDesignResolution(false);
  }

  #initFrameSize() {
    var w = this.#browserGetter.width;
    var h = this.#browserGetter.height;
    var isLandscape = w >= h;

    if (
      !this.#sys.specification.isMobile ||
      (isLandscape && this.#orientation & DeviceOrientation.LANDSCAPE) ||
      (!isLandscape && this.#orientation & DeviceOrientation.PORTRAIT)
    ) {
      this.#frameSize.set(w, h);
      this.#game.container.style["-webkit-transform"] = "rotate(0deg)";
      this.#game.container.style.transform = "rotate(0deg)";
      this.#rotated = false;
    } else {
      this.#frameSize.set(h, w);
      this.#game.container.style["-webkit-transform"] = "rotate(90deg)";
      this.#game.container.style.transform = "rotate(90deg)";
      this.#game.container.style["-webkit-transform-origin"] = "0px 0px 0px";
      this.#game.container.style.transformOrigin = "0px 0px 0px";
      this.#rotated = true;
    }
  }

  // hack
  _adjustSizeKeepCanvasSize() {
    if (this.#originalDesignResolutionSize.width > 0)
      this.#resetDesignResolution(true);
  }

  #setViewportMeta(metas, overwrite) {
    var vp = document.getElementById("cocosMetaElement");
    if (vp && overwrite) {
      document.head.removeChild(vp);
    }

    var elems = document.getElementsByName("viewport"),
      currentVP = elems ? elems[0] : null,
      content,
      key,
      pattern;

    content = currentVP ? currentVP.content : "";
    vp = vp || document.createElement("meta");
    vp.id = "cocosMetaElement";
    vp.name = "viewport";
    vp.content = "";

    for (key in metas) {
      if (content.indexOf(key) == -1) {
        content += "," + key + "=" + metas[key];
      } else if (overwrite) {
        pattern = new RegExp(key + "\s*=\s*[^,]+");
        content.replace(pattern, key + "=" + metas[key]);
      }
    }
    if (/^,/.test(content)) content = content.substr(1);

    vp.content = content;
    // For adopting certain android devices which don't support second viewport
    if (currentVP) currentVP.content = content;

    document.head.appendChild(vp);
  }

  #adjustViewportMeta() {
    if (this.#adjustViewPort) {
      this.#setViewportMeta(this.#browserGetter.meta, false);
      // Only adjust viewport once
      this.#adjustViewPort = false;
    }
  }

  // RenderTexture hacker
  _setScaleXYForRenderTexture() {
    //hack for RenderTexture on canvas mode when adapting multiple resolution resources
    var scaleFactor = contentScaleFactor();
    this.#scale.set(scaleFactor, scaleFactor);
  }

  // Other helper functions
  _resetScale() {
    this.#scale.set(this.#originalScale);
  }

  initialize() {
    if (this._initialized) {
      return;
    }

    this.#browserGetter.init(this.#sys);

    var d = document;

    this.#frame =
      this.#game.container.parentNode === d.body
        ? d.documentElement
        : this.#game.container.parentNode;

    this.#initFrameSize();

    var w = this.#game.canvas.width,
      h = this.#game.canvas.height;
    this.#designResolutionSize.set(this.#game.canvas);
    this.#originalDesignResolutionSize.set(this.#game.canvas);
    this.#viewPortRect.set(0, 0, w, h);
    this.#innerVisibleRect.set(0, 0, w, h);
    this.#contentTranslateLeftTop.set(0, 0);
    this.#viewName = "Cocos2dHTML5";

    this.#visibleRect.init(this.#innerVisibleRect);

    if (this.#sys.specification.isMobile) {
      window.addEventListener(
        "orientationchange",
        this.#orientationChange.bind(this)
      );
    } else {
      this.#orientationChanging = false;
    }

    this._initialized = true;
  }

  /**
   * Sets the resolution policy with designed view size in points.<br/>
   * The resolution policy include: <br/>
   * [1] ResolutionExactFit       Fill screen by stretch-to-fit: if the design resolution ratio of width to height is different from the screen resolution ratio, your game view will be stretched.<br/>
   * [2] ResolutionNoBorder       Full screen without black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two areas of your game view will be cut.<br/>
   * [3] ResolutionShowAll        Full screen with black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two black borders will be shown.<br/>
   * [4] ResolutionFixedHeight    Scale the content's height to screen's height and proportionally scale its width<br/>
   * [5] ResolutionFixedWidth     Scale the content's width to screen's width and proportionally scale its height<br/>
   * [ResolutionPolicy]        [Web only feature] Custom resolution policy, constructed by ResolutionPolicy<br/>
   * @param {SizeLike} size Design resolution size.
   * @param {ResolutionPolicy|Number} resolutionPolicy The resolution policy desired
   */
  setDesignResolutionSize(size, resolutionPolicy) {
    // Defensive code
    if (!(size.width > 0 || size.height > 0)) {
      log(_LogInfos.EGLView_setDesignResolutionSize);
      return;
    }

    this.#resolutionPolicy = resolutionPolicy;

    if (this.#resolutionPolicy !== null) {
      this.#resolutionPolicy.preApply(this);
    }

    // Reinit frame size
    if (this.#sys.specification.isMobile) this.#adjustViewportMeta();

    // If resizing, then frame size is already initialized, this logic should be improved
    if (!this.#resizing) this.#initFrameSize();

    if (this.#resolutionPolicy === null) {
      log(_LogInfos.EGLView_setDesignResolutionSize_2);
      return;
    }

    this.#designResolutionSize.set(size);
    this.#originalDesignResolutionSize.set(size);

    const { scale, viewport } = this.#resolutionPolicy.apply(this, this.#designResolutionSize);

    this.#scale.set(scale);
    this.#viewPortRect.set(viewport);

    Point.compMultIn(Point.negIn(this.#innerVisibleRect, this.#viewPortRect), this.#scale);
    this.#innerVisibleRect.width = this.#game.canvas.width / this.#scale.x;
    this.#innerVisibleRect.height = this.#game.canvas.height / this.#scale.y;
    this.#rendererConfig.renderContext.setOffset &&
      this.#rendererConfig.renderContext.setOffset(this.#viewPortRect.x, -this.#viewPortRect.y);

    // reset director's member variables to fit visible rect
    var director = this.#director;
    director._winSizeInPoints.set(this.#designResolutionSize);
    this.resolutionPolicy.postApply(this);

    if (this.#rendererConfig.isWebGL) {
      // reset director's member variables to fit visible rect
      director.setGLDefaultValues();
    } else if (this.#rendererConfig.isCanvas) {
      this.#rendererConfig.renderer._allNeedDraw = true;
    }

    this.#originalScale.set(this.#scale);
    this.#visibleRect.init(this.#innerVisibleRect);
  }

  /**
   * Sets the document body to desired pixel resolution and fit the game content to it.
   * This function is very useful for adaptation in mobile browsers.
   * In some HD android devices, the resolution is very high, but its browser performance may not be very good.
   * In this case, enabling retina display is very costy and not suggested, and if retina is disabled, the image may be blurry.
   * But this API can be helpful to set a desired pixel resolution which is in between.
   * This API will do the following:
   *     1. Set viewport's width to the desired width in pixel
   *     2. Set body width to the exact pixel resolution
   *     3. The resolution policy will be reset with designed view size in points.
   * @param {SizeLike} size Design resolution size.
   * @param {ResolutionPolicy|Number} resolutionPolicy The resolution policy desired
   */
  setRealPixelResolution(size, resolutionPolicy) {
    // Set viewport's width
    this.#setViewportMeta({ width: size.width }, true);

    // Set body width to the exact pixel resolution
    document.documentElement.style.width = size.width + "px";
    document.body.style.width = size.width + "px";
    document.body.style.left = "0px";
    document.body.style.top = "0px";

    // Reset the resolution size and policy
    this.setDesignResolutionSize(size, resolutionPolicy);
  }

  #checkScissorRect() {
    if (!Rect.equalToZero(this.#scissorRect)) {
      const boxArr = gl.getParameter(gl.SCISSOR_BOX);
      this.#scissorRect.set(boxArr[0], boxArr[1], boxArr[2], boxArr[3]);
    }
  }

  /**
   * Sets view port rectangle with points.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w width
   * @param {Number} h height
   */
  setViewPortInPoints(x, y, w, h) {
    this.#rendererConfig.renderContext.viewport(
      x * this.#scale.x * this.#frameZoomFactor +
        this.#viewPortRect.x * this.#frameZoomFactor,
      y * this.#scale.y * this.#frameZoomFactor +
        this.#viewPortRect.y * this.#frameZoomFactor,
      w * this.#scale.x * this.#frameZoomFactor,
      h * this.#scale.y * this.#frameZoomFactor
    );
  }

  /**
   * Sets Scissor rectangle with points.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w
   * @param {Number} h
   */
  setScissorInPoints(x, y, w, h) {
    const sx = Math.ceil(
      x * this.#scale.x * this.#frameZoomFactor +
        this.#viewPortRect.x * this.#frameZoomFactor
    );
    const sy = Math.ceil(
      y * this.#scale.y * this.#frameZoomFactor +
        this.#viewPortRect.y * this.#frameZoomFactor
    );
    const sw = Math.ceil(w * this.#scale.x * this.#frameZoomFactor);
    const sh = Math.ceil(h * this.#scale.y * this.#frameZoomFactor);

    this.#checkScissorRect();

    if (
      this.#scissorRect.x !== sx ||
      this.#scissorRect.y !== sy ||
      this.#scissorRect.width !== sw ||
      this.#scissorRect.height !== sh
    ) {
      this.#scissorRect.set(sx, sy, sw, sh);
      this.#rendererConfig.renderContext.scissor(sx, sy, sw, sh);
    }
  }

  /**
   * Returns the real location in view for a translation based on a related position
   * @param {Number} tx The X axis translation
   * @param {Number} ty The Y axis translation
   * @param {Object} relatedPos The related position object including "left", "top", "width", "height" informations
   * @return {Point}
   */
  convertToLocationInView(tx, ty, relatedPos) {
    const x = this.#devicePixelRatio * (tx - relatedPos.left);
    const y =
      this.#devicePixelRatio * (relatedPos.top + relatedPos.height - ty);
    return this.#rotated
      ? new Point(this.#viewPortRect.width - y, x)
      : new Point(x, y);
  }

  _convertMouseToLocationInView(point, relatedPos) {
    var viewport = this.#viewPortRect;
    point.x =
      (this.#devicePixelRatio * (point.x - relatedPos.left) - viewport.x) /
      this.#scale.x;
    point.y =
      (this.#devicePixelRatio * (relatedPos.top + relatedPos.height - point.y) -
        viewport.y) /
      this.#scale.y;
  }

  _convertPointWithScale(point) {
    Point.compDivIn(Point.subIn(point, this.#viewPortRect), this.#scale);
  }

  _convertTouchesWithScale(touches) {
    for (let i = 0; i < touches.length; ++i) {
      this._convertPointWithScale(touches[i]);
      this._convertPointWithScale(touches[i].previousLocation);
    }
  }

  /**
   * Sets the callback function for view's resize action,<br/>
   * this callback will be invoked before applying resolution policy, <br/>
   * so you can do any additional modifications within the callback.<br/>
   * Useful only on web.
   */
  set resizeCallback(callback) {
    if (typeof callback === "function" || callback == null) {
      this.#resizeCallback = callback;
    }
  }

  /**
   * Returns the callback function for view's resize action.
   */
  get resizeCallback() {
    return this.#resizeCallback;
  }

  get rotated() {
    return this.#rotated;
  }

  get frameSize() {
    return this.#frameSize.clone();
  }

  /**
   * On native, it sets the frame size of view.<br/>
   * On web, it sets the size of the canvas's outer DOM element.
   */
  set frameSize(size) {
    this.#frameSize.set(size);
    this.#frame.style.width = size.width + "px";
    this.#frame.style.height = size.height + "px";
    this.#resizeEvent();
    this.#director.setProjection(this.#director.getProjection());
  }

  get devicePixelRatio() {
    return this.#devicePixelRatio;
  }

  set devicePixelRatio(value) {
    this.#devicePixelRatio = value;
  }

  get frame() {
    return this.#frame;
  }

  set frame(value) {
    this.#frame = value;
  }

  get resizeWithBrowserSize() {
    return this.#resizeWithBrowserSize;
  }

  /**
   * Sets whether resize canvas automatically when browser's size changed.<br/>
   * Useful only on web.
   */
  set resizeWithBrowserSize(enabled) {
    if (enabled) {
      //enable
      if (!this.#resizeWithBrowserSize) {
        this.#resizeWithBrowserSize = true;
        window.addEventListener("resize", this.#resizeEvent);
      }
    } else {
      //disable
      if (this.#resizeWithBrowserSize) {
        this.#resizeWithBrowserSize = false;
        window.removeEventListener("resize", this.#resizeEvent);
      }
    }
  }

  /**
   * Whether the engine modifies the "viewport" meta in your web page.
   */
  set adjustViewPort(enabled) {
    this.#adjustViewPort = enabled;
  }

  /**
   * Whether the engine modifies the "viewport" meta in your web page.
   */
  get adjustViewPort() {
    return this.#adjustViewPort;
  }

  /**
   * <p>
   * View's target-densitydpi for android mobile browser. it can be set to:           <br/>
   *   1. DensityDPI.DEVICE, value is "device-dpi"                                      <br/>
   *   2. DensityDPI.HIGH, value is "high-dpi"  (default value)                         <br/>
   *   3. DensityDPI.MEDIUM, value is "medium-dpi" (browser's default value)            <br/>
   *   4. DensityDPI.LOW, value is "low-dpi"                                            <br/>
   *   5. Custom value, e.g: "480"                                                         <br/>
   * </p>
   */
  set targetDensityDPI(densityDPI) {
    this.#targetDensityDPI = densityDPI;
    this.#adjustViewportMeta();
  }

  /**
   * Returns the current target-densitydpi value of view.
   */
  get targetDensityDPI() {
    return this.#targetDensityDPI;
  }

  /**
   * Orientation of the game. It can be landscape, portrait or auto.
   */
  set orientation(orientation) {
    orientation = orientation & DeviceOrientation.AUTO;
    if (orientation && this.#orientation !== orientation) {
      this.#orientation = orientation;
      if (this.#resolutionPolicy) {
        this.#resetDesignResolution(true);
      }
    }
  }

  /**
   * Returns the current orientation.
   */
  get orientation() {
    return this.#orientation;
  }

  /**
   * Current resolution policy.
   * @see ResolutionPolicy
   */
  set resolutionPolicy(resolutionPolicy) {
    this.#resolutionPolicy = resolutionPolicy;
  }

  /**
   * Returns the current resolution policy.
   * @see ResolutionPolicy
   */
  get resolutionPolicy() {
    return this.#resolutionPolicy;
  }

  /**
   * Sets the name of the view.
   */
  set viewName(viewName) {
    if (!!viewName && this.#viewName !== viewName) {
      this.#viewName = viewName;
    }
  }

  /**
   * Returns the name of the view.
   */
  get viewName() {
    return this.#viewName;
  }

  /**
   * Sets the resolution translate on EGLView.
   */
  set contentTranslateLeftTop(value) {
    this.#contentTranslateLeftTop.set(value);
  }

  /**
   * Returns the resolution translate on EGLView.
   */
  get contentTranslateLeftTop() {
    return this.#contentTranslateLeftTop.clone();
  }

  /**
   * Zoom factor for frame. This property is for debugging big resolution (e.g.new ipad) app on desktop.
   */
  get frameZoomFactor() {
    return this.#frameZoomFactor;
  }

  /**
   * Zoom factor for frame. This property is for debugging big resolution (e.g.new ipad) app on desktop.
   */
  set frameZoomFactor(zoomFactor) {
    this.#frameZoomFactor = zoomFactor;
    this.centerWindow();
    this.#director.setProjection(this.#director.getProjection());
  }

  /**
   * Retina support is enabled by default for Apple device but disabled for other devices,<br/>
   * it takes effect only when you called setDesignResolutionPolicy<br/>
   * Only useful on web
   */
  set retinaEnabled(enabled) {
    this.#retinaEnabled = !!enabled;
  }

  /**
   * Check whether retina display is enabled.<br/>
   * Only useful on web
   */
  get retinaEnabled() {
    return this.#retinaEnabled;
  }

  /**
   * If enabled, the application will try automatically to enter full screen mode on mobile devices<br/>
   * You can pass true as parameter to enable it and disable it by passing false.<br/>
   * Only useful on web
   */
  set autoFullScreenEnabled(enabled) {
    if (
      enabled &&
      enabled !== this.#autoFullScreen &&
      this.#sys.specification.isMobile &&
      this.#frame === document.documentElement
    ) {
      // Automatically full screen when user touches on mobile version
      this.#autoFullScreen = true;
      this.#screen.autoFullScreen(this.#frame);
    } else {
      this.#autoFullScreen = false;
    }
  }

  /**
   * Check whether auto full screen is enabled.<br/>
   * Only useful on web
   */
  get autoFullScreenEnabled() {
    return this.#autoFullScreen;
  }

  /**
   * Get whether render system is ready(no matter opengl or canvas),<br/>
   * this name is for the compatibility with cocos2d-x, subclass must implement this method.
   */
  get openGLReady() {
    return !!this.#game.canvas && !!this.#rendererConfig.renderContext;
  }

  /**
   * Returns the canvas size of the view.<br/>
   * On native platforms, it returns the screen size since the view is a fullscreen view.<br/>
   * On web, it returns the size of the canvas element.
   */
  get canvasSize() {
    return new Size(this.#game.canvas);
  }

  /**
   * Returns the visible area size of the view port.
   */
  get visibleSize() {
    return this.#innerVisibleRect.clone();
  }

  /**
   * Returns the visible area size of the view port.
   */
  get visibleSizeInPixel() {
    return new Size(
      this.#innerVisibleRect.width * this.#scale.x,
      this.#innerVisibleRect.height * this.#scale.y
    );
  }

  /**
   * Returns the visible origin of the view port.
   */
  get visibleOrigin() {
    return new Point(this.#innerVisibleRect);
  }

  /**
   * Returns the visible origin of the view port.
   */
  get visibleOriginInPixel() {
    return Point.compMult(this.#innerVisibleRect, this.#scale);
  }

  /**
   * Returns whether developer can set content's scale factor.
   */
  get canSetContentScaleFactor() {
    return true;
  }

  get visibleRect() {
    return this.#visibleRect;
  }

  /**
   * Returns the designed size for the view.
   * Default resolution size is the same as frameSize.
   */
  get designResolutionSize() {
    return this.#designResolutionSize.clone();
  }

  /**
   * Returns whether GL_SCISSOR_TEST is enable
   */
  get scissorEnabled() {
    return this.#rendererConfig.renderContext.isEnabled(gl.SCISSOR_TEST);
  }

  /**
   * Returns the current scissor rectangle
   */
  get scissorRect() {
    this.#checkScissorRect();

    return new Rect(
      (this.#scissorRect.x - this.#viewPortRect.x) / this.#scale.x,
      (this.#scissorRect.y - this.#viewPortRect.y) / this.#scale.y,
      this.#scissorRect.width / this.#scale.x,
      this.#scissorRect.height / this.#scale.y
    );
  }

  /**
   * Returns the view port rectangle.
   */
  get viewPortRect() {
    return this.#viewPortRect;
  }

  /**
   * Returns scale factor of the horizontal direction (X axis).
   */
  get scaleX() {
    return this.#scale.x;
  }

  /**
   * Returns scale factor of the vertical direction (Y axis).
   */
  get scaleY() {
    return this.#scale.y;
  }
}
