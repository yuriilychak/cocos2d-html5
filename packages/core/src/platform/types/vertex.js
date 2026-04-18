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

import { defineGetterSetter } from '../class';

/**
 * @class Vertex2F
 * @param {Number} x
 * @param {Number}y
 * @param {Array} arrayBuffer
 * @param {Number}offset
 * @constructor
 */
export var Vertex2F = function (x, y, arrayBuffer, offset) {
    this._arrayBuffer = arrayBuffer || new ArrayBuffer(Vertex2F.BYTES_PER_ELEMENT);
    this._offset = offset || 0;

    this._view = new Float32Array(this._arrayBuffer, this._offset, 2);
    this._view[0] = x || 0;
    this._view[1] = y || 0;
};
/**
 * @constant
 * @type {number}
 */
Vertex2F.BYTES_PER_ELEMENT = 8;

var _p = Vertex2F.prototype;
_p._getX = function () {
    return this._view[0];
};
_p._setX = function (xValue) {
    this._view[0] = xValue;
};
_p._getY = function () {
    return this._view[1];
};
_p._setY = function (yValue) {
    this._view[1] = yValue;
};
/** @expose */
_p.x;
defineGetterSetter(_p, "x", _p._getX, _p._setX);
/** @expose */
_p.y;
defineGetterSetter(_p, "y", _p._getY, _p._setY);

/**
 * @class Vertex3F
 * @param {Number} x
 * @param {Number} y
 * @param {Number}z
 * @param {Array} arrayBuffer
 * @param {Number} offset
 * @constructor
 */
export var Vertex3F = function (x, y, z, arrayBuffer, offset) {
    this._arrayBuffer = arrayBuffer || new ArrayBuffer(Vertex3F.BYTES_PER_ELEMENT);
    this._offset = offset || 0;

    var locArrayBuffer = this._arrayBuffer, locOffset = this._offset;
    this._view = new Float32Array(locArrayBuffer, locOffset, 3);
    this._view[0] = x || 0;
    this._view[1] = y || 0;
    this._view[2] = z || 0;
};
/**
 * @constant
 * @type {number}
 */
Vertex3F.BYTES_PER_ELEMENT = 12;

_p = Vertex3F.prototype;
_p._getX = function () {
    return this._view[0];
};
_p._setX = function (xValue) {
    this._view[0] = xValue;
};
_p._getY = function () {
    return this._view[1];
};
_p._setY = function (yValue) {
    this._view[1] = yValue;
};
_p._getZ = function () {
    return this._view[2];
};
_p._setZ = function (zValue) {
    this._view[2] = zValue;
};
/** @expose */
_p.x;
defineGetterSetter(_p, "x", _p._getX, _p._setX);
/** @expose */
_p.y;
defineGetterSetter(_p, "y", _p._getY, _p._setY);
/** @expose */
_p.z;
defineGetterSetter(_p, "z", _p._getZ, _p._setZ);

/**
 * @class Tex2F
 * @param {Number} u
 * @param {Number} v
 * @param {Array} arrayBuffer
 * @param {Number} offset
 * @constructor
 */
export var Tex2F = function (u, v, arrayBuffer, offset) {
    this._arrayBuffer = arrayBuffer || new ArrayBuffer(Tex2F.BYTES_PER_ELEMENT);
    this._offset = offset || 0;

    this._view = new Float32Array(this._arrayBuffer, this._offset, 2);
    this._view[0] = u || 0;
    this._view[1] = v || 0;
};
/**
 * @constants
 * @type {number}
 */
Tex2F.BYTES_PER_ELEMENT = 8;

_p = Tex2F.prototype;
_p._getU = function () {
    return this._view[0];
};
_p._setU = function (xValue) {
    this._view[0] = xValue;
};
_p._getV = function () {
    return this._view[1];
};
_p._setV = function (yValue) {
    this._view[1] = yValue;
};
/** @expose */
_p.u;
defineGetterSetter(_p, "u", _p._getU, _p._setU);
/** @expose */
_p.v;
defineGetterSetter(_p, "v", _p._getV, _p._setV);

