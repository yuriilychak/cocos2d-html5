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

import { buildSpriteMultiTextureFrag } from './shaders';
import { ShaderName } from "../enums";
import {
    defaultShaderLoadList,
    createDefaultShaderDefinitions
} from "./constants";

import type { Sys } from "../sys";
import { type ShaderProgram } from "./shader-definition";
import type ShaderDefinition from "./shader-definition";

/**
 * ShaderCache is a singleton object that stores manages GL shaders
 */
export default class ShaderCache {
    /**
     * @public
     */
    static TYPE_MAX = 11;

    #programs = new Map<string, ShaderProgram>();

    #definitions: Map<ShaderName, ShaderDefinition> = new Map();

    #sys: Sys;

    constructor(sys: Sys) {
        this.#sys = sys;
    }

    #ensureShaderDefinitions(): void {
        if (this.#definitions.size > 0) {
            return;
        }

        this.#definitions = createDefaultShaderDefinitions(
            buildSpriteMultiTextureFrag(this.#sys.rendererConfig.maxBatchTextures)
        );
    }

    refresh(): boolean {
        if (this.#programs.size > 0) {
            this.#programs.clear();
        }

        this.#ensureShaderDefinitions();

        for (const defaultShader of defaultShaderLoadList) {
            if (defaultShader.isWebGL2Only && !this.#sys.rendererConfig.isWebGL2) {
                continue;
            }
            this.get(defaultShader.shaderName);
        }
        return true;
    }

    /**
     * returns a GL program for a given key
     */
    get(key: string): ShaderProgram {
        this.#ensureShaderDefinitions();

        if (this.#programs.has(key)) {
            return this.#programs.get(key)!;
        }

        if (!this.#definitions.has(key as ShaderName)) {
            throw new Error("cocos2d: shaderCache._loadDefaultShader, error shader type");
        }
        const definition = this.#definitions.get(key as ShaderName)!;
        const program = definition.createProgram();
        this.#programs.set(key, program);
        return program;
    }

    /**
     * sets a GLProgram in the cache for a given key
     */
    set(key: string, program: ShaderProgram): void {
        this.#programs.set(key, program);
    }
}
