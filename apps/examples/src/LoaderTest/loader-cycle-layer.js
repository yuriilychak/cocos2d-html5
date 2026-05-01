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

import { BaseTestLayer } from "../BaseTestLayer/BaseTestLayer";
import { LoaderTestLayer } from "./loader-test-layer";
import { Color, Director, LabelTTF } from "@aspect/core";

export class LoaderCycleLayer extends BaseTestLayer {
  constructor() {
    super();

    this._title = "Failed to load Test";

    this._subtitle = "";

    var winSize = Director.getInstance().getWinSize();

    var resultTTF = new LabelTTF("result: unknown");
    resultTTF.x = winSize.width / 2;
    resultTTF.y = winSize.height / 2;
    this.addChild(resultTTF);

    var cb = function (num) {
      if (num === 1) {
        resultTTF.setColor(Color.GREEN);
        resultTTF.setString("result: success");
      } else {
        resultTTF.setColor(Color.RED);
        resultTTF.setString("result: failed");
      }
    };
    this.createInfo();
    this.regLoad();
    this.test(cb);
  }

  regLoad() {
    cc.loader.register(["_test1"], {
      load: function (realUrl, url, res, cb) {
        cc.loader.cache[url] = {};
        setTimeout(function () {
          cb && cb(null, cc.loader.cache[url]);
          return cc.loader.cache[url];
        }, Math.random() * 1000);
      }
    });
    cc.loader.register(["_test2"], {
      load: function (realUrl, url, res, cb) {
        cb && cb({}, null);
        return null;
      }
    });
  }

  get list() {
    return ["1._test2", "1._test1", "2._test1", "3._test1", "4._test1"];
  }

  createInfo() {
    var winSize = Director.getInstance().getWinSize();
    var info1 = new LabelTTF("Load 5 files");
    info1.x = winSize.width / 2;
    info1.y = winSize.height / 2 + 80;
    var info2 = new LabelTTF("1 file does not exist");
    info2.x = winSize.width / 2;
    info2.y = winSize.height / 2 + 60;
    var info3 = new LabelTTF("The other 4 files should be loaded.");
    info3.x = winSize.width / 2;
    info3.y = winSize.height / 2 + 40;

    this.addChild(info1);
    this.addChild(info2);
    this.addChild(info3);
  }

  test(cb) {
    this.clearRes();
    var layer = this;
    cc.loader.load(layer.list, function () {
      var num = 0;
      layer.list.forEach(function (item) {
        if (!cc.loader.getRes(item)) {
          num++;
        }
      });
      cb(num);
    });
  }

  clearRes() {
    this.list.forEach(function (item) {
      cc.loader.release(item);
    });
  }

  onRestartCallback() {
    var parent = this.getParent();
    parent.removeChild(this);
    parent.addChild(new LoaderCycleLayer());
  }

  onBackCallback() {
    var parent = this.getParent();
    parent.removeChild(this);
    parent.addChild(new LoaderTestLayer());
  }
}
