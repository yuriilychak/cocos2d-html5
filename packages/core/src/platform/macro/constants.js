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

/**
 * @constant
 * @type Number
 */
export const INVALID_INDEX = -1;

/**
 * PI is the ratio of a circle's circumference to its diameter.
 * @constant
 * @type Number
 */
export const PI = Math.PI;

/**
 * @constant
 * @type Number
 */
export const FLT_MAX = parseFloat('3.402823466e+38F');

/**
 * @constant
 * @type Number
 */
export const FLT_MIN = parseFloat("1.175494351e-38F");

/**
 * @constant
 * @type Number
 */
export const RAD = PI / 180;

/**
 * @constant
 * @type Number
 */
export const DEG = 180 / PI;

/**
 * maximum unsigned int value
 * @constant
 * @type Number
 */
export const UINT_MAX = 0xffffffff;

/**
 * @constant
 * @type Number
 */
export const REPEAT_FOREVER = Number.MAX_VALUE - 1;

/**
 * @constant
 * @type Number
 */
export const FLT_EPSILON = 0.0000001192092896;

//some gl constant variable
/**
 * @constant
 * @type Number
 */
export const ONE = 1;

/**
 * @constant
 * @type Number
 */
export const ZERO = 0;

/**
 * @constant
 * @type Number
 */
export const SRC_ALPHA = 0x0302;

/**
 * @constant
 * @type Number
 */
export const SRC_ALPHA_SATURATE = 0x308;

/**
 * @constant
 * @type Number
 */
export const SRC_COLOR = 0x300;

/**
 * @constant
 * @type Number
 */
export const DST_ALPHA = 0x304;

/**
 * @constant
 * @type Number
 */
export const DST_COLOR = 0x306;

/**
 * @constant
 * @type Number
 */
export const ONE_MINUS_SRC_ALPHA = 0x0303;

/**
 * @constant
 * @type Number
 */
export const ONE_MINUS_SRC_COLOR = 0x301;

/**
 * @constant
 * @type Number
 */
export const ONE_MINUS_DST_ALPHA = 0x305;

/**
 * @constant
 * @type Number
 */
export const ONE_MINUS_DST_COLOR = 0x0307;

/**
 * @constant
 * @type Number
 */
export const ONE_MINUS_CONSTANT_ALPHA = 0x8004;

/**
 * @constant
 * @type Number
 */
export const ONE_MINUS_CONSTANT_COLOR = 0x8002;

/**
 * the constant variable equals gl.LINEAR for texture
 * @constant
 * @type Number
 */
export const LINEAR = 0x2601;

/**
 * the constant variable equals gl.REPEAT for texture
 * @constant
 * @type Number
 */
export const REPEAT = 0x2901;

/**
 * the constant variable equals gl.CLAMP_TO_EDGE for texture
 * @constant
 * @type Number
 */
export const CLAMP_TO_EDGE = 0x812f;

/**
 * the constant variable equals gl.MIRRORED_REPEAT for texture
 * @constant
 * @type Number
 */
export const MIRRORED_REPEAT = 0x8370;

/**
 * default gl blend src function. Compatible with premultiplied alpha images.
 * @constant
 * @name BLEND_SRC
 * @type Number
 */
export var BLEND_SRC = SRC_ALPHA;

/**
 * default gl blend dst function. Compatible with premultiplied alpha images.
 * @constant
 * @type Number
 */
export const BLEND_DST = ONE_MINUS_SRC_ALPHA;

//Possible device orientations
/**
 * Device oriented vertically, home button on the bottom (UIDeviceOrientationPortrait)
 * @constant
 * @type Number
 */
export const ORIENTATION_PORTRAIT = 1;

/**
 * Device oriented horizontally, home button on the right (UIDeviceOrientationLandscapeLeft)
 * @constant
 * @type Number
 */
export const ORIENTATION_LANDSCAPE = 2;

/**
 * Device oriented vertically, home button on the top (UIDeviceOrientationPortraitUpsideDown)
 * @constant
 * @type Number
 */
export const ORIENTATION_AUTO = 3;

/**
 * The maximum vertex count for a single batched draw call.
 * @constant
 * @type Number
 */
export const BATCH_VERTEX_COUNT = 2000;

// ------------------- vertex attrib flags -----------------------------
/**
 * @constant
 * @type {Number}
 */
export const VERTEX_ATTRIB_FLAG_NONE = 0;
/**
 * @constant
 * @type {Number}
 */
export const VERTEX_ATTRIB_FLAG_POSITION = 1 << 0;
/**
 * @constant
 * @type {Number}
 */
export const VERTEX_ATTRIB_FLAG_COLOR = 1 << 1;
/**
 * @constant
 * @type {Number}
 */
export const VERTEX_ATTRIB_FLAG_TEX_COORDS = 1 << 2;
/**
 * @constant
 * @type {Number}
 */
export const VERTEX_ATTRIB_FLAG_POS_COLOR_TEX = ( VERTEX_ATTRIB_FLAG_POSITION | VERTEX_ATTRIB_FLAG_COLOR | VERTEX_ATTRIB_FLAG_TEX_COORDS );

/**
 * GL server side states
 * @constant
 * @type {Number}
 */
export const GL_ALL = 0;

