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
import {
    SHADER_POSITION_TEXTURECOLOR,
    SHADER_POSITION_TEXTURECOLORALPHATEST,
    SHADER_POSITION_COLOR,
    SHADER_POSITION_TEXTURE,
    SHADER_POSITION_TEXTURE_UCOLOR,
    SHADER_POSITION_TEXTUREA8COLOR,
    SHADER_POSITION_UCOLOR,
    SHADER_POSITION_LENGTHTEXTURECOLOR,
    SHADER_SPRITE_POSITION_TEXTURECOLOR,
    SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST,
    SHADER_SPRITE_POSITION_COLOR,
    SHADER_SPRITE_POSITION_TEXTURECOLOR_GRAY,
    ATTRIBUTE_NAME_POSITION,
    ATTRIBUTE_NAME_COLOR,
    ATTRIBUTE_NAME_TEX_COORD,
    VERTEX_ATTRIB_POSITION,
    VERTEX_ATTRIB_COLOR,
    VERTEX_ATTRIB_TEX_COORDS
} from "../platform/macro/constants";
import {
    SHADER_POSITION_TEXTURE_COLOR_VERT,
    SHADER_POSITION_TEXTURE_COLOR_FRAG,
    SHADER_POSITION_TEXTURE_COLOR_ALPHATEST_FRAG,
    SHADER_POSITION_COLOR_VERT,
    SHADER_POSITION_COLOR_FRAG,
    SHADER_POSITION_TEXTURE_VERT,
    SHADER_POSITION_TEXTURE_FRAG,
    SHADER_POSITION_TEXTURE_UCOLOR_VERT,
    SHADER_POSITION_TEXTURE_UCOLOR_FRAG,
    SHADER_POSITION_TEXTURE_A8COLOR_VERT,
    SHADER_POSITION_TEXTURE_A8COLOR_FRAG,
    SHADER_POSITION_UCOLOR_VERT,
    SHADER_POSITION_UCOLOR_FRAG,
    SHADER_POSITION_COLOR_LENGTH_TEXTURE_VERT,
    SHADER_POSITION_COLOR_LENGTH_TEXTURE_FRAG,
    SHADER_SPRITE_POSITION_TEXTURE_COLOR_VERT,
    SHADER_SPRITE_POSITION_COLOR_VERT,
    SHADER_SPRITE_POSITION_TEXTURE_COLOR_GRAY_FRAG
} from './CCShaders';
import GLProgram from './CCGLProgram';
import { checkGLErrorDebug } from "../platform/macro/utils";

/**
 * ShaderCache is a singleton object that stores manages GL shaders
 * @class
 */
export default class ShaderCache {
    static _instance = null;

    /**
     * @public
     * @constant
     * @type {Number}
     */
    static TYPE_POSITION_TEXTURECOLOR = 0;
    /**
     * @public
     * @constant
     * @type {Number}
     */
    static TYPE_POSITION_TEXTURECOLOR_ALPHATEST = 1;
    /**
     * @public
     * @constant
     * @type {Number}
     */
    static TYPE_POSITION_COLOR = 2;
    /**
     * @public
     * @constant
     * @type {Number}
     */
    static TYPE_POSITION_TEXTURE = 3;
    /**
     * @public
     * @constant
     * @type {Number}
     */
    static TYPE_POSITION_TEXTURE_UCOLOR = 4;
    /**
     * @public
     * @constant
     * @type {Number}
     */
    static TYPE_POSITION_TEXTURE_A8COLOR = 5;
    /**
     * @public
     * @constant
     * @type {Number}
     */
    static TYPE_POSITION_UCOLOR = 6;
    /**
     * @public
     * @constant
     * @type {Number}
     */
    static TYPE_POSITION_TEXTURECOLOR_UCOLOR = 7;
    /**
     * @public
     * @constant
     * @type {Number}
     */
    static TYPE_SPRITE_POSITION_TEXTURECOLOR = 8;
    /**
     * @public
     * @constant
     * @type {Number}
     */
    static TYPE_SPRITE_POSITION_TEXTURECOLOR_ALPHATEST = 9;
    /**
     * @public
     * @constant
     * @type {Number}
     */
    static TYPE_SPRITE_POSITION_COLOR = 10;
    /**
     * @public
     * @constant
     * @type {Number}
     */
    static TYPE_SPRITE_POSITION_TEXTURECOLOR_GRAY = 11;
    /**
     * @public
     * @constant
     * @type {Number}
     */
    static TYPE_MAX = 11;

