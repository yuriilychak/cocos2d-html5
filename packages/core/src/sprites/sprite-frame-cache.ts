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

import { Point, Rect, Size } from "../geometry";
import Path from "../boot/path";
import { log, assert, _LogInfos } from "../boot/debugger";
import { Texture2D } from "../textures/texture-2d";
import { SpriteFrame } from "./sprite-frame";
import { Sprite } from "./sprite";
import { PolygonInfo } from "./polygon-info";
import { isString } from "../boot/utils";
import type { Sys } from "../sys";
import type { Loader } from "../boot";
import type { TextureCache } from "../textures";

type FrameConfig = {
  frames: Record<string, any>;
  meta: { image?: string; [key: string]: any };
  _inited: boolean;
};

export default class SpriteFrameCache {
  static #CCNS_REG1: RegExp =
    /^\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*$/;
  static #CCNS_REG2: RegExp =
    /^\s*\{\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*,\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*\}\s*$/;

  #sys: Sys;
  #loader: Loader;
  #textureCache: TextureCache;
  #spriteFrames = new Map<string, SpriteFrame>();
  #spriteFramesAliases = new Map<string, string>();
  #frameConfigCache = new Map<string, FrameConfig>();

  constructor(sys: Sys, loader: Loader, textureCache: TextureCache) {
    this.#sys = sys;
    this.#loader = loader;
    this.#textureCache = textureCache;
  }

  addSpriteFrames(url: string, texture?: string | Texture2D): void {
    assert(url, _LogInfos.spriteFrameCache_addSpriteFrames_2);

    const dict = this.#frameConfigCache.get(url) || this.#loader.get(url);
    if (!dict || !dict.frames) return;

    const frameConfig = this.#frameConfigCache.get(url) || this.#getFrameConfig(url);
    this.#createSpriteFrames(url, frameConfig, texture);
  }

  removeSpriteFrames(): void {
    this.#spriteFrames.clear();
    this.#spriteFramesAliases.clear();
  }

  removeSpriteFramesFromFile(url: string): void {
    const cfg = this.#frameConfigCache.get(url);
    if (!cfg) return;

    for (const key in cfg.frames) {
      if (this.#spriteFrames.has(key)) {
        this.#spriteFrames.delete(key);
        for (const [alias, frameKey] of this.#spriteFramesAliases) {
          if (frameKey === key) this.#spriteFramesAliases.delete(alias);
        }
      }
    }
  }

  removeSpriteFramesFromTexture(texture: unknown): void {
    for (const [key, frame] of this.#spriteFrames) {
      if (frame.texture === texture) {
        this.#spriteFrames.delete(key);
        for (const [alias, frameKey] of this.#spriteFramesAliases) {
          if (frameKey === key) this.#spriteFramesAliases.delete(alias);
        }
      }
    }
  }

  set(frameName: string, frame: SpriteFrame): this {
    this.#spriteFrames.set(frameName, frame);
    return this;
  }

  get(name: string): SpriteFrame | null {
    if(this.#spriteFrames.has(name)) {
      return this.#spriteFrames.get(name)!;
    }

    if(!this.#spriteFramesAliases.has(name)) {
      return null;
    }

    const key = this.#spriteFramesAliases.get(name)!;

    if(!this.#spriteFrames.has(key)) {
      this.#spriteFramesAliases.delete(name);

      return null;
    }

    return this.#spriteFrames.get(key)!;
  }

  has(name: string): boolean {
    if(this.#spriteFrames.has(name)) {
      return true;
    }

    if(!this.#spriteFramesAliases.has(name)) {
      return false;
    }

    const key = this.#spriteFramesAliases.get(name)!;

    if(!this.#spriteFrames.has(key)) {
      this.#spriteFramesAliases.delete(name);

      return false;
    }

    return true;
  }

  delete(name: string): boolean {
    if (!name) return false;
    const aliasDeleted = this.#spriteFramesAliases.delete(name);
    const frameDeleted = this.#spriteFrames.delete(name);
    return aliasDeleted || frameDeleted;
  }

