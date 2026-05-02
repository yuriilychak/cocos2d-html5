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

//
// SpriteBatchNodeOffsetAnchorFlip
//
import { SpriteTestDemo } from "./sprite-test-demo";
import {
  s_grossini,
  s_grossiniPlist,
  s_grossini_gray,
  s_grossini_grayPlist,
  s_pathR1
} from "../resources";
import { winSize } from "../constants";
import { Animate, DelayTime, FlipY, Sequence } from "@aspect/actions";
import {
  Animation,
  Sprite,
  SpriteBatchNode,
  SpriteFrameCache
} from "@aspect/core";
export class SpriteBatchNodeOffsetAnchorFlip extends SpriteTestDemo {
  constructor() {
    //----start46----ctor
    super();

    this._title = "SpriteBatchNode offset + anchor + flip";

    this._subtitle = "issue #1078";

    this.testDuration = 1.5;

    this.pixel = { 0: 255, 1: 204, 2: 153, 3: 255 };
    SpriteFrameCache.getInstance().addSpriteFrames(s_grossiniPlist);
    SpriteFrameCache.getInstance().addSpriteFrames(
      s_grossini_grayPlist,
      s_grossini_gray
    );

    var spritebatch = new SpriteBatchNode(s_grossini);
    this.addChild(spritebatch);

    for (var i = 0; i < 3; i++) {
      //
      // Animation using Sprite batch
      //
      var sprite = new Sprite(
        SpriteFrameCache.getInstance().getSpriteFrame("grossini_dance_01.png")
      );
      sprite.x = (winSize.width / 4) * (i + 1);
      sprite.y = winSize.height / 2;

      var point = new Sprite(s_pathR1);
      point.scale = 0.25;
      point.x = sprite.x;
      point.y = sprite.y;
      this.addChild(point, 200);

      switch (i) {
        case 0:
          sprite.anchorX = 0;
          sprite.anchorY = 0;
          break;
        case 1:
          sprite.anchorX = 0.5;
          sprite.anchorY = 0.5;
          break;
        case 2:
          sprite.anchorX = 1;
          sprite.anchorY = 1;
          break;
      }

      point.x = sprite.x;
      point.y = sprite.y;

      var animFrames = [];
      var tmp = "";
      for (var j = 1; j <= 14; j++) {
        tmp = "grossini_dance_" + (j < 10 ? "0" + j : j) + ".png";
        var frame = SpriteFrameCache.getInstance().getSpriteFrame(tmp);
        animFrames.push(frame);
      }

      var animation = new Animation(animFrames, 0.3);
      sprite.runAction(new Animate(animation).repeatForever());

      animFrames = null;

      var flip = new FlipY(true);
      var flip_back = new FlipY(false);
      var delay = new DelayTime(1);
      var seq = new Sequence(delay, flip, delay.clone(), flip_back);
      sprite.runAction(seq.repeatForever());

      spritebatch.addChild(sprite, i);
    }
    //----end46----
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = { pixel1: "yes", pixel2: "yes", pixel3: "yes" };
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret1 = this.readPixels(
      winSize.width / 4 + 40,
      winSize.height / 2 + 18,
      5,
      5
    );
    var ret2 = this.readPixels(
      (winSize.width / 4) * 2,
      winSize.height / 2 - 44,
      5,
      5
    );
    var ret3 = this.readPixels(
      (winSize.width / 4) * 3 - 45,
      winSize.height / 2 - 105,
      5,
      5
    );
    var ret = {
      pixel1: this.containsPixel(ret1, this.pixel) ? "yes" : "no",
      pixel2: this.containsPixel(ret2, this.pixel) ? "yes" : "no",
      pixel3: this.containsPixel(ret3, this.pixel) ? "yes" : "no"
    };
    return JSON.stringify(ret);
  }
}
