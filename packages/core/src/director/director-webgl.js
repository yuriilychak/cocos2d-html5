import { BaseClass } from "../platform/class";
import { Node } from "../base-nodes/node";
import Matrix4 from "../kazmath/mat4";
import Vec3 from "../kazmath/vec3";
import { KMGLMatrix } from "../kazmath/km-gl-matrix";
import { DirectorRenderer } from "./director-renderer";
import { log, _LogInfos } from "../boot/debugger";
import { ServiceLocator } from "../service-locator";
import { DirectorEvent, DirectorProjection, GLState } from "../enums";
import { EventCustom } from '../event-manager';

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
    var size = ServiceLocator.eglView.winSizeInPoints;

    ServiceLocator.eglView.setViewport();

    var view = ServiceLocator.eglView,
      viewPortRect = view.viewPortRect,
      ox = viewPortRect.x / view.scaleX,
      oy = viewPortRect.y / view.scaleY;

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
    ServiceLocator.eglView.projection = projection;
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
    ServiceLocator.eglView.winSizeInPoints = ServiceLocator.eglView.canvas;

    var conf = ServiceLocator.sys.configuration;
    conf.gatherGPUInfo();
    conf.dumpInfo();

    this.setGLDefaultValues();

    if (ServiceLocator.eventManager) ServiceLocator.eventManager.enabled = true;
  }

  getVisibleSize() {
    return ServiceLocator.eglView.visibleSize;
  }

  getVisibleOrigin() {
    return ServiceLocator.eglView.visibleOrigin;
  }

  getZEye() {
    return ServiceLocator.eglView.zEye;
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
    this.setProjection(ServiceLocator.eglView.projection);
    ServiceLocator.sys.rendererConfig.renderContext.clearColor(
      0.0,
      0.0,
      0.0,
      0.0
    );
  }
}
