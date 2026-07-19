import type { PointLike } from "../geometry";
import Region from "./region";

export default class RegionPool {
  #regions: Region[] = [];

  acquire(min: PointLike | null = null, max: PointLike | null = null): Region {
    return this.#regions.length > 0
      ? this.#regions.pop()!.setTo(min, max)
      : new Region(min, max);
  }

  release(region: Region): void {
    this.#regions.push(region);
  }
}
