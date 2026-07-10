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

import { UniformValueType } from "../enums";
import { ServiceLocator } from "../service-locator";
import GLProgram from "./gl-program";

type UniformLocationInput = WebGLUniformLocation | string | null;
type UniformValueArray = Float32Array | number[];
type UniformInfo = WebGLActiveInfo & {
  _location: UniformLocationInput;
};
type UniformCallback = (program: GLProgram, uniform: UniformInfo) => void;
type UniformStoredValue = number | UniformValueArray | UniformCallback | null;

export default class UniformValue {
  #uniform: UniformInfo;
  #program: GLProgram;
  #value: UniformStoredValue = null;
  #type: UniformValueType = UniformValueType.NONE;
  #textureId: unknown = null;

  constructor(uniform: UniformInfo, glprogram: GLProgram) {
    this.#uniform = uniform;
    this.#program = glprogram;
  }

  setFloat(value: number): void {
    this.#value = value;
    this.#type = UniformValueType.GL_FLOAT;
  }

  setInt(value: number): void {
    this.#value = value;
    this.#type = UniformValueType.GL_INT;
  }

  setVec2(v1: number, v2: number): void {
    this.#value = [v1, v2];
    this.#type = UniformValueType.GL_FLOAT_VEC2;
  }

  setVec2v(value: UniformValueArray): void {
    this.#value = value.slice(0);
    this.#type = UniformValueType.GL_FLOAT_VEC2;
  }

  setVec3(v1: number, v2: number, v3: number): void {
    this.#value = [v1, v2, v3];
    this.#type = UniformValueType.GL_FLOAT_VEC3;
  }

  setVec3v(value: UniformValueArray): void {
    this.#value = value.slice(0);
    this.#type = UniformValueType.GL_FLOAT_VEC3;
  }

  setVec4(v1: number, v2: number, v3: number, v4: number): void {
    this.#value = [v1, v2, v3, v4];
    this.#type = UniformValueType.GL_FLOAT_VEC4;
  }

  setVec4v(value: UniformValueArray): void {
    this.#value = value.slice(0);
    this.#type = UniformValueType.GL_FLOAT_VEC4;
  }

  setMat4(value: UniformValueArray): void {
    this.#value = value.slice(0);
    this.#type = UniformValueType.GL_FLOAT_MAT4;
  }

  setCallback(fn: UniformCallback): void {
    this.#value = fn;
    this.#type = UniformValueType.GL_CALLBACK;
  }

  setTexture(textureId: unknown, textureUnit: number): void {
    this.#value = textureUnit;
    this.#textureId = textureId;
    this.#type = UniformValueType.GL_TEXTURE;
  }

  apply(): void {
    switch (this.#type) {
      case UniformValueType.GL_INT:
        this.#program.setUniformLocationWith1i(
          this.#uniform._location,
          this.#value as number
        );
        break;
      case UniformValueType.GL_FLOAT:
        this.#program.setUniformLocationWith1f(
          this.#uniform._location,
          this.#value as number
        );
        break;
      case UniformValueType.GL_FLOAT_VEC2:
        this.#program.setUniformLocationWith2fv(
          this.#uniform._location,
          this.#value as UniformValueArray
        );
        break;
      case UniformValueType.GL_FLOAT_VEC3:
        this.#program.setUniformLocationWith3fv(
          this.#uniform._location,
          this.#value as UniformValueArray
        );
        break;
      case UniformValueType.GL_FLOAT_VEC4:
        this.#program.setUniformLocationWith4fv(
          this.#uniform._location,
          this.#value as UniformValueArray
        );
        break;
      case UniformValueType.GL_FLOAT_MAT4:
        this.#program.setUniformLocationWithMatrix4fv(
          this.#uniform._location,
          this.#value as UniformValueArray
        );
        break;
      case UniformValueType.GL_CALLBACK:
        (this.#value as UniformCallback)(this.#program, this.#uniform);
        break;
      case UniformValueType.GL_TEXTURE:
        this.#program.setUniformLocationWith1i(
          this.#uniform._location,
          this.#value as number
        );
        ServiceLocator.glStateCache.bindTexture2DN(
          this.#value as number,
          this.#textureId
        );
        break;
      default:
    }
  }
}
