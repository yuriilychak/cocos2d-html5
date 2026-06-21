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
// ShaderRetro
//
//------------------------------------------------------------------

// Fix me:
// The implemetation of LabelBMFont is quite defferent between html5 and native
// That is why we use 'if (sys.isNative){...}else{...}' in this test case
// It should be fixed in the future.
import { OpenGLTestLayer } from "./open-gltest-layer";
import { ccbjs } from "../resources";
import { winSize } from "../constants";
import { LabelBMFont } from "@aspect/labels";
import { GLProgram, ServiceLocator, VertexAttribute, AttributeName } from "@aspect/core";
export class ShaderRetroEffect extends OpenGLTestLayer {
    constructor() {
        super();

        if( 'opengl' in ServiceLocator.sys.capabilities ) {
            var program = new GLProgram(ccbjs + "Shaders/example_ColorBars.vsh", ccbjs + "Shaders/example_ColorBars.fsh");
            program.addAttribute(AttributeName.POSITION, VertexAttribute.POSITION);
            program.addAttribute(AttributeName.TEX_COORD, VertexAttribute.TEX_COORDS);
            program.link();
            program.updateUniforms();

            var label = new LabelBMFont("RETRO EFFECT","fonts/west_england-64.fnt");
            
            if(ServiceLocator.sys.isNative)
                label.children[0].shaderProgram = program;
            else
                label.shaderProgram = program;
            
            label.x = winSize.width/2;

            label.y = winSize.height/2;
            this.addChild(label);

            this.scheduleUpdate();

            this.label = label;
            this.accum = 0;
        }
    }
    update(dt) {
        this.accum += dt;

        if(ServiceLocator.sys.isNative){
            var letters = this.label.children[0];
            for(var i = 0; i< letters.getStringLength(); ++i){
                var sprite = letters.getLetter(i);
                sprite.y = Math.sin( this.accum * 2 + i/2.0) * 20;
                sprite.scaleY  = ( Math.sin( this.accum * 2 + i/2.0 + 0.707) );       
            }
        }else{
            var children = this.label.children;

            for( var i in children ) {
                var sprite = children[i];
                sprite.y = Math.sin( this.accum * 2 + i/2.0) * 20;

                // add fabs() to prevent negative scaling
                var scaleY = ( Math.sin( this.accum * 2 + i/2.0 + 0.707) );

                sprite.scaleY = scaleY;
            }
        }
    }
    title() {
        return "Shader Retro Effect";
    }
    subtitle() {
        return "Should see moving colors, and a sin effect on the letters";
    }

    //
    // Automation
    //

}
