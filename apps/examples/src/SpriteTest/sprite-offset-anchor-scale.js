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
// SpriteOffsetAnchorScale
//
//------------------------------------------------------------------
import { SpriteTestDemo } from "./sprite-test-demo";
import {
  s_grossiniPlist,
  s_grossini_gray,
  s_grossini_grayPlist,
  s_pathR1
} from "../resources";
import { winSize } from "../constants";
import { Animate, DelayTime, ScaleBy, Sequence } from "@aspect/actions";
import { Animation, Sprite, ServiceLocator } from "@aspect/core";
export class SpriteOffsetAnchorScale extends SpriteTestDemo {
  constructor() {
    //----start8----ctor
    super();

    this._title = "Sprite offset + anchor + scale";

    this.testDuration = 2.1;

    this.pixel = { 0: 153, 1: 0, 2: 153, 3: 255 };
    ServiceLocator.spriteFrameCache.addSpriteFrames(s_grossiniPlist);
    ServiceLocator.spriteFrameCache.addSpriteFrames(
      s_grossini_grayPlist,
      s_grossini_gray
    );

    for (var i = 0; i < 3; i++) {
      //
      // Animation using Sprite BatchNode
      //
      var sprite = new Sprite(
        ServiceLocator.spriteFrameCache.getSpriteFrame("grossini_dance_01.png")
      );
      sprite.x = (winSize.width / 4) * (i + 1);
      sprite.y = winSize.height / 2;

      var point = new Sprite(s_pathR1);
      point.scale = 0.25;
      point.x = sprite.x;
      point.y = sprite.y;
      this.addChild(point, 1);

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
      var str = "";
      for (var k = 1; k <= 14; k++) {
        str = "grossini_dance_" + (k < 10 ? "0" + k : k) + ".png";
        var frame = ServiceLocator.spriteFrameCache.getSpriteFrame(str);
        animFrames.push(frame);
      }

      var animation = new Animation(animFrames, 0.3);
      sprite.runAction(new Animate(animation).repeatForever());

      var scale = new ScaleBy(2, 2);
      var scale_back = scale.reverse();
      var delay = new DelayTime(0.25);
      var seq_scale = new Sequence(scale, delay, scale_back);
      sprite.runAction(seq_scale.repeatForever());

      this.addChild(sprite, 0);
    }
    //----end8----
  }
  onExit() {
    //----start8----onExit
    super.onExit();
    ServiceLocator.spriteFrameCache.removeSpriteFramesFromFile(s_grossiniPlist);
    ServiceLocator.spriteFrameCache.removeSpriteFramesFromFile(
      s_grossini_grayPlist
    );
    //----end8----
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
      (winSize.width / 4) * 3 - 85,
      winSize.height / 2 - 106,
      5,
      5
    );
    var ret2 = this.readPixels(
      (winSize.width / 4) * 2,
      winSize.height / 2 + 13,
      5,
      5
    );
    var ret3 = this.readPixels(
      winSize.width / 4 + 82,
      winSize.height / 2 + 133,
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
