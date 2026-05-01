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
import { s_starsGrayscale } from "../resources";
import { director } from "../constants";
import { Point, Color } from "@aspect/core";

export class RadiusMode1 extends ParticleDemo {
    onEnter() {
        super.onEnter();

        this.setColor(new Color(0, 0, 0));
        this.removeChild(this._background, true);
        this._background = null;

        this._emitter = new cc.ParticleSystem(100);
        this.addChild(this._emitter, 10);
        this._emitter.texture = cc.textureCache.addImage(s_starsGrayscale);

        // duration
        this._emitter.duration = cc.ParticleSystem.DURATION_INFINITY;

        // radius mode
        this._emitter.emitterMode = cc.ParticleSystem.MODE_RADIUS;

        // radius mode: start and end radius in pixels
        this._emitter.startRadius = 0;
        this._emitter.startRadiusVar = 0;
        this._emitter.endRadius = 160;
        this._emitter.endRadiusVar = 0;

        // radius mode: degrees per second
        this._emitter.rotatePerS = 180;
        this._emitter.rotatePerSVar = 0;


        // angle
        this._emitter.angle = 90;
        this._emitter.angleVar = 0;

        // emitter position
        var size = director.getWinSize();
        this._emitter.x = size.width / 2;
        this._emitter.y = size.height / 2;
        this._emitter.posVar = new Point(0, 0);

        // life of particles
        this._emitter.life = 5;
        this._emitter.lifeVar = 0;

        // spin of particles
        this._emitter.startSpin = 0;
        this._emitter.startSpinVar = 0;
        this._emitter.endSpin = 0;
        this._emitter.endSpinVar = 0;

        // color of particles
        this._emitter.startColor = new Color(128, 128, 128, 255);
        this._emitter.startColorVar = new Color(128, 128, 128, 255);
        this._emitter.endColor = new Color(26, 26, 26, 50);
        this._emitter.endColorVar = new Color(26, 26, 26, 50);

        // size, in pixels
        this._emitter.startSize = 32;
        this._emitter.startSizeVar = 0;
        this._emitter.endSize = cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE;

        // emits per second
        this._emitter.emissionRate = this._emitter.totalParticles / this._emitter.life;

        // additive
        this._emitter.setBlendAdditive(false);
    }
    title() {
        return "Radius Mode: Spiral";
    }

}
