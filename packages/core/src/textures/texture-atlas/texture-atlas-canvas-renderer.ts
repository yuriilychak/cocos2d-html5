import TextureAtlasRenderer from "./texture-atlas-renderer";
import type { TextureAtlasInterface } from "./types";
import type { V3F_C4B_T2F_Quad } from "../../platform/types";

export default class TextureAtlasCanvasRenderer extends TextureAtlasRenderer {
  constructor(textureAtlas: TextureAtlasInterface) {
    super(textureAtlas);
  }

  initWithCapacity(capacity: number): boolean {
    return true;
  }

  copyQuadsToTextureAtlas(
    quads: V3F_C4B_T2F_Quad[] | null,
    index: number
  ): void {}

  markDirty(): void {}

  updateQuad(quad: V3F_C4B_T2F_Quad, index: number): void {}

  insertQuad(quad: V3F_C4B_T2F_Quad, index: number): void {}

  insertQuads(
    quads: V3F_C4B_T2F_Quad[],
    index: number,
    amount: number
  ): void {}

  insertQuadFromIndex(fromIndex: number, newIndex: number): void {}

  removeQuadAtIndex(index: number): void {}

  removeQuadsAtIndex(index: number, amount: number): void {}

  removeAllQuads(): void {}

  resizeCapacity(capacity: number, oldCapacity: number): void {}

  moveQuadsFromIndex(
    oldIndex: number,
    amount: number,
    newIndex: number
  ): void {}

  fillWithEmptyQuadsFromIndex(index: number, amount: number): void {}

  setupVBO(): void {
    // Canvas rendering doesn't use VBOs - no-op
  }

  mapBuffers(): void {
    // Canvas rendering doesn't use buffers - no-op
  }

  /**
   * Canvas rendering doesn't use quad-based drawing - no-op
   */
  drawNumberOfQuads(n: number, start?: number): void {
    // Canvas rendering doesn't use this method - no-op
  }

  releaseBuffer(): void {
    // Canvas rendering doesn't have GL buffers to release - no-op
  }

  get quads(): V3F_C4B_T2F_Quad[] | null {
    return null;
  }

  set quads(value: V3F_C4B_T2F_Quad[] | null) {}
}
