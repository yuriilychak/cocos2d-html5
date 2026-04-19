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
 * @class Vertex2F
 * @param {Number} x
 * @param {Number}y
 * @param {Array} arrayBuffer
 * @param {Number}offset
 */
export class Vertex2F {
    static BYTES_PER_ELEMENT = 8;

    constructor(x, y, arrayBuffer, offset) {
        this._arrayBuffer = arrayBuffer || new ArrayBuffer(Vertex2F.BYTES_PER_ELEMENT);
        this._offset = offset || 0;

        this._view = new Float32Array(this._arrayBuffer, this._offset, 2);
        this._view[0] = x || 0;
        this._view[1] = y || 0;
    }

    get x() {
        return this._view[0];
    }

    set x(xValue) {
        this._view[0] = xValue;
    }

    get y() {
        return this._view[1];
    }

    set y(yValue) {
        this._view[1] = yValue;
    }
}

/**
 * @class Vertex3F
 * @param {Number} x
 * @param {Number} y
 * @param {Number}z
 * @param {Array} arrayBuffer
 * @param {Number} offset
 */
export class Vertex3F {
    static BYTES_PER_ELEMENT = 12;

    constructor(x, y, z, arrayBuffer, offset) {
        this._arrayBuffer = arrayBuffer || new ArrayBuffer(Vertex3F.BYTES_PER_ELEMENT);
        this._offset = offset || 0;

        var locArrayBuffer = this._arrayBuffer, locOffset = this._offset;
        this._view = new Float32Array(locArrayBuffer, locOffset, 3);
        this._view[0] = x || 0;
        this._view[1] = y || 0;
        this._view[2] = z || 0;
    }

    get x() {
        return this._view[0];
    }

    set x(xValue) {
        this._view[0] = xValue;
    }

    get y() {
        return this._view[1];
    }

    set y(yValue) {
        this._view[1] = yValue;
    }

    get z() {
        return this._view[2];
    }

    set z(zValue) {
        this._view[2] = zValue;
    }
}

/**
 * @class Tex2F
 * @param {Number} u
 * @param {Number} v
 * @param {Array} arrayBuffer
 * @param {Number} offset
 */
export class Tex2F {
    static BYTES_PER_ELEMENT = 8;

    constructor(u, v, arrayBuffer, offset) {
        this._arrayBuffer = arrayBuffer || new ArrayBuffer(Tex2F.BYTES_PER_ELEMENT);
        this._offset = offset || 0;

        this._view = new Float32Array(this._arrayBuffer, this._offset, 2);
        this._view[0] = u || 0;
        this._view[1] = v || 0;
    }

    get u() {
        return this._view[0];
    }

    set u(uValue) {
        this._view[0] = uValue;
    }

    get v() {
        return this._view[1];
    }

    set v(vValue) {
        this._view[1] = vValue;
    }
}

/**
 * @class Quad2
 * @param {Vertex2F} tl
 * @param {Vertex2F} tr
 * @param {Vertex2F} bl
 * @param {Vertex2F} br
 * @param {Array} arrayBuffer
 * @param {Number} offset
 */
export class Quad2 {
    static BYTES_PER_ELEMENT = 32;

    constructor(tl, tr, bl, br, arrayBuffer, offset) {
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
    }

    get tl() {
        return this._tl;
    }

    set tl(tlValue) {
        this._tl._view[0] = tlValue.x;
        this._tl._view[1] = tlValue.y;
    }

    get tr() {
        return this._tr;
    }

    set tr(trValue) {
        this._tr._view[0] = trValue.x;
        this._tr._view[1] = trValue.y;
    }

    get bl() {
        return this._bl;
    }

    set bl(blValue) {
        this._bl._view[0] = blValue.x;
        this._bl._view[1] = blValue.y;
    }

    get br() {
        return this._br;
    }

    set br(brValue) {
        this._br._view[0] = brValue.x;
        this._br._view[1] = brValue.y;
    }
}

/**
 * A 3D Quad. 4 * 3 floats
 * @Class Quad3
 * @Construct
 * @param {Vertex3F} bl
 * @param {Vertex3F} br
 * @param {Vertex3F} tl
 * @param {Vertex3F} tr
 */
export class Quad3 {
    static BYTES_PER_ELEMENT = 48;

    constructor(bl, br, tl, tr, arrayBuffer, offset) {
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
    }
}

/**
 * @class V3F_C4B_T2F
 * @param {Vertex3F} vertices
 * @param {Color} colors
 * @param {Tex2F} texCoords
 * @param {Array} arrayBuffer
 * @param {Number} offset
 */
export class V3F_C4B_T2F {
    static BYTES_PER_ELEMENT = 24;

