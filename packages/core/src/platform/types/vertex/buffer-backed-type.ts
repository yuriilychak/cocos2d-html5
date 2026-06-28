export default abstract class BufferBackedType {
  static BYTES_PER_ELEMENT = 0;

  #arrayBuffer: ArrayBuffer;
  #offset: number;

  constructor(
    arrayBuffer = new ArrayBuffer(new.target.BYTES_PER_ELEMENT),
    offset = 0
  ) {
    this.#arrayBuffer =
      arrayBuffer ?? new ArrayBuffer(new.target.BYTES_PER_ELEMENT);
    this.#offset = offset ?? 0;
  }

  get arrayBuffer() {
    return this.#arrayBuffer;
  }

  get offset() {
    return this.#offset;
  }

  abstract clone(): this;

  abstract fromBuffer(arrayBuffer: ArrayBuffer, offset: number): this;

  static fromBufferOrEmpty<T extends BufferBackedType>(
    this: { emptyFromBuffer(arrayBuffer: ArrayBuffer, offset: number): T },
    value: T | null,
    arrayBuffer: ArrayBuffer,
    offset: number
  ): T {
    return value
      ? value.fromBuffer(arrayBuffer, offset)
      : this.emptyFromBuffer(arrayBuffer, offset);
  }

  static emptyFromBuffer(_arrayBuffer: ArrayBuffer, _offset: number): unknown {
    throw new Error("BufferBackedType.emptyFromBuffer must be implemented");
  }
}
