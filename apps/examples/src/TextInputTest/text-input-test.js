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

/**
 @brief    TextInputTest for retain prev, reset, next, main menu buttons.
 */
import {
  nextTextInputTest,
  previousTextInputTest,
  restartTextInputTest
} from "./text-input-test-helpers";
import { TextInputTestScene } from "./text-input-test-scene";
import { Director, Layer } from "@aspect/core";

export class TextInputTest extends Layer {
  constructor() {
    super();

    this.notificationLayer = null;
    this.init();
  }

  restartCallback(sender) {
    var scene = new TextInputTestScene();
    scene.addChild(restartTextInputTest());
    Director.getInstance().runScene(scene);
  }
  nextCallback(sender) {
    var scene = new TextInputTestScene();
    scene.addChild(nextTextInputTest());
    Director.getInstance().runScene(scene);
  }
  backCallback(sender) {
    var scene = new TextInputTestScene();
    scene.addChild(previousTextInputTest());
    Director.getInstance().runScene(scene);
  }

  title() {
    return "text input test";
  }

  addKeyboardNotificationLayer(layer) {
    this.notificationLayer = layer;
    this.addChild(layer);
  }

  onEnter() {
    super.onEnter();
    let scene = this.getParent();
    while (scene && !scene.setTestInfo) {
      scene = scene.getParent();
    }
    if (scene) {
      scene.setTestInfo(this.title(), this.subtitle ? this.subtitle() : "");
      scene.setNavCallbacks(
        () => this.backCallback(null),
        () => this.restartCallback(null),
        () => this.nextCallback(null)
      );
    }
  }
}
