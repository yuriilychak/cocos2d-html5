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

import { UILayoutComponentTest } from "./uilayout-component-test";
import { Sprite } from "@aspect/core";
import { LayoutComponent, helper } from "@aspect/ccui";

export class UILayoutComponent_Berth_Test extends UILayoutComponentTest {
  init() {
    if (super.init()) {
      var leftTopSprite = new Sprite("ccs-res/cocosui/CloseSelected.png");
      var leftTop = LayoutComponent.bindLayoutComponent(leftTopSprite);
      leftTop.setHorizontalEdge(LayoutComponent.horizontalEdge.LEFT);
      leftTop.setVerticalEdge(LayoutComponent.verticalEdge.TOP);
      this._baseLayer.addChild(leftTopSprite);

      var leftBottomSprite = new Sprite("ccs-res/cocosui/CloseSelected.png");
      var leftBottom =
        LayoutComponent.bindLayoutComponent(leftBottomSprite);
      leftBottom.setHorizontalEdge(LayoutComponent.horizontalEdge.LEFT);
      leftBottom.setVerticalEdge(LayoutComponent.verticalEdge.BOTTOM);
      this._baseLayer.addChild(leftBottomSprite);

      var rightTopSprite = new Sprite("ccs-res/cocosui/CloseSelected.png");
      var rightTop = LayoutComponent.bindLayoutComponent(rightTopSprite);
      rightTop.setHorizontalEdge(LayoutComponent.horizontalEdge.RIGHT);
      rightTop.setVerticalEdge(LayoutComponent.verticalEdge.TOP);
      this._baseLayer.addChild(rightTopSprite);

      var rightBottomSprite = new Sprite(
        "ccs-res/cocosui/CloseSelected.png"
      );
      var rightBottom =
        LayoutComponent.bindLayoutComponent(rightBottomSprite);
      rightBottom.setHorizontalEdge(LayoutComponent.horizontalEdge.RIGHT);
      rightBottom.setVerticalEdge(LayoutComponent.verticalEdge.BOTTOM);
      this._baseLayer.addChild(rightBottomSprite);

      helper.doLayout(this._baseLayer);
      return true;
    }
    return false;
  }
}
