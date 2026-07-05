import { ServiceLocator } from "../../../service-locator";
import ContainerStrategy from "./container-strategy";

import type { SizeLike } from "../../../geometry/types";
import type { EGLViewLike } from "../types";


export default class ProportionalToFrame extends ContainerStrategy {
  preApply(view: EGLViewLike): void {}

  apply(view: EGLViewLike, designedResolution?: SizeLike): void {
    const frameW = view.frameSize.width;
    const frameH = view.frameSize.height;
    const containerStyle = (ServiceLocator.game.container as HTMLElement).style;
    const designW = designedResolution!.width;
    const designH = designedResolution!.height;
    const scaleX = frameW / designW;
    const scaleY = frameH / designH;
    let containerW: number;
    let containerH: number;

    if (scaleX < scaleY) {
      containerW = frameW;
      containerH = designH * scaleX;
    } else {
      containerW = designW * scaleY;
      containerH = frameH;
    }

    // Adjust container size with integer value
    const offx = Math.round((frameW - containerW) / 2);
    const offy = Math.round((frameH - containerH) / 2);
    containerW = frameW - 2 * offx;
    containerH = frameH - 2 * offy;

    this.setupContainer(view, containerW, containerH);

    // Setup container's margin and padding
    if (view.rotated) {
      containerStyle.margin = `0 0 0 ${frameH}px`;
    } else {
      containerStyle.margin = "0px";
    }

    containerStyle.paddingLeft = `${offx}px`;
    containerStyle.paddingRight = `${offx}px`;
    containerStyle.paddingTop = `${offy}px`;
    containerStyle.paddingBottom = `${offy}px`;
  }

  postApply(view: EGLViewLike): void {}
}
