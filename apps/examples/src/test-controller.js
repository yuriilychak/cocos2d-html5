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
import { LoaderScene, ServiceLocator } from "@aspect/core";
import { MenuTestLayer } from "./menu-test-layer";

export class TestController extends MenuTestLayer {
  constructor() {
    testNames.sort((a, b) => (a.title > b.title ? 1 : -1));

    const menuItems = testNames.map((testCase, i) => ({
      title: `${i + 1}. ${testCase.title}`,
      enabled: TestController._isTestEnabled(testCase)
    }));

    super(menuItems);
  }

  onEnter() {
    super.onEnter();
    if (TestController.YOffset !== 0) {
      this._listView.setInnerContainerPosition({
        x: 0,
        y: TestController.YOffset
      });
    }
  }

  onItemCallback(idx) {
    TestController.YOffset = this._listView.getInnerContainerPosition().y;
    _setAutoTestCurrentTestName(testNames[idx].title);

    const testCase = testNames[idx];
    const res = testCase.resource || [];
    LoaderScene.getInstance().preload(
      res,
      function () {
        const scene = testCase.testScene();
        if (scene) {
          scene.runThisTest();
        }
      },
      this
    );
  }

  static _isTestEnabled(testCase) {
    if (!ServiceLocator.sys.isNative) {
      if (!ServiceLocator.rendererConfig.isCanvas) {
        return !!(
          (testCase.platforms & PLATFORM_HTML5) |
          (testCase.platforms & PLATFORM_HTML5_WEBGL)
        );
      }
      return !!(testCase.platforms & PLATFORM_HTML5);
    }
    if (ServiceLocator.sys.os == ServiceLocator.sys.OS_ANDROID) {
      return !!(testCase.platforms & (PLATFORM_JSB | PLATFROM_ANDROID));
    }
    if (ServiceLocator.sys.os == ServiceLocator.sys.OS_IOS) {
      return !!(testCase.platforms & (PLATFORM_JSB | PLATFROM_IOS));
    }
    if (ServiceLocator.sys.os == ServiceLocator.sys.OS_OSX) {
      return !!(testCase.platforms & (PLATFORM_JSB | PLATFORM_MAC));
    }
    return !!(testCase.platforms & PLATFORM_JSB);
  }
}

TestController.YOffset = 0;
