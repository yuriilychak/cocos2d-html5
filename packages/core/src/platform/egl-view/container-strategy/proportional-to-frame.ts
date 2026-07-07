import ContainerStrategy from "./container-strategy";
import { Size } from "../../../geometry";

import type { SizeLike } from "../../../geometry";
import type { EGLViewLike } from "../types";


export default class ProportionalToFrame extends ContainerStrategy {
  #size: Size = new Size();

  preApply(view: EGLViewLike): void {}

  apply(view: EGLViewLike, designedResolution?: SizeLike): void {
    const frameW = view.frameSize.width;
    const frameH = view.frameSize.height;
    const containerStyle = view.container.style;
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
    this.#size.set(frameW - 2 * offx, frameH - 2 * offy);

    view.setupContainer(this.#size);

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
