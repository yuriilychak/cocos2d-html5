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

/**
 * A fire particle system
 *
 * @example
 * var emitter = new cc.ParticleFire();
 */
cc.ParticleFire = class ParticleFire extends cc.ParticleSystem {
    /**
     * <p>The cc.ParticleFire's constructor. <br/>
     * This function will automatically be invoked when you create a node using new construction: "var node = new cc.ParticleFire()".<br/>
     * Override it to extend its behavior, remember to call "this._super()" in the extended "ctor" function.</p>
     */
    constructor() {
        super((cc.rendererConfig.isWebGL) ? 300 : 150);
    }

    /**
     * initialize a fire particle system with number Of Particles
     * @param {Number} numberOfParticles
     * @return {Boolean}
     */
    initWithTotalParticles(numberOfParticles) {
        if (super.initWithTotalParticles(numberOfParticles)) {
            // duration
            this.setDuration(cc.ParticleSystem.DURATION_INFINITY);

            // Gravity Mode
            this.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);


            // Gravity Mode: gravity
            this.setGravity(cc.p(0, 0));

            // Gravity Mode: radial acceleration
            this.setRadialAccel(0);
            this.setRadialAccelVar(0);

            // Gravity Mode: speed of particles
            this.setSpeed(60);
            this.setSpeedVar(20);

            // starting angle
            this.setAngle(90);
            this.setAngleVar(10);

            // emitter position
            var winSize = cc.director.getWinSize();
            this.setPosition(winSize.width / 2, 60);
            this.setPosVar(cc.p(40, 20));

            // life of particles
            this.setLife(3);
            this.setLifeVar(0.25);


            // size, in pixels
            this.setStartSize(54.0);
            this.setStartSizeVar(10.0);
            this.setEndSize(cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE);

            // emits per frame
            this.setEmissionRate(this.getTotalParticles() / this.getLife());

            // color of particles
            this.setStartColor(cc.color(194,64,31,255));
            this.setStartColorVar(cc.color(0,0,0,0));
            this.setEndColor(cc.color(0,0,0,255));
            this.setEndColorVar(cc.color(0,0,0,0));

            // additive
            this.setBlendAdditive(true);
            return true;
        }
        return false;
    }
};


/**
 * A fireworks particle system
 *
 * @example
 * var emitter = new cc.ParticleFireworks();
 */
cc.ParticleFireworks = class ParticleFireworks extends cc.ParticleSystem {
    /**
     * <p>The cc.ParticleFireworks's constructor. <br/>
     * This function will automatically be invoked when you create a node using new construction: "var node = new cc.ParticleFireworks()".<br/>
     * Override it to extend its behavior, remember to call "this._super()" in the extended "ctor" function.</p>
     */
    constructor() {
        super((cc.rendererConfig.isWebGL) ? 1500 : 150);
    }

    /**
     * initialize a fireworks particle system with number Of Particles
     * @param {Number} numberOfParticles
     * @return {Boolean}
     */
    initWithTotalParticles(numberOfParticles) {
        if (super.initWithTotalParticles(numberOfParticles)) {
            // duration
            this.setDuration(cc.ParticleSystem.DURATION_INFINITY);

            // Gravity Mode
            this.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);

            // Gravity Mode: gravity
            this.setGravity(cc.p(0, -90));

            // Gravity Mode:  radial
            this.setRadialAccel(0);
            this.setRadialAccelVar(0);

            //  Gravity Mode: speed of particles
            this.setSpeed(180);
            this.setSpeedVar(50);

            // emitter position
            var winSize = cc.director.getWinSize();
            this.setPosition(winSize.width / 2, winSize.height / 2);

            // angle
            this.setAngle(90);
            this.setAngleVar(20);

            // life of particles
            this.setLife(3.5);
            this.setLifeVar(1);

            // emits per frame
            this.setEmissionRate(this.getTotalParticles() / this.getLife());

            // color of particles
            this.setStartColor(cc.color(128,128,128,255));
            this.setStartColorVar(cc.color(128,128,128,255));
            this.setEndColor(cc.color(26,26,26,51));
            this.setEndColorVar(cc.color(26,26,26,51));

            // size, in pixels
            this.setStartSize(8.0);
            this.setStartSizeVar(2.0);
            this.setEndSize(cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE);

            // additive
            this.setBlendAdditive(false);
            return true;
        }
        return false;
    }
};


