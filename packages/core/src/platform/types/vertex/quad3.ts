import BufferBackedType from "./buffer-backed-type";
import Vertex3F from "./vertex3-f";

/**
 * A 3D Quad. 4 * 3 floats
 * @Construct
 * @param {Vertex3F} bl
 * @param {Vertex3F} br
 * @param {Vertex3F} tl
 * @param {Vertex3F} tr
 */
export default class Quad3 extends BufferBackedType {
  static BYTES_PER_ELEMENT = 48;
  #bl: Vertex3F;
  #br: Vertex3F;
  #tl: Vertex3F;
  #tr: Vertex3F;

  constructor(
    bl: Vertex3F | null = null,
    br: Vertex3F | null = null,
    tl: Vertex3F | null = null,
    tr: Vertex3F | null = null,
    arrayBuffer?: ArrayBuffer,
    offset?: number
  ) {
    super(arrayBuffer, offset);

    let locOffset = this.offset;
    const locElementLen = Vertex3F.BYTES_PER_ELEMENT;
    this.#bl = Vertex3F.fromBufferOrEmpty(bl, this.arrayBuffer, locOffset);
    locOffset += locElementLen;
    this.#br = Vertex3F.fromBufferOrEmpty(br, this.arrayBuffer, locOffset);
    locOffset += locElementLen;
    this.#tl = Vertex3F.fromBufferOrEmpty(tl, this.arrayBuffer, locOffset);
    locOffset += locElementLen;
    this.#tr = Vertex3F.fromBufferOrEmpty(tr, this.arrayBuffer, locOffset);
  }

  get bl() {
    return this.#bl;
  }

  set bl(blValue: Vertex3F) {
    this.#bl.set(blValue.x, blValue.y, blValue.z);
  }

  get br() {
    return this.#br;
  }

  set br(brValue: Vertex3F) {
    this.#br.set(brValue.x, brValue.y, brValue.z);
  }

  get tl() {
    return this.#tl;
  }

  set tl(tlValue: Vertex3F) {
    this.#tl.set(tlValue.x, tlValue.y, tlValue.z);
  }

  get tr() {
    return this.#tr;
  }

  set tr(trValue: Vertex3F) {
    this.#tr.set(trValue.x, trValue.y, trValue.z);
  }

  set(blValue: Vertex3F, brValue: Vertex3F, tlValue: Vertex3F, trValue: Vertex3F): void {
    this.bl = blValue;
    this.br = brValue;
    this.tl = tlValue;
    this.tr = trValue;
  }

  clone(): this {
    return new Quad3(this.bl, this.br, this.tl, this.tr) as this;
  }

  fromBuffer(arrayBuffer: ArrayBuffer, offset: number): this {
    return new Quad3(
      this.bl,
      this.br,
      this.tl,
      this.tr,
      arrayBuffer,
      offset
    ) as this;
  }

  static emptyFromBuffer(arrayBuffer: ArrayBuffer, offset: number): Quad3 {
    return new Quad3(null, null, null, null, arrayBuffer, offset);
  }
}
