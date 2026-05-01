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

import { AtlasDemo } from "./atlas-demo";
import { director } from "../constants";

export class LabelTTFAlignment extends AtlasDemo {
  constructor() {
    //----start24----ctor
    super();
    var s = director.getWinSize();
    var ttf0 = new cc.LabelTTF(
      "Alignment 0\nnew line",
      "Arial",
      12,
      new cc.Size(256, 32),
      cc.TEXT_ALIGNMENT_LEFT
    );
    ttf0.x = s.width / 2;
    ttf0.y = (s.height / 6) * 2;
    ttf0.anchorX = 0.5;
    ttf0.anchorY = 0.5;
    this.addChild(ttf0);

    var ttf1 = new cc.LabelTTF(
      "Alignment 1\nnew line",
      "Arial",
      12,
      new cc.Size(256, 32),
      cc.TEXT_ALIGNMENT_CENTER
    );
    ttf1.x = s.width / 2;
    ttf1.y = (s.height / 6) * 3;
    ttf1.anchorX = 0.5;
    ttf1.anchorY = 0.5;
    this.addChild(ttf1);

    var ttf2 = new cc.LabelTTF(
      "Alignment 2\nnew line",
      "Arial",
      12,
      new cc.Size(256, 32),
      cc.TEXT_ALIGNMENT_RIGHT
    );
    ttf2.x = s.width / 2;
    ttf2.y = (s.height / 6) * 4;
    ttf2.anchorX = 0.5;
    ttf2.anchorY = 0.5;
    this.addChild(ttf2);
    //----end24----
  }
  title() {
    return "cc.LabelTTF alignment";
  }
  subtitle() {
    return "Tests alignment values";
  }

  //
  // Automation
  //
  getExpectedResult() {
    // yellow, red, green, blue, yellow
    var ret = [
      { r: 255, g: 255, b: 0 },
      { r: 255, g: 0, b: 0 },
      { r: 0, g: 255, b: 0 },
      { r: 0, g: 0, b: 255 },
      { r: 255, g: 255, b: 0 }
    ];
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var ret = [];
    for (var i = 0; i < 5; i++) {
      var ch = this.label.getChildByTag(i).getDisplayedColor();
      ret.push(ch);
    }

    return JSON.stringify(ret);
  }
}
