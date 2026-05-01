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

export class RemoteTextureTest extends TextureCacheTestBase {
  constructor() {
    super();
    this._title = "Remote Texture Test";
    this._subtitle = "";
    this._remoteTex = "http://www.cocos2d-x.org/images/logo.png";
  }

  onEnter() {
    super.onEnter();
    if ("opengl" in cc.sys.capabilities && !cc.sys.isNative) {
      var label = new cc.LabelTTF(
        "Not support Loading texture from remote site on HTML5-WebGL",
        "Times New Roman",
        28
      );
      label.x = winSize.width / 2;
      label.y = winSize.height / 2;
      this.addChild(label, 100);
    } else this.scheduleOnce(this.startDownload, 0.1);
  }

  startDownload() {
    var imageUrlArray = [
      "http://www.cocos2d-x.org/s/upload/v35.jpg",
      "http://www.cocos2d-x.org/s/upload/testin.jpg",
      "http://www.cocos2d-x.org/s/upload/geometry_dash.jpg",
      "http://www.cocos2d-x.org/images/logo.png"
    ];

    for (var i = 0; i < imageUrlArray.length; i++) {
      cc.textureCache.addImageAsync(imageUrlArray[i], this.texLoaded, this);
    }

    cc.loader.loadImg(
      "http://www.cocos2d-x.org/no_such_file.jpg",
      this.failLoaded.bind(this)
    );
  }

  texLoaded(texture) {
    if (texture instanceof cc.Texture2D) {
      cc.log("Remote texture loaded");

      var sprite = new cc.Sprite(texture);
      sprite.x = cc.winSize.width / 2;
      sprite.y = cc.winSize.height / 2;
      this.addChild(sprite);
    } else {
      cc.log("Fail to load remote texture");
    }
  }

  failLoaded(err, img) {
    var str = "";
    if (err) {
      str = "Correct behavior: failed to download from wrong url";
    } else {
      str = "!!! Wrong behavior: succeed to download from wrong url";
    }

    var label = new cc.LabelTTF(str, "Times New Roman", 28);
    label.x = winSize.width / 2;
    label.y = winSize.height / 2;
    this.addChild(label, 100);
  }
}
