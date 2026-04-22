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
 * cc.Waves3D action. <br />
 * Reference the test cases (Effects Advanced Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} waves
 * @param {Number} amplitude
 */
cc.Waves3D = class Waves3D extends cc.Grid3DAction {
  _waves = 0;
  _amplitude = 0;
  _amplitudeRate = 0;

  /**
   * Create a wave 3d action with duration, grid size, waves and amplitude.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} waves
   * @param {Number} amplitude
   */
  constructor(duration, gridSize, waves, amplitude) {
    super();
    amplitude !== undefined &&
      this.initWithDuration(duration, gridSize, waves, amplitude);
  }

  /**
   * get Amplitude
   * @return {Number}
   */
  getAmplitude() {
    return this._amplitude;
  }

  /**
   * set Amplitude
   * @param {Number} amplitude
   */
  setAmplitude(amplitude) {
    this._amplitude = amplitude;
  }

  /**
   * get Amplitude Rate
   * @return {Number}
   */
  getAmplitudeRate() {
    return this._amplitudeRate;
  }

  /**
   * set Amplitude Rate
   * @param {Number} amplitudeRate
   */
  setAmplitudeRate(amplitudeRate) {
    this._amplitudeRate = amplitudeRate;
  }

  /**
   * initializes an action with duration, grid size, waves and amplitude
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} waves
   * @param {Number} amplitude
   * @return {Boolean}
   */
  initWithDuration(duration, gridSize, waves, amplitude) {
    if (super.initWithDuration(duration, gridSize)) {
      this._waves = waves;
      this._amplitude = amplitude;
      this._amplitudeRate = 1.0;
      return true;
    }
    return false;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number}  dt
   */
  update(dt) {
    const locGridSize = this._gridSize;
    const locAmplitude = this._amplitude;
    const locPos = cc.p(0, 0);
    const locAmplitudeRate = this._amplitudeRate;
    const locWaves = this._waves;
    for (let i = 0; i < locGridSize.width + 1; ++i) {
      for (let j = 0; j < locGridSize.height + 1; ++j) {
        locPos.x = i;
        locPos.y = j;
        const v = this.getOriginalVertex(locPos);
        v.z +=
          Math.sin(Math.PI * dt * locWaves * 2 + (v.y + v.x) * 0.01) *
          locAmplitude *
          locAmplitudeRate;
        this.setVertex(locPos, v);
      }
    }
  }
};

/**
 * Create a wave 3d action with duration, grid size, waves and amplitude.
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} waves
 * @param {Number} amplitude
 */
cc.waves3D = (duration, gridSize, waves, amplitude) =>
  new cc.Waves3D(duration, gridSize, waves, amplitude);

