import { ServiceLocator } from "../service-locator";

export class DirectorRenderer {
  constructor(director) {
    this._director = director;
  }

  getProjection() {
    return this._director._projection;
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

  setViewport() {}

  setAlphaBlending(on) {}

  setGLDefaultValues() {}
}