    constructor() {
        this._keyMap = [
            SHADER_POSITION_TEXTURECOLOR,
            SHADER_POSITION_TEXTURECOLORALPHATEST,
            SHADER_POSITION_COLOR,
            SHADER_POSITION_TEXTURE,
            SHADER_POSITION_TEXTURE_UCOLOR,
            SHADER_POSITION_TEXTUREA8COLOR,
            SHADER_POSITION_UCOLOR,
            SHADER_POSITION_LENGTHTEXTURECOLOR,
            SHADER_SPRITE_POSITION_TEXTURECOLOR,
            SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST,
            SHADER_SPRITE_POSITION_COLOR,
            SHADER_SPRITE_POSITION_TEXTURECOLOR_GRAY
        ];
        this._programs = {};
    }

    static getInstance() {
        if (!ShaderCache._instance) {
            ShaderCache._instance = new ShaderCache();
        }
        return ShaderCache._instance;
    }

    _init() {
        this.loadDefaultShaders();
        return true;
    }

    _loadDefaultShader(program, type) {
        switch (type) {
            case SHADER_POSITION_TEXTURECOLOR:
                program.initWithVertexShaderByteArray(SHADER_POSITION_TEXTURE_COLOR_VERT, SHADER_POSITION_TEXTURE_COLOR_FRAG);
                program.addAttribute(ATTRIBUTE_NAME_POSITION, VERTEX_ATTRIB_POSITION);
                program.addAttribute(ATTRIBUTE_NAME_COLOR, VERTEX_ATTRIB_COLOR);
                program.addAttribute(ATTRIBUTE_NAME_TEX_COORD, VERTEX_ATTRIB_TEX_COORDS);
                break;
            case SHADER_POSITION_TEXTURECOLORALPHATEST:
                program.initWithVertexShaderByteArray(SHADER_POSITION_TEXTURE_COLOR_VERT, SHADER_POSITION_TEXTURE_COLOR_ALPHATEST_FRAG);
                program.addAttribute(ATTRIBUTE_NAME_POSITION, VERTEX_ATTRIB_POSITION);
                program.addAttribute(ATTRIBUTE_NAME_COLOR, VERTEX_ATTRIB_COLOR);
                program.addAttribute(ATTRIBUTE_NAME_TEX_COORD, VERTEX_ATTRIB_TEX_COORDS);
                break;
            case SHADER_POSITION_COLOR:
                program.initWithVertexShaderByteArray(SHADER_POSITION_COLOR_VERT, SHADER_POSITION_COLOR_FRAG);
                program.addAttribute(ATTRIBUTE_NAME_POSITION, VERTEX_ATTRIB_POSITION);
                program.addAttribute(ATTRIBUTE_NAME_COLOR, VERTEX_ATTRIB_COLOR);
                break;
            case SHADER_POSITION_TEXTURE:
                program.initWithVertexShaderByteArray(SHADER_POSITION_TEXTURE_VERT, SHADER_POSITION_TEXTURE_FRAG);
                program.addAttribute(ATTRIBUTE_NAME_POSITION, VERTEX_ATTRIB_POSITION);
                program.addAttribute(ATTRIBUTE_NAME_TEX_COORD, VERTEX_ATTRIB_TEX_COORDS);
                break;
            case SHADER_POSITION_TEXTURE_UCOLOR:
                program.initWithVertexShaderByteArray(SHADER_POSITION_TEXTURE_UCOLOR_VERT, SHADER_POSITION_TEXTURE_UCOLOR_FRAG);
                program.addAttribute(ATTRIBUTE_NAME_POSITION, VERTEX_ATTRIB_POSITION);
                program.addAttribute(ATTRIBUTE_NAME_TEX_COORD, VERTEX_ATTRIB_TEX_COORDS);
                break;
            case SHADER_POSITION_TEXTUREA8COLOR:
                program.initWithVertexShaderByteArray(SHADER_POSITION_TEXTURE_A8COLOR_VERT, SHADER_POSITION_TEXTURE_A8COLOR_FRAG);
                program.addAttribute(ATTRIBUTE_NAME_POSITION, VERTEX_ATTRIB_POSITION);
                program.addAttribute(ATTRIBUTE_NAME_COLOR, VERTEX_ATTRIB_COLOR);
                program.addAttribute(ATTRIBUTE_NAME_TEX_COORD, VERTEX_ATTRIB_TEX_COORDS);
                break;
            case SHADER_POSITION_UCOLOR:
                program.initWithVertexShaderByteArray(SHADER_POSITION_UCOLOR_VERT, SHADER_POSITION_UCOLOR_FRAG);
                program.addAttribute("aVertex", VERTEX_ATTRIB_POSITION);
                break;
            case SHADER_POSITION_LENGTHTEXTURECOLOR:
                program.initWithVertexShaderByteArray(SHADER_POSITION_COLOR_LENGTH_TEXTURE_VERT, SHADER_POSITION_COLOR_LENGTH_TEXTURE_FRAG);
                program.addAttribute(ATTRIBUTE_NAME_POSITION, VERTEX_ATTRIB_POSITION);
                program.addAttribute(ATTRIBUTE_NAME_TEX_COORD, VERTEX_ATTRIB_TEX_COORDS);
                program.addAttribute(ATTRIBUTE_NAME_COLOR, VERTEX_ATTRIB_COLOR);
                break;
            case SHADER_SPRITE_POSITION_TEXTURECOLOR:
                program.initWithVertexShaderByteArray(SHADER_SPRITE_POSITION_TEXTURE_COLOR_VERT, SHADER_POSITION_TEXTURE_COLOR_FRAG);
                program.addAttribute(ATTRIBUTE_NAME_POSITION, VERTEX_ATTRIB_POSITION);
                program.addAttribute(ATTRIBUTE_NAME_COLOR, VERTEX_ATTRIB_COLOR);
                program.addAttribute(ATTRIBUTE_NAME_TEX_COORD, VERTEX_ATTRIB_TEX_COORDS);
                break;
            case SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST:
                program.initWithVertexShaderByteArray(SHADER_SPRITE_POSITION_TEXTURE_COLOR_VERT, SHADER_POSITION_TEXTURE_COLOR_ALPHATEST_FRAG);
                program.addAttribute(ATTRIBUTE_NAME_POSITION, VERTEX_ATTRIB_POSITION);
                program.addAttribute(ATTRIBUTE_NAME_COLOR, VERTEX_ATTRIB_COLOR);
                program.addAttribute(ATTRIBUTE_NAME_TEX_COORD, VERTEX_ATTRIB_TEX_COORDS);
                break;
            case SHADER_SPRITE_POSITION_COLOR:
                program.initWithVertexShaderByteArray(SHADER_SPRITE_POSITION_COLOR_VERT, SHADER_POSITION_COLOR_FRAG);
                program.addAttribute(ATTRIBUTE_NAME_POSITION, VERTEX_ATTRIB_POSITION);
                program.addAttribute(ATTRIBUTE_NAME_COLOR, VERTEX_ATTRIB_COLOR);
                break;
            case SHADER_SPRITE_POSITION_TEXTURECOLOR_GRAY:
                program.initWithVertexShaderByteArray(SHADER_SPRITE_POSITION_TEXTURE_COLOR_VERT, SHADER_SPRITE_POSITION_TEXTURE_COLOR_GRAY_FRAG);
                program.addAttribute(ATTRIBUTE_NAME_POSITION, VERTEX_ATTRIB_POSITION);
                program.addAttribute(ATTRIBUTE_NAME_COLOR, VERTEX_ATTRIB_COLOR);
                program.addAttribute(ATTRIBUTE_NAME_TEX_COORD, VERTEX_ATTRIB_TEX_COORDS);
                break;
            default:
                log("cocos2d: shaderCache._loadDefaultShader, error shader type");
                return;
        }
        program.link();
        program.updateUniforms();
        checkGLErrorDebug();
    }

