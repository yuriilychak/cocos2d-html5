import { Point } from "@aspect/core";

/**
 * A Tile composed of position, startPosition and delta.
 * @param {Point} [position]
 * @param {Point} [startPosition]
 * @param {Size} [delta]
 */
export default function Tile(position, startPosition, delta) {
  this.position = position || new Point();
  this.startPosition = startPosition || new Point();
  this.delta = delta || new Point();
}
