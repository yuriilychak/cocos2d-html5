/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.

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

//-----------------------Shader_Position_uColor Shader Source--------------------------
/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_UCOLOR_FRAG =
        "precision lowp float;\n"
        + "varying vec4 v_fragmentColor;\n"
        + "void main()                              \n"
        + "{ \n"
        + "    gl_FragColor = v_fragmentColor;      \n"
        + "}\n";
/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_UCOLOR_VERT =
        "attribute vec4 a_position;\n"
        + "uniform    vec4 u_color;\n"
        + "uniform float u_pointSize;\n"
        + "varying lowp vec4 v_fragmentColor; \n"
        + "void main(void)   \n"
        + "{\n"
        //+ "    gl_Position = CC_MVPMatrix * a_position;  \n"
        + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
        + "    gl_PointSize = u_pointSize;          \n"
        + "    v_fragmentColor = u_color;           \n"
        + "}";

//---------------------Shader_PositionColor Shader Source-----------------------
/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_COLOR_FRAG =
        "precision lowp float; \n"
        + "varying vec4 v_fragmentColor; \n"
        + "void main() \n"
        + "{ \n"
        + "     gl_FragColor = v_fragmentColor; \n"
        + "} ";

/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_COLOR_VERT =
        "attribute vec4 a_position;\n"
        + "attribute vec4 a_color;\n"
        + "varying lowp vec4 v_fragmentColor;\n"
        + "void main()\n"
        + "{\n"
        + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
        + "    v_fragmentColor = a_color;             \n"
        + "}";

export const SHADER_SPRITE_POSITION_COLOR_VERT =
        "attribute vec4 a_position;\n"
        + "attribute vec4 a_color;\n"
        + "varying lowp vec4 v_fragmentColor;\n"
        + "void main()\n"
        + "{\n"
        + "    gl_Position = CC_PMatrix * a_position;  \n"
        + "    v_fragmentColor = a_color;             \n"
        + "}";

// --------------------- Shader_PositionColorLengthTexture Shader source------------------------
/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_COLOR_LENGTH_TEXTURE_FRAG =
        "// #extension GL_OES_standard_derivatives : enable\n"
        + "varying mediump vec4 v_color;\n"
        + "varying mediump vec2 v_texcoord;\n"
        + "void main()	\n"
        + "{ \n"
        + "// #if defined GL_OES_standard_derivatives	\n"
        + "// gl_FragColor = v_color*smoothstep(0.0, length(fwidth(v_texcoord)), 1.0 - length(v_texcoord)); \n"
        + "// #else	\n"
        + "gl_FragColor = v_color * step(0.0, 1.0 - length(v_texcoord)); \n"
        + "// #endif \n"
        + "}";

/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_COLOR_LENGTH_TEXTURE_VERT =
        "attribute mediump vec4 a_position; \n"
        + "attribute mediump vec2 a_texcoord; \n"
        + "attribute mediump vec4 a_color;	\n"
        + "varying mediump vec4 v_color; \n"
        + "varying mediump vec2 v_texcoord;	\n"
        + "void main() \n"
        + "{ \n"
        + "     v_color = a_color;//vec4(a_color.rgb * a_color.a, a_color.a); \n"
        + "     v_texcoord = a_texcoord; \n"
        //+ "    gl_Position = CC_MVPMatrix * a_position;  \n"
        + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
        + "}";

// ----------------------Shader_PositionTexture Shader Source-------------------------------------
/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_TEXTURE_FRAG =
        "precision lowp float;   \n"
        + "varying vec2 v_texCoord;  \n"
        + "void main() \n"
        + "{  \n"
        + "    gl_FragColor =  texture2D(CC_Texture0, v_texCoord);   \n"
        + "}";

/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_TEXTURE_VERT =
        "attribute vec4 a_position; \n"
        + "attribute vec2 a_texCoord; \n"
        + "varying mediump vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        //+ "    gl_Position = CC_MVPMatrix * a_position;  \n"
        + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
        + "    v_texCoord = a_texCoord;               \n"
        + "}";