/**
 * cc.FlipX3D action. <br />
 * Flip around. <br />
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 */
cc.FlipX3D = class FlipX3D extends cc.Grid3DAction {
  /**
   * Create a Flip X 3D action with duration.
   * @param {Number} duration
   */
  constructor(duration) {
    if (duration !== undefined) super(duration, cc.size(1, 1));
    else super();
  }

  /**
   * initializes the action with duration
   * @param {Number} duration
   * @return {Boolean}
   */
  initWithDuration(duration) {
    return super.initWithDuration(duration, cc.size(1, 1));
  }

  /**
   * initializes the action with gridSize and duration
   * @param {cc.Size} gridSize
   * @param {Number} duration
   * @return {Boolean}
   */
  initWithSize(gridSize, duration) {
    if (gridSize.width !== 1 || gridSize.height !== 1) {
      // Grid size must be (1,1)
      cc.log("Grid size must be (1,1)");
      return false;
    }
    return super.initWithDuration(duration, gridSize);
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number}  dt
   */
  update(dt) {
    let angle = Math.PI * dt; // 180 degrees
    const mz = Math.sin(angle);
    angle = angle / 2.0; // x calculates degrees from 0 to 90
    const mx = Math.cos(angle);

    const diff = new cc.Vertex3F();
    const tempVer = cc.p(0, 0);
    tempVer.x = tempVer.y = 1;
    const v0 = this.getOriginalVertex(tempVer);
    tempVer.x = tempVer.y = 0;
    const v1 = this.getOriginalVertex(tempVer);

    const x0 = v0.x;
    const x1 = v1.x;
    let x;
    let a;
    let b;
    let c;
    let d;

    if (x0 > x1) {
      // Normal Grid
      a = cc.p(0, 0);
      b = cc.p(0, 1);
      c = cc.p(1, 0);
      d = cc.p(1, 1);
      x = x0;
    } else {
      // Reversed Grid
      c = cc.p(0, 0);
      d = cc.p(0, 1);
      a = cc.p(1, 0);
      b = cc.p(1, 1);
      x = x1;
    }

    diff.x = x - x * mx;
    diff.z = Math.abs(parseFloat((x * mz) / 4.0));

    // bottom-left
    let v = this.getOriginalVertex(a);
    v.x = diff.x;
    v.z += diff.z;
    this.setVertex(a, v);

    // upper-left
    v = this.getOriginalVertex(b);
    v.x = diff.x;
    v.z += diff.z;
    this.setVertex(b, v);

    // bottom-right
    v = this.getOriginalVertex(c);
    v.x -= diff.x;
    v.z -= diff.z;
    this.setVertex(c, v);

    // upper-right
    v = this.getOriginalVertex(d);
    v.x -= diff.x;
    v.z -= diff.z;
    this.setVertex(d, v);
  }
};

/**
 * Create a Flip X 3D action with duration. <br />
 * Flip around.
 * @function
 * @param {Number} duration
 * @return {cc.FlipX3D}
 */
cc.flipX3D = (duration) => new cc.FlipX3D(duration);

/**
 * cc.FlipY3D action. <br />
 * Upside down. <br />
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 */
cc.FlipY3D = class FlipY3D extends cc.FlipX3D {
  /**
   * Create a flip Y 3d action with duration.
   * @param {Number} duration
   */
  constructor(duration) {
    super(duration);
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number}  dt
   */
  update(dt) {
    let angle = Math.PI * dt; // 180 degrees
    const mz = Math.sin(angle);
    angle = angle / 2.0; // x calculates degrees from 0 to 90
    const my = Math.cos(angle);

    const diff = new cc.Vertex3F();

    const tempP = cc.p(0, 0);
    tempP.x = tempP.y = 1;
    const v0 = this.getOriginalVertex(tempP);
    tempP.x = tempP.y = 0;
    const v1 = this.getOriginalVertex(tempP);

    const y0 = v0.y;
    const y1 = v1.y;
    let y;
    let a;
    let b;
    let c;
    let d;

    if (y0 > y1) {
      // Normal Grid
      a = cc.p(0, 0);
      b = cc.p(0, 1);
      c = cc.p(1, 0);
      d = cc.p(1, 1);
      y = y0;
    } else {
      // Reversed Grid
      b = cc.p(0, 0);
      a = cc.p(0, 1);
      d = cc.p(1, 0);
      c = cc.p(1, 1);
      y = y1;
    }

    diff.y = y - y * my;
    diff.z = Math.abs(parseFloat(y * mz) / 4.0);

    // bottom-left
    let v = this.getOriginalVertex(a);
    v.y = diff.y;
    v.z += diff.z;
    this.setVertex(a, v);

    // upper-left
    v = this.getOriginalVertex(b);
    v.y -= diff.y;
    v.z -= diff.z;
    this.setVertex(b, v);

    // bottom-right
    v = this.getOriginalVertex(c);
    v.y = diff.y;
    v.z += diff.z;
    this.setVertex(c, v);

    // upper-right
    v = this.getOriginalVertex(d);
    v.y -= diff.y;
    v.z -= diff.z;
    this.setVertex(d, v);
  }
};

/**
 * Create a flip Y 3d action with duration. <br />
 * Upside down.
 * @function
 * @param {Number} duration
 * @return {cc.FlipY3D}
 */
