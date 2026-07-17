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

import { BaseClass } from "../../platform/class";
import AnimationFrame from "./animation-frame";
import { SpriteFrame } from "../sprite-frame";
import { Rect } from "../../geometry";
import { arrayVerifyType } from "../../platform/macro/utils";
import { ServiceLocator } from "../../service-locator";
import type { RectLike } from "../../geometry";
import type { Texture2D } from "../../textures/texture-2d";

type AnimationInputFrame = SpriteFrame | AnimationFrame;

export default class Animation extends BaseClass {
  #frames: AnimationFrame[];
  #loops = 0;
  #restoreOriginalFrame = false;
  #duration = 0;
  #delayPerUnit = 0;
  #totalDelayUnits = 0;

  constructor();
  constructor(
    frames: SpriteFrame[],
    delay?: number,
    loops?: number,
    restoreOriginalFrame?: boolean
  );
  constructor(
    frames: AnimationFrame[],
    delay?: number,
    loops?: number,
    restoreOriginalFrame?: boolean
  );
  constructor(
    inputFrames: AnimationInputFrame[] = [],
    delay = 0,
    loops = 1,
    restoreOriginalFrame = false
  ) {
    super();

    const { frames, totalDelayUnits } = Animation.#initFrames(inputFrames);
    this.#frames = frames;
    this.#totalDelayUnits = totalDelayUnits;
    this.#loops = loops;
    this.#delayPerUnit = delay;
    this.#restoreOriginalFrame = restoreOriginalFrame;
  }

  addSpriteFrame(frame: SpriteFrame): void {
    this.#frames.push(new AnimationFrame(frame, 1));
    this.#totalDelayUnits++;
  }

  addSpriteFrameWithFile(fileName: string): void {
    const texture = ServiceLocator.textureCache.addImage(fileName);
    const rect = new Rect(0, 0, texture.width, texture.height);
    this.addSpriteFrameWithTexture(texture, rect);
  }

  addSpriteFrameWithTexture(texture: Texture2D, rect: RectLike): void {
    this.addSpriteFrame(new SpriteFrame(texture, rect));
  }

  clone(): Animation {
    const frameCount = this.#frames.length;
    const frames = new Array<AnimationFrame>(frameCount);

    for (let i = 0; i < frameCount; i++) {
      frames[i] = this.#frames[i].clone();
    }

    return new Animation(
      frames,
      this.#delayPerUnit,
      this.#loops,
      this.#restoreOriginalFrame
    );
  }

  get frames(): AnimationFrame[] {
    return this.#frames.slice();
  }

  get loops(): number {
    return this.#loops;
  }

  set loops(value: number) {
    this.#loops = value;
  }

  get restoreOriginalFrame(): boolean {
    return this.#restoreOriginalFrame;
  }

  set restoreOriginalFrame(value: boolean) {
    this.#restoreOriginalFrame = value;
  }

  get duration(): number {
    return this.#totalDelayUnits * this.#delayPerUnit;
  }

  get delayPerUnit(): number {
    return this.#delayPerUnit;
  }

  set delayPerUnit(value: number) {
    this.#delayPerUnit = value;
  }

  get totalDelayUnits(): number {
    return this.#totalDelayUnits;
  }

  static #initFrames(inputFrames: AnimationInputFrame[]): {
    frames: AnimationFrame[];
    totalDelayUnits: number;
  } {
    const frameCount = inputFrames.length;
    const firstFrame = inputFrames[0] || null;
    let totalDelayUnits = 0;
    const frames: AnimationFrame[] = firstFrame
      ? new Array<AnimationFrame>(frameCount)
      : [];

    if (firstFrame instanceof SpriteFrame) {
      arrayVerifyType(inputFrames, SpriteFrame);

      for (let i = 0; i < frameCount; ++i) {
        frames[i] = new AnimationFrame(inputFrames[i] as SpriteFrame, 1);
      }

      totalDelayUnits = frameCount;
    } else if (firstFrame instanceof AnimationFrame) {
      arrayVerifyType(inputFrames, AnimationFrame);

      for (let i = 0; i < frameCount; ++i) {
        const frame = inputFrames[i] as AnimationFrame;
        frames[i] = frame;
        totalDelayUnits += frame.delayUnits;
      }
    }

    return { totalDelayUnits, frames };
  }
}