/**
 * A sun particle system
 *
 * @example
 * var emitter = new cc.ParticleSun();
 */
cc.ParticleSun = class ParticleSun extends cc.ParticleSystem {
    /**
     * <p>The cc.ParticleSun's constructor. <br/>
     * This function will automatically be invoked when you create a node using new construction: "var node = new cc.ParticleSun()".<br/>
     * Override it to extend its behavior, remember to call "this._super()" in the extended "ctor" function.</p>
     */
    constructor() {
        super((cc.rendererConfig.isWebGL) ? 350 : 150);
    }

    /**
     * initialize a sun particle system with number Of Particles
     * @param {Number} numberOfParticles
     * @return {Boolean}
     */
    initWithTotalParticles(numberOfParticles) {
        if (super.initWithTotalParticles(numberOfParticles)) {
            // additive
            this.setBlendAdditive(true);

            // duration
            this.setDuration(cc.ParticleSystem.DURATION_INFINITY);

            // Gravity Mode
            this.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);

            // Gravity Mode: gravity
            this.setGravity(cc.p(0, 0));

            // Gravity mode: radial acceleration
            this.setRadialAccel(0);
            this.setRadialAccelVar(0);

            // Gravity mode: speed of particles
            this.setSpeed(20);
            this.setSpeedVar(5);

            // angle
            this.setAngle(90);
            this.setAngleVar(360);

            // emitter position
            var winSize = cc.director.getWinSize();
            this.setPosition(winSize.width / 2, winSize.height / 2);
            this.setPosVar(cc.p(0,0));

            // life of particles
            this.setLife(1);
            this.setLifeVar(0.5);

            // size, in pixels
            this.setStartSize(30.0);
            this.setStartSizeVar(10.0);
            this.setEndSize(cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE);

            // emits per seconds
            this.setEmissionRate(this.getTotalParticles() / this.getLife());

            // color of particles
            this.setStartColor(cc.color(194, 64, 31, 255));
            this.setStartColorVar(cc.color(0, 0, 0, 0));
            this.setEndColor(cc.color(0, 0, 0, 255));
            this.setEndColorVar(cc.color(0, 0, 0, 0));

            return true;
        }
        return false;
    }
};


//! @brief A  particle system
/**
 * A galaxy particle system
 *
 * @example
 * var emitter = new cc.ParticleGalaxy();
 */
cc.ParticleGalaxy = class ParticleGalaxy extends cc.ParticleSystem {
    /**
     * <p>The cc.ParticleGalaxy's constructor. <br/>
     * This function will automatically be invoked when you create a node using new construction: "var node = new cc.ParticleGalaxy()".<br/>
     * Override it to extend its behavior, remember to call "this._super()" in the extended "ctor" function.</p>
     */
    constructor() {
        super((cc.rendererConfig.isWebGL) ? 200 : 100);
    }

    /**
     * initialize a galaxy particle system with number Of Particles
     * @param {Number} numberOfParticles
     * @return {Boolean}
     */
    initWithTotalParticles(numberOfParticles) {
        if (super.initWithTotalParticles(numberOfParticles)) {
            // duration
            this.setDuration(cc.ParticleSystem.DURATION_INFINITY);

            // Gravity Mode
            this.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);

            // Gravity Mode: gravity
            this.setGravity(cc.p(0, 0));

            // Gravity Mode: speed of particles
            this.setSpeed(60);
            this.setSpeedVar(10);

            // Gravity Mode: radial
            this.setRadialAccel(-80);
            this.setRadialAccelVar(0);

            // Gravity Mode: tangential
            this.setTangentialAccel(80);
            this.setTangentialAccelVar(0);

            // angle
            this.setAngle(90);
            this.setAngleVar(360);

            // emitter position
            var winSize = cc.director.getWinSize();
            this.setPosition(winSize.width / 2, winSize.height / 2);
            this.setPosVar(cc.p(0,0));

            // life of particles
            this.setLife(4);
            this.setLifeVar(1);

            // size, in pixels
            this.setStartSize(37.0);
            this.setStartSizeVar(10.0);
            this.setEndSize(cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE);

            // emits per second
            this.setEmissionRate(this.getTotalParticles() / this.getLife());

            // color of particles
            this.setStartColor(cc.color(31, 64, 194, 255));
            this.setStartColorVar(cc.color(0, 0, 0, 0));
            this.setEndColor(cc.color(0, 0, 0, 255));
            this.setEndColorVar(cc.color(0, 0, 0, 0));

            // additive
            this.setBlendAdditive(true);
            return true;
        }
        return false;
    }
};

