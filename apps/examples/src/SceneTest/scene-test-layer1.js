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
import { s_pathGrossini } from "../resources";
import { director, winSize } from "../constants";
import { Color, Layer, Point } from "@aspect/core";
import { RotateBy } from "@aspect/actions";

export class SceneTestLayer1 extends Layer {
  constructor() {
    //----start0----Scene1-ctor
    super();
    this.init();

    var s = director.getWinSize();
    var item1 = new cc.MenuItemFont("Test pushScene", this.onPushScene, this);
    var item2 = new cc.MenuItemFont(
      "Test pushScene w/transition",
      this.onPushSceneTran,
      this
    );
    var item3 = new cc.MenuItemFont(
      "Quit",
      function () {
        cc.log("quit!");
      },
      this
    );
    var item4 = new cc.MenuItemFont(
      "setNotificationNode",
      function () {
        var layerTemp = new cc.LayerColor(new Color(0, 255, 255, 120));
        var sprite = new cc.Sprite(s_pathGrossini);
        sprite.setPosition(new Point(winSize.width / 2, winSize.height / 2));
        layerTemp.addChild(sprite);
        cc.director.setNotificationNode(layerTemp);
        var rotation = new RotateBy(2, 360);
        sprite.runAction(rotation.repeatForever());
        cc.log("setNotificationNode!");
      },
      this
    );
    var item5 = new cc.MenuItemFont(
      "clearNotificationNode",
      function () {
        cc.log("clearNotificationNode!");
        cc.director.setNotificationNode(null);
      },
      this
    );

    var menu = new cc.Menu(item1, item2, item3, item4, item5);
    menu.alignItemsVertically();
    this.addChild(menu);

    var sprite = new cc.Sprite(s_pathGrossini);
    this.addChild(sprite);
    sprite.x = s.width - 40;
    sprite.y = s.height / 2;
    var rotate = new RotateBy(2, 360);
    var repeat = rotate.repeatForever();
    sprite.runAction(repeat);
    //----end0----

    //cc.schedule(this.testDealloc);
  }

  onEnter() {
    cc.log("SceneTestLayer1#onEnter");
    super.onEnter();
  }

  onEnterTransitionDidFinish() {
    cc.log("SceneTestLayer1#onEnterTransitionDidFinish");
    super.onEnterTransitionDidFinish();
  }

  testDealloc(dt) {
    //cc.log("SceneTestLayer1:testDealloc");
  }

  onPushScene(sender) {
    var scene = new SceneTestScene();
    var layer = new SceneTestLayer2();
    scene.addChild(layer, 0);
    director.pushScene(scene);
  }

  onPushSceneTran(sender) {
    var scene = new SceneTestScene();
    var layer = new SceneTestLayer2();
    scene.addChild(layer, 0);

    director.pushScene(new cc.TransitionSlideInT(1, scene));
  }
  onExit(sender) {
    cc.director.setNotificationNode(null);
    super.onExit();
  }

  //CREATE_NODE(SceneTestLayer1);
}