/**
 * @class Quad2
 * @param {Vertex2F} tl
 * @param {Vertex2F} tr
 * @param {Vertex2F} bl
 * @param {Vertex2F} br
 * @param {Array} arrayBuffer
 * @param {Number} offset
 * @constructor
 */
export var Quad2 = function (tl, tr, bl, br, arrayBuffer, offset) {
    this._arrayBuffer = arrayBuffer || new ArrayBuffer(Quad2.BYTES_PER_ELEMENT);
    this._offset = offset || 0;

    var locArrayBuffer = this._arrayBuffer, locOffset = this._offset, locElementLen = Vertex2F.BYTES_PER_ELEMENT;
    this._tl = tl ? new Vertex2F(tl.x, tl.y, locArrayBuffer, locOffset) : new Vertex2F(0, 0, locArrayBuffer, locOffset);
    locOffset += locElementLen;
    this._tr = tr ? new Vertex2F(tr.x, tr.y, locArrayBuffer, locOffset) : new Vertex2F(0, 0, locArrayBuffer, locOffset);
    locOffset += locElementLen;
    this._bl = bl ? new Vertex2F(bl.x, bl.y, locArrayBuffer, locOffset) : new Vertex2F(0, 0, locArrayBuffer, locOffset);
    locOffset += locElementLen;
    this._br = br ? new Vertex2F(br.x, br.y, locArrayBuffer, locOffset) : new Vertex2F(0, 0, locArrayBuffer, locOffset);
};
/**
 * @constant
 * @type {number}
 */
Quad2.BYTES_PER_ELEMENT = 32;

_p = Quad2.prototype;
_p._getTL = function () {
    return this._tl;
};
_p._setTL = function (tlValue) {
    this._tl._view[0] = tlValue.x;
    this._tl._view[1] = tlValue.y;
};
_p._getTR = function () {
    return this._tr;
};
_p._setTR = function (trValue) {
    this._tr._view[0] = trValue.x;
    this._tr._view[1] = trValue.y;
};
_p._getBL = function () {
    return this._bl;
};
_p._setBL = function (blValue) {
    this._bl._view[0] = blValue.x;
    this._bl._view[1] = blValue.y;
};
_p._getBR = function () {
    return this._br;
};
_p._setBR = function (brValue) {
    this._br._view[0] = brValue.x;
    this._br._view[1] = brValue.y;
};

/** @expose */
_p.tl;
defineGetterSetter(_p, "tl", _p._getTL, _p._setTL);
/** @expose */
_p.tr;
defineGetterSetter(_p, "tr", _p._getTR, _p._setTR);
/** @expose */
_p.bl;
defineGetterSetter(_p, "bl", _p._getBL, _p._setBL);
/** @expose */
_p.br;
defineGetterSetter(_p, "br", _p._getBR, _p._setBR);

/**
 * A 3D Quad. 4 * 3 floats
 * @Class Quad3
 * @Construct
 * @param {Vertex3F} bl
 * @param {Vertex3F} br
 * @param {Vertex3F} tl
 * @param {Vertex3F} tr
 */
export var Quad3 = function (bl, br, tl, tr, arrayBuffer, offset) {
    this._arrayBuffer = arrayBuffer || new ArrayBuffer(Quad3.BYTES_PER_ELEMENT);
    this._offset = offset || 0;
    
    var locArrayBuffer = this._arrayBuffer, locOffset = this._offset, locElementLen = Vertex3F.BYTES_PER_ELEMENT;
    this.bl = bl ? new Vertex3F(bl.x, bl.y, bl.z, locArrayBuffer, locOffset) : new Vertex3F(0, 0, 0, locArrayBuffer, locOffset);
    locOffset += locElementLen;
    this.br = br ? new Vertex3F(br.x, br.y, br.z, locArrayBuffer, locOffset) : new Vertex3F(0, 0, 0, locArrayBuffer, locOffset);
    locOffset += locElementLen;
    this.tl = tl ? new Vertex3F(tl.x, tl.y, tl.z, locArrayBuffer, locOffset) : new Vertex3F(0, 0, 0, locArrayBuffer, locOffset);
    locOffset += locElementLen;
    this.tr = tr ? new Vertex3F(tr.x, tr.y, tr.z, locArrayBuffer, locOffset) : new Vertex3F(0, 0, 0, locArrayBuffer, locOffset);
};
/**
 * @constant
 * @type {number}
 */
