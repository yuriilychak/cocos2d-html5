/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

import { ParticleDemo } from "./particle-demo";
import { s_snow } from "../resources";
import { Point } from "@aspect/core";
import { ParticleSnow } from "./ParticleExamples";
import { ParticleSystem } from "@aspect/particle";

export class DemoSnow extends ParticleDemo {
  onEnter() {
    super.onEnter();

    this._emitter = new ParticleSnow();
    this._background.addChild(this._emitter, 10);

    this._emitter.life = 3;
    this._emitter.lifeVar = 1;

    // gravity
    this._emitter.gravity = new Point(0, -10);

    // speed of particles
    this._emitter.speed = 130;
    this._emitter.speedVar = 30;

    var startColor = this._emitter.startColor;
    startColor.r = 230;
    startColor.g = 230;
    startColor.b = 230;
    this._emitter.startColor = startColor;

    var startColorVar = this._emitter.startColorVar;
    startColorVar.b = 26;
    this._emitter.startColorVar = startColorVar;

    this._emitter.emissionRate =
      this._emitter.totalParticles / this._emitter.life;

    this._emitter.texture = cc.textureCache.addImage(s_snow);
    this._emitter.shapeType = ParticleSystem.STAR_SHAPE;

    this.setEmitterPosition();
  }
  title() {
    return "ParticleSnow";
  }
}
