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

//------------------------------------------------------------------
//
// PathTestLayer
//
//------------------------------------------------------------------
import { BaseTestLayer } from "../BaseTestLayer/BaseTestLayer";
import { Color, log } from "@aspect/core";

export class PathTestLayer extends BaseTestLayer {
  constructor() {
    super(new Color(0, 0, 0, 255), new Color(98, 99, 117, 255));

    this._title = "path";

    this._subtitle = "See the console please!";

    this._join([
      ["a", "b.png"],
      ["a", "b", "c.png"],
      ["a", "b"],
      ["a", "b", "/"],
      ["a", "b/", "/"]
    ]);

    this._extname([
      "a/b.png",
      "a/b.png?a=1&b=2",
      "a/b",
      "a/b?a=1&b=2",
      ".a/b.png",
      ".a/b.png?a=1&b=2",
      ".a/b",
      ".a/b?a=1&b=2"
    ]);

    this._basename([
      ["a/b.png"],
      ["a/b.png?a=1&b=2"],
      ["a/b.png", ".png"],
      ["a/b.png?a=1&b=2", ".png"],
      ["a/b.png", ".txt"]
    ]);

    this._dirname(["a/b/c.png", "a/b/c.png?a=1&b=2"]);

    this._changeExtname([
      ["a/b.png", ".plist"],
      ["a/b.png?a=1&b=2", ".plist"]
    ]);

    this._changeBasename([
      ["a/b/c.plist", "b.plist"],
      ["a/b/c.plist?a=1&b=2", "b.plist"],
      ["a/b/c.plist", ".png"],
      ["a/b/c.plist", "b"],
      ["a/b/c.plist", "b", true]
    ]);
  }

  _join(args) {
    log("-----------path.join begin----------");
    for (var i = 0, li = args.length; i < li; i++) {
      var obj = args[i];
      log(
        "path.join('" +
          obj.join("','") +
          "') ---> " +
          cc.path.join.apply(cc.path, obj)
      );
    }
    log("-----------path.join end------------");
  }

  _extname(args) {
    log("-----------path.extname begin----------");
    for (var i = 0, li = args.length; i < li; i++) {
      var obj = args[i];
      log("path.extname('" + obj + "') ---> " + cc.path.extname(obj));
    }
    log("-----------path.extname end------------");
  }

  _basename(args) {
    log("-----------path.basename begin----------");
    for (var i = 0, li = args.length; i < li; i++) {
      var obj = args[i];
      log(
        "path.basename('" +
          obj.join("','") +
          "') ---> " +
          cc.path.basename.apply(cc.path, obj)
      );
    }
    log("-----------path.basename end------------");
  }

  _dirname(args) {
    log("-----------path.dirname begin----------");
    for (var i = 0, li = args.length; i < li; i++) {
      var obj = args[i];
      log("path.dirname('" + obj + "') ---> " + cc.path.dirname(obj));
    }
    log("-----------path.dirname end------------");
  }

  _changeExtname(args) {
    log("-----------path.changeExtname begin----------");
    for (var i = 0, li = args.length; i < li; i++) {
      var obj = args[i];
      log(
        "path.changeExtname('" +
          obj.join("','") +
          "') ---> " +
          cc.path.changeExtname.apply(cc.path, obj)
      );
    }
    log("-----------path.changeExtname end------------");
  }

  _changeBasename(args) {
    log("-----------path.changeBasename begin----------");
    for (var i = 0, li = args.length; i < li; i++) {
      var obj = args[i];
      var str =
        obj.length == 3
          ? "'" + obj[0] + "','" + obj[1] + "'," + obj[2]
          : "" + obj.join("','") + "'";
      log(
        "path.changeBasename(" +
          str +
          ") ---> " +
          cc.path.changeBasename.apply(cc.path, obj)
      );
    }
    log("-----------path.changeBasename end------------");
  }
}
