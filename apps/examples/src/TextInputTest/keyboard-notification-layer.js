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

//////////////////////////////////////////////////////////////////////////
// KeyboardNotificationLayer for test IME keyboard notification.
//////////////////////////////////////////////////////////////////////////
import { textInputGetRect } from "./text-input-test-constants";
import { TextInputTest } from "./text-input-test";
import { EventListener, EventListenerType, Rect, log, ServiceLocator } from "@aspect/core";

export class KeyboardNotificationLayer extends TextInputTest {
  constructor() {
    super();

    this._trackNode = null;

    this._beginPos = null;

    if ("touches" in ServiceLocator.sys.capabilities) {
      ServiceLocator.eventManager.addListener(
        {
          event: EventListenerType.TOUCH_ALL_AT_ONCE,
          onTouchesEnded: this.onTouchesEnded
        },
        this
      );
    } else if ("mouse" in ServiceLocator.sys.capabilities)
      ServiceLocator.eventManager.addListener(
        {
          event: EventListenerType.MOUSE,
          onMouseUp: this.onMouseUp
        },
        this
      );
  }

  subtitle() {
    return "";
  }

  onClickTrackNode(clicked) {}

  keyboardWillShow(info) {
    log(
      "TextInputTest:keyboardWillShowAt(origin:" +
        info.end.x +
        "," +
        info.end.y +
        ", size:" +
        info.end.width +
        "," +
        info.end.height +
        ")"
    );

    if (!this._trackNode) return;

    var rectTracked = textInputGetRect(this._trackNode);
    log(
      "TextInputTest:trackingNodeAt(origin:" +
        info.end.x +
        "," +
        info.end.y +
        ", size:" +
        info.end.width +
        "," +
        info.end.height +
        ")"
    );

    // if the keyboard area doesn't intersect with the tracking node area, nothing need to do.
    if (!Rect.intersects(rectTracked, info.end)) return;

    // assume keyboard at the bottom of screen, calculate the vertical adjustment.
    var adjustVert = Rect.getMaxY(info.end) - Rect.getMinY(rectTracked);
    log("TextInputTest:needAdjustVerticalPosition(" + adjustVert + ")");

    // move all the children node of KeyboardNotificationLayer
    var children = this.children;
    for (var i = 0; i < children.length; ++i) {
      var node = children[i];
      node.y += adjustVert;
    }
  }

  onTouchesEnded(touches, event) {
    var target = event.getCurrentTarget();
    if (!target._trackNode) return;

    // grab first touch
    if (touches.length == 0) return;

    var touch = touches[0];

    // decide the trackNode is clicked.
    log(
      "KeyboardNotificationLayer:clickedAt(" + touch.x + "," + touch.y + ")"
    );

    var rect = textInputGetRect(target._trackNode);
    log(
      "KeyboardNotificationLayer:TrackNode at(origin:" +
        rect.x +
        "," +
        rect.y +
        ", size:" +
        rect.width +
        "," +
        rect.height +
        ")"
    );

    target.onClickTrackNode(Rect.containsPoint(rect, touch));
    log("----------------------------------");
  }

  onMouseUp(event) {
    var target = event.getCurrentTarget();
    if (!target._trackNode) return;

    // decide the trackNode is clicked.
    log(
      "KeyboardNotificationLayer:clickedAt(" + touch.x + "," + touch.y + ")"
    );

    var rect = textInputGetRect(target._trackNode);
    log(
      "KeyboardNotificationLayer:TrackNode at(origin:" +
        rect.x +
        "," +
        rect.y +
        ", size:" +
        rect.width +
        "," +
        rect.height +
        ")"
    );

    target.onClickTrackNode(Rect.containsPoint(rect, touch));
    log("----------------------------------");
  }
}
