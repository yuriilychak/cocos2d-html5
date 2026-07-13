import type { V3F_C4B_T2F_Quad } from "../../platform/types";
import type { Texture2DInterface } from "../texture-2d";

export interface TextureAtlasInterface {
  texture: Texture2DInterface | null;
  readonly totalQuads: number;
  capacity: number;
  quads: V3F_C4B_T2F_Quad[] | null;

  copyQuadsToTextureAtlas(
    quads: V3F_C4B_T2F_Quad[] | null,
    index: number
  ): void;
  markDirty(): void;
  toString(): string;
  initWithFile(file: string, capacity: number): boolean;
  initWithTexture(texture: Texture2DInterface, capacity: number): boolean;
  updateQuad(quad: V3F_C4B_T2F_Quad, index: number): void;
  insertQuad(quad: V3F_C4B_T2F_Quad, index: number): void;
  insertQuads(
    quads: V3F_C4B_T2F_Quad[],
    index: number,
    amount?: number
  ): void;
  insertQuadFromIndex(fromIndex: number, newIndex: number): void;
  removeQuadAtIndex(index: number): void;
  removeQuadsAtIndex(index: number, amount: number): void;
  removeAllQuads(): void;
  increaseTotalQuadsWith(amount: number): void;
  moveQuadsFromIndex(
    oldIndex: number,
    amount: number,
    newIndex?: number
  ): void;
  fillWithEmptyQuadsFromIndex(index: number, amount: number): void;
  drawNumberOfQuads(n: number, start?: number): void;
  drawQuads(): void;
  releaseBuffer(): void;
}

export interface TextureAtlasRendererInterface {
  quads: V3F_C4B_T2F_Quad[] | null;

  initWithCapacity(capacity: number): boolean;
  copyQuadsToTextureAtlas(
    quads: V3F_C4B_T2F_Quad[] | null,
    index: number
  ): void;
  markDirty(): void;
  updateQuad(quad: V3F_C4B_T2F_Quad, index: number): void;
  insertQuad(quad: V3F_C4B_T2F_Quad, index: number): void;
  insertQuads(
    quads: V3F_C4B_T2F_Quad[],
    index: number,
    amount: number
  ): void;
  insertQuadFromIndex(fromIndex: number, newIndex: number): void;
  removeQuadAtIndex(index: number): void;
  removeQuadsAtIndex(index: number, amount: number): void;
  removeAllQuads(): void;
  resizeCapacity(capacity: number, oldCapacity: number): void;
  moveQuadsFromIndex(
    oldIndex: number,
    amount: number,
    newIndex: number
  ): void;
  fillWithEmptyQuadsFromIndex(index: number, amount: number): void;
  setupVBO(): void;
  mapBuffers(): void;
  drawNumberOfQuads(n: number, start?: number): void;
  releaseBuffer(): void;
}
