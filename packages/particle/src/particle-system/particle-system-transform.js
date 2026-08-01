import { NodeTransform, Rect, ServiceLocator } from "@aspect/core";

export default class ParticleSystemTransform extends NodeTransform {
  get boundingBoxToWorld() {
    return this.getBoundingBoxToCurrentNode();
  }

  getBoundingBoxToCurrentNode() {
    return new Rect(
      0,
      0,
      ServiceLocator.eglView.canvas.width,
      ServiceLocator.eglView.canvas.height
    );
  }
}
