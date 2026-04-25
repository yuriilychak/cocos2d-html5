import { LayerColor, Color } from "@aspect/core";
import { sequence, FadeIn, FadeOut, CallFunc } from "@aspect/actions";
import { SCENE_FADE } from "./constants";
import { TransitionScene } from "./transition-scene";

export class TransitionFade extends TransitionScene {
  _color = null;

  constructor(t, scene, color) {
    super();
    this._color = new Color();
    scene && this.initWithDuration(t, scene, color);
  }

  onEnter() {
    super.onEnter();

    var l = new LayerColor(this._color);
    this._inScene.visible = false;

    this.addChild(l, 2, SCENE_FADE);
    var f = this.getChildByTag(SCENE_FADE);

    var a = sequence(
      new FadeIn(this._duration / 2),
      new CallFunc(this.hideOutShowIn, this),
      new FadeOut(this._duration / 2),
      new CallFunc(this.finish, this)
    );
    f.runAction(a);
  }

  onExit() {
    super.onExit();
    this.removeChildByTag(SCENE_FADE, false);
  }

  initWithDuration(t, scene, color) {
    color = color || Color.BLACK;
    if (super.initWithDuration(t, scene)) {
      this._color.r = color.r;
      this._color.g = color.g;
      this._color.b = color.b;
      this._color.a = 0;
    }
    return true;
  }
}
