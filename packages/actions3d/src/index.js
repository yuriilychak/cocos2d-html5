import { ReverseTime } from "@aspect/actions";
import { GridAction } from "./action-grid";
import { Grid3DAction } from "./action-grid";
import { TiledGrid3DAction } from "./action-grid";
import { StopGrid } from "./action-grid";
import { ReuseGrid } from "./action-grid";

import { Waves3D } from "./action-grid3d";
import { FlipX3D } from "./action-grid3d";
import { FlipY3D } from "./action-grid3d";
import { Lens3D } from "./action-grid3d";
import { Ripple3D } from "./action-grid3d";
import { Shaky3D } from "./action-grid3d";
import { Liquid } from "./action-grid3d";
import { Waves } from "./action-grid3d";
import { Twirl } from "./action-grid3d";

import { PageTurn3D } from "./action-page-turn3d";

import { ShakyTiles3D } from "./action-tiled-grid";
import { ShatteredTiles3D } from "./action-tiled-grid";
import { Tile } from "./action-tiled-grid";
import { ShuffleTiles } from "./action-tiled-grid";
import { FadeOutTRTiles } from "./action-tiled-grid";
import { FadeOutBLTiles } from "./action-tiled-grid";
import { FadeOutUpTiles } from "./action-tiled-grid";
import { FadeOutDownTiles } from "./action-tiled-grid";
import { TurnOffTiles } from "./action-tiled-grid";
import { WavesTiles3D } from "./action-tiled-grid";
import { JumpTiles3D } from "./action-tiled-grid";
import { SplitRows } from "./action-tiled-grid";
import { SplitCols } from "./action-tiled-grid";

export {
  GridAction,
  Grid3DAction,
  TiledGrid3DAction,
  StopGrid,
  ReuseGrid,
  Waves3D,
  FlipX3D,
  FlipY3D,
  Lens3D,
  Ripple3D,
  Shaky3D,
  Liquid,
  Waves,
  Twirl,
  PageTurn3D,
  ShakyTiles3D,
  ShatteredTiles3D,
  Tile,
  ShuffleTiles,
  FadeOutTRTiles,
  FadeOutBLTiles,
  FadeOutUpTiles,
  FadeOutDownTiles,
  TurnOffTiles,
  WavesTiles3D,
  JumpTiles3D,
  SplitRows,
  SplitCols,
};

export const stopGrid = () => new StopGrid();
export const reuseGrid = (times) => new ReuseGrid(times);
export const gridAction = (duration, gridSize) => new GridAction(duration, gridSize);
export const grid3DAction = (duration, gridSize) => new Grid3DAction(duration, gridSize);
export const tiledGrid3DAction = (duration, gridSize) => new TiledGrid3DAction(duration, gridSize);
export const waves3D = (duration, gridSize, waves, amplitude) => new Waves3D(duration, gridSize, waves, amplitude);
export const flipX3D = (duration) => new FlipX3D(duration);
export const flipY3D = (duration) => new FlipY3D(duration);
export const lens3D = (duration, gridSize, position, radius) => new Lens3D(duration, gridSize, position, radius);
export const ripple3D = (duration, gridSize, position, radius, waves, amplitude) => new Ripple3D(duration, gridSize, position, radius, waves, amplitude);
export const shaky3D = (duration, gridSize, range, shakeZ) => new Shaky3D(duration, gridSize, range, shakeZ);
export const liquid = (duration, gridSize, waves, amplitude) => new Liquid(duration, gridSize, waves, amplitude);
export const waves = (duration, gridSize, waveCount, amplitude, horizontal, vertical) => new Waves(duration, gridSize, waveCount, amplitude, horizontal, vertical);
export const twirl = (duration, gridSize, position, twirls, amplitude) => new Twirl(duration, gridSize, position, twirls, amplitude);
export const pageTurn3D = (duration, gridSize) => new PageTurn3D(duration, gridSize);
export const shakyTiles3D = (duration, gridSize, range, shakeZ) => new ShakyTiles3D(duration, gridSize, range, shakeZ);
export const shatteredTiles3D = (duration, gridSize, range, shatterZ) => new ShatteredTiles3D(duration, gridSize, range, shatterZ);
export const shuffleTiles = (duration, gridSize, seed) => new ShuffleTiles(duration, gridSize, seed);
export const fadeOutTRTiles = (duration, gridSize) => new FadeOutTRTiles(duration, gridSize);
export const fadeOutBLTiles = (duration, gridSize) => new FadeOutBLTiles(duration, gridSize);
export const fadeOutUpTiles = (duration, gridSize) => new FadeOutUpTiles(duration, gridSize);
export const fadeOutDownTiles = (duration, gridSize) => new FadeOutDownTiles(duration, gridSize);
export const turnOffTiles = (duration, gridSize, seed) => new TurnOffTiles(duration, gridSize, seed);
export const wavesTiles3D = (duration, gridSize, waves, amplitude) => new WavesTiles3D(duration, gridSize, waves, amplitude);
export const jumpTiles3D = (duration, gridSize, numberOfJumps, amplitude) => new JumpTiles3D(duration, gridSize, numberOfJumps, amplitude);
export const splitRows = (duration, rows) => new SplitRows(duration, rows);
export const splitCols = (duration, cols) => new SplitCols(duration, cols);
export const reverseTime = (action) => new ReverseTime(action);
