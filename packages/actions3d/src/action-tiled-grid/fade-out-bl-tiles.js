import FadeOutTRTiles from "./fade-out-tr-tiles";

/**
 * cc.FadeOutBLTiles action. Fades out the tiles in a Bottom-Left direction.
 * Reference the test cases (Effects Test)
 */
export default class FadeOutBLTiles extends FadeOutTRTiles {
  testFunc(pos, time) {
    const locX = this._gridSize.width * (1.0 - time);
    const locY = this._gridSize.height * (1.0 - time);
    if (locX + locY === 0) return 0.0;
    if (pos.x + pos.y === 0) return 1.0;

    return Math.pow((locX + locY) / (pos.x + pos.y), 6);
  }
}
