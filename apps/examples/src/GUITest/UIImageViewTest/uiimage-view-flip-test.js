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
import { Point, Size, ServiceLocator } from "@aspect/core";
import { Button, ImageView, Widget } from "@aspect/ccui";

export class UIImageViewFlipTest extends UIMainLayer {
  init() {
    if (super.init()) {
      ServiceLocator.spriteFrameCache.addSpriteFrames("Images/blocks9ss.plist");
      var widgetSize = this._widget.getContentSize();

      this._bottomDisplayLabel.string = "ImageView flip test";

      // Create the imageview
      var imageView = new ImageView(
        "blocks9r.png",
        Widget.PLIST_TEXTURE
      );
      imageView.setScale9Enabled(true);
      imageView.setContentSize(new Size(250, 115));
      imageView.setFlippedX(true);
      imageView.scale = 0.5;
      imageView.ignoreContentAdaptWithSize(false);
      imageView.setPosition(
        new Point(widgetSize.width / 2, widgetSize.height / 2)
      );

      this._mainNode.addChild(imageView);

      var toggleButton = new Button();
      toggleButton.setTitleText("Toggle FlipX");
      var ip = imageView.getPosition();
      toggleButton.setPosition(
        ip.x - 50,
        ip.y - imageView.getContentSize().height / 2 - 20
      );
      this.addChild(toggleButton);
      toggleButton.addClickEventListener(function () {
        imageView.setFlippedX(!imageView.isFlippedX());
      });

      var toggleScale9 = new Button();
      toggleScale9.setTitleText("Toggle Scale9");
      var ip9 = imageView.getPosition();
      toggleScale9.setPosition(
        ip9.x + 50,
        ip9.y - imageView.getContentSize().height / 2 - 20
      );
      this.addChild(toggleScale9);
      toggleScale9.addClickEventListener(function () {
        imageView.setScale9Enabled(!imageView.isScale9Enabled());
        //after switching scale9, you must call setContentSize to keep the size not change
        imageView.setContentSize(new Size(250, 115));
      });
      return true;
    }
  }
}
