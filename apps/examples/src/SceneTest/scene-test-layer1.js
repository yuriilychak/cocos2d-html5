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

import { SceneTestLayer2 } from "./scene-test-layer2";
import { TestScene } from "../test-scene";
import { s_pathGrossini } from "../resources";
import { director, winSize } from "../constants";
import { Color, LayerColor, Point, Sprite, log, ServiceLocator } from "@aspect/core";
import { RotateBy } from "@aspect/actions";
import { TransitionSlideInT } from "@aspect/transitions";
import { MenuTestLayer } from "../menu-test-layer";

const MENU_ITEMS = [
  { title: "Test pushScene" },
  { title: "Test pushScene w/transition" },
  { title: "Quit" },
  { title: "setNotificationNode" },
  { title: "clearNotificationNode" }
];

export class SceneTestLayer1 extends MenuTestLayer {
  constructor() {
    super(MENU_ITEMS);

    const s = director.getWinSize();
    const sprite = new Sprite(s_pathGrossini);
    this.addChild(sprite);
    sprite.x = s.width - 40;
    sprite.y = s.height / 2;
    sprite.runAction(new RotateBy(2, 360).repeatForever());
  }

  onEnter() {
    log("SceneTestLayer1#onEnter");
    super.onEnter();
  }

  onEnterTransitionDidFinish() {
    log("SceneTestLayer1#onEnterTransitionDidFinish");
    super.onEnterTransitionDidFinish();
  }

  onItemCallback(idx) {
    switch (idx) {
      case 0: this._onPushScene(); break;
      case 1: this._onPushSceneTran(); break;
      case 2: log("quit!"); break;
      case 3: this._onSetNotificationNode(); break;
      case 4: this._onClearNotificationNode(); break;
    }
  }

  _onPushScene() {
    const scene = new TestScene("Scene Test");
    scene.addChild(new SceneTestLayer2(), 0);
    director.pushScene(scene);
  }

  _onPushSceneTran() {
    const scene = new TestScene("Scene Test");
    scene.addChild(new SceneTestLayer2(), 0);
    director.pushScene(new TransitionSlideInT(1, scene));
  }

  _onSetNotificationNode() {
    const layerTemp = new LayerColor(new Color(0, 255, 255, 120));
    const sprite = new Sprite(s_pathGrossini);
    sprite.setPosition(new Point(winSize.width / 2, winSize.height / 2));
    layerTemp.addChild(sprite);
    ServiceLocator.director.setNotificationNode(layerTemp);
    sprite.runAction(new RotateBy(2, 360).repeatForever());
    log("setNotificationNode!");
  }

  _onClearNotificationNode() {
    log("clearNotificationNode!");
    ServiceLocator.director.setNotificationNode(null);
  }

  onExit() {
    ServiceLocator.director.setNotificationNode(null);
    super.onExit();
  }
}
