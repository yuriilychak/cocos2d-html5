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
import { ImageView, Text, VBox, Widget } from "@aspect/ccui";

export class UIFocusTestVertical extends UIFocusTestBase {
  constructor() {
    super();
    this._verticalLayout = null;
    this._loopText = null;
  }

  init() {
    if (super.init()) {
      var winSize = ServiceLocator.director.getVisibleSize();

      this._verticalLayout = new VBox();
      this._verticalLayout.setPosition(
        winSize.width / 2 - 50,
        winSize.height - 80
      );
      this.addChild(this._verticalLayout);
      this._verticalLayout.tag = 100;
      //this._verticalLayout.scale = 0.8;

      this._verticalLayout.setFocused(true);
      this._verticalLayout.setLoopFocus(true);
      this._firstFocusedWidget = this._verticalLayout;

      var count = 3;
      for (var i = 0; i < count; ++i) {
        var w = new ImageView("ccs-res/cocosui/scrollviewbg.png");
        w.setTouchEnabled(true);
        w.tag = i;
        w.addTouchEventListener(this.onImageViewClicked, this);
        this._verticalLayout.addChild(w);
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
      this._verticalLayout.setLoopFocus(!this._verticalLayout.isLoopFocus());
      if (this._verticalLayout.isLoopFocus()) {
        this._loopText.setString("loop enabled");
      } else {
        this._loopText.setString("loop disabled");
      }
    }
  }
}
