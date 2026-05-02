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
// SpriteBatchNodeColorOpacity
//
//------------------------------------------------------------------
import {
  TAG_SPRITE1,
  TAG_SPRITE2,
  TAG_SPRITE3,
  TAG_SPRITE4,
  TAG_SPRITE5,
  TAG_SPRITE6,
  TAG_SPRITE7,
  TAG_SPRITE8,
  TAG_SPRITE_BATCH_NODE
} from "./sprite-test-constants";
import { SpriteTestDemo } from "./sprite-test-demo";
import { s_grossini_dance_atlas } from "../resources";
import { winSize } from "../constants";
import { Rect, Sprite, SpriteBatchNode } from "@aspect/core";
import { DelayTime, FadeOut, TintBy, Sequence } from "@aspect/actions";

export class SpriteBatchNodeColorOpacity extends SpriteTestDemo {
  constructor() {
    //----start12----ctor
    super();

    this._title = "SpriteBatchNode: Color & Opacity";

    this.testDuration = 2.1;

    this.pixel1 = { 0: 255, 1: 0, 2: 0, 3: 255 };

    this.pixel2 = { 0: 0, 1: 204, 2: 0, 3: 255 };

    this.pixel3 = { 0: 0, 1: 0, 2: 153, 3: 255 };

    this.pixel4 = { 0: 255, 1: 204, 2: 153, 3: 255 };
    // small capacity. Testing resizing.
    // Don't use capacity=1 in your real game. It is expensive to resize the capacity
    var batch = new SpriteBatchNode(s_grossini_dance_atlas, 1);
    this.addChild(batch, 0, TAG_SPRITE_BATCH_NODE);

    var sprite1 = new Sprite(batch.texture, new Rect(0, 121, 85, 121));
    var sprite2 = new Sprite(batch.texture, new Rect(85, 121, 85, 121));
    var sprite3 = new Sprite(batch.texture, new Rect(85 * 2, 121, 85, 121));
    var sprite4 = new Sprite(batch.texture, new Rect(85 * 3, 121, 85, 121));

    var sprite5 = new Sprite(batch.texture, new Rect(0, 121, 85, 121));
    var sprite6 = new Sprite(batch.texture, new Rect(85, 121, 85, 121));
    var sprite7 = new Sprite(batch.texture, new Rect(85 * 2, 121, 85, 121));
    var sprite8 = new Sprite(batch.texture, new Rect(85 * 3, 121, 85, 121));

    sprite1.x = (winSize.width / 5) * 1;
    sprite1.y = (winSize.height / 3) * 1;
    sprite2.x = (winSize.width / 5) * 2;
    sprite2.y = (winSize.height / 3) * 1;
    sprite3.x = (winSize.width / 5) * 3;
    sprite3.y = (winSize.height / 3) * 1;
    sprite4.x = (winSize.width / 5) * 4;
    sprite4.y = (winSize.height / 3) * 1;
    sprite5.x = (winSize.width / 5) * 1;
    sprite5.y = (winSize.height / 3) * 2;
    sprite6.x = (winSize.width / 5) * 2;
    sprite6.y = (winSize.height / 3) * 2;
    sprite7.x = (winSize.width / 5) * 3;
    sprite7.y = (winSize.height / 3) * 2;
    sprite8.x = (winSize.width / 5) * 4;
    sprite8.y = (winSize.height / 3) * 2;

    var delay = new DelayTime(0.25);
    var action = new FadeOut(2);
    var action_back = action.reverse();
    var fade = new Sequence(action, delay.clone(), action_back).repeatForever();

    var tintRed = new TintBy(2, 0, -255, -255);
    var red = new Sequence(
      tintRed,
      delay.clone(),
      tintRed.reverse()
    ).repeatForever();

    var tintGreen = new TintBy(2, -255, 0, -255);
    var tintGreenBack = tintGreen.reverse();
    var green = new Sequence(
      tintGreen,
      delay.clone(),
      tintGreenBack
    ).repeatForever();

    var tintBlue = new TintBy(2, -255, -255, 0);
    var tintBlueBack = tintBlue.reverse();
    var blue = new Sequence(
      tintBlue,
      delay.clone(),
      tintBlueBack
    ).repeatForever();

    // late add: test dirtyColor and dirtyPosition
    batch.addChild(sprite1, 0, TAG_SPRITE1);
    batch.addChild(sprite2, 0, TAG_SPRITE2);
    batch.addChild(sprite3, 0, TAG_SPRITE3);
    batch.addChild(sprite4, 0, TAG_SPRITE4);
    batch.addChild(sprite5, 0, TAG_SPRITE5);
    batch.addChild(sprite6, 0, TAG_SPRITE6);
    batch.addChild(sprite7, 0, TAG_SPRITE7);
    batch.addChild(sprite8, 0, TAG_SPRITE8);

    sprite5.runAction(red);
    sprite6.runAction(green);
    sprite7.runAction(blue);
    sprite8.runAction(fade);

    this.schedule(this.removeAndAddSprite, 2);
    //----end12----
  }
  // this function test if remove and add works as expected:
  //   color array and vertex array should be reindexed
  removeAndAddSprite(dt) {
    //----start12----removeAndAddSprite
    var batch = this.getChildByTag(TAG_SPRITE_BATCH_NODE);
    var sprite = batch.getChildByTag(TAG_SPRITE5);

    batch.removeChild(sprite, false);
    batch.addChild(sprite, 0, TAG_SPRITE5);
    //----end12----
  }
  //
  // Automation
  //
  getExpectedResult() {
    var ret = { pixel1: "yes", pixel2: "yes", pixel3: "yes", pixel4: "yes" };
    return JSON.stringify(ret);
  }
  getCurrentResult() {
    var ret1 = this.readPixels(
      (winSize.width / 5) * 1,
      (winSize.height / 3) * 2 + 40,
      5,
      5
    );
    var ret2 = this.readPixels(
      (winSize.width / 5) * 2,
      (winSize.height / 3) * 2 + 40,
      5,
      5
    );
    var ret3 = this.readPixels(
      (winSize.width / 5) * 3,
      (winSize.height / 3) * 2 + 40,
      5,
      5
    );
    var ret4 = this.readPixels(
      (winSize.width / 5) * 4,
      (winSize.height / 3) * 2 + 40,
      5,
      5
    );
    var ret = {
      pixel1: this.containsPixel(ret1, this.pixel1) ? "yes" : "no",
      pixel2: this.containsPixel(ret2, this.pixel2) ? "yes" : "no",
      pixel3: this.containsPixel(ret3, this.pixel3) ? "yes" : "no",
      pixel4: this.containsPixel(ret4, this.pixel4) ? "yes" : "no"
    };
    return JSON.stringify(ret);
  }
}
