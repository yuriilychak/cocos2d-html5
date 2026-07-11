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

import { BaseClass } from "../platform/class";
import EventHelper from "../event-manager/event-helper";
import { Rect, Size } from "../geometry";
import type { SizeLike } from "../geometry";
import CanvasTextureRenderer from "./texture-2d-canvas-renderer";
import WebGLTextureRenderer from "./texture-2d-webgl-renderer";
import { contentScaleFactor } from "../platform/macro/utils";
import { PIXEL_FORMAT } from "../enums";
import type Texture2DRenderer from "./texture-2d-renderer";
import type { Texture2DInterface, TextureElement } from "./types";

export { defaultPixelFormat, PIXEL_FORMAT_NAMES, PIXEL_FORMAT_BITS } from "./constants";

import { ServiceLocator } from "../service-locator";

const Texture2DEventBase = EventHelper(BaseClass) as typeof BaseClass;

/**
 * <p>
 * This class allows to easily create OpenGL or Canvas 2D textures from images, text or raw data.                                    <br/>
 * The created Texture2D object will always have power-of-two dimensions.                                                <br/>
 * Depending on how you create the Texture2D object, the actual image area of the texture might be smaller than the texture dimensions <br/>
 *  i.e. "contentSize" != (pixelsWide, pixelsHigh) and (maxS, maxT) != (1.0, 1.0).                                           <br/>
 * Be aware that the content of the generated textures will be upside-down! </p>
 * @name Texture2D
 */
export class Texture2D extends Texture2DEventBase implements Texture2DInterface {
  #contentSize = new Size();
  #pixelSize = new Size();
  #renderer: Texture2DRenderer;
  #loaded = false;
  #htmlElement: TextureElement | null = null;
  #channelCache: HTMLCanvasElement[] | null = null;
  #pattern = "";
  #url: string | null = null;

  declare removeEventTarget: (type: string, target: unknown) => void;
  declare dispatchEvent: (event: string, clearAfterDispatch?: boolean) => void;

  constructor() {
    super();

    this.#renderer = this.#createRenderer();
  }

  initWithElement(element: TextureElement | null): boolean {
    if (element) {
      this.htmlElement = element;
    }

    return !!element;
  }

  releaseElement(): void {
    this.#htmlElement = null;
    this.#channelCache = null;
  }

  initWithData(
    data: ArrayBufferView | null,
    pixelFormat: PIXEL_FORMAT,
    pixelsWide: number,
    pixelsHigh: number,
    contentSize: SizeLike
  ): boolean {
    this.#ensureRenderer();
    const initialized = this.#renderer.initWithData(
      data,
      pixelFormat,
      pixelsWide,
      pixelsHigh,
      contentSize
    );
    if (initialized) {
      this.#loaded = true;
    }
    return initialized;
  }

  initWithImage(uiImage: unknown): boolean {
    this.#ensureRenderer();
    const initialized = this.#renderer.initWithImage(uiImage);
    if (initialized) {
      this.#loaded = true;
    }
    return !!initialized;
  }

  releaseTexture(): void {
    this.#renderer.releaseTexture();

    ServiceLocator.loader.release(this.url);
  }

  resetSize(clearHtmlObject: boolean): void {
    if (this.#htmlElement === null) {
      return;
    }

    this.#pixelSize.set(this.#htmlElement);
    this.#contentSize.set(this.#htmlElement);
    this.#loaded = true;

    if (clearHtmlObject) {
      this.#htmlElement = null;
    }

    this.dispatchEvent("load");
  }

  removeLoadedEventListener(target: unknown): void {
    this.removeEventTarget("load", target);
  }

  #createRenderer(): Texture2DRenderer {
    return ServiceLocator.sys.rendererConfig.isCanvas
      ? new CanvasTextureRenderer(this)
      : new WebGLTextureRenderer(this);
  }

  #ensureRenderer(): void {
    const needsCanvasRenderer = ServiceLocator.sys.rendererConfig.isCanvas;
    if (
      (needsCanvasRenderer &&
        this.#renderer instanceof CanvasTextureRenderer) ||
      (!needsCanvasRenderer && this.#renderer instanceof WebGLTextureRenderer)
    ) {
      return;
    }

    this.#renderer = this.#createRenderer();
    if (this.#htmlElement) {
      this.#renderer.initWithElement();
    }
  }

  get contentSize(): Size {
    return this.#contentSize.clone();
  }

  set contentSize(value: SizeLike) {
    this.#contentSize.set(value);
  }

  get pixelSize(): Size {
    return this.#pixelSize.clone();
  }

  set pixelSize(value: SizeLike) {
    this.#pixelSize.set(value);
  }

  get htmlElement(): TextureElement | null {
    return this.#htmlElement;
  }

  set htmlElement(element: TextureElement | null) {
    if (!element) {
      return;
    }

    this.#htmlElement = element;
    this.#pixelSize.set(element);
    this.#contentSize.set(element);
    this.#loaded = true;
    this.#channelCache = null;

    this.#ensureRenderer();
    this.#renderer.initWithElement();
  }

  get channelCache(): HTMLCanvasElement[] {
    if (!this.#channelCache) {
      this.#channelCache = [
        document.createElement("canvas"),
        document.createElement("canvas"),
        document.createElement("canvas"),
        document.createElement("canvas")
      ];
    }

    return this.#channelCache;
  }

  get loaded(): boolean {
    return this.#loaded;
  }

  /**
   * Texture renderer. Renderer-owned properties include webTexture, pixelFormat,
   * shaderProgram, maxS, and maxT.
   */
  get renderer(): Texture2DRenderer {
    this.#ensureRenderer();
    return this.#renderer;
  }

  /**
   * Width in pixels.
   */
  get pixelsWidth(): number {
    return this.#pixelSize.width;
  }

  /**
   * Height in pixels.
   */
  get pixelsHeight(): number {
    return this.#pixelSize.height;
  }

  /**
   * Content width in points.
   */
  get width(): number {
    return this.#contentSize.width / contentScaleFactor();
  }

  /**
   * Content height in points.
   */
  get height(): number {
    return this.#contentSize.height / contentScaleFactor();
  }

  get rect(): Rect {
    return new Rect(0, 0, this.width, this.height);
  }

  get pattern(): string {
    return this.#pattern;
  }

  set pattern(value: string) {
    this.#pattern = value;
  }

  get url(): string | null {
    return this.#url;
  }

  set url(value: string | null) {
    this.#url = value;
  }
}
