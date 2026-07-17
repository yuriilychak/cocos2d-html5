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
import { Point, Rect, Size } from "../geometry";
import type { PointLike, RectLike, SizeLike } from "../geometry";
import { error, _LogInfos } from "../boot/debugger";
import { Texture2D } from "../textures/texture-2d";
import {
  rectPixelsToPoints,
  rectPointsToPixels,
  pointPointsToPixels,
  _pointPixelsToPointsOut,
  _sizePixelsToPointsOut,
  sizePointsToPixels
} from "../platform/macro/utils";
import { SpriteCanvasRenderCmd } from "./sprite-canvas-render-cmd";
import { PolygonInfo } from "./polygon-info";
import { ServiceLocator } from "../service-locator";

const SpriteFrameEventBase = EventHelper(BaseClass);

export class SpriteFrame extends SpriteFrameEventBase {
  #offset = new Point();
  #originalSize = new Size();
  #rectInPixels = new Rect();
  #rotated = false;
  #rect = new Rect();
  #offsetInPixels = new Point();
  #originalSizeInPixels = new Size();
  #texture: Texture2D | null = null;
  #textureFilename = "";
  #textureLoaded = false;
  #polygonInfo: PolygonInfo | null = null;

  constructor();
  constructor(
    texture: string | Texture2D,
    rect: RectLike,
    rotated?: boolean,
    offset?: PointLike,
    originalSize?: SizeLike
  );
  constructor(
    texture?: string | Texture2D,
    rect?: RectLike,
    rotated?: boolean,
    offset?: PointLike,
    originalSize?: SizeLike
  ) {
    super();

    if (texture !== undefined && rect !== undefined) {
      if (rotated === undefined || offset === undefined || originalSize === undefined) {
        this.initWithTexture(texture, rect);
      } else {
        this.initWithTexture(texture, rect, rotated, offset, originalSize);
      }
    }
  }

  clone(): SpriteFrame {
    const frame = new SpriteFrame();
    frame.initWithTexture(
      this.#textureFilename,
      this.#rectInPixels,
      this.#rotated,
      this.#offsetInPixels,
      this.#originalSizeInPixels
    );
    if (this.#texture) {
      frame.texture = this.#texture;
    }

    if (this.#polygonInfo) {
      frame.polygonInfo = this.#polygonInfo;
    }
    return frame;
  }

  initWithTexture(texture: string | Texture2D, rect: RectLike): boolean;
  initWithTexture(
    texture: string | Texture2D,
    rect: RectLike,
    rotated: boolean,
    offset: PointLike,
    originalSize: SizeLike
  ): boolean;
  initWithTexture(
    texture: string | Texture2D,
    rect: RectLike,
    rotated?: boolean,
    offset?: PointLike,
    originalSize?: SizeLike
  ): boolean {
    if (arguments.length === 2) {
      rect = rectPointsToPixels(rect as Rect);
    }

    offset = offset || new Point();
    originalSize = originalSize || rect;
    rotated = rotated || false;

    if (typeof texture === "string") {
      this.#texture = null;
      this.#textureFilename = texture;
    } else {
      this.texture = texture;
    }

    const loadedTexture = this.texture;
    this.rectInPixels = rect;

    if (loadedTexture && loadedTexture.url && loadedTexture.loaded) {
      const x = rect.x + (rotated ? rect.height : rect.width);
      const y = rect.y + (rotated ? rect.width : rect.height);

      if (x > loadedTexture.pixelsWidth) {
        error(_LogInfos.RectWidth, loadedTexture.url);
      }
      if (y > loadedTexture.pixelsHeight) {
        error(_LogInfos.RectHeight, loadedTexture.url);
      }
    }

    this.offsetInPixels = offset;
    this.originalSizeInPixels = originalSize;
    this.#rotated = rotated;
    return true;
  }

