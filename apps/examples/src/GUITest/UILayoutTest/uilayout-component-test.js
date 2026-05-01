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

export class UILayoutComponentTest extends UIMainLayer {
  constructor() {
    super();
    this._baseLayer = null;
  }

  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();

      this._baseLayer = new cc.LayerColor();
      this._baseLayer.setColor(new cc.Color(50, 100, 0));
      this._baseLayer.setOpacity(100);
      this._baseLayer.setContentSize(200, 200);
      this._mainNode.addChild(this._baseLayer);

      var button = new ccui.Button("ccs-res/cocosui/animationbuttonnormal.png");
      cc.log(
        "content size should be greater than 0:  width = %f, height = %f",
        button.width,
        button.height
      );
      button.setPosition(widgetSize.width / 2.0, widgetSize.height / 2.0);
      button.addTouchEventListener(this.touchEvent, this);
      button.setZoomScale(0.4);
      button.setPressedActionEnabled(true);
      this._mainNode.addChild(button);

      return true;
    }
    return false;
  }
  touchEvent(sender, type) {
    switch (type) {
      case ccui.Widget.TOUCH_BEGAN:
        break;
      case ccui.Widget.TOUCH_MOVED:
        break;
      case ccui.Widget.TOUCH_ENDED:
        var widgetSize = this._widget.getContentSize();
        var layerSize = this._baseLayer.getContentSize();
        if (
          layerSize.width == widgetSize.width &&
          layerSize.height == widgetSize.height
        )
          this._baseLayer.setContentSize(200, 200);
        else this._baseLayer.setContentSize(widgetSize);
        ccui.helper.doLayout(this._baseLayer);
        break;
      case ccui.Widget.TOUCH_CANCELED:
        break;
      default:
        break;
    }
  }
}
