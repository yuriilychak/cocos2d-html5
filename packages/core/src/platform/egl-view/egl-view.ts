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
import { BrowserGetter } from "./browser-getter";
import { log, _LogInfos } from "../../boot/debugger";
import { DensityDPI, DeviceOrientation, OperatingSystem } from "../../enums";

import type { PointLike, SizeLike } from "../../geometry/types";
import type EventManager from "../../event-manager/event-manager/event-manager";
import type Touch from "../../event-manager/touch";
import type { Screen } from "../screen";
import type Sys from "../../sys/sys";
import type {
  RendererConfigRenderContext,
  RendererConfigRenderer
} from "../../sys/renderer-config";
import type {
  DensityDPIValue,
  EGLViewRelatedPosition,
  EGLViewServices
} from "./types";
import { ResolutionPolicy } from "./resolution-policy";

declare const gl: WebGLRenderingContext;

type ViewportMeta = Record<string, string | number | boolean | undefined>;

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
  #visibleRect: VisibleRect = new VisibleRect();
  #scale: Point = new Point(1, 1);
  #originalScale: Point = new Point(1, 1);
  #retinaEnabled: boolean = false;
  #autoFullScreen: boolean = false;
  #rotated = false;
  // Size of parent node that contains container and _canvas
  #frameSize: Size = new Size();
  // resolution size, it is the size appropriate for the app resources.
  #designResolution: Size = new Size();
  #originalDesignResolution: Size = new Size();
  // Viewport is the container's rect related to content's coordinates in pixel
  #viewPortRect: Rect = new Rect();
  #innerVisibleRect: Rect = new Rect();
  // The device's pixel ratio (for retina displays)
  #devicePixelRatio: number = 1;
  // the view name
  #viewName: string = "";

  #resolutionPolicy: ResolutionPolicy | null = null;

  #targetDensityDPI: DensityDPIValue = DensityDPI.HIGH;

  #orientation: DeviceOrientation = DeviceOrientation.AUTO;

  #frameZoomFactor: number = 1;

  #orientationChanging: boolean = true;

  #resizing: boolean = false;

  // Parent node that contains container and _canvas
  #frame: HTMLElement | null = null;

  #resizeWithBrowserSize: boolean = false;

  #scissorRect: Rect = new Rect();

  #adjustViewPort: boolean = true;

  #browserGetter: BrowserGetter;

  #contentTranslateLeftTop: Point = new Point();

  #resizeCallback: (() => void) | null = null;

  #initialized: boolean = false;

  #canvas: HTMLCanvasElement | null = null;

  #container: HTMLElement | null = null;

  #director: any = null;
  #eventManager: EventManager | null = null;
  #screen: Screen;
  #sys: Sys;

  constructor(sys: Sys, screen: Screen) {
    super();

    this.#sys = sys;
    this.#screen = screen;
    this.#browserGetter = new BrowserGetter(this);
  }

  injectServices({
    director,
    eventManager
  }: EGLViewServices): void {
    this.#director = director;
    this.#eventManager = eventManager;
  }

  initContainers(canvas: HTMLCanvasElement, container: HTMLElement): void {
    this.#canvas = canvas;
    this.#container = container;
  }

  initResizeHandler(): void {
    if (this.#resizeWithBrowserSize) {
      return;
    }

    const resize = () => {
      this.#resetDesignResolution(false);
      window.removeEventListener("resize", resize, false);
    };

    window.addEventListener("resize", resize, false);
  }

  setDocumentPixelWidth(width: number): void {
    // Set viewport's width
    this.#setViewportMeta({ width }, true);

    // Set body width to the exact pixel resolution
    document.documentElement.style.width = width + "px";
    document.body.style.width = "100%";

    // Reset the resolution size and policy
    this.#resetDesignResolution(false);
  }

  setupContainer(size: SizeLike): void {
    if (this.#sys.specification.os === OperatingSystem.ANDROID) {
      document.body.style.width = `${this.#rotated ? size.height : size.width}px`;
      document.body.style.height = `${this.#rotated ? size.width : size.height}px`;
    }

    // Setup style
    this.container.style.width = this.canvas.style.width = `${size.width}px`;
    this.container.style.height = this.canvas.style.height = `${size.height}px`;

    // Setup pixel ratio for retina display
    const devicePixelRatio = this.#retinaEnabled ? Math.min(
        2,
        window.devicePixelRatio || 1
      ) : 1;
    this.#devicePixelRatio = devicePixelRatio;

    // Setup canvas
    this.canvas.width = size.width * devicePixelRatio;
    this.canvas.height = size.height * devicePixelRatio;
    this.#sys.rendererConfig.renderContext?.resetCache?.();
  }

  initialize(canvas: HTMLCanvasElement, container: HTMLElement): void {
    if (this.#initialized) {
      return;
    }

    this.#canvas = canvas;
    this.#container = container;

    this.#browserGetter.init(this.#sys);

    const d = document;

    this.#frame =
      this.#container.parentNode === d.body
        ? d.documentElement
        : this.#container.parentNode as HTMLElement;

    this.#initFrameSize();

    const w = this.canvas.width,
      h = this.canvas.height;
    this.#designResolution.set(this.canvas);
    this.#originalDesignResolution.set(this.canvas);
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

    this.#initialized = true;
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
   */
  setDesignResolutionSize(
    size: SizeLike,
    resolutionPolicy: ResolutionPolicy
  ): void {
    // Defensive code
    if (!(size.width > 0 || size.height > 0)) {
      log(_LogInfos.EGLView_setDesignResolutionSize);
      return;
    }

    this.#resolutionPolicy = resolutionPolicy;

    this.#resolutionPolicy.preApply(this);

    // Reinit frame size
    if (this.#sys.specification.isMobile) this.#adjustViewportMeta();

    // If resizing, then frame size is already initialized, this logic should be improved
    if (!this.#resizing) this.#initFrameSize();

    this.#designResolution.set(size);
    this.#originalDesignResolution.set(size);

    const { scale, viewport } = this.#resolutionPolicy.apply(
      this,
      this.#designResolution
    );

    this.#scale.set(scale);
    this.#viewPortRect.set(viewport);

    Point.compMultIn(Point.negIn(this.#innerVisibleRect, this.#viewPortRect), this.#scale);
    Size.copy(this.#innerVisibleRect, this.canvas);
    Size.compDivIn(this.#innerVisibleRect, this.#scale);
    const renderContext = this.#sys.rendererConfig
      .renderContext as RendererConfigRenderContext;
    renderContext.setOffset &&
      renderContext.setOffset(this.#viewPortRect.x, -this.#viewPortRect.y);

    // reset director's member variables to fit visible rect
    this.#director._winSizeInPoints.set(this.#designResolution);
    this.#resolutionPolicy.postApply(this);

    if (this.#sys.rendererConfig.isWebGL) {
      // reset director's member variables to fit visible rect
      this.#director.setGLDefaultValues();
    } else if (this.#sys.rendererConfig.isCanvas) {
      (this.#sys.rendererConfig.renderer as RendererConfigRenderer)._allNeedDraw =
        true;
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
  setRealPixelResolution(
    size: SizeLike,
    resolutionPolicy: ResolutionPolicy
  ): void {
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

  /**
   * Sets view port rectangle with points.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w width
   * @param {Number} h height
   */
  setViewPortInPoints(x: number, y: number, w: number, h: number): void {
    const scale = Point.mult(this.#scale, this.#frameZoomFactor);
    const viewPort = Point.mult(this.#viewPortRect, this.#frameZoomFactor);
    (this.#sys.rendererConfig.renderContext as RendererConfigRenderContext).viewport(
      x * scale.x + viewPort.x,
      y * scale.y + viewPort.y,
      w * scale.x,
      h * scale.y
    );
  }

  /**
   * Sets Scissor rectangle with points.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w
   * @param {Number} h
   */
  setScissorInPoints(x: number, y: number, w: number, h: number): void {
    const scale = Point.mult(this.#scale, this.#frameZoomFactor);
    const viewPort = Point.mult(this.#viewPortRect, this.#frameZoomFactor);
    const sx = Math.ceil(x * scale.x + viewPort.x);
    const sy = Math.ceil(y * scale.y + viewPort.y);
    const sw = Math.ceil(w * scale.x);
    const sh = Math.ceil(h * scale.y);

    this.#checkScissorRect();

    if (
      this.#scissorRect.x !== sx ||
      this.#scissorRect.y !== sy ||
      this.#scissorRect.width !== sw ||
      this.#scissorRect.height !== sh
    ) {
      this.#scissorRect.set(sx, sy, sw, sh);
      (
        this.#sys.rendererConfig.renderContext as RendererConfigRenderContext
      ).scissor(sx, sy, sw, sh);
    }
  }

  /**
   * Returns the real location in view for a translation based on a related position
   * @param {Number} tx The X axis translation
   * @param {Number} ty The Y axis translation
   * @param {Object} relatedPos The related position object including "left", "top", "width", "height" informations
   * @return {Point}
   */
  convertToLocationInView(
    tx: number,
    ty: number,
    relatedPos: EGLViewRelatedPosition
  ): Point {
    const x = this.#devicePixelRatio * (tx - relatedPos.left);
    const y =
      this.#devicePixelRatio * (relatedPos.top + relatedPos.height - ty);
    return this.#rotated
      ? new Point(this.#viewPortRect.width - y, x)
      : new Point(x, y);
  }

  convertMouseToLocationInView(
    point: PointLike,
    relatedPos: EGLViewRelatedPosition
  ): void {
    const viewport = this.#viewPortRect;
    point.x =
      (this.#devicePixelRatio * (point.x - relatedPos.left) - viewport.x) /
      this.#scale.x;
    point.y =
      (this.#devicePixelRatio * (relatedPos.top + relatedPos.height - point.y) -
        viewport.y) /
      this.#scale.y;
  }

  convertPointWithScale(point: PointLike): void {
    Point.compDivIn(Point.subIn(point, this.#viewPortRect), this.#scale);
  }

  convertTouchesWithScale(touches: Touch[]): void {
    for (let i = 0; i < touches.length; ++i) {
      const touch = touches[i];
      const previousLocation = touch.previousLocation;

      this.convertPointWithScale(touch);
      this.convertPointWithScale(previousLocation);
      touch._setPrevPoint(previousLocation);
    }
  }

  // Resize helper functions
  #resizeEvent = (): void => {
    if (this.#orientationChanging) {
      return;
    }

    // Check frame size changed or not
    const prevFrameW = this.#frameSize.width,
      prevFrameH = this.#frameSize.height,
      prevRotated = this.#rotated;
    if (this.#sys.specification.isMobile) {
      const containerStyle = this.container.style,
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
    if (this.#originalDesignResolution.width > 0) {
      this.setDesignResolutionSize(
        this.#originalDesignResolution,
        this.#resolutionPolicy!
      );
    }
    this.#resizing = false;

    this.#eventManager!.dispatchCustomEvent("canvas-resize");
    if (this.#resizeCallback) {
      this.#resizeCallback();
    }
  };

  #orientationChange(): void {
    this.#orientationChanging = true;
    if (this.#sys.specification.isMobile) {
      this.container.style.display = "none";
    }
    setTimeout(() => {
      this.#orientationChanging = false;
      this.#resizeEvent();
    }, 300);
  }

  #resetDesignResolution(isOriginal: boolean): void {
    const size = isOriginal
      ? this.#originalDesignResolution
      : this.#designResolution;

    this.setDesignResolutionSize(size, this.#resolutionPolicy!);
  }

  #initFrameSize(): void {
    const w = this.#browserGetter.width;
    const h = this.#browserGetter.height;
    const isLandscape = w >= h;
    const nextRotated =
      this.#sys.specification.isMobile &&
      ((isLandscape && !(this.#orientation & DeviceOrientation.LANDSCAPE)) ||
        (!isLandscape && !(this.#orientation & DeviceOrientation.PORTRAIT)));

    if (nextRotated) {
      this.#frameSize.set(h, w);
      this.container.style.setProperty("-webkit-transform", "rotate(90deg)");
      this.container.style.transform = "rotate(90deg)";
      this.container.style.setProperty("-webkit-transform-origin", "0px 0px 0px");
      this.container.style.transformOrigin = "0px 0px 0px";
    } else {
      this.#frameSize.set(w, h);
      this.container.style.setProperty("-webkit-transform", "rotate(0deg)");
      this.container.style.transform = "rotate(0deg)";
    }
    this.#rotated = nextRotated;
  }

  // hack
  #adjustSizeKeepCanvasSize(): void {
    if (this.#originalDesignResolution.width > 0)
      this.#resetDesignResolution(true);
  }

  #setViewportMeta(metas: ViewportMeta, overwrite: boolean): void {
    let vp = document.getElementById("cocosMetaElement") as HTMLMetaElement | null;
    if (vp && overwrite) {
      document.head.removeChild(vp);
    }

    const elems = document.getElementsByName("viewport");
    const currentVP = elems ? (elems[0] as HTMLMetaElement | undefined) : null;
    let content = currentVP ? currentVP.content : "";

    vp = vp || document.createElement("meta");
    vp.id = "cocosMetaElement";
    vp.name = "viewport";
    vp.content = "";

    for (const key in metas) {
      if (content.indexOf(key) == -1) {
        content += "," + key + "=" + metas[key];
      } else if (overwrite) {
        const pattern = new RegExp(key + "\s*=\s*[^,]+");
        content.replace(pattern, key + "=" + metas[key]);
      }
    }
    if (/^,/.test(content)) content = content.substr(1);

    vp.content = content;
    // For adopting certain android devices which don't support second viewport
    if (currentVP) currentVP.content = content;

    document.head.appendChild(vp);
  }

  #adjustViewportMeta(): void {
    if (this.#adjustViewPort) {
      this.#setViewportMeta(this.#browserGetter.meta, false);
      // Only adjust viewport once
      this.#adjustViewPort = false;
    }
  }

  // RenderTexture hacker
  #setScaleXYForRenderTexture(): void {
    //hack for RenderTexture on canvas mode when adapting multiple resolution resources
    const scaleFactor = contentScaleFactor();
    this.#scale.set(scaleFactor, scaleFactor);
  }

  // Other helper functions
  #resetScale(): void {
    this.#scale.set(this.#originalScale);
  }

  #checkScissorRect(): void {
    if (!Rect.equalToZero(this.#scissorRect)) {
      const boxArr = gl.getParameter(gl.SCISSOR_BOX);
      this.#scissorRect.set(boxArr[0], boxArr[1], boxArr[2], boxArr[3]);
    }
  }

  /**
   * Sets the callback function for view's resize action,<br/>
   * this callback will be invoked before applying resolution policy, <br/>
   * so you can do any additional modifications within the callback.<br/>
   * Useful only on web.
   */
  set resizeCallback(callback: (() => void) | null) {
    if (typeof callback === "function" || callback == null) {
      this.#resizeCallback = callback;
    }
  }

  /**
   * Returns the callback function for view's resize action.
   */
  get resizeCallback(): (() => void) | null {
    return this.#resizeCallback;
  }

  get rotated(): boolean {
    return this.#rotated;
  }

  get frameSize(): Size {
    return this.#frameSize.clone();
  }

  /**
   * On native, it sets the frame size of view.<br/>
   * On web, it sets the size of the canvas's outer DOM element.
   */
  set frameSize(size: SizeLike) {
    this.#frameSize.set(size);
    this.#frame!.style.width = size.width + "px";
    this.#frame!.style.height = size.height + "px";
    this.#resizeEvent();
    this.#director.setProjection(this.#director.getProjection());
  }

  get devicePixelRatio(): number {
    return this.#devicePixelRatio;
  }

  set devicePixelRatio(value: number) {
    this.#devicePixelRatio = value;
  }

  get frame(): HTMLElement | null {
    return this.#frame;
  }

  set frame(value: HTMLElement | null) {
    this.#frame = value;
  }

  get resizeWithBrowserSize(): boolean {
    return this.#resizeWithBrowserSize;
  }

  /**
   * Sets whether resize canvas automatically when browser's size changed.<br/>
   * Useful only on web.
   */
  set resizeWithBrowserSize(enabled: boolean) {
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
  set adjustViewPort(enabled: boolean) {
    this.#adjustViewPort = enabled;
  }

  /**
   * Whether the engine modifies the "viewport" meta in your web page.
   */
  get adjustViewPort(): boolean {
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
  set targetDensityDPI(densityDPI: DensityDPIValue) {
    this.#targetDensityDPI = densityDPI;
    this.#adjustViewportMeta();
  }

  /**
   * Returns the current target-densitydpi value of view.
   */
  get targetDensityDPI(): DensityDPIValue {
    return this.#targetDensityDPI;
  }

  /**
   * Orientation of the game. It can be landscape, portrait or auto.
   */
  set orientation(orientation: DeviceOrientation) {
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
  get orientation(): DeviceOrientation {
    return this.#orientation;
  }

  /**
   * Current resolution policy.
   * @see ResolutionPolicy
   */
  set resolutionPolicy(resolutionPolicy: ResolutionPolicy) {
    this.#resolutionPolicy = resolutionPolicy;
  }

  /**
   * Returns the current resolution policy.
   * @see ResolutionPolicy
   */
  get resolutionPolicy(): ResolutionPolicy | null {
    return this.#resolutionPolicy;
  }

  /**
   * Sets the name of the view.
   */
  set viewName(viewName: string) {
    if (!!viewName && this.#viewName !== viewName) {
      this.#viewName = viewName;
    }
  }

  /**
   * Returns the name of the view.
   */
  get viewName(): string {
    return this.#viewName;
  }

  /**
   * Sets the resolution translate on EGLView.
   */
  set contentTranslateLeftTop(value: PointLike) {
    this.#contentTranslateLeftTop.set(value);
  }

  /**
   * Returns the resolution translate on EGLView.
   */
  get contentTranslateLeftTop(): Point {
    return this.#contentTranslateLeftTop.clone();
  }

  /**
   * Zoom factor for frame. This property is for debugging big resolution (e.g.new ipad) app on desktop.
   */
  get frameZoomFactor(): number {
    return this.#frameZoomFactor;
  }

  /**
   * Zoom factor for frame. This property is for debugging big resolution (e.g.new ipad) app on desktop.
   */
  set frameZoomFactor(zoomFactor: number) {
    this.#frameZoomFactor = zoomFactor;
    this.#director.setProjection(this.#director.getProjection());
  }

  /**
   * Retina support is enabled by default for Apple device but disabled for other devices,<br/>
   * it takes effect only when you called setDesignResolutionPolicy<br/>
   * Only useful on web
   */
  set retinaEnabled(enabled: boolean) {
    this.#retinaEnabled = !!enabled;
  }

  /**
   * Check whether retina display is enabled.<br/>
   * Only useful on web
   */
  get retinaEnabled(): boolean {
    return this.#retinaEnabled;
  }

  /**
   * If enabled, the application will try automatically to enter full screen mode on mobile devices<br/>
   * You can pass true as parameter to enable it and disable it by passing false.<br/>
   * Only useful on web
   */
  set autoFullScreenEnabled(enabled: boolean) {
    if (
      enabled &&
      enabled !== this.#autoFullScreen &&
      this.#sys.specification.isMobile &&
      this.#frame === document.documentElement
    ) {
      // Automatically full screen when user touches on mobile version
      this.#autoFullScreen = true;
      this.#screen.autoFullScreen(this.canvas, this.#frame);
    } else {
      this.#autoFullScreen = false;
    }
  }

  /**
   * Check whether auto full screen is enabled.<br/>
   * Only useful on web
   */
  get autoFullScreenEnabled(): boolean {
    return this.#autoFullScreen;
  }

  /**
   * Get whether render system is ready(no matter opengl or canvas),<br/>
   * this name is for the compatibility with cocos2d-x, subclass must implement this method.
   */
  get openGLReady(): boolean {
    return this.#canvas !== null && !!this.#sys.rendererConfig.renderContext;
  }

  /**
   * Returns the canvas size of the view.<br/>
   * On native platforms, it returns the screen size since the view is a fullscreen view.<br/>
   * On web, it returns the size of the canvas element.
   */
  get canvasSize(): Size {
    return new Size(this.canvas);
  }

  /**
   * Returns the visible area size of the view port.
   */
  get visibleSize(): Rect {
    return this.#innerVisibleRect.clone();
  }

  /**
   * Returns the visible area size of the view port.
   */
  get visibleSizeInPixel(): Size {
    return Size.compMult(this.#innerVisibleRect, this.#scale);
  }

  /**
   * Returns the visible origin of the view port.
   */
  get visibleOrigin(): Point {
    return new Point(this.#innerVisibleRect);
  }

  /**
   * Returns the visible origin of the view port.
   */
  get visibleOriginInPixel(): Point {
    return Point.compMult(this.#innerVisibleRect, this.#scale);
  }

  /**
   * Returns whether developer can set content's scale factor.
   */
  get canSetContentScaleFactor(): boolean {
    return true;
  }

  get visibleRect(): VisibleRect {
    return this.#visibleRect;
  }

  /**
   * Returns the designed size for the view.
   * Default resolution size is the same as frameSize.
   */
  get designResolutionSize(): Size {
    return this.#designResolution.clone();
  }

  /**
   * Returns whether GL_SCISSOR_TEST is enable
   */
  get scissorEnabled(): boolean {
    return (
      this.#sys.rendererConfig.renderContext as RendererConfigRenderContext
    ).isEnabled(gl.SCISSOR_TEST);
  }

  /**
   * Returns the current scissor rectangle
   */
  get scissorRect(): Rect {
    this.#checkScissorRect();

    const pos = Point.compDivIn(
      Point.sub(this.#scissorRect, this.#viewPortRect),
      this.#scale
    );
    const size = Size.compDiv(this.#scissorRect, this.#scale);

    return new Rect(pos, size);
  }

  /**
   * Returns the view port rectangle.
   */
  get viewPortRect(): Rect {
    return this.#viewPortRect;
  }

  /**
   * Returns scale factor of the horizontal direction (X axis).
   */
  get scaleX(): number {
    return this.#scale.x;
  }

  /**
   * Returns scale factor of the vertical direction (Y axis).
   */
  get scaleY(): number {
    return this.#scale.y;
  }

  get canvas(): HTMLCanvasElement {
    return this.#canvas!;
  }

  get container(): HTMLElement {
    return this.#container!;
  }
}
