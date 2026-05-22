/****************************************************************************
 Copyright (c) 2014-2016 Chukong Technologies Inc.
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

import { ExtensionsTestScene } from "../extensions-test-scene";
import { pluginXSceneManager } from "./PluginXTestsManager";
import { s_extensions_background, s_extensions_ribbon, s_simpleFont_fnt } from "../../resources";
import { Color, Director, Layer, Rect, Sprite } from "@aspect/core";
import { Scale9Sprite, TextBMFont } from "@aspect/ccui";
import { ButtonLayout } from "../../button-layout";
import { winSize } from "../../constants";

export class PluginXTest extends Layer {
  getSceneTitleLabel() {
    return this._sceneTitleLabel;
  }
  setSceneTitleLabel(sceneTitleLabel) {
    this._sceneTitleLabel = sceneTitleLabel;
  }

  constructor(title) {
    super();

    this._sceneTitleLabel = null;
    var screensize = winSize;

    // Add the generated background
    var background = new Sprite(s_extensions_background);
    background.x = screensize.width / 2;
    background.y = screensize.height / 2;
    var bgRect = background.getTextureRect();
    background.scaleX = screensize.width / bgRect.width;
    background.scaleY = screensize.height / bgRect.height;
    this.addChild(background);

    // Add the ribbon
    var ribbon = new Scale9Sprite(
      s_extensions_ribbon,
      new Rect(1, 1, 48, 55)
    );
    ribbon.width = screensize.width;
    ribbon.height = 57;
    ribbon.x = screensize.width / 2.0;
    ribbon.y = screensize.height - ribbon.height / 2.0;
    this.addChild(ribbon);

    // Add the title
    this.setSceneTitleLabel(new TextBMFont(title || "Title", s_simpleFont_fnt));
    this._sceneTitleLabel.x = screensize.width / 2;
    this._sceneTitleLabel.y =
      screensize.height - this._sceneTitleLabel.height / 2 - 5;
    this.addChild(this._sceneTitleLabel, 1);

    this.addChild(new ButtonLayout(
      [
        { label: "Previous", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Restart", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Next", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
        { label: "Back", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) }
      ],
      140, "Actions",
      (i) => {
        switch (i) {
          case 0: this.previousCallback(); break;
          case 1: this.restartCallback(); break;
          case 2: this.nextCallback(); break;
          case 3: this.toExtensionsMainLayer(); break;
        }
      }
    ), 1);
  }

  toExtensionsMainLayer(sender) {
    var pScene = new ExtensionsTestScene();
    pScene.runThisTest();
  }

  previousCallback(sender) {
    Director.getInstance().runScene(pluginXSceneManager.previousPluginXScene());
  }
  restartCallback(sender) {
    Director.getInstance().runScene(pluginXSceneManager.currentPluginXScene());
  }
  nextCallback(sender) {
    Director.getInstance().runScene(pluginXSceneManager.nextPluginXScene());
  }
}
