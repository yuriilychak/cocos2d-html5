/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright 2011 Jeff Lamarche
 Copyright 2012 Goffredo Marocchi

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

import { BaseClass } from "../platform/class";
import { log } from "../boot/debugger";

import Matrix4 from "../kazmath/mat4";
import { KMGLMatrix } from "../kazmath/km-gl-matrix";
import { checkGLErrorDebug } from "../platform/macro/utils";
import { ServiceLocator } from "../service-locator";
import { CONFIG_KEY, UniformName } from "../enums";
import { WebGLContext } from "../sys/types";
import type {
  ResolvedUniformLocation,
  UniformLocationInput,
  UniformMethodArg
} from "./types";

/**
 * Class that implements a WebGL program
 */
export default class GLProgram extends BaseClass {
  #context!: WebGL2RenderingContext | WebGLRenderingContext;
  #program: WebGLProgram | null = null;
  #vertShader: WebGLShader | null = null;
  #fragShader: WebGLShader | null = null;
  #uniforms: Map<string, WebGLUniformLocation | null> = new Map();
  #uniformValueCache: Map<string, any[]> = new Map();
  #usesTime: boolean = false;
  #projectionUpdated: number = -1;
  #texturesUniformLocation: WebGLUniformLocation | null = null;
  static #highpSupported: boolean | null = null;

  /**
   * Create a GLProgram object
   */
  constructor(
    vShaderFileName: string = "",
    fShaderFileName: string = "",
    glContext: WebGLContext | null = null
  ) {
    super();
    this.#context =
      glContext || ServiceLocator.sys.rendererConfig.renderContext;

    if (vShaderFileName && fShaderFileName) {
      this.init(vShaderFileName, fShaderFileName);
    }
  }

  /**
   * destroy program
   */
  destroyProgram(): void {
    this.#clearShaders();
    this.#uniforms.clear();
    this.#uniformValueCache.clear();
    this.#context.deleteProgram(this.program);
  }

