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

import { EffectAdvanceScene } from "./effect-advance-scene";
import { EffectsAdvancedTest } from "./effects-advanced-test-constants";
import {
  backEffectAdvanceAction,
  nextEffectAdvanceAction,
  restartEffectAdvanceAction
} from "./effects-advanced-test-helpers";
import {
  s_back3,
  s_pathSister1,
  s_pathSister2
} from "../resources";
import { winSize } from "../constants";
import {
  Color,
  Director,
  LayerGradient,
  Sprite
} from "@aspect/core";
import { ScaleBy, Sequence } from "@aspect/actions";
import { BaseTestLayer } from "../BaseTestLayer/BaseTestLayer";

import { NodeGrid } from "@aspect/node-grid";
export class EffectAdvanceTextLayer extends BaseTestLayer {
  constructor() {
    super(new Color(0, 0, 0, 255), new Color(98, 99, 117, 255));

    this.rootNode = null;
  }

  onEnter() {
    super.onEnter();

    // back gradient
    this.rootNode = new LayerGradient(
      new Color(0, 0, 0, 255),
      new Color(98, 99, 117, 255)
    );
    var nodeGrid = new NodeGrid();
    nodeGrid.addChild(this.rootNode);
    this.addChild(nodeGrid, 0, EffectsAdvancedTest.TAG_BACKGROUND);

    var bg = new Sprite(s_back3);
    this.rootNode.addChild(bg);
    bg.x = winSize.width / 2;
    bg.y = winSize.height / 2;

    var grossini = new Sprite(s_pathSister2);
    var grossiniGrid = new NodeGrid();
    grossiniGrid.addChild(grossini);
    this.rootNode.addChild(grossiniGrid, 1, EffectsAdvancedTest.TAG_SPRITE1);
    grossini.x = winSize.width / 3;
    grossini.y = winSize.height / 2;
    var sc = new ScaleBy(2, 5);
    var sc_back = sc.reverse();
    grossini.runAction(new Sequence(sc, sc_back).repeatForever());

    var tamara = new Sprite(s_pathSister1);
    var tamaraGrid = new NodeGrid();
    tamaraGrid.addChild(tamara);
    this.rootNode.addChild(tamaraGrid, 1, EffectsAdvancedTest.TAG_SPRITE2);
    tamara.x = (winSize.width * 2) / 3;
    tamara.y = winSize.height / 2;
    var sc2 = new ScaleBy(2, 5);
    var sc2_back = sc2.reverse();
    tamara.runAction(new Sequence(sc2, sc2_back).repeatForever());
  }

  title() {
    return "No title";
  }

  subtitle() {
    return "";
  }

  onRestartCallback() {
    var scene = new EffectAdvanceScene();
    scene.addChild(restartEffectAdvanceAction());
    Director.getInstance().runScene(scene);
  }

  onNextCallback() {
    var scene = new EffectAdvanceScene();
    scene.addChild(nextEffectAdvanceAction());
    Director.getInstance().runScene(scene);
  }

  onBackCallback() {
    var scene = new EffectAdvanceScene();
    scene.addChild(backEffectAdvanceAction());
    Director.getInstance().runScene(scene);
  }
}
