/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.


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

import { ScriptTestTempLayer } from "./ScriptTestTempFile";
import { SysTestBase } from "./sys-test-base";
import { tempJSFileName } from "./sys-test-helpers";
import { winSize } from "../constants";
import { Point } from "@aspect/core";

export class ScriptTestLayer extends SysTestBase {
  startDownload() {
    if (!cc.sys.isNative) {
      return;
    }
    var that = this;
    var manifestPath = "Manifests/ScriptTest/project.manifest";
    var storagePath =
      (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") +
      "JSBTests/AssetsManagerTest/ScriptTest/";
    cc.log("Storage path for this test : " + storagePath);

    if (this._am) {
      this._am = null;
    }

    this._am = new jsb.AssetsManager(manifestPath, storagePath);
    if (!this._am.getLocalManifest().isLoaded()) {
      cc.log("Fail to update assets, step skipped.");
      that.clickMeShowTempLayer();
    } else {
      var listener = new jsb.EventListenerAssetsManager(this._am, function (
        event
      ) {
        var scene;
        switch (event.getEventCode()) {
          case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
            cc.log("No local manifest file found, skip assets update.");
            that.clickMeShowTempLayer();
            break;
          case jsb.EventAssetsManager.UPDATE_PROGRESSION:
            cc.log(event.getPercent() + "%");
            break;
          case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
          case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
            cc.log("Fail to download manifest file, update skipped.");
            that.clickMeShowTempLayer();
            break;
          case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
          case jsb.EventAssetsManager.UPDATE_FINISHED:
            cc.log("Update finished. " + event.getMessage());
            require(tempJSFileName);
            that.clickMeShowTempLayer();
            break;
          case jsb.EventAssetsManager.UPDATE_FAILED:
            cc.log("Update failed. " + event.getMessage());
            break;
          case jsb.EventAssetsManager.ERROR_UPDATING:
            cc.log(
              "Asset update error: " +
                event.getAssetId() +
                ", " +
                event.getMessage()
            );
            break;
          case jsb.EventAssetsManager.ERROR_DECOMPRESS:
            cc.log(event.getMessage());
            break;
          default:
            break;
        }
      });
      cc.eventManager.addListener(listener, 1);
      this._am.update();
    }
  }
  clickMeShowTempLayer() {
    this.removeChildByTag(233, true);
    this._tempLayer = new ScriptTestTempLayer();
    this.addChild(this._tempLayer, 0, 233);
  }
  clickMeReloadTempLayer() {
    cc.sys.cleanScript(tempJSFileName);
    if (!cc.sys.isNative) {
      this.clickMeShowTempLayer();
    } else {
      this.startDownload();
    }
  }
  onExit() {
    if (this._am) {
      this._am = null;
    }

    super.onExit();
  }
  constructor() {
    super();

    this._tempLayer = null;

    this._am = null;

    var menu = new cc.Menu();
    menu.setPosition(new Point(0, 0));
    menu.width = winSize.width;
    menu.height = winSize.height;
    this.addChild(menu, 1);
    var item1 = new cc.MenuItemLabel(
      new cc.LabelTTF("Click me show tempLayer", "Arial", 22),
      this.clickMeShowTempLayer,
      this
    );
    menu.addChild(item1);

    var item2 = new cc.MenuItemLabel(
      new cc.LabelTTF("Click me reload tempLayer", "Arial", 22),
      this.clickMeReloadTempLayer,
      this
    );
    menu.addChild(item2);

    menu.alignItemsVerticallyWithPadding(8);
    menu.setPosition(Point.add(cc.visibleRect.left, new Point(+180, 0)));
  }

  getTitle() {
    return "ScriptTest only used in native";
  }
}
