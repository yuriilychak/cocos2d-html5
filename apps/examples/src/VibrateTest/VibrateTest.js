/****************************************************************************
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

import { BaseTestLayer } from "../BaseTestLayer/BaseTestLayer";
import { TestScene } from "../test-scene";
import { Color, Device, Director, LabelTTF } from "@aspect/core";
import { Slider } from "@aspect/ccui";
import { ButtonLayout } from "../button-layout";

export class VibrateTest extends BaseTestLayer {
  constructor() {
    super();

    this._duration = 0.1;

    this._durationLabel = null;
    var s = Director.getInstance().getWinSize();
    var label = new LabelTTF("vibrate control test", "Arial", 28);
    this.addChild(label, 0);
    label.x = s.width / 2;
    label.y = s.height - 50;

    this._duration = 0.1;

    this.addChild(new ButtonLayout(
      [{ label: "Vibrate", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) }],
      196, "Actions",
      () => this.startVibrate()
    ));

    this._durationLabel = new LabelTTF(
      "duration: " + this._duration.toFixed(3) + "s",
      "Arial",
      20
    );
    this._durationLabel.x = s.width * 0.5;
    this._durationLabel.y = s.height * 0.5;
    this.addChild(this._durationLabel);

    // Create the slider
    var durationSlider = new Slider();
    durationSlider.setPercent(0);
    durationSlider.setTouchEnabled(true);
    durationSlider.loadBarTexture("ccs-res/cocosui/sliderTrack.png");
    durationSlider.loadSlidBallTextures(
      "ccs-res/cocosui/sliderThumb.png",
      "ccs-res/cocosui/sliderThumb.png",
      ""
    );
    durationSlider.loadProgressBarTexture("ccs-res/cocosui/sliderProgress.png");
    durationSlider.x = s.width * 0.5;
    durationSlider.y = s.height * 0.35;
    durationSlider.addEventListener(this.durationSliderEvent, this);
    this.addChild(durationSlider);
  }
  startVibrate(sender) {
    Device.vibrate(this._duration);
  }
  durationSliderEvent(sender, type) {
    switch (type) {
      case Slider.EVENT_PERCENT_CHANGED:
        var slider = sender;
        var percent = slider.getPercent();
        this._duration = (percent / 100.0) * 1.9 + 0.1; // from 0.1ms to 2s
        this._durationLabel.setString(
          "duration: " + this._duration.toFixed(3) + "s"
        );
        break;
      default:
        break;
    }
  }
  onExit() {
    super.onExit();
  }
}

export class VibrateTestScene extends TestScene {
  constructor() {
    super("Vibrate Test");
  }

  runThisTest() {
    var layer = new VibrateTest();
    this.addChild(layer);

    Director.getInstance().runScene(this);
  }
}

export var arrayOfVibrateTest = [VibrateTest];
