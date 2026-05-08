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

import { SceneTestLayer3 } from "./scene-test-layer3";
import { TestScene } from "../test-scene";
import { s_pathGrossini } from "../resources";
import { director } from "../constants";
import { Sprite } from "@aspect/core";
import { RotateBy } from "@aspect/actions";
import { TransitionSlideInT } from "@aspect/transitions";
import { MenuTestLayer } from "../menu-test-layer";

const MENU_ITEMS = [
  { title: "runScene" },
  { title: "runScene w/transition" },
  { title: "Go Back" }
];

export class SceneTestLayer2 extends MenuTestLayer {
  constructor() {
    super(MENU_ITEMS);

    const s = director.getWinSize();
    const sprite = new Sprite(s_pathGrossini);
    this.addChild(sprite);
    sprite.x = s.width - 40;
    sprite.y = s.height / 2;
    sprite.runAction(new RotateBy(2, 360).repeatForever());
  }

  onItemCallback(idx) {
    switch (idx) {
      case 0: this._runScene(); break;
      case 1: this._runSceneTran(); break;
      case 2: director.popScene(); break;
    }
  }

  _runScene() {
    const scene = new TestScene("Scene Test");
    scene.addChild(new SceneTestLayer3(), 0);
    director.runScene(scene);
  }

  _runSceneTran() {
    const scene = new TestScene("Scene Test");
    scene.addChild(new SceneTestLayer3(), 0);
    director.runScene(new TransitionSlideInT(2, scene));
  }
}
