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
 * cc.ShakyTiles3D action. <br />
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} range
 * @param {Boolean} shakeZ
 */
cc.ShakyTiles3D = class ShakyTiles3D extends cc.TiledGrid3DAction {
  _randRange = 0;
  _shakeZ = false;

  /**
   * Creates the action with a range, whether or not to shake Z vertices, a grid size, and duration.
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

  /**
   * Initializes the action with a range, whether or not to shake Z vertices, a grid size, and duration.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} range
   * @param {Boolean} shakeZ
   * @return {Boolean}
   */
  initWithDuration(duration, gridSize, range, shakeZ) {
    if (super.initWithDuration(duration, gridSize)) {
      this._randRange = range;
      this._shakeZ = shakeZ;
      return true;
    }
    return false;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.  <br />
   * @param {Number}  dt
   */
  update(dt) {
    const locGridSize = this._gridSize;
    const locRandRange = this._randRange;
    const locPos = cc.p(0, 0);
    for (let i = 0; i < locGridSize.width; ++i) {
      for (let j = 0; j < locGridSize.height; ++j) {
        locPos.x = i;
        locPos.y = j;
        const coords = this.getOriginalTile(locPos);

        // X
        coords.bl.x += (cc.rand() % (locRandRange * 2)) - locRandRange;
        coords.br.x += (cc.rand() % (locRandRange * 2)) - locRandRange;
        coords.tl.x += (cc.rand() % (locRandRange * 2)) - locRandRange;
        coords.tr.x += (cc.rand() % (locRandRange * 2)) - locRandRange;

        // Y
        coords.bl.y += (cc.rand() % (locRandRange * 2)) - locRandRange;
        coords.br.y += (cc.rand() % (locRandRange * 2)) - locRandRange;
        coords.tl.y += (cc.rand() % (locRandRange * 2)) - locRandRange;
        coords.tr.y += (cc.rand() % (locRandRange * 2)) - locRandRange;

        if (this._shakeZ) {
          coords.bl.z += (cc.rand() % (locRandRange * 2)) - locRandRange;
          coords.br.z += (cc.rand() % (locRandRange * 2)) - locRandRange;
          coords.tl.z += (cc.rand() % (locRandRange * 2)) - locRandRange;
          coords.tr.z += (cc.rand() % (locRandRange * 2)) - locRandRange;
        }

        this.setTile(locPos, coords);
      }
    }
  }
};

/**
 * Creates the action with a range, whether or not to shake Z vertices, a grid size, and duration. <br />
 * Reference the test cases (Effects Test)
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} range
 * @param {Boolean} shakeZ
 * @return {cc.ShakyTiles3D}
 */
cc.shakyTiles3D = (duration, gridSize, range, shakeZ) =>
  new cc.ShakyTiles3D(duration, gridSize, range, shakeZ);

/**
 * cc.ShatteredTiles3D action. <br />
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} range
 * @param {Boolean} shatterZ
 */
cc.ShatteredTiles3D = class ShatteredTiles3D extends cc.TiledGrid3DAction {
  _randRange = 0;
  _once = false;
  _shatterZ = false;

  /**
   * Creates the action with a range, whether of not to shatter Z vertices, a grid size and duration.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} range
   * @param {Boolean} shatterZ
   */
  constructor(duration, gridSize, range, shatterZ) {
    super();
    shatterZ !== undefined &&
      this.initWithDuration(duration, gridSize, range, shatterZ);
  }

  /**
   * Initializes the action with a range, whether or not to shatter Z vertices, a grid size and duration. <br />
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} range
   * @param {Boolean} shatterZ
   * @return {Boolean}
   */
  initWithDuration(duration, gridSize, range, shatterZ) {
    if (super.initWithDuration(duration, gridSize)) {
      this._once = false;
      this._randRange = range;
      this._shatterZ = shatterZ;
      return true;
    }
    return false;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval. <br />
   * @param {Number}  dt
   */
  update(dt) {
    if (this._once === false) {
      const locGridSize = this._gridSize;
      const locRandRange = this._randRange;
      let coords;
      const locPos = cc.p(0, 0);
      for (let i = 0; i < locGridSize.width; ++i) {
        for (let j = 0; j < locGridSize.height; ++j) {
          locPos.x = i;
          locPos.y = j;
          coords = this.getOriginalTile(locPos);

          // X
          coords.bl.x += (cc.rand() % (locRandRange * 2)) - locRandRange;
          coords.br.x += (cc.rand() % (locRandRange * 2)) - locRandRange;
          coords.tl.x += (cc.rand() % (locRandRange * 2)) - locRandRange;
          coords.tr.x += (cc.rand() % (locRandRange * 2)) - locRandRange;

          // Y
          coords.bl.y += (cc.rand() % (locRandRange * 2)) - locRandRange;
          coords.br.y += (cc.rand() % (locRandRange * 2)) - locRandRange;
          coords.tl.y += (cc.rand() % (locRandRange * 2)) - locRandRange;
          coords.tr.y += (cc.rand() % (locRandRange * 2)) - locRandRange;

          if (this._shatterZ) {
            coords.bl.z += (cc.rand() % (locRandRange * 2)) - locRandRange;
            coords.br.z += (cc.rand() % (locRandRange * 2)) - locRandRange;
            coords.tl.z += (cc.rand() % (locRandRange * 2)) - locRandRange;
            coords.tr.z += (cc.rand() % (locRandRange * 2)) - locRandRange;
          }
          this.setTile(locPos, coords);
        }
      }
      this._once = true;
    }
  }
};

/**
 * Creates the action with a range, whether of not to shatter Z vertices, a grid size and duration. <br />
 * Reference the test cases (Effects Test)
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} range
 * @param {Boolean} shatterZ
 * @return {cc.ShatteredTiles3D}
 */
cc.shatteredTiles3D = (duration, gridSize, range, shatterZ) =>
  new cc.ShatteredTiles3D(duration, gridSize, range, shatterZ);

/**
 * A Tile composed of position, startPosition and delta.
 * @constructor
 * @param {cc.Point} [position=cc.p(0,0)]
 * @param {cc.Point} [startPosition=cc.p(0,0)]
 * @param {cc.Size} [delta=cc.p(0,0)]
 */
cc.Tile = function (position, startPosition, delta) {
  this.position = position || cc.p(0, 0);
  this.startPosition = startPosition || cc.p(0, 0);
  this.delta = delta || cc.p(0, 0);
};

/**
 * cc.ShuffleTiles action, Shuffle the tiles in random order. <br />
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} seed
 */
cc.ShuffleTiles = class ShuffleTiles extends cc.TiledGrid3DAction {
  _seed = 0;
  _tilesCount = 0;
  _tilesOrder = null;
  _tiles = null;

  /**
   * Creates the action with a random seed, the grid size and the duration.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} seed
   */
  constructor(duration, gridSize, seed) {
    super();
    this._tilesOrder = [];
    this._tiles = [];

    seed !== undefined && this.initWithDuration(duration, gridSize, seed);
  }

  /**
   * Initializes the action with a random seed, the grid size and the duration.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} seed
   * @return {Boolean}
   */
  initWithDuration(duration, gridSize, seed) {
    if (super.initWithDuration(duration, gridSize)) {
      this._seed = seed;
      this._tilesOrder.length = 0;
      this._tiles.length = 0;
      return true;
    }
    return false;
  }

  /**
   * Shuffle
   * @param {Array} array
   * @param {Number} len
   */
  shuffle(array, len) {
    for (let i = len - 1; i >= 0; i--) {
      const j = 0 | (cc.rand() % (i + 1));
      const v = array[i];
      array[i] = array[j];
      array[j] = v;
    }
  }

  /**
   * Get Delta
   * @param {cc.Size} pos
   */
  getDelta(pos) {
    const locGridSize = this._gridSize;
    const idx = pos.width * locGridSize.height + pos.height;
    return cc.size(
      this._tilesOrder[idx] / locGridSize.height - pos.width,
      (this._tilesOrder[idx] % locGridSize.height) - pos.height
    );
  }

  /**
   * Place Tile
   * @param {cc.Point} pos
   * @param {cc.Tile} tile
   */
  placeTile(pos, tile) {
    const coords = this.getOriginalTile(pos);

    const step = this.target.grid.getStep();
    const locPosition = tile.position;
    coords.bl.x += locPosition.x * step.x;
    coords.bl.y += locPosition.y * step.y;

    coords.br.x += locPosition.x * step.x;
    coords.br.y += locPosition.y * step.y;

    coords.tl.x += locPosition.x * step.x;
    coords.tl.y += locPosition.y * step.y;

    coords.tr.x += locPosition.x * step.x;
    coords.tr.y += locPosition.y * step.y;

    this.setTile(pos, coords);
  }

  /**
   * Start with target
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    const locGridSize = this._gridSize;

    this._tilesCount = locGridSize.width * locGridSize.height;
    const locTilesOrder = this._tilesOrder;
    locTilesOrder.length = 0;

    /**
     * Use k to loop. Because m_nTilesCount is unsigned int,
     * and i is used later for int.
     */
    for (let k = 0; k < this._tilesCount; ++k) locTilesOrder[k] = k;
    this.shuffle(locTilesOrder, this._tilesCount);

    const locTiles = this._tiles;
    locTiles.length = 0;
    let tileIndex = 0;
    const tempSize = cc.size(0, 0);
    for (let i = 0; i < locGridSize.width; ++i) {
      for (let j = 0; j < locGridSize.height; ++j) {
        locTiles[tileIndex] = new cc.Tile();
        locTiles[tileIndex].position = cc.p(i, j);
        locTiles[tileIndex].startPosition = cc.p(i, j);
        tempSize.width = i;
        tempSize.height = j;
        locTiles[tileIndex].delta = this.getDelta(tempSize);
        ++tileIndex;
      }
    }
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number}  dt
   */
  update(dt) {
    let tileIndex = 0;
    const locGridSize = this._gridSize;
    const locTiles = this._tiles;
    let selTile;
    const locPos = cc.p(0, 0);
    for (let i = 0; i < locGridSize.width; ++i) {
      for (let j = 0; j < locGridSize.height; ++j) {
        locPos.x = i;
        locPos.y = j;
        selTile = locTiles[tileIndex];
        selTile.position.x = selTile.delta.width * dt;
        selTile.position.y = selTile.delta.height * dt;
        this.placeTile(locPos, selTile);
        ++tileIndex;
      }
    }
  }
};

/**
 * Creates the action with a random seed, the grid size and the duration. <br />
 * Reference the test cases (Effects Test)
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} seed
 * @return {cc.ShuffleTiles}
 */
cc.shuffleTiles = (duration, gridSize, seed) =>
  new cc.ShuffleTiles(duration, gridSize, seed);

/**
 * cc.FadeOutTRTiles action. Fades out the tiles in a Top-Right direction. <br />
 * Reference the test cases (Effects Test)
 */
cc.FadeOutTRTiles = class FadeOutTRTiles extends cc.TiledGrid3DAction {
  /**
   * Test function
   * @param {cc.Point} pos
   * @param {Number} time
   */
  testFunc(pos, time) {
    const locX = this._gridSize.width * time;
    const locY = this._gridSize.height * time;
    if (locX === this._gridSize.width && locY === this._gridSize.height)
      return 0.0;
    if (locX + locY === 0.0) return 1.0;
    return Math.pow((pos.x + pos.y) / (locX + locY), 6);
  }

  /**
   * Turn on Tile
   * @param {cc.Point} pos
   */
  turnOnTile(pos) {
    this.setTile(pos, this.getOriginalTile(pos));
  }

  /**
   * Turn Off Tile
   * @param {cc.Point} pos
   */
  turnOffTile(pos) {
    this.setTile(pos, new cc.Quad3());
  }

  /**
   * Transform tile
   * @param {cc.Point} pos
   * @param {Number} distance
   */
  transformTile(pos, distance) {
    const coords = this.getOriginalTile(pos);
    const step = this.target.grid.getStep();

    coords.bl.x += (step.x / 2) * (1.0 - distance);
    coords.bl.y += (step.y / 2) * (1.0 - distance);

    coords.br.x -= (step.x / 2) * (1.0 - distance);
    coords.br.y += (step.y / 2) * (1.0 - distance);

    coords.tl.x += (step.x / 2) * (1.0 - distance);
    coords.tl.y -= (step.y / 2) * (1.0 - distance);

    coords.tr.x -= (step.x / 2) * (1.0 - distance);
    coords.tr.y -= (step.y / 2) * (1.0 - distance);

    this.setTile(pos, coords);
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number}  dt
   */
  update(dt) {
    const locGridSize = this._gridSize;
    const locPos = cc.p(0, 0);
    let distance;
    for (let i = 0; i < locGridSize.width; ++i) {
      for (let j = 0; j < locGridSize.height; ++j) {
        locPos.x = i;
        locPos.y = j;
        distance = this.testFunc(locPos, dt);
        if (distance === 0) this.turnOffTile(locPos);
        else if (distance < 1) this.transformTile(locPos, distance);
        else this.turnOnTile(locPos);
      }
    }
  }
};

/**
 * Creates the action with the grid size and the duration. <br />
 * Reference the test cases (Effects Test)
 * @function
 * @param duration
 * @param gridSize
 * @return {cc.FadeOutTRTiles}
 */
cc.fadeOutTRTiles = (duration, gridSize) =>
  new cc.FadeOutTRTiles(duration, gridSize);

/**
 * cc.FadeOutBLTiles action. Fades out the tiles in a Bottom-Left direction. <br />
 * Reference the test cases (Effects Test)
 */
cc.FadeOutBLTiles = class FadeOutBLTiles extends cc.FadeOutTRTiles {
  /**
   * Test function
   * @param {cc.Point} pos
   * @param {Number} time
   */
  testFunc(pos, time) {
    const locX = this._gridSize.width * (1.0 - time);
    const locY = this._gridSize.height * (1.0 - time);
    if (locX + locY === 0) return 0.0;
    if (pos.x + pos.y === 0) return 1.0;

    return Math.pow((locX + locY) / (pos.x + pos.y), 6);
  }
};

/**
 * Creates the action with the grid size and the duration. <br />
 * Reference the test cases (Effects Test)
 * @function
 * @param duration
 * @param gridSize
 * @return {cc.FadeOutBLTiles}
 */
cc.fadeOutBLTiles = (duration, gridSize) =>
  new cc.FadeOutBLTiles(duration, gridSize);

/**
 * cc.FadeOutUpTiles action. Fades out the tiles in upwards direction. <br />
 * Reference the test cases (Effects Test)
 */
cc.FadeOutUpTiles = class FadeOutUpTiles extends cc.FadeOutTRTiles {
  /**
   * Test function
   * @param {cc.Point} pos
   * @param {Number} time
   */
  testFunc(pos, time) {
    const locY = this._gridSize.height * time;
    if (locY === this._gridSize.height) return 0.0;
    if (locY === 0.0) return 1.0;
    return Math.pow(pos.y / locY, 6);
  }

  transformTile(pos, distance) {
    const coords = this.getOriginalTile(pos);
    const step = this.target.grid.getStep();

    coords.bl.y += (step.y / 2) * (1.0 - distance);
    coords.br.y += (step.y / 2) * (1.0 - distance);
    coords.tl.y -= (step.y / 2) * (1.0 - distance);
    coords.tr.y -= (step.y / 2) * (1.0 - distance);

    this.setTile(pos, coords);
  }
};

/**
 * Creates the action with the grid size and the duration. <br />
 * Reference the test cases (Effects Test)
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @return {cc.FadeOutUpTiles}
 */
cc.fadeOutUpTiles = (duration, gridSize) =>
  new cc.FadeOutUpTiles(duration, gridSize);

/**
 * cc.FadeOutDownTiles action. Fades out the tiles in downwards direction. <br />
 * Reference the test cases (Effects Test)
 */
cc.FadeOutDownTiles = class FadeOutDownTiles extends cc.FadeOutUpTiles {
  /**
   * Test function
   * @param {cc.Point} pos
   * @param {Number} time
   */
  testFunc(pos, time) {
    const locY = this._gridSize.height * (1.0 - time);
    if (locY === 0.0) return 0.0;
    if (pos.y === 0) return 1.0;
    return Math.pow(locY / pos.y, 6);
  }
};

/**
 * Creates the action with the grid size and the duration. <br />
 * Reference the test cases (Effects Test)
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @return {cc.FadeOutDownTiles}
 */
cc.fadeOutDownTiles = (duration, gridSize) =>
  new cc.FadeOutDownTiles(duration, gridSize);

/**
 * cc.TurnOffTiles action.<br/>
 * Turn off the files in random order. <br />
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number|Null} [seed=0]
 * @example
 * // turnOffTiles without seed
 * var toff = new cc.TurnOffTiles(this._duration, cc.size(x, y));
 *
 * // turnOffTiles with seed
 * var toff = new cc.TurnOffTiles(this._duration, cc.size(x, y), 0);
 */
cc.TurnOffTiles = class TurnOffTiles extends cc.TiledGrid3DAction {
  _seed = null;
  _tilesCount = 0;
  _tilesOrder = null;

  /**
   * Creates the action with a random seed, the grid size and the duration.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number|Null} [seed=0]
   */
  constructor(duration, gridSize, seed) {
    super();
    this._tilesOrder = [];

    gridSize !== undefined && this.initWithDuration(duration, gridSize, seed);
  }

  /**
   * Initializes the action with a random seed, the grid size and the duration.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number|Null} [seed=0]
   * @return {Boolean}
   */
  initWithDuration(duration, gridSize, seed) {
    if (super.initWithDuration(duration, gridSize)) {
      this._seed = seed || 0;
      this._tilesOrder.length = 0;
      return true;
    }
    return false;
  }

  /**
   * Shuffle
   * @param {Array} array
   * @param {Number} len
   */
  shuffle(array, len) {
    for (let i = len - 1; i >= 0; i--) {
      const j = 0 | (cc.rand() % (i + 1));
      const v = array[i];
      array[i] = array[j];
      array[j] = v;
    }
  }

  /**
   * Turn on tile.
   * @param {cc.Point} pos
   */
  turnOnTile(pos) {
    this.setTile(pos, this.getOriginalTile(pos));
  }

  /**
   * Turn off title.
   * @param {cc.Point} pos
   */
  turnOffTile(pos) {
    this.setTile(pos, new cc.Quad3());
  }

  /**
   * called before the action start. It will also set the target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);

    this._tilesCount = this._gridSize.width * this._gridSize.height;
    const locTilesOrder = this._tilesOrder;
    locTilesOrder.length = 0;
    for (let i = 0; i < this._tilesCount; ++i) locTilesOrder[i] = i;
    this.shuffle(locTilesOrder, this._tilesCount);
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number}  dt
   */
  update(dt) {
    const l = 0 | (dt * this._tilesCount);
    const locGridSize = this._gridSize;
    let t;
    const tilePos = cc.p(0, 0);
    const locTilesOrder = this._tilesOrder;
    for (let i = 0; i < this._tilesCount; i++) {
      t = locTilesOrder[i];
      tilePos.x = 0 | (t / locGridSize.height);
      tilePos.y = t % (0 | locGridSize.height);
      if (i < l) this.turnOffTile(tilePos);
      else this.turnOnTile(tilePos);
    }
  }
};

/**
 * Creates the action with a random seed, the grid size and the duration. <br />
 * Reference the test cases (Effects Test)
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number|Null} [seed=0]
 * @return {cc.TurnOffTiles}
 * @example
 * // example
 * // turnOffTiles without seed
 * var toff = cc.turnOffTiles(this._duration, cc.size(x, y));
 *
 * // turnOffTiles with seed
 * var toff = cc.turnOffTiles(this._duration, cc.size(x, y), 0);
 */
cc.turnOffTiles = (duration, gridSize, seed) =>
  new cc.TurnOffTiles(duration, gridSize, seed);

/**
 * cc.WavesTiles3D action. <br />
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} waves
 * @param {Number} amplitude
 */
cc.WavesTiles3D = class WavesTiles3D extends cc.TiledGrid3DAction {
  _waves = 0;
  _amplitude = 0;
  _amplitudeRate = 0;

  /**
   * creates the action with a number of waves, the waves amplitude, the grid size and the duration.
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
   * get amplitude of waves
   * @return {Number}
   */
  getAmplitude() {
    return this._amplitude;
  }

  /**
   * set amplitude of waves
   * @param {Number} amplitude
   */
  setAmplitude(amplitude) {
    this._amplitude = amplitude;
  }

  /**
   * get amplitude rate of waves
   * @return {Number}
   */
  getAmplitudeRate() {
    return this._amplitudeRate;
  }

  /**
   * set amplitude rate of waves
   * @param {Number} amplitudeRate
   */
  setAmplitudeRate(amplitudeRate) {
    this._amplitudeRate = amplitudeRate;
  }

  /**
   * initializes the action with a number of waves, the waves amplitude, the grid size and the duration
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
   * @param {Number}  dt
   */
  update(dt) {
    const locGridSize = this._gridSize;
    const locWaves = this._waves;
    const locAmplitude = this._amplitude;
    const locAmplitudeRate = this._amplitudeRate;
    const locPos = cc.p(0, 0);
    let coords;
    for (let i = 0; i < locGridSize.width; i++) {
      for (let j = 0; j < locGridSize.height; j++) {
        locPos.x = i;
        locPos.y = j;
        coords = this.getOriginalTile(locPos);
        coords.bl.z =
          Math.sin(
            dt * Math.PI * locWaves * 2 + (coords.bl.y + coords.bl.x) * 0.01
          ) *
          locAmplitude *
          locAmplitudeRate;
        coords.br.z = coords.bl.z;
        coords.tl.z = coords.bl.z;
        coords.tr.z = coords.bl.z;
        this.setTile(locPos, coords);
      }
    }
  }
};

/**
 * creates the action with a number of waves, the waves amplitude, the grid size and the duration. <br />
 * Reference the test cases (Effects Test)
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} waves
 * @param {Number} amplitude
 * @return {cc.WavesTiles3D}
 */
cc.wavesTiles3D = (duration, gridSize, waves, amplitude) =>
  new cc.WavesTiles3D(duration, gridSize, waves, amplitude);

/**
 * cc.JumpTiles3D action.  A sin function is executed to move the tiles across the Z axis. <br />
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} numberOfJumps
 * @param {Number} amplitude
 */
cc.JumpTiles3D = class JumpTiles3D extends cc.TiledGrid3DAction {
  _jumps = 0;
  _amplitude = 0;
  _amplitudeRate = 0;

  /**
   * creates the action with the number of jumps, the sin amplitude, the grid size and the duration.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} numberOfJumps
   * @param {Number} amplitude
   */
  constructor(duration, gridSize, numberOfJumps, amplitude) {
    super();
    amplitude !== undefined &&
      this.initWithDuration(duration, gridSize, numberOfJumps, amplitude);
  }

  /**
   * get amplitude of the sin
   * @return {Number}
   */
  getAmplitude() {
    return this._amplitude;
  }

  /**
   * set amplitude of the sin
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
   * @param amplitudeRate
   */
  setAmplitudeRate(amplitudeRate) {
    this._amplitudeRate = amplitudeRate;
  }

  /**
   * initializes the action with the number of jumps, the sin amplitude, the grid size and the duration
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @param {Number} numberOfJumps
   * @param {Number} amplitude
   */
  initWithDuration(duration, gridSize, numberOfJumps, amplitude) {
    if (super.initWithDuration(duration, gridSize)) {
      this._jumps = numberOfJumps;
      this._amplitude = amplitude;
      this._amplitudeRate = 1.0;
      return true;
    }
    return false;
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number}  dt
   */
  update(dt) {
    const sinz =
      Math.sin(Math.PI * dt * this._jumps * 2) *
      this._amplitude *
      this._amplitudeRate;
    const sinz2 =
      Math.sin(Math.PI * (dt * this._jumps * 2 + 1)) *
      this._amplitude *
      this._amplitudeRate;

    const locGridSize = this._gridSize;
    const locGrid = this.target.grid;
    let coords;
    const locPos = cc.p(0, 0);
    for (let i = 0; i < locGridSize.width; i++) {
      for (let j = 0; j < locGridSize.height; j++) {
        locPos.x = i;
        locPos.y = j;
        // hack for html5
        // var coords = this.getOriginalTile(cc.p(i, j));
        coords = locGrid.getOriginalTile(locPos);

        if ((i + j) % 2 === 0) {
          coords.bl.z += sinz;
          coords.br.z += sinz;
          coords.tl.z += sinz;
          coords.tr.z += sinz;
        } else {
          coords.bl.z += sinz2;
          coords.br.z += sinz2;
          coords.tl.z += sinz2;
          coords.tr.z += sinz2;
        }
        // hack for html5
        // this.setTile(cc.p(i, j), coords);
        locGrid.setTile(locPos, coords);
      }
    }
  }
};

/**
 * creates the action with the number of jumps, the sin amplitude, the grid size and the duration. <br />
 * Reference the test cases (Effects Test)
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @param {Number} numberOfJumps
 * @param {Number} amplitude
 * @return {cc.JumpTiles3D}
 */
cc.jumpTiles3D = (duration, gridSize, numberOfJumps, amplitude) =>
  new cc.JumpTiles3D(duration, gridSize, numberOfJumps, amplitude);

/**
 * cc.SplitRows action. <br />
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {Number} rows
 */
cc.SplitRows = class SplitRows extends cc.TiledGrid3DAction {
  _rows = 0;
  _winSize = null;

  /**
   * creates the action with the number of rows to split and the duration.
   * @param {Number} duration
   * @param {Number} rows
   */
  constructor(duration, rows) {
    super();
    rows !== undefined && this.initWithDuration(duration, rows);
  }

  /**
   * initializes the action with the number of rows to split and the duration
   * @param {Number} duration
   * @param {Number} rows
   * @return {Boolean}
   */
  initWithDuration(duration, rows) {
    this._rows = rows;
    return super.initWithDuration(duration, cc.size(1, rows));
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number}  dt
   */
  update(dt) {
    const locGridSize = this._gridSize;
    const locWinSizeWidth = this._winSize.width;
    let coords;
    let direction;
    const locPos = cc.p(0, 0);
    for (let j = 0; j < locGridSize.height; ++j) {
      locPos.y = j;
      coords = this.getOriginalTile(locPos);
      direction = 1;

      if (j % 2 === 0) direction = -1;

      coords.bl.x += direction * locWinSizeWidth * dt;
      coords.br.x += direction * locWinSizeWidth * dt;
      coords.tl.x += direction * locWinSizeWidth * dt;
      coords.tr.x += direction * locWinSizeWidth * dt;

      this.setTile(locPos, coords);
    }
  }

  /**
   * called before the action start. It will also set the target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._winSize = cc.director.getWinSizeInPixels();
  }
};

/**
 * creates the action with the number of rows to split and the duration. <br />
 * Reference the test cases (Effects Test)
 * @function
 * @param {Number} duration
 * @param {Number} rows
 * @return {cc.SplitRows}
 */
cc.splitRows = (duration, rows) => new cc.SplitRows(duration, rows);

/**
 * cc.SplitCols action. <br />
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {Number} cols
 */
cc.SplitCols = class SplitCols extends cc.TiledGrid3DAction {
  _cols = 0;
  _winSize = null;

  /**
   * Creates the action with the number of columns to split and the duration.
   * @param {Number} duration
   * @param {Number} cols
   */
  constructor(duration, cols) {
    super();
    cols !== undefined && this.initWithDuration(duration, cols);
  }
  /**
   * initializes the action with the number of columns to split and the duration
   * @param {Number} duration
   * @param {Number} cols
   * @return {Boolean}
   */
  initWithDuration(duration, cols) {
    this._cols = cols;
    return super.initWithDuration(duration, cc.size(cols, 1));
  }

  /**
   * Called once per frame. Time is the number of seconds of a frame interval.
   * @param {Number}  dt
   */
  update(dt) {
    const locGridSizeWidth = this._gridSize.width;
    const locWinSizeHeight = this._winSize.height;
    let coords;
    let direction;
    const locPos = cc.p(0, 0);
    for (let i = 0; i < locGridSizeWidth; ++i) {
      locPos.x = i;
      coords = this.getOriginalTile(locPos);
      direction = 1;

      if (i % 2 === 0) direction = -1;

      coords.bl.y += direction * locWinSizeHeight * dt;
      coords.br.y += direction * locWinSizeHeight * dt;
      coords.tl.y += direction * locWinSizeHeight * dt;
      coords.tr.y += direction * locWinSizeHeight * dt;

      this.setTile(locPos, coords);
    }
    cc.rendererConfig.renderer.childrenOrderDirty = true;
  }

  /**
   * called before the action start. It will also set the target.
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    this._winSize = cc.director.getWinSizeInPixels();
  }
};

/**
 * creates the action with the number of columns to split and the duration.  <br />
 * Reference the test cases (Effects Test)
 * @function
 * @param {Number} duration
 * @param {Number} cols
 * @return {cc.SplitCols}
 */
cc.splitCols = (duration, cols) => new cc.SplitCols(duration, cols);
