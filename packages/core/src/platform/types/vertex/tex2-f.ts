import BufferBackedType from "./buffer-backed-type";

/**
 * @param {Number} u
 * @param {Number} v
 * @param {Array} arrayBuffer
 * @param {Number} offset
 */
export default class Tex2F extends BufferBackedType {
  static BYTES_PER_ELEMENT = 8;
  #view: Float32Array;

  constructor(u: number = 0, v: number = 0, arrayBuffer?: ArrayBuffer, offset?: number) {
    super(arrayBuffer, offset);

    this.#view = new Float32Array(this.arrayBuffer, this.offset, 2);
    this.set(u, v);
  }

  set(u: number = 0, v: number = 0): void {
    this.#view[0] = u;
    this.#view[1] = v;
  }

  get u() {
    return this.#view[0];
  }

  set u(uValue: number) {
    this.#view[0] = uValue;
  }

  get v() {
    return this.#view[1];
  }

  set v(vValue: number) {
    this.#view[1] = vValue;
  }

  clone(): this {
    return new Tex2F(this.u, this.v) as this;
  }

  fromBuffer(arrayBuffer: ArrayBuffer, offset: number): this {
    return new Tex2F(this.u, this.v, arrayBuffer, offset) as this;
  }

  static emptyFromBuffer(arrayBuffer: ArrayBuffer, offset: number): Tex2F {
    return new Tex2F(0, 0, arrayBuffer, offset);
  }
}
