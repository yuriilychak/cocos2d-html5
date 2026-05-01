/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

import { BaseTestLayer } from "../../BaseTestLayer/BaseTestLayer";
import { AssetsManagerLoaderScene } from "./assets-manager-loader-scene";
import {
  currentScene,
  sceneManifests,
  _setcurrentScene
} from "./assets-manager-test-constants";
import { Sprite } from "@aspect/core";

export class AssetsManagerTestLayer extends BaseTestLayer {
  constructor(spritePath) {
    super();

    this._background = null;

    this._spritePath = "";
    this._spritePath = spritePath;
    cc.loader.resPath = "res/";
  }

  getTitle() {
    return "AssetsManagerTest";
  }

  onEnter() {
    super.onEnter();
    this._background = new Sprite(this._spritePath);
    this.addChild(this._background, 1);
    this._background.x = cc.winSize.width / 2;
    this._background.y = cc.winSize.height / 2;
  }

  onExit() {
    cc.loader.resPath = "";
    super.onExit();
  }

  onNextCallback() {
    if (currentScene < sceneManifests.length - 1) {
      _setcurrentScene(currentScene + 1);
    } else _setcurrentScene(0);
    var scene = new AssetsManagerLoaderScene();
    scene.runThisTest();
  }

  onBackCallback() {
    if (currentScene > 0) {
      _setcurrentScene(currentScene - 1);
    } else _setcurrentScene(sceneManifests.length - 1);
    var scene = new AssetsManagerLoaderScene();
    scene.runThisTest();
  }
}
