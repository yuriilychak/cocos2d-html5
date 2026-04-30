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
// DictionaryToFromTest
//
//------------------------------------------------------------------
export class DictionaryToFromTest extends UnitTestBase {

    constructor() {
        super();


        this._title = "Dictionary To/From Test";


        this._subtitle = "Sends and receives a dictionary to JSB";


        this.testDuration = 0.1;

        this.runTest();
    }

    runTest() {
        var frameCache = spriteFrameCache;
        frameCache.addSpriteFrames(s_grossiniPlist);

        // Purge previously loaded animation
        var animCache = animationCache;
        animCache.addAnimations(s_animations2Plist);

        var normal = animCache.getAnimation("dance_1");
        var frame = normal.getFrames()[0];
        var dict = frame.getUserInfo();
        this.log( JSON.stringify(dict) );
        frame.setUserInfo( {
                            "array":[1,2,3,"hello world"],
                            "bool0":0,  // false  XXX
                            "bool1":1,  // true   XXX
                            "dict":{"key1":"value1", "key2":2},
                            "number":42,
                            "string":"hello!"
                        });

        dict = frame.getUserInfo();
        this.log(JSON.stringify(dict));
        return dict;
    }

    //
    // Automation
    //

    getExpectedResult() {
        var ret = this.sortObject( {"array":[1,2,3,"hello world"],"bool0":0,"bool1":1,"dict":{"key1":"value1","key2":2},"number":42,"string":"hello!"} );

        return JSON.stringify(ret);
    }

    getCurrentResult() {
        var ret = this.sortObject( this.runTest() );
        return JSON.stringify(ret);
    }

}