/**
 * A flower particle system
 *
 * @example
 * var emitter = new cc.ParticleFlower();
 */
cc.ParticleFlower = class ParticleFlower extends cc.ParticleSystem {
    /**
     * <p>The cc.ParticleFlower's constructor. <br/>
     * This function will automatically be invoked when you create a node using new construction: "var node = new cc.ParticleFlower()".<br/>
     * Override it to extend its behavior, remember to call "this._super()" in the extended "ctor" function.</p>
     */
    constructor() {
        super((cc.rendererConfig.isWebGL) ? 250 : 100);
    }

    /**
     * initialize a flower particle system with number Of Particles
     * @param {Number} numberOfParticles
     * @return {Boolean}
     */
    initWithTotalParticles(numberOfParticles) {
        if (super.initWithTotalParticles(numberOfParticles)) {
            // duration
            this.setDuration(cc.ParticleSystem.DURATION_INFINITY);

            // Gravity Mode
            this.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);

            // Gravity Mode: gravity
            this.setGravity(cc.p(0, 0));

            // Gravity Mode: speed of particles
            this.setSpeed(80);
            this.setSpeedVar(10);

            // Gravity Mode: radial
            this.setRadialAccel(-60);
            this.setRadialAccelVar(0);

            // Gravity Mode: tangential
            this.setTangentialAccel(15);
            this.setTangentialAccelVar(0);

            // angle
            this.setAngle(90);
            this.setAngleVar(360);

            // emitter position
            var winSize = cc.director.getWinSize();
            this.setPosition(winSize.width / 2, winSize.height / 2);
            this.setPosVar(cc.p(0,0));

            // life of particles
            this.setLife(4);
            this.setLifeVar(1);

            // size, in pixels
            this.setStartSize(30.0);
            this.setStartSizeVar(10.0);
            this.setEndSize(cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE);

            // emits per second
            this.setEmissionRate(this.getTotalParticles() / this.getLife());

            // color of particles
            this.setStartColor(cc.color(128, 128, 128, 255));
            this.setStartColorVar(cc.color(128, 128, 128, 128));
            this.setEndColor(cc.color(0, 0, 0, 255));
            this.setEndColorVar(cc.color(0, 0, 0, 0));

            // additive
            this.setBlendAdditive(true);
            return true;
        }
        return false;
    }
};


//! @brief A meteor particle system
/**
 * A meteor particle system
 *
 * @example
 * var emitter = new cc.ParticleMeteor();
 */
