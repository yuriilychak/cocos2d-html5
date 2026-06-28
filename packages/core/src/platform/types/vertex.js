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

import { BYTE } from "../../constants";

class BufferBackedType {
  #arrayBuffer;
  #offset;

  constructor(
    arrayBuffer = new ArrayBuffer(new.target.BYTES_PER_ELEMENT),
    offset = 0
  ) {
    this.#arrayBuffer =
      arrayBuffer ?? new ArrayBuffer(new.target.BYTES_PER_ELEMENT);
    this.#offset = offset ?? 0;
  }

  get _arrayBuffer() {
    return this.#arrayBuffer;
  }

  get _offset() {
    return this.#offset;
  }

  static fromBufferOrEmpty(value, arrayBuffer, offset) {
    return value
      ? value.fromBuffer(arrayBuffer, offset)
      : this.emptyFromBuffer(arrayBuffer, offset);
  }
}

class WebGLColor extends BufferBackedType {
  static BYTES_PER_ELEMENT = 4;
  #view;

  constructor(
    r = 0,
    g = 0,
    b = 0,
    a = undefined,
    arrayBuffer,
    offset
  ) {
    super(arrayBuffer, offset);
    this.#view = new Uint8Array(this._arrayBuffer, this._offset, 4);
    this.set(r, g, b, a);

    if (a === undefined) this.a_undefined = true;
  }

  set(r = 0, g = 0, b = 0, a = undefined) {
    this.#view[0] = r;
    this.#view[1] = g;
    this.#view[2] = b;
    this.#view[3] = a == null ? BYTE : a;
  }

  get r() {
    return this.#view[0];
  }
  set r(value) {
    this.#view[0] = Math.max(value, 0);
  }

  get g() {
    return this.#view[1];
  }
  set g(value) {
    this.#view[1] = Math.max(value, 0);
  }

  get b() {
    return this.#view[2];
  }
  set b(value) {
    this.#view[2] = Math.max(value, 0);
  }

  get a() {
    return this.#view[3];
  }
  set a(value) {
    this.#view[3] = Math.max(value, 0);
  }

  clone() {
    return new WebGLColor(this.r, this.g, this.b, this.a);
  }

  fromBuffer(arrayBuffer, offset) {
    return new WebGLColor(this.r, this.g, this.b, this.a, arrayBuffer, offset);
  }

  static emptyFromBuffer(arrayBuffer, offset) {
    return new WebGLColor(0, 0, 0, 0, arrayBuffer, offset);
  }
}

/**
 * @param {Number} x
 * @param {Number}y
 * @param {Array} arrayBuffer
 * @param {Number}offset
 */
export class Vertex2F extends BufferBackedType {
  static BYTES_PER_ELEMENT = 8;
  #view;

  constructor(x = 0, y = 0, arrayBuffer, offset) {
    super(arrayBuffer, offset);

    this.#view = new Float32Array(this._arrayBuffer, this._offset, 2);
    this.set(x, y);
  }

  set(x = 0, y = 0) {
    this.#view[0] = x;
    this.#view[1] = y;
  }

  get x() {
    return this.#view[0];
  }

  set x(xValue) {
    this.#view[0] = xValue;
  }

  get y() {
    return this.#view[1];
  }

  set y(yValue) {
    this.#view[1] = yValue;
  }

  clone() {
    return new Vertex2F(this.x, this.y);
  }

  fromBuffer(arrayBuffer, offset) {
    return new Vertex2F(this.x, this.y, arrayBuffer, offset);
  }

  static emptyFromBuffer(arrayBuffer, offset) {
    return new Vertex2F(0, 0, arrayBuffer, offset);
  }
}

/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number}z
 * @param {Array} arrayBuffer
 * @param {Number} offset
 */
export class Vertex3F extends BufferBackedType {
  static BYTES_PER_ELEMENT = 12;
  #view;

  constructor(x = 0, y = 0, z = 0, arrayBuffer, offset) {
    super(arrayBuffer, offset);

    const locArrayBuffer = this._arrayBuffer;
    const locOffset = this._offset;
    this.#view = new Float32Array(locArrayBuffer, locOffset, 3);
    this.set(x, y, z);
  }