  /**
   * Initializes the GLProgram with a vertex and fragment with string
   */
  initWithVertexShaderByteArray(
    vertShaderStr: string,
    fragShaderStr: string
  ): boolean {
    this.#program = this.#context!.createProgram();
    //checkGLErrorDebug();

    this.#clearShaders();

    if (vertShaderStr) {
      this.#vertShader = this.#context!.createShader(
        this.#context!.VERTEX_SHADER
      )!;
      if (
        !this.#compileShader(
          this.#vertShader!,
          this.#context!.VERTEX_SHADER,
          vertShaderStr
        )
      ) {
        log("cocos2d: ERROR: Failed to compile vertex shader");
      }
    }

    // Create and compile fragment shader
    if (fragShaderStr) {
      this.#fragShader = this.#context!.createShader(
        this.#context!.FRAGMENT_SHADER
      )!;
      if (
        !this.#compileShader(
          this.#fragShader,
          this.#context!.FRAGMENT_SHADER,
          fragShaderStr
        )
      ) {
        log("cocos2d: ERROR: Failed to compile fragment shader");
      }
    }

    if (this.#vertShader)
      this.#context!.attachShader(this.program, this.#vertShader);
    checkGLErrorDebug();

    if (this.#fragShader)
      this.#context!.attachShader(this.program, this.#fragShader);

    if (this.#uniformValueCache.size > 0) this.#uniformValueCache.clear();

    checkGLErrorDebug();
    return true;
  }

  /**
   * Initializes the GLProgram with a vertex and fragment with string
   */
  initWithString(vertShaderStr: string, fragShaderStr: string): boolean {
    return this.initWithVertexShaderByteArray(vertShaderStr, fragShaderStr);
  }

  /**
   * Initializes the GLProgram with a vertex and fragment with contents of filenames
   * @param {String} vShaderFilename
   * @param {String} fShaderFileName
   * @return {Boolean}
   */
  initWithVertexShaderFilename(
    vShaderFilename: string,
    fShaderFileName: string
  ): boolean {
    const vertexSource = ServiceLocator.loader.getRes(vShaderFilename);
    if (!vertexSource)
      throw new Error("Please load the resource firset : " + vShaderFilename);
    const fragmentSource = ServiceLocator.loader.getRes(fShaderFileName);
    if (!fragmentSource)
      throw new Error("Please load the resource firset : " + fShaderFileName);
    return this.initWithVertexShaderByteArray(vertexSource, fragmentSource);
  }

  /**
   * Initializes the GLProgram with a vertex and fragment with contents of filenames
   */
  init(vShaderFilename: string, fShaderFileName: string): boolean {
    return this.initWithVertexShaderFilename(vShaderFilename, fShaderFileName);
  }

  /**
   * It will add a new attribute to the shader
   */
  addAttribute(attributeName: string, index: number): void {
    this.#context.bindAttribLocation(this.program, index, attributeName);
  }

  /**
   * links the glProgram
   */
  link(): boolean {
    if (this.#program === null) {
      log("GLProgram.link(): Cannot link invalid program");
      return false;
    }

    this.#context.linkProgram(this.program);

    if (this.#vertShader !== null) {
      this.#context.deleteShader(this.#vertShader);
    }

    if (this.#fragShader !== null) {
      this.#context.deleteShader(this.#fragShader);
    }

    this.#clearShaders();

    if (ServiceLocator.game.config[CONFIG_KEY.debugMode]) {
      const status = this.#context.getProgramParameter(
        this.program,
        this.#context.LINK_STATUS
      );
      if (!status) {
        log(
          "cocos2d: ERROR: Failed to link program: " +
            this.#context.getProgramInfoLog(this.program)
        );
        ServiceLocator.glStateCache.deleteProgram(this.program);
        this.#program = null;
        return false;
      }
    }

    return true;
  }

  /**
   * it will call glUseProgram()
   */
  use(): void {
    ServiceLocator.glStateCache.useProgram(this.program);
  }

  /**
   * It will create 4 uniforms:
   *  UNIFORM_PMATRIX
   *  UNIFORM_MVMATRIX
   *  UNIFORM_MVPMATRIX
   *  UNIFORM_SAMPLER
   */
  updateUniforms(): void {
    this.addUniformLocation(UniformName.PMATRIX);
    this.addUniformLocation(UniformName.MVMATRIX);
    this.addUniformLocation(UniformName.MVPMATRIX);
    this.addUniformLocation(UniformName.TIME);
    this.addUniformLocation(UniformName.SINTIME);
    this.addUniformLocation(UniformName.COSTIME);
    this.addUniformLocation(UniformName.RANDOM01);
    this.addUniformLocation(UniformName.SAMPLER);
    this.#usesTime =
      this.#uniform(UniformName.TIME) !== null ||
      this.#uniform(UniformName.SINTIME) !== null ||
      this.#uniform(UniformName.COSTIME) !== null;

    this.use();
    // Since sample most probably won't change, set it to 0 now.
    this.setUniformLocationWith1i(this.#uniform(UniformName.SAMPLER), 0);
  }

  addUniformLocation(name: string): WebGLUniformLocation | null {
    const location = this.#context.getUniformLocation(this.program, name);
    if (location) (location as any)._name = name;
    this.#uniforms.set(name, location);
    return location;
  }

  /**
   * calls retrieves the named uniform location for this shader program.
   * @param {String} name
   * @returns {Number}
   */
  getUniformLocationForName(name: string): WebGLUniformLocation | null {
    if (!name)
      throw new Error(
        "GLProgram.getUniformLocationForName(): uniform name should be non-null"
      );
    if (this.#program === null)
      throw new Error(
        "GLProgram.getUniformLocationForName(): Invalid operation. Cannot get uniform location when program is not initialized"
      );

    return this.#uniform(name) || this.addUniformLocation(name);
  }

  /**
   * Bind the multi-texture ddsampler array `CC_Textures[N]` to texture units
   * `[0, 1, ..., N-1]`. The location is queried as `CC_Textures[0]`, which is
   * the portable way to address a sampler array. Cached after first lookup.
   */
  setTextureUnits(unitArray: Int32Array | number[]): void {
    if (this.#texturesUniformLocation === null) {
      this.#texturesUniformLocation = this.#context.getUniformLocation(
        this.program,
        "CC_Textures[0]"
      );
    }

    if (this.#texturesUniformLocation !== null) {
      this.#context.uniform1iv(this.#texturesUniformLocation, unitArray);
    }
  }

  /**
   * calls glUniform1i only if the values are different than the previous call for this same shader program.
   */
  setUniformLocationWith1i(location: UniformLocationInput, i1: number): void {
    this.#setUniformLocation(location, "uniform1i", i1);
  }

  /**
   * calls glUniform2i only if the values are different than the previous call for this same shader program.
   */
  setUniformLocationWith2i(
    location: UniformLocationInput,
    i1: number,
    i2: number
  ): void {
    this.#setUniformLocation(location, "uniform2i", i1, i2);
  }

  /**
   * calls glUniform3i only if the values are different than the previous call for this same shader program.
   */
  setUniformLocationWith3i(
    location: UniformLocationInput,
    i1: number,
    i2: number,
    i3: number
  ): void {
    this.#setUniformLocation(location, "uniform3i", i1, i2, i3);
  }

  /**
   * calls glUniform4i only if the values are different than the previous call for this same shader program.
   */
  setUniformLocationWith4i(
    location: UniformLocationInput,
    i1: number,
    i2: number,
    i3: number,
    i4: number
  ): void {
    this.#setUniformLocation(location, "uniform4i", i1, i2, i3, i4);
  }

  /**
   * calls glUniform2iv
   */
  setUniformLocationWith2iv(
    location: UniformLocationInput,
    intArray: Int32Array | number[]
  ): void {
    this.#setUniformLocation(location, "uniform2iv", intArray);
  }

  /**
   * calls glUniform3iv
   */
  setUniformLocationWith3iv(
    location: UniformLocationInput,
    intArray: Int32Array | number[]
  ): void {
    this.#setUniformLocation(location, "uniform3iv", intArray);
  }

  /**
   * calls glUniform4iv
   */
  setUniformLocationWith4iv(
    location: UniformLocationInput,
    intArray: Int32Array | number[]
  ): void {
    this.#setUniformLocation(location, "uniform4iv", intArray);
  }

  /**
   * calls glUniform1i only if the values are different than the previous call for this same shader program.
   */
  setUniformLocationI32(location: UniformLocationInput, i1: number): void {
    this.setUniformLocationWith1i(location, i1);
  }

  /**
   * calls glUniform1f only if the values are different than the previous call for this same shader program.
   */
  setUniformLocationWith1f(location: UniformLocationInput, f1: number): void {
    this.#setUniformLocation(location, "uniform1f", f1);
  }

  /**
   * calls glUniform2f only if the values are different than the previous call for this same shader program.
   */
  setUniformLocationWith2f(
    location: UniformLocationInput,
    f1: number,
    f2: number
  ): void {
    this.#setUniformLocation(location, "uniform2f", f1, f2);
  }

  /**
   * calls glUniform3f only if the values are different than the previous call for this same shader program.
   */
  setUniformLocationWith3f(
    location: UniformLocationInput,
    f1: number,
    f2: number,
    f3: number
  ): void {
    this.#setUniformLocation(location, "uniform3f", f1, f2, f3);
  }

  /**
   * calls glUniform4f only if the values are different than the previous call for this same shader program.
   */
  setUniformLocationWith4f(
    location: UniformLocationInput,
    f1: number,
    f2: number,
    f3: number,
    f4: number
  ): void {
    this.#setUniformLocation(location, "uniform4f", f1, f2, f3, f4);
  }

  /**
   * calls glUniform2fv
   */
  setUniformLocationWith2fv(
    location: UniformLocationInput,
    floatArray: Float32Array | number[]
  ): void {
    this.#setUniformLocation(location, "uniform2fv", floatArray);
  }

  /**
   * calls glUniform3fv
   */
  setUniformLocationWith3fv(
    location: UniformLocationInput,
    floatArray: Float32Array | number[]
  ): void {
    this.#setUniformLocation(location, "uniform3fv", floatArray);
  }

  /**
   * calls glUniform4fv
   */
  setUniformLocationWith4fv(
    location: UniformLocationInput,
    floatArray: Float32Array | number[]
  ): void {
    this.#setUniformLocation(location, "uniform4fv", floatArray);
  }

  /**
   * calls glUniformMatrix2fv
   */
  setUniformLocationWithMatrix2fv(
    location: UniformLocationInput,
    matrixArray: Float32Array | number[]
  ): void {
    this.#setUniformLocation(location, "uniformMatrix2fv", false, matrixArray);
  }

  /**
   * calls glUniformMatrix3fv
   */
  setUniformLocationWithMatrix3fv(
    location: UniformLocationInput,
    matrixArray: Float32Array | number[]
  ): void {
    this.#setUniformLocation(location, "uniformMatrix3fv", false, matrixArray);
  }

  /**
   * calls glUniformMatrix4fv
   */
  setUniformLocationWithMatrix4fv(
    location: UniformLocationInput,
    matrixArray: Float32Array | number[],
    _numberOfArrays?: number
  ): void {
    this.#setUniformLocation(location, "uniformMatrix4fv", false, matrixArray);
  }

  setUniformLocationF32(...arg: any[]): void {
    if (arg.length < 2) {
      return;
    }

    switch (arg.length) {
      case 2:
        this.setUniformLocationWith1f(arg[0], arg[1]);
        break;
      case 3:
        this.setUniformLocationWith2f(arg[0], arg[1], arg[2]);
        break;
      case 4:
        this.setUniformLocationWith3f(arg[0], arg[1], arg[2], arg[3]);
        break;
      case 5:
        this.setUniformLocationWith4f(arg[0], arg[1], arg[2], arg[3], arg[4]);
        break;
    }
  }

  /**
   * will update the builtin uniforms if they are different than the previous call for this same shader program.
   */
  setUniformsForBuiltins(): void {
    const matrixP = new Matrix4();
    const matrixMV = new Matrix4();
    const matrixMVP = new Matrix4();

    ServiceLocator.kmglMatrix.getMatrix(KMGLMatrix.KM_GL_PROJECTION, matrixP);
    ServiceLocator.kmglMatrix.getMatrix(KMGLMatrix.KM_GL_MODELVIEW, matrixMV);

    Matrix4.multiply(matrixMVP, matrixP, matrixMV);

    this.setUniformLocationWithMatrix4fv(
      this.#uniform(UniformName.PMATRIX),
      matrixP.mat,
      1
    );
    this.setUniformLocationWithMatrix4fv(
      this.#uniform(UniformName.MVMATRIX),
      matrixMV.mat,
      1
    );
    this.setUniformLocationWithMatrix4fv(
      this.#uniform(UniformName.MVPMATRIX),
      matrixMVP.mat,
      1
    );

    if (this.#usesTime) {
      // This doesn't give the most accurate global time value.
      // Cocos2D doesn't store a high precision time value, so this will have to do.
      // Getting Mach time per frame per shader using time could be extremely expensive.
      const time =
        ServiceLocator.director.getTotalFrames() *
        ServiceLocator.director.getAnimationInterval();

      this.setUniformLocationWith4f(
        this.#uniform(UniformName.TIME),
        time / 10.0,
        time,
        time * 2,
        time * 4
      );
      this.setUniformLocationWith4f(
        this.#uniform(UniformName.SINTIME),
        time / 8.0,
        time / 4.0,
        time / 2.0,
        Math.sin(time)
      );
      this.setUniformLocationWith4f(
        this.#uniform(UniformName.COSTIME),
        time / 8.0,
        time / 4.0,
        time / 2.0,
        Math.cos(time)
      );
    }

    if (this.#uniform(UniformName.RANDOM01) !== -1)
      this.setUniformLocationWith4f(
        this.#uniform(UniformName.RANDOM01),
        Math.random(),
        Math.random(),
        Math.random(),
        Math.random()
      );
  }

  /**
   * will update the MVP matrix on the MVP uniform if it is different than the previous call for this same shader program.
   */
  setUniformForModelViewProjectionMatrix(): void {
    this.setUniformLocationWithMatrix4fv(
      this.#uniform(UniformName.MVPMATRIX),
      Matrix4.getMultiplyValue(
        ServiceLocator.kmglMatrix.projectionStack.top,
        ServiceLocator.kmglMatrix.modelViewStack.top
      )
    );
  }

  setUniformForModelViewProjectionMatrixWithMat4(swapMat4: Matrix4): void {
    Matrix4.multiply(
      swapMat4,
      ServiceLocator.kmglMatrix.projectionStack.top,
      ServiceLocator.kmglMatrix.modelViewStack.top
    );
    this.setUniformLocationWithMatrix4fv(
      this.#uniform(UniformName.MVPMATRIX),
      swapMat4.mat
    );
  }

  setUniformForModelViewAndProjectionMatrixWithMat4(): void {
    this.setUniformLocationWithMatrix4fv(
      this.#uniform(UniformName.MVMATRIX),
      ServiceLocator.kmglMatrix.modelViewStack.top.mat
    );
    this.setUniformLocationWithMatrix4fv(
      this.#uniform(UniformName.PMATRIX),
      ServiceLocator.kmglMatrix.projectionStack.top.mat
    );
  }

  setUniformForMVPMatrixWithMat4(modelViewMatrix: Matrix4): void {
    if (!modelViewMatrix) {
      throw new Error("modelView matrix is undefined.");
    }

    this.setUniformLocationWithMatrix4fv(
      this.#uniform(UniformName.MVMATRIX),
      modelViewMatrix.mat
    );

    this.setUniformLocationWithMatrix4fv(
      this.#uniform(UniformName.PMATRIX),
      ServiceLocator.kmglMatrix.projectionStack.top.mat
    );
  }

  updateProjectionUniform(): void {
    const stack = ServiceLocator.kmglMatrix.projectionStack;
    if (stack.lastUpdated !== this.#projectionUpdated) {
      this.#context.uniformMatrix4fv(
        this.#uniform(UniformName.PMATRIX),
        false,
        stack.top.mat
      );
      this.#projectionUpdated = stack.lastUpdated;
    }
  }

  /**
   *  reload all shaders, this function is designed for android  <br/>
   *  when opengl context lost, so don't call it.
   */
  reset(): void {
    this.destroyProgram();
    this.#program = null;
  }

  #description(): string {
    return (
      "<CCGLProgram = " +
      this.toString() +
      " | Program = " +
      this.program.toString() +
      ", VertexShader = " +
      this.vertShader.toString() +
      ", FragmentShader = " +
      this.fragShader.toString() +
      ">"
    );
  }


  #setUniformsForBuiltinsForRenderer(node: any): void {
    if (!node || !node._renderCmd) return;

    const matrixP = new Matrix4();
    const matrixMVP = new Matrix4();

    ServiceLocator.kmglMatrix.getMatrix(KMGLMatrix.KM_GL_PROJECTION, matrixP);
    //ServiceLocator.kmglMatrix.getMatrix(KMGLMatrix.KM_GL_MODELVIEW, node._stackMatrix);

    Matrix4.multiply(matrixMVP, matrixP, node._renderCmd._stackMatrix);

    this.setUniformLocationWithMatrix4fv(
      this.#uniform(UniformName.PMATRIX),
      matrixP.mat
    );
    this.setUniformLocationWithMatrix4fv(
      this.#uniform(UniformName.MVMATRIX),
      node._renderCmd._stackMatrix.mat
    );
    this.setUniformLocationWithMatrix4fv(
      this.#uniform(UniformName.MVPMATRIX),
      matrixMVP.mat
    );

    if (this.#usesTime) {
      // This doesn't give the most accurate global time value.
      // Cocos2D doesn't store a high precision time value, so this will have to do.
      // Getting Mach time per frame per shader using time could be extremely expensive.
      const time = ServiceLocator.director.getTotalFrames() * ServiceLocator.director.getAnimationInterval();

      this.setUniformLocationWith4f(
        this.#uniform(UniformName.TIME),
        time / 10.0,
        time,
        time * 2,
        time * 4
      );
      this.setUniformLocationWith4f(
        this.#uniform(UniformName.SINTIME),
        time / 8.0,
        time / 4.0,
        time / 2.0,
        Math.sin(time)
      );
      this.setUniformLocationWith4f(
        this.#uniform(UniformName.COSTIME),
        time / 8.0,
        time / 4.0,
        time / 2.0,
        Math.cos(time)
      );
    }

    if (this.#uniform(UniformName.RANDOM01) !== -1)
      this.setUniformLocationWith4f(
        this.#uniform(UniformName.RANDOM01),
        Math.random(),
        Math.random(),
        Math.random(),
        Math.random()
      );
  }


  #uniform(name: string): WebGLUniformLocation | null {
    return this.#uniforms.get(name) || null;
  }

  #resolveUniformLocation(
    location: UniformLocationInput,
    ...values: any[]
  ): ResolvedUniformLocation {
    const isString = typeof location === "string";
    const name = isString ? location : location?._name;

    if (name === "") {
      return "";
    }

    if (name) {
      if (!this.#updateUniform(name, ...values)) {
        return "";
      }
      return isString ? this.getUniformLocationForName(name) : location;
    }

    return location;
  }

  #setUniformLocation(
    location: UniformLocationInput,
    method: string,
    ...args: UniformMethodArg[]
  ): void {
    const resolved = this.#resolveUniformLocation(location, ...args);
    if (resolved !== "") {
      (this.#context as any)[method](resolved, ...args);
    }
  }

  // Uniform cache
  #updateUniform(name: string, ...values: any[]): boolean {
    if (!name) return false;    
    const element = this.#uniformValueCache.get(name);
    const args = Array.isArray(values[0]) ? values[0] : values;

    if (!element || element.length !== args.length) {
      this.#uniformValueCache.set(name, ([] as any[]).concat(args));
      return true;
    } 

    let updated = false;

    for (let i = 0; i < args.length; i += 1) {
      // Array and Typed Array inner values could be changed, so we must update them
      if (args[i] !== element[i] || typeof args[i] === "object") {
        element[i] = args[i];
        updated = true;
      }
    }

    return updated;
  }


  #clearShaders(): void {
    this.#vertShader = null;
    this.#fragShader = null;
  }

  #compileShader(shader: WebGLShader, type: number, source: string): boolean {
    if (!source || !shader) return false;

    const preStr = GLProgram.#higHPSupported()
      ? "precision highp float;\n"
      : "precision mediump float;\n";

    // GLSL ES 3.00 requires the `#version 300 es` directive to be the very first
    // line of the shader. The CC_* uniform/precision block must be injected
    // *after* it, so split the directive off before prepending the includes.
    let versionStr = "";
    if (source.indexOf("#version") === 0) {
      const nl = source.indexOf("\n");
      if (nl !== -1) {
        versionStr = source.substring(0, nl + 1);
        source = source.substring(nl + 1);
      }
    }

    source =
      versionStr +
      preStr +
      "uniform mat4 CC_PMatrix;         \n" +
      "uniform mat4 CC_MVMatrix;        \n" +
      "uniform mat4 CC_MVPMatrix;       \n" +
      "uniform vec4 CC_Time;            \n" +
      "uniform vec4 CC_SinTime;         \n" +
      "uniform vec4 CC_CosTime;         \n" +
      "uniform vec4 CC_Random01;        \n" +
      "uniform sampler2D CC_Texture0;   \n" +
      "//CC INCLUDES END                \n" +
      source;

    this.#context!.shaderSource(shader, source);
    this.#context!.compileShader(shader);
    const status = this.#context!.getShaderParameter(
      shader,
      this.#context!.COMPILE_STATUS
    );

    if (!status) {
      log(
        "cocos2d: ERROR: Failed to compile shader:\n" +
          this.#context!.getShaderSource(shader)
      );
      if (type === this.#context!.VERTEX_SHADER)
        log("cocos2d: \n" + this.vertexShaderLog);
      else log("cocos2d: \n" + this.fragmentShaderLog);
    }
    return status === true;
  }


  get uniformMVPMatrix(): WebGLUniformLocation | null {
    return this.#uniform(UniformName.MVPMATRIX);
  }

  get uniformSampler(): WebGLUniformLocation | null {
    return this.#uniform(UniformName.SAMPLER);
  }

  get vertexShaderLog(): string | null {
    return this.#context.getShaderInfoLog(this.vertShader);
  }

  get fragmentShaderLog(): string | null {
    return this.#context.getShaderInfoLog(this.fragShader);
  }

  get programLog(): string | null {
    return this.#context.getProgramInfoLog(this.program);
  }

  get context(): WebGL2RenderingContext | WebGLRenderingContext {
    return this.#context;
  }

  protected get vertShader(): WebGLShader {
    return this.#vertShader!;
  }

  protected get fragShader(): WebGLShader {
    return this.#fragShader!;
  }

  get program(): WebGLProgram {
    return this.#program!;
  }

  static #higHPSupported(): boolean | null {
    const ctx = ServiceLocator.sys.rendererConfig.renderContext;
    if (ctx.getShaderPrecisionFormat && GLProgram.#highpSupported == null) {
      const highp = ctx.getShaderPrecisionFormat(
        ctx.FRAGMENT_SHADER,
        ctx.HIGH_FLOAT
      );
      GLProgram.#highpSupported = highp.precision !== 0;
    }
    return GLProgram.#highpSupported;
  }
}
