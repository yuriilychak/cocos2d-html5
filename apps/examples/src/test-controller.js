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

import { s_pathClose, s_simpleFont_fnt } from "./resources";
import {
  PLATFORM_HTML5,
  PLATFORM_HTML5_WEBGL,
  PLATFORM_JSB,
  PLATFORM_MAC,
  PLATFROM_ANDROID,
  PLATFROM_IOS,
  _setAutoTestCurrentTestName,
  _setAutoTestEnabled,
  autoTestEnabled,
  director,
  winSize
} from "./constants";
import { LINE_SPACE, curPos, testNames } from "./tests-main-helpers";
import {
  Color,
  Director,
  EventListener,
  EventManager,
  EventMouse,
  Game,
  Layer,
  LabelTTF,
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
  helper
} from "@aspect/ccui";
import {
  Menu,
  MenuItemFont,
  MenuItemImage,
  MenuItemLabel,
  MenuItemToggle
} from "@aspect/menus";

export class TestController extends Layer {
  constructor() {
    super();

    this._itemMenu = null;

    this._beginPos = 0;

    this.isMouseDown = false;

    var winSizeLocal = Director.getInstance().getWinSize();

    // background layout with scale9 image
    const PADDING = 12;
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
    bg.loadTexture("squere_shadow_0.png", Widget.PLIST_TEXTURE);
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
    header.loadTexture("squere_shadow_4.png", Widget.PLIST_TEXTURE);
    header.setCapInsets(new Rect(12, 12, 12, 12));
    header.setColor(new Color(0x35, 0x39, 0x41));

    header.setContentSize(winSizeLocal.width, 56);

    header.x = winSizeLocal.width / 2;
    header.y = winSizeLocal.height - header.height / 2;

    this.addChild(header, 1);

    this._bgLayout = layout;
    this._resizeListener = null;

    var subItem1 = new MenuItemFont("Automated Test: Off");
    subItem1.fontSize = 18;
    var subItem2 = new MenuItemFont("Automated Test: On");
    subItem2.fontSize = 18;

    var toggleAutoTestItem = new MenuItemToggle(subItem1, subItem2);
    toggleAutoTestItem.setCallback(this.onToggleAutoTest, this);
    toggleAutoTestItem.x = winSize.width - toggleAutoTestItem.width / 2 - 10;
    toggleAutoTestItem.y = 20;
    toggleAutoTestItem.setVisible(false);
    if (autoTestEnabled) toggleAutoTestItem.setSelectedIndex(1);

    // sort the test title
    testNames.sort(function (first, second) {
      if (first.title > second.title) {
        return 1;
      }
      return -1;
    });

    // add menu items for tests
    this._itemMenu = new Menu(); //item menu is where all the label goes, and the one gets scrolled

    for (var i = 0, len = testNames.length; i < len; i++) {
      var label = new LabelTTF(i + 1 + ". " + testNames[i].title, "Arial", 24);
      var menuItem = new MenuItemLabel(label, this.onMenuCallback, this);
      this._itemMenu.addChild(menuItem, i + 10000);
      menuItem.x = winSize.width / 2;
      menuItem.y = winSize.height - (i + 1) * LINE_SPACE;

      // enable disable
      if (!Sys.getInstance().isNative) {
        if (!RendererConfig.getInstance().isCanvas) {
          menuItem.enabled =
            (testNames[i].platforms & PLATFORM_HTML5) |
            (testNames[i].platforms & PLATFORM_HTML5_WEBGL);
        } else {
          menuItem.setEnabled(testNames[i].platforms & PLATFORM_HTML5);
        }
      } else {
        if (Sys.getInstance().os == Sys.getInstance().OS_ANDROID) {
          menuItem.setEnabled(
            testNames[i].platforms & (PLATFORM_JSB | PLATFROM_ANDROID)
          );
        } else if (Sys.getInstance().os == Sys.getInstance().OS_IOS) {
          menuItem.setEnabled(
            testNames[i].platforms & (PLATFORM_JSB | PLATFROM_IOS)
          );
        } else if (Sys.getInstance().os == Sys.getInstance().OS_OSX) {
          menuItem.setEnabled(
            testNames[i].platforms & (PLATFORM_JSB | PLATFORM_MAC)
          );
        } else {
          menuItem.setEnabled(testNames[i].platforms & PLATFORM_JSB);
        }
      }
    }

    this._itemMenu.width = winSize.width;
    this._itemMenu.height = (testNames.length + 1) * LINE_SPACE;
    this._itemMenu.x = curPos.x;
    this._itemMenu.y = curPos.y;
    this.addChild(this._itemMenu);

    var title = new TextBMFont("Examples", s_simpleFont_fnt);

    title.x = winSizeLocal.width / 2;
    title.y = winSizeLocal.height - 24;
    title.fontSize = 32;
    this.addChild(title, 2);

    // close BMButton
    const closeBtn = new BMButton(
      "rounded_shadow_2.png",
      "rounded_shadow_2.png",
      "rounded_shadow_2.png",
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
    closeBtn.x = winSizeLocal.width - closeBtn.width / 2 - 12;
    closeBtn.y = winSizeLocal.height - closeBtn.height / 2 - 12;
    this.addChild(closeBtn, 2);

    // 'browser' can use touches or mouse.
    // The benefit of using 'touches' in a browser, is that it works both with mouse events or touches events
    if ("touches" in Sys.getInstance().capabilities) {
      EventManager.getInstance().addListener(
        {
          event: EventListener.TOUCH_ALL_AT_ONCE,
          onTouchesMoved: function (touches, event) {
            var target = event.getCurrentTarget();
            var delta = touches[0].getDelta();
            target.moveMenu(delta);
            return true;
          }
        },
        this
      );
    } else if ("mouse" in Sys.getInstance().capabilities) {
      EventManager.getInstance().addListener(
        {
          event: EventListener.MOUSE,
          onMouseMove: function (event) {
            if (event.getButton() == EventMouse.BUTTON_LEFT)
              event.getCurrentTarget().moveMenu(event.getDelta());
          },
          onMouseScroll: function (event) {
            var delta = Sys.getInstance().isNative
              ? event.getScrollY() * 6
              : -event.getScrollY();
            event.getCurrentTarget().moveMenu({ y: delta });
            return true;
          }
        },
        this
      );
    }
  }
  onEnter() {
    super.onEnter();
    this._itemMenu.y = TestController.YOffset;
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
  onMenuCallback(sender) {
    TestController.YOffset = this._itemMenu.y;
    var idx = sender.getLocalZOrder() - 10000;
    // get the userdata, it's the index of the menu item clicked
    // create the test scene and run it

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
  onToggleAutoTest() {
    _setAutoTestEnabled(!autoTestEnabled);
  }

  moveMenu(delta) {
    var newY = this._itemMenu.y + delta.y;
    if (newY < 0) newY = 0;

    if (newY > (testNames.length + 1) * LINE_SPACE - winSize.height)
      newY = (testNames.length + 1) * LINE_SPACE - winSize.height;

    this._itemMenu.y = newY;
  }
}

TestController.YOffset = 0;
