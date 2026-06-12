/****************************************************************************
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

import { UIFocusTestBase } from "./uifocus-test-base";
import { Color, ServiceLocator } from "@aspect/core";
import { Button, ListView, ScrollView, Text, Widget } from "@aspect/ccui";

export class UIFocusTestListView extends UIFocusTestBase {
  constructor() {
    super();
    this._listView = null;
    this._loopText = null;
  }

  init() {
    if (super.init()) {
      var winSize = ServiceLocator.director.getVisibleSize();

      this._listView = new ListView();
      this._listView.setDirection(ScrollView.DIR_VERTICAL);
      this._listView.setBounceEnabled(true);
      this._listView.setBackGroundImage("ccs-res/cocosui/green_edit.png");
      this._listView.setBackGroundImageScale9Enabled(true);
      this._listView.setContentSize(240, 130);

      this._listView.setPosition(40, 70);
      this.addChild(this._listView);
      this._listView.scale = 0.8;

      this._listView.setFocused(true);
      this._listView.setLoopFocus(true);
      this._listView.tag = -1000;
      this._firstFocusedWidget = this._listView;

      // create model
      var default_button = new Button(
        "ccs-res/cocosui/backtotoppressed.png",
        "ccs-res/cocosui/backtotopnormal.png"
      );
      default_button.setName("Title Button");

      // set model
      this._listView.setItemModel(default_button);

      // add default item
      var count = 20,
        i;
      for (i = 0; i < count / 4; ++i) {
        this._listView.pushBackDefaultItem();
      }
      // insert default item
      for (i = 0; i < count / 4; ++i) {
        this._listView.insertDefaultItem(0);
      }
      this._loopText = new Text("loop enabled", "Arial", 20);
      this._loopText.setPosition(winSize.width / 2, winSize.height - 50);
      this._loopText.color = Color.GREEN;
      this.addChild(this._loopText);

      this._btn.addTouchEventListener(this.toggleFocusLoop, this);
      return true;
    }
    return false;
  }

  toggleFocusLoop(ref, touchType) {
    if (touchType == Widget.TOUCH_ENDED) {
      this._listView.setLoopFocus(!this._listView.isLoopFocus());
      if (this._listView.isLoopFocus()) {
        this._loopText.string = "loop enabled";
      } else {
        this._loopText.string = "loop disabled";
      }
    }
  }
}
