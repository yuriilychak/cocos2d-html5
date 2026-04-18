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
 * cc.configuration is a singleton object which contains some openGL variables
 * @class
 * @name cc.configuration
 * @example
 * var textureSize = cc.configuration.getMaxTextureSize();
 */
export const configuration = /** @lends cc.configuration# */{
	// Type constants
	ERROR: 0,
	STRING: 1,
	INT: 2,
	DOUBLE: 3,
	BOOLEAN: 4,

    _maxTextureSize: 0,
    _maxModelviewStackDepth: 0,
    _supportsPVRTC: false,
    _supportsNPOT: false,
    _supportsBGRA8888: false,
    _supportsDiscardFramebuffer: false,
    _supportsShareableVAO: false,
    _maxSamplesAllowed: 0,
    _maxTextureUnits: 0,
    _GlExtensions: "",
    _valueDict: {},

	_inited: false,

	_init: function () {
		var locValueDict = this._valueDict;
		locValueDict["cocos2d.x.version"] = cc.ENGINE_VERSION;
		locValueDict["cocos2d.x.compiled_with_profiler"] = false;
		locValueDict["cocos2d.x.compiled_with_gl_state_cache"] = cc.ENABLE_GL_STATE_CACHE;
		this._inited = true;
	},

    getMaxTextureSize: function () {
        return this._maxTextureSize;
    },

    getMaxModelviewStackDepth: function () {
        return this._maxModelviewStackDepth;
    },

    getMaxTextureUnits: function () {
        return this._maxTextureUnits;
    },

    supportsNPOT: function () {
        return this._supportsNPOT;
    },

    supportsPVRTC: function () {
        return this._supportsPVRTC;
    },

	supportsETC: function () {
		return false;
	},

	supportsS3TC: function () {
		return false;
	},

	supportsATITC: function () {
		return false;
	},

    supportsBGRA8888: function () {
        return this._supportsBGRA8888;
    },

    supportsDiscardFramebuffer: function () {
        return this._supportsDiscardFramebuffer;
    },

    supportsShareableVAO: function () {
        return this._supportsShareableVAO;
    },

    checkForGLExtension: function (searchName) {
        return this._GlExtensions.indexOf(searchName) > -1;
    },

    getValue: function (key, default_value) {
	    if (!this._inited)
		    this._init();
        var locValueDict = this._valueDict;
        if (locValueDict[key])
            return locValueDict[key];
        return default_value;
    },

    setValue: function (key, value) {
        this._valueDict[key] = value;
    },

    dumpInfo: function () {
         if (cc.ENABLE_GL_STATE_CACHE === 0) {
             cc.log("");
             cc.log(cc._LogInfos.configuration_dumpInfo);
             cc.log("");
         }
    },

    gatherGPUInfo: function () {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return;

	    if (!this._inited)
		    this._init();
        var gl = cc._renderContext;
        var locValueDict = this._valueDict;
        locValueDict["gl.vendor"] = gl.getParameter(gl.VENDOR);
        locValueDict["gl.renderer"] = gl.getParameter(gl.RENDERER);
        locValueDict["gl.version"] = gl.getParameter(gl.VERSION);

        this._GlExtensions = "";
        var extArr = gl.getSupportedExtensions();
        for (var i = 0; i < extArr.length; i++)
            this._GlExtensions += extArr[i] + " ";

        this._maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        locValueDict["gl.max_texture_size"] = this._maxTextureSize;
        this._maxTextureUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        locValueDict["gl.max_texture_units"] = this._maxTextureUnits;

        this._supportsPVRTC = this.checkForGLExtension("GL_IMG_texture_compression_pvrtc");
        locValueDict["gl.supports_PVRTC"] = this._supportsPVRTC;

        this._supportsNPOT = false;
        locValueDict["gl.supports_NPOT"] = this._supportsNPOT;

        this._supportsBGRA8888 = this.checkForGLExtension("GL_IMG_texture_format_BGRA888");
        locValueDict["gl.supports_BGRA8888"] = this._supportsBGRA8888;

        this._supportsDiscardFramebuffer = this.checkForGLExtension("GL_EXT_discard_framebuffer");
        locValueDict["gl.supports_discard_framebuffer"] = this._supportsDiscardFramebuffer;

        this._supportsShareableVAO = this.checkForGLExtension("vertex_array_object");
        locValueDict["gl.supports_vertex_array_object"] = this._supportsShareableVAO;

        cc.checkGLErrorDebug();
    },

    loadConfigFile: function (url) {
	    if (!this._inited)
		    this._init();
        var dict = cc.loader.getRes(url);
        if (!dict) throw new Error("Please load the resource first : " + url);
        cc.assert(dict, cc._LogInfos.configuration_loadConfigFile_2, url);

        var getDatas = dict["data"];
        if (!getDatas) {
            cc.log(cc._LogInfos.configuration_loadConfigFile, url);
            return;
        }

        for (var selKey in getDatas)
            this._valueDict[selKey] = getDatas[selKey];
    }
};
