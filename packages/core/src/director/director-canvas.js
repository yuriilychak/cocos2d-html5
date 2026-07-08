import { DirectorRenderer } from "./director-renderer";
import { Point } from "../geometry";
import { ServiceLocator } from "../service-locator";
import { EventCustom } from '../event-manager';

export class DirectorCanvasRenderer extends DirectorRenderer {
  setProjection(projection) {
    ServiceLocator.eglView.projection = projection;
  }

  setClearColor(clearColor) {
    const renderer = ServiceLocator.sys.rendererConfig.renderer;
    renderer._clearColor = clearColor;
    renderer._clearFillStyle =
      "rgb(" + clearColor.r + "," + clearColor.g + "," + clearColor.b + ")";
  }

  setOpenGLView(openGLView) {
    ServiceLocator.eglView.winSizeInPoints = ServiceLocator.eglView.canvas;

    if (ServiceLocator.eventManager) {
      ServiceLocator.eventManager.enabled = true;
    }
  }

  getVisibleSize() {
    return ServiceLocator.eglView.winSizeInPoints;
  }

  getVisibleOrigin() {
    return new Point();
  }
}
