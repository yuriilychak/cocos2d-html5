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
 * Base class for Grid actions
 * @class
 * @extends cc.ActionInterval
 * @param {Number} duration
 * @param {cc.Size} gridSize
 */
cc.GridAction = class GridAction extends cc.ActionInterval {
  /** @lends cc.GridAction# */
  _gridSize = null;
  _gridNodeTarget = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   */
  constructor(duration, gridSize) {
    cc.sys._checkWebGLRenderMode();
    super();
    this._gridSize = cc.size(0, 0);

    gridSize && this.initWithDuration(duration, gridSize);
  }

  _cacheTargetAsGridNode(target) {
    this._gridNodeTarget = target;
  }

  /**
   * to copy object with deep copy.
   * returns a clone of action.
   *
   * @return {cc.GridAction}
   */
  clone() {
    const action = new cc.GridAction();
    const locGridSize = this._gridSize;
    action.initWithDuration(
      this._duration,
      cc.size(locGridSize.width, locGridSize.height)
    );
    return action;
  }

  /**
   * called before the action start. It will also set the target.
   *
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    cc.renderer.childrenOrderDirty = true;
    this._cacheTargetAsGridNode(target);

    const newGrid = this.getGrid();

    const targetGrid = this._gridNodeTarget.getGrid();
    if (targetGrid && targetGrid.getReuseGrid() > 0) {
      const locGridSize = targetGrid.getGridSize();
      if (
        targetGrid.isActive() &&
        locGridSize.width === this._gridSize.width &&
        locGridSize.height === this._gridSize.height
      )
        targetGrid.reuse();
    } else {
      if (targetGrid && targetGrid.isActive()) targetGrid.setActive(false);
      this._gridNodeTarget.setGrid(newGrid);
      this._gridNodeTarget.getGrid().setActive(true);
    }
  }

  /**
   * Create a cc.ReverseTime action. Opposite with the original motion trajectory.
   * @return {cc.ReverseTime}
   */
  reverse() {
    return new cc.ReverseTime(this);
  }

  /**
   * Initializes the action with size and duration.
   * @param {Number} duration
   * @param {cc.Size} gridSize
   * @return {Boolean}
   */
  initWithDuration(duration, gridSize) {
    if (super.initWithDuration(duration)) {
      this._gridSize.width = gridSize.width;
      this._gridSize.height = gridSize.height;
      return true;
    }
    return false;
  }

  /**
   * Returns the grid.
   * @return {cc.GridBase}
   */
  getGrid() {
    // Abstract class needs implementation
    cc.log("cc.GridAction.getGrid(): it should be overridden in subclass.");
  }
};

/**
 * creates the action with size and duration
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @return {cc.GridAction}
 */
cc.gridAction = (duration, gridSize) => new cc.GridAction(duration, gridSize);

/**
 * Base class for cc.Grid3D actions. <br/>
 * Grid3D actions can modify a non-tiled grid.
 * @class
 * @extends cc.GridAction
 */
cc.Grid3DAction = class Grid3DAction extends cc.GridAction {
  /**
   * returns the grid
   * @return {cc.Grid3D}
   */
  getGrid() {
    return new cc.Grid3D(
      this._gridSize,
      undefined,
      undefined,
      this._gridNodeTarget.getGridRect()
    );
  }

  /**
   * get rect of the grid
   * @return {cc.Rect} rect
   */
  getGridRect() {
    return this._gridNodeTarget.getGridRect();
  }

  /**
   * returns the vertex than belongs to certain position in the grid
   * @param {cc.Point} position
   * @return {cc.Vertex3F}
   */
  getVertex(position) {
    return this.target.grid.getVertex(position);
  }

  /**
   * returns the non-transformed vertex that belongs to certain position in the grid
   * @param {cc.Point} position
   * @return {cc.Vertex3F}
   */
  getOriginalVertex(position) {
    return this.target.grid.getOriginalVertex(position);
  }

  /**
   * sets a new vertex to a certain position of the grid
   * @param {cc.Point} position
   * @param {cc.Vertex3F} vertex
   */
  setVertex(position, vertex) {
    this.target.grid.setVertex(position, vertex);
  }
};

