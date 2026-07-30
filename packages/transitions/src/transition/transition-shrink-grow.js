import { EaseOut, Sequence, ScaleTo, CallFunc } from "@aspect/actions";
import { TransitionScene } from "./transition-scene";

export class TransitionShrinkGrow extends TransitionScene {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  onEnter() {
    super.onEnter();

    this._inScene.scale = 0.001;
    this._inScene.anchorX = 2 / 3.0;
    this._inScene.anchorY = 0.5;;
    this._outScene.scale = 1.0;
    this._outScene.anchorX = 1 / 3.0;
    this._outScene.anchorY = 0.5;;

    var scaleOut = new ScaleTo(this._duration, 0.01);
    var scaleIn = new ScaleTo(this._duration, 1.0);

    this._inScene.actionManager.runAction(
      new Sequence(
        this.easeActionWithAction(scaleIn),
        new CallFunc(this.finish, this)
      )
    );
    this._outScene.actionManager.runAction(this.easeActionWithAction(scaleOut));
  }

  easeActionWithAction(action) {
    return new EaseOut(action, 2.0);
  }
}