  set(x = 0, y = 0, z = 0) {
    this.#view[0] = x;
    this.#view[1] = y;
    this.#view[2] = z;
  }

  get x() {
    return this.#view[0];
  }

  set x(xValue) {
    this.#view[0] = xValue;
  }

  get y() {
    return this.#view[1];
  }

  set y(yValue) {
    this.#view[1] = yValue;
  }

  get z() {
    return this.#view[2];
  }

  set z(zValue) {
    this.#view[2] = zValue;
  }

  clone() {
    return new Vertex3F(this.x, this.y, this.z);
  }

  fromBuffer(arrayBuffer, offset) {
    return new Vertex3F(this.x, this.y, this.z, arrayBuffer, offset);
  }

  static emptyFromBuffer(arrayBuffer, offset) {
    return new Vertex3F(0, 0, 0, arrayBuffer, offset);
  }
}

/**
 * @param {Number} u
 * @param {Number} v
 * @param {Array} arrayBuffer
 * @param {Number} offset
 */
export class Tex2F extends BufferBackedType {
  static BYTES_PER_ELEMENT = 8;
  #view;

  constructor(u = 0, v = 0, arrayBuffer, offset) {
    super(arrayBuffer, offset);

    this.#view = new Float32Array(this._arrayBuffer, this._offset, 2);
    this.set(u, v);
  }

  set(u = 0, v = 0) {
    this.#view[0] = u;
    this.#view[1] = v;
  }

  get u() {
    return this.#view[0];
  }

  set u(uValue) {
    this.#view[0] = uValue;
  }

  get v() {
    return this.#view[1];
  }

  set v(vValue) {
    this.#view[1] = vValue;
  }

  clone() {
    return new Tex2F(this.u, this.v);
  }

  fromBuffer(arrayBuffer, offset) {
    return new Tex2F(this.u, this.v, arrayBuffer, offset);
  }

  static emptyFromBuffer(arrayBuffer, offset) {
    return new Tex2F(0, 0, arrayBuffer, offset);
  }
}

/**
 * @param {Vertex2F} tl
 * @param {Vertex2F} tr
 * @param {Vertex2F} bl
 * @param {Vertex2F} br
 * @param {Array} arrayBuffer
 * @param {Number} offset
 */
export class Quad2 extends BufferBackedType {
    static BYTES_PER_ELEMENT = 32;
    #tl;
    #tr;
    #bl;
    #br;

    constructor(tl = null, tr = null, bl = null, br = null, arrayBuffer, offset) {
        super(arrayBuffer, offset);

        const locArrayBuffer = this._arrayBuffer;
        let locOffset = this._offset;
        const locElementLen = Vertex2F.BYTES_PER_ELEMENT;
        this.#tl = Vertex2F.fromBufferOrEmpty(tl, locArrayBuffer, locOffset);
        locOffset += locElementLen;
        this.#tr = Vertex2F.fromBufferOrEmpty(tr, locArrayBuffer, locOffset);
        locOffset += locElementLen;
        this.#bl = Vertex2F.fromBufferOrEmpty(bl, locArrayBuffer, locOffset);
        locOffset += locElementLen;
        this.#br = Vertex2F.fromBufferOrEmpty(br, locArrayBuffer, locOffset);
    }

    get tl() {
        return this.#tl;
    }

    set tl(tlValue) {
        this.#tl.set(tlValue.x, tlValue.y);
    }

    get tr() {
        return this.#tr;
    }

    set tr(trValue) {
        this.#tr.set(trValue.x, trValue.y);
    }

    get bl() {
        return this.#bl;
    }

    set bl(blValue) {
        this.#bl.set(blValue.x, blValue.y);
    }

    get br() {
        return this.#br;
    }

    set br(brValue) {
        this.#br.set(brValue.x, brValue.y);
    }

    set(tlValue, trValue, blValue, brValue) {
        this.tl = tlValue;
        this.tr = trValue;
        this.bl = blValue;
        this.br = brValue;
    }

    clone() {
        return new Quad2(this.tl, this.tr, this.bl, this.br);
    }

    fromBuffer(arrayBuffer, offset) {
        return new Quad2(this.tl, this.tr, this.bl, this.br, arrayBuffer, offset);
    }

