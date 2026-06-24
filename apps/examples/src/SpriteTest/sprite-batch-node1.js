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

//------------------------------------------------------------------
//
// SpriteBatchNode1
//
//------------------------------------------------------------------
import { TAG_SPRITE_BATCH_NODE } from "./sprite-test-constants";
import { SpriteTestDemo } from "./sprite-test-demo";
import { s_grossini_dance_atlas } from "../resources";
import { winSize } from "../constants";
import {
  EventListener,
  EventListenerType,
  Point,
  Rect,
  Sprite,
  SpriteBatchNode,
  ServiceLocator
} from "@aspect/core";
import {
  Blink,
  FadeOut,
  RotateBy,
  ScaleBy,
  TintBy,
  Sequence
} from "@aspect/actions";

export class SpriteBatchNode1 extends SpriteTestDemo {
  constructor() {
    //----start1----ctor
    super();

    this._title = "Batched Sprite ";

    this._subtitle = "Tap screen to add more sprites";

    this.testDuration = 1;

    this.pixel = { 0: 51, 1: 0, 2: 51, 3: 255 };

    this.testSprite = null;
    if (ServiceLocator.sys.capabilities.touches) {
      ServiceLocator.eventManager.addListener(
        {
          event: EventListenerType.TOUCH_ALL_AT_ONCE,
          onTouchesEnded: function (touches, event) {
            for (var it = 0; it < touches.length; it++) {
              var touch = touches[it];
              if (!touch) break;

              event.getCurrentTarget().addNewSpriteWithCoords(touch);
            }
          }
        },
        this
      );
    } else if (ServiceLocator.sys.capabilities.mouse)
      ServiceLocator.eventManager.addListener(
        {
          event: EventListenerType.MOUSE,
          onMouseUp: function (event) {
            event.getCurrentTarget().addNewSpriteWithCoords(event);
          }
        },
        this
      );

    var batchNode = new SpriteBatchNode(s_grossini_dance_atlas, 50);
    this.addChild(batchNode, 0, TAG_SPRITE_BATCH_NODE);
    this.addNewSpriteWithCoords(
      new Point(winSize.width / 2, winSize.height / 2)
    );
    //----end1----
  }

  addNewSpriteWithCoords(p) {
    //----start1----addNewSpriteWithCoords
    var batchNode = this.getChildByTag(TAG_SPRITE_BATCH_NODE);

    var idx = 0 | (Math.random() * 14);
    var x = (idx % 5) * 85;
    var y = (0 | (idx / 5)) * 121;

    var sprite = new Sprite(batchNode.texture, new Rect(x, y, 85, 121));
    batchNode.addChild(sprite);

    sprite.x = p.x;

    sprite.y = p.y;

    var action;
    var random = Math.random();

    if (random < 0.2) action = new ScaleBy(3, 2);
    else if (random < 0.4) action = new RotateBy(3, 360);
    else if (random < 0.6) action = new Blink(1, 3);
    else if (random < 0.8) action = new TintBy(2, 0, -255, -255);
    else action = new FadeOut(2);

    var action_back = action.reverse();
    var seq = new Sequence(action, action_back);

    sprite.runAction(seq.repeatForever());
    this.testSprite = sprite;
    //----end1----
  }

  //
  // Automation
  //
  setupAutomation() {
    var fun = function () {
      var sprite = new Sprite(s_grossini_dance_atlas, new Rect(0, 0, 85, 121));
      this.addChild(sprite, 999);
      sprite.x = winSize.width / 2;
      sprite.y = winSize.height / 2;
    };
    this.scheduleOnce(fun, 0.5);
  }
  getExpectedResult() {
    var ret = { useBatch: true, pixel: "yes" };
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret1 = this.readPixels(winSize.width / 2, winSize.height / 2, 5, 5);
    var ret = {
      useBatch: this.testSprite.getBatchNode() != null,
      pixel: this.containsPixel(ret1, this.pixel) ? "yes" : "no"
    };
    return JSON.stringify(ret);
  }
}
