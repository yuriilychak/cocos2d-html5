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
  PLATFORM_HTML5,
  PLATFORM_HTML5_WEBGL,
  PLATFORM_JSB,
  PLATFORM_MAC,
  PLATFROM_ANDROID,
  PLATFROM_IOS,
  _setAutoTestCurrentTestName
} from "./constants";
import { testNames } from "./tests-main-helpers";
import {
  Color,
  Director,
  EventManager,
  Game,
  Layer,
  LoaderScene,
  Rect,
  RendererConfig,
  Sys
} from "@aspect/core";
import {
  ImageView,
  Layout,
  LayoutComponent,
  TextBMFont,
  Widget,
  BMButton,
  ListView,
  ScrollView,
  helper
} from "@aspect/ccui";

export class TestController extends Layer {
  constructor() {
    super();

    this._listView = null;
    this._resizeListener = null;

    const winSizeLocal = Director.getInstance().getWinSize();
    const PADDING = 12;
    const HEADER_HEIGHT = 56;
    const ITEM_HEIGHT = 44;
    const ITEM_MARGIN = 6;

    // background layout with scale9 image
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

    const header = new ImageView();
    header.setScale9Enabled(true);
    header.ignoreContentAdaptWithSize(false);
    header.loadTexture(
      "default_theme/squere_shadow_4.png",
      Widget.PLIST_TEXTURE
    );
    header.setCapInsets(new Rect(12, 12, 12, 12));
    header.setColor(new Color(0x35, 0x39, 0x41));
    header.setContentSize(winSizeLocal.width, HEADER_HEIGHT);
    header.x = winSizeLocal.width / 2;
    header.y = winSizeLocal.height - HEADER_HEIGHT / 2;
    this.addChild(header, 1);

    this._bgLayout = layout;

    // header title
    const title = new TextBMFont("Examples", s_simpleFont_fnt);
    title.x = winSizeLocal.width / 2;
    title.y = winSizeLocal.height - HEADER_HEIGHT / 2;
    title.fontSize = 32;
    this.addChild(title, 2);

    // close button in header
    const closeBtn = new BMButton(
      "default_theme/rounded_shadow_2.png",
      "default_theme/rounded_shadow_2.png",
      "default_theme/rounded_shadow_2.png",
      Widget.PLIST_TEXTURE
    );
    closeBtn.setScale9Enabled(true);
    closeBtn.setCapInsets(new Rect(12, 12, 12, 12));
    closeBtn.setContentSize(80, 32);
    closeBtn.setTitleFntFile(s_simpleFont_fnt);
    closeBtn.setTitleText("Close");
    closeBtn.setTitleFontSize(18);
    closeBtn.setNormalBgColor(new Color(0xff, 0x00, 0x00));
    closeBtn.setPressedBgColor(new Color(0xdd, 0x00, 0x00));
    closeBtn.setDisabledBgColor(new Color(0x55, 0x55, 0x55));
    closeBtn.pressedActionEnabled = true;
    closeBtn.addClickEventListener(() => this.onCloseCallback());
    closeBtn.x = winSizeLocal.width - closeBtn.width / 2 - PADDING;
    closeBtn.y =
      winSizeLocal.height -
      closeBtn.height / 2 -
      (HEADER_HEIGHT - closeBtn.height) / 2;
    this.addChild(closeBtn, 2);

    // sort tests alphabetically
    testNames.sort((a, b) => (a.title > b.title ? 1 : -1));

    // test list view
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
    listView.setBackGroundImage("default_theme/rounded_shadow_2.png", Widget.PLIST_TEXTURE);
    listView.setBackGroundImageCapInsets(new Rect(12, 12, 12, 12));
    listView.setBackGroundImageColor(new Color(0x33, 0x33, 0x33));

    for (let i = 0; i < testNames.length; i++) {
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
      btn.setTitleText(i + 1 + ". " + testNames[i].title);
      btn.setTitleFontSize(16);
      btn.setNormalBgColor(new Color(0x66, 0x66, 0x66));
      btn.setPressedBgColor(new Color(0x44, 0x44, 0x44));
      btn.setDisabledBgColor(new Color(0x88, 0x88, 0x88));
      btn.pressedActionEnabled = true;
      btn.setEnabled(this._isTestEnabled(testNames[i]));
      const idx = i;
      btn.addClickEventListener(() => this.onMenuCallback(idx));
      listView.pushBackCustomItem(btn);
    }

    this._listView = listView;
    this.addChild(listView, 5);
  }
  onEnter() {
    super.onEnter();
    if (TestController.YOffset !== 0) {
      this._listView.setInnerContainerPosition({
        x: 0,
        y: TestController.YOffset
      });
    }
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

  onMenuCallback(idx) {
    TestController.YOffset = this._listView.getInnerContainerPosition().y;
    _setAutoTestCurrentTestName(testNames[idx].title);

    var testCase = testNames[idx];
    var res = testCase.resource || [];
    LoaderScene.getInstance().preload(
      res,
      function () {
        var scene = testCase.testScene();
        if (scene) {
          scene.runThisTest();
        }
      },
      this
    );
  }

  onCloseCallback() {
    if (Sys.getInstance().isNative) {
      Game.getInstance().end();
    } else {
      window.history && window.history.go(-1);
    }
  }

  _isTestEnabled(testCase) {
    if (!Sys.getInstance().isNative) {
      if (!RendererConfig.getInstance().isCanvas) {
        return !!(
          (testCase.platforms & PLATFORM_HTML5) |
          (testCase.platforms & PLATFORM_HTML5_WEBGL)
        );
      }
      return !!(testCase.platforms & PLATFORM_HTML5);
    }
    if (Sys.getInstance().os == Sys.getInstance().OS_ANDROID) {
      return !!(testCase.platforms & (PLATFORM_JSB | PLATFROM_ANDROID));
    }
    if (Sys.getInstance().os == Sys.getInstance().OS_IOS) {
      return !!(testCase.platforms & (PLATFORM_JSB | PLATFROM_IOS));
    }
    if (Sys.getInstance().os == Sys.getInstance().OS_OSX) {
      return !!(testCase.platforms & (PLATFORM_JSB | PLATFORM_MAC));
    }
    return !!(testCase.platforms & PLATFORM_JSB);
  }
}

TestController.YOffset = 0;
