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

/// LabelTTFA8Test
import { AtlasDemo } from "./atlas-demo";
import { director } from "../constants";
import { Color, LabelTTF } from "@aspect/core";
import { LabelBMFont } from "@aspect/labels";
import { FadeIn, FadeOut, sequence } from "@aspect/actions";

export class LabelTTFA8Test extends AtlasDemo {
  constructor() {
    //----start22----ctor
    super();
    var s = director.getWinSize();

    var layer = new cc.LayerColor(new Color(128, 128, 128, 255));
    this.addChild(layer, -10);

    // LabelBMFont
    var label1 = new LabelTTF("Testing A8 Format", "Arial", 48);
    this.addChild(label1);
    label1.color = new Color(255, 0, 0);
    label1.x = s.width / 2;
    label1.y = s.height / 2;

    var fadeOut = new FadeOut(2);
    var fadeIn = new FadeIn(2);
    var seq = sequence(fadeOut, fadeIn);
    var forever = seq.repeatForever();
    label1.runAction(forever);
    //----end22----
  }
  title() {
    return "Testing A8 Format";
  }
  subtitle() {
    return "RED label, fading In and Out in the center of the screen";
  }
}
