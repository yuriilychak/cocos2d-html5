import {
  Sys,
  Size,
  EGLView,
  Loader,
  ResolutionPolicy,
  LoaderScene,
  Director,
  Game
} from "@aspect/core";
import { g_resources } from "./resource";
import { MyScene } from "./my-scene";

const projectConfig = {
  debugMode: 1,
  noCache: false,
  showFPS: true,
  frameRate: 60,
  id: "gameCanvas",
  renderMode: 0
};

const game = Game.getInstance();

game.onStart = function () {
  if (!Sys.getInstance().isNative && document.getElementById("cocosLoading"))
    document.body.removeChild(document.getElementById("cocosLoading"));

  let designSize = new Size(480, 800);
  const screenSize = EGLView.getInstance().getFrameSize();

  if (!Sys.getInstance().isNative && screenSize.height < 800) {
    designSize = new Size(320, 480);
    Loader.getInstance().resPath = "res/Normal";
  } else {
    Loader.getInstance().resPath = "res/HD";
  }
  EGLView.getInstance().setDesignResolutionSize(
    designSize.width,
    designSize.height,
    ResolutionPolicy.SHOW_ALL
  );

  LoaderScene.preload(
    g_resources,
    function () {
      Director.getInstance().runScene(new MyScene());
    },
    this
  );
};
game.run(projectConfig);
