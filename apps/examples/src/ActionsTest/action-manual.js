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

//------------------------------------------------------------------
//
// ActionManual
//
//------------------------------------------------------------------
import { ActionsDemo } from "./actions-demo";
import { winSize } from "../constants";

export class ActionManual extends ActionsDemo {
  constructor() {
    super();
    this.testDuration = 0.1;
    this._code =
      "sprite.x = 10; sprite.y = 20;\n" +
      "sprite.rotation = 90;\n" +
      "sprite.scale = 2;";
  }

  onEnter() {
    //----start0----onEnter
    super.onEnter();

    this._tamara.attr({
      x: 100,
      y: 70,
      opacity: 128,
      scaleX: 2.5,
      scaleY: -1.0
    });

    this._grossini.attr({
      x: winSize.width / 2,
      y: winSize.height / 2,
      rotation: 120,
      color: new cc.Color(255, 0, 0)
    });

    this._kathia.x = winSize.width - 100;
    this._kathia.y = winSize.height / 2;
    this._kathia.color = new cc.Color(0, 0, 255);
    //----end0----
  }

  title() {
    return "Sprite properties";
  }
  subtitle() {
    return "Manual Transformation";
  }

  //
  // Automation
  //
  getExpectedResult() {
    var ret = [
      2.5,
      { x: 100, y: 70 },
      128,
      120,
      { x: winSize.width / 2, y: winSize.height / 2 },
      { r: 255, g: 0, b: 0 },
      { x: winSize.width - 100, y: winSize.height / 2 },
      { r: 0, g: 0, b: 255 }
    ];
    return JSON.stringify(ret);
  }

  getCurrentResult() {
    var ret = [];
    ret.push(this._tamara.scaleX);
    ret.push(new cc.Point(this._tamara.x, this._tamara.y));
    ret.push(this._tamara.opacity);

    ret.push(this._grossini.rotation);
    ret.push(new cc.Point(this._grossini.x, this._grossini.y));
    ret.push(this._grossini.color);

    ret.push(new cc.Point(this._kathia.x, this._kathia.y));
    ret.push(this._kathia.color);

    return JSON.stringify(ret);
  }
}
