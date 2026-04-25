/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2009      On-Core

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

import {
  NewClass,
  Sys,
  Director,
  Rect,
  Point,
  Size,
  NextPOT,
  log,
  Texture2D,
  RendererConfig,
  GLProgramState,
  ShaderCache,
  SHADER_POSITION_TEXTURE,
  glBindTexture2D,
  setProjectionMatrixDirty,
  kmGLMatrixMode,
  kmGLLoadIdentity,
  kmGLMultMatrix,
  KM_GL_PROJECTION,
  KM_GL_MODELVIEW,
  Matrix4
} from "@aspect/core";
import { Grabber } from "./grabber.js";

/**
 * Base class for Grid
 */
export class GridBase extends NewClass {
  /**
   * create one GridBase Object
   * Constructor of GridBase
   * @param {Size} gridSize
   * @param {Texture2D} [texture=]
   * @param {Boolean} [flipped=]
   * @param {Rect} rect
   */
  constructor(gridSize, texture, flipped, rect) {
    Sys.getInstance()._checkWebGLRenderMode();
    super();
    this._active = false;
    this._reuseGrid = 0;
    this._gridSize = null;
    this._gridRect = new Rect();
    this._texture = null;
    this._step = new Point(0, 0);
    this._grabber = null;
    this._isTextureFlipped = false;
    this._glProgramState = null;
    this._directorProjection = 0;
    this._dirty = false;

    if (gridSize !== undefined)
      this.initWithSize(gridSize, texture, flipped, rect);
  }

  /**
   * whether or not the grid is active
   * @return {Boolean}
   */
  isActive() {
    return this._active;
  }

  /**
   * whether or not the grid is active
   * @param {Number} active
   */
  setActive(active) {
    this._active = active;
    if (!active) {
      const director = Director.getInstance();
      const proj = director.getProjection();
      director.setProjection(proj);
    }
  }

  /**
   * get number of times that the grid will be reused
   * @return {Number}
   */
  getReuseGrid() {
    return this._reuseGrid;
  }

  /**
   * set number of times that the grid will be reused
   * @param reuseGrid
   */
  setReuseGrid(reuseGrid) {
    this._reuseGrid = reuseGrid;
  }

  /**
   * get size of the grid
   * @return {Size}
   */
  getGridSize() {
    return new Size(this._gridSize.width, this._gridSize.height);
  }

  /**
   * set size of the grid
   * @param {Size} gridSize
   */
  setGridSize(gridSize) {
    this._gridSize.width = parseInt(gridSize.width);
    this._gridSize.height = parseInt(gridSize.height);
  }

  /**
   * set rect of the grid
   * @param {Rect} rect
   */
  setGridRect(rect) {
    this._gridRect = rect;
  }

  /**
   * get rect of the grid
   * @return {Rect} rect
   */
  getGridRect() {
    return this._gridRect;
  }

  /**
   * get pixels between the grids
   * @return {Point}
   */
  getStep() {
    return new Point(this._step.x, this._step.y);
  }

  /**
   * set pixels between the grids
   * @param {Point} step
   */
  setStep(step) {
    this._step.x = step.x;
    this._step.y = step.y;
  }

  /**
   * get whether or not the texture is flipped
   * @return {Boolean}
   */
  isTextureFlipped() {
    return this._isTextureFlipped;
  }

  /**
   * set whether or not the texture is flipped
   * @param {Boolean} flipped
   */
  setTextureFlipped(flipped) {
    if (this._isTextureFlipped !== flipped) {
      this._isTextureFlipped = flipped;
      this.calculateVertexPoints();
    }
  }

  /**
   *
   * @param {Size} gridSize
   * @param {Texture2D} [texture=]
   * @param {Boolean} [flipped=false]
   * @param {Rect} [rect=]
   * @returns {boolean}
   */
  initWithSize(gridSize, texture, flipped, rect) {
    if (!texture) {
      const director = Director.getInstance();
      const winSize = director.getWinSizeInPixels();

      const POTWide = NextPOT(winSize.width);
      const POTHigh = NextPOT(winSize.height);

      const data = new Uint8Array(POTWide * POTHigh * 4);
      if (!data) {
        log("cocos2d: CCGrid: not enough memory.");
        return false;
      }

      texture = new Texture2D();
      // we only use rgba8888
      texture.initWithData(
        data,
        Texture2D.PIXEL_FORMAT_RGBA8888,
        POTWide,
        POTHigh,
        winSize
      );
      if (!texture) {
        log("cocos2d: CCGrid: error creating texture");
        return false;
      }
    }

    flipped = flipped || false;

    this._active = false;
    this._reuseGrid = 0;
    this._gridSize = gridSize;
    this._texture = texture;
    this._isTextureFlipped = flipped;
    if (rect === undefined || Rect.equalToZero(rect)) {
      const size = this._texture.getContentSize();
      rect = new Rect(0, 0, size.width, size.height);
    }

    this._gridRect = rect;

    this._step.x = this._gridRect.width / gridSize.width;
    this._step.y = this._gridRect.height / gridSize.height;

    this._grabber = new Grabber();
    if (!this._grabber) return false;
    this._grabber.grab(this._texture);
    this._glProgramState = GLProgramState.getOrCreateWithGLProgram(
      ShaderCache.getInstance().programForKey(SHADER_POSITION_TEXTURE)
    );
    this.calculateVertexPoints();
    return true;
  }

  beforeDraw() {
    // save projection
    this._directorProjection = Director.getInstance().getProjection();

    //this.set2DProjection();    //TODO why?
    const size = Director.getInstance().getWinSizeInPixels();
    gl.viewport(0, 0, size.width, size.height);
    this._grabber.beforeRender(this._texture);
  }

  afterDraw(target) {
    this._grabber.afterRender(this._texture);

    // restore projection
    //Director.getInstance().setProjection(this._directorProjection);
    Director.getInstance().setViewport();

    glBindTexture2D(this._texture);
    this.beforeBlit();
    this.blit(target);
    this.afterBlit();
  }

  beforeBlit() {}

  afterBlit() {}

  blit() {
    log("GridBase.blit(): Shall be overridden in subclass.");
  }

  reuse() {
    log("GridBase.reuse(): Shall be overridden in subclass.");
  }

  calculateVertexPoints() {
    log(
      "GridBase.calculateVertexPoints(): Shall be overridden in subclass."
    );
  }

  set2DProjection() {
    const winSize = Director.getInstance().getWinSizeInPixels();

    const gl = RendererConfig.getInstance().renderContext;
    gl.viewport(0, 0, winSize.width, winSize.height);
    kmGLMatrixMode(KM_GL_PROJECTION);
    kmGLLoadIdentity();

    const orthoMatrix = Matrix4.createOrthographicProjection(
      0,
      winSize.width,
      0,
      winSize.height,
      -1,
      1
    );
    kmGLMultMatrix(orthoMatrix);

    kmGLMatrixMode(KM_GL_MODELVIEW);
    kmGLLoadIdentity();
    setProjectionMatrixDirty();
  }
}
