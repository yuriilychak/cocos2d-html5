import { Scene } from "@aspect/core";
import { MyLayer } from "./my-layer";

export class MyScene extends Scene {
  onEnter() {
    super.onEnter();
    const layer = new MyLayer();
    this.addChild(layer);
    layer.init();
  }
}
