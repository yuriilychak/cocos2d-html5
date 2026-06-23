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

import { Point } from "@aspect/core";

export function ParticleModeA(dir, radialAccel, tangentialAccel) {
  this.dir = dir ? dir : new Point();
  this.radialAccel = radialAccel || 0;
  this.tangentialAccel = tangentialAccel || 0;
}

export function ParticleModeB(angle, degreesPerSecond, radius, deltaRadius) {
  this.angle = angle || 0;
  this.degreesPerSecond = degreesPerSecond || 0;
  this.radius = radius || 0;
  this.deltaRadius = deltaRadius || 0;
}

export function Particle(
  pos,
  startPos,
  color,
  deltaColor,
  size,
  deltaSize,
  rotation,
  deltaRotation,
  timeToLive,
  atlasIndex,
  modeA,
  modeB
) {
  this.pos = pos ? pos : new Point();
  this.startPos = startPos ? startPos : new Point();
  this.color = color ? color : { r: 0, g: 0, b: 0, a: 255 };
  this.deltaColor = deltaColor ? deltaColor : { r: 0, g: 0, b: 0, a: 255 };
  this.size = size || 0;
  this.deltaSize = deltaSize || 0;
  this.rotation = rotation || 0;
  this.deltaRotation = deltaRotation || 0;
  this.timeToLive = timeToLive || 0;
  this.atlasIndex = atlasIndex || 0;
  this.modeA = modeA ? modeA : new ParticleModeA();
  this.modeB = modeB ? modeB : new ParticleModeB();
  this.isChangeColor = false;
  this.drawPos = new Point();
}

Particle.ModeA = ParticleModeA;
Particle.ModeB = ParticleModeB;
Particle.TemporaryPoints = [new Point(), new Point(), new Point(), new Point()];
