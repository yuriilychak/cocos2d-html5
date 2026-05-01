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
import { Point, Color } from "@aspect/core";

export class UILabelTest_Effect extends UIMainLayer {
  init() {
    if (super.init()) {
      var widgetSize = this._widget.getContentSize();

      this._bottomDisplayLabel.setString("");

      var alert = new ccui.Text();
      alert.setString("Label Effect");
      alert.setFontName("Marker Felt");
      alert.setFontSize(30);
      alert.setColor(new Color(159, 168, 176));
      alert.setPosition(
        widgetSize.width / 2,
        widgetSize.height / 2 - alert.height * 3.05
      );
      this._mainNode.addChild(alert);

      // create the shadow only label
      var shadow_label = new ccui.Text();

      shadow_label.enableShadow(Color.GRAY, new Point(10, -10));
      shadow_label.setString("Shadow");
      shadow_label.setPosition(
        widgetSize.width / 2,
        widgetSize.height / 2 + shadow_label.height
      );

      this._mainNode.addChild(shadow_label);

      // create the stroke only label
      var glow_label = new ccui.Text();
      glow_label.setFontName("Marker Felt");
      glow_label.setString("Glow");
      glow_label.enableGlow(Color.RED);
      glow_label.setPosition(widgetSize.width / 2, widgetSize.height / 2);
      this._mainNode.addChild(glow_label);

      // create the label stroke and shadow
      var outline_label = new ccui.Text();
      outline_label.enableOutline(Color.BLUE, 2);
      outline_label.setString("Outline");
      outline_label.setPosition(
        widgetSize.width / 2,
        widgetSize.height / 2 - shadow_label.height
      );

      this._mainNode.addChild(outline_label);

      return true;
    }
  }
}
