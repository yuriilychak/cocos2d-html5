import BufferBackedType from "./buffer-backed-type";
import Tex2F from "./tex2-f";
import Vertex3F from "./vertex3-f";
import WebGLColor from "./webgl-color";

export default class V3F_C4B_T2F extends BufferBackedType {
  static BYTES_PER_ELEMENT = 24;
  #vertices: Vertex3F;
  #colors: WebGLColor;
  #texCoords: Tex2F;

  constructor(
    vertices: Vertex3F | null = null,
    colors: WebGLColor | null = null,
    texCoords: Tex2F | null = null,
    arrayBuffer?: ArrayBuffer,
    offset?: number
  ) {
    super(arrayBuffer, offset);

    let locOffset = this.offset;
    this.#vertices = Vertex3F.fromBufferOrEmpty(
      vertices,
      this.arrayBuffer,
      locOffset
    );

    locOffset += Vertex3F.BYTES_PER_ELEMENT;
    this.#colors = WebGLColor.fromBufferOrEmpty(
      colors,
      this.arrayBuffer,
      locOffset
    );

    locOffset += WebGLColor.BYTES_PER_ELEMENT;
    this.#texCoords = Tex2F.fromBufferOrEmpty(
      texCoords,
      this.arrayBuffer,
      locOffset
    );
  }

  get vertices() {
    return this.#vertices;
  }

  set vertices(verticesValue: Vertex3F) {
    this.#vertices.set(verticesValue.x, verticesValue.y, verticesValue.z);
  }

  get colors() {
    return this.#colors;
  }

  set colors(colorValue: WebGLColor) {
    this.#colors.set(colorValue.r, colorValue.g, colorValue.b, colorValue.a);
  }

  get texCoords() {
    return this.#texCoords;
  }

  set texCoords(texValue: Tex2F) {
    this.#texCoords.set(texValue.u, texValue.v);
  }

  set(verticesValue: Vertex3F, colorValue: WebGLColor, texValue: Tex2F): void {
    this.vertices = verticesValue;
    this.colors = colorValue;
    this.texCoords = texValue;
  }

  clone(): this {
    return new V3F_C4B_T2F(
      this.vertices,
      this.colors,
      this.texCoords
    ) as this;
  }

  fromBuffer(arrayBuffer: ArrayBuffer, offset: number): this {
    return new V3F_C4B_T2F(
      this.vertices,
      this.colors,
      this.texCoords,
      arrayBuffer,
      offset
    ) as this;
  }

  static emptyFromBuffer(arrayBuffer: ArrayBuffer, offset: number): V3F_C4B_T2F {
    return new V3F_C4B_T2F(null, null, null, arrayBuffer, offset);
  }
}
