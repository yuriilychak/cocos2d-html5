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

import { defineGetterSetter } from '../platform/class';

export function initPrototypeTexture2D() {

    var _c = cc.Texture2D;

    /**
     * <p>
     *    treats (or not) PVR files as if they have alpha premultiplied.                                                <br/>
     *    Since it is impossible to know at runtime if the PVR images have the alpha channel premultiplied, it is       <br/>
     *    possible load them as if they have (or not) the alpha channel premultiplied.                                  <br/>
     *                                                                                                                  <br/>
     *    By default it is disabled.                                                                                    <br/>
     * </p>
     * @param haveAlphaPremultiplied
     */
    _c.PVRImagesHavePremultipliedAlpha = function (haveAlphaPremultiplied) {
        cc.PVRHaveAlphaPremultiplied_ = haveAlphaPremultiplied;
    };

    /**
     * 32-bit texture: RGBA8888
     * @memberOf cc.Texture2D
     * @name PIXEL_FORMAT_RGBA8888
     * @static
     * @constant
     * @type {Number}
     */
    _c.PIXEL_FORMAT_RGBA8888 = 2;

    /**
     * 24-bit texture: RGBA888
     * @memberOf cc.Texture2D
     * @name PIXEL_FORMAT_RGB888
     * @static
     * @constant
     * @type {Number}
     */
    _c.PIXEL_FORMAT_RGB888 = 3;

    /**
     * 16-bit texture without Alpha channel
     * @memberOf cc.Texture2D
     * @name PIXEL_FORMAT_RGB565
     * @static
     * @constant
     * @type {Number}
     */
    _c.PIXEL_FORMAT_RGB565 = 4;

    /**
     * 8-bit textures used as masks
     * @memberOf cc.Texture2D
     * @name PIXEL_FORMAT_A8
     * @static
     * @constant
     * @type {Number}
     */
    _c.PIXEL_FORMAT_A8 = 5;

    /**
     * 8-bit intensity texture
     * @memberOf cc.Texture2D
     * @name PIXEL_FORMAT_I8
     * @static
     * @constant
     * @type {Number}
     */
    _c.PIXEL_FORMAT_I8 = 6;

    /**
     * 16-bit textures used as masks
     * @memberOf cc.Texture2D
     * @name PIXEL_FORMAT_AI88
     * @static
     * @constant
     * @type {Number}
     */
    _c.PIXEL_FORMAT_AI88 = 7;

    /**
     * 16-bit textures: RGBA4444
     * @memberOf cc.Texture2D
     * @name PIXEL_FORMAT_RGBA4444
     * @static
     * @constant
     * @type {Number}
     */
    _c.PIXEL_FORMAT_RGBA4444 = 8;

    /**
     * 16-bit textures: RGB5A1
     * @memberOf cc.Texture2D
     * @name PIXEL_FORMAT_RGB5A1
     * @static
     * @constant
     * @type {Number}
     */
    _c.PIXEL_FORMAT_RGB5A1 = 7;

    /**
     * 4-bit PVRTC-compressed texture: PVRTC4
     * @memberOf cc.Texture2D
     * @name PIXEL_FORMAT_PVRTC4
     * @static
     * @constant
     * @type {Number}
     */
    _c.PIXEL_FORMAT_PVRTC4 = 9;

    /**
     * 2-bit PVRTC-compressed texture: PVRTC2
     * @memberOf cc.Texture2D
     * @name PIXEL_FORMAT_PVRTC2
     * @static
     * @constant
     * @type {Number}
     */
    _c.PIXEL_FORMAT_PVRTC2 = 10;

    /**
     * Default texture format: RGBA8888
     * @memberOf cc.Texture2D
     * @name PIXEL_FORMAT_DEFAULT
     * @static
     * @constant
     * @type {Number}
     */
    _c.PIXEL_FORMAT_DEFAULT = _c.PIXEL_FORMAT_RGBA8888;

    /**
     * The default pixel format
     * @memberOf cc.Texture2D
     * @name PIXEL_FORMAT_PVRTC2
     * @static
     * @type {Number}
     */
    _c.defaultPixelFormat = _c.PIXEL_FORMAT_DEFAULT;

    var _M = cc.Texture2D._M = {};
    _M[_c.PIXEL_FORMAT_RGBA8888] = "RGBA8888";
    _M[_c.PIXEL_FORMAT_RGB888] = "RGB888";
    _M[_c.PIXEL_FORMAT_RGB565] = "RGB565";
    _M[_c.PIXEL_FORMAT_A8] = "A8";
    _M[_c.PIXEL_FORMAT_I8] = "I8";
    _M[_c.PIXEL_FORMAT_AI88] = "AI88";
    _M[_c.PIXEL_FORMAT_RGBA4444] = "RGBA4444";
    _M[_c.PIXEL_FORMAT_RGB5A1] = "RGB5A1";
    _M[_c.PIXEL_FORMAT_PVRTC4] = "PVRTC4";
    _M[_c.PIXEL_FORMAT_PVRTC2] = "PVRTC2";

    var _B = cc.Texture2D._B = {};
    _B[_c.PIXEL_FORMAT_RGBA8888] = 32;
    _B[_c.PIXEL_FORMAT_RGB888] = 24;
    _B[_c.PIXEL_FORMAT_RGB565] = 16;
    _B[_c.PIXEL_FORMAT_A8] = 8;
    _B[_c.PIXEL_FORMAT_I8] = 8;
    _B[_c.PIXEL_FORMAT_AI88] = 16;
    _B[_c.PIXEL_FORMAT_RGBA4444] = 16;
    _B[_c.PIXEL_FORMAT_RGB5A1] = 16;
    _B[_c.PIXEL_FORMAT_PVRTC4] = 4;
    _B[_c.PIXEL_FORMAT_PVRTC2] = 3;

    var _p = cc.Texture2D.prototype;

    // Extended properties
    _p.name;
    defineGetterSetter(_p, "name", _p.getName);
    _p.pixelFormat;
    defineGetterSetter(_p, "pixelFormat", _p.getPixelFormat);
    _p.pixelsWidth;
    defineGetterSetter(_p, "pixelsWidth", _p.getPixelsWide);
    _p.pixelsHeight;
    defineGetterSetter(_p, "pixelsHeight", _p.getPixelsHigh);
    _p.width;
    defineGetterSetter(_p, "width", _p._getWidth);
    _p.height;
    defineGetterSetter(_p, "height", _p._getHeight);
}

export function initPrototypeTextureAtlas() {

    var _p = cc.TextureAtlas.prototype;

    // Extended properties
    _p.totalQuads;
    defineGetterSetter(_p, "totalQuads", _p.getTotalQuads);
    _p.capacity;
    defineGetterSetter(_p, "capacity", _p.getCapacity);
    _p.quads;
    defineGetterSetter(_p, "quads", _p.getQuads, _p.setQuads);

}