    static emptyFromBuffer(arrayBuffer, offset) {
        return new Quad2(null, null, null, null, arrayBuffer, offset);
    }
}

/**
 * A 3D Quad. 4 * 3 floats
 * @Construct
 * @param {Vertex3F} bl
 * @param {Vertex3F} br
 * @param {Vertex3F} tl
 * @param {Vertex3F} tr
 */
export class Quad3 extends BufferBackedType {
  static BYTES_PER_ELEMENT = 48;
  #bl;
  #br;
  #tl;
  #tr;

  constructor(bl = null, br = null, tl = null, tr = null, arrayBuffer, offset) {
    super(arrayBuffer, offset);

    const locArrayBuffer = this._arrayBuffer;
    let locOffset = this._offset;
    const locElementLen = Vertex3F.BYTES_PER_ELEMENT;
    this.#bl = Vertex3F.fromBufferOrEmpty(bl, locArrayBuffer, locOffset);
    locOffset += locElementLen;
    this.#br = Vertex3F.fromBufferOrEmpty(br, locArrayBuffer, locOffset);
    locOffset += locElementLen;
    this.#tl = Vertex3F.fromBufferOrEmpty(tl, locArrayBuffer, locOffset);
    locOffset += locElementLen;
    this.#tr = Vertex3F.fromBufferOrEmpty(tr, locArrayBuffer, locOffset);
  }

  get bl() {
    return this.#bl;
  }

  set bl(blValue) {
    this.#bl.set(blValue.x, blValue.y, blValue.z);
  }

  get br() {
    return this.#br;
  }

  set br(brValue) {
    this.#br.set(brValue.x, brValue.y, brValue.z);
  }

  get tl() {
    return this.#tl;
  }

  set tl(tlValue) {
    this.#tl.set(tlValue.x, tlValue.y, tlValue.z);
  }

  get tr() {
    return this.#tr;
  }

  set tr(trValue) {
    this.#tr.set(trValue.x, trValue.y, trValue.z);
  }

  set(blValue, brValue, tlValue, trValue) {
    this.bl = blValue;
    this.br = brValue;
    this.tl = tlValue;
    this.tr = trValue;
  }

  clone() {
    return new Quad3(this.bl, this.br, this.tl, this.tr);
  }

  fromBuffer(arrayBuffer, offset) {
    return new Quad3(this.bl, this.br, this.tl, this.tr, arrayBuffer, offset);
  }

  static emptyFromBuffer(arrayBuffer, offset) {
    return new Quad3(null, null, null, null, arrayBuffer, offset);
  }
}

/**
 * @param {Vertex3F} vertices
 * @param {Color} colors
 * @param {Tex2F} texCoords
 * @param {Array} arrayBuffer
 * @param {Number} offset
 */
export class V3F_C4B_T2F extends BufferBackedType {
  static BYTES_PER_ELEMENT = 24;
  #vertices;
  #colors;
  #texCoords;

  constructor(
    vertices = null,
    colors = null,
    texCoords = null,
    arrayBuffer,
    offset
  ) {
    super(arrayBuffer, offset);

    const locArrayBuffer = this._arrayBuffer;
    let locOffset = this._offset;
    this.#vertices = Vertex3F.fromBufferOrEmpty(
      vertices,
      locArrayBuffer,
      locOffset
    );

    locOffset += Vertex3F.BYTES_PER_ELEMENT;
    this.#colors = WebGLColor.fromBufferOrEmpty(
      colors,
      locArrayBuffer,
      locOffset
    );

    locOffset += WebGLColor.BYTES_PER_ELEMENT;
    this.#texCoords = Tex2F.fromBufferOrEmpty(
      texCoords,
      locArrayBuffer,
      locOffset
    );
  }

  get vertices() {
    return this.#vertices;
  }

  set vertices(verticesValue) {
    this.#vertices.set(verticesValue.x, verticesValue.y, verticesValue.z);
  }

  get colors() {
    return this.#colors;
  }

  set colors(colorValue) {
    this.#colors.set(colorValue.r, colorValue.g, colorValue.b, colorValue.a);
  }

  get texCoords() {
    return this.#texCoords;
  }

  set texCoords(texValue) {
    this.#texCoords.set(texValue.u, texValue.v);
  }

  set(verticesValue, colorValue, texValue) {
    this.vertices = verticesValue;
    this.colors = colorValue;
    this.texCoords = texValue;
  }

  clone() {
    return new V3F_C4B_T2F(this.vertices, this.colors, this.texCoords);
  }

  fromBuffer(arrayBuffer, offset) {
    return new V3F_C4B_T2F(
      this.vertices,
      this.colors,
      this.texCoords,
      arrayBuffer,
      offset
    );
  }

  static emptyFromBuffer(arrayBuffer, offset) {
    return new V3F_C4B_T2F(null, null, null, arrayBuffer, offset);
  }
}

