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

import Loader from "./boot/loader";
import { log, assert, _LogInfos } from "./boot/debugger";
import { RendererConfig } from "./renderer/renderer-config";

/**
 * Class that contains some openGL variables
 * @example
 * var textureSize = configuration.getMaxTextureSize();
 */
export class Configuration {
  static _instance = null;

  static getInstance() {
    if (!Configuration._instance) {
      Configuration._instance = new Configuration();
    }

    return Configuration._instance;
  }

  ERROR = 0;
  STRING = 1;
  INT = 2;
  DOUBLE = 3;
  BOOLEAN = 4;

  _maxTextureSize = 0;
  _maxModelviewStackDepth = 0;
  _supportsPVRTC = false;
  _supportsNPOT = false;
  _supportsBGRA8888 = false;
  _supportsDiscardFramebuffer = false;
  _supportsShareableVAO = false;
  _maxSamplesAllowed = 0;
  _maxTextureUnits = 0;
  _GlExtensions = "";
  _valueDict = {};
  _inited = false;

  _init() {
    const locValueDict = this._valueDict;
    locValueDict["cocos2d.x.version"] = cc.ENGINE_VERSION;
    locValueDict["cocos2d.x.compiled_with_profiler"] = false;
    locValueDict["cocos2d.x.compiled_with_gl_state_cache"] = true;
    this._inited = true;
  }

  getMaxTextureSize() {
    return this._maxTextureSize;
  }

  getMaxModelviewStackDepth() {
    return this._maxModelviewStackDepth;
  }

  getMaxTextureUnits() {
    return this._maxTextureUnits;
  }

  supportsNPOT() {
    return this._supportsNPOT;
  }

  supportsPVRTC() {
    return this._supportsPVRTC;
  }

  supportsETC() {
    return false;
  }

  supportsS3TC() {
    return false;
  }

  supportsATITC() {
    return false;
  }

  supportsBGRA8888() {
    return this._supportsBGRA8888;
  }

  supportsDiscardFramebuffer() {
    return this._supportsDiscardFramebuffer;
  }

  supportsShareableVAO() {
    return this._supportsShareableVAO;
  }

  checkForGLExtension(searchName) {
    return this._GlExtensions.indexOf(searchName) > -1;
  }

  getValue(key, default_value) {
    if (!this._inited) this._init();
    const locValueDict = this._valueDict;
    if (locValueDict[key]) return locValueDict[key];
    return default_value;
  }

  setValue(key, value) {
    this._valueDict[key] = value;
  }

  dumpInfo() {}

  gatherGPUInfo() {
    if (RendererConfig.getInstance().isCanvas) return;

    if (!this._inited) this._init();
    const gl = RendererConfig.getInstance().renderContext;
    const locValueDict = this._valueDict;
    locValueDict["gl.vendor"] = gl.getParameter(gl.VENDOR);
    locValueDict["gl.renderer"] = gl.getParameter(gl.RENDERER);
    locValueDict["gl.version"] = gl.getParameter(gl.VERSION);

    this._GlExtensions = "";
    const extArr = gl.getSupportedExtensions();
    for (let i = 0; i < extArr.length; i++)
      this._GlExtensions += extArr[i] + " ";

    this._maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    locValueDict["gl.max_texture_size"] = this._maxTextureSize;
    this._maxTextureUnits = gl.getParameter(
      gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS
    );
    locValueDict["gl.max_texture_units"] = this._maxTextureUnits;

    this._supportsPVRTC = this.checkForGLExtension(
      "GL_IMG_texture_compression_pvrtc"
    );
    locValueDict["gl.supports_PVRTC"] = this._supportsPVRTC;

    this._supportsNPOT = false;
    locValueDict["gl.supports_NPOT"] = this._supportsNPOT;

    this._supportsBGRA8888 = this.checkForGLExtension(
      "GL_IMG_texture_format_BGRA888"
    );
    locValueDict["gl.supports_BGRA8888"] = this._supportsBGRA8888;

    this._supportsDiscardFramebuffer = this.checkForGLExtension(
      "GL_EXT_discard_framebuffer"
    );
    locValueDict["gl.supports_discard_framebuffer"] =
      this._supportsDiscardFramebuffer;

    this._supportsShareableVAO = this.checkForGLExtension(
      "vertex_array_object"
    );
    locValueDict["gl.supports_vertex_array_object"] =
      this._supportsShareableVAO;

    cc.checkGLErrorDebug();
  }

  loadConfigFile(url) {
    if (!this._inited) this._init();
    const dict = Loader.getInstance().getRes(url);
    if (!dict) throw new Error("Please load the resource first : " + url);
    assert(dict, _LogInfos.configuration_loadConfigFile_2, url);

    const getDatas = dict["data"];
    if (!getDatas) {
      log(_LogInfos.configuration_loadConfigFile, url);
      return;
    }

    for (const selKey in getDatas) this._valueDict[selKey] = getDatas[selKey];
  }
}
