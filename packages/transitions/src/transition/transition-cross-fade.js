import { Director, LayerColor, Color } from "@aspect/core";
import { RenderTexture } from "@aspect/render-texture";
import { SCENE_FADE } from "./constants";
import { TransitionScene } from "./transition-scene";

export class TransitionCrossFade extends TransitionScene {
  constructor(t, scene) {
    super();
    scene && this.initWithDuration(t, scene);
  }

  onEnter() {
    super.onEnter();

    var color = new Color(0, 0, 0, 0);
    var winSize = Director.getInstance().getWinSize();
    var layer = new LayerColor(color);

    var inTexture = new RenderTexture(winSize.width, winSize.height);
    inTexture.sprite.anchorX = 0.5;
    inTexture.sprite.anchorY = 0.5;
    inTexture.attr({
      x: winSize.width / 2,
      y: winSize.height / 2,
      anchorX: 0.5,
      anchorY: 0.5
    });

    inTexture.begin();
    this._inScene.visit();
    inTexture.end();

    var outTexture = new RenderTexture(winSize.width, winSize.height);
    outTexture.setPosition(winSize.width / 2, winSize.height / 2);
    outTexture.sprite.anchorX = outTexture.anchorX = 0.5;
    outTexture.sprite.anchorY = outTexture.anchorY = 0.5;

    outTexture.begin();
    this._outScene.visit();
    outTexture.end();

    inTexture.sprite.setBlendFunc(cc.ONE, cc.ONE);
    outTexture.sprite.setBlendFunc(cc.SRC_ALPHA, cc.ONE_MINUS_SRC_ALPHA);

    layer.addChild(inTexture);
    layer.addChild(outTexture);

    inTexture.sprite.opacity = 255;
    outTexture.sprite.opacity = 255;

    var layerAction = cc.sequence(
      cc.fadeTo(this._duration, 0),
      cc.callFunc(this.hideOutShowIn, this),
      cc.callFunc(this.finish, this)
    );

    outTexture.sprite.runAction(layerAction);

    this.addChild(layer, 2, SCENE_FADE);
  }

  onExit() {
    this.removeChildByTag(SCENE_FADE, false);
    super.onExit();
  }
}
