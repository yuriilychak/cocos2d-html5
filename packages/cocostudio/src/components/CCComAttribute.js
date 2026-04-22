/****************************************************************************
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
 * The attribute component for Cocostudio.
 */
ccs.ComAttribute = class ComAttribute extends ccs.Component {

    /**
     * Construction of ccs.ComAttribute
     */
    constructor () {
        super();
        this._jsonDict = {};
        this._filePath = "";
        this._name = "CCComAttribute";
        this.init();
    }

    /**
     * Initializes a ccs.ComAttribute
     * @returns {boolean}
     */
    init () {
        this._jsonDict = {};
        return true;
    }

    /**
     * Sets int attribute
     * @param {String} key
     * @param {number} value
     */
    setInt (key, value) {
        if (!key) {
            cc.log("Argument must be non-nil");
            return;
        }
        this._jsonDict[key] = value;
    }

    /**
     * Sets double attribute
     * @param {String} key
     * @param {number} value
     */
    setDouble (key, value) {
        if (!key) {
            cc.log("Argument must be non-nil");
            return;
        }
        this._jsonDict[key] = value;
    }

    /**
     * Sets float attribute
     * @param {String} key
     * @param {number} value
     */
    setFloat (key, value) {
        if (!key) {
            cc.log("Argument must be non-nil");
            return;
        }
        this._jsonDict[key] = value;
    }

    /**
     * Sets boolean attribute
     * @param {String} key
     * @param {Boolean} value
     */
    setBool (key, value) {
        if (!key) {
            cc.log("Argument must be non-nil");
            return;
        }
        this._jsonDict[key] = value;
    }

    /**
     * Sets string attribute
     * @param {String} key
     * @param {Boolean} value
     */
    setString (key, value) {
        if (!key) {
            cc.log("Argument must be non-nil");
            return;
        }
        this._jsonDict[key] = value;
    }

    /**
     * Sets object attribute
     * @param {String} key
     * @param {Object} value
     */
    setObject (key, value) {
        if (!key) {
            cc.log("Argument must be non-nil");
            return;
        }
        this._jsonDict[key] = value;
    }

    /**
     * Returns int value from attribute
     * @param {String} key
     * @returns {Number}
     */
    getInt (key) {
        var ret = this._jsonDict[key];
        return parseInt(ret || 0);
    }

    /**
     * Returns double value from attribute
     * @param {String} key
     * @returns {Number}
     */
    getDouble (key) {
        var ret = this._jsonDict[key];
        return parseFloat(ret || 0.0);
    }

    /**
     * Returns float value from attribute
     * @param {String} key
     * @returns {Number}
     */
    getFloat (key) {
        var ret = this._jsonDict[key];
        return parseFloat(ret || 0.0);
    }

    /**
     * Returns boolean value from attribute
     * @param {String} key
     * @returns {Boolean}
     */
    getBool (key) {
        var ret = this._jsonDict[key];
        return Boolean(ret || false);
    }

    /**
     * Returns string value from attribute
     * @param {String} key
     * @returns {String}
     */
    getString (key) {
        var ret = this._jsonDict[key];
        return ret || "";
    }

    /**
     * Returns object value from attribute
     * @param {String} key
     * @returns {Object}
     */
    getObject (key) {
        return this._jsonDict[key];
    }

    /**
     * Parses json file.
     * @param  filename
     */
    parse (filename) {
        this._jsonDict = cc.loader.getRes(filename);
    }
};
