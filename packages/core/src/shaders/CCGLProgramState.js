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

import { log } from '../boot/debugger';

const types = {
  GL_FLOAT: 0,
  GL_INT: 1,
  GL_FLOAT_VEC2: 2,
  GL_FLOAT_VEC3: 3,
  GL_FLOAT_VEC4: 4,
  GL_FLOAT_MAT4: 5,
  GL_CALLBACK: 6,
  GL_TEXTURE: 7
};

export class UniformValue {
  _uniform = null;
  _glprogram = null;
  _value = null;
  _type = -1;
  _textureId = null;

  constructor(uniform, glprogram) {
    this._uniform = uniform;
    this._glprogram = glprogram;
  }

  setFloat(value) {
    this._value = value;
    this._type = types.GL_FLOAT;
  }

  setInt(value) {
    this._value = value;
    this._type = types.GL_INT;
  }

  setVec2(v1, v2) {
    this._value = [v1, v2];
    this._type = types.GL_FLOAT_VEC2;
  }

  setVec2v(value) {
    this._value = value.slice(0);
    this._type = types.GL_FLOAT_VEC2;
  }

  setVec3(v1, v2, v3) {
    this._value = [v1, v2, v3];
    this._type = types.GL_FLOAT_VEC3;
  }

  setVec3v(value) {
    this._value = value.slice(0);
    this._type = types.GL_FLOAT_VEC3;
  }

  setVec4(v1, v2, v3, v4) {
    this._value = [v1, v2, v3, v4];
    this._type = types.GL_FLOAT_VEC4;
  }

  setVec4v(value) {
    this._value = value.slice(0);
    this._type = types.GL_FLOAT_VEC4;
  }

  setMat4(value) {
    this._value = value.slice(0);
    this._type = types.GL_FLOAT_MAT4;
  }

  setCallback(fn) {
    this._value = fn;
    this._type = types.GL_CALLBACK;
  }

  setTexture(textureId, textureUnit) {
    this._value = textureUnit;
    this._textureId = textureId;
    this._type = types.GL_TEXTURE;
  }

  apply() {
    switch (this._type) {
      case types.GL_INT:
        this._glprogram.setUniformLocationWith1i(
          this._uniform._location,
          this._value
        );
        break;
      case types.GL_FLOAT:
        this._glprogram.setUniformLocationWith1f(
          this._uniform._location,
          this._value
        );
        break;
      case types.GL_FLOAT_VEC2:
        this._glprogram.setUniformLocationWith2fv(
          this._uniform._location,
          this._value
        );
        break;
      case types.GL_FLOAT_VEC3:
        this._glprogram.setUniformLocationWith3fv(
          this._uniform._location,
          this._value
        );
        break;
      case types.GL_FLOAT_VEC4:
        this._glprogram.setUniformLocationWith4fv(
          this._uniform._location,
          this._value
        );
        break;
      case types.GL_FLOAT_MAT4:
        this._glprogram.setUniformLocationWithMatrix4fv(
          this._uniform._location,
          this._value
        );
        break;
      case types.GL_CALLBACK:
        this._value(this._glprogram, this._uniform);
        break;
      case types.GL_TEXTURE:
        this._glprogram.setUniformLocationWith1i(
          this._uniform._location,
          this._value
        );
        cc.glBindTexture2DN(this._value, this._textureId);
        break;
      default:
    }
  }
};

export class GLProgramState {
  static _cache = {};

  static getOrCreateWithGLProgram(glprogram) {
    let programState = GLProgramState._cache[glprogram.__instanceId];
    if (!programState) {
      programState = new GLProgramState(glprogram);
      GLProgramState._cache[glprogram.__instanceId] = programState;
    }
    return programState;
  }

  _glprogram = null;
  _uniforms = {};
  _boundTextureUnits = {};
  _textureUnitIndex = 1;

