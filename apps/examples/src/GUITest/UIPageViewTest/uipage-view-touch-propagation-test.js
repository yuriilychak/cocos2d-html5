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
import { Color, Point, Size, log } from "@aspect/core";
import { Button, CheckBox, HBox, Layout, LinearLayoutParameter, PageView, Text, VBox, Widget } from "@aspect/ccui";

export class UIPageViewTouchPropagationTest extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();

      // Add a label in which the dragpanel events will be displayed
      this._topDisplayLabel.string = "Move by horizontal direction";
      this._topDisplayLabel.x = widgetSize.width / 2.0;
      this._topDisplayLabel.y =
        widgetSize.height / 2.0 + this._topDisplayLabel.height * 1.5;

      // Add the black background
      this._bottomDisplayLabel.string = "PageView Touch Propagation";
      this._bottomDisplayLabel.setPosition(
        widgetSize.width / 2.0,
        widgetSize.height / 2.0 - this._bottomDisplayLabel.height * 3.075
      );

      // Create the page view
      var pageView = new PageView();
      pageView.setContentSize(new Size(240.0, 130.0));
      pageView.setAnchorPoint(new Point(0.5, 0.5));
      pageView.setPosition(
        new Point(widgetSize.width / 2.0, widgetSize.height / 2.0)
      );
      pageView.setBackGroundColor(Color.GREEN);
      pageView.setBackGroundColorType(Layout.BG_COLOR_SOLID);

      var pageCount = 4;
      for (var i = 0; i < pageCount; ++i) {
        var outerBox = new HBox();
        outerBox.setContentSize(new Size(240.0, 130.0));

        for (var k = 0; k < 2; ++k) {
          var innerBox = new VBox();

          for (var j = 0; j < 3; j++) {
            var btn = new Button(
              "ccs-res/cocosui/animationbuttonnormal.png",
              "ccs-res/cocosui/animationbuttonpressed.png"
            );
            btn.name = "button " + j;
            btn.addTouchEventListener(this.onButtonClicked, this);
            innerBox.addChild(btn);
          }

          var parameter = new LinearLayoutParameter();
          parameter.setMargin({ left: 0, top: 0, right: 100, bottom: 0 });
          innerBox.setLayoutParameter(parameter);

          outerBox.addChild(innerBox);
        }
        pageView.insertPage(outerBox, i);
      }

      pageView.addEventListener(this.pageViewEvent, this);
      pageView.name = "pageView";
      pageView.addTouchEventListener(function (sender, type) {
        if (type == Widget.TOUCH_BEGAN) {
          log("page view touch began");
        } else if (type == Widget.TOUCH_MOVED) {
          log("page view touch moved");
        } else if (type == Widget.TOUCH_ENDED) {
          log("page view touch ended");
        } else {
          log("page view touch cancelled");
        }
      });
      this._mainNode.addChild(pageView);

      var propagationText = new Text("Allow Propagation", "Arial", 10);
      propagationText.setAnchorPoint(new Point(0, 0.5));
      propagationText.setTextColor(Color.RED);
      propagationText.setPosition(
        new Point(20, pageView.getPosition().y + 50)
      );
      this._mainNode.addChild(propagationText);

      var swallowTouchText = new Text("Swallow Touches", "Arial", 10);
      swallowTouchText.setAnchorPoint(new Point(0, 0.5));
      swallowTouchText.setTextColor(Color.RED);
      swallowTouchText.setPosition(new Point(20, pageView.getPosition().y));
      this._mainNode.addChild(swallowTouchText);

      // Create the checkbox
      var checkBox1 = new CheckBox(
        "ccs-res/cocosui/check_box_normal.png",
        "ccs-res/cocosui/check_box_normal_press.png",
        "ccs-res/cocosui/check_box_active.png",
        "ccs-res/cocosui/check_box_normal_disable.png",
        "ccs-res/cocosui/check_box_active_disable.png"
      );
      var propagationPosition = propagationText.getPosition();
      checkBox1.setPosition(
        propagationPosition.x + propagationText.getContentSize().width / 2,
        propagationPosition.y - 20
      );

      checkBox1.name = "propagation";
      this._mainNode.addChild(checkBox1);

      // Create the checkbox
      var checkBox2 = new CheckBox(
        "ccs-res/cocosui/check_box_normal.png",
        "ccs-res/cocosui/check_box_normal_press.png",
        "ccs-res/cocosui/check_box_active.png",
        "ccs-res/cocosui/check_box_normal_disable.png",
        "ccs-res/cocosui/check_box_active_disable.png"
      );
      var swallowPosition = swallowTouchText.getPosition();
      checkBox2.setPosition(
        swallowPosition.x + swallowTouchText.getContentSize().width / 2,
        swallowPosition.y - 20
      );

      checkBox2.name = "swallow";
      this._mainNode.addChild(checkBox2);

      //            var eventListener = new EventListenerTouchOneByOne();
      //            eventListener.onTouchBegan = function(touch, event){
      //                log("layout receives touches");
      //                return true;
      //            };
      //            this._eventDispatcher.addEventListenerWithSceneGraphPriority(eventListener, this);

      return true;
    }
  }

  onButtonClicked(btn, type) {
    var ck1 = this._mainNode.getChildByName("propagation");
    var ck2 = this._mainNode.getChildByName("swallow");
    var pageView = this._mainNode.getChildByName("pageView");

    if (type == Widget.TOUCH_BEGAN) {
      if (ck1.isSelected()) {
        btn.setPropagateTouchEvents(true);
        pageView.setPropagateTouchEvents(true);
      } else {
        btn.setPropagateTouchEvents(false);
        pageView.setPropagateTouchEvents(false);
      }

      if (ck2.isSelected()) {
        btn.setSwallowTouches(true);
        pageView.setSwallowTouches(true);
      } else {
        btn.setSwallowTouches(false);
        pageView.setSwallowTouches(false);
      }
    }
    if (type == Widget.TOUCH_ENDED) log("button clicked");
  }

  pageViewEvent(pageView, type) {
    switch (type) {
      case PageView.EVENT_TURNING:
        this._topDisplayLabel.string = "page = " + (pageView.getCurPageIndex() - 0 + 1);
        break;
      default:
        break;
    }
  }
}