cc.flipY3D = (duration) => new cc.FlipY3D(duration);

/**
 * cc.Lens3D action. <br />
 * Upside down. <br />
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {cc.Point} position
 * @param {Number} radius
 */
cc.Lens3D = class Lens3D extends cc.Grid3DAction {
  // lens center position
  _position = null;
  _radius = 0;
  // lens effect. Defaults to 0.7 - 0 means no effect, 1 is very strong effect
  _lensEffect = 0;
  // lens is concave. (true = concave, false = convex) default is convex i.e. false
  _concave = false;
  _dirty = false;

  /**
   * creates a lens 3d action with center position, radius.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {cc.Point} position
   * @param {Number} radius
   */
  constructor(duration, gridSize, position, radius) {
    super();
    this._position = cc.p(0, 0);
    radius !== undefined &&
      this.initWithDuration(duration, gridSize, position, radius);
  }

  /**
   * Get lens center position
   * @return {Number}
   */
  getLensEffect() {
    return this._lensEffect;
  }

  /**
   * Set lens center position
   * @param {Number} lensEffect
   */
  setLensEffect(lensEffect) {
    this._lensEffect = lensEffect;
  }

  /**
   * Set whether lens is concave
   * @param {Boolean} concave
   */
  setConcave(concave) {
    this._concave = concave;
  }

  /**
   * get Position
   * @return {cc.Point}
   */
  getPosition() {
    return this._position;
  }

  /**
   * set Position
   * @param {cc.Point} position
   */
  setPosition(position) {
    if (!cc.pointEqualToPoint(position, this._position)) {
      this._position.x = position.x;
      this._position.y = position.y;
      this._dirty = true;
    }
  }

  /**
   * initializes the action with center position, radius, a grid size and duration
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {cc.Point} position
   * @param {Number} radius
   * @return {Boolean}
   */
  initWithDuration(duration, gridSize, position, radius) {
    if (super.initWithDuration(duration, gridSize)) {
      this.setPosition(position);
      this._radius = radius;
      this._lensEffect = 0.7;
      this._dirty = true;
      return true;
    }
    return false;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number}  dt
   */
  update(dt) {
    if (this._dirty) {
      const locGridSizeWidth = this._gridSize.width;
      const locGridSizeHeight = this._gridSize.height;
      const locRadius = this._radius;
      const locLensEffect = this._lensEffect;
      const locPos = cc.p(0, 0);
      const vect = cc.p(0, 0);
      let v;
      let r;
      let l;
      let new_r;
      let pre_log;
      for (let i = 0; i < locGridSizeWidth + 1; ++i) {
        for (let j = 0; j < locGridSizeHeight + 1; ++j) {
          locPos.x = i;
          locPos.y = j;
          v = this.getOriginalVertex(locPos);
          vect.x = this._position.x - v.x;
          vect.y = this._position.y - v.y;
          r = cc.pLength(vect);

          if (r < locRadius) {
            r = locRadius - r;
            pre_log = r / locRadius;
            if (pre_log === 0) pre_log = 0.001;

            l = Math.log(pre_log) * locLensEffect;
            new_r = Math.exp(l) * locRadius;

            r = cc.pLength(vect);
            if (r > 0) {
              vect.x = vect.x / r;
              vect.y = vect.y / r;

              vect.x = vect.x * new_r;
              vect.y = vect.y * new_r;
              v.z += cc.pLength(vect) * locLensEffect;
            }
          }
          this.setVertex(locPos, v);
        }
      }
      this._dirty = false;
    }
  }
};

/**
 * creates a lens 3d action with center position, radius
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {cc.Point} position
 * @param {Number} radius
 * @return {cc.Lens3D}
 */
cc.lens3D = (duration, gridSize, position, radius) =>
  new cc.Lens3D(duration, gridSize, position, radius);

/**
 * cc.Ripple3D action. <br />
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {cc.Point} position
 * @param {Number} radius
 * @param {Number} waves
 * @param {Number} amplitude
 */
