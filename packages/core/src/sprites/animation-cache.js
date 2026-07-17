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

import Path from '../boot/path';
import { log, assert, _LogInfos } from '../boot/debugger';
import { REPEAT_FOREVER } from "../platform/macro/constants";
import { AnimationFrame } from "./animation/animation-frame";
import { Animation } from "./animation/animation";

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
  #loader;
  #spriteFrameCache;
  #animations = new Map();

  constructor(loader, spriteFrameCache) {
    this.#loader = loader;
    this.#spriteFrameCache = spriteFrameCache;
  }

  /**
   * Adds or replaces an Animation with a name.
   * @param {String} name
   * @param {Animation} animation
   */
  set(name, animation) {
    this.#animations.set(name, animation);
    return this;
  }

  /**
   * Deletes an Animation from the cache.
   * @param {String} name
   */
  delete(name) {
    return this.#animations.delete(name);
  }

  /**
   * <p>
   *     Returns an Animation that was previously added.<br/>
   *      If the name is not found it will return nil.<br/>
   *      You should retain the returned copy if you are going to use it.</br>
   * </p>
   * @param {String} name
   * @return {Animation | null}
   */
  get(name) {
    return this.#animations.get(name) || null;
  }

  clear() {
    this.#animations.clear();
  }

  /**
   * <p>
   *    Adds an animations from a plist file.<br/>
   *    Make sure that the frames were previously loaded in the SpriteFrameCache.
   * </p>
   * @param {String} plist
   */
  addAnimations(plist) {
    assert(plist, _LogInfos.animationCache_addAnimations_2);

    const dict = this.#loader.get(plist);

    if (!dict) {
      log(_LogInfos.animationCache_addAnimations);
      return;
    }

    this.#addAnimationsWithDictionary(dict, plist);
  }

  #addAnimationsWithDictionary(dictionary, plist) {
    const animations = dictionary["animations"];
    if (!animations) {
      log(_LogInfos.animationCache__addAnimationsWithDictionary);
      return;
    }

    let version = 1;
    const properties = dictionary["properties"];
    if (properties) {
      version =
        properties["format"] != null ? parseInt(properties["format"]) : version;
      const spritesheets = properties["spritesheets"];
      const spriteFrameCache = this.#spriteFrameCache;
      for (let i = 0; i < spritesheets.length; i++) {
        spriteFrameCache.addSpriteFrames(
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

  #parseVersion1(animations) {
    const frameCache = this.#spriteFrameCache;

    for (const key in animations) {
      const animationDict = animations[key];
      const frameNames = animationDict["frames"];
      const delay = parseFloat(animationDict["delay"]) || 0;
      let animation = null;
      if (!frameNames) {
        log(_LogInfos.animationCache__parseVersion1, key);
        continue;
      }

      const frames = [];
      for (let i = 0; i < frameNames.length; i++) {
        const spriteFrame = frameCache.getSpriteFrame(frameNames[i]);
        if (!spriteFrame) {
          log(_LogInfos.animationCache__parseVersion1_2, key, frameNames[i]);
          continue;
        }
        const animFrame = new AnimationFrame();
        animFrame.initWithSpriteFrame(spriteFrame, 1, null);
        frames.push(animFrame);
      }

      if (frames.length === 0) {
        log(_LogInfos.animationCache__parseVersion1_3, key);
        continue;
      } else if (frames.length !== frameNames.length) {
        log(_LogInfos.animationCache__parseVersion1_4, key);
      }
      animation = new Animation(frames, delay, 1);
      this.set(key, animation);
    }
  }

  #parseVersion2(animations) {
    const frameCache = this.#spriteFrameCache;

    for (const key in animations) {
      const animationDict = animations[key];

      const isLoop = animationDict["loop"];
      const loopsTemp = parseInt(animationDict["loops"]);
      const loops = isLoop ? REPEAT_FOREVER : isNaN(loopsTemp) ? 1 : loopsTemp;
      const restoreOriginalFrame =
        animationDict["restoreOriginalFrame"] &&
        animationDict["restoreOriginalFrame"] == true
          ? true
          : false;
      const frameArray = animationDict["frames"];

      if (!frameArray) {
        log(_LogInfos.animationCache__parseVersion2, key);
        continue;
      }

      //Array of AnimationFrames
      const arr = [];
      for (let i = 0; i < frameArray.length; i++) {
        const entry = frameArray[i];
        const spriteFrameName = entry["spriteframe"];
        const spriteFrame = frameCache.getSpriteFrame(spriteFrameName);
        if (!spriteFrame) {
          log(_LogInfos.animationCache__parseVersion2_2, key, spriteFrameName);
          continue;
        }

        const delayUnits = parseFloat(entry["delayUnits"]) || 0;
        const userInfo = entry["notification"];
        const animFrame = new AnimationFrame();
        animFrame.initWithSpriteFrame(spriteFrame, delayUnits, userInfo);
        arr.push(animFrame);
      }

      const delayPerUnit = parseFloat(animationDict["delayPerUnit"]) || 0;
      const animation = new Animation();
      animation.initWithAnimationFrames(arr, delayPerUnit, loops);
      animation.setRestoreOriginalFrame(restoreOriginalFrame);
      this.set(key, animation);
    }
  }
}
