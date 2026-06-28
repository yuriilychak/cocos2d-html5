import BufferBackedType from "./buffer-backed-type";
import V3F_C4B_T2F from "./v3-f-c4-b-t2-f";

export default class V3F_C4B_T2F_Quad extends BufferBackedType {
  static BYTES_PER_ELEMENT = 96;
  #tl: V3F_C4B_T2F;
  #bl: V3F_C4B_T2F;
  #tr: V3F_C4B_T2F;
  #br: V3F_C4B_T2F;

  constructor(
    tl: V3F_C4B_T2F | null = null,
    bl: V3F_C4B_T2F | null = null,
    tr: V3F_C4B_T2F | null = null,
    br: V3F_C4B_T2F | null = null,
    arrayBuffer?: ArrayBuffer,
    offset?: number
  ) {
    super(arrayBuffer, offset);

    let locOffset = this.offset;
    const locElementLen = V3F_C4B_T2F.BYTES_PER_ELEMENT;
    this.#tl = V3F_C4B_T2F.fromBufferOrEmpty(tl, this.arrayBuffer, locOffset);
    locOffset += locElementLen;
    this.#bl = V3F_C4B_T2F.fromBufferOrEmpty(bl, this.arrayBuffer, locOffset);
    locOffset += locElementLen;
    this.#tr = V3F_C4B_T2F.fromBufferOrEmpty(tr, this.arrayBuffer, locOffset);
    locOffset += locElementLen;
    this.#br = V3F_C4B_T2F.fromBufferOrEmpty(br, this.arrayBuffer, locOffset);
  }

  get tl() {
    return this.#tl;
  }

  set tl(tlValue: V3F_C4B_T2F) {
    this.#tl.set(tlValue.vertices, tlValue.colors, tlValue.texCoords);
  }

  get bl() {
    return this.#bl;
  }

  set bl(blValue: V3F_C4B_T2F) {
    const locBl = this.#bl;
    locBl.set(blValue.vertices, blValue.colors, blValue.texCoords);
  }

  get tr() {
    return this.#tr;
  }

  set tr(trValue: V3F_C4B_T2F) {
    this.#tr.set(trValue.vertices, trValue.colors, trValue.texCoords);
  }

  get br() {
    return this.#br;
  }

  set br(brValue: V3F_C4B_T2F) {
    this.#br.set(brValue.vertices, brValue.colors, brValue.texCoords);
  }

  set(
    tlValue: V3F_C4B_T2F,
    blValue: V3F_C4B_T2F,
    trValue: V3F_C4B_T2F,
    brValue: V3F_C4B_T2F
  ): void {
    this.tl = tlValue;
    this.bl = blValue;
    this.tr = trValue;
    this.br = brValue;
  }

  static zero(): V3F_C4B_T2F_Quad {
    return new V3F_C4B_T2F_Quad();
  }

  static copy(sourceQuad: V3F_C4B_T2F_Quad | null): V3F_C4B_T2F_Quad {
    return !sourceQuad ? V3F_C4B_T2F_Quad.zero() : sourceQuad.clone();
  }

  static copyArray(sourceQuads: V3F_C4B_T2F_Quad[] | null): V3F_C4B_T2F_Quad[] {
    if (!sourceQuads) return [];

    const retArr = [];
    for (let i = 0; i < sourceQuads.length; i++) {
      retArr.push(V3F_C4B_T2F_Quad.copy(sourceQuads[i]));
    }
    return retArr;
  }

  clone(): this {
    return new V3F_C4B_T2F_Quad(this.tl, this.bl, this.tr, this.br) as this;
  }

  fromBuffer(arrayBuffer: ArrayBuffer, offset: number): this {
    return new V3F_C4B_T2F_Quad(
      this.tl,
      this.bl,
      this.tr,
      this.br,
      arrayBuffer,
      offset
    ) as this;
  }

  static emptyFromBuffer(arrayBuffer: ArrayBuffer, offset: number): V3F_C4B_T2F_Quad {
    return new V3F_C4B_T2F_Quad(null, null, null, null, arrayBuffer, offset);
  }
}
