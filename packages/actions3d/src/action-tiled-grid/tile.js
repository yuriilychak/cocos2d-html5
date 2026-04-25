import { Point } from "@aspect/core";

/**
 * A Tile composed of position, startPosition and delta.
 * @param {Point} [position]
 * @param {Point} [startPosition]
 * @param {Size} [delta]
 */
export default function Tile(position, startPosition, delta) {
  this.position = position || new Point(0, 0);
  this.startPosition = startPosition || new Point(0, 0);
  this.delta = delta || new Point(0, 0);
}
