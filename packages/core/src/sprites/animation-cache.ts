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

import Path from "../boot/path";
import { log, assert, _LogInfos } from "../boot/debugger";
import { REPEAT_FOREVER } from "../platform/macro/constants";
import AnimationFrame from "./animation/animation-frame";
import Animation from "./animation/animation";
import type Loader from "../boot/loader/loader";
import type SpriteFrameCache from "./sprite-frame-cache";

type AnimationFrameDefinition = {
  spriteframe: string;
  delayUnits?: string | number;
  notification?: unknown;
};

type AnimationDefinition = {
  frames?: string[] | AnimationFrameDefinition[];
  delay?: string | number;
  loop?: boolean;
  loops?: string | number;
  restoreOriginalFrame?: boolean;
  delayPerUnit?: string | number;
};

type AnimationDictionary = {
  animations?: Record<string, AnimationDefinition>;
  properties?: {
    format?: string | number | null;
    spritesheets?: string[];
  };
};

/**
 * <p>
 *     AnimationCache is a singleton object that manages the Animations.<br/>
 *     It saves in a cache the animations. You should use this class if you want to save your animations in a cache.<br/>
 * <br/>
 * example<br/>
 * ServiceLocator.animationCache.set("animation1", animation);<br/>
 * </p>
 */
export default class AnimationCache {
  #loader: Loader;
  #spriteFrameCache: SpriteFrameCache;
  #animations = new Map<string, Animation>();

  constructor(loader: Loader, spriteFrameCache: SpriteFrameCache) {
    this.#loader = loader;
    this.#spriteFrameCache = spriteFrameCache;
  }

  set(name: string, animation: Animation): this {
    this.#animations.set(name, animation);
    return this;
  }

  delete(name: string): boolean {
    return this.#animations.delete(name);
  }

  get(name: string): Animation | null {
    return this.#animations.get(name) || null;
  }

  clear(): void {
    this.#animations.clear();
  }

  addAnimations(plist: string): void {
    assert(plist, _LogInfos.animationCache_addAnimations_2);

    const dict = this.#loader.get<AnimationDictionary>(plist);
    if (!dict) {
      log(_LogInfos.animationCache_addAnimations);
      return;
    }

    this.#addAnimationsWithDictionary(dict, plist);
  }

  #addAnimationsWithDictionary(
    dictionary: AnimationDictionary,
    plist: string
  ): void {
    const animations = dictionary.animations;
    if (!animations) {
      log(_LogInfos.animationCache__addAnimationsWithDictionary);
      return;
    }

    let version = 1;
    const properties = dictionary.properties;
    if (properties) {
      version =
        properties.format != null ? parseInt(String(properties.format)) : version;
      const spritesheets = properties.spritesheets || [];
      for (let i = 0; i < spritesheets.length; i++) {
        this.#spriteFrameCache.addSpriteFrames(
          Path.changeBasename(plist, spritesheets[i])
        );
      }
    }

    switch (version) {
      case 1:
        this.#parseVersion1(animations);
        break;
      case 2:
        this.#parseVersion2(animations);
        break;
      default:
        log(_LogInfos.animationCache__addAnimationsWithDictionary_2);
        break;
    }
  }

  #parseVersion1(animations: Record<string, AnimationDefinition>): void {
    for (const key in animations) {
      const animationDict = animations[key];
      const frameNames = animationDict.frames;
      const delay = parseFloat(String(animationDict.delay ?? 0)) || 0;

      if (!frameNames || !frameNames.every((frame): frame is string => typeof frame === "string")) {
        log(_LogInfos.animationCache__parseVersion1, key);
        continue;
      }

      const frames: AnimationFrame[] = [];
      for (let i = 0; i < frameNames.length; i++) {
        const spriteFrame = this.#spriteFrameCache.get(frameNames[i]);
        if (!spriteFrame) {
          log(_LogInfos.animationCache__parseVersion1_2, key, frameNames[i]);
          continue;
        }

        frames.push(new AnimationFrame(spriteFrame, 1));
      }

      if (frames.length === 0) {
        log(_LogInfos.animationCache__parseVersion1_3, key);
        continue;
      }

      if (frames.length !== frameNames.length) {
        log(_LogInfos.animationCache__parseVersion1_4, key);
      }

      this.set(key, new Animation(frames, delay, 1));
    }
  }

  #parseVersion2(animations: Record<string, AnimationDefinition>): void {
    for (const key in animations) {
      const animationDict = animations[key];
      const isLoop = animationDict.loop;
      const loopsTemp = parseInt(String(animationDict.loops ?? NaN));
      const loops = isLoop ? REPEAT_FOREVER : isNaN(loopsTemp) ? 1 : loopsTemp;
      const restoreOriginalFrame = animationDict.restoreOriginalFrame === true;
      const frameArray = animationDict.frames;

      if (
        !frameArray ||
        !frameArray.every(
          (entry): entry is AnimationFrameDefinition =>
            typeof entry !== "string" && typeof entry.spriteframe === "string"
        )
      ) {
        log(_LogInfos.animationCache__parseVersion2, key);
        continue;
      }

      const frames: AnimationFrame[] = [];
      for (let i = 0; i < frameArray.length; ++i) {
        const entry = frameArray[i];
        const spriteFrame = this.#spriteFrameCache.get(entry.spriteframe);
        if (!spriteFrame) {
          log(_LogInfos.animationCache__parseVersion2_2, key, entry.spriteframe);
          continue;
        }

        const delayUnits = parseFloat(String(entry.delayUnits ?? 0)) || 0;
        frames.push(new AnimationFrame(spriteFrame, delayUnits, entry.notification));
      }

      const delayPerUnit =
        parseFloat(String(animationDict.delayPerUnit ?? 0)) || 0;
      this.set(key, new Animation(frames, delayPerUnit, loops, restoreOriginalFrame));
    }
  }
}
