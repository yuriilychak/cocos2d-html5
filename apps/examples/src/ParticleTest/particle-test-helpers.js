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

import { DemoBigFlower } from "./demo-big-flower";
import { DemoExplosion } from "./demo-explosion";
import { DemoFire } from "./demo-fire";
import { DemoFirework } from "./demo-firework";
import { DemoFlower } from "./demo-flower";
import { DemoGalaxy } from "./demo-galaxy";
import { DemoMeteor } from "./demo-meteor";
import { DemoModernArt } from "./demo-modern-art";
import { DemoParticleFromFile } from "./demo-particle-from-file";
import { DemoPause } from "./demo-pause";
import { DemoRain } from "./demo-rain";
import { DemoRing } from "./demo-ring";
import { DemoRotFlower } from "./demo-rot-flower";
import { DemoSmoke } from "./demo-smoke";
import { DemoSnow } from "./demo-snow";
import { DemoSpiral } from "./demo-spiral";
import { DemoSun } from "./demo-sun";
import { Issue704 } from "./issue704";
import { Issue870 } from "./issue870";
import { ParallaxParticle } from "./parallax-particle";
import { ParticleBatchTest } from "./particle-batch-test";
import { ParticleResizeTest } from "./particle-resize-test";
import {
  particleSceneIdx,
  _setparticleSceneIdx
} from "./particle-test-constants";
import { RadiusMode1 } from "./radius-mode1";
import { RadiusMode2 } from "./radius-mode2";

export var particleSceneArr = [
  function () {
    return new DemoFlower();
  },
  function () {
    return new DemoGalaxy();
  },
  function () {
    return new DemoFirework();
  },
  function () {
    return new DemoSpiral();
  },
  function () {
    return new DemoSun();
  },
  function () {
    return new DemoMeteor();
  },
  function () {
    return new DemoFire();
  },
  function () {
    return new DemoSmoke();
  },
  function () {
    return new DemoExplosion();
  },
  function () {
    return new DemoSnow();
  },
  function () {
    return new DemoRain();
  },
  function () {
    return new DemoBigFlower();
  },
  function () {
    return new DemoRotFlower();
  },
  function () {
    return new DemoModernArt();
  },
  function () {
    return new DemoRing();
  },
  function () {
    return new DemoParticleFromFile("BoilingFoam");
  },
  function () {
    return new DemoParticleFromFile("BurstPipe");
  },
  function () {
    return new DemoParticleFromFile("Comet");
  },
  function () {
    return new DemoParticleFromFile("debian");
  },
  function () {
    return new DemoParticleFromFile("ExplodingRing");
  },
  function () {
    return new DemoParticleFromFile("LavaFlow");
  },
  function () {
    return new DemoParticleFromFile("SpinningPeas");
  },
  function () {
    return new DemoParticleFromFile("SpookyPeas");
  },
  function () {
    return new DemoParticleFromFile("Upsidedown");
  },
  function () {
    return new DemoParticleFromFile("Flower");
  },
  function () {
    return new DemoParticleFromFile("Spiral");
  },
  function () {
    return new DemoParticleFromFile("Galaxy");
  },
  function () {
    return new RadiusMode1();
  },
  function () {
    return new RadiusMode2();
  },
  function () {
    return new Issue704();
  },
  function () {
    return new Issue870();
  },
  function () {
    return new DemoParticleFromFile("Phoenix");
  },
  function () {
    return new ParticleResizeTest();
  },
  function () {
    return new DemoPause();
  }
];

if ("opengl" in cc.sys.capabilities && cc.rendererConfig.isWebGL) {
  particleSceneArr.push(function () {
    return new ParallaxParticle();
  });
  particleSceneArr.push(function () {
    return new ParticleBatchTest();
  });
}

export function nextParticleAction() {
  _setparticleSceneIdx(particleSceneIdx + 1);
  _setparticleSceneIdx(particleSceneIdx % particleSceneArr.length);
  return particleSceneArr[particleSceneIdx]();
}

export function backParticleAction() {
  _setparticleSceneIdx(particleSceneIdx - 1);
  if (particleSceneIdx < 0)
    _setparticleSceneIdx(particleSceneIdx + particleSceneArr.length);

  return particleSceneArr[particleSceneIdx]();
}

export function restartParticleAction() {
  return particleSceneArr[particleSceneIdx]();
}