cc.Ripple3D = class Ripple3D extends cc.Grid3DAction {
  /* center position */
  _position = null;
  _radius = 0;
  _waves = 0;
  _amplitude = 0;
  _amplitudeRate = 0;

  /**
   * creates a ripple 3d action with radius, number of waves, amplitude.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {cc.Point} position
   * @param {Number} radius
   * @param {Number} waves
   * @param {Number} amplitude
   */
  constructor(duration, gridSize, position, radius, waves, amplitude) {
    super();

    this._position = cc.p(0, 0);
    amplitude !== undefined &&
      this.initWithDuration(
        duration,
        gridSize,
        position,
        radius,
        waves,
        amplitude
      );
  }

  /**
   * get center position
   * @return {cc.Point}
   */
  getPosition() {
    return this._position;
  }

  /**
   * set center position
   * @param {cc.Point} position
   */
  setPosition(position) {
    this._position.x = position.x;
    this._position.y = position.y;
  }

  /**
   * get Amplitude
   * @return {Number}
   */
  getAmplitude() {
    return this._amplitude;
  }

  /**
   * set Amplitude
   * @param {Number} amplitude
   */
  setAmplitude(amplitude) {
    this._amplitude = amplitude;
  }

  /**
   * get Amplitude rate
   * @return {*}
   */
  getAmplitudeRate() {
    return this._amplitudeRate;
  }

  /**
   * get amplitude rate
   * @param {Number} amplitudeRate
   */
  setAmplitudeRate(amplitudeRate) {
    this._amplitudeRate = amplitudeRate;
  }

  /**
   * initializes the action with radius, number of waves, amplitude, a grid size and duration
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {cc.Point} position
   * @param {Number} radius
   * @param {Number} waves
   * @param {Number} amplitude
   * @return {Boolean}
   */
  initWithDuration(duration, gridSize, position, radius, waves, amplitude) {
    if (super.initWithDuration(duration, gridSize)) {
      this.setPosition(position);
      this._radius = radius;
      this._waves = waves;
      this._amplitude = amplitude;
      this._amplitudeRate = 1.0;
      return true;
    }
    return false;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number}  dt
   */
  update(dt) {
    const locGridSizeWidth = this._gridSize.width;
    const locGridSizeHeight = this._gridSize.height;
    const locPos = cc.p(0, 0);
    const locRadius = this._radius;
    const locWaves = this._waves;
    const locAmplitude = this._amplitude;
    const locAmplitudeRate = this._amplitudeRate;
    let v;
    let r;
    const tempPos = cc.p(0, 0);
    for (let i = 0; i < locGridSizeWidth + 1; ++i) {
      for (let j = 0; j < locGridSizeHeight + 1; ++j) {
        locPos.x = i;
        locPos.y = j;
        v = this.getOriginalVertex(locPos);

        tempPos.x = this._position.x - v.x;
        tempPos.y = this._position.y - v.y;
        r = cc.pLength(tempPos);

        if (r < locRadius) {
          r = locRadius - r;
          const rate = Math.pow(r / locRadius, 2);
          v.z +=
            Math.sin(dt * Math.PI * locWaves * 2 + r * 0.1) *
            locAmplitude *
            locAmplitudeRate *
            rate;
        }
        this.setVertex(locPos, v);
      }
    }
  }
};

/**
 * creates a ripple 3d action with radius, number of waves, amplitude
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {cc.Point} position
 * @param {Number} radius
 * @param {Number} waves
 * @param {Number} amplitude
 * @return {cc.Ripple3D}
 */
cc.ripple3D = (duration, gridSize, position, radius, waves, amplitude) =>
  new cc.Ripple3D(duration, gridSize, position, radius, waves, amplitude);

/**
 * cc.Shaky3D action. <br />
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} range
 * @param {Boolean} shakeZ
 */
