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
// BMFontSubSpriteTest
//
//------------------------------------------------------------------
import { AtlasDemo } from "./atlas-demo";
import { TAG_BITMAP_ATLAS2 } from "./label-test-constants";
import { s_resprefix } from "../resources";
import { autoTestEnabled, director } from "../constants";
import { Color, Point, Sprite } from "@aspect/core";
import { LabelBMFont } from "@aspect/labels";
import {
  DelayTime,
  FadeIn,
  FadeOut,
  JumpBy,
  RotateBy,
  ScaleBy,
  Sequence
} from "@aspect/actions";
import { DrawNode } from "@aspect/shape-nodes";

export class BMFontSubSpriteTest extends AtlasDemo {
  constructor() {
    //----start4----ctor
    super();

    this.time = null;

    this.testDuration = 0.6;
    this.time = 0;

    var s = director.getWinSize();

    var drawNode = new DrawNode();
    this.addChild(drawNode);
    drawNode.setDrawColor(new Color(255, 0, 0, 128));
    drawNode.drawSegment(
      new Point(0, s.height / 2),
      new Point(s.width, s.height / 2),
      2
    );
    drawNode.drawSegment(
      new Point(s.width / 2, 0),
      new Point(s.width / 2, s.height),
      2
    );

    // Upper Label
    var label = new LabelBMFont(
      "Bitmap Font Atlas",
      s_resprefix + "fonts/bitmapFontTest.fnt"
    );
    this.labelObj = label;
    this.addChild(label);

    label.x = s.width / 2;
    label.y = s.height / 2;
    label.anchorX = 0.5;
    label.anchorY = 0.5;

    var BChar = label.getChildByTag(0);
    var FChar = label.getChildByTag(7);
    var AChar = label.getChildByTag(12);

    if (autoTestEnabled) {
      var jump = new JumpBy(0.5, new Point(0, 0), 60, 1);
      var jump_4ever = new Sequence(jump, new DelayTime(0.25)).repeatForever();
      var fade_out = new FadeOut(0.5);
      var rotate = new RotateBy(0.5, 180);
      var rot_4ever = new Sequence(
        rotate,
        new DelayTime(0.25),
        rotate.clone()
      ).repeatForever();

      var scale = new ScaleBy(0.5, 1.5);
    } else {
      var jump = new JumpBy(4, new Point(0, 0), 60, 1);
      var jump_4ever = jump.repeatForever();
      var fade_out = new FadeOut(1);
      var rotate = new RotateBy(2, 360);
      var rot_4ever = rotate.repeatForever();

      var scale = new ScaleBy(2, 1.5);
    }

    var scale_back = scale.reverse();
    var scale_seq = new Sequence(scale, new DelayTime(0.25), scale_back);
    var scale_4ever = scale_seq.repeatForever();

    var fade_in = new FadeIn(1);
    var seq = new Sequence(fade_out, new DelayTime(0.25), fade_in);
    var fade_4ever = seq.repeatForever();

    BChar.runAction(rot_4ever);
    BChar.runAction(scale_4ever);
    FChar.runAction(jump_4ever);
    AChar.runAction(fade_4ever);

    // Bottom Label
    var label2 = new LabelBMFont(
      "00.0",
      s_resprefix + "fonts/bitmapFontTest.fnt"
    );
    this.addChild(label2, 0, TAG_BITMAP_ATLAS2);
    label2.x = s.width / 2.0;
    label2.y = 80;

    var lastChar = label2.getChildByTag(3);
    lastChar.runAction(rot_4ever.clone());

    this.schedule(this.step, 0.1);
    //----end4----
  }
  step(dt) {
    //----start4----step
    this.time += dt;
    var string = this.time.toFixed(1);
    string = string < 10 ? "0" + string : string;
    var label1 = this.getChildByTag(TAG_BITMAP_ATLAS2);
    label1.setString(string);
    //----end4----
  }
  title() {
    return "LabelBMFont BMFontSubSpriteTest";
  }
  subtitle() {
    return "Using fonts as Sprite objects. Some characters should rotate.";
  }

  //
  // Automation
  //
  getExpectedResult() {
    // yellow, red, green, blue, yellow
    var ret = { rotate: 180, scale: 1.5, opacity: 0 };
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var s = this.labelObj.getChildByTag(0).scale;
    var r = this.labelObj.getChildByTag(0).rotation;
    var o = this.labelObj.getChildByTag(12).opacity;
    var ret = { rotate: r, scale: s, opacity: o };

    return JSON.stringify(ret);
  }
}