cc.ParticleMeteor = class ParticleMeteor extends cc.ParticleSystem {
    /**
     * <p>The cc.ParticleMeteor's constructor. <br/>
     * This function will automatically be invoked when you create a node using new construction: "var node = new cc.ParticleMeteor()".<br/>
     * Override it to extend its behavior, remember to call "this._super()" in the extended "ctor" function.</p>
     */
    constructor() {
        super((cc.rendererConfig.isWebGL) ? 150 : 100);
    }

    /**
     * initialize a meteor particle system with number Of Particles
     * @param {Number} numberOfParticles
     * @return {Boolean}
     */
    initWithTotalParticles(numberOfParticles) {
        if (super.initWithTotalParticles(numberOfParticles)) {
            // duration
            this.setDuration(cc.ParticleSystem.DURATION_INFINITY);

            // Gravity Mode
            this.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);

            // Gravity Mode: gravity
            this.setGravity(cc.p(-200, 200));

            // Gravity Mode: speed of particles
            this.setSpeed(15);
            this.setSpeedVar(5);

            // Gravity Mode: radial
            this.setRadialAccel(0);
            this.setRadialAccelVar(0);

            // Gravity Mode: tangential
            this.setTangentialAccel(0);
            this.setTangentialAccelVar(0);

            // angle
            this.setAngle(90);
            this.setAngleVar(360);

            // emitter position
            var winSize = cc.director.getWinSize();
            this.setPosition(winSize.width / 2, winSize.height / 2);
            this.setPosVar(cc.p(0,0));

            // life of particles
            this.setLife(2);
            this.setLifeVar(1);

            // size, in pixels
            this.setStartSize(60.0);
            this.setStartSizeVar(10.0);
            this.setEndSize(cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE);

            // emits per second
            this.setEmissionRate(this.getTotalParticles() / this.getLife());

            // color of particles
            this.setStartColor(cc.color(51, 102, 179));
            this.setStartColorVar(cc.color(0, 0, 51, 26));
            this.setEndColor(cc.color(0, 0, 0, 255));
            this.setEndColorVar(cc.color(0, 0, 0, 0));

            // additive
            this.setBlendAdditive(true);
            return true;
        }
        return false;
    }
};


/**
 * A spiral particle system
 *
 * @example
 * var emitter = new cc.ParticleSpiral();
 */
cc.ParticleSpiral = class ParticleSpiral extends cc.ParticleSystem {

    /**
     * <p>The cc.ParticleSpiral's constructor. <br/>
     * This function will automatically be invoked when you create a node using new construction: "var node = new cc.ParticleSpiral()".<br/>
     * Override it to extend its behavior, remember to call "this._super()" in the extended "ctor" function.</p>
     */
    constructor() {
        super((cc.rendererConfig.isWebGL) ? 500 : 100);
    }

    /**
     * initialize a spiral particle system with number Of Particles
     * @param {Number} numberOfParticles
     * @return {Boolean}
     */
    initWithTotalParticles(numberOfParticles) {
        if (super.initWithTotalParticles(numberOfParticles)) {
            // duration
            this.setDuration(cc.ParticleSystem.DURATION_INFINITY);

            // Gravity Mode
            this.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);

            // Gravity Mode: gravity
            this.setGravity(cc.p(0, 0));

            // Gravity Mode: speed of particles
            this.setSpeed(150);
            this.setSpeedVar(0);

            // Gravity Mode: radial
            this.setRadialAccel(-380);
            this.setRadialAccelVar(0);

            // Gravity Mode: tangential
            this.setTangentialAccel(45);
            this.setTangentialAccelVar(0);

            // angle
            this.setAngle(90);
            this.setAngleVar(0);

            // emitter position
            var winSize = cc.director.getWinSize();
            this.setPosition(winSize.width / 2, winSize.height / 2);
            this.setPosVar(cc.p(0,0));

            // life of particles
            this.setLife(12);
            this.setLifeVar(0);

            // size, in pixels
            this.setStartSize(20.0);
            this.setStartSizeVar(0.0);
            this.setEndSize(cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE);

            // emits per second
            this.setEmissionRate(this.getTotalParticles() / this.getLife());

            // color of particles
            this.setStartColor(cc.color(128,128,128,255));
            this.setStartColorVar(cc.color(128,128,128,0));
            this.setEndColor(cc.color(128,128,128,255));
            this.setEndColorVar(cc.color(128,128,128,0));

            // additive
            this.setBlendAdditive(false);
            return true;
        }
        return false;
    }
};


/**
 * An explosion particle system
 *
 * @example
 * var emitter = new cc.ParticleExplosion();
 */
