import { BaseClass } from "../platform/class";
import { Node } from "../base-nodes/node";
import { DirectorRenderer } from "./director-renderer";
import { ServiceLocator } from "../service-locator";
import { DirectorEvent, GLState } from "../enums";
import { EventCustom } from '../event-manager';

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
    ServiceLocator.eglView.setViewport();
    ServiceLocator.kmglMatrix.setDirectorProjection(
      projection,
      ServiceLocator.eglView
    );
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
    ServiceLocator.sys.configuration.gatherGPUInfo();
    ServiceLocator.sys.configuration.dumpInfo();

    this.setGLDefaultValues();

    if (ServiceLocator.eventManager) {
      ServiceLocator.eventManager.enabled = true;
    }
  }

  getVisibleSize() {
    return ServiceLocator.eglView.visibleSize;
  }

  getVisibleOrigin() {
    return ServiceLocator.eglView.visibleOrigin;
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
