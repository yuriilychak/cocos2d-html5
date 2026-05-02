import { Sequence, Spawn, ScaleBy, RotateBy, DelayTime, CallFunc } from "@aspect/actions";
import { TransitionScene } from "./transition-scene";

export class TransitionRotoZoom extends TransitionScene {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  onEnter() {
    super.onEnter();

    this._inScene.attr({
      scale: 0.001,
      anchorX: 0.5,
      anchorY: 0.5
    });
    this._outScene.attr({
      scale: 1.0,
      anchorX: 0.5,
      anchorY: 0.5
    });

    var rotoZoom = new Sequence(
      new Spawn(
        new ScaleBy(this._duration / 2, 0.001),
        new RotateBy(this._duration / 2, 360 * 2)
      ),
      new DelayTime(this._duration / 2)
    );

    this._outScene.runAction(rotoZoom);
    this._inScene.runAction(
      new Sequence(rotoZoom.reverse(), new CallFunc(this.finish, this))
    );
  }
}
