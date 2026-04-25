import TiledGrid3DAction from "../action-grid/tiled-grid3d-action";
import Tile from "./tile";
import { Point, Size, rand } from "@aspect/core";

/**
 * ShuffleTiles action. Shuffle the tiles in random order.
 * Reference the test cases (Effects Test)
 * @param {Number} duration
 * @param {Size} gridSize
 * @param {Number} seed
 */
export default class ShuffleTiles extends TiledGrid3DAction {
  _seed = 0;
  _tilesCount = 0;
  _tilesOrder = null;
  _tiles = null;

  /**
   * Creates the action with a random seed, the grid size and the duration.
   * @param {Number} duration
   * @param {Size} gridSize
   * @param {Number} seed
   */
  constructor(duration, gridSize, seed) {
    super();
    this._tilesOrder = [];
    this._tiles = [];

    seed !== undefined && this.initWithDuration(duration, gridSize, seed);
  }

  initWithDuration(duration, gridSize, seed) {
    if (super.initWithDuration(duration, gridSize)) {
      this._seed = seed;
      this._tilesOrder.length = 0;
      this._tiles.length = 0;
      return true;
    }
    return false;
  }

  shuffle(array, len) {
    for (let i = len - 1; i >= 0; i--) {
      const j = 0 | (rand() % (i + 1));
      const v = array[i];
      array[i] = array[j];
      array[j] = v;
    }
  }

  getDelta(pos) {
    const locGridSize = this._gridSize;
    const idx = pos.width * locGridSize.height + pos.height;
    return new Size(
      this._tilesOrder[idx] / locGridSize.height - pos.width,
      (this._tilesOrder[idx] % locGridSize.height) - pos.height
    );
  }

  placeTile(pos, tile) {
    const coords = this.getOriginalTile(pos);

    const step = this.target.grid.getStep();
    const locPosition = tile.position;
    coords.bl.x += locPosition.x * step.x;
    coords.bl.y += locPosition.y * step.y;

    coords.br.x += locPosition.x * step.x;
    coords.br.y += locPosition.y * step.y;

    coords.tl.x += locPosition.x * step.x;
    coords.tl.y += locPosition.y * step.y;

    coords.tr.x += locPosition.x * step.x;
    coords.tr.y += locPosition.y * step.y;

    this.setTile(pos, coords);
  }

  startWithTarget(target) {
    super.startWithTarget(target);
    const locGridSize = this._gridSize;

    this._tilesCount = locGridSize.width * locGridSize.height;
    const locTilesOrder = this._tilesOrder;
    locTilesOrder.length = 0;

    for (let k = 0; k < this._tilesCount; ++k) locTilesOrder[k] = k;
    this.shuffle(locTilesOrder, this._tilesCount);

    const locTiles = this._tiles;
    locTiles.length = 0;
    let tileIndex = 0;
    const tempSize = new Size(0, 0);
    for (let i = 0; i < locGridSize.width; ++i) {
      for (let j = 0; j < locGridSize.height; ++j) {
        locTiles[tileIndex] = new Tile();
        locTiles[tileIndex].position = new Point(i, j);
        locTiles[tileIndex].startPosition = new Point(i, j);
        tempSize.width = i;
        tempSize.height = j;
        locTiles[tileIndex].delta = this.getDelta(tempSize);
        ++tileIndex;
      }
    }
  }

  update(dt) {
    let tileIndex = 0;
    const locGridSize = this._gridSize;
    const locTiles = this._tiles;
    let selTile;
    const locPos = new Point(0, 0);
    for (let i = 0; i < locGridSize.width; ++i) {
      for (let j = 0; j < locGridSize.height; ++j) {
        locPos.x = i;
        locPos.y = j;
        selTile = locTiles[tileIndex];
        selTile.position.x = selTile.delta.width * dt;
        selTile.position.y = selTile.delta.height * dt;
        this.placeTile(locPos, selTile);
        ++tileIndex;
      }
    }
  }
}
