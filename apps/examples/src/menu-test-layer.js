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

import { s_simpleFont_fnt } from "./resources";
import {
  Color,
  Director,
  EventManager,
  Layer,
  Rect
} from "@aspect/core";
import {
  BMButton,
  ImageView,
  Layout,
  LayoutComponent,
  ListView,
  Widget,
  helper
} from "@aspect/ccui";

const HEADER_HEIGHT = 56;

/**
 * Base layer that renders a scrollable menu list.
 * The header (title, close button) is provided by the parent TestScene.
 *
 * @param {{ title: string, enabled?: boolean }[]} menuItems - List of menu entries.
 */
export class MenuTestLayer extends Layer {
  constructor(menuItems) {
    super();

    this._listView = null;
    this._resizeListener = null;
    this._bgLayout = null;

    const winSizeLocal = Director.getInstance().getWinSize();
    const PADDING = 12;
    const ITEM_HEIGHT = 44;
    const ITEM_MARGIN = 6;

    const layout = new Layout();
    layout.setContentSize(winSizeLocal.width, winSizeLocal.height);
    layout.x = 0;
    layout.y = 0;

    const layoutComp = layout._getOrCreateLayoutComponent();
    layoutComp.setHorizontalEdge(LayoutComponent.horizontalEdge.CENTER);
    layoutComp.setStretchWidthEnabled(true);
    layoutComp.setLeftMargin(0);
    layoutComp.setRightMargin(0);
    layoutComp.setVerticalEdge(LayoutComponent.verticalEdge.CENTER);
    layoutComp.setStretchHeightEnabled(true);
    layoutComp.setBottomMargin(0);
    layoutComp.setTopMargin(0);

    const bg = new ImageView();
    bg.setScale9Enabled(true);
    bg.ignoreContentAdaptWithSize(false);
    bg.loadTexture("default_theme/squere_shadow_0.png", Widget.PLIST_TEXTURE);
    bg.setCapInsets(new Rect(12, 12, 12, 12));
    bg.setColor(new Color(0x35, 0x39, 0x41));

    const bgComp = bg._getOrCreateLayoutComponent();
    bgComp.setHorizontalEdge(LayoutComponent.horizontalEdge.CENTER);
    bgComp.setStretchWidthEnabled(true);
    bgComp.setLeftMargin(0);
    bgComp.setRightMargin(0);
    bgComp.setVerticalEdge(LayoutComponent.verticalEdge.CENTER);
    bgComp.setStretchHeightEnabled(true);
    bgComp.setBottomMargin(0);
    bgComp.setTopMargin(0);

    layout.addChild(bg, -1);
    this.addChild(layout, -1);
    this._bgLayout = layout;

    const listWidth = winSizeLocal.width - PADDING * 2;
    const listHeight = winSizeLocal.height - HEADER_HEIGHT - PADDING * 2;

    const listView = new ListView();
    listView.setTouchEnabled(true);
    listView.setBounceEnabled(true);
    listView.setGravity(ListView.GRAVITY_CENTER_HORIZONTAL);
    listView.setItemsMargin(ITEM_MARGIN);
    listView.setScrollContainerPadding(24);
    listView.setContentSize(listWidth, listHeight);
    listView.x = PADDING;
    listView.y = PADDING;
    listView.setScrollBarThumbTexture(
      "default_theme/thumb.png",
      new Rect(3, 3, 3, 3),
      new Color(0xaa, 0xaa, 0xaa)
    );
    listView.setBackGroundImageScale9Enabled(true);
    listView.setBackGroundImage(
      "default_theme/rounded_shadow_2.png",
      Widget.PLIST_TEXTURE
    );
    listView.setBackGroundImageCapInsets(new Rect(12, 12, 12, 12));
    listView.setBackGroundImageColor(new Color(0x33, 0x33, 0x33));

    for (let i = 0; i < menuItems.length; i++) {
      const item = menuItems[i];
      const btn = new BMButton(
        "default_theme/rounded_shadow_2.png",
        "default_theme/rounded_shadow_2.png",
        "default_theme/rounded_shadow_2.png",
        Widget.PLIST_TEXTURE
      );
      btn.setScale9Enabled(true);
      btn.setCapInsets(new Rect(12, 12, 12, 12));
      btn.setContentSize(listWidth - 24 * 2, ITEM_HEIGHT);
      btn.setTitleFntFile(s_simpleFont_fnt);
      btn.setTitleText(item.title);
      btn.setTitleFontSize(16);
      btn.setNormalBgColor(new Color(0x66, 0x66, 0x66));
      btn.setPressedBgColor(new Color(0x44, 0x44, 0x44));
      btn.setDisabledBgColor(new Color(0x88, 0x88, 0x88));
      btn.pressedActionEnabled = true;
      btn.setEnabled(item.enabled !== false);
      const idx = i;
      btn.addClickEventListener(() => this.onItemCallback(idx));
      listView.pushBackCustomItem(btn);
    }

    this._listView = listView;
    this.addChild(listView, 5);
  }

  onEnter() {
    super.onEnter();
    helper.doLayout(this);
    this._resizeListener = EventManager.getInstance().addCustomListener(
      "canvas-resize",
      () => {
        this.setContentSize(Director.getInstance().getWinSize());
        helper.doLayout(this);
      },
      this
    );
  }

  onExit() {
    EventManager.getInstance().removeListener(this._resizeListener);
    this._resizeListener = null;
    super.onExit();
  }

  onItemCallback(_idx) {
    // Override in subclasses to handle menu item selection.
  }
}
