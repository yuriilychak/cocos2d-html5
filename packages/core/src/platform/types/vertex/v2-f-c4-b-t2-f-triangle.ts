import BufferBackedType from "./buffer-backed-type";
import V2F_C4B_T2F from "./v2-f-c4-b-t2-f";

export default class V2F_C4B_T2F_Triangle extends BufferBackedType {
  static BYTES_PER_ELEMENT = 60;
  #a: V2F_C4B_T2F;
  #b: V2F_C4B_T2F;
  #c: V2F_C4B_T2F;

  constructor(
    a: V2F_C4B_T2F | null = null,
    b: V2F_C4B_T2F | null = null,
    c: V2F_C4B_T2F | null = null,
    arrayBuffer?: ArrayBuffer,
    offset?: number
  ) {
    super(arrayBuffer, offset);

    let locOffset = this.offset;
    const locElementLen = V2F_C4B_T2F.BYTES_PER_ELEMENT;
    this.#a = V2F_C4B_T2F.fromBufferOrEmpty(a, this.arrayBuffer, locOffset);
    locOffset += locElementLen;
    this.#b = V2F_C4B_T2F.fromBufferOrEmpty(b, this.arrayBuffer, locOffset);
    locOffset += locElementLen;
    this.#c = V2F_C4B_T2F.fromBufferOrEmpty(c, this.arrayBuffer, locOffset);
  }

  get a() {
    return this.#a;
  }

  set a(aValue: V2F_C4B_T2F) {
    this.#a.set(aValue.vertices, aValue.colors, aValue.texCoords);
  }

  get b() {
    return this.#b;
  }

  set b(bValue: V2F_C4B_T2F) {
    this.#b.set(bValue.vertices, bValue.colors, bValue.texCoords);
  }

  get c() {
    return this.#c;
  }

  set c(cValue: V2F_C4B_T2F) {
    this.#c.set(cValue.vertices, cValue.colors, cValue.texCoords);
  }

  set(aValue: V2F_C4B_T2F, bValue: V2F_C4B_T2F, cValue: V2F_C4B_T2F): void {
    this.a = aValue;
    this.b = bValue;
    this.c = cValue;
  }

  clone(): this {
    return new V2F_C4B_T2F_Triangle(this.a, this.b, this.c) as this;
  }

  fromBuffer(arrayBuffer: ArrayBuffer, offset: number): this {
    return new V2F_C4B_T2F_Triangle(
      this.a,
      this.b,
      this.c,
      arrayBuffer,
      offset
    ) as this;
  }

  static emptyFromBuffer(arrayBuffer: ArrayBuffer, offset: number): V2F_C4B_T2F_Triangle {
    return new V2F_C4B_T2F_Triangle(null, null, null, arrayBuffer, offset);
  }
}
