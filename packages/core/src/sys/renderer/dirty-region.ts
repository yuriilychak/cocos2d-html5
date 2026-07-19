import { Point, Size } from "../../geometry";
import Region from "./region";
import RegionPool from "./region-pool";

// DirtyRegion collects the dirty area which needs to be re-rendered in canvas.
// Many small regions are merged into larger ones to optimise performance.
export default class DirtyRegion {
  static #regionPool = new RegionPool();
  #dirtyList: Region[] = [];
  #hasClipRect = false;
  #clipSize = new Size();
  #clipArea = 0;
  #clipRectChanged = false;

  // regions outside the clip rect will not be considered
  setClipRect(width: number, height: number): void {
    this.#hasClipRect = true;
    this.#clipRectChanged = true;
    this.#clipSize.set(Math.ceil(width), Math.ceil(height));
    this.#clipArea = this.#clipSize.width * this.#clipSize.height;
  }

  // add a new dirty region (needs to be rendered)
  addRegion(target: Region): boolean {
    if (this.#clipRectChanged) {
      return true;
    }

    const min = target.min;
    const max = target.max;

    if (this.#hasClipRect) {
      min.x = Math.max(min.x, 0);
      min.y = Math.max(min.y, 0);
      max.x = Math.min(max.x, this.#clipSize.width);
      max.y = Math.min(max.y, this.#clipSize.height);
    }
    if (min.x >= max.x || min.y >= max.y) {
      return false;
    }

    this.#dirtyList.push(DirtyRegion.#regionPool.acquire(min, max));
    this.#mergeDirtyList();

    return true;
  }

  // clear all dirty regions
  clear(): void {
    for (let i = 0, l = this.#dirtyList.length; i < l; i++) {
      DirtyRegion.#regionPool.release(this.#dirtyList[i]);
    }
    this.#dirtyList.length = 0;
  }

  // get the merged dirty regions
  get dirtyRegions(): Region[] {
    if (this.#clipRectChanged) {
      this.#clipRectChanged = false;
      this.clear();
      this.#dirtyList.push(
        DirtyRegion.#regionPool.acquire(new Point(), Point.fromSize(this.#clipSize))
      );
    } else {
      this.#mergeDirtyList(true);
    }
    for (let i = 0, l = this.#dirtyList.length; i < l; i++) {
      this.#dirtyList[i].intValues();
    }
    return this.#dirtyList;
  }

  // merge small dirty regions into bigger ones to improve performance
  #mergeDirtyList(recursive = false): void {
    const length = this.#dirtyList.length;
    if (length < 2) return;

    const hasClipRect = this.#hasClipRect;
    let bestDelta = length > 3 ? Number.POSITIVE_INFINITY : 0;
    let mergeA = 0,
      mergeB = 0,
      totalArea = 0;

    for (let i = 0; i < length - 1; i++) {
      const regionA = this.#dirtyList[i];
      if (hasClipRect) totalArea += regionA.area;
      for (let j = i + 1; j < length; j++) {
        const regionB = this.#dirtyList[j];
        const delta = regionA.unionArea(regionB) - regionA.area - regionB.area;
        if (bestDelta > delta) {
          mergeA = i;
          mergeB = j;
          bestDelta = delta;
        }
      }
    }

    // if dirty area exceeds 95% of screen, skip further merging
    if (hasClipRect && totalArea / this.#clipArea > 0.95) {
      this.#clipRectChanged = true;
    }
    if (mergeA !== mergeB) {
      const region = this.#dirtyList[mergeB];
      this.#dirtyList[mergeA].union(region);
      DirtyRegion.#regionPool.release(region);
      this.#dirtyList.splice(mergeB, 1);
      if (recursive) {
        this.#mergeDirtyList(true);
      }
    }
  }
}
