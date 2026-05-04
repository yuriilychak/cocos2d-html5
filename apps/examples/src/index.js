/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import { TestController } from "./test-controller";
import { _initGlobals } from "./constants";
import { g_resources } from "./resources";
import {
  ContentStrategy,
  ContainerStrategy,
  Director,
  EGLView,
  Game,
  Loader,
  LoaderScene,
  ResolutionPolicy,
  Scene,
  ORIENTATION_LANDSCAPE
} from "@aspect/core";
const projectConfig = {
  debugMode: 1,
  noCache: false,
  showFPS: true,
  frameRate: 60,
  id: "gameCanvas",
  renderMode: 0
};

Game.getInstance().onStart = function () {
  EGLView.getInstance().enableRetina(true);
  EGLView.getInstance().setOrientation(ORIENTATION_LANDSCAPE);
  EGLView.getInstance().setDesignResolutionSize(
    1280,
    720,
    new ResolutionPolicy(
      ContainerStrategy.EQUAL_TO_FRAME,
      ContentStrategy.NO_BORDER
    )
  );
  EGLView.getInstance().resizeWithBrowserSize(true);

  Loader.getInstance().resPath = "res";

  LoaderScene.getInstance().preload(
    g_resources,
    function () {
      _initGlobals();
      if (window.sideIndexBar && typeof sideIndexBar.start === "function") {
        sideIndexBar.start();
      } else {
        var scene = new Scene();
        scene.addChild(new TestController());
        Director.getInstance().runScene(scene);
      }
    },
    this
  );
};
Game.getInstance().run(projectConfig);
