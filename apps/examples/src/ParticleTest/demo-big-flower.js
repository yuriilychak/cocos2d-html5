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

export class DemoBigFlower extends ParticleDemo {
    onEnter() {
        super.onEnter();

        this._emitter = new cc.ParticleSystem(50);

        this._background.addChild(this._emitter, 10);
        this._emitter.texture = cc.textureCache.addImage(s_stars1);
        this._emitter.shapeType = cc.ParticleSystem.STAR_SHAPE;

        this._emitter.duration = -1;

        // gravity
        this._emitter.gravity = new cc.Point(0, 0);

        // angle
        this._emitter.angle = 90;
        this._emitter.angleVar = 360;

        // speed of particles
        this._emitter.speed = 160;
        this._emitter.speedVar = 20;

        // radial
        this._emitter.radialAccel = -120;
        this._emitter.radialAccelVar = 0;

        // tangential
        this._emitter.tangentialAccel = 30;
        this._emitter.tangentialAccelVar = 0;

        // emitter position
        this._emitter.x = 160;
        this._emitter.y = 240;
        this._emitter.posVar = new cc.Point(0, 0);

        // life of particles
        this._emitter.life = 4;
        this._emitter.lifeVar = 1;

        // spin of particles
        this._emitter.startSpin = 0;
        this._emitter.startSizeVar = 0;
        this._emitter.endSpin = 0;
        this._emitter.endSpinVar = 0;

        // color of particles
        this._emitter.startColor = new cc.Color(128, 128, 128, 255);
        this._emitter.startColorVar = new cc.Color(128, 128, 128, 255);
        this._emitter.endColor = new cc.Color(26, 26, 26, 50);
        this._emitter.endColorVar = new cc.Color(26, 26, 26, 50);

        // size, in pixels
        this._emitter.startSize = 80.0;
        this._emitter.startSizeVar = 40.0;
        this._emitter.endSize = cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE;

        // emits per second
        this._emitter.emissionRate = this._emitter.totalParticles / this._emitter.life;

        // additive
        this._emitter.setBlendAdditive(true);

        this.setEmitterPosition();
    }
    title() {
        return "ParticleBigFlower";
    }

}
