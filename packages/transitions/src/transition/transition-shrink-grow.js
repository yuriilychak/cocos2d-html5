import { EaseOut } from "@aspect/actions";
import { TransitionScene } from "./transition-scene";

export class TransitionShrinkGrow extends TransitionScene {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  onEnter() {
    super.onEnter();

    this._inScene.attr({
      scale: 0.001,
      anchorX: 2 / 3.0,
      anchorY: 0.5
    });
    this._outScene.attr({
      scale: 1.0,
      anchorX: 1 / 3.0,
      anchorY: 0.5
    });

    var scaleOut = cc.scaleTo(this._duration, 0.01);
    var scaleIn = cc.scaleTo(this._duration, 1.0);

    this._inScene.runAction(
      cc.sequence(
        this.easeActionWithAction(scaleIn),
        cc.callFunc(this.finish, this)
      )
    );
    this._outScene.runAction(this.easeActionWithAction(scaleOut));
  }

  easeActionWithAction(action) {
    return new EaseOut(action, 2.0);
  }
}
