import BufferBackedType from "./buffer-backed-type";
import Vertex2F from "./vertex2-f";

export default class Quad2 extends BufferBackedType {
  static BYTES_PER_ELEMENT = 32;
  #tl: Vertex2F;
  #tr: Vertex2F;
  #bl: Vertex2F;
  #br: Vertex2F;

  constructor(
    tl: Vertex2F | null = null,
    tr: Vertex2F | null = null,
    bl: Vertex2F | null = null,
    br: Vertex2F | null = null,
    arrayBuffer?: ArrayBuffer,
    offset?: number
  ) {
    super(arrayBuffer, offset);

    let locOffset = this.offset;
    const locElementLen = Vertex2F.BYTES_PER_ELEMENT;
    this.#tl = Vertex2F.fromBufferOrEmpty(tl, this.arrayBuffer, locOffset);
    locOffset += locElementLen;
    this.#tr = Vertex2F.fromBufferOrEmpty(tr, this.arrayBuffer, locOffset);
    locOffset += locElementLen;
    this.#bl = Vertex2F.fromBufferOrEmpty(bl, this.arrayBuffer, locOffset);
    locOffset += locElementLen;
    this.#br = Vertex2F.fromBufferOrEmpty(br, this.arrayBuffer, locOffset);
  }

  get tl() {
    return this.#tl;
  }

  set tl(tlValue: Vertex2F) {
    this.#tl.set(tlValue.x, tlValue.y);
  }

  get tr() {
    return this.#tr;
  }

  set tr(trValue: Vertex2F) {
    this.#tr.set(trValue.x, trValue.y);
  }

  get bl() {
    return this.#bl;
  }

  set bl(blValue: Vertex2F) {
    this.#bl.set(blValue.x, blValue.y);
  }

  get br() {
    return this.#br;
  }

  set br(brValue: Vertex2F) {
    this.#br.set(brValue.x, brValue.y);
  }

  set(tlValue: Vertex2F, trValue: Vertex2F, blValue: Vertex2F, brValue: Vertex2F): void {
    this.tl = tlValue;
    this.tr = trValue;
    this.bl = blValue;
    this.br = brValue;
  }

  clone(): this {
    return new Quad2(this.tl, this.tr, this.bl, this.br) as this;
  }

  fromBuffer(arrayBuffer: ArrayBuffer, offset: number): this {
    return new Quad2(
      this.tl,
      this.tr,
      this.bl,
      this.br,
      arrayBuffer,
      offset
    ) as this;
  }

  static emptyFromBuffer(arrayBuffer: ArrayBuffer, offset: number): Quad2 {
    return new Quad2(null, null, null, null, arrayBuffer, offset);
  }
}
