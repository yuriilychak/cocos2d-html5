import TiledGrid3DAction from "../action-grid/tiled-grid3d-action";
import { Point, Quad3 } from "@aspect/core";

/**
 * FadeOutTRTiles action. Fades out the tiles in a Top-Right direction.
 * Reference the test cases (Effects Test)
 */
export default class FadeOutTRTiles extends TiledGrid3DAction {
  testFunc(pos, time) {
    const locX = this._gridSize.width * time;
    const locY = this._gridSize.height * time;
    if (locX === this._gridSize.width && locY === this._gridSize.height)
      return 0.0;
    if (locX + locY === 0.0) return 1.0;
    return Math.pow((pos.x + pos.y) / (locX + locY), 6);
  }

  turnOnTile(pos) {
    this.setTile(pos, this.getOriginalTile(pos));
  }

  turnOffTile(pos) {
    this.setTile(pos, new Quad3());
  }

  transformTile(pos, distance) {
    const coords = this.getOriginalTile(pos);
    const step = this.target.grid.getStep();

    coords.bl.x += (step.x / 2) * (1.0 - distance);
    coords.bl.y += (step.y / 2) * (1.0 - distance);

    coords.br.x -= (step.x / 2) * (1.0 - distance);
    coords.br.y += (step.y / 2) * (1.0 - distance);

    coords.tl.x += (step.x / 2) * (1.0 - distance);
    coords.tl.y -= (step.y / 2) * (1.0 - distance);

    coords.tr.x -= (step.x / 2) * (1.0 - distance);
    coords.tr.y -= (step.y / 2) * (1.0 - distance);

    this.setTile(pos, coords);
  }

  update(dt) {
    const locGridSize = this._gridSize;
    const locPos = new Point(0, 0);
    let distance;
    for (let i = 0; i < locGridSize.width; ++i) {
      for (let j = 0; j < locGridSize.height; ++j) {
        locPos.x = i;
        locPos.y = j;
        distance = this.testFunc(locPos, dt);
        if (distance === 0) this.turnOffTile(locPos);
        else if (distance < 1) this.transformTile(locPos, distance);
        else this.turnOnTile(locPos);
      }
    }
  }
}