cc.Shaky3D = class Shaky3D extends cc.Grid3DAction {
  _randRange = 0;
  _shakeZ = false;

  /**
   * initializes the action with a range, shake Z vertices, a grid and duration
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} range
   * @param {Boolean} shakeZ
   * @return {Boolean}
   */
  /**
   * Create a shaky3d action with a range, shake Z vertices.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} range
   * @param {Boolean} shakeZ
   */
  constructor(duration, gridSize, range, shakeZ) {
    super();
    shakeZ !== undefined &&
      this.initWithDuration(duration, gridSize, range, shakeZ);
  }

  initWithDuration(duration, gridSize, range, shakeZ) {
    if (super.initWithDuration(duration, gridSize)) {
      this._randRange = range;
      this._shakeZ = shakeZ;
      return true;
    }
    return false;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number}  dt
   */
  update(dt) {
    const locGridSizeWidth = this._gridSize.width;
    const locGridSizeHeight = this._gridSize.height;
    const locRandRange = this._randRange;
    const locShakeZ = this._shakeZ;
    const locP = cc.p(0, 0);
    let v;
    for (let i = 0; i < locGridSizeWidth + 1; ++i) {
      for (let j = 0; j < locGridSizeHeight + 1; ++j) {
        locP.x = i;
        locP.y = j;
        v = this.getOriginalVertex(locP);
        v.x += (cc.rand() % (locRandRange * 2)) - locRandRange;
        v.y += (cc.rand() % (locRandRange * 2)) - locRandRange;
        if (locShakeZ) v.z += (cc.rand() % (locRandRange * 2)) - locRandRange;
        this.setVertex(locP, v);
      }
    }
  }
};

/**
 * creates the action with a range, shake Z vertices, a grid and duration
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} range
 * @param {Boolean} shakeZ
 * @return {cc.Shaky3D}
 */
cc.shaky3D = (duration, gridSize, range, shakeZ) =>
  new cc.Shaky3D(duration, gridSize, range, shakeZ);

/**
 * cc.Liquid action. <br />
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} waves
 * @param {Number} amplitude
 */
cc.Liquid = class Liquid extends cc.Grid3DAction {
  _waves = 0;
  _amplitude = 0;
  _amplitudeRate = 0;

  /**
   * Create a liquid action with amplitude, a grid and duration.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} waves
   * @param {Number} amplitude
   */
  constructor(duration, gridSize, waves, amplitude) {
    super();
    amplitude !== undefined &&
      this.initWithDuration(duration, gridSize, waves, amplitude);
  }

  /**
   * get amplitude
   * @return {Number}
   */
  getAmplitude() {
    return this._amplitude;
  }

  /**
   * set amplitude
   * @param {Number} amplitude
   */
  setAmplitude(amplitude) {
    this._amplitude = amplitude;
  }

  /**
   * get amplitude rate
   * @return {Number}
   */
  getAmplitudeRate() {
    return this._amplitudeRate;
  }

  /**
   * set amplitude rate
   * @param {Number} amplitudeRate
   */
  setAmplitudeRate(amplitudeRate) {
    this._amplitudeRate = amplitudeRate;
  }

  /**
   * initializes the action with amplitude, a grid and duration
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} waves
   * @param {Number} amplitude
   * @return {Boolean}
   */
  initWithDuration(duration, gridSize, waves, amplitude) {
    if (super.initWithDuration(duration, gridSize)) {
      this._waves = waves;
      this._amplitude = amplitude;
      this._amplitudeRate = 1.0;
      return true;
    }
    return false;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number}  dt
   */
  update(dt) {
    const locSizeWidth = this._gridSize.width;
    const locSizeHeight = this._gridSize.height;
    const locPos = cc.p(0, 0);
    const locWaves = this._waves;
    const locAmplitude = this._amplitude;
    const locAmplitudeRate = this._amplitudeRate;
    let v;
    for (let i = 1; i < locSizeWidth; ++i) {
      for (let j = 1; j < locSizeHeight; ++j) {
        locPos.x = i;
        locPos.y = j;
        v = this.getOriginalVertex(locPos);
        v.x =
          v.x +
          Math.sin(dt * Math.PI * locWaves * 2 + v.x * 0.01) *
            locAmplitude *
            locAmplitudeRate;
        v.y =
          v.y +
          Math.sin(dt * Math.PI * locWaves * 2 + v.y * 0.01) *
            locAmplitude *
            locAmplitudeRate;
        this.setVertex(locPos, v);
      }
    }
  }
};