cc.ParticleExplosion = class ParticleExplosion extends cc.ParticleSystem {
    /**
     * <p>The cc.ParticleExplosion's constructor. <br/>
     * This function will automatically be invoked when you create a node using new construction: "var node = new cc.ParticleExplosion()".<br/>
     * Override it to extend its behavior, remember to call "this._super()" in the extended "ctor" function.</p>
     */
    constructor() {
        super((cc.rendererConfig.isWebGL) ? 700 : 300);
    }

    /**
     * initialize an explosion particle system with number Of Particles
     * @param {Number} numberOfParticles
     * @return {Boolean}
     */
    initWithTotalParticles(numberOfParticles) {
        if (super.initWithTotalParticles(numberOfParticles)) {
            // duration
            this.setDuration(0.1);

            this.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);

            // Gravity Mode: gravity
            this.setGravity(cc.p(0, 0));

            // Gravity Mode: speed of particles
            this.setSpeed(70);
            this.setSpeedVar(40);

            // Gravity Mode: radial
            this.setRadialAccel(0);
            this.setRadialAccelVar(0);

            // Gravity Mode: tangential
            this.setTangentialAccel(0);
            this.setTangentialAccelVar(0);

            // angle
            this.setAngle(90);
            this.setAngleVar(360);

            // emitter position
            var winSize = cc.director.getWinSize();
            this.setPosition(winSize.width / 2, winSize.height / 2);
            this.setPosVar(cc.p(0,0));

            // life of particles
            this.setLife(5.0);
            this.setLifeVar(2);

            // size, in pixels
            this.setStartSize(15.0);
            this.setStartSizeVar(10.0);
            this.setEndSize(cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE);

            // emits per second
            this.setEmissionRate(this.getTotalParticles() / this.getDuration());

            // color of particles
            this.setStartColor(cc.color(179, 26, 51, 255));
            this.setStartColorVar(cc.color(128, 128, 128, 0));
            this.setEndColor(cc.color(128, 128, 128, 0));
            this.setEndColorVar(cc.color(128, 128, 128, 0));

            // additive
            this.setBlendAdditive(false);
            return true;
        }
        return false;
    }
};


/**
 * A smoke particle system
 *
 * @example
 * var emitter = new cc.ParticleSmoke();
 */
cc.ParticleSmoke = class ParticleSmoke extends cc.ParticleSystem {

    /**
     * <p>The cc.ParticleSmoke's constructor. <br/>
     * This function will automatically be invoked when you create a node using new construction: "var node = new cc.ParticleSmoke()".<br/>
     * Override it to extend its behavior, remember to call "this._super()" in the extended "ctor" function.</p>
     */
    constructor() {
        super((cc.rendererConfig.isWebGL) ? 200 : 100);
    }

    /**
     * initialize a smoke particle system with number Of Particles
     * @param {Number} numberOfParticles
     * @return {Boolean}
     */
    initWithTotalParticles(numberOfParticles) {
        if (super.initWithTotalParticles(numberOfParticles)) {
            // duration
            this.setDuration(cc.ParticleSystem.DURATION_INFINITY);

            // Emitter mode: Gravity Mode
            this.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);

            // Gravity Mode: gravity
            this.setGravity(cc.p(0, 0));

            // Gravity Mode: radial acceleration
            this.setRadialAccel(0);
            this.setRadialAccelVar(0);

            // Gravity Mode: speed of particles
            this.setSpeed(25);
            this.setSpeedVar(10);

            // angle
            this.setAngle(90);
            this.setAngleVar(5);

            // emitter position
            var winSize = cc.director.getWinSize();
            this.setPosition(winSize.width / 2, 0);
            this.setPosVar(cc.p(20, 0));

            // life of particles
            this.setLife(4);
            this.setLifeVar(1);

            // size, in pixels
            this.setStartSize(60.0);
            this.setStartSizeVar(10.0);
            this.setEndSize(cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE);

            // emits per frame
            this.setEmissionRate(this.getTotalParticles() / this.getLife());

            // color of particles
            this.setStartColor(cc.color(204, 204, 204, 255));
            this.setStartColorVar(cc.color(5, 5, 5, 0));
            this.setEndColor(cc.color(0, 0, 0, 255));
            this.setEndColorVar(cc.color(0, 0, 0, 0));

            // additive
            this.setBlendAdditive(false);
            return true;
        }
        return false;
    }
};


/**
 * A snow particle system
 *
 * @example
 * var emitter = new cc.ParticleSnow();
 */
