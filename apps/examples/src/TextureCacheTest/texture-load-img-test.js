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

import { winSize } from "../constants";
import { TextureCacheTestBase } from "./texture-cache-test-base";

export class TextureLoadImgTest extends TextureCacheTestBase {
  constructor() {
    super();

    this._title = "Load Same Image Twice";

    this._labelFirst = null;

    this._labelSecond = null;

    if ("opengl" in cc.sys.capabilities && !cc.sys.isNative) {
      var label = new cc.LabelTTF(
        "Not support Loading texture from remote site on HTML5-WebGL",
        "Times New Roman",
        28
      );
      label.x = winSize.width / 2;
      label.y = winSize.height / 2;
      this.addChild(label, 100);
      return;
    }

    this._labelFirst = new cc.LabelTTF("load first image");
    this._labelFirst.attr({
      x: cc.winSize.width / 2,
      y: cc.winSize.height / 2 + 30
    });
    this.addChild(this._labelFirst, 1);

    this._labelSecond = new cc.LabelTTF("load second image");
    this._labelSecond.attr({
      x: cc.winSize.width / 2,
      y: cc.winSize.height / 2 - 30
    });
    this.addChild(this._labelSecond, 1);

    var url = "http://www.cocos2d-x.org/images/logo.png";
    cc.textureCache.addImageAsync(url, this.texFirstLoaded, this);
    cc.textureCache.addImageAsync(url, this.texSecondLoaded, this);
  }

  texFirstLoaded(texture) {
    if (!texture) {
      this._labelFirst.setString("texFirstLoaded fail");
      return;
    }

    if (this.sprite) {
      this.removeChild(this.sprite);
    }
    this.sprite = new cc.Sprite(texture);
    this.sprite.x = cc.winSize.width / 2;
    this.sprite.y = cc.winSize.height / 2;
    this.addChild(this.sprite);

    this._labelFirst.setString("texFirstLoaded successful");
  }

  texSecondLoaded(texture) {
    if (!texture) {
      this._labelSecond.setString("texSecondLoaded fail");
      return;
    }

    if (this.sprite2) {
      this.removeChild(this.sprite2);
    }
    this.sprite2 = new cc.Sprite(texture);
    this.sprite2.x = cc.winSize.width / 2;
    this.sprite2.y = cc.winSize.height / 2 + 70;
    this.addChild(this.sprite2);

    this._labelSecond.setString("texSecondLoaded successful");
  }
}
