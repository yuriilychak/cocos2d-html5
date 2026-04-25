import { Director, Point } from "@aspect/core";
import { sequence, JumpBy, ScaleTo, DelayTime, CallFunc } from "@aspect/actions";
import { TransitionScene } from "./transition-scene";

export class TransitionJumpZoom extends TransitionScene {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  onEnter() {
    super.onEnter();
    var winSize = Director.getInstance().getWinSize();

    this._inScene.attr({
      scale: 0.5,
      x: winSize.width,
      y: 0,
      anchorX: 0.5,
      anchorY: 0.5
    });
    this._outScene.anchorX = 0.5;
    this._outScene.anchorY = 0.5;

    var jump = new JumpBy(
      this._duration / 4,
      new Point(-winSize.width, 0),
      winSize.width / 4,
      2
    );
    var scaleIn = new ScaleTo(this._duration / 4, 1.0);
    var scaleOut = new ScaleTo(this._duration / 4, 0.5);

    var jumpZoomOut = sequence(scaleOut, jump);
    var jumpZoomIn = sequence(jump, scaleIn);

    var delay = new DelayTime(this._duration / 2);
    this._outScene.runAction(jumpZoomOut);
    this._inScene.runAction(
      sequence(delay, jumpZoomIn, new CallFunc(this.finish, this))
    );
  }
}
