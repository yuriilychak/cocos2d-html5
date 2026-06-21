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

import { s_pathGrossini, s_simpleFont_fnt } from "../resources";
import { director } from "../constants";
import { Color, EventListener, EventListenerType, LayerColor, Sprite, ServiceLocator } from "@aspect/core";
import { RotateBy } from "@aspect/actions";
import { TextBMFont } from "@aspect/ccui";

export class SceneTestLayer3 extends LayerColor {
  constructor() {
    //----start0----Scene3-ctor
    super();
    this.init(new Color(0, 128, 255, 255));

    var label = new TextBMFont("Touch to popScene", s_simpleFont_fnt);
    this.addChild(label);
    var s = director.getWinSize();
    label.x = s.width / 2;
    label.y = s.height / 2;

    var sprite = new Sprite(s_pathGrossini);
    this.addChild(sprite);

    sprite.x = s.width - 40;

    sprite.y = s.height / 2;
    var rotate = new RotateBy(2, 360);
    var repeat = rotate.repeatForever();
    sprite.runAction(repeat);
    //----end0----
  }

  onEnterTransitionDidFinish() {
    if ("touches" in ServiceLocator.sys.capabilities) {
      ServiceLocator.eventManager.addListener(
        {
          event: EventListenerType.TOUCH_ALL_AT_ONCE,
          onTouchesEnded: function (touches, event) {
            director.popScene();
          }
        },
        this
      );
    } else if ("mouse" in ServiceLocator.sys.capabilities)
      ServiceLocator.eventManager.addListener(
        {
          event: EventListenerType.MOUSE,
          onMouseUp: function (event) {
            director.popScene();
          }
        },
        this
      );
  }

  testDealloc(dt) {}

  //CREATE_NODE(SceneTestLayer3);
}
