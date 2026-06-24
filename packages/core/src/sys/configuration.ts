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

import { ENGINE_VERSION } from "../platform/config";
import { checkGLErrorDebug } from "../platform/macro/utils";
import type RendererConfig from "./renderer-config";
import type { WebGLContext } from "./types";

/**
 * Class that contains some openGL variables
 * @example
 * var textureSize = configuration.maxTextureSize;
 */
export class Configuration {
  #maxTextureSize: number = 0;
  #maxModelviewStackDepth: number = 0;
  #supportsPVRTC: boolean = false;
  #supportsNPOT: boolean = false;
  #supportsBGRA8888: boolean = false;
  #supportsDiscardFramebuffer: boolean = false;
  #supportsShareableVAO: boolean = false;
  #maxSamplesAllowed: number = 0;
  #maxTextureUnits: number = 0;
  #glExtensions: string = "";
  #values: Map<string, unknown> = new Map();
  #rendererConfig: RendererConfig;

  constructor(rendererConfig: RendererConfig) {
    this.#rendererConfig = rendererConfig;
    this.#values.set("cocos2d.x.version", ENGINE_VERSION);
    this.#values.set("cocos2d.x.compiled_with_profiler", false);
    this.#values.set("cocos2d.x.compiled_with_gl_state_cache", true);
  }

  public get maxTextureSize(): number {
    return this.#maxTextureSize;
  }

  public get maxSamplesAllowed(): number {
    return this.#maxSamplesAllowed;
  }

  public get maxModelviewStackDepth(): number {
    return this.#maxModelviewStackDepth;
  }

  public get maxTextureUnits(): number {
    return this.#maxTextureUnits;
  }

  public get supportsNPOT(): boolean {
    return this.#supportsNPOT;
  }

  public get supportsPVRTC(): boolean {
    return this.#supportsPVRTC;
  }

  public get supportsETC(): boolean {
    return false;
  }

  public get supportsS3TC(): boolean {
    return false;
  }

  public get supportsATITC(): boolean {
    return false;
  }

  public get supportsBGRA8888(): boolean {
    return this.#supportsBGRA8888;
  }

  public get supportsDiscardFramebuffer(): boolean {
    return this.#supportsDiscardFramebuffer;
  }

  public get supportsShareableVAO(): boolean {
    return this.#supportsShareableVAO;
  }

  public checkForGLExtension(searchName: string): boolean {
    return this.#glExtensions.indexOf(searchName) > -1;
  }

  public getValue(key: string, defaultValue: unknown): unknown {
    return this.#values.has(key) ? this.#values.get(key) : defaultValue;
  }

  public setValue(key: string, value: unknown): void {
    this.#values.set(key, value);
  }

  public dumpInfo(): void {}

  public gatherGPUInfo(): void {
    if (this.#rendererConfig.isCanvas) {
      return;
    }

    const gl = this.#rendererConfig.renderContext as WebGLContext | null;

    if (gl === null) {
      return;
    }

    const extArr = gl.getSupportedExtensions();

    this.#glExtensions = (extArr || []).join(" ");
    this.#maxTextureUnits = gl.getParameter(
      gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS
    );
    this.#maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    this.#supportsPVRTC = this.checkForGLExtension(
      "GL_IMG_texture_compression_pvrtc"
    );
    this.#supportsNPOT = false;
    this.#supportsBGRA8888 = this.checkForGLExtension(
      "GL_IMG_texture_format_BGRA888"
    );
    this.#supportsDiscardFramebuffer = this.checkForGLExtension(
      "GL_EXT_discard_framebuffer"
    );
    this.#supportsShareableVAO = this.checkForGLExtension(
      "vertex_array_object"
    );

    this.setValue("gl.vendor", gl.getParameter(gl.VENDOR));
    this.setValue("gl.renderer", gl.getParameter(gl.RENDERER));
    this.setValue("gl.version", gl.getParameter(gl.VERSION));
    this.setValue("gl.max_texture_size", this.#maxTextureSize);
    this.setValue("gl.max_texture_units", this.#maxTextureUnits);
    this.setValue("gl.supports_PVRTC", this.#supportsPVRTC);
    this.setValue("gl.supports_NPOT", this.#supportsNPOT);
    this.setValue("gl.supports_BGRA8888", this.#supportsBGRA8888);
    this.setValue(
      "gl.supports_discard_framebuffer",
      this.#supportsDiscardFramebuffer
    );
    this.setValue(
      "gl.supports_vertex_array_object",
      this.#supportsShareableVAO
    );

    checkGLErrorDebug();
  }
}
