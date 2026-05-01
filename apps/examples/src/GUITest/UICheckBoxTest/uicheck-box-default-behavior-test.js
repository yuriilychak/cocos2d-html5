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

export class UICheckBoxDefaultBehaviorTest extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();

      // Add a label in which the checkbox events will be displayed
      this._displayValueLabel = new ccui.Text("No Event", "Marker Felt", 32);
      this._displayValueLabel.setAnchorPoint(new Point(0.5, -1));
      this._displayValueLabel.setPosition(
        new Point(widgetSize.width / 2, widgetSize.height / 2)
      );
      this._mainNode.addChild(this._displayValueLabel);
      this._bottomDisplayLabel.setString("");

      // Add the alert
      var alert = new ccui.Text(
        "Only left two can be clicked!",
        "Marker Felt",
        20
      );
      alert.setColor(new Color(159, 168, 176));
      alert.setPosition(
        new Point(
          widgetSize.width / 2,
          widgetSize.height / 2 - alert.getContentSize().height * 1.75
        )
      );
      this._mainNode.addChild(alert);

      // Create the checkbox
      var checkBox = new ccui.CheckBox(
        "ccs-res/cocosui/check_box_normal.png",
        "ccs-res/cocosui/check_box_active.png"
      );
      checkBox.setPosition(
        new Point(widgetSize.width / 2 - 50, widgetSize.height / 2)
      );

      this._mainNode.addChild(checkBox);

      // Create the checkbox
      var checkBox2 = new ccui.CheckBox(
        "ccs-res/cocosui/check_box_normal.png",
        "ccs-res/cocosui/check_box_active.png"
      );
      checkBox2.setPosition(
        new Point(widgetSize.width / 2 - 150, widgetSize.height / 2)
      );
      checkBox2.ignoreContentAdaptWithSize(false);
      checkBox2.setZoomScale(0.5);
      checkBox2.setContentSize(new Size(80, 80));
      checkBox2.setName("bigCheckBox");
      this._mainNode.addChild(checkBox2);

      // Create the checkbox
      var checkBoxDisabled = new ccui.CheckBox(
        "ccs-res/cocosui/check_box_normal.png",
        "ccs-res/cocosui/check_box_active.png"
      );
      checkBoxDisabled.setPosition(
        new Point(widgetSize.width / 2 + 20, widgetSize.height / 2)
      );
      checkBoxDisabled.setEnabled(false);
      checkBoxDisabled.setBright(false);
      this._mainNode.addChild(checkBoxDisabled);

      var checkBoxDisabled2 = new ccui.CheckBox(
        "ccs-res/cocosui/check_box_normal.png",
        "ccs-res/cocosui/check_box_active.png"
      );
      checkBoxDisabled2.setPosition(
        new Point(widgetSize.width / 2 + 70, widgetSize.height / 2)
      );
      checkBoxDisabled2.setEnabled(false);
      checkBoxDisabled2.setBright(false);
      checkBoxDisabled2.setSelected(true);
      this._mainNode.addChild(checkBoxDisabled2);
      return true;
    }
  }
}
