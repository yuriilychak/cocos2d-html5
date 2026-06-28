import BufferBackedType from "./buffer-backed-type";

export default class Vertex2F extends BufferBackedType {
  static BYTES_PER_ELEMENT = 8;
  #view: Float32Array;

  constructor(x: number = 0, y: number = 0, arrayBuffer?: ArrayBuffer, offset?: number) {
    super(arrayBuffer, offset);

    this.#view = new Float32Array(this.arrayBuffer, this.offset, 2);
    this.set(x, y);
  }

  set(x: number = 0, y: number = 0): void {
    this.#view[0] = x;
    this.#view[1] = y;
  }

  get x() {
    return this.#view[0];
  }

  set x(xValue: number) {
    this.#view[0] = xValue;
  }

  get y() {
    return this.#view[1];
  }

  set y(yValue: number) {
    this.#view[1] = yValue;
  }

  clone(): this {
    return new Vertex2F(this.x, this.y) as this;
  }

  fromBuffer(arrayBuffer: ArrayBuffer, offset: number): this {
    return new Vertex2F(this.x, this.y, arrayBuffer, offset) as this;
  }

  static emptyFromBuffer(arrayBuffer: ArrayBuffer, offset: number): Vertex2F {
    return new Vertex2F(0, 0, arrayBuffer, offset);
  }
}
