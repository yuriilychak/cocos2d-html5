/**
 * A Tile composed of position, startPosition and delta.
 * @param {cc.Point} [position]
 * @param {cc.Point} [startPosition]
 * @param {cc.Size} [delta]
 */
export default function Tile(position, startPosition, delta) {
  this.position = position || new cc.Point(0, 0);
  this.startPosition = startPosition || new cc.Point(0, 0);
  this.delta = delta || new cc.Point(0, 0);
}
