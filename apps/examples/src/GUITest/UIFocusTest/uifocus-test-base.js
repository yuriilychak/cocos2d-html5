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

import { UIMainLayer } from "../uimain-layer";
import { Color, EventKeyboard, EventListener, EventListenerType, KEY, log, ServiceLocator } from "@aspect/core";
import { Button, Widget } from "@aspect/ccui";
import { ButtonLayout } from "../../button-layout";

export class UIFocusTestBase extends UIMainLayer {
  constructor() {
    super();
    this._dpadMenu = null;
    this._firstFocusedWidget = null;
    this._eventListener = null;
    this._btn = null;
  }

  init() {
    if (super.init()) {

      var winSize = ServiceLocator.director.getVisibleSize();
      this._dpadMenu = new ButtonLayout(
        [
          { label: "Left", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
          { label: "Right", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
          { label: "Up", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) },
          { label: "Down", tintDefault: new Color(0x44, 0x55, 0x77), tintPressed: new Color(0x22, 0x33, 0x55) }
        ],
        80, "D-Pad",
        (i) => {
          switch (i) {
            case 0: this.onLeftKeyPressed(); break;
            case 1: this.onRightKeyPressed(); break;
            case 2: this.onUpKeyPressed(); break;
            case 3: this.onDownKeyPressed(); break;
          }
        }
      );
      this.addChild(this._dpadMenu);

      this._btn = new Button("ccs-res/cocosui/switch-mask.png");
      this._btn.setTitleText("Toggle Loop");
      this._btn.setPosition(60, winSize.height - 50);
      this._btn.setTitleColor(Color.RED);
      this._btn.addTouchEventListener(this.toggleFocusLoop, this);
      this._btn.setFocusEnabled(false);
      this.addChild(this._btn);

      //call this method to enable Dpad focus navigation
      Widget.enableDpadNavigation(true);

      this._eventListener = EventListener.create({
        event: EventListenerType.FOCUS, //TODO Need add focus event in JSB
        onFocusChanged: this.onFocusChanged.bind(this)
      });
      ServiceLocator.eventManager.addListener(this._eventListener, 1);
      return true;
    }
    return false;
  }

  onLeftKeyPressed() {
    var event = new EventKeyboard(KEY.dpadLeft, false);
    ServiceLocator.eventManager.dispatchEvent(event);
  }
  onRightKeyPressed() {
    var event = new EventKeyboard(KEY.dpadRight, false);
    ServiceLocator.eventManager.dispatchEvent(event);
  }
  onUpKeyPressed() {
    var event = new EventKeyboard(KEY.dpadUp, false);
    ServiceLocator.eventManager.dispatchEvent(event);
  }
  onDownKeyPressed() {
    var event = new EventKeyboard(KEY.dpadDown, false);
    ServiceLocator.eventManager.dispatchEvent(event);
  }
  onFocusChanged(widgetLostFocus, widgetGetFocus) {
    if (widgetGetFocus && widgetGetFocus.isFocusEnabled())
      widgetGetFocus.color = Color.RED;

    if (widgetLostFocus && widgetLostFocus.isFocusEnabled())
      widgetLostFocus.color = Color.WHITE;

    if (widgetLostFocus && widgetGetFocus)
      log(
        "on focus change, %d widget get focus, %d widget lose focus",
        widgetGetFocus.getTag(),
        widgetLostFocus.getTag()
      );
  }

  onImageViewClicked(widget, touchType) {
    if (touchType == Widget.TOUCH_ENDED) {
      if (widget.isFocusEnabled()) {
        widget.setFocusEnabled(false);
        widget.color = Color.YELLOW;
      } else {
        widget.setFocusEnabled(true);
        widget.color = Color.WHITE;
      }
    }
  }
  onExit() {
    ServiceLocator.eventManager.removeListener(this._eventListener);
    super.onExit();
  }
}
