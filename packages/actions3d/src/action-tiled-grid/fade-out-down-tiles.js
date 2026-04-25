import FadeOutUpTiles from "./fade-out-up-tiles";

/**
 * FadeOutDownTiles action. Fades out the tiles in downwards direction.
 * Reference the test cases (Effects Test)
 */
export default class FadeOutDownTiles extends FadeOutUpTiles {
  testFunc(pos, time) {
    const locY = this._gridSize.height * (1.0 - time);
    if (locY === 0.0) return 0.0;
    if (pos.y === 0) return 1.0;
    return Math.pow(locY / pos.y, 6);
  }
}