//-------------Vertex Attributes-----------
/**
 * @constant
 * @type {Number}
 */
export const VERTEX_ATTRIB_POSITION = 0;
/**
 * @constant
 * @type {Number}
 */
export const VERTEX_ATTRIB_COLOR = 1;
/**
 * @constant
 * @type {Number}
 */
export const VERTEX_ATTRIB_TEX_COORDS = 2;
/**
 * @constant
 * @type {Number}
 */
export const VERTEX_ATTRIB_MAX = 7;

//------------Uniforms------------------
/**
 * @constant
 * @type {Number}
 */
export const UNIFORM_PMATRIX = 0;
/**
 * @constant
 * @type {Number}
 */
export const UNIFORM_MVMATRIX = 1;
/**
 * @constant
 * @type {Number}
 */
export const UNIFORM_MVPMATRIX = 2;
/**
 * @constant
 * @type {Number}
 */
export const UNIFORM_TIME = 3;
/**
 * @constant
 * @type {Number}
 */
export const UNIFORM_SINTIME = 4;
/**
 * @constant
 * @type {Number}
 */
export const UNIFORM_COSTIME = 5;
/**
 * @constant
 * @type {Number}
 */
export const UNIFORM_RANDOM01 = 6;
/**
 * @constant
 * @type {Number}
 */
export const UNIFORM_SAMPLER = 7;
/**
 * @constant
 * @type {Number}
 */
export const UNIFORM_MAX = 8;

//------------Shader Name---------------
/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_TEXTURECOLOR = "ShaderPositionTextureColor";
/**
 * @constant
 * @type {String}
 */
export const SHADER_SPRITE_POSITION_TEXTURECOLOR = "ShaderSpritePositionTextureColor";
/**
 * @constant
 * @type {String}
 */
export const SHADER_SPRITE_POSITION_TEXTURECOLOR_GRAY = "ShaderSpritePositionTextureColorGray";
/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_TEXTURECOLORALPHATEST = "ShaderPositionTextureColorAlphaTest";
/**
 * @constant
 * @type {String}
 */
export const SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST = "ShaderSpritePositionTextureColorAlphaTest";
/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_COLOR = "ShaderPositionColor";
/**
 * @constant
 * @type {String}
 */
export const SHADER_SPRITE_POSITION_COLOR = "ShaderSpritePositionColor";
/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_TEXTURE = "ShaderPositionTexture";
/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_TEXTURE_UCOLOR = "ShaderPositionTextureUColor";
/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_TEXTUREA8COLOR = "ShaderPositionTextureA8Color";
/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_UCOLOR = "ShaderPositionUColor";
/**
 * @constant
 * @type {String}
 */
export const SHADER_POSITION_LENGTHTEXTURECOLOR = "ShaderPositionLengthTextureColor";

//------------uniform names----------------
/**
 * @constant
 * @type {String}
 */
export const UNIFORM_PMATRIX_S = "CC_PMatrix";
/**
 * @constant
 * @type {String}
 */
export const UNIFORM_MVMATRIX_S = "CC_MVMatrix";
/**
 * @constant
 * @type {String}
 */
export const UNIFORM_MVPMATRIX_S = "CC_MVPMatrix";
/**
 * @constant
 * @type {String}
 */
export const UNIFORM_TIME_S = "CC_Time";
/**
 * @constant
 * @type {String}
 */
export const UNIFORM_SINTIME_S = "CC_SinTime";
/**
 * @constant
 * @type {String}
 */
export const UNIFORM_COSTIME_S = "CC_CosTime";
/**
 * @constant
 * @type {String}
 */
export const UNIFORM_RANDOM01_S = "CC_Random01";
/**
 * @constant
 * @type {String}
 */
export const UNIFORM_SAMPLER_S = "CC_Texture0";
/**
 * @constant
 * @type {String}
 */
export const UNIFORM_ALPHA_TEST_VALUE_S = "CC_alpha_value";

//------------Attribute names--------------
/**
 * @constant
 * @type {String}
 */
export const ATTRIBUTE_NAME_COLOR = "a_color";
/**
 * @constant
 * @type {String}
 */
export const ATTRIBUTE_NAME_POSITION = "a_position";
/**
 * @constant
 * @type {String}
 */
export const ATTRIBUTE_NAME_TEX_COORD = "a_texCoord";
/**
 * @constant
 * @type {String}
 */
export const ATTRIBUTE_NAME_MVMAT = "a_mvMatrix";


/**
 * default size for font size
 * @constant
 * @type Number
 */
export const ITEM_SIZE = 32;

/**
 * default tag for current item
 * @constant
 * @type Number
 */
export const CURRENT_ITEM = 0xc0c05001;
/**
 * default tag for zoom action tag
 * @constant
 * @type Number
 */
export const ZOOM_ACTION_TAG = 0xc0c05002;
/**
 * default tag for normal
 * @constant
 * @type Number
 */
export const NORMAL_TAG = 8801;

/**
 * default selected tag
 * @constant
 * @type Number
 */
export const SELECTED_TAG = 8802;

/**
 * default disabled tag
 * @constant
 * @type Number
 */
export const DISABLE_TAG = 8803;

/** Default Action tag
 * @constant
 * @type {Number}
 * @default
 */
export const ACTION_TAG_INVALID = -1;