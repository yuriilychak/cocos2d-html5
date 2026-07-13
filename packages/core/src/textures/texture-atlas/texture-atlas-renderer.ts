import type {
  TextureAtlasInterface,
  TextureAtlasRendererInterface
} from "./types";
import type { V3F_C4B_T2F_Quad } from "../../platform/types";

export default abstract class TextureAtlasRenderer
  implements TextureAtlasRendererInterface
{
  #textureAtlas: TextureAtlasInterface;

  protected constructor(textureAtlas: TextureAtlasInterface) {
    this.#textureAtlas = textureAtlas;
  }

  abstract get quads(): V3F_C4B_T2F_Quad[] | null;

  abstract set quads(value: V3F_C4B_T2F_Quad[] | null);

  abstract initWithCapacity(capacity: number): boolean;

  abstract copyQuadsToTextureAtlas(
    quads: V3F_C4B_T2F_Quad[] | null,
    index: number
  ): void;

  abstract markDirty(): void;

  abstract updateQuad(quad: V3F_C4B_T2F_Quad, index: number): void;

  abstract insertQuad(quad: V3F_C4B_T2F_Quad, index: number): void;

  abstract insertQuads(
    quads: V3F_C4B_T2F_Quad[],
    index: number,
    amount: number
  ): void;

  abstract insertQuadFromIndex(fromIndex: number, newIndex: number): void;

  abstract removeQuadAtIndex(index: number): void;

  abstract removeQuadsAtIndex(index: number, amount: number): void;

  abstract removeAllQuads(): void;

  abstract resizeCapacity(capacity: number, oldCapacity: number): void;

  abstract moveQuadsFromIndex(
    oldIndex: number,
    amount: number,
    newIndex: number
  ): void;

  abstract fillWithEmptyQuadsFromIndex(index: number, amount: number): void;

  abstract setupVBO(): void;

  abstract mapBuffers(): void;

  abstract drawNumberOfQuads(n: number, start?: number): void;

  abstract releaseBuffer(): void;

  protected get textureAtlas(): TextureAtlasInterface {
    return this.#textureAtlas;
  }
}