Quad3.BYTES_PER_ELEMENT = 48;

/**
 * @class V3F_C4B_T2F
 * @param {Vertex3F} vertices
 * @param {Color} colors
 * @param {Tex2F} texCoords
 * @param {Array} arrayBuffer
 * @param {Number} offset
 * @constructor
 */
export var V3F_C4B_T2F = function (vertices, colors, texCoords, arrayBuffer, offset) {
    this._arrayBuffer = arrayBuffer || new ArrayBuffer(V3F_C4B_T2F.BYTES_PER_ELEMENT);
    this._offset = offset || 0;

    var locArrayBuffer = this._arrayBuffer, locOffset = this._offset;
    this._vertices = vertices ? new Vertex3F(vertices.x, vertices.y, vertices.z, locArrayBuffer, locOffset) :
        new Vertex3F(0, 0, 0, locArrayBuffer, locOffset);

    locOffset += Vertex3F.BYTES_PER_ELEMENT;
    this._colors = colors ? new cc._WebGLColor(colors.r, colors.g, colors.b, colors.a, locArrayBuffer, locOffset) :
        new cc._WebGLColor(0, 0, 0, 0, locArrayBuffer, locOffset);

    locOffset += cc._WebGLColor.BYTES_PER_ELEMENT;
    this._texCoords = texCoords ? new Tex2F(texCoords.u, texCoords.v, locArrayBuffer, locOffset) :
        new Tex2F(0, 0, locArrayBuffer, locOffset);
};
/**
 * @constant
 * @type {number}
 */
V3F_C4B_T2F.BYTES_PER_ELEMENT = 24;

_p = V3F_C4B_T2F.prototype;
_p._getVertices = function () {
    return this._vertices;
};
_p._setVertices = function (verticesValue) {
    var locVertices = this._vertices;
    locVertices._view[0] = verticesValue.x;
    locVertices._view[1] = verticesValue.y;
    locVertices._view[2] = verticesValue.z;
};
_p._getColor = function () {
    return this._colors;
};
_p._setColor = function (colorValue) {
    var locColors = this._colors;
    locColors._view[0] = colorValue.r;
    locColors._view[1] = colorValue.g;
    locColors._view[2] = colorValue.b;
    locColors._view[3] = colorValue.a;
};
_p._getTexCoords = function () {
    return this._texCoords;
};
_p._setTexCoords = function (texValue) {
    this._texCoords._view[0] = texValue.u;
    this._texCoords._view[1] = texValue.v;
};
/** @expose */
_p.vertices;
defineGetterSetter(_p, "vertices", _p._getVertices, _p._setVertices);
/** @expose */
_p.colors;
defineGetterSetter(_p, "colors", _p._getColor, _p._setColor);
/** @expose */
_p.texCoords;
defineGetterSetter(_p, "texCoords", _p._getTexCoords, _p._setTexCoords);

/**
 * @class V3F_C4B_T2F_Quad
 * @param {V3F_C4B_T2F} tl
 * @param {V3F_C4B_T2F} bl
 * @param {V3F_C4B_T2F} tr
 * @param {V3F_C4B_T2F} br
 * @param {Array} arrayBuffer
 * @param {Number} offset
 * @constructor
 */
