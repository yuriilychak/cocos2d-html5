import { g_resources } from "./resource";
import { MyScene } from "./myApp";

const projectConfig = {
    debugMode: 1,
    noCache: false,
    showFPS: true,
    frameRate: 60,
    id: "gameCanvas",
    renderMode: 0
};

cc.game.onStart = function () {
    if (!cc.sys.isNative && document.getElementById("cocosLoading"))
        document.body.removeChild(document.getElementById("cocosLoading"));

    var designSize = new cc.Size(480, 800);
    var screenSize = cc.view.getFrameSize();

    if (!cc.sys.isNative && screenSize.height < 800) {
        designSize = new cc.Size(320, 480);
        cc.loader.resPath = "res/Normal";
    } else {
        cc.loader.resPath = "res/HD";
    }
    cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);

    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new MyScene());
    }, this);
};
cc.game.run(projectConfig);
