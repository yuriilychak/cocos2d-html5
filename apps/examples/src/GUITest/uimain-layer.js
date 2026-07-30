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
    mainNode.anchorX = 0;
    mainNode.anchorY = 0;
    mainNode.scale = scale;
    mainNode.x = (winSize.width - 480 * scale) / 2;
    mainNode.y = (winSize.height - 320 * scale) / 2;;
    this.addChild(mainNode);

    var widget = new Node();
    widget.width = 480;
    widget.height = 320;
    mainNode.addChild(widget, -1);

    var widgetSize = { width: 480, height: 320 };

    var topDisplayText = new Text();
    topDisplayText.string = "";
    topDisplayText.fontName = "Marker Felt";
    topDisplayText.fontSize = 32;
    topDisplayText.anchorX = 0.5;
    topDisplayText.anchorY = -1;
    topDisplayText.x = widgetSize.width / 2.0;
    topDisplayText.y = widgetSize.height / 2.0;;
    mainNode.addChild(topDisplayText);

    var bottomDisplayText = new Text();
    bottomDisplayText.string = "INIT";
    bottomDisplayText.fontName = "Marker Felt";
    bottomDisplayText.fontSize = 30;
    bottomDisplayText.color.color = new Color(159, 168, 176);
    bottomDisplayText.x = widgetSize.width / 2.0;;
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
    let scene = this.parent;
    while (scene && !scene.setTestInfo) {
      scene = scene.parent;
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
    let scene = this.parent;
    while (scene && !scene.setTestInfo) {
      scene = scene.parent;
    }
    if (scene) scene.setTestInfo(title, "");
  }
}
