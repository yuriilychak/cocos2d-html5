/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

//------------------------------------------------------------------
//
// ShaderOutline
//
//------------------------------------------------------------------
//FIX ME:
//The renderers of webgl and opengl is quite different now, so we have to use different shader and different js code
//This is a bug, need to be fixed in the future
import { OpenGLTestLayer } from "./open-gltest-layer";
import { ccbjs } from "../resources";
import { winSize } from "../constants";
import { RotateTo, sequence } from "@aspect/actions";
import { GLProgram, GLProgramState, Sprite, Sys, VERTEX_ATTRIB_COLOR, VERTEX_ATTRIB_POSITION, VERTEX_ATTRIB_TEX_COORDS, ATTRIBUTE_NAME_COLOR, ATTRIBUTE_NAME_POSITION, ATTRIBUTE_NAME_TEX_COORD } from "@aspect/core";
export class ShaderOutlineEffect extends OpenGLTestLayer {
    constructor() {
        super();

        if( 'opengl' in Sys.getInstance().capabilities ) {
            if(Sys.getInstance().isNative){
                this.shader = new GLProgram(ccbjs + "Shaders/example_Outline_noMVP.vsh", ccbjs + "Shaders/example_Outline.fsh");
                this.shader.link();
                this.shader.updateUniforms();
            }
            else{
                this.shader = new GLProgram(ccbjs + "Shaders/example_Outline.vsh", ccbjs + "Shaders/example_Outline.fsh");
                this.shader.addAttribute(ATTRIBUTE_NAME_POSITION, VERTEX_ATTRIB_POSITION);
                this.shader.addAttribute(ATTRIBUTE_NAME_TEX_COORD, VERTEX_ATTRIB_TEX_COORDS);
                this.shader.addAttribute(ATTRIBUTE_NAME_COLOR, VERTEX_ATTRIB_COLOR);

                this.shader.link();
                this.shader.updateUniforms();
                this.shader.use();
                this.shader.setUniformLocationWith1f(this.shader.getUniformLocationForName('u_threshold'), 1.75);
                this.shader.setUniformLocationWith3f(this.shader.getUniformLocationForName('u_outlineColor'), 0 / 255, 255 / 255, 0 / 255);
            }

            this.sprite = new Sprite('Images/grossini.png');
            this.sprite.attr({
                x: winSize.width / 2,
                y: winSize.height / 2
            });
            this.sprite.runAction(sequence(new RotateTo(1.0, 10), new RotateTo(1.0, -10)).repeatForever());

            if(Sys.getInstance().isNative){
                var glProgram_state = GLProgramState.getOrCreateWithGLProgram(this.shader);
                glProgram_state.setUniformFloat("u_threshold", 1.75);
                glProgram_state.setUniformVec3("u_outlineColor", {x: 0/255, y: 255/255, z: 0/255});
                this.sprite.setGLProgramState(glProgram_state);
            }else{
                this.sprite.shaderProgram = this.shader;
            }

            this.addChild(this.sprite);

            this.scheduleUpdate();
        }
    }
    update(dt) {
        if( 'opengl' in Sys.getInstance().capabilities ) {
            if(Sys.getInstance().isNative){
                this.sprite.getGLProgramState().setUniformFloat("u_radius", Math.abs(this.sprite.getRotation() / 500));
            }else{
                this.shader.use();
                this.shader.setUniformLocationWith1f(this.shader.getUniformLocationForName('u_radius'), Math.abs(this.sprite.getRotation() / 500));
                this.shader.updateUniforms();
            }
        }
    }
    title() {
        return "Shader Outline Effect";
    }
    subtitle() {
        return "Should see rotated image with animated outline effect";
    }

    //
    // Automation
    //

}
