import { UISceneManager, GUITestScene } from "./UISceneManager";
import { Color, Layer, Node, ServiceLocator } from "@aspect/core";
import { Text } from "@aspect/ccui";
import { winSize } from "../constants";

export class UIMainLayer extends Layer {
  constructor() {
    super();

    this._widget = null;
    this._sceneTitle = null;
    this._topDisplayLabel = null;
    this._bottomDisplayLabel = null;
    this._mainNode = null;
    this._title = "";
  }

  init() {
    super.init();

    var mainNode = new Node();
    var scale = winSize.height / 320;
    mainNode.attr({
      anchorX: 0,
      anchorY: 0,
      scale: scale,
      x: (winSize.width - 480 * scale) / 2,
      y: (winSize.height - 320 * scale) / 2
    });
    this.addChild(mainNode);

    var widget = new Node();
    widget.setContentSize(480, 320);
    mainNode.addChild(widget, -1);

    var widgetSize = { width: 480, height: 320 };

    var topDisplayText = new Text();
    topDisplayText.attr({
      string: "",
      fontName: "Marker Felt",
      fontSize: 32,
      anchorX: 0.5,
      anchorY: -1,
      x: widgetSize.width / 2.0,
      y: widgetSize.height / 2.0
    });
    mainNode.addChild(topDisplayText);

    var bottomDisplayText = new Text();
    bottomDisplayText.attr({
      string: "INIT",
      fontName: "Marker Felt",
      fontSize: 30,
      color: new Color(159, 168, 176),
      x: widgetSize.width / 2.0
    });
    bottomDisplayText.y =
      widgetSize.height / 2.0 - bottomDisplayText.height * 1.75;
    mainNode.addChild(bottomDisplayText);

    this._topDisplayLabel = topDisplayText;
    this._bottomDisplayLabel = bottomDisplayText;
    this._mainNode = mainNode;
    this._widget = widget;
    return true;
  }

  onEnter() {
    super.onEnter();
    let scene = this.getParent();
    while (scene && !scene.setTestInfo) {
      scene = scene.getParent();
    }
    if (scene) {
      scene.setTestInfo(this._title || "", "");
      scene.setNavCallbacks(
        () => ServiceLocator.director.runScene(UISceneManager.getInstance().previousUIScene()),
        () => ServiceLocator.director.runScene(UISceneManager.getInstance().currentUIScene()),
        () => ServiceLocator.director.runScene(UISceneManager.getInstance().nextUIScene())
      );
      scene.onMainMenuCallback = () => {
        UISceneManager.purge();
        GUITestScene.prototype.runThisTest();
      };
    }
  }

  setSceneTitle(title) {
    this._title = title;
    let scene = this.getParent();
    while (scene && !scene.setTestInfo) {
      scene = scene.getParent();
    }
    if (scene) scene.setTestInfo(title, "");
  }
}