/**
 * creates the action with amplitude, a grid and duration
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} waves
 * @param {Number} amplitude
 * @return {cc.Liquid}
 */
cc.liquid = (duration, gridSize, waves, amplitude) =>
  new cc.Liquid(duration, gridSize, waves, amplitude);

/**
 * cc.Waves action. <br />
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} waves
 * @param {Number} amplitude
 * @param {Boolean} horizontal
 * @param {Boolean} vertical
 */
cc.Waves = class Waves extends cc.Grid3DAction {
  _waves = 0;
  _amplitude = 0;
  _amplitudeRate = 0;
  _vertical = false;
  _horizontal = false;

  /**
   * Create a wave action with amplitude, horizontal sin, vertical sin, a grid and duration.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} waves
   * @param {Number} amplitude
   * @param {Boolean} horizontal
   * @param {Boolean} vertical
   */
  constructor(duration, gridSize, waves, amplitude, horizontal, vertical) {
    super();
    vertical !== undefined &&
      this.initWithDuration(
        duration,
        gridSize,
        waves,
        amplitude,
        horizontal,
        vertical
      );
  }

  /**
   * get amplitude
   * @return {Number}
   */
  getAmplitude() {
    return this._amplitude;
  }

  /**
   * set amplitude
   * @param {Number} amplitude
   */
  setAmplitude(amplitude) {
    this._amplitude = amplitude;
  }

  /**
   * get amplitude rate
   * @return {Number}
   */
  getAmplitudeRate() {
    return this._amplitudeRate;
  }

  /**
   * set amplitude rate
   * @param {Number} amplitudeRate
   */
  setAmplitudeRate(amplitudeRate) {
    this._amplitudeRate = amplitudeRate;
  }

  /**
   * initializes the action with amplitude, horizontal sin, vertical sin, a grid and duration
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} waves
   * @param {Number} amplitude
   * @param {Boolean} horizontal
   * @param {Boolean} vertical
   * @return {Boolean}
   */
  initWithDuration(duration, gridSize, waves, amplitude, horizontal, vertical) {
    if (super.initWithDuration(duration, gridSize)) {
      this._waves = waves;
      this._amplitude = amplitude;
      this._amplitudeRate = 1.0;
      this._horizontal = horizontal;
      this._vertical = vertical;
      return true;
    }
    return false;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number}  dt
   */
  update(dt) {
    const locSizeWidth = this._gridSize.width;
    const locSizeHeight = this._gridSize.height;
    const locPos = cc.p(0, 0);
    const locVertical = this._vertical;
    const locHorizontal = this._horizontal;
    const locWaves = this._waves;
    const locAmplitude = this._amplitude;
    const locAmplitudeRate = this._amplitudeRate;
    let v;
    for (let i = 0; i < locSizeWidth + 1; ++i) {
      for (let j = 0; j < locSizeHeight + 1; ++j) {
        locPos.x = i;
        locPos.y = j;
        v = this.getOriginalVertex(locPos);
        if (locVertical)
          v.x =
            v.x +
            Math.sin(dt * Math.PI * locWaves * 2 + v.y * 0.01) *
              locAmplitude *
              locAmplitudeRate;
        if (locHorizontal)
          v.y =
            v.y +
            Math.sin(dt * Math.PI * locWaves * 2 + v.x * 0.01) *
              locAmplitude *
              locAmplitudeRate;
        this.setVertex(locPos, v);
      }
    }
  }
};

/**
 * initializes the action with amplitude, horizontal sin, vertical sin, a grid and duration
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} waves
 * @param {Number} amplitude
 * @param {Boolean} horizontal
 * @param {Boolean} vertical
 * @return {cc.Waves}
 */
