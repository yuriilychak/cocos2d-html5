import { Director } from "@aspect/core";
import { RenderTexture } from "@aspect/render-texture";
import { ProgressFromTo } from "@aspect/progress-timer";
import { TransitionScene } from "../transition/transition-scene";
import { SCENE_RADIAL } from "./constants";

export class TransitionProgress extends TransitionScene {
  _to = 0;
  _from = 0;
  _sceneToBeModified = null;
  _className = "TransitionProgress";

  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  _setAttrs(node, x, y) {
    node.attr({
      x: x,
      y: y,
      anchorX: 0.5,
      anchorY: 0.5
    });
  }

  onEnter() {
    super.onEnter();
    this._setupTransition();

    var winSize = Director.getInstance().getWinSize();

    var texture = new RenderTexture(winSize.width, winSize.height);
    texture.sprite.anchorX = 0.5;
    texture.sprite.anchorY = 0.5;
    this._setAttrs(texture, winSize.width / 2, winSize.height / 2);

    texture.clear(0, 0, 0, 1);
    texture.begin();
    this._sceneToBeModified.visit();
    texture.end();

    if (this._sceneToBeModified === this._outScene)
      this.hideOutShowIn();

    var pNode = this._progressTimerNodeWithRenderTexture(texture);

    var layerAction = cc.sequence(
      new ProgressFromTo(this._duration, this._from, this._to),
      cc.callFunc(this.finish, this));
    pNode.runAction(layerAction);

    this.addChild(pNode, 2, SCENE_RADIAL);
  }

  onExit() {
    this.removeChildByTag(SCENE_RADIAL, true);
    super.onExit();
  }

  _setupTransition() {
    this._sceneToBeModified = this._outScene;
    this._from = 100;
    this._to = 0;
  }

  _progressTimerNodeWithRenderTexture(texture) {
    cc.log("cc.TransitionProgress._progressTimerNodeWithRenderTexture(): should be overridden in subclass");
    return null;
  }

  _sceneOrder() {
    this._isInSceneOnTop = false;
  }
}