export var V3F_C4B_T2F_Quad = function (tl, bl, tr, br, arrayBuffer, offset) {
    this._arrayBuffer = arrayBuffer || new ArrayBuffer(V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT);
    this._offset = offset || 0;

    var locArrayBuffer = this._arrayBuffer, locOffset = this._offset, locElementLen = V3F_C4B_T2F.BYTES_PER_ELEMENT;
    this._tl = tl ? new V3F_C4B_T2F(tl.vertices, tl.colors, tl.texCoords, locArrayBuffer, locOffset) :
        new V3F_C4B_T2F(null, null, null, locArrayBuffer, locOffset);
    locOffset += locElementLen;
    this._bl = bl ? new V3F_C4B_T2F(bl.vertices, bl.colors, bl.texCoords, locArrayBuffer, locOffset) :
        new V3F_C4B_T2F(null, null, null, locArrayBuffer, locOffset);
    locOffset += locElementLen;
    this._tr = tr ? new V3F_C4B_T2F(tr.vertices, tr.colors, tr.texCoords, locArrayBuffer, locOffset) :
        new V3F_C4B_T2F(null, null, null, locArrayBuffer, locOffset);
    locOffset += locElementLen;
    this._br = br ? new V3F_C4B_T2F(br.vertices, br.colors, br.texCoords, locArrayBuffer, locOffset) :
        new V3F_C4B_T2F(null, null, null, locArrayBuffer, locOffset);
};
/**
 * @constant
 * @type {number}
 */
V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT = 96;
_p = V3F_C4B_T2F_Quad.prototype;
_p._getTL = function () {
    return this._tl;
};
_p._setTL = function (tlValue) {
    var locTl = this._tl;
    locTl.vertices = tlValue.vertices;
    locTl.colors = tlValue.colors;
    locTl.texCoords = tlValue.texCoords;
};
_p._getBL = function () {
    return this._bl;
};
_p._setBL = function (blValue) {
    var locBl = this._bl;
    locBl.vertices = blValue.vertices;
    locBl.colors = blValue.colors;
    locBl.texCoords = blValue.texCoords;
};
_p._getTR = function () {
    return this._tr;
};
_p._setTR = function (trValue) {
    var locTr = this._tr;
    locTr.vertices = trValue.vertices;
    locTr.colors = trValue.colors;
    locTr.texCoords = trValue.texCoords;
};
_p._getBR = function () {
    return this._br;
};
_p._setBR = function (brValue) {
    var locBr = this._br;
    locBr.vertices = brValue.vertices;
    locBr.colors = brValue.colors;
    locBr.texCoords = brValue.texCoords;
};
_p._getArrayBuffer = function () {
    return this._arrayBuffer;
};

/** @expose */
_p.tl;
defineGetterSetter(_p, "tl", _p._getTL, _p._setTL);
/** @expose */
_p.tr;
defineGetterSetter(_p, "tr", _p._getTR, _p._setTR);
/** @expose */
_p.bl;
defineGetterSetter(_p, "bl", _p._getBL, _p._setBL);
/** @expose */
_p.br;
defineGetterSetter(_p, "br", _p._getBR, _p._setBR);
/** @expose */
_p.arrayBuffer;
defineGetterSetter(_p, "arrayBuffer", _p._getArrayBuffer, null);

/**
 * @function
 * @returns {V3F_C4B_T2F_Quad}
 */
export function V3F_C4B_T2F_QuadZero() {
    return new V3F_C4B_T2F_Quad();
}

/**
 * @function
 * @param {V3F_C4B_T2F_Quad} sourceQuad
 * @return {V3F_C4B_T2F_Quad}
 */
