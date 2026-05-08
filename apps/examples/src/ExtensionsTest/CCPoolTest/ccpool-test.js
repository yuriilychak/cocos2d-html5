/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 Copyright (c) 2013 James Chen

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

import { MySprite } from "./my-sprite";
import { Color, Point, visibleRect } from "@aspect/core";
import { Menu, MenuItemLabel } from "@aspect/menus";
import { Pool } from "@aspect/ccpool";
import { BaseTestLayer } from "../../BaseTestLayer/BaseTestLayer";
import { s_simpleFont_fnt } from "../../resources";
import { TextBMFont } from "@aspect/ccui";

export class CCPoolTest extends BaseTestLayer {
  constructor() {
    super();
    this._title = "CCPoolTest";
    this._showNavButtons = false;
    this.timeList = null;
    this.init();
  }

  init() {
    this.timeList = {};
    this.initUI();
    return true;
  }
  initUI() {
    var createLabel = new TextBMFont(
      "click me to create\n 150 sprites directly",
      s_simpleFont_fnt
    );
    var reCreateLabel = new TextBMFont(
      "click me to create\n 150 sprites use pool",
      s_simpleFont_fnt
    );
    reCreateLabel.color = new Color(255, 255, 255, 255);
    createLabel.color = new Color(255, 255, 255, 255);
    var menuItem1 = new MenuItemLabel(
      createLabel,
      this.addSpriteByCreate,
      this
    );
    var menuItem2 = new MenuItemLabel(
      reCreateLabel,
      this.addSpriteByPool,
      this
    );
    var menu = new Menu(menuItem1, menuItem2);
    menu.alignItemsHorizontallyWithPadding(150);
    this.directLabel = new TextBMFont("create directly cost:", s_simpleFont_fnt);
    this.poolLabel = new TextBMFont("use pool cost:", s_simpleFont_fnt);
    this.directLabel.setPosition(
      Point.add(visibleRect.center, new Point(-190, -65))
    );
    this.directLabel.anchorY = 0;
    this.poolLabel.setPosition(
      Point.add(visibleRect.center, new Point(200, -65))
    );
    this.poolLabel.anchorY = 0;
    this.addChild(this.directLabel);
    this.addChild(this.poolLabel);
    this.addChild(menu, 100);
  }
  setDirectLabel(time) {
    if (time == 0) {
      time = "<1";
    }
    this.directLabel.string = "create directly cost:" + time + "ms";
  }
  setPoolLabel(time) {
    if (time == 0) {
      time = "<1";
    }
    this.poolLabel.string = "use pool cost:" + time + "ms";
  }
  addSpriteByCreate() {
    this.datalist1 = [];
    this.timeStart("directly");
    for (var i = 0; i < 150; i++) {
      var sp = MySprite.create(1, 2, 3);
      this.datalist1.push(sp);
      this.addChild(sp, 100);
      sp.x = 50 + 8 * i;
    }
    this.setDirectLabel(this.timeEnd("directly"));
    this.schedule(
      function () {
        for (var i = 0; i < this.datalist1.length; i++) {
          this.datalist1[i].removeFromParent(true);
        }
        this.datalist1 = [];
      },
      0,
      1,
      0.1
    );
  }
  addSpriteByPool() {
    this.datalist2 = [];
    for (var i = 0; i < 150; i++) {
      var sp = MySprite.create(1, 2, 3);
      this.addChild(sp);
      Pool.getInstance().putInPool(sp);
    }
    this.timeStart("use Pool");
    for (var i = 0; i < 150; i++) {
      var sp = MySprite.reCreate(4, 5, 6);
      this.datalist2.push(sp);
      this.addChild(sp, 100);
      sp.x = 50 + 8 * i;
    }
    this.setPoolLabel(this.timeEnd("use Pool"));
    this.schedule(
      function () {
        for (var i = 0; i < this.datalist2.length; i++) {
          this.datalist2[i].removeFromParent(true);
        }
        this.datalist2 = [];
        Pool.getInstance().drainAllPools();
      },
      0,
      1,
      0.1
    );
  }
  timeStart(name) {
    this.timeList[name] = { startTime: Date.now(), EndTime: 0, DeltaTime: 0 };
  }
  timeEnd(name) {
    var obj = this.timeList[name];
    obj.EndTime = Date.now();
    obj.DeltaTime = obj.EndTime - obj.startTime;
    return obj.DeltaTime;
  }
}
