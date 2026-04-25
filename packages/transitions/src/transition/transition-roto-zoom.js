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

    var rotoZoom = cc.sequence(
      cc.spawn(
        cc.scaleBy(this._duration / 2, 0.001),
        cc.rotateBy(this._duration / 2, 360 * 2)
      ),
      cc.delayTime(this._duration / 2)
    );

    this._outScene.runAction(rotoZoom);
    this._inScene.runAction(
      cc.sequence(rotoZoom.reverse(), cc.callFunc(this.finish, this))
    );
  }
}