  clear(): void {
    this.#spriteFrames.clear();
    this.#spriteFramesAliases.clear();
    this.#frameConfigCache.clear();
  }

  #rectFromString(content: string): Rect {
    const result = SpriteFrameCache.#CCNS_REG2.exec(content);
    if (!result) return new Rect();
    return new Rect(
      parseFloat(result[1]),
      parseFloat(result[2]),
      parseFloat(result[3]),
      parseFloat(result[4])
    );
  }

  #pointFromString(content: string): Point {
    const result = SpriteFrameCache.#CCNS_REG1.exec(content);
    if (!result) return new Point();
    return new Point(parseFloat(result[1]), parseFloat(result[2]));
  }

  #sizeFromString(content: string): Size {
    const result = SpriteFrameCache.#CCNS_REG1.exec(content);
    if (!result) return new Size();
    return new Size(parseFloat(result[1]), parseFloat(result[2]));
  }

  #parseNumberList(content: string | number[]): number[] {
    if (!content) return [];
    if (Array.isArray(content)) return content.map(Number);
    return content
      .replace(/[\{\}\[\]\(\),]/g, " ")
      .split(/\s+/)
      .filter((value) => value.length > 0)
      .map(parseFloat)
      .filter((value) => !isNaN(value));
  }

  #getFrameConfig(url: string): FrameConfig {
    const dict = this.#loader.get<FrameConfig>(url);
    assert(dict, _LogInfos.spriteFrameCache__getFrameConfig_2, url);
    this.#loader.release(url);

    if (dict && dict._inited) {
      this.#frameConfigCache.set(url, dict);
      return dict;
    }

    const frameConfig = this.#parseFrameConfig(dict);
    this.#frameConfigCache.set(url, frameConfig);
    return frameConfig;
  }

  #parseFrameConfig(dict: any): FrameConfig {
    const tempFrames = dict.frames;
    const tempMeta = dict.metadata || dict.meta;
    const frames: Record<string, any> = {};
    const meta: { image?: string; [key: string]: any } = {};
    let format = 0;

    if (tempMeta) {
      const tmpFormat = tempMeta.format;
      format = tmpFormat.length <= 1 ? parseInt(tmpFormat) : tmpFormat;
      meta.image = tempMeta.textureFileName || tempMeta.textureFileName || tempMeta.image;
    }

    for (let key in tempFrames) {
      const frameDict = tempFrames[key];
      if (!frameDict) continue;
      const tempFrame: any = {};

      if (format === 0) {
        tempFrame.rect = new Rect(
          frameDict.x,
          frameDict.y,
          frameDict.width,
          frameDict.height
        );
        tempFrame.rotated = false;
        tempFrame.offset = new Point(frameDict.offsetX, frameDict.offsetY);
        let ow = frameDict.originalWidth;
        let oh = frameDict.originalHeight;
        if (!ow || !oh) log(_LogInfos.spriteFrameCache__getFrameConfig);
        ow = Math.abs(ow);
        oh = Math.abs(oh);
        tempFrame.size = new Size(ow, oh);
      } else if (format === 1 || format === 2) {
        tempFrame.rect = this.#rectFromString(frameDict.frame);
        tempFrame.rotated = frameDict.rotated || false;
        tempFrame.offset = this.#pointFromString(frameDict.offset);
        tempFrame.size = this.#sizeFromString(frameDict.sourceSize);
      } else if (format === 3) {
        const spriteSize = this.#sizeFromString(frameDict.spriteSize);
        let textureRect = this.#rectFromString(frameDict.textureRect);
        if (spriteSize) {
          textureRect = new Rect(
            textureRect.x,
            textureRect.y,
            spriteSize.width,
            spriteSize.height
          );
        }
        tempFrame.rect = textureRect;
        tempFrame.rotated = frameDict.textureRotated || false;
        tempFrame.offset = this.#pointFromString(frameDict.spriteOffset);
        tempFrame.size = this.#sizeFromString(frameDict.spriteSourceSize);
        tempFrame.aliases = frameDict.aliases;

        const polyVerts = frameDict.vertices;
        const polyUVs = frameDict.verticesUV;
        const polyIdx = frameDict.triangles;
        if (polyVerts && polyUVs && polyIdx) {
          tempFrame.polygon = {
            vertices: this.#parseNumberList(polyVerts),
            verticesUV: this.#parseNumberList(polyUVs),
            triangles: this.#parseNumberList(polyIdx)
          };
        }
      } else {
        const tmpFrame = frameDict.frame;
        const tmpSourceSize = frameDict.sourceSize;
        key = frameDict.filename || key;
        tempFrame.rect = new Rect(tmpFrame.x, tmpFrame.y, tmpFrame.w, tmpFrame.h);
        tempFrame.rotated = frameDict.rotated || false;
        tempFrame.offset = new Point();
        tempFrame.size = new Size(tmpSourceSize.w, tmpSourceSize.h);
      }
      frames[key] = tempFrame;
    }

    return { _inited: true, frames, meta };
  }

  #createSpriteFrames(url: string, frameConfig: FrameConfig, texture?: string | Texture2D): void {
    const frames = frameConfig.frames;
    const meta = frameConfig.meta;
    let loadedTexture = texture;

    if (!loadedTexture) {
      const texturePath = Path.changeBasename(url, meta.image || ".png");
      loadedTexture = this.#textureCache.addImage(texturePath);
    } else if (loadedTexture instanceof Texture2D) {
      // Already loaded or loading.
    } else if (isString(loadedTexture)) {
      loadedTexture = this.#textureCache.addImage(loadedTexture);
    } else {
      assert(0, _LogInfos.spriteFrameCache_addSpriteFrames_3);
    }

    for (const key in frames) {
      const frame = frames[key];
      let spriteFrame = this.#spriteFrames.get(key);
      if (spriteFrame) continue;

      spriteFrame = new SpriteFrame(
        loadedTexture as string | Texture2D,
        new Rect(frame.rect),
        frame.rotated,
        frame.offset,
        frame.size
      );

      if (frame.polygon) {
        const rawVerts = frame.polygon.vertices;
        const rawUVs = frame.polygon.verticesUV;
        let trimOffX = 0;
        let trimOffY = 0;
        if (rawVerts.length >= 2 && rawUVs.length >= 2) {
          trimOffX = rawVerts[0] - (rawUVs[0] - frame.rect.x);
          trimOffY = rawVerts[1] - (rawUVs[1] - frame.rect.y);
        }
        let normVerts = rawVerts;
        if (trimOffX !== 0 || trimOffY !== 0) {
          normVerts = new Array(rawVerts.length);
          for (let i = 0; i < rawVerts.length; i += 2) {
            normVerts[i] = rawVerts[i] - trimOffX;
            normVerts[i + 1] = rawVerts[i + 1] - trimOffY;
          }
        }
        spriteFrame.polygonInfo = PolygonInfo.fromFlatArrays(
          normVerts,
          frame.polygon.verticesUV,
          frame.polygon.triangles,
          frame.rect
        );
      }

      if (frame.aliases) {
        for (const alias of frame.aliases) {
          if (this.#spriteFramesAliases.has(alias)) {
            log(_LogInfos.spriteFrameCache_addSpriteFrames, alias);
          }
          this.#spriteFramesAliases.set(alias, key);
        }
      }

      if (this.#sys.rendererConfig.isCanvas && spriteFrame.rotated) {
        const locTexture = spriteFrame.texture;
        if (locTexture) {
          let tempElement = locTexture.htmlElement;
          tempElement = (Sprite as any).CanvasRenderCmd._cutRotateImageToCanvas(
            tempElement,
            spriteFrame.rectInPixels
          );
          const tempTexture = new Texture2D();
          tempTexture.htmlElement = tempElement;
          tempTexture.renderer.handleLoadedTexture();
          spriteFrame.texture = tempTexture;
          spriteFrame.rotated = false;

          const rect = spriteFrame.rect;
          spriteFrame.rect = new Rect(0, 0, rect.width, rect.height);
        }
      }
      this.#spriteFrames.set(key, spriteFrame);
    }
  }
}
