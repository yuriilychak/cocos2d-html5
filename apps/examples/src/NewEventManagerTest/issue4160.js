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

import { EventDispatcherTestDemo } from "./event-dispatcher-test-demo";
import { TouchableSprite } from "./touchable-sprite";
import { Color, ServiceLocator } from "@aspect/core";

export class Issue4160 extends EventDispatcherTestDemo {
  constructor() {
    //----start10----ctor
    super();
    var origin = ServiceLocator.director.getVisibleOrigin();
    var size = ServiceLocator.director.getVisibleSize();

    var sprite1 = TouchableSprite.create(-30);
    sprite1.color = new Color(0, 255, 255);
    sprite1.x = origin.x + size.width / 2 - 80;
    sprite1.y = origin.y + size.height / 2 + 40;
    this.addChild(sprite1, 5);

    var sprite2 = TouchableSprite.create(-20);
    sprite2.color = new Color(255, 0, 255);
    sprite2.removeListenerOnTouchEnded(true);
    sprite2.x = origin.x + size.width / 2;
    sprite2.y = origin.y + size.height / 2;
    this.addChild(sprite2, 10);

    var sprite3 = TouchableSprite.create(-10);
    sprite3.color = new Color(255, 255, 0);
    sprite3.x = 0;
    sprite3.y = 0;
    sprite2.addChild(sprite3, 21);
    //----end10----
  }

  title() {
    return "Issue 4160: Out of range exception";
  }

  subtitle() {
    return "Touch the red block twice \n should not crash and the red one couldn't be touched";
  }
}