cc.ParticleSnow = class ParticleSnow extends cc.ParticleSystem {

    /**
     * <p>The cc.ParticleSnow's constructor. <br/>
     * This function will automatically be invoked when you create a node using new construction: "var node = new cc.ParticleSnow()".<br/>
     * Override it to extend its behavior, remember to call "this._super()" in the extended "ctor" function.</p>
     */
    constructor() {
        super((cc.rendererConfig.isWebGL) ? 700 : 250);
    }

    /**
     * initialize a snow particle system with number Of Particles
     * @param {Number} numberOfParticles
     * @return {Boolean}
     */
    initWithTotalParticles(numberOfParticles) {
        if (super.initWithTotalParticles(numberOfParticles)) {
            // duration
            this.setDuration(cc.ParticleSystem.DURATION_INFINITY);

            // set gravity mode.
            this.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);

            // Gravity Mode: gravity
            this.setGravity(cc.p(0, -1));

            // Gravity Mode: speed of particles
            this.setSpeed(5);
            this.setSpeedVar(1);

            // Gravity Mode: radial
            this.setRadialAccel(0);
            this.setRadialAccelVar(1);

            // Gravity mode: tangential
            this.setTangentialAccel(0);
            this.setTangentialAccelVar(1);

            // emitter position
            var winSize = cc.director.getWinSize();
            this.setPosition(winSize.width / 2, winSize.height + 10);
            this.setPosVar(cc.p(winSize.width / 2, 0));

            // angle
            this.setAngle(-90);
            this.setAngleVar(5);

            // life of particles
            this.setLife(45);
            this.setLifeVar(15);

            // size, in pixels
            this.setStartSize(10.0);
            this.setStartSizeVar(5.0);
            this.setEndSize(cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE);

            // emits per second
            this.setEmissionRate(10);

            // color of particles
            this.setStartColor(cc.color(255, 255, 255, 255));
            this.setStartColorVar(cc.color(0, 0, 0, 0));
            this.setEndColor(cc.color(255, 255, 255, 0));
            this.setEndColorVar(cc.color(0, 0, 0, 0));

            // additive
            this.setBlendAdditive(false);
            return true;
        }
        return false;
    }
};


//! @brief A rain particle system
/**
 * A rain particle system
 *
 * @example
 * var emitter = new cc.ParticleRain();
 */
cc.ParticleRain = class ParticleRain extends cc.ParticleSystem {

    /**
     * <p>The cc.ParticleRain's constructor. <br/>
     * This function will automatically be invoked when you create a node using new construction: "var node = new cc.ParticleRain()".<br/>
     * Override it to extend its behavior, remember to call "this._super()" in the extended "ctor" function.</p>
     */
    constructor() {
        super((cc.rendererConfig.isWebGL) ? 1000 : 300);
    }

    /**
     * initialize a rain particle system with number Of Particles
     * @param {Number} numberOfParticles
     * @return {Boolean}
     */
    initWithTotalParticles(numberOfParticles) {
        if (super.initWithTotalParticles(numberOfParticles)) {
            // duration
            this.setDuration(cc.ParticleSystem.DURATION_INFINITY);

            this.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);

            // Gravity Mode: gravity
            this.setGravity(cc.p(10, -10));

            // Gravity Mode: radial
            this.setRadialAccel(0);
            this.setRadialAccelVar(1);

            // Gravity Mode: tangential
            this.setTangentialAccel(0);
            this.setTangentialAccelVar(1);

            // Gravity Mode: speed of particles
            this.setSpeed(130);
            this.setSpeedVar(30);

            // angle
            this.setAngle(-90);
            this.setAngleVar(5);


            // emitter position
            var winSize = cc.director.getWinSize();
            this.setPosition(winSize.width / 2, winSize.height);
            this.setPosVar(cc.p(winSize.width / 2, 0));

            // life of particles
            this.setLife(4.5);
            this.setLifeVar(0);

            // size, in pixels
            this.setStartSize(4.0);
            this.setStartSizeVar(2.0);
            this.setEndSize(cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE);

            // emits per second
            this.setEmissionRate(20);

            // color of particles
            this.setStartColor(cc.color(179, 204, 255, 255));
            this.setStartColorVar(cc.color(0, 0, 0, 0));
            this.setEndColor(cc.color(179, 204, 255, 128));
            this.setEndColorVar(cc.color(0, 0, 0, 0));

            // additive
            this.setBlendAdditive(false);
            return true;
        }
        return false;
    }
};

