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

import { UIMainLayer } from "../uimain-layer";
import { log } from "@aspect/core";

export class UIButtonTestZoomScale extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();

      // Add a label in which the button events will be displayed
      this._topDisplayLabel.setString("Zoom Scale: -0.5");
      this._bottomDisplayLabel.setString("");

      // Create the button
      var button = new ccui.Button(
        "ccs-res/cocosui/animationbuttonnormal.png",
        "ccs-res/cocosui/animationbuttonpressed.png"
      );
      button.setPosition(widgetSize.width / 2.0, widgetSize.height / 2.0);
      button.setPressedActionEnabled(true);
      button.addClickEventListener(function () {
        log(
          "Button clicked, position = (" + button.x + ", " + button.y + ")"
        );
      });
      button.setName("button");
      this._mainNode.addChild(button);
      button.setZoomScale(-0.5);

      var slider = new ccui.Slider();
      slider.loadBarTexture("ccs-res/cocosui/sliderTrack.png");
      slider.loadSlidBallTextures(
        "ccs-res/cocosui/sliderThumb.png",
        "ccs-res/cocosui/sliderThumb.png",
        ""
      );
      slider.loadProgressBarTexture("ccs-res/cocosui/sliderProgress.png");
      slider.setPosition(widgetSize.width / 2.0, widgetSize.height / 2.0 - 50);
      slider.addEventListener(this.sliderEvent, this);
      slider.setPercent(button.getZoomScale() * 100);
      this._mainNode.addChild(slider);
      return true;
    }
    return false;
  }

  sliderEvent(slider, type) {
    if (type == ccui.Slider.EVENT_PERCENT_CHANGED) {
      var percent = slider.getPercent();
      var btn = this._mainNode.getChildByName("button");
      var zoomScale = percent * 0.01;
      btn.setZoomScale(zoomScale);
      this._topDisplayLabel.setString("Zoom Scale: " + zoomScale.toFixed(2));
    }
  }
}
