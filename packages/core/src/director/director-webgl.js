import { BaseClass } from "../platform/class";
import { Node } from "../base-nodes/node";
import Matrix4 from "../kazmath/mat4";
import Vec3 from "../kazmath/vec3";
import { KMGLMatrix } from "../kazmath/km-gl-matrix";
import { DirectorRenderer } from "./director-renderer";
import { log, _LogInfos } from "../boot/debugger";

import { ServiceLocator } from "../service-locator";
import { DirectorEvent, DirectorProjection, GLState } from "../enums";

/**
 * OpenGL projection protocol
 */
export class DirectorDelegate extends BaseClass {
  updateProjection() {}
}

function recursiveChild(node) {
  if (node && node._renderCmd) {
    node._renderCmd.setDirtyFlag(Node._dirtyFlags.transformDirty);
    var children = node._children;
    for (var i = 0; i < children.length; i++) {
      recursiveChild(children[i]);
    }
  }
}

export class DirectorWebGLRenderer extends DirectorRenderer {
  constructor(director) {
    super(director);

    director._fpsImage = new Image();
    director._fpsImage.addEventListener("load", () => {
      director._fpsImageLoaded = true;
    });
    if (ServiceLocator.loader._fpsImage) {
      director._fpsImage.src = ServiceLocator.loader._fpsImage;
    }

    ServiceLocator.eventManager.addCustomListener(
      DirectorEvent.PROJECTION_CHANGED,
      () => {
        var stack = this._director._scenesStack;
        for (var i = 0; i < stack.length; i++) recursiveChild(stack[i]);
      }
    );
  }

  setProjection(projection) {
    var director = this._director;
    var size = director._winSizeInPoints;

    this.setViewport();

    var view = director._openGLView,
      ox = view._viewPortRect.x / view._scaleX,
      oy = view._viewPortRect.y / view._scaleY;

    switch (projection) {
      case DirectorProjection.TWO_D:
        ServiceLocator.kmglMatrix.matrixMode(KMGLMatrix.KM_GL_PROJECTION);
        ServiceLocator.kmglMatrix.loadIdentity();
        var orthoMatrix = Matrix4.createOrthographicProjection(
          0,
          size.width,
          0,
          size.height,
          -1024,
          1024
        );
        ServiceLocator.kmglMatrix.multMatrix(orthoMatrix);
        ServiceLocator.kmglMatrix.matrixMode(KMGLMatrix.KM_GL_MODELVIEW);
        ServiceLocator.kmglMatrix.loadIdentity();
        break;
      case DirectorProjection.THREE_D:
        var zeye = this.getZEye();
        var matrixPerspective = new Matrix4(),
          matrixLookup = new Matrix4();
        ServiceLocator.kmglMatrix.matrixMode(KMGLMatrix.KM_GL_PROJECTION);
        ServiceLocator.kmglMatrix.loadIdentity();

        matrixPerspective = Matrix4.createPerspectiveProjection(
          60,
          size.width / size.height,
          0.1,
          zeye * 2
        );

        ServiceLocator.kmglMatrix.multMatrix(matrixPerspective);

        var eye = new Vec3(-ox + size.width / 2, -oy + size.height / 2, zeye);
        var center = new Vec3(-ox + size.width / 2, -oy + size.height / 2, 0.0);
        var up = new Vec3(0.0, 1.0, 0.0);
        matrixLookup.lookAt(eye, center, up);
        ServiceLocator.kmglMatrix.multMatrix(matrixLookup);

        ServiceLocator.kmglMatrix.matrixMode(KMGLMatrix.KM_GL_MODELVIEW);
        ServiceLocator.kmglMatrix.loadIdentity();
        break;
      case DirectorProjection.CUSTOM:
        if (director._projectionDelegate)
          director._projectionDelegate.updateProjection();
        break;
      default:
        log(_LogInfos.Director_setProjection);
        break;
    }
    director._projection = projection;
    ServiceLocator.eventManager.dispatchEvent(director._eventProjectionChanged);
    ServiceLocator.glStateCache.setProjectionMatrixDirty();
    ServiceLocator.sys.rendererConfig.renderer.childrenOrderDirty = true;
  }

  setDepthTest(on) {
    ServiceLocator.sys.rendererConfig.renderer.setDepthTest(on);
  }

  setClearColor(clearColor) {
    ServiceLocator.sys.rendererConfig.renderer._clearColor = clearColor;
  }

  setOpenGLView(openGLView) {
    var director = this._director;
    director._winSizeInPoints.width = ServiceLocator.game.canvas.width;
    director._winSizeInPoints.height = ServiceLocator.game.canvas.height;
    director._openGLView = openGLView || ServiceLocator.eglView;

    var conf = ServiceLocator.sys.configuration;
    conf.gatherGPUInfo();
    conf.dumpInfo();

    this.setGLDefaultValues();

    if (ServiceLocator.eventManager) ServiceLocator.eventManager.enabled = true;
  }

  getVisibleSize() {
    return this._director._openGLView.getVisibleSize();
  }

  getVisibleOrigin() {
    return this._director._openGLView.getVisibleOrigin();
  }

  getZEye() {
    return this._director._winSizeInPoints.height / 1.1546999375;
  }

  setViewport() {
    var view = this._director._openGLView;
    if (view) {
      var locWinSizeInPoints = this._director._winSizeInPoints;
      view.setViewPortInPoints(
        -view._viewPortRect.x / view._scaleX,
        -view._viewPortRect.y / view._scaleY,
        locWinSizeInPoints.width,
        locWinSizeInPoints.height
      );
    }
  }

  setAlphaBlending(on) {
    if (on)
      ServiceLocator.glStateCache.blendFunc(
        GLState.BLEND_SRC,
        GLState.BLEND_DST
      );
    else
      ServiceLocator.glStateCache.blendFunc(
        ServiceLocator.sys.rendererConfig.renderContext.ONE,
        ServiceLocator.sys.rendererConfig.renderContext.ZERO
      );
  }

  setGLDefaultValues() {
    this.setAlphaBlending(true);
    this.setProjection(this._director._projection);
    ServiceLocator.sys.rendererConfig.renderContext.clearColor(
      0.0,
      0.0,
      0.0,
      0.0
    );
  }
}