/**
 * @param {V3F_C4B_T2F} tl
 * @param {V3F_C4B_T2F} bl
 * @param {V3F_C4B_T2F} tr
 * @param {V3F_C4B_T2F} br
 * @param {Array} arrayBuffer
 * @param {Number} offset
 */
export class V3F_C4B_T2F_Quad extends BufferBackedType {
  static BYTES_PER_ELEMENT = 96;
  #tl;
  #bl;
  #tr;
  #br;

  constructor(tl = null, bl = null, tr = null, br = null, arrayBuffer, offset) {
    super(arrayBuffer, offset);

    const locArrayBuffer = this._arrayBuffer;
    let locOffset = this._offset;
    const locElementLen = V3F_C4B_T2F.BYTES_PER_ELEMENT;
    this.#tl = V3F_C4B_T2F.fromBufferOrEmpty(
      tl,
      locArrayBuffer,
      locOffset
    );
    locOffset += locElementLen;
    this.#bl = V3F_C4B_T2F.fromBufferOrEmpty(
      bl,
      locArrayBuffer,
      locOffset
    );
    locOffset += locElementLen;
    this.#tr = V3F_C4B_T2F.fromBufferOrEmpty(
      tr,
      locArrayBuffer,
      locOffset
    );
    locOffset += locElementLen;
    this.#br = V3F_C4B_T2F.fromBufferOrEmpty(
      br,
      locArrayBuffer,
      locOffset
    );
  }

  get tl() {
    return this.#tl;
  }

  set tl(tlValue) {
    this.#tl.set(tlValue.vertices, tlValue.colors, tlValue.texCoords);
  }

  get bl() {
    return this.#bl;
  }

  set bl(blValue) {
    const locBl = this.#bl;
    locBl.set(blValue.vertices, blValue.colors, blValue.texCoords);
  }

  get tr() {
    return this.#tr;
  }

  set tr(trValue) {
    this.#tr.set(trValue.vertices, trValue.colors, trValue.texCoords);
  }

  get br() {
    return this.#br;
  }

  set br(brValue) {
    this.#br.set(brValue.vertices, brValue.colors, brValue.texCoords);
  }

  set(tlValue, blValue, trValue, brValue) {
    this.tl = tlValue;
    this.bl = blValue;
    this.tr = trValue;
    this.br = brValue;
  }

  get arrayBuffer() {
    return this._arrayBuffer;
  }

  static zero() {
    return new V3F_C4B_T2F_Quad();
  }

  static copy(sourceQuad) {
    return !sourceQuad ? V3F_C4B_T2F_Quad.zero() : sourceQuad.clone();
  }

  static copyArray(sourceQuads) {
    if (!sourceQuads) return [];

    const retArr = [];
    for (let i = 0; i < sourceQuads.length; i++) {
      retArr.push(V3F_C4B_T2F_Quad.copy(sourceQuads[i]));
    }
    return retArr;
  }

  clone() {
    return new V3F_C4B_T2F_Quad(this.tl, this.bl, this.tr, this.br);
  }

  fromBuffer(arrayBuffer, offset) {
    return new V3F_C4B_T2F_Quad(
      this.tl,
      this.bl,
      this.tr,
      this.br,
      arrayBuffer,
      offset
    );
  }

  static emptyFromBuffer(arrayBuffer, offset) {
    return new V3F_C4B_T2F_Quad(null, null, null, null, arrayBuffer, offset);
  }
}

/**
 * @param {Vertex2F} vertices
 * @param {Color} colors
 * @param {Tex2F} texCoords
 * @param {Array} arrayBuffer
 * @param {Number} offset
 */
