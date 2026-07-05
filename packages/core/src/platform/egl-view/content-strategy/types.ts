import type { RectLike } from "../../../geometry/types";

export interface ContentStrategyResult {
  scale: [number, number];
  viewport: RectLike;
}
