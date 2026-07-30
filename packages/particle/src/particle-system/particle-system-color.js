import { NodeColor } from "@aspect/core";

/**
 * Color state for ParticleSystem.
 *
 * Premultiplied particle textures require their RGB channels to be scaled by
 * alpha when their vertices are uploaded.
 */
export default class ParticleSystemColor extends NodeColor {
  #opacityModifyRGB = false;

  get opacityModifyRGB() {
    return this.#opacityModifyRGB;
  }

  set opacityModifyRGB(value) {
    this.#opacityModifyRGB = value;
  }
}
