import { BYTE } from "../../../constants";
import BufferBackedType from "./buffer-backed-type";

export default class WebGLColor extends BufferBackedType {
  static BYTES_PER_ELEMENT = 4;
  #view: Uint8Array;
  #aUndefined: boolean;

  constructor(
    r: number = 0,
    g: number = 0,
    b: number = 0,
    a?: number,
    arrayBuffer?: ArrayBuffer,
    offset?: number
  ) {
    super(arrayBuffer, offset);
    this.#view = new Uint8Array(this.arrayBuffer, this.offset, 4);
    this.#aUndefined = a === undefined;
    this.set(r, g, b, a);
  }

  set(r: number = 0, g: number = 0, b: number = 0, a?: number): void {
    this.#view[0] = r;
    this.#view[1] = g;
    this.#view[2] = b;
    this.#view[3] = a == null ? BYTE : a;
  }

  get a_undefined(): boolean {
    return this.#aUndefined;
  }

  get r() {
    return this.#view[0];
  }

  set r(value: number) {
    this.#view[0] = Math.max(value, 0);
  }

  get g() {
    return this.#view[1];
  }

  set g(value: number) {
    this.#view[1] = Math.max(value, 0);
  }

  get b() {
    return this.#view[2];
  }

  set b(value: number) {
    this.#view[2] = Math.max(value, 0);
  }

  get a() {
    return this.#view[3];
  }

  set a(value: number) {
    this.#view[3] = Math.max(value, 0);
  }

  clone(): this {
    return new WebGLColor(this.r, this.g, this.b, this.a) as this;
  }

  fromBuffer(arrayBuffer: ArrayBuffer, offset: number): this {
    return new WebGLColor(
      this.r,
      this.g,
      this.b,
      this.a,
      arrayBuffer,
      offset
    ) as this;
  }

  static emptyFromBuffer(arrayBuffer: ArrayBuffer, offset: number): WebGLColor {
    return new WebGLColor(0, 0, 0, 0, arrayBuffer, offset);
  }
}
