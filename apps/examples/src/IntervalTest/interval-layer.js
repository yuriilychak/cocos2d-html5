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

import { s_fire, s_pathGrossini, s_simpleFont_fnt } from "../resources";
import { director } from "../constants";
import { Color, LayerGradient, Point, Rect, Sprite, ServiceLocator } from "@aspect/core";
import { JumpBy, Sequence } from "@aspect/actions";
import { BMButton, Widget } from "@aspect/ccui";
import { Label } from "@aspect/labels";
import { ParticleSun } from "../ParticleTest/ParticleExamples";

export class IntervalLayer extends LayerGradient {
  constructor() {
    super(new Color(0, 0, 0, 255), new Color(98, 99, 117, 255));

    this.label0 = null;

    this.label1 = null;

    this.label2 = null;

    this.label3 = null;

    this.label4 = null;

    this.time0 = null;

    this.time1 = null;

    this.time2 = null;

    this.time3 = null;

    this.time4 = null;

    this.time0 = this.time1 = this.time2 = this.time3 = this.time4 = 0.0;

    var s = director.getWinSize();
    // sun
    var sun = new ParticleSun();
    sun.texture = ServiceLocator.textureCache.addImage(s_fire);
    sun.x = s.width - 32;
    sun.y = s.height - 32;

    sun.setTotalParticles(130);
    sun.setLife(0.6);
    this.addChild(sun);

    // timers, font "fonts/bitmapFontTest4.fnt"
    this.label0 = Label.createWithBMFont("fonts/bitmapFontTest4.fnt", 24);
    this.label1 = Label.createWithBMFont("fonts/bitmapFontTest4.fnt", 24);
    this.label2 = Label.createWithBMFont("fonts/bitmapFontTest4.fnt", 24);
    this.label3 = Label.createWithBMFont("fonts/bitmapFontTest4.fnt", 24);
    this.label4 = Label.createWithBMFont("fonts/bitmapFontTest4.fnt", 24);

    this.scheduleUpdate();
    this.schedule(this.step1);
    this.schedule(this.step2, 0);
    this.schedule(this.step3, 1.0);
    this.schedule(this.step4, 2.0);

    this.label0.x = (s.width * 1) / 6;
    this.label0.y = s.height / 2;
    this.label1.x = (s.width * 2) / 6;
    this.label1.y = s.height / 2;
    this.label2.x = (s.width * 3) / 6;
    this.label2.y = s.height / 2;
    this.label3.x = (s.width * 4) / 6;
    this.label3.y = s.height / 2;
    this.label4.x = (s.width * 5) / 6;
    this.label4.y = s.height / 2;

    this.addChild(this.label0);
    this.addChild(this.label1);
    this.addChild(this.label2);
    this.addChild(this.label3);
    this.addChild(this.label4);

    // Sprite
    var sprite = new Sprite(s_pathGrossini);
    sprite.x = 40;
    sprite.y = 50;

    var jump = new JumpBy(3, new Point(s.width - 80, 0), 50, 4);

    this.addChild(sprite);
    sprite.runAction(new Sequence(jump, jump.reverse()).repeatForever());

    // pause button
    const pauseBtn = new BMButton(
      "default_theme/rounded_shadow_2.png",
      "default_theme/rounded_shadow_2.png",
      "default_theme/rounded_shadow_2.png",
      Widget.PLIST_TEXTURE
    );
    pauseBtn.setScale9Enabled(true);
    pauseBtn.setCapInsets(new Rect(12, 12, 12, 12));
    pauseBtn.setContentSize(196, 32);
    pauseBtn.setTitleFntFile(s_simpleFont_fnt);
    pauseBtn.setTitleText("Pause");
    pauseBtn.setTitleFontSize(12);
    pauseBtn.setNormalBgColor(new Color(0x00, 0x99, 0x00));
    pauseBtn.setPressedBgColor(new Color(0x00, 0x66, 0x00));
    pauseBtn.setDisabledBgColor(new Color(0x55, 0x55, 0x55));
    pauseBtn.pressedActionEnabled = true;
    pauseBtn.addClickEventListener(() => this.onPause());
    pauseBtn.x = s.width / 2;
    pauseBtn.y = s.height - 80;
    this.addChild(pauseBtn);
  }

  onPause(sender) {
    if (director.isPaused()) {
      director.resume();
    } else {
      director.pause();
    }
  }

  onExit() {
    if (director.isPaused()) {
      director.resume();
    }
    super.onExit();
  }

  step1(dt) {
    this.time1 += dt;
    this.label1.string = this.time1.toFixed(1);
  }
  step2(dt) {
    this.time2 += dt;
    this.label2.string = this.time2.toFixed(1);
  }
  step3(dt) {
    this.time3 += dt;
    this.label3.string = this.time3.toFixed(1);
  }
  step4(dt) {
    this.time4 += dt;
    this.label4.string = this.time4.toFixed(1);
  }
  update(dt) {
    this.time0 += dt;

    this.label0.string = this.time0.toFixed(1);
  }

  //CREATE_NODE(IntervalLayer);
}
