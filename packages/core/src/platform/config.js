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

import { Point } from "../cocoa/geometry/point";

/**
 * <p>
 *   If enabled, the texture coordinates will be calculated by using this formula: <br/>
 *      - texCoord.left = (rect.x*2+1) / (texture.wide*2);                  <br/>
 *      - texCoord.right = texCoord.left + (rect.width*2-2)/(texture.wide*2); <br/>
 *                                                                                 <br/>
 *  The same for bottom and top.                                                   <br/>
 *                                                                                 <br/>
 *  This formula prevents artifacts by using 99% of the texture.                   <br/>
 *  The "correct" way to prevent artifacts is by using the spritesheet-artifact-fixer.py or a similar tool.<br/>
 *                                                                                  <br/>
 *  Affected nodes:                                                                 <br/>
 *      - Sprite / SpriteBatchNode and subclasses: LabelBMFont, TMXTiledMap <br/>
 *      - LabelAtlas                                                              <br/>
 *      - QuadParticleSystem                                                      <br/>
 *      - TileMap                                                                 <br/>
 *                                                                                  <br/>
 *  To enabled set it to 1. Disabled by default.<br/>
 *  To modify it, in Web engine please refer to Config.js, in JSB please refer to Config.h
 * </p>
 * @constant
 * @type {Number}
 */
export const FIX_ARTIFACTS_BY_STRECHING_TEXEL = 0;

/**
 * Position of the FPS (Default: 0,0 (bottom-left corner))<br/>
 * To modify it, in Web engine please refer to Config.js, in JSB please refer to Config.h
 * @constant
 * @type {Point}
 * @namespace cc
 */
export const DIRECTOR_STATS_POSITION = new Point();

/**
 * <p>
 *   Seconds between FPS updates.<br/>
 *   0.5 seconds, means that the FPS number will be updated every 0.5 seconds.<br/>
 *   Having a bigger number means a more reliable FPS<br/>
 *   <br/>
 *   Default value: 0.1f<br/>
 *   To modify it, in Web engine please refer to Config.js, in JSB please refer to Config.h
 * </p>
 * @constant
 * @type {Number}
 */
export const DIRECTOR_FPS_INTERVAL = 0.5;

/**
 * <p>
 *    If enabled, the Node objects (Sprite, Label,etc) will be able to render in subpixels.<br/>
 *    If disabled, integer pixels will be used.<br/>
 *    <br/>
 *    To enable set it to 1. Enabled by default.<br/>
 *    To modify it, in Web engine please refer to Config.js, in JSB please refer to Config.h
 * </p>
 * @constant
 * @type {Number}
 */
export const COCOSNODE_RENDER_SUBPIXEL = 1;

/**
 * <p>
 *   If enabled, the Sprite objects rendered with SpriteBatchNode will be able to render in subpixels.<br/>
 *   If disabled, integer pixels will be used.<br/>
 *   <br/>
 *   To enable set it to 1. Enabled by default.<br/>
 *   To modify it, in Web engine please refer to Config.js, in JSB please refer to Config.h
 * </p>
 * @constant
 * @type {Number}
 */
export const SPRITEBATCHNODE_RENDER_SUBPIXEL = 1;

/**
 * <p>
 *     If most of your images have pre-multiplied alpha, set it to 1 (if you are going to use .PNG/.JPG file images).<br/>
 *     Only set to 0 if ALL your images by-pass Apple UIImage loading system (eg: if you use libpng or PVR images)<br/>
 *     <br/>
 *     To enable set it to a value different than 0. Enabled by default.<br/>
 *     To modify it, in Web engine please refer to Config.js, in JSB please refer to Config.h
 * </p>
 * @constant
 * @type {Number}
 */
export const OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA = 1;

/**
 * <p>
 *   Use GL_TRIANGLE_STRIP instead of GL_TRIANGLES when rendering the texture atlas.<br/>
 *   It seems it is the recommend way, but it is much slower, so, enable it at your own risk<br/>
 *   <br/>
 *   To enable set it to a value different than 0. Disabled by default.<br/>
 *   To modify it, in Web engine please refer to Config.js, in JSB please refer to Config.h
 * </p>
 * @constant
 * @type {Number}
 */
export const TEXTURE_ATLAS_USE_TRIANGLE_STRIP = 0;

/**
 * <p>
 *    By default, TextureAtlas (used by many cocos2d classes) will use VAO (Vertex Array Objects).<br/>
 *    Apple recommends its usage but they might consume a lot of memory, specially if you use many of them.<br/>
 *    So for certain cases, where you might need hundreds of VAO objects, it might be a good idea to disable it.<br/>
 *    <br/>
 *    To disable it set it to 0. disable by default.(Not Supported on WebGL)<br/>
 *    To modify it, in Web engine please refer to Config.js, in JSB please refer to Config.h
 * </p>
 * @constant
 * @type {Number}
 */