  static _frameWithTextureForCanvas(
    texture: Texture2D,
    rect: RectLike,
    rotated: boolean,
    offset: PointLike,
    originalSize: SizeLike
  ): SpriteFrame {
    const spriteFrame = new SpriteFrame();
    spriteFrame.texture = texture;
    spriteFrame.rectInPixels = rect;
    spriteFrame.offsetInPixels = offset;
    spriteFrame.originalSizeInPixels = originalSize;
    spriteFrame.rotated = rotated;
    return spriteFrame;
  }

  get textureLoaded(): boolean { return this.#textureLoaded; }

  get rectInPixels(): Rect { return this.#rectInPixels.clone(); }
  set rectInPixels(rectInPixels: RectLike) {
    this.#rectInPixels.set(rectInPixels);
    this.#rect.set(rectPixelsToPoints(rectInPixels as Rect));
  }

  get rotated(): boolean { return this.#rotated; }
  set rotated(value: boolean) { this.#rotated = value; }

  get rect(): Rect { return this.#rect.clone(); }
  set rect(rect: RectLike) {
    this.#rect.set(rect);
    this.#rectInPixels.set(rectPointsToPixels(this.#rect));
  }

  get offsetInPixels(): Point { return this.#offsetInPixels.clone(); }
  set offsetInPixels(offsetInPixels: PointLike) {
    this.#offsetInPixels.set(offsetInPixels);
    _pointPixelsToPointsOut(this.#offsetInPixels, this.#offset);
  }

  get originalSizeInPixels(): Size { return this.#originalSizeInPixels.clone(); }
  set originalSizeInPixels(sizeInPixels: SizeLike) {
    this.#originalSizeInPixels.set(sizeInPixels);
    _sizePixelsToPointsOut(this.#originalSizeInPixels, this.#originalSize);
  }

  get originalSize(): Size { return this.#originalSize.clone(); }
  set originalSize(size: SizeLike) {
    this.#originalSize.set(size);
    this.#originalSizeInPixels.set(sizePointsToPixels(this.#originalSize));
  }

  get texture(): Texture2D | null {
    if (this.#texture) return this.#texture;
    if (this.#textureFilename !== "") {
      const texture = ServiceLocator.textureCache.addImage(this.#textureFilename) as Texture2D | null;
      if (texture) this.#textureLoaded = texture.loaded;
      return texture;
    }
    return null;
  }

  set texture(texture: Texture2D | null) {
    if (this.#texture === texture) return;
    if (!texture) {
      this.#texture = null;
      this.#textureLoaded = false;
      return;
    }

    this.#textureLoaded = texture.loaded;
    this.#texture = texture;
    if (!texture.loaded) {
      texture.addEventListener("load", (sender) => {
        const loadedTexture = sender as Texture2D;
        this.#textureLoaded = true;
        if (this.#rotated && ServiceLocator.sys.rendererConfig.isCanvas) {
          let tempElement = loadedTexture.htmlElement;
          tempElement = SpriteCanvasRenderCmd._cutRotateImageToCanvas(tempElement, this.rect);
          const tempTexture = new Texture2D();
          tempTexture.htmlElement = tempElement;
          tempTexture.renderer.handleLoadedTexture();
          this.texture = tempTexture;
          this.rect = new Rect(0, 0, this.#rect.width, this.#rect.height);
        }

        if (this.#rect.width === 0 && this.#rect.height === 0) {
          this.rect = new Rect(0, 0, loadedTexture.width, loadedTexture.height);
          this.originalSize = loadedTexture;
        }
        this.dispatchEvent("load");
      }, this);
    }
  }

  get offset(): Point { return this.#offset.clone(); }
  set offset(offsets: PointLike) {
    this.#offset.set(offsets);
    this.#offsetInPixels.set(pointPointsToPixels(this.#offset));
  }

  get polygonInfo(): PolygonInfo | null { return this.#polygonInfo; }
  set polygonInfo(polygonInfo: PolygonInfo | null) { this.#polygonInfo = polygonInfo || null; }

  get hasPolygonInfo(): boolean {
    return !!(
      this.#polygonInfo &&
      this.#polygonInfo.triangles &&
      this.#polygonInfo.triangles.verts.length > 0 &&
      this.#polygonInfo.triangles.indices.length > 0
    );
  }
}
