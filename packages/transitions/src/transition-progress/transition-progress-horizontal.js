import { Director, RendererConfig, Point } from "@aspect/core";
import { ProgressTimer } from "@aspect/progress-timer";
import { TransitionProgress } from "./transition-progress";

export class TransitionProgressHorizontal extends TransitionProgress {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  _progressTimerNodeWithRenderTexture(texture) {
    var size = Director.getInstance().getWinSize();

    var pNode = new ProgressTimer(texture.sprite);
    if (RendererConfig.getInstance().isWebGL)
      pNode.sprite.flippedY = true;
    pNode.type = ProgressTimer.TYPE_BAR;
    pNode.midPoint = new Point(1, 0);
    pNode.barChangeRate = new Point(1, 0);
    pNode.percentage = 100;
    this._setAttrs(pNode, size.width / 2, size.height / 2);

    return pNode;
  }
}