export function V3F_C4B_T2F_QuadCopy(sourceQuad) {
    if (!sourceQuad)
        return V3F_C4B_T2F_QuadZero();

    var srcTL = sourceQuad.tl, srcBL = sourceQuad.bl, srcTR = sourceQuad.tr, srcBR = sourceQuad.br;
    return {
        tl: {
            vertices: {x: srcTL.vertices.x, y: srcTL.vertices.y, z: srcTL.vertices.z},
            colors: {r: srcTL.colors.r, g: srcTL.colors.g, b: srcTL.colors.b, a: srcTL.colors.a},
            texCoords: {u: srcTL.texCoords.u, v: srcTL.texCoords.v}
        },
        bl: {
            vertices: {x: srcBL.vertices.x, y: srcBL.vertices.y, z: srcBL.vertices.z},
            colors: {r: srcBL.colors.r, g: srcBL.colors.g, b: srcBL.colors.b, a: srcBL.colors.a},
            texCoords: {u: srcBL.texCoords.u, v: srcBL.texCoords.v}
        },
        tr: {
            vertices: {x: srcTR.vertices.x, y: srcTR.vertices.y, z: srcTR.vertices.z},
            colors: {r: srcTR.colors.r, g: srcTR.colors.g, b: srcTR.colors.b, a: srcTR.colors.a},
            texCoords: {u: srcTR.texCoords.u, v: srcTR.texCoords.v}
        },
        br: {
            vertices: {x: srcBR.vertices.x, y: srcBR.vertices.y, z: srcBR.vertices.z},
            colors: {r: srcBR.colors.r, g: srcBR.colors.g, b: srcBR.colors.b, a: srcBR.colors.a},
            texCoords: {u: srcBR.texCoords.u, v: srcBR.texCoords.v}
        }
    };
}

/**
 * @function
 * @param {Array} sourceQuads
 * @returns {Array}
 */
export function V3F_C4B_T2F_QuadsCopy(sourceQuads) {
    if (!sourceQuads)
        return [];

    var retArr = [];
    for (var i = 0; i < sourceQuads.length; i++) {
        retArr.push(V3F_C4B_T2F_QuadCopy(sourceQuads[i]));
    }
    return retArr;
}

//redefine V2F_C4B_T2F
/**
 * @class V2F_C4B_T2F
 * @param {Vertex2F} vertices
 * @param {Color} colors
 * @param {Tex2F} texCoords
 * @param {Array} arrayBuffer
 * @param {Number} offset
 * @constructor
 */
export var V2F_C4B_T2F = function (vertices, colors, texCoords, arrayBuffer, offset) {
    this._arrayBuffer = arrayBuffer || new ArrayBuffer(V2F_C4B_T2F.BYTES_PER_ELEMENT);
    this._offset = offset || 0;

    var locArrayBuffer = this._arrayBuffer, locOffset = this._offset;
    this._vertices = vertices ? new Vertex2F(vertices.x, vertices.y, locArrayBuffer, locOffset) :
        new Vertex2F(0, 0, locArrayBuffer, locOffset);
    locOffset += Vertex2F.BYTES_PER_ELEMENT;
    this._colors = colors ? new cc._WebGLColor(colors.r, colors.g, colors.b, colors.a, locArrayBuffer, locOffset) :
        new cc._WebGLColor(0, 0, 0, 0, locArrayBuffer, locOffset);
    locOffset += cc._WebGLColor.BYTES_PER_ELEMENT;
    this._texCoords = texCoords ? new Tex2F(texCoords.u, texCoords.v, locArrayBuffer, locOffset) :
        new Tex2F(0, 0, locArrayBuffer, locOffset);
};

/**
 * @constant
 * @type {number}
 */
V2F_C4B_T2F.BYTES_PER_ELEMENT = 20;
_p = V2F_C4B_T2F.prototype;
_p._getVertices = function () {
    return this._vertices;
};
_p._setVertices = function (verticesValue) {
    this._vertices._view[0] = verticesValue.x;
    this._vertices._view[1] = verticesValue.y;
};
_p._getColor = function () {
    return this._colors;
};
_p._setColor = function (colorValue) {
    var locColors = this._colors;
    locColors._view[0] = colorValue.r;
    locColors._view[1] = colorValue.g;
    locColors._view[2] = colorValue.b;
    locColors._view[3] = colorValue.a;
};
_p._getTexCoords = function () {
    return this._texCoords;
};
_p._setTexCoords = function (texValue) {
    this._texCoords._view[0] = texValue.u;
    this._texCoords._view[1] = texValue.v;
};