// ------------------------Shader_PositionTexture_uColor Shader Source-------------------------------
/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_TEXTURE_UCOLOR_FRAG =
        "precision lowp float;  \n"
        + "uniform vec4 u_color; \n"
        + "varying vec2 v_texCoord; \n"
        + "void main() \n"
        + "{  \n"
        + "    gl_FragColor =  texture2D(CC_Texture0, v_texCoord) * u_color;    \n"
        + "}";

/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_TEXTURE_UCOLOR_VERT =
        "attribute vec4 a_position;\n"
        + "attribute vec2 a_texCoord; \n"
        + "varying mediump vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        //+ "    gl_Position = CC_MVPMatrix * a_position;  \n"
        + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
        + "    v_texCoord = a_texCoord;                 \n"
        + "}";

//---------------------Shader_PositionTextureA8Color Shader source-------------------------------
/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_TEXTURE_A8COLOR_FRAG =
        "precision lowp float;  \n"
        + "varying vec4 v_fragmentColor; \n"
        + "varying vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    gl_FragColor = vec4( v_fragmentColor.rgb,         \n"                            // RGB from uniform
        + "        v_fragmentColor.a * texture2D(CC_Texture0, v_texCoord).a   \n"                  // A from texture and uniform
        + "    ); \n"
        + "}";

/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_TEXTURE_A8COLOR_VERT =
        "attribute vec4 a_position; \n"
        + "attribute vec2 a_texCoord; \n"
        + "attribute vec4 a_color;  \n"
        + "varying lowp vec4 v_fragmentColor; \n"
        + "varying mediump vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
        + "    v_fragmentColor = a_color; \n"
        + "    v_texCoord = a_texCoord; \n"
        + "}";

// ------------------------Shader_PositionTextureColor Shader source------------------------------------
/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_TEXTURE_COLOR_FRAG =
        "precision lowp float;\n"
        + "varying vec4 v_fragmentColor; \n"
        + "varying vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    gl_FragColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord); \n"
        + "}";

/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_TEXTURE_COLOR_VERT =
        "attribute vec4 a_position; \n"
        + "attribute vec2 a_texCoord; \n"
        + "attribute vec4 a_color;  \n"
        + "varying lowp vec4 v_fragmentColor; \n"
        + "varying mediump vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    gl_Position = (CC_PMatrix * CC_MVMatrix) * a_position;  \n"
        + "    v_fragmentColor = a_color; \n"
        + "    v_texCoord = a_texCoord; \n"
        + "}";

/**
 * @constant
 * @type {String}
 */
export const SHADER_SPRITE_POSITION_TEXTURE_COLOR_VERT =
        "attribute vec4 a_position; \n"
        + "attribute vec2 a_texCoord; \n"
        + "attribute vec4 a_color;  \n"
        + "varying lowp vec4 v_fragmentColor; \n"
        + "varying mediump vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    gl_Position = CC_PMatrix * a_position;  \n"
        + "    v_fragmentColor = a_color; \n"
        + "    v_texCoord = a_texCoord; \n"
    + "}";

export const SHADER_SPRITE_POSITION_TEXTURE_COLOR_GRAY_FRAG =
        "precision lowp float;\n"
        + "varying vec4 v_fragmentColor; \n"
        + "varying vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    vec4 c = texture2D(CC_Texture0, v_texCoord); \n"
        + "    gl_FragColor.xyz = vec3(0.2126*c.r + 0.7152*c.g + 0.0722*c.b); \n"
        +"     gl_FragColor.w = c.w ; \n"
        + "}";