/**
 * creates the action with size and duration
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @return {cc.Grid3DAction}
 */
cc.grid3DAction = (duration, gridSize) =>
  new cc.Grid3DAction(duration, gridSize);

/**
 * Base class for cc.TiledGrid3D actions.
 * @class
 * @extends cc.GridAction
 */
cc.TiledGrid3DAction = class TiledGrid3DAction extends cc.GridAction {
  /**
   * returns the tile that belongs to a certain position of the grid
   * @param {cc.Point} position
   * @return {cc.Quad3}
   */
  getTile(position) {
    return this.target.grid.tile(position);
  }

  /**
   * returns the non-transformed tile that belongs to a certain position of the grid
   * @param {cc.Point} position
   * @return {cc.Quad3}
   */
  getOriginalTile(position) {
    return this.target.grid.getOriginalTile(position);
  }

  /**
   * sets a new tile to a certain position of the grid
   * @param {cc.Point} position
   * @param {cc.Quad3} coords
   */
  setTile(position, coords) {
    this.target.grid.setTile(position, coords);
  }

  /**
   * returns the grid
   * @return {cc.TiledGrid3D}
   */
  getGrid() {
    return new cc.TiledGrid3D(
      this._gridSize,
      undefined,
      undefined,
      this._gridNodeTarget.getGridRect()
    );
  }
};

/**
 * Creates the action with duration and grid size
 * @function
 * @param {Number} duration
 * @param {cc.Size} gridSize
 * @return {cc.TiledGrid3DAction}
 */
cc.tiledGrid3DAction = (duration, gridSize) =>
  new cc.TiledGrid3DAction(duration, gridSize);

/**
 * <p>
 * cc.StopGrid action.                                               <br/>
 * @warning Don't call this action if another grid action is active.                 <br/>
 * Call if you want to remove the the grid effect. Example:                          <br/>
 * cc.sequence(Lens.action(...), cc.stopGrid(...), null);              <br/>
 * </p>
 * @class
 * @extends cc.ActionInstant
 */
cc.StopGrid = class StopGrid extends cc.ActionInstant {
  /**
   * called before the action start. It will also set the target.
   *
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    cc.renderer.childrenOrderDirty = true;
    const grid = this.target.grid;
    if (grid && grid.isActive()) grid.setActive(false);
  }
};

/**
 * Allocates and initializes the action
 * @function
 * @return {cc.StopGrid}
 */
cc.stopGrid = () => new cc.StopGrid();

/**
 * cc.ReuseGrid action
 * @class
 * @extends cc.ActionInstant
 * @param {Number} times
 */
cc.ReuseGrid = class ReuseGrid extends cc.ActionInstant {
  /** @lends cc.ReuseGrid# */
  _times = null;

  /**
   * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
   * @param {Number} times
   */
  constructor(times) {
    super();
    times !== undefined && this.initWithTimes(times);
  }

  /**
   * initializes an action with the number of times that the current grid will be reused
   * @param {Number} times
   * @return {Boolean}
   */
  initWithTimes(times) {
    this._times = times;
    return true;
  }

  /**
   * called before the action start. It will also set the target.
   *
   * @param {cc.Node} target
   */
  startWithTarget(target) {
    super.startWithTarget(target);
    cc.renderer.childrenOrderDirty = true;
    if (this.target.grid && this.target.grid.isActive())
      this.target.grid.setReuseGrid(
        this.target.grid.getReuseGrid() + this._times
      );
  }
};

/**
 * creates an action with the number of times that the current grid will be reused
 * @function
 * @param {Number} times
 * @return {cc.ReuseGrid}
 */
cc.reuseGrid = (times) => new cc.ReuseGrid(times);
