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

export class LabelTTFMultiline extends AtlasDemo {
  constructor() {
    //----start20----ctor
    super();

    this.pixel = { 0: 255, 1: 255, 2: 255, 3: 255 };
    var s = director.getWinSize();

    // cc.LabelBMFont
    var center = new cc.LabelTTF(
      "word wrap \"testing\" (bla0) bla1 'bla2' [bla3] (bla4) {bla5} {bla6} [bla7] (bla8) [bla9] 'bla0' \"bla1\"",
      "Arial",
      32,
      new cc.Size(s.width / 2, 200),
      cc.TEXT_ALIGNMENT_CENTER,
      cc.VERTICAL_TEXT_ALIGNMENT_TOP
    );
    center.setDimensions(s.width / 2, 200);
    center.x = s.width / 2;
    center.y = 150;

    this.addChild(center);
    //----end20----
  }
  title() {
    return "Testing cc.LabelTTF Word Wrap";
  }
  subtitle() {
    return "Word wrap using cc.LabelTTF";
  }

  //
  // Automation
  //

  getExpectedResult() {
    // var ret = [{"0":0,"1":0,"2":226,"3":255},{"0":47,"1":0,"2":0,"3":255},{"0":0,"1":47,"2":0,"3":255}];
    var s = director.getWinSize();
    var ret = { center: "yes" };
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var s = director.getWinSize();
    var ret2 = this.readPixels(s.width / 2, 125, 100, 100);

    var ret = { center: this.containsPixel(ret2, this.pixel) ? "yes" : "no" };

    return JSON.stringify(ret);
  }
}
