import FadeOutTRTiles from "./fade-out-tr-tiles";

/**
 * cc.FadeOutUpTiles action. Fades out the tiles in upwards direction.
 * Reference the test cases (Effects Test)
 */
export default class FadeOutUpTiles extends FadeOutTRTiles {
  testFunc(pos, time) {
    const locY = this._gridSize.height * time;
    if (locY === this._gridSize.height) return 0.0;
    if (locY === 0.0) return 1.0;
    return Math.pow(pos.y / locY, 6);
  }

  transformTile(pos, distance) {
    const coords = this.getOriginalTile(pos);
    const step = this.target.grid.getStep();

    coords.bl.y += (step.y / 2) * (1.0 - distance);
    coords.br.y += (step.y / 2) * (1.0 - distance);
    coords.tl.y -= (step.y / 2) * (1.0 - distance);
    coords.tr.y -= (step.y / 2) * (1.0 - distance);

    this.setTile(pos, coords);
  }
}
