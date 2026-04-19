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
        return this._director._openGLView;
    }

    getZEye() {
        return 0;
    }

    setViewport() {}

    setAlphaBlending(on) {}

    setGLDefaultValues() {}
}
