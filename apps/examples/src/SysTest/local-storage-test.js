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
// LocalStorageTest
//
//------------------------------------------------------------------
import { SysTestBase } from "./sys-test-base.js";

export class LocalStorageTest extends SysTestBase {

    constructor() {
        super();


        this._title = "LocalStorage Test ";


        this._subtitle = "See the console";

        var key = 'key_' + Math.random();
        var ls = cc.sys.localStorage;
        cc.log("- Adding items");
        ls.setItem(key, "Hello world");
        var key1 = "1" + key;
        ls.setItem(key1, "Hello JavaScript");
        var key2 = "2" + key;
        ls.setItem(key2, "Hello Cocos2d-JS");
        var key3 = "3" + key;
        ls.setItem(key3, "Hello Cocos");

        cc.log("- Getting Hello world");
        var r = ls.getItem(key);
        cc.log(r);

        cc.log("- Removing Hello world");
        ls.removeItem(key);

        cc.log("- Getting Hello world");
        r = ls.getItem(key);
        cc.log(r);

        cc.log("- Getting other items");
        cc.log( ls.getItem(key1) );
        cc.log( ls.getItem(key2) );
        cc.log( ls.getItem(key3) );

        cc.log("- Clearing local storage");
        ls.clear();
        cc.log("- Getting other items");
        cc.log( ls.getItem(key1) );
        cc.log( ls.getItem(key2) );
        cc.log( ls.getItem(key3) );
    }


}