//-----------------------Shader_PositionTextureColorAlphaTest_frag Shader Source----------------------------
/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_TEXTURE_COLOR_ALPHATEST_FRAG =
        "precision lowp float;   \n"
        + "varying vec4 v_fragmentColor; \n"
        + "varying vec2 v_texCoord;   \n"
        + "uniform float CC_alpha_value; \n"
        + "void main() \n"
        + "{  \n"
        + "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);  \n"
        // mimic: glAlphaFunc(GL_GREATER)
        //pass if ( incoming_pixel >= CC_alpha_value ) => fail if incoming_pixel < CC_alpha_value
        + "    if ( texColor.a <= CC_alpha_value )          \n"
        + "        discard; \n"
        + "    gl_FragColor = texColor * v_fragmentColor;  \n"
        + "}";

//-----------------------ShaderEx_SwitchMask_frag Shader Source----------------------------
/**
 * @constant
 * @type {String}
 */
export const SHADEREX_SWITCHMASK_FRAG =
        "precision lowp float; \n"
        + "varying vec4 v_fragmentColor; \n"
        + "varying vec2 v_texCoord; \n"
        + "uniform sampler2D u_texture;  \n"
        + "uniform sampler2D   u_mask;   \n"
        + "void main()  \n"
        + "{  \n"
        + "    vec4 texColor   = texture2D(u_texture, v_texCoord);  \n"
        + "    vec4 maskColor  = texture2D(u_mask, v_texCoord); \n"
        + "    vec4 finalColor = vec4(texColor.r, texColor.g, texColor.b, maskColor.a * texColor.a);        \n"
        + "    gl_FragColor    = v_fragmentColor * finalColor; \n"
        + "}";

// -------------------- Multi-texture sprite shader (WebGL2 / GLSL ES 3.00) --------------------
// Used by the multi-texture batcher: a single draw call can reference up to
// `maxTextures` distinct textures, selected per-vertex via `a_texIndex`.

/**
 * Build the GLSL ES 3.00 vertex shader for the multi-texture sprite program.
 * @returns {String}
 */
export function buildSpriteMultiTextureVert() {
    return "#version 300 es\n"
        + "in vec4 a_position;\n"
        + "in vec4 a_color;\n"
        + "in vec2 a_texCoord;\n"
        + "in float a_texIndex;\n"
        + "out lowp vec4 v_fragmentColor;\n"
        + "out mediump vec2 v_texCoord;\n"
        + "flat out int v_texIndex;\n"
        + "void main()\n"
        + "{\n"
        + "    gl_Position = CC_PMatrix * a_position;\n"
        + "    v_fragmentColor = a_color;\n"
        + "    v_texCoord = a_texCoord;\n"
        + "    v_texIndex = int(a_texIndex + 0.5);\n"
        + "}\n";
}

/**
 * Build the GLSL ES 3.00 fragment shader for the multi-texture sprite program.
 * GLSL ES 3.00 forbids dynamic indexing of a sampler array, so a switch ladder
 * over the (flat) integer index is used.
 * @param {Number} maxTextures Number of sampler-array slots (>= 1).
 * @returns {String}
 */
export function buildSpriteMultiTextureFrag(maxTextures) {
    let src =
        "#version 300 es\n"
        + "precision highp int;\n"
        + "in lowp vec4 v_fragmentColor;\n"
        + "in mediump vec2 v_texCoord;\n"
        + "flat in int v_texIndex;\n"
        + "uniform sampler2D CC_Textures[" + maxTextures + "];\n"
        + "out vec4 cc_FragColor;\n"
        + "void main()\n"
        + "{\n"
        + "    vec4 texColor;\n"
        + "    switch (v_texIndex)\n"
        + "    {\n";
    for (let i = 0; i < maxTextures; ++i) {
        src += "        case " + i + ": texColor = texture(CC_Textures[" + i + "], v_texCoord); break;\n";
    }
    src +=
        "        default: texColor = texture(CC_Textures[0], v_texCoord);\n"
        + "    }\n"
        + "    cc_FragColor = v_fragmentColor * texColor;\n"
        + "}\n";
    return src;
}
