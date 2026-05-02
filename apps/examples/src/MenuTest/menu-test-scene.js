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

import { MenuBugsTest } from "./menu-bugs-test";
import { MenuLayerMainMenu } from "./menu-layer-main-menu";
import { MenuLayer2 } from "./menu-layer2";
import { MenuLayer3 } from "./menu-layer3";
import { MenuLayer4 } from "./menu-layer4";
import { RemoveMenuItemWhenMove } from "./remove-menu-item-when-move";
import { TestScene } from "../test-scene";
import { director } from "../constants";
import { LayerMultiplex } from "@aspect/core";

export class MenuTestScene extends TestScene {
  runThisTest() {
    var layer1 = new MenuLayerMainMenu();
    var layer2 = new MenuLayer2();
    var layer3 = new MenuLayer3();
    var layer4 = new MenuLayer4();
    var layer5 = new MenuBugsTest();
    var layer6 = new RemoveMenuItemWhenMove();

    var layer = new LayerMultiplex(
      layer1,
      layer2,
      layer3,
      layer4,
      layer5,
      layer6
    );
    this.addChild(layer, 0);

    director.runScene(this);
  }
}
