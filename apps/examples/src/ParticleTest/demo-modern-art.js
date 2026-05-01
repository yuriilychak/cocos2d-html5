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
import { s_fire } from "../resources";
import { director } from "../constants";
import { Color, Point, Sys } from "@aspect/core";
import { ParticleSystem } from "@aspect/particle";

export class DemoModernArt extends ParticleDemo {
    onEnter() {
        super.onEnter();

        this._emitter = new ParticleSystem(("opengl" in Sys.getInstance().capabilities) ? 1000 : 200);

        this._background.addChild(this._emitter, 10);

        var winSize = director.getWinSize();

        // duration
        this._emitter.duration = -1;

        // gravity
        this._emitter.gravity = new Point(0, 0);

        // angle
        this._emitter.angle = 0;
        this._emitter.angleVar = 360;

        // radial
        this._emitter.radialAccel = 70;
        this._emitter.radialAccelVar = 10;

        // tangential
        this._emitter.tangentialAccel = 80;
        this._emitter.tangentialAccelVar = 0;

        // speed of particles
        this._emitter.speed = 50;
        this._emitter.speedVar = 10;

        // life of particles
        this._emitter.life = 2.0;
        this._emitter.lifeVar = 0.3;

        // emits per frame
        this._emitter.emissionRate = this._emitter.totalParticles / this._emitter.life;

        // color of particles
        this._emitter.startColor = new Color(128, 128, 128, 255);
        this._emitter.startColorVar = new Color(128, 128, 128, 255);
        this._emitter.endColor = new Color(26, 26, 26, 50);
        this._emitter.endColorVar = new Color(26, 26, 26, 50);

        // size, in pixels
        this._emitter.startSize = 1.0;
        this._emitter.startSizeVar = 1.0;
        this._emitter.endSize = 32.0;
        this._emitter.endSizeVar = 8.0;

        // texture
        this._emitter.texture = cc.textureCache.addImage(s_fire);
        this._emitter.shapeType = ParticleSystem.BALL_SHAPE;

        // additive
        this._emitter.setBlendAdditive(false);

        this.setEmitterPosition();
    }
    title() {
        return "Varying size";
    }

}
