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

import {
  SPRITE_GROSSINI_TAG,
  SPRITE_KATHIA_TAG,
  SPRITE_TAMARA_TAG,
  actionsTestIdx
} from "./actions-test-constants";
import {
  arrayOfActionsTest,
  nextActionsTest,
  previousActionsTest,
  restartActionsTest
} from "./actions-test-helpers";
import { ActionsTestScene } from "./actions-test-scene";
import { BaseTestLayer } from "../BaseTestLayer/BaseTestLayer";
import { s_pathGrossini, s_pathSister1, s_pathSister2 } from "../resources";
import { director } from "../constants";
import { Color } from "@aspect/core";

export class ActionsDemo extends BaseTestLayer {
  constructor() {
    super(new Color(0, 0, 0, 255), new Color(98, 99, 117, 255));

    this._grossini = null;

    this._tamara = null;

    this._kathia = null;

    this._grossini = new cc.Sprite(s_pathGrossini);
    this._tamara = new cc.Sprite(s_pathSister1);
    this._kathia = new cc.Sprite(s_pathSister2);
    this.addChild(this._grossini, SPRITE_GROSSINI_TAG);
    this.addChild(this._tamara, SPRITE_TAMARA_TAG);
    this.addChild(this._kathia, SPRITE_KATHIA_TAG);
    var s = director.getWinSize();
    this._grossini.x = s.width / 2;
    this._grossini.y = s.height / 3;
    this._tamara.x = s.width / 2;
    this._tamara.y = (2 * s.height) / 3;
    this._kathia.x = s.width / 2;
    this._kathia.y = s.height / 2;
  }

  centerSprites(numberOfSprites) {
    var winSize = director.getWinSize();

    if (numberOfSprites === 0) {
      this._tamara.visible = false;
      this._kathia.visible = false;
      this._grossini.visible = false;
    } else if (numberOfSprites == 1) {
      this._tamara.visible = false;
      this._kathia.visible = false;
      this._grossini.x = winSize.width / 2;
      this._grossini.y = winSize.height / 2;
    } else if (numberOfSprites == 2) {
      this._kathia.x = winSize.width / 3;
      this._kathia.y = winSize.height / 2;
      this._tamara.x = (2 * winSize.width) / 3;
      this._tamara.y = winSize.height / 2;
      this._grossini.visible = false;
    } else if (numberOfSprites == 3) {
      this._grossini.x = winSize.width / 2;
      this._grossini.y = winSize.height / 2;
      this._tamara.x = winSize.width / 4;
      this._tamara.y = winSize.height / 2;
      this._kathia.x = (3 * winSize.width) / 4;
      this._kathia.y = winSize.height / 2;
    }
  }
  alignSpritesLeft(numberOfSprites) {
    //----start47----onEnter
    var s = director.getWinSize();

    if (numberOfSprites == 1) {
      this._tamara.visible = false;
      this._kathia.visible = false;
      this._grossini.x = 60;
      this._grossini.y = s.height / 2;
    } else if (numberOfSprites == 2) {
      this._kathia.x = 60;
      this._kathia.y = s.height / 3;
      this._tamara.x = 60;
      this._tamara.y = (2 * s.height) / 3;
      this._grossini.visible = false;
    } else if (numberOfSprites == 3) {
      this._grossini.x = 60;
      this._grossini.y = s.height / 2;
      this._tamara.x = 60;
      this._tamara.y = (2 * s.height) / 3;
      this._kathia.x = 60;
      this._kathia.y = s.height / 3;
    }
    //----end47----
  }
  title() {
    return "ActionsTest";
  }
  subtitle() {
    return "";
  }
  onBackCallback(sender) {
    var s = new ActionsTestScene();
    s.addChild(previousActionsTest());
    director.runScene(s);
  }
  onRestartCallback(sender) {
    var s = new ActionsTestScene();
    s.addChild(restartActionsTest());
    director.runScene(s);
  }
  onNextCallback(sender) {
    var s = new ActionsTestScene();
    s.addChild(nextActionsTest());
    director.runScene(s);
  }
  numberOfPendingTests() {
    return arrayOfActionsTest.length - 1 - actionsTestIdx;
  }

  getTestNumber() {
    return actionsTestIdx;
  }
}
