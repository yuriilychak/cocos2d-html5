import BufferBackedType from "./buffer-backed-type";

export default class Vertex3F extends BufferBackedType {
  static BYTES_PER_ELEMENT = 12;
  #view: Float32Array;

  constructor(x: number = 0, y: number = 0, z: number = 0, arrayBuffer?: ArrayBuffer, offset?: number) {
    super(arrayBuffer, offset);

    const locArrayBuffer = this.arrayBuffer;
    const locOffset = this.offset;
    this.#view = new Float32Array(locArrayBuffer, locOffset, 3);
    this.set(x, y, z);
  }

  set(x: number = 0, y: number = 0, z: number = 0): void {
    this.#view[0] = x;
    this.#view[1] = y;
    this.#view[2] = z;
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

  get z() {
    return this.#view[2];
  }

  set z(zValue: number) {
    this.#view[2] = zValue;
  }

  clone(): this {
    return new Vertex3F(this.x, this.y, this.z) as this;
  }

  fromBuffer(arrayBuffer: ArrayBuffer, offset: number): this {
    return new Vertex3F(this.x, this.y, this.z, arrayBuffer, offset) as this;
  }

  static emptyFromBuffer(arrayBuffer: ArrayBuffer, offset: number): Vertex3F {
    return new Vertex3F(0, 0, 0, arrayBuffer, offset);
  }
}