  constructor(glprogram) {
    this._glprogram = glprogram;
    this._uniforms = {};
    this._boundTextureUnits = {};
    this._textureUnitIndex = 1; // Start at 1, as CC_Texture0 is bound to 0

    const activeUniforms = glprogram._glContext.getProgramParameter(
      glprogram._programObj,
      glprogram._glContext.ACTIVE_UNIFORMS
    );

    for (let i = 0; i < activeUniforms; i += 1) {
      const uniform = glprogram._glContext.getActiveUniform(
        glprogram._programObj,
        i
      );
      if (uniform.name.indexOf("CC_") !== 0) {
        uniform._location = glprogram._glContext.getUniformLocation(
          glprogram._programObj,
          uniform.name
        );
        uniform._location._name = uniform.name;
        const uniformValue = new UniformValue(uniform, glprogram);
        this._uniforms[uniform.name] = uniformValue;
      }
    }
  }

  apply(modelView) {
    this._glprogram.use();
    if (modelView) {
      this._glprogram._setUniformForMVPMatrixWithMat4(modelView);
    }

    for (const name in this._uniforms) {
      this._uniforms[name].apply();
    }
  }

  setGLProgram(glprogram) {
    this._glprogram = glprogram;
  }

  getGLProgram() {
    return this._glprogram;
  }

  getUniformCount() {
    return this._uniforms.length;
  }

  getUniformValue(uniform) {
    return this._uniforms[uniform];
  }

  setUniformInt(uniform, value) {
    const v = this.getUniformValue(uniform);
    if (v) {
      v.setInt(value);
    } else {
      log("cocos2d: warning: Uniform not found: " + uniform);
    }
  }

  setUniformFloat(uniform, value) {
    const v = this.getUniformValue(uniform);
    if (v) {
      v.setFloat(value);
    } else {
      log("cocos2d: warning: Uniform not found: " + uniform);
    }
  }

  setUniformVec2(uniform, v1, v2) {
    const v = this.getUniformValue(uniform);
    if (v) {
      v.setVec2(v1, v2);
    } else {
      log("cocos2d: warning: Uniform not found: " + uniform);
    }
  }

  setUniformVec2v(uniform, value) {
    const v = this.getUniformValue(uniform);
    if (v) {
      v.setVec2v(value);
    } else {
      log("cocos2d: warning: Uniform not found: " + uniform);
    }
  }

  setUniformVec3(uniform, v1, v2, v3) {
    const v = this.getUniformValue(uniform);
    if (v) {
      v.setVec3(v1, v2, v3);
    } else {
      log("cocos2d: warning: Uniform not found: " + uniform);
    }
  }

  setUniformVec3v(uniform, value) {
    const v = this.getUniformValue(uniform);
    if (v) {
      v.setVec3v(value);
    } else {
      log("cocos2d: warning: Uniform not found: " + uniform);
    }
  }

  setUniformVec4(uniform, v1, v2, v3, v4) {
    const v = this.getUniformValue(uniform);
    if (v) {
      v.setVec4(v1, v2, v3, v4);
    } else {
      log("cocos2d: warning: Uniform not found: " + uniform);
    }
  }

  setUniformVec4v(uniform, value) {
    const v = this.getUniformValue(uniform);
    if (v) {
      v.setVec4v(value);
    } else {
      log("cocos2d: warning: Uniform not found: " + uniform);
    }
  }

  setUniformMat4(uniform, value) {
    const v = this.getUniformValue(uniform);
    if (v) {
      v.setMat4(value);
    } else {
      log("cocos2d: warning: Uniform not found: " + uniform);
    }
  }

  setUniformCallback(uniform, callback) {
    const v = this.getUniformValue(uniform);
    if (v) {
      v.setCallback(callback);
    } else {
      log("cocos2d: warning: Uniform not found: " + uniform);
    }
  }

  setUniformTexture(uniform, texture) {
    const uniformValue = this.getUniformValue(uniform);
    if (uniformValue) {
      const textureUnit = this._boundTextureUnits[uniform];
      if (textureUnit) {
        uniformValue.setTexture(texture, textureUnit);
      } else {
        uniformValue.setTexture(texture, this._textureUnitIndex);
        this._boundTextureUnits[uniform] = this._textureUnitIndex++;
      }
    }
  }
};
