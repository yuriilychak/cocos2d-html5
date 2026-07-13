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

import { BaseClass } from "../../platform/class";
import { log, assert, _LogInfos } from "../../boot/debugger";
import { isString } from "../../boot/utils";
import { Texture2D, type Texture2DInterface } from "../texture-2d";
import TextureAtlasCanvasRenderer from "./texture-atlas-canvas-renderer";
import TextureAtlasWebGLRenderer from "./texture-atlas-webgl-renderer";
import { ServiceLocator } from "../../service-locator";
import type { V3F_C4B_T2F_Quad } from "../../platform/types";
import type {
  TextureAtlasInterface,
  TextureAtlasRendererInterface
} from "./types";

/**
 * <p>A class that implements a Texture Atlas. <br />
 * Supported features: <br />
 * The atlas file can be a PNG, JPG. <br />
 * Quads can be updated in runtime <br />
 * Quads can be added in runtime <br />
 * Quads can be removed in runtime <br />
 * Quads can be re-ordered in runtime <br />
 * The TextureAtlas capacity can be increased or decreased in runtime.</p>
 */
export class TextureAtlas extends BaseClass implements TextureAtlasInterface {
  #capacity: number = 0;
  #texture: Texture2DInterface | null = null;
  #totalQuads: number = 0;
  #renderer: TextureAtlasRendererInterface;

  /**
   * <p>Creates a TextureAtlas with an filename and with an initial capacity for Quads. <br />
   * The TextureAtlas capacity can be increased in runtime. </p>
   * Constructor of TextureAtlas
   * 1.
   * //creates a TextureAtlas with  filename
   * var textureAtlas = new TextureAtlas("res/hello.png", 3);
   * 2.
   * //creates a TextureAtlas with texture
   * var texture = ServiceLocator.textureCache.addImage("hello.png");
   * var textureAtlas = new TextureAtlas(texture, 3);
   */
  constructor(fileName?: string | Texture2DInterface, capacity: number = 0) {
    super();

    // Initialize renderer based on render type
    this.#renderer = ServiceLocator.sys.rendererConfig.isCanvas
      ? new TextureAtlasCanvasRenderer(this)
      : new TextureAtlasWebGLRenderer(this);

    if (isString(fileName)) {
      this.initWithFile(fileName, capacity);
    } else if (fileName instanceof Texture2D) {
      this.initWithTexture(fileName, capacity);
    }
  }

  copyQuadsToTextureAtlas(
    quads: V3F_C4B_T2F_Quad[] | null,
    index: number
  ): void {
    this.#renderer.copyQuadsToTextureAtlas(quads, index);
  }

  markDirty(): void {
    this.#renderer.markDirty();
  }

  /**
   * String representation.
   */
  toString(): string {
    return "<TextureAtlas | totalQuads =" + this.#totalQuads + ">";
  }

  /**
   * <p>Initializes a TextureAtlas with a filename and with a certain capacity for Quads.<br />
   * The TextureAtlas capacity can be increased in runtime.<br />
   * WARNING: Do not reinitialize the TextureAtlas because it will leak memory. </p>
   * @example
   * //example
   * var textureAtlas = new TextureAtlas();
   * textureAtlas.initWithTexture("hello.png", 3);
   */
  initWithFile(file: string, capacity: number): boolean {
    // retained in property
    var texture = ServiceLocator.textureCache.addImage(file);
    if (texture) {
      return this.initWithTexture(texture, capacity);
    } else {
      log(_LogInfos.TextureAtlas_initWithFile, file);
      return false;
    }
  }

  /**
   * <p>Initializes a TextureAtlas with a previously initialized Texture2D object, and<br />
   * with an initial capacity for Quads.<br />
   * The TextureAtlas capacity can be increased in runtime.<br />
   * WARNING: Do not reinitialize the TextureAtlas because it will leak memory</p>
   * @example
   * //example
   * var texture = ServiceLocator.textureCache.addImage("hello.png");
   * var textureAtlas = new TextureAtlas();
   * textureAtlas.initWithTexture(texture, 3);
   */
  initWithTexture(texture: Texture2DInterface, capacity: number): boolean {
    assert(texture, _LogInfos.TextureAtlas_initWithTexture);

    capacity = 0 | capacity;
    this.#capacity = capacity;
    this.#totalQuads = 0;

    // retained in property
    this.#texture = texture;

    return this.#renderer.initWithCapacity(capacity);
  }

  /**
   * <p>Updates a Quad (texture, vertex and color) at a certain index <br />
   * index must be between 0 and the atlas capacity - 1 </p>
   * @param {V3F_C4B_T2F_Quad} quad
   * @param {Number} index
   */
  updateQuad(quad: V3F_C4B_T2F_Quad, index: number): void {
    assert(quad, _LogInfos.TextureAtlas_updateQuad);
    assert(
      index >= 0 && index < this.#capacity,
      _LogInfos.TextureAtlas_updateQuad_2
    );

    this.#totalQuads = Math.max(index + 1, this.#totalQuads);
    this.#renderer.updateQuad(quad, index);
  }