    constructor(vertices, colors, texCoords, arrayBuffer, offset) {
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
    }

    get vertices() {
        return this._vertices;
    }

    set vertices(verticesValue) {
        var locVertices = this._vertices;
        locVertices._view[0] = verticesValue.x;
        locVertices._view[1] = verticesValue.y;
        locVertices._view[2] = verticesValue.z;
    }

    get colors() {
        return this._colors;
    }

    set colors(colorValue) {
        var locColors = this._colors;
        locColors._view[0] = colorValue.r;
        locColors._view[1] = colorValue.g;
        locColors._view[2] = colorValue.b;
        locColors._view[3] = colorValue.a;
    }

    get texCoords() {
        return this._texCoords;
    }

    set texCoords(texValue) {
        this._texCoords._view[0] = texValue.u;
        this._texCoords._view[1] = texValue.v;
    }
}

/**
 * @class V3F_C4B_T2F_Quad
 * @param {V3F_C4B_T2F} tl
 * @param {V3F_C4B_T2F} bl
 * @param {V3F_C4B_T2F} tr
 * @param {V3F_C4B_T2F} br
 * @param {Array} arrayBuffer
 * @param {Number} offset
 */
export class V3F_C4B_T2F_Quad {
    static BYTES_PER_ELEMENT = 96;

    constructor(tl, bl, tr, br, arrayBuffer, offset) {
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
    }

    get tl() {
        return this._tl;
    }

    set tl(tlValue) {
        var locTl = this._tl;
        locTl.vertices = tlValue.vertices;
        locTl.colors = tlValue.colors;
        locTl.texCoords = tlValue.texCoords;
    }

    get bl() {
        return this._bl;
    }

    set bl(blValue) {
        var locBl = this._bl;
        locBl.vertices = blValue.vertices;
        locBl.colors = blValue.colors;
        locBl.texCoords = blValue.texCoords;
    }

    get tr() {
        return this._tr;
    }

    set tr(trValue) {
        var locTr = this._tr;
        locTr.vertices = trValue.vertices;
        locTr.colors = trValue.colors;
        locTr.texCoords = trValue.texCoords;
    }

    get br() {
        return this._br;
    }

    set br(brValue) {
        var locBr = this._br;
        locBr.vertices = brValue.vertices;
        locBr.colors = brValue.colors;
        locBr.texCoords = brValue.texCoords;
    }

    get arrayBuffer() {
        return this._arrayBuffer;
    }
}

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

/**
 * @class V2F_C4B_T2F
 * @param {Vertex2F} vertices
 * @param {Color} colors
 * @param {Tex2F} texCoords
 * @param {Array} arrayBuffer
 * @param {Number} offset
 */
export class V2F_C4B_T2F {
    static BYTES_PER_ELEMENT = 20;

    constructor(vertices, colors, texCoords, arrayBuffer, offset) {
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
    }

    get vertices() {
        return this._vertices;
    }

    set vertices(verticesValue) {
        this._vertices._view[0] = verticesValue.x;
        this._vertices._view[1] = verticesValue.y;
    }

    get colors() {
        return this._colors;
    }

    set colors(colorValue) {
        var locColors = this._colors;
        locColors._view[0] = colorValue.r;
        locColors._view[1] = colorValue.g;
        locColors._view[2] = colorValue.b;
        locColors._view[3] = colorValue.a;
    }

    get texCoords() {
        return this._texCoords;
    }

    set texCoords(texValue) {
        this._texCoords._view[0] = texValue.u;
        this._texCoords._view[1] = texValue.v;
    }
}

/**
 * @class V2F_C4B_T2F_Triangle
 * @param {V2F_C4B_T2F} a
 * @param {V2F_C4B_T2F} b
 * @param {V2F_C4B_T2F} c
 * @param {Array} arrayBuffer
 * @param {Number} offset
 */
export class V2F_C4B_T2F_Triangle {
    static BYTES_PER_ELEMENT = 60;

    constructor(a, b, c, arrayBuffer, offset) {
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
    }

    get a() {
        return this._a;
    }

    set a(aValue) {
        var locA = this._a;
        locA.vertices = aValue.vertices;
        locA.colors = aValue.colors;
        locA.texCoords = aValue.texCoords;
    }

    get b() {
        return this._b;
    }

    set b(bValue) {
        var locB = this._b;
        locB.vertices = bValue.vertices;
        locB.colors = bValue.colors;
        locB.texCoords = bValue.texCoords;
    }

    get c() {
        return this._c;
    }

    set c(cValue) {
        var locC = this._c;
        locC.vertices = cValue.vertices;
        locC.colors = cValue.colors;
        locC.texCoords = cValue.texCoords;
    }
}

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