export class V2F_C4B_T2F extends BufferBackedType {
    static BYTES_PER_ELEMENT = 20;
    #vertices;
    #colors;
    #texCoords;

    constructor(
        vertices = null,
        colors = null,
        texCoords = null,
        arrayBuffer,
        offset
    ) {
        super(arrayBuffer, offset);

        const locArrayBuffer = this._arrayBuffer;
        let locOffset = this._offset;
        this.#vertices = Vertex2F.fromBufferOrEmpty(
            vertices,
            locArrayBuffer,
            locOffset
        );
        locOffset += Vertex2F.BYTES_PER_ELEMENT;
        this.#colors = WebGLColor.fromBufferOrEmpty(
            colors,
            locArrayBuffer,
            locOffset
        );
        locOffset += WebGLColor.BYTES_PER_ELEMENT;
        this.#texCoords = Tex2F.fromBufferOrEmpty(
            texCoords,
            locArrayBuffer,
            locOffset
        );
    }

    get vertices() {
        return this.#vertices;
    }

    set vertices(verticesValue) {
        this.#vertices.set(verticesValue.x, verticesValue.y);
    }

    get colors() {
        return this.#colors;
    }

    set colors(colorValue) {
        this.#colors.set(colorValue.r, colorValue.g, colorValue.b, colorValue.a);
    }

    get texCoords() {
        return this.#texCoords;
    }

    set texCoords(texValue) {
        this.#texCoords.set(texValue.u, texValue.v);
    }

    set(verticesValue, colorValue, texValue) {
        this.vertices = verticesValue;
        this.colors = colorValue;
        this.texCoords = texValue;
    }

    clone() {
        return new V2F_C4B_T2F(this.vertices, this.colors, this.texCoords);
    }

    fromBuffer(arrayBuffer, offset) {
        return new V2F_C4B_T2F(
            this.vertices,
            this.colors,
            this.texCoords,
            arrayBuffer,
            offset
        );
    }

    static emptyFromBuffer(arrayBuffer, offset) {
        return new V2F_C4B_T2F(null, null, null, arrayBuffer, offset);
    }
}

/**
 * @param {V2F_C4B_T2F} a
 * @param {V2F_C4B_T2F} b
 * @param {V2F_C4B_T2F} c
 * @param {Array} arrayBuffer
 * @param {Number} offset
 */
export class V2F_C4B_T2F_Triangle extends BufferBackedType {
  static BYTES_PER_ELEMENT = 60;
  #a;
  #b;
  #c;

  constructor(a = null, b = null, c = null, arrayBuffer, offset) {
    super(arrayBuffer, offset);

    const locArrayBuffer = this._arrayBuffer;
    let locOffset = this._offset;
    const locElementLen = V2F_C4B_T2F.BYTES_PER_ELEMENT;
    this.#a = V2F_C4B_T2F.fromBufferOrEmpty(a, locArrayBuffer, locOffset);
    locOffset += locElementLen;
    this.#b = V2F_C4B_T2F.fromBufferOrEmpty(b, locArrayBuffer, locOffset);
    locOffset += locElementLen;
    this.#c = V2F_C4B_T2F.fromBufferOrEmpty(c, locArrayBuffer, locOffset);
  }

  get a() {
    return this.#a;
  }

  set a(aValue) {
    this.#a.set(aValue.vertices, aValue.colors, aValue.texCoords);
  }

  get b() {
    return this.#b;
  }

  set b(bValue) {
    this.#b.set(bValue.vertices, bValue.colors, bValue.texCoords);
  }

  get c() {
    return this.#c;
  }

  set c(cValue) {
    this.#c.set(cValue.vertices, cValue.colors, cValue.texCoords);
  }

  set(aValue, bValue, cValue) {
    this.a = aValue;
    this.b = bValue;
    this.c = cValue;
  }

  clone() {
    return new V2F_C4B_T2F_Triangle(this.a, this.b, this.c);
  }

  fromBuffer(arrayBuffer, offset) {
    return new V2F_C4B_T2F_Triangle(
      this.a,
      this.b,
      this.c,
      arrayBuffer,
      offset
    );
  }

  static emptyFromBuffer(arrayBuffer, offset) {
    return new V2F_C4B_T2F_Triangle(null, null, null, arrayBuffer, offset);
  }
}
