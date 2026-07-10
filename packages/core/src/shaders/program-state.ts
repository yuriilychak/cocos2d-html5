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

import { log } from "../boot/debugger";
import Matrix4 from "../kazmath/mat4";
import GLProgram from "./gl-program";
import UniformValue from "./uniform-value";

export { default as UniformValue } from "./uniform-value";

type UniformLocation = WebGLUniformLocation & { _name?: string };
type ProgramUniform = WebGLActiveInfo & {
  _location: UniformLocation | null;
};
type UniformSetter =
  | "setInt"
  | "setFloat"
  | "setVec2"
  | "setVec2v"
  | "setVec3"
  | "setVec3v"
  | "setVec4"
  | "setVec4v"
  | "setMat4"
  | "setCallback";

export class GLProgramState {
  static #cache: Map<number, GLProgramState> = new Map();

  static getOrCreateWithGLProgram(glprogram: GLProgram): GLProgramState {
    let programState = GLProgramState.#cache.get(glprogram.__instanceId);
    if (!programState) {
      programState = new GLProgramState(glprogram);
      GLProgramState.#cache.set(glprogram.__instanceId, programState);
    }
    return programState;
  }

  #program: GLProgram;
  #uniforms: Map<string, UniformValue> = new Map();
  #boundTextureUnits: Map<string, number> = new Map();
  #textureUnitIndex: number = 1;

  constructor(program: GLProgram) {
    this.#program = program;

    const activeUniforms = program.context.getProgramParameter(
      program.program,
      program.context.ACTIVE_UNIFORMS
    );

    for (let i = 0; i < activeUniforms; i += 1) {
      const uniform = program.context.getActiveUniform(program.program, i);
      if (!uniform) {
        continue;
      }

      if (uniform.name.indexOf("CC_") !== 0) {
        const programUniform = uniform as ProgramUniform;
        programUniform._location = program.context.getUniformLocation(
          program.program,
          uniform.name
        );
        if (programUniform._location) {
          programUniform._location._name = uniform.name;
        }
        const uniformValue = new UniformValue(programUniform, program);
        this.#uniforms.set(uniform.name, uniformValue);
      }
    }
  }

  apply(modelView?: Matrix4): void {
    this.#program.use();

    if (modelView) {
      this.#program.setUniformForMVPMatrixWithMat4(modelView);
    }

    for (const uniformValue of this.#uniforms.values()) {
      uniformValue.apply();
    }
  }

  getUniformValue(uniform: string): UniformValue | undefined {
    return this.#uniforms.get(uniform);
  }

  setUniformInt(uniform: string, value: number): void {
    this.#setUniform(uniform, "setInt", value);
  }

  setUniformFloat(uniform: string, value: number): void {
    this.#setUniform(uniform, "setFloat", value);
  }

  setUniformVec2(uniform: string, v1: number, v2: number): void {
    this.#setUniform(uniform, "setVec2", v1, v2);
  }

  setUniformVec2v(uniform: string, value: Float32Array | number[]): void {
    this.#setUniform(uniform, "setVec2v", value);
  }

  setUniformVec3(uniform: string, v1: number, v2: number, v3: number): void {
    this.#setUniform(uniform, "setVec3", v1, v2, v3);
  }

  setUniformVec3v(uniform: string, value: Float32Array | number[]): void {
    this.#setUniform(uniform, "setVec3v", value);
  }

  setUniformVec4(
    uniform: string,
    v1: number,
    v2: number,
    v3: number,
    v4: number
  ): void {
    this.#setUniform(uniform, "setVec4", v1, v2, v3, v4);
  }

  setUniformVec4v(uniform: string, value: Float32Array | number[]): void {
    this.#setUniform(uniform, "setVec4v", value);
  }

  setUniformMat4(uniform: string, value: Float32Array | number[]): void {
    this.#setUniform(uniform, "setMat4", value);
  }

  setUniformCallback(
    uniform: string,
    callback: (program: GLProgram, uniform: ProgramUniform) => void
  ): void {
    this.#setUniform(uniform, "setCallback", callback);
  }

  setUniformTexture(uniform: string, texture: unknown): void {
    const uniformValue = this.getUniformValue(uniform);
    if (uniformValue) {
      const textureUnit = this.#boundTextureUnits.get(uniform);
      if (textureUnit) {
        uniformValue.setTexture(texture, textureUnit);
      } else {
        uniformValue.setTexture(texture, this.#textureUnitIndex);
        this.#boundTextureUnits.set(uniform, this.#textureUnitIndex++);
      }
    }
  }

  #setUniform(uniform: string, method: UniformSetter, ...values: unknown[]): void {
    const uniformValue = this.getUniformValue(uniform);

    if (!uniformValue) {
      log("cocos2d: warning: Uniform not found: " + uniform);
      return;
    }

    (uniformValue[method] as (...args: unknown[]) => void)(...values);
  }

  set program(program: GLProgram) {
    this.#program = program;
  }

  get program(): GLProgram {
    return this.#program;
  }

  get uniformCount(): number {
    return this.#uniforms.size;
  }
}