    loadDefaultShaders() {
        this.programForKey(SHADER_POSITION_TEXTURECOLOR);
        this.programForKey(SHADER_POSITION_TEXTURECOLORALPHATEST);
        this.programForKey(SHADER_POSITION_COLOR);
        this.programForKey(SHADER_POSITION_TEXTURE);
        this.programForKey(SHADER_POSITION_TEXTURE_UCOLOR);
        this.programForKey(SHADER_POSITION_TEXTUREA8COLOR);
        this.programForKey(SHADER_POSITION_UCOLOR);
        this.programForKey(SHADER_POSITION_LENGTHTEXTURECOLOR);

        this.programForKey(SHADER_SPRITE_POSITION_TEXTURECOLOR);
        this.programForKey(SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST);
        this.programForKey(SHADER_SPRITE_POSITION_COLOR);
        this.programForKey(SHADER_SPRITE_POSITION_TEXTURECOLOR_GRAY);
    }

    reloadDefaultShaders() {
        this._programs = {};
        this.loadDefaultShaders();
    }

    /**
     * returns a GL program for a given key
     * @param {String|Number} key 
     * @return {GLProgram}
     */
    programForKey(key) {
        if (!this._programs[key]) {
            const program = new GLProgram();
            this._loadDefaultShader(program, key);
            this._programs[key] = program;
        }

        return this._programs[key];
    }

    /**
     * returns a GL program for a shader name
     * @param {String} shaderName
     * @return {GLProgram}
     */
    getProgram(shaderName) {
        return this.programForKey(shaderName);
    }

    /**
     * adds a CCGLProgram to the cache for a given name
     * @param {GLProgram} program
     * @param {String} key
     */
    addProgram(program, key) {
        this._programs[key] = program;
    }
}