/** @expose */
_p.vertices;
defineGetterSetter(_p, "vertices", _p._getVertices, _p._setVertices);
/** @expose */
_p.colors;
defineGetterSetter(_p, "colors", _p._getColor, _p._setColor);
/** @expose */
_p.texCoords;
defineGetterSetter(_p, "texCoords", _p._getTexCoords, _p._setTexCoords);

//redefine V2F_C4B_T2F_Triangle
/**
 * @class V2F_C4B_T2F_Triangle
 * @param {V2F_C4B_T2F} a
 * @param {V2F_C4B_T2F} b
 * @param {V2F_C4B_T2F} c
 * @param {Array} arrayBuffer
 * @param {Number} offset
 * @constructor
 */
export var V2F_C4B_T2F_Triangle = function (a, b, c, arrayBuffer, offset) {
    this._arrayBuffer = arrayBuffer || new ArrayBuffer(V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT);
    this._offset = offset || 0;

    var locArrayBuffer = this._arrayBuffer, locOffset = this._offset, locElementLen = V2F_C4B_T2F.BYTES_PER_ELEMENT;
    this._a = a ? new V2F_C4B_T2F(a.vertices, a.colors, a.texCoords, locArrayBuffer, locOffset) :
        new V2F_C4B_T2F(null, null, null, locArrayBuffer, locOffset);
    locOffset += locElementLen;
    this._b = b ? new V2F_C4B_T2F(b.vertices, b.colors, b.texCoords, locArrayBuffer, locOffset) :
        new V2F_C4B_T2F(null, null, null, locArrayBuffer, locOffset);
    locOffset += locElementLen;
    this._c = c ? new V2F_C4B_T2F(c.vertices, c.colors, c.texCoords, locArrayBuffer, locOffset) :
        new V2F_C4B_T2F(null, null, null, locArrayBuffer, locOffset);
};
/**
 * @constant
 * @type {number}
 */
V2F_C4B_T2F_Triangle.BYTES_PER_ELEMENT = 60;
_p = V2F_C4B_T2F_Triangle.prototype;
_p._getA = function () {
    return this._a;
};
_p._setA = function (aValue) {
    var locA = this._a;
    locA.vertices = aValue.vertices;
    locA.colors = aValue.colors;
    locA.texCoords = aValue.texCoords;
};
_p._getB = function () {
    return this._b;
};
_p._setB = function (bValue) {
    var locB = this._b;
    locB.vertices = bValue.vertices;
    locB.colors = bValue.colors;
    locB.texCoords = bValue.texCoords;
};
_p._getC = function () {
    return this._c;
};
_p._setC = function (cValue) {
    var locC = this._c;
    locC.vertices = cValue.vertices;
    locC.colors = cValue.colors;
    locC.texCoords = cValue.texCoords;
};

/** @expose */
_p.a;
defineGetterSetter(_p, "a", _p._getA, _p._setA);
/** @expose */
_p.b;
defineGetterSetter(_p, "b", _p._getB, _p._setB);
/** @expose */
_p.c;
defineGetterSetter(_p, "c", _p._getC, _p._setC);

/**
 * Helper macro that creates an Vertex2F type composed of 2 floats: x, y
 * @function
 * @param {Number} x
 * @param {Number} y
 * @return {Vertex2F}
 */
export function vertex2(x, y) {
    return new Vertex2F(x, y);
}

/**
 * Helper macro that creates an Vertex3F type composed of 3 floats: x, y, z
 * @function
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @return {Vertex3F}
 */
export function vertex3(x, y, z) {
    return new Vertex3F(x, y, z);
}

/**
 * Helper macro that creates an Tex2F type: A texcoord composed of 2 floats: u, y
 * @function
 * @param {Number} u
 * @param {Number} v
 * @return {Tex2F}
 */
export function tex2(u, v) {
    return new Tex2F(u, v);
}