cc.waves = (duration, gridSize, waves, amplitude, horizontal, vertical) =>
  new cc.Waves(duration, gridSize, waves, amplitude, horizontal, vertical);

/** @brief  */
/**
 * cc.Twirl action. <br />
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {cc.Point} position
 * @param {Number} twirls
 * @param {Number} amplitude
 */
cc.Twirl = class Twirl extends cc.Grid3DAction {
  /* twirl center */
  _position = null;
  _twirls = 0;
  _amplitude = 0;
  _amplitudeRate = 0;

  /**
   * Create a grid 3d action with center position, number of twirls, amplitude, a grid size and duration.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {cc.Point} position
   * @param {Number} twirls
   * @param {Number} amplitude
   */
  constructor(duration, gridSize, position, twirls, amplitude) {
    super();

    this._position = cc.p(0, 0);
    amplitude !== undefined &&
      this.initWithDuration(duration, gridSize, position, twirls, amplitude);
  }

  /**
   * get twirl center
   * @return {cc.Point}
   */
  getPosition() {
    return this._position;
  }

  /**
   * set twirl center
   * @param {cc.Point} position
   */
  setPosition(position) {
    this._position.x = position.x;
    this._position.y = position.y;
  }

  /**
   * get amplitude
   * @return {Number}
   */
  getAmplitude() {
    return this._amplitude;
  }

  /**
   * set amplitude
   * @param {Number} amplitude
   */
  setAmplitude(amplitude) {
    this._amplitude = amplitude;
  }

  /**
   * get amplitude rate
   * @return {Number}
   */
  getAmplitudeRate() {
    return this._amplitudeRate;
  }

  /**
   * set amplitude rate
   * @param {Number} amplitudeRate
   */
  setAmplitudeRate(amplitudeRate) {
    this._amplitudeRate = amplitudeRate;
  }

  /** initializes the action with center position, number of twirls, amplitude, a grid size and duration */
  initWithDuration(duration, gridSize, position, twirls, amplitude) {
    if (super.initWithDuration(duration, gridSize)) {
      this.setPosition(position);
      this._twirls = twirls;
      this._amplitude = amplitude;
      this._amplitudeRate = 1.0;
      return true;
    }
    return false;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   *
   * @param {Number}  dt
   */
  update(dt) {
    const c = this._position;
    const locSizeWidth = this._gridSize.width;
    const locSizeHeight = this._gridSize.height;
    const locPos = cc.p(0, 0);
    const amp = 0.1 * this._amplitude * this._amplitudeRate;
    const locTwirls = this._twirls;
    let v;
    let a;
    let dX;
    let dY;
    const avg = cc.p(0, 0);
    for (let i = 0; i < locSizeWidth + 1; ++i) {
      for (let j = 0; j < locSizeHeight + 1; ++j) {
        locPos.x = i;
        locPos.y = j;
        v = this.getOriginalVertex(locPos);

        avg.x = i - locSizeWidth / 2.0;
        avg.y = j - locSizeHeight / 2.0;

        a =
          cc.pLength(avg) *
          Math.cos(Math.PI / 2.0 + dt * Math.PI * locTwirls * 2) *
          amp;

        dX = Math.sin(a) * (v.y - c.y) + Math.cos(a) * (v.x - c.x);
        dY = Math.cos(a) * (v.y - c.y) - Math.sin(a) * (v.x - c.x);

        v.x = c.x + dX;
        v.y = c.y + dY;

        this.setVertex(locPos, v);
      }
    }
  }
};

/**
 * creates the action with center position, number of twirls, amplitude, a grid size and duration
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {cc.Point} position
 * @param {Number} twirls
 * @param {Number} amplitude
 * @return {cc.Twirl}
 */
cc.twirl = (duration, gridSize, position, twirls, amplitude) =>
  new cc.Twirl(duration, gridSize, position, twirls, amplitude);
