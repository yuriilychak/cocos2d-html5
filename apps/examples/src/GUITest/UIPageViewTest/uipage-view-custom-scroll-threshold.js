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

//2015-01-14
import { UIMainLayer } from "../uimain-layer";
import { Point, Size, Color } from "@aspect/core";
import { ImageView, Layout, PageView, Slider, Text } from "@aspect/ccui";

export class UIPageViewCustomScrollThreshold extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();

      // Add a label in which the dragpanel events will be displayed
      this._topDisplayLabel.setString("Scroll Threshold");
      this._topDisplayLabel.x = widgetSize.width / 2.0;
      this._topDisplayLabel.y =
        widgetSize.height / 2.0 + this._topDisplayLabel.height * 1.5;

      // Add the black background
      this._bottomDisplayLabel.setString("PageView");
      this._bottomDisplayLabel.setPosition(
        new Point(
          widgetSize.width / 2.0,
          widgetSize.height / 2.0 - this._bottomDisplayLabel.height * 3.075
        )
      );

      // Create the page view
      var pageView = new PageView();
      pageView.setContentSize(new Size(240.0, 100.0));
      pageView.setPosition(
        new Point(
          (widgetSize.width - pageView.getContentSize().width) / 2.0,
          (widgetSize.height - pageView.getContentSize().height) / 2.0 +
            20
        )
      );

      var pageCount = 4;
      for (var i = 0; i < pageCount; ++i) {
        var layout = new Layout();
        layout.setContentSize(new Size(240.0, 130.0));

        var imageView = new ImageView("ccs-res/cocosui/scrollviewbg.png");
        imageView.setScale9Enabled(true);
        imageView.setContentSize(new Size(240, 130));
        imageView.setPosition(
          new Point(
            layout.getContentSize().width / 2.0,
            layout.getContentSize().height / 2.0
          )
        );
        layout.addChild(imageView);

        var label = new Text("page " + (i + 1), "Marker Felt", 30);
        label.setColor(new Color(192, 192, 192));
        label.setPosition(
          new Point(
            layout.getContentSize().width / 2.0,
            layout.getContentSize().height / 2.0
          )
        );
        layout.addChild(label);

        pageView.insertPage(layout, i);
      }

      this._mainNode.addChild(pageView);
      pageView.setName("pageView");

      var slider = new Slider();
      slider.loadBarTexture("ccs-res/cocosui/sliderTrack.png");
      slider.loadSlidBallTextures(
        "ccs-res/cocosui/sliderThumb.png",
        "ccs-res/cocosui/sliderThumb.png",
        ""
      );
      slider.loadProgressBarTexture("ccs-res/cocosui/sliderProgress.png");
      slider.setPosition(
        new Point(widgetSize.width / 2.0, widgetSize.height / 2.0 - 40)
      );
      slider.addEventListener(this.sliderEvent, this);
      slider.setPercent(50);
      this._mainNode.addChild(slider);

      return true;
    }
  }

  sliderEvent(slider, type) {
    if (type == Slider.EVENT_PERCENT_CHANGED) {
      var percent = slider.getPercent();
      var pageView = this._mainNode.getChildByName("pageView");
      if (percent == 0) percent = 1;
      pageView.setCustomScrollThreshold(percent * 0.01 * pageView.width);

      this._topDisplayLabel.setString(
        "Scroll Threshold: " + pageView.getCustomScrollThreshold().toFixed(2)
      );
    }
  }
}
