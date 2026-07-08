import { ServiceLocator } from "../service-locator";

export class DirectorRenderer {
  constructor(director) {
    this._director = director;
  }

  getProjection() {
    return ServiceLocator.eglView.projection;
  }

  setProjection(projection) {}

  setDepthTest(on) {}

  setClearColor(clearColor) {}

  setOpenGLView(openGLView) {}

  getVisibleSize() {}

  getVisibleOrigin() {}

  getOpenGLView() {
    return ServiceLocator.eglView;
  }

  getZEye() {
    return 0;
  }

  setAlphaBlending(on) {}

  setGLDefaultValues() {}
}