export const TEXTURE_ATLAS_USE_VAO = 0;

/**
 * <p>
 *  If enabled, NPOT textures will be used where available. Only 3rd gen (and newer) devices support NPOT textures.<br/>
 *  NPOT textures have the following limitations:<br/>
 *     - They can't have mipmaps<br/>
 *     - They only accept GL_CLAMP_TO_EDGE in GL_TEXTURE_WRAP_{S,T}<br/>
 *  <br/>
 *  To enable set it to a value different than 0. Disabled by default. <br/>
 *  <br/>
 *  This value governs only the PNG, GIF, BMP, images.<br/>
 *  This value DOES NOT govern the PVR (PVR.GZ, PVR.Z) files. If NPOT PVR is loaded, then it will create an NPOT texture ignoring this value.<br/>
 *  To modify it, in Web engine please refer to Config.js, in JSB please refer to Config.h
 * </p>
 * @constant
 * @type {Number}
 */
export const TEXTURE_NPOT_SUPPORT = 0;

/**
 * <p>
 *    It's the suffix that will be appended to the files in order to load "retina display" images.<br/>
 *    <br/>
 *    On an iPhone4 with Retina Display support enabled, the file @"sprite-hd.png" will be loaded instead of @"sprite.png".<br/>
 *    If the file doesn't exist it will use the non-retina display image.<br/>
 *    <br/>
 *    Platforms: Only used on Retina Display devices like iPhone 4.
 * </p>
 * @constant
 * @type {String}
 */
export const RETINA_DISPLAY_FILENAME_SUFFIX = "-hd";

/**
 * <p>
 *     If enabled, it will use LA88 (Luminance Alpha 16-bit textures) for LabelTTF objects. <br/>
 *     If it is disabled, it will use A8 (Alpha 8-bit textures).                              <br/>
 *     LA88 textures are 6% faster than A8 textures, but they will consume 2x memory.         <br/>
 *                                                                                            <br/>
 *     This feature is enabled by default.
 * </p>
 * @constant
 * @type {Number}
 */
export const USE_LA88_LABELS = 1;

/**
 * <p>
 *   If enabled, all subclasses of Sprite will draw a bounding box<br/>
 *   Useful for debugging purposes only. It is recommend to leave it disabled.<br/>
 *   <br/>
 *   To enable set it to a value different than 0. Disabled by default:<br/>
 *      0 -- disabled<br/>
 *      1 -- draw bounding box<br/>
 *      2 -- draw texture box
 * </p>
 * @constant
 * @type {Number}
 */
export const SPRITE_DEBUG_DRAW = 0;

/**
 * <p>
 *    If enabled, all subclasses of Sprite that are rendered using an SpriteBatchNode draw a bounding box.<br/>
 *    Useful for debugging purposes only. It is recommend to leave it disabled.<br/>
 *    <br/>
 *    To enable set it to a value different than 0. Disabled by default.
 * </p>
 * @constant
 * @type {Number}
 */
export const SPRITEBATCHNODE_DEBUG_DRAW = 0;

/**
 * <p>
 *   If enabled, all subclasses of LabelBMFont will draw a bounding box <br/>
 *   Useful for debugging purposes only. It is recommend to leave it disabled.<br/>
 *   <br/>
 *   To enable set it to a value different than 0. Disabled by default.<br/>
 * </p>
 * @constant
 * @type {Number}
 */
export const LABELBMFONT_DEBUG_DRAW = 0;

/**
 * <p>
 *    If enabled, all subclasses of LabelAtlas will draw a bounding box<br/>
 *    Useful for debugging purposes only. It is recommend to leave it disabled.<br/>
 *    <br/>
 *    To enable set it to a value different than 0. Disabled by default.
 * </p>
 * @constant
 * @type {Number}
 */
export const LABELATLAS_DEBUG_DRAW = 0;

export const DRAWNODE_TOTAL_VERTICES = 20000;

export const ENGINE_VERSION = "Cocos2d-JS v3.17";

/**
 * Default engine
 * @constant
 * @type {String}
 */
export const DEFAULT_ENGINE = ENGINE_VERSION + "-canvas";

/**
 * <p>
 *    If enabled, actions that alter the position property (eg: MoveBy, JumpBy, BezierBy, etc..) will be stacked.                  <br/>
 *    If you run 2 or more 'position' actions at the same time on a node, then end position will be the sum of all the positions.        <br/>
 *    If disabled, only the last run action will take effect.
 * </p>
 * @constant
 * @type {number}
 */
export const ENABLE_STACKABLE_ACTIONS = 1;