  /**
   * <p>Inserts a Quad (texture, vertex and color) at a certain index<br />
   * index must be between 0 and the atlas capacity - 1 </p>
   */
  insertQuad(quad: V3F_C4B_T2F_Quad, index: number): void {
    assert(index < this.#capacity, _LogInfos.TextureAtlas_insertQuad_2);

    this.#totalQuads++;
    if (this.#totalQuads > this.#capacity) {
      log(_LogInfos.TextureAtlas_insertQuad);
      return;
    }
    this.#renderer.insertQuad(quad, index);
  }

  /**
   * <p>
   *      Inserts a c array of quads at a given index                                           <br />
   *      index must be between 0 and the atlas capacity - 1                                    <br />
   *      this method doesn't enlarge the array when amount + index > totalQuads                <br />
   * </p>
   */
  insertQuads(
    quads: V3F_C4B_T2F_Quad[],
    index: number,
    amount: number = quads.length
  ): void {
    assert(
      index + amount <= this.#capacity,
      _LogInfos.TextureAtlas_insertQuads
    );

    this.#totalQuads += amount;
    if (this.#totalQuads > this.#capacity) {
      log(_LogInfos.TextureAtlas_insertQuad);
      return;
    }
    this.#renderer.insertQuads(quads, index, amount);
  }

  /**
   * <p>Removes the quad that is located at a certain index and inserts it at a new index <br />
   * This operation is faster than removing and inserting in a quad in 2 different steps</p>
   */
  insertQuadFromIndex(fromIndex: number, newIndex: number): void {
    if (fromIndex === newIndex) return;

    assert(
      newIndex >= 0 || newIndex < this.#totalQuads,
      _LogInfos.TextureAtlas_insertQuadFromIndex
    );

    assert(
      fromIndex >= 0 || fromIndex < this.#totalQuads,
      _LogInfos.TextureAtlas_insertQuadFromIndex_2
    );

    this.#renderer.insertQuadFromIndex(fromIndex, newIndex);
  }

  /**
   * <p>Removes a quad at a given index number.<br />
   * The capacity remains the same, but the total number of quads to be drawn is reduced in 1 </p>
   */
  removeQuadAtIndex(index: number): void {
    assert(index < this.#totalQuads, _LogInfos.TextureAtlas_removeQuadAtIndex);

    this.#totalQuads--;
    this.#renderer.removeQuadAtIndex(index);
  }

  /**
   * Removes a given number of quads at a given index
   */
  removeQuadsAtIndex(index: number, amount: number): void {
    assert(
      index + amount <= this.#totalQuads,
      _LogInfos.TextureAtlas_removeQuadsAtIndex
    );

    this.#totalQuads -= amount;
    this.#renderer.removeQuadsAtIndex(index, amount);
  }

  /**
   * <p>Removes all Quads. <br />
   * The TextureAtlas capacity remains untouched. No memory is freed.<br />
   * The total number of quads to be drawn will be 0</p>
   */
  removeAllQuads(): void {
    this.#totalQuads = 0;
    this.#renderer.removeAllQuads();
  }

  /**
   * Used internally by ParticleBatchNode                                    <br/>
   * don't use this unless you know what you're doing
   */
  increaseTotalQuadsWith(amount: number): void {
    this.#totalQuads += amount;
  }

  /**
   * Moves an amount of quads from oldIndex at newIndex
   */
  moveQuadsFromIndex(
    oldIndex: number,
    amount: number,
    newIndex?: number
  ): void {
    if (newIndex === undefined) {
      newIndex = amount;
      amount = this.#totalQuads - oldIndex;

      assert(
        newIndex + (this.#totalQuads - oldIndex) <= this.#capacity,
        _LogInfos.TextureAtlas_moveQuadsFromIndex
      );

      if (amount === 0) {
        return;
      }
    } else {
      assert(
        newIndex + amount <= this.#totalQuads,
        _LogInfos.TextureAtlas_moveQuadsFromIndex_2
      );
      assert(
        oldIndex < this.#totalQuads,
        _LogInfos.TextureAtlas_moveQuadsFromIndex_3
      );

      if (oldIndex === newIndex) {
        return;
      }
    }

    this.#renderer.moveQuadsFromIndex(oldIndex, amount, newIndex);
  }

  /**
   * Ensures that after a realloc quads are still empty                                <br/>
   * Used internally by ParticleBatchNode
   */
  fillWithEmptyQuadsFromIndex(index: number, amount: number): void {
    this.#renderer.fillWithEmptyQuadsFromIndex(index, amount);
  }

  // TextureAtlas - Drawing

  /**
   * <p>Draws n quads from an index (offset). <br />
   * n + start can't be greater than the capacity of the atlas</p>
   */
  drawNumberOfQuads(n: number, start?: number): void {
    this.#renderer.drawNumberOfQuads(n, start);
  }

  /**
   * Draws all the Atlas's Quads
   */
  drawQuads(): void {
    this.drawNumberOfQuads(this.#totalQuads, 0);
  }

  releaseBuffer(): void {
    this.#renderer.releaseBuffer();
  }

  /**
   * Texture of the texture atlas
   */
  get texture(): Texture2DInterface | null {
    return this.#texture;
  }

  set texture(texture: Texture2DInterface | null) {
    this.#texture = texture;
  }

  get totalQuads(): number {
    return this.#totalQuads;
  }

  get capacity(): number {
    return this.#capacity;
  }

  /**
   * <p>Sets the capacity of the TextureAtlas.<br />
   * The new capacity can be lower or higher than the current one</p>
   */
  set capacity(value: number) {
    if (value === this.#capacity) {
      return;
    }

    const oldCapacity = this.#capacity;
    // update capacity and totalQuads
    this.#totalQuads = Math.min(this.#totalQuads, value);
    this.#capacity = 0 | value;
    this.#renderer.resizeCapacity(this.#capacity, oldCapacity);
  }

  get quads(): V3F_C4B_T2F_Quad[] | null {
    return this.#renderer.quads;
  }

  set quads(value: V3F_C4B_T2F_Quad[] | null) {
    this.#renderer.quads = value;
  }
}
