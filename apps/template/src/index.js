import { Size, ResolutionPolicy, ContainerStrategy, ContentStrategy, LoaderScene, ServiceLocator } from "@aspect/core";
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

const game = ServiceLocator.game;

game.onStart = function () {
  if (!ServiceLocator.sys.isNative && document.getElementById("cocosLoading"))
    document.body.removeChild(document.getElementById("cocosLoading"));

  let designSize = new Size(1280, 720);
  const screenSize = ServiceLocator.eglView.getFrameSize();

  if (!ServiceLocator.sys.isNative && screenSize.height < 800) {
    designSize = new Size(960, 540);
    ServiceLocator.loader.resPath = "res/Normal";
  } else {
    ServiceLocator.loader.resPath = "res/HD";
  }
  ServiceLocator.eglView.setDesignResolutionSize(
    designSize.width,
    designSize.height,
    new ResolutionPolicy(
      ContainerStrategy.EQUAL_TO_FRAME,
      ContentStrategy.NO_BORDER
    )
  );
  ServiceLocator.eglView.resizeWithBrowserSize(true);

  LoaderScene.getInstance().preload(
    g_resources,
    function () {
      ServiceLocator.director.runScene(new MyScene());
    },
    this
  );
};
game.run(projectConfig);
