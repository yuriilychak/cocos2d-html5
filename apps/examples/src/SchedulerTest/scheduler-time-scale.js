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

// SchedulerTimeScale
import { SchedulerTestLayer } from "./scheduler-test-layer";
import { s_stars1 } from "../resources";
import { Director, LabelTTF, Point, Sprite } from "@aspect/core";
import { JumpBy, Repeat, RotateBy, Sequence, Spawn, Speed } from "@aspect/actions";
import { ParticleFireworks } from "../ParticleTest/ParticleExamples";

export class SchedulerTimeScale extends SchedulerTestLayer {
  constructor() {
    super();
    this._newScheduler = null;
    this._newActionManager = null;
  }

  onEnter() {
    super.onEnter();

    this._newScheduler = new cc.Scheduler();
    this._newActionManager = new cc.ActionManager();

    var s = cc.winSize;

    // rotate and jump
    var jump1 = new JumpBy(4, new Point(-s.width + 80, 0), 100, 4);
    var jump2 = jump1.reverse();
    var rot1 = new RotateBy(4, 360 * 2);
    var rot2 = rot1.reverse();

    var seq3_1 = new Sequence(jump2, jump1);
    var seq3_2 = new Sequence(rot1, rot2);
    var spawn = new Spawn(seq3_1, seq3_2);
    var action = new Repeat(spawn, 50);

    var action2 = action.clone();
    var action3 = action.clone();

    var grossini = new Sprite("Images/grossini.png");
    var tamara = new Sprite("Images/grossinis_sister1.png");
    var kathia = new Sprite("Images/grossinis_sister2.png");

    grossini.setActionManager(this._newActionManager);
    grossini.setScheduler(this._newScheduler);

    grossini.setPosition(new Point(40, 80));
    tamara.setPosition(new Point(40, 80));
    kathia.setPosition(new Point(40, 80));

    this.addChild(grossini);
    this.addChild(tamara);
    this.addChild(kathia);

    grossini.runAction(new Speed(action, 0.5));
    tamara.runAction(new Speed(action2, 1.5));
    kathia.runAction(new Speed(action3, 1.0));

    Director.getInstance().getScheduler().scheduleUpdate(this._newScheduler, 0, false);

    this._newScheduler.scheduleUpdate(this._newActionManager, 0, false);

    var emitter = new ParticleFireworks();
    emitter.setTexture(cc.textureCache.addImage(s_stars1));
    this.addChild(emitter);

    var slider = null;
    var l = null;

    slider = new ccui.Slider();
    slider.setTouchEnabled(true);
    slider.loadBarTexture("ccs-res/cocosui/sliderTrack.png");
    slider.loadSlidBallTextures(
      "ccs-res/cocosui/sliderThumb.png",
      "ccs-res/cocosui/sliderThumb.png",
      ""
    );
    slider.loadProgressBarTexture("ccs-res/cocosui/sliderProgress.png");
    slider.x = cc.winSize.width / 2.0;
    slider.y = (cc.winSize.height / 3.0) * 2;
    slider.addEventListener(this.sliderEventForGrossini, this);
    this.addChild(slider);
    slider.setPercent(20);

    l = new LabelTTF("Control time scale only for Grossini", "Thonburi", 16);
    this.addChild(l);
    l.x = slider.x;
    l.y = slider.y + 30;

    slider = new ccui.Slider();
    slider.setTouchEnabled(true);
    slider.loadBarTexture("ccs-res/cocosui/sliderTrack.png");
    slider.loadSlidBallTextures(
      "ccs-res/cocosui/sliderThumb.png",
      "ccs-res/cocosui/sliderThumb.png",
      ""
    );
    slider.loadProgressBarTexture("ccs-res/cocosui/sliderProgress.png");
    slider.x = cc.winSize.width / 2.0;
    slider.y = cc.winSize.height / 3.0;
    slider.addEventListener(this.sliderEventForGlobal, this);
    this.addChild(slider);
    slider.setPercent(20);
    l = new LabelTTF("Control time scale for all", "Thonburi", 16);
    this.addChild(l);
    l.x = slider.x;
    l.y = slider.y + 30;
  }

  sliderEventForGrossini(sender, type) {
    switch (type) {
      case ccui.Slider.EVENT_PERCENT_CHANGED:
        var slider = sender;
        var percent = (slider.getPercent() / 100.0) * 5;
        this._newScheduler.setTimeScale(percent);
        break;
      default:
        break;
    }
  }

  sliderEventForGlobal(sender, type) {
    switch (type) {
      case ccui.Slider.EVENT_PERCENT_CHANGED:
        var slider = sender;
        var percent = (slider.getPercent() / 100.0) * 5;
        Director.getInstance().getScheduler().setTimeScale(percent);
        break;
      default:
        break;
    }
  }

  onExit() {
    Director.getInstance().getScheduler().setTimeScale(1);
    // restore scale
    Director.getInstance().getScheduler().unscheduleUpdate(this._newScheduler);
    super.onExit();
  }

  title() {
    return "Scheduler timeScale Test";
  }

  subtitle() {
    return "Fast-forward and rewind using scheduler.timeScale";
  }
}